import { expo } from '@better-auth/expo'
import { isValidIP, normalizeIP } from '@better-auth/core/utils/ip'
import { createClient, type GenericCtx } from '@convex-dev/better-auth'
import { convex } from '@convex-dev/better-auth/plugins'
import { APIError, createAuthMiddleware, getSessionFromCtx } from 'better-auth/api'
import { betterAuth } from 'better-auth/minimal'
import { anonymous } from 'better-auth/plugins'
import type { BetterAuthPlugin } from 'better-auth/types'
import { v } from 'convex/values'
import { components, internal } from './_generated/api'
import { DataModel } from './_generated/dataModel'
import {
	type ActionCtx,
	action,
	env as deploymentEnv,
	internalAction,
	query,
} from './_generated/server'
import { purgeOwnerDataInBatches } from './account'
import authConfig from './auth.config'
import {
	SOCIAL_DELETION_CHALLENGE_TTL_MS,
	SOCIAL_DELETION_OAUTH_STATE_KEY,
	isAccountDeletionAttemptId,
	isSocialDeletionChallengeIdentifier,
	parseSocialDeletionChallenge,
	serializeSocialDeletionChallenge,
	socialDeletionChallengeAuthorizes,
	socialDeletionChallengeIdentifier,
	timestampMs,
	verifySocialDeletionOAuthAccountUpdate,
	type SocialDeletionChallenge,
} from './shared/accountDeletion'
import { authEmailWebhookConfig, sendPasswordResetEmail } from './shared/authEmail'
import {
	ACCOUNT_DELETION_RECOVERY_DELAY_MS,
	CONVEX_JWT_EXPIRATION_SECONDS,
} from './shared/authSecurity'
import { revokeAppleAuthorization, socialProvidersForRelease } from './shared/socialProviders'
import { trustedAuthOrigins } from './shared/authOrigins'

export const authComponent = createClient<DataModel>(components.betterAuth)

type AuthRateLimitRule = {
	bucket: string
	maxRequests: number
	subject?: string
	windowMs: number
}

const COARSE_ORIGIN_RULES = new Map<string, AuthRateLimitRule>([
	[
		'/sign-in/email',
		{ bucket: 'credential-sign-in-origin', maxRequests: 30, windowMs: 10 * 60 * 1000 },
	],
	['/sign-up/email', { bucket: 'account-create-origin', maxRequests: 5, windowMs: 60 * 60 * 1000 }],
	[
		'/sign-in/anonymous',
		{ bucket: 'anonymous-create-origin', maxRequests: 10, windowMs: 60 * 60 * 1000 },
	],
	[
		'/sign-in/social',
		{ bucket: 'social-sign-in-origin', maxRequests: 15, windowMs: 10 * 60 * 1000 },
	],
	['/link-social', { bucket: 'social-link-origin', maxRequests: 15, windowMs: 10 * 60 * 1000 }],
	[
		'/request-password-reset',
		{ bucket: 'password-recovery-origin', maxRequests: 20, windowMs: 60 * 60 * 1000 },
	],
])

const PUBLIC_AUTH_GET_PATHS = new Set(['/convex/.well-known/openid-configuration', '/convex/jwks'])
const BLOCKED_DIRECT_AUTH_PATHS = new Set([
	'/delete-user',
	'/delete-user/callback',
	'/delete-anonymous-user',
	// No account-management UI ships for these routes. Keeping them public
	// would let a stolen session brute the current password, install a new
	// credential, take over the email, unlink recovery methods, or exfiltrate
	// provider tokens. Server-side auth.api.verifyPassword does not traverse
	// this HTTP plugin and remains available to deleteAccount.
	'/verify-password',
	'/change-password',
	'/set-password',
	'/change-email',
	'/unlink-account',
	'/get-access-token',
	'/refresh-token',
	'/account-info',
	'/list-sessions',
	'/revoke-session',
	'/revoke-sessions',
	'/revoke-other-sessions',
])
const PASSWORD_DELETION_PROOF_RATE_LIMIT: AuthRateLimitRule = {
	bucket: 'account-delete-password',
	maxRequests: 5,
	windowMs: 60 * 1000,
}

type SocialDeletionOAuthMarker = {
	linkUserId: string
	provider: 'apple' | 'google'
	challengeIdentifier?: string
}

// Better Auth's request-state helper is intentionally request-local, but the
// Convex component adapter crosses an async boundary before database hooks run.
// Carry only the validated, non-secret deletion marker on the shared per-request
// AuthContext object. Weak keys prevent one request from leaking into another.
const socialDeletionOAuthMarkers = new WeakMap<object, SocialDeletionOAuthMarker>()

function socialDeletionProviderFromCallback(path: string | undefined, params?: { id?: unknown }) {
	if (path !== '/callback/:id') return null
	if (params?.id === 'apple') return 'apple' as const
	if (params?.id === 'google') return 'google' as const
	return null
}

type OwnerDeletionGateState = {
	authUserId?: string
	completedAt?: number
	appleManualRevokeRequired: boolean
}

async function ownerDeletionGateForAuthUser(
	ctx: GenericCtx<DataModel>,
	runtimeEnv: Record<string, string | undefined>,
	userId: string,
): Promise<{ ownerId: string; state: OwnerDeletionGateState } | null> {
	if (typeof userId !== 'string' || userId.length === 0) return null
	const siteUrl = runtimeEnv.CONVEX_SITE_URL
	if (!siteUrl) throw new Error('CONVEX_SITE_URL is not set; cannot enforce deletion gate')
	if (!('runQuery' in ctx)) return null
	const ownerId = `${siteUrl}|${userId}`
	const state: OwnerDeletionGateState | null = await ctx.runQuery(
		internal.account.getOwnerDeletionState,
		{ ownerId },
	)
	return state !== null && state.authUserId === userId ? { ownerId, state } : null
}

async function recordLateAppleFallback(
	ctx: GenericCtx<DataModel>,
	gate: { ownerId: string; state: OwnerDeletionGateState },
	userId: string,
): Promise<void> {
	if (!('runMutation' in ctx)) {
		throw new Error('Account deletion cleanup ran outside an action context')
	}
	await ctx.runMutation(internal.account.recordOwnerDeletionProgress, {
		ownerId: gate.ownerId,
		authUserId: userId,
		appleManualRevokeRequired: true,
	})
}

async function beginAuthArtifactCleanup(
	ctx: GenericCtx<DataModel>,
	gate: { ownerId: string; state: OwnerDeletionGateState },
	userId: string,
): Promise<number> {
	if (!('runMutation' in ctx)) {
		throw new Error('Account deletion cleanup ran outside an action context')
	}
	return await ctx.runMutation(internal.account.beginOwnerAuthCleanup, {
		ownerId: gate.ownerId,
		authUserId: userId,
	})
}

async function completeAuthArtifactCleanup(
	ctx: GenericCtx<DataModel>,
	gate: { ownerId: string; state: OwnerDeletionGateState },
	userId: string,
	generation: number,
): Promise<void> {
	if (!('runMutation' in ctx)) {
		throw new Error('Account deletion cleanup ran outside an action context')
	}
	await ctx.runMutation(internal.account.completeOwnerAuthCleanup, {
		ownerId: gate.ownerId,
		authUserId: userId,
		generation,
	})
}

function forbiddenAccountOperation(): never {
	throw APIError.from('FORBIDDEN', { message: 'Forbidden', code: 'FORBIDDEN' })
}

function socialDeletionOAuthProofPlugin(
	ctx: GenericCtx<DataModel>,
	runtimeEnv: Record<string, string | undefined>,
): BetterAuthPlugin {
	return {
		id: 'immifile-social-deletion-oauth-proof',
		hooks: {
			before: [
				{
					matcher: (context) => context.path === '/link-social',
					handler: createAuthMiddleware(async (context) => {
						const body = context.body as
							| {
									provider?: unknown
									additionalData?: Record<string, unknown>
									idToken?: unknown
							  }
							| undefined
						const challengeIdentifier = body?.additionalData?.[SOCIAL_DELETION_OAUTH_STATE_KEY]
						if (
							typeof challengeIdentifier !== 'string' ||
							!isSocialDeletionChallengeIdentifier(challengeIdentifier) ||
							(body?.provider !== 'apple' && body?.provider !== 'google') ||
							// Deletion proof is callback-bound. Better Auth's inline id-token
							// path never traverses /callback/:id, so it cannot produce the
							// server marker that rejects a different chooser identity.
							body.idToken !== undefined
						) {
							forbiddenAccountOperation()
						}
						const session = await getSessionFromCtx(context, { disableCookieCache: true })
						if (!session) forbiddenAccountOperation()
						if ((await ownerDeletionGateForAuthUser(ctx, runtimeEnv, session.user.id)) !== null) {
							forbiddenAccountOperation()
						}
						const stored =
							await context.context.internalAdapter.findVerificationValue(challengeIdentifier)
						const challenge =
							stored && typeof stored.value === 'string'
								? parseSocialDeletionChallenge(stored.value)
								: null
						const now = Date.now()
						if (
							challenge === null ||
							challenge.verifiedAt !== undefined ||
							challenge.userId !== session.user.id ||
							challenge.sessionId !== session.session.id ||
							challenge.provider !== body.provider ||
							now < challenge.createdAt ||
							now - challenge.createdAt > SOCIAL_DELETION_CHALLENGE_TTL_MS
						) {
							forbiddenAccountOperation()
						}
						const existingAccounts = await context.context.internalAdapter.findAccounts(
							session.user.id,
						)
						if (
							!existingAccounts.some(
								(account) =>
									account.providerId === challenge.provider &&
									account.accountId === challenge.providerAccountId,
							)
						) {
							forbiddenAccountOperation()
						}
					}),
				},
				{
					matcher: (context) => context.path === '/callback/:id',
					handler: createAuthMiddleware(async (context) => {
						const provider = socialDeletionProviderFromCallback(
							context.path,
							context.params as { id?: unknown } | undefined,
						)
						const state = (context.query as { state?: unknown } | undefined)?.state
						if (provider === null || typeof state !== 'string' || state.length === 0) return
						try {
							// This is Better Auth's server-created OAuth verification row. The
							// callback handler subsequently validates its signed state cookie and
							// consumes the row before any account write can occur.
							const storedOAuthState =
								await context.context.internalAdapter.findVerificationValue(state)
							if (!storedOAuthState || typeof storedOAuthState.value !== 'string') return
							const parsed: unknown = JSON.parse(storedOAuthState.value)
							if (!parsed || typeof parsed !== 'object') return
							const oauthState = parsed as {
								expiresAt?: unknown
								link?: { userId?: unknown } | null
								[SOCIAL_DELETION_OAUTH_STATE_KEY]?: unknown
							}
							const linkUserId = oauthState.link?.userId
							if (
								typeof linkUserId !== 'string' ||
								typeof oauthState.expiresAt !== 'number' ||
								oauthState.expiresAt < Date.now()
							) {
								return
							}
							const marker: SocialDeletionOAuthMarker = { linkUserId, provider }
							const challengeIdentifier = oauthState[SOCIAL_DELETION_OAUTH_STATE_KEY]
							const carriesDeletionState = Object.prototype.hasOwnProperty.call(
								oauthState,
								SOCIAL_DELETION_OAUTH_STATE_KEY,
							)
							if (!carriesDeletionState) {
								socialDeletionOAuthMarkers.set(context.context, marker)
								return
							}
							// Mark deletion state before looking up its separately expiring
							// challenge. A signed OAuth state can outlive a consumed/cleaned
							// challenge; it must remain unable to create a linked account.
							socialDeletionOAuthMarkers.set(context.context, {
								...marker,
								challengeIdentifier:
									typeof challengeIdentifier === 'string' ? challengeIdentifier : '',
							})
							if (
								typeof challengeIdentifier !== 'string' ||
								!isSocialDeletionChallengeIdentifier(challengeIdentifier)
							) {
								return
							}
							const storedChallenge =
								await context.context.internalAdapter.findVerificationValue(challengeIdentifier)
							const challenge =
								storedChallenge && typeof storedChallenge.value === 'string'
									? parseSocialDeletionChallenge(storedChallenge.value)
									: null
							if (
								challenge === null ||
								challenge.userId !== linkUserId ||
								challenge.provider !== provider
							) {
								return
							}
							socialDeletionOAuthMarkers.set(context.context, {
								...marker,
								challengeIdentifier,
							})
						} catch {
							// The callback handler performs the authoritative OAuth-state
							// validation. Missing/malformed state simply cannot produce deletion
							// proof and never needs sensitive details logged here.
						}
					}),
				},
			],
		},
	}
}

async function normalizedEmailFrom(request: Request) {
	try {
		const mediaType = request.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase()
		let email: unknown
		if (mediaType === 'application/json') {
			const body: unknown = await request.clone().json()
			if (!body || typeof body !== 'object' || !('email' in body)) return null
			email = (body as { email?: unknown }).email
		} else if (mediaType === 'application/x-www-form-urlencoded') {
			const values = new URLSearchParams(await request.clone().text()).getAll('email')
			email = values.at(-1)
		} else {
			return null
		}
		if (typeof email !== 'string') return null
		const normalized = email.trim().toLowerCase()
		return normalized.length > 0 && normalized.length <= 320 ? normalized : null
	} catch {
		return null
	}
}

async function rateLimitRulesFor(path: string, request: Request): Promise<AuthRateLimitRule[]> {
	const coarse = COARSE_ORIGIN_RULES.get(path)
	if (!coarse) return []
	if (path !== '/sign-in/email' && path !== '/request-password-reset') return [coarse]

	const email = await normalizedEmailFrom(request)
	if (!email) return [coarse]
	return [
		coarse,
		path === '/sign-in/email'
			? { bucket: 'credential-sign-in-email', maxRequests: 5, subject: email, windowMs: 60 * 1000 }
			: {
					bucket: 'password-recovery-email',
					maxRequests: 3,
					subject: email,
					windowMs: 15 * 60 * 1000,
				},
	]
}

function normalizedClientIp(value: string | null) {
	const candidate = value?.trim()
	if (!candidate || !isValidIP(candidate)) return null
	return normalizeIP(candidate, { ipv6Subnet: 64 })
}

function tooManyRequests(retryAfterSeconds: number) {
	return new Response(JSON.stringify({ message: 'Too many requests. Please try again later.' }), {
		status: 429,
		statusText: 'Too Many Requests',
		headers: {
			'content-type': 'application/json',
			'retry-after': retryAfterSeconds.toString(),
			'x-retry-after': retryAfterSeconds.toString(),
		},
	})
}

function forbidden() {
	return new Response(JSON.stringify({ message: 'Forbidden' }), {
		status: 403,
		headers: { 'content-type': 'application/json' },
	})
}

function notFound() {
	return new Response(JSON.stringify({ message: 'Not found' }), {
		status: 404,
		headers: { 'content-type': 'application/json' },
	})
}

function hasExactOriginProof(request: Request, expected: string) {
	const actual = request.headers.get('x-immifile-origin-proof')
	if (actual === null || actual.length !== expected.length) return false
	let mismatch = 0
	for (let index = 0; index < expected.length; index += 1) {
		mismatch |= actual.charCodeAt(index) ^ expected.charCodeAt(index)
	}
	return mismatch === 0
}

async function digestRateLimitKey(secret: string, client: string, rule: AuthRateLimitRule) {
	const key = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign'],
	)
	const digest = await crypto.subtle.sign(
		'HMAC',
		key,
		new TextEncoder().encode(
			rule.subject
				? `subject\u0000${rule.bucket}\u0000${rule.subject}`
				: `origin\u0000${rule.bucket}\u0000${client}`,
		),
	)
	return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function originRateLimitPlugin(
	ctx: GenericCtx<DataModel>,
	secret: string,
	originProof: string | undefined,
): BetterAuthPlugin {
	return {
		id: 'immifile-origin-rate-limit',
		onRequest: async (request, authContext) => {
			// Rollout is deliberately opt-in: deploy code and proxy injection first,
			// then set AUTH_ORIGIN_PROOF. Once configured, protected Better Auth routes
			// reject requests that did not traverse the trusted proxy. OpenID discovery
			// and JWKS remain public by protocol, on exact GET paths only.
			const basePath = (authContext.options.basePath ?? '/api/auth').replace(/\/+$/, '')
			const pathname = new URL(request.url).pathname
			const rawPath =
				pathname === basePath
					? '/'
					: pathname.startsWith(`${basePath}/`)
						? pathname.slice(basePath.length)
						: pathname
			const path = rawPath.length > 1 ? rawPath.replace(/\/+$/, '') : rawPath
			// Stock deletion and unshipped sensitive account-management routes stay
			// unreachable even if a future option or plugin enables them. The app-owned
			// actions/UI above are the only reviewed entry points for those operations.
			if (BLOCKED_DIRECT_AUTH_PATHS.has(path)) return { response: notFound() }
			const isPublicAuthGet = request.method === 'GET' && PUBLIC_AUTH_GET_PATHS.has(path)
			const originProofAccepted =
				originProof !== undefined && hasExactOriginProof(request, originProof)
			if (originProof !== undefined && !originProofAccepted && !isPublicAuthGet) {
				return { response: forbidden() }
			}
			if (request.method !== 'POST') return
			const candidateRules = await rateLimitRulesFor(path, request)
			// Until origin proof is enabled, preserve existing traffic and enforce only
			// IP-independent credential/recovery limits. Forwarding metadata becomes a
			// trustworthy client signal only after the Vercel-injected proof is accepted.
			const rules = originProofAccepted
				? candidateRules
				: candidateRules.filter((rule) => rule.subject !== undefined)
			if (rules.length === 0 || !('meta' in ctx) || !('runMutation' in ctx)) return

			// Convex reports the first X-Forwarded-For hop. The accepted proxy proof
			// establishes that Vercel supplied this value; direct callers are rejected.
			// IPv4-mapped values collapse to IPv4 and IPv6 values collapse to /64.
			// Strict credential/recovery buckets intentionally exclude every IP source.
			const requiresClient = rules.some((rule) => rule.subject === undefined)
			const client = requiresClient
				? (normalizedClientIp((await ctx.meta.getRequestMetadata()).ip) ?? 'unknown-client')
				: 'subject-only'
			const now = Date.now()
			for (const rule of rules) {
				const decision = await ctx.runMutation(internal.authRateLimit.consume, {
					key: await digestRateLimitKey(secret, client, rule),
					maxRequests: rule.maxRequests,
					now,
					windowMs: rule.windowMs,
				})
				if (!decision.allowed) return { response: tooManyRequests(decision.retryAfterSeconds) }
			}
		},
	}
}

export const createAuth = (ctx: GenericCtx<DataModel>) => {
	// Convex exposes deployment env vars on `process.env` at runtime, but the
	// convex/ tsconfig ships no Node typings — read through globalThis to stay
	// typed without pulling in @types/node.
	const runtimeEnv =
		(globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {}
	const socialProviders = socialProvidersForRelease({
		BETTER_AUTH_URL: deploymentEnv.BETTER_AUTH_URL,
		GOOGLE_CLIENT_ID: deploymentEnv.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: deploymentEnv.GOOGLE_CLIENT_SECRET,
		APPLE_CLIENT_ID: deploymentEnv.APPLE_CLIENT_ID,
		APPLE_TEAM_ID: deploymentEnv.APPLE_TEAM_ID,
		APPLE_KEY_ID: deploymentEnv.APPLE_KEY_ID,
		APPLE_PRIVATE_KEY: deploymentEnv.APPLE_PRIVATE_KEY,
	})
	const authEmail = authEmailWebhookConfig(runtimeEnv)
	// createAuth({}) is also called without a runtime context while routes are
	// registered. Better Auth itself rejects a missing production secret before
	// serving a request; this sentinel only lets static registration complete.
	const authSecret = runtimeEnv.BETTER_AUTH_SECRET ?? 'static-route-registration-only'
	const originProof = deploymentEnv.AUTH_ORIGIN_PROOF || undefined

	return betterAuth({
		// Expo Go's dynamic exp:// origin is honored only where a deployment
		// explicitly opted in (dev); see trustedAuthOrigins for why production
		// must never trust that client-controlled header.
		trustedOrigins: (request) =>
			trustedAuthOrigins(request, deploymentEnv.AUTH_TRUST_EXPO_DEV_ORIGINS === 'true'),
		database: authComponent.adapter(ctx),
		// Better Auth 1.6 initializes its limiter in minimal mode, but the current
		// Convex adapter has no native atomic incrementOne and its forwarded-IP input
		// is caller-influenceable on the direct origin. The plugin above first verifies
		// the Vercel proxy, then uses Convex's normalized client metadata for generous
		// coarse caps, IP-independent HMAC account buckets for strict credential
		// limits, and an app-owned transactional mutation. Disable the built-in path
		// to avoid a second, per-isolate or shared-proxy bucket causing lockouts.
		rateLimit: { enabled: false },
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: false,
			resetPasswordTokenExpiresIn: 60 * 60,
			revokeSessionsOnPasswordReset: true,
			...(authEmail
				? {
						sendResetPassword: async ({ user, url }: { user: { email: string }; url: string }) => {
							await sendPasswordResetEmail(authEmail, {
								to: user.email,
								resetUrl: url,
							})
						},
					}
				: {}),
		},
		account: {
			accountLinking: {
				// Apple returns the real relay email only on first authorization;
				// repeat/managed-account tokens can omit email/email_verified, so our
				// stable placeholder differs and Better Auth would classify Apple as
				// untrusted. Apple ID tokens are issuer/signature checked by the provider.
				// Explicit linking is deletion-challenge-only: session/user/provider/
				// account id are pinned, account creation and inline id tokens are
				// rejected, and user info is not updated on link. Ordinary same-email
				// OAuth sign-in is never allowed to link implicitly.
				trustedProviders: ['apple'],
				disableImplicitLinking: true,
				allowDifferentEmails: true,
				updateUserInfoOnLink: false,
			},
		},
		// Better Auth's authenticated linkSocial callback carries signed state that
		// pins the original user. Mark a deletion challenge only when that callback
		// refreshes the exact provider account recorded before the browser opened.
		// A refresh-token call has no OAuth link state, and choosing a different
		// provider account updates/creates a different account id, so neither can
		// manufacture step-up proof.
		databaseHooks: {
			account: {
				create: {
					before: async (account, context) => {
						if (context === null) return
						if ((await ownerDeletionGateForAuthUser(ctx, runtimeEnv, account.userId)) !== null) {
							return false
						}
						const marker = socialDeletionOAuthMarkers.get(context.context)
						if (marker?.challengeIdentifier === undefined) return
						// A deletion challenge is issued only for an exact provider account
						// that already exists. If the chooser returns a different identity,
						// Better Auth would otherwise create a second linked account on the
						// victim user before the proof fails. Reject every create carrying
						// this signed deletion state; the correct account takes update path.
						return false
					},
					after: async (account, context) => {
						if (context === null || account === null) return
						const gate = await ownerDeletionGateForAuthUser(ctx, runtimeEnv, account.userId)
						if (gate === null) return
						const cleanupGeneration = await beginAuthArtifactCleanup(ctx, gate, account.userId)
						let revocationError: unknown
						if (account.providerId === 'apple') {
							try {
								const manualRequired = await revokeAllAppleAccounts([account])
								if (manualRequired) await recordLateAppleFallback(ctx, gate, account.userId)
							} catch (error) {
								// The auth row may be concurrently cascaded after this hook saw it.
								// Persist an actionable fallback before propagating the failure so
								// cleanup never depends on recovering the token from that row.
								await recordLateAppleFallback(ctx, gate, account.userId)
								revocationError = error
							}
						}
						await context.context.internalAdapter.deleteAccount(account.id)
						await completeAuthArtifactCleanup(ctx, gate, account.userId, cleanupGeneration)
						if (revocationError !== undefined) throw revocationError
					},
				},
				update: {
					before: async (account, context) => {
						if (context === null) return
						const marker = socialDeletionOAuthMarkers.get(context.context)
						const userId = typeof account.userId === 'string' ? account.userId : marker?.linkUserId
						if (userId && (await ownerDeletionGateForAuthUser(ctx, runtimeEnv, userId)) !== null) {
							return false
						}
					},
					after: async (account, context) => {
						if (context === null || account === null) return
						const gate = await ownerDeletionGateForAuthUser(ctx, runtimeEnv, account.userId)
						if (gate !== null) {
							const cleanupGeneration = await beginAuthArtifactCleanup(ctx, gate, account.userId)
							let revocationError: unknown
							if (account.providerId === 'apple') {
								try {
									const manualRequired = await revokeAllAppleAccounts([account])
									if (manualRequired) await recordLateAppleFallback(ctx, gate, account.userId)
								} catch (error) {
									await recordLateAppleFallback(ctx, gate, account.userId)
									revocationError = error
								}
							}
							await context.context.internalAdapter.deleteAccount(account.id)
							await completeAuthArtifactCleanup(ctx, gate, account.userId, cleanupGeneration)
							if (revocationError !== undefined) throw revocationError
							return
						}
						try {
							const marker = socialDeletionOAuthMarkers.get(context.context)
							if (marker === undefined) return
							const { challengeIdentifier } = marker
							if (
								challengeIdentifier === undefined ||
								!isSocialDeletionChallengeIdentifier(challengeIdentifier)
							) {
								return
							}
							const stored =
								await context.context.internalAdapter.findVerificationValue(challengeIdentifier)
							if (!stored || typeof stored.value !== 'string') return
							const challenge = parseSocialDeletionChallenge(stored.value)
							if (challenge === null) return
							const verified = verifySocialDeletionOAuthAccountUpdate(
								challenge,
								{ link: { userId: marker.linkUserId } },
								account,
								Date.now(),
							)
							if (verified === null) return
							await context.context.internalAdapter.updateVerificationByIdentifier(
								challengeIdentifier,
								{ value: serializeSocialDeletionChallenge(verified) },
							)
						} catch (error) {
							// The deletion action consumes only a marked record, so a hook
							// failure is fail-closed. Keep provider tokens and auth state out
							// of logs.
							console.error('Could not record social account-deletion proof', {
								message: error instanceof Error ? error.message : 'unknown error',
							})
						}
					},
				},
			},
			session: {
				create: {
					before: async (session) => {
						if ((await ownerDeletionGateForAuthUser(ctx, runtimeEnv, session.userId)) !== null) {
							return false
						}
					},
					after: async (session, context) => {
						if (context === null || session === null) return
						const gate = await ownerDeletionGateForAuthUser(ctx, runtimeEnv, session.userId)
						if (gate !== null) {
							const cleanupGeneration = await beginAuthArtifactCleanup(ctx, gate, session.userId)
							// Close the cross-store race where this create passed `before`
							// immediately before the main deletion gate committed.
							await context.context.internalAdapter.deleteSession(session.token)
							await completeAuthArtifactCleanup(ctx, gate, session.userId, cleanupGeneration)
						}
					},
				},
			},
		},
		socialProviders,
		plugins: [
			originRateLimitPlugin(ctx, authSecret, originProof),
			socialDeletionOAuthProofPlugin(ctx, runtimeEnv),
			expo(),
			anonymous({
				disableDeleteAnonymousUser: true,
				// M6-T3 data carryover: when a temporary first-run session
				// creates (or signs into) a permanent account, move every app-owned
				// row to the new owner id BEFORE the plugin deletes the anonymous
				// user. Owner ids are `${CONVEX_SITE_URL}|${betterAuthUserId}` — the
				// same tokenIdentifier convex/lib/auth.ts derives for every write.
				// If carryover fails, fail this hook rather than knowingly continue
				// with app data under the old owner. Better Auth component writes are
				// not assumed to roll back across this boundary; recovery/merge
				// semantics for an existing credential remain a separate decision.
				onLinkAccount: async ({ anonymousUser, newUser, ctx: authRequestContext }) => {
					const siteUrl = runtimeEnv.CONVEX_SITE_URL
					if (!siteUrl) throw new Error('CONVEX_SITE_URL is not set; cannot carry data over')
					const fromId = anonymousUser.user.id
					const toId = newUser.user.id
					if (!fromId || !toId || fromId === toId) return
					if (!('runMutation' in ctx)) {
						throw new Error('Account linking ran outside an action context; data not moved')
					}
					await ctx.runMutation(internal.account.reassignAccountData, {
						fromOwnerId: `${siteUrl}|${fromId}`,
						toOwnerId: `${siteUrl}|${toId}`,
					})
					// disableDeleteAnonymousUser closes the public plugin endpoint and
					// also disables Better Auth's built-in post-link cleanup. Reproduce
					// that cleanup here only after the app-data move succeeds, so the
					// defense-in-depth setting cannot leave a live anonymous auth row.
					await authRequestContext.context.internalAdapter.deleteUserSessions(fromId)
					await authRequestContext.context.internalAdapter.deleteUser(fromId)
				},
			}),
			convex({
				authConfig,
				jwt: { expirationSeconds: CONVEX_JWT_EXPIRATION_SECONDS },
			}),
		],
	})
}

const socialDeletionProvider = v.union(v.literal('apple'), v.literal('google'))
const accountDeletionProof = v.union(
	v.object({ kind: v.literal('anonymous') }),
	v.object({ kind: v.literal('password'), password: v.string() }),
	v.object({ kind: v.literal('social'), challenge: v.string() }),
)

async function currentDeletionIdentity(ctx: ActionCtx) {
	const identity = await ctx.auth.getUserIdentity()
	if (identity === null) throw new Error('Not authenticated')
	const sessionId = identity.sessionId
	if (typeof sessionId !== 'string' || sessionId.length === 0) {
		throw new Error('The current session could not be verified')
	}
	const subject = identity.subject
	if (typeof subject !== 'string' || subject.length === 0) throw new Error('Not authenticated')
	const user = await authComponent.safeGetAuthUser(ctx)
	if (user === undefined || String(user._id) !== subject) throw new Error('Not authenticated')
	// @convex-dev/better-auth 0.12.5 validates that the session exists and that
	// the subject user exists, but does not assert the session row belongs to that
	// same user. Bind all three explicitly before any step-up, rate limit, receipt,
	// purge, or provider work so a malformed/forged JWT cannot mix identities.
	const session = (await ctx.runQuery(components.betterAuth.adapter.findOne, {
		model: 'session',
		where: [{ field: '_id', value: sessionId }],
	})) as { userId?: unknown } | null
	if (session === null || String(session.userId) !== subject) {
		throw new Error('Not authenticated')
	}
	return {
		identity,
		user,
		userId: user._id,
		sessionId,
		isAnonymous: user.isAnonymous === true,
	}
}

type StoredProviderAccount = {
	providerId: string
	refreshToken?: string | null
	accessToken?: string | null
}

async function revokeAllAppleAccounts(accounts: StoredProviderAccount[]) {
	let appleManualRevokeRequired = false
	for (const appleAccount of accounts.filter((account) => account.providerId === 'apple')) {
		const revocation = await revokeAppleAuthorization(
			{
				APPLE_CLIENT_ID: deploymentEnv.APPLE_CLIENT_ID,
				APPLE_TEAM_ID: deploymentEnv.APPLE_TEAM_ID,
				APPLE_KEY_ID: deploymentEnv.APPLE_KEY_ID,
				APPLE_PRIVATE_KEY: deploymentEnv.APPLE_PRIVATE_KEY,
			},
			{
				refreshToken: appleAccount.refreshToken,
				accessToken: appleAccount.accessToken,
			},
		)
		appleManualRevokeRequired ||= revocation === 'manual-required'
	}
	return appleManualRevokeRequired
}

async function deleteVerificationRowsMatchingValue(
	ctx: ActionCtx,
	operator: 'contains' | 'eq',
	value: string,
): Promise<void> {
	let cursor: string | null = null
	for (;;) {
		const page: {
			isDone: boolean
			continueCursor: string
			pageStatus?: string
			splitCursor?: string | null
		} = await ctx.runMutation(components.betterAuth.adapter.deleteMany, {
			input: {
				model: 'verification',
				where: [{ field: 'value', operator, value }],
			},
			paginationOpts: { numItems: 200, cursor },
		})
		if (page.isDone) return
		cursor =
			page.pageStatus === 'SplitRecommended' || page.pageStatus === 'SplitRequired'
				? (page.splitCursor ?? page.continueCursor)
				: page.continueCursor
	}
}

async function deleteAccountDeletionVerificationRows(
	ctx: ActionCtx,
	authUserId: string,
): Promise<void> {
	// Better Auth password reset rows store the bare user id as their value.
	await deleteVerificationRowsMatchingValue(ctx, 'eq', authUserId)
	// Immifile challenges and Better Auth link OAuth state use compact JSON.
	// Match the full encoded key/value fragment, never the bare id, so unrelated
	// JSON verification values are untouched.
	await deleteVerificationRowsMatchingValue(
		ctx,
		'contains',
		`"userId":${JSON.stringify(authUserId)}`,
	)
}

/**
 * Idempotent destructive half of account deletion. The public action installs
 * the durable owner gate only after step-up, then calls this internal action.
 * A scheduled recovery calls the same primitive after crashes or transient
 * failures; completed tombstones are never finalized until the auth user is
 * authoritatively absent.
 */
export const completeAccountDeletion = internalAction({
	args: { ownerId: v.string(), authUserId: v.string() },
	returns: v.object({ appleManualRevokeRequired: v.boolean() }),
	handler: async (ctx, args): Promise<{ appleManualRevokeRequired: boolean }> => {
		const state: {
			authUserId?: string
			completedAt?: number
			expiresAt: number
			appleManualRevokeRequired: boolean
		} | null = await ctx.runQuery(internal.account.getOwnerDeletionState, {
			ownerId: args.ownerId,
		})
		if (state === null || state.authUserId !== args.authUserId) {
			throw new Error('Account deletion gate could not be verified')
		}
		const cleanupGeneration: number = await ctx.runMutation(
			internal.account.beginOwnerAuthCleanup,
			args,
		)
		const existingUser = await authComponent.getAnyUserById(ctx, args.authUserId)
		const { auth } = await authComponent.getAuth(createAuth, ctx)
		const authContext = await auth.$context
		let appleManualRevokeRequired = state.appleManualRevokeRequired
		if (state.completedAt === undefined && existingUser !== null) {
			const firstAccounts = await authContext.internalAdapter.findAccounts(args.authUserId)
			const firstManualRevokeRequired = await revokeAllAppleAccounts(firstAccounts)
			appleManualRevokeRequired ||= firstManualRevokeRequired
			await ctx.runMutation(internal.account.recordOwnerDeletionProgress, {
				...args,
				appleManualRevokeRequired,
			})
		}

		// This is intentionally repeated for an already-absent auth user and for
		// completed recovery sweeps. Every phase is idempotent, and the repetition
		// closes process-crash windows that could otherwise leave app rows behind.
		await purgeOwnerDataInBatches(ctx, args.ownerId)

		// Snapshot again at the final boundary, including when the user row is
		// already absent: late callbacks can leave orphan account rows in the
		// Better Auth component, and Apple tokens in those rows still need cleanup.
		const finalAccounts = await authContext.internalAdapter.findAccounts(args.authUserId)
		const finalManualRevokeRequired = await revokeAllAppleAccounts(
			finalAccounts as StoredProviderAccount[],
		)
		appleManualRevokeRequired ||= finalManualRevokeRequired
		await ctx.runMutation(internal.account.recordOwnerDeletionProgress, {
			...args,
			appleManualRevokeRequired,
		})
		await authContext.internalAdapter.deleteUser(args.authUserId)
		if ((await authComponent.getAnyUserById(ctx, args.authUserId)) !== null) {
			throw new Error('Auth account deletion did not complete')
		}
		await deleteAccountDeletionVerificationRows(ctx, args.authUserId)
		await ctx.runMutation(internal.account.completeOwnerAuthCleanup, {
			...args,
			generation: cleanupGeneration,
		})

		if (state.completedAt === undefined) {
			return await ctx.runMutation(internal.account.completeOwnerDeletion, {
				...args,
				appleManualRevokeRequired,
			})
		}
		if (Date.now() >= state.expiresAt) {
			await ctx.runMutation(internal.account.clearOwnerDeletionTombstone, {
				ownerId: args.ownerId,
			})
		}
		const latest: { appleManualRevokeRequired: boolean } | null = await ctx.runQuery(
			internal.account.getOwnerDeletionState,
			{ ownerId: args.ownerId },
		)
		return {
			appleManualRevokeRequired: latest?.appleManualRevokeRequired ?? appleManualRevokeRequired,
		}
	},
})

/** One durable scheduled chain; it checkpoints its successor before work. */
export const recoverAccountDeletion = internalAction({
	args: { ownerId: v.string(), authUserId: v.string() },
	returns: v.null(),
	handler: async (ctx, args): Promise<null> => {
		const state: { completedAt?: number } | null = await ctx.runQuery(
			internal.account.getOwnerDeletionState,
			{ ownerId: args.ownerId },
		)
		if (state === null) return null
		// Schedule first, in its own mutation transaction. If this action is killed
		// mid-purge (and never reaches a catch/finally), a successor still exists.
		await ctx.scheduler.runAfter(
			ACCOUNT_DELETION_RECOVERY_DELAY_MS,
			internal.auth.recoverAccountDeletion,
			args,
		)
		try {
			await ctx.runAction(internal.auth.completeAccountDeletion, args)
		} catch {
			// Keep the opaque gate. The successor was durably checkpointed above.
		}
		return null
	},
})

/**
 * Start a short-lived, session-bound social deletion challenge before opening
 * the provider browser. The OAuth callback, not the client, is responsible for
 * marking it verified after the exact linked account is refreshed.
 */
export const beginSocialAccountDeletion = action({
	args: { provider: socialDeletionProvider },
	returns: v.object({ challenge: v.string(), userId: v.string() }),
	handler: async (ctx, args) => {
		const current = await currentDeletionIdentity(ctx)
		if (current.isAnonymous) {
			throw new Error('Temporary accounts do not have a social sign-in method')
		}
		const { auth } = await authComponent.getAuth(createAuth, ctx)
		const authContext = await auth.$context
		const accounts = await authContext.internalAdapter.findAccounts(current.userId)
		const providerAccount = accounts.find((account) => account.providerId === args.provider)
		if (!providerAccount) throw new Error('That sign-in method is not linked to this account')
		const providerAccountUpdatedAt = timestampMs(providerAccount.updatedAt)
		if (providerAccountUpdatedAt === null) {
			throw new Error('That sign-in method could not be verified')
		}

		const challengeIdentifier = await socialDeletionChallengeIdentifier(
			current.userId,
			current.sessionId,
			args.provider,
		)
		const now = Date.now()
		const challenge: SocialDeletionChallenge = {
			version: 1,
			userId: current.userId,
			ownerId: current.identity.tokenIdentifier,
			sessionId: current.sessionId,
			provider: args.provider,
			providerAccountId: providerAccount.accountId,
			providerAccountUpdatedAt,
			createdAt: now,
		}
		// Replace, rather than append, so a compromised session cannot create an
		// unbounded verification-row backlog by repeatedly starting the flow.
		await authContext.internalAdapter.deleteVerificationByIdentifier(challengeIdentifier)
		await authContext.internalAdapter.createVerificationValue({
			identifier: challengeIdentifier,
			value: serializeSocialDeletionChallenge(challenge),
			expiresAt: new Date(now + SOCIAL_DELETION_CHALLENGE_TTL_MS),
		})
		return { challenge: challengeIdentifier, userId: current.userId }
	},
})

/**
 * The sole interactive account-deletion primitive. It revalidates the Better
 * Auth session, enforces the appropriate server-side step-up proof, revokes
 * Apple authorization when possible, installs the app write tombstone and
 * purges all owned data, then cascades the Better Auth identity/sessions.
 */
export const deleteAccount = action({
	args: { attemptId: v.string(), proof: accountDeletionProof },
	returns: v.object({ appleManualRevokeRequired: v.boolean() }),
	handler: async (ctx, args): Promise<{ appleManualRevokeRequired: boolean }> => {
		if (!isAccountDeletionAttemptId(args.attemptId)) {
			throw new Error('The deletion request could not be verified')
		}
		const current = await currentDeletionIdentity(ctx)
		const { auth, headers } = await authComponent.getAuth(createAuth, ctx)
		const authContext = await auth.$context
		let socialChallenge: SocialDeletionChallenge | null = null

		if (args.proof.kind === 'anonymous') {
			if (!current.isAnonymous) {
				throw new Error('Deleting a permanent account requires sign-in confirmation')
			}
		} else if (args.proof.kind === 'password') {
			if (current.isAnonymous) throw new Error('Temporary accounts do not have a password')
			const runtimeEnv =
				(globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ??
				{}
			const authSecret = runtimeEnv.BETTER_AUTH_SECRET
			if (!authSecret) throw new Error('Account confirmation is temporarily unavailable')
			const rule = {
				...PASSWORD_DELETION_PROOF_RATE_LIMIT,
				// Both dimensions are server-derived. A fresh session gets its own
				// small budget, while the user id prevents cross-account collisions.
				subject: `${current.userId}\u0000${current.sessionId}`,
			}
			const now = Date.now()
			const decision = await ctx.runMutation(internal.authRateLimit.consume, {
				key: await digestRateLimitKey(authSecret, 'subject-only', rule),
				maxRequests: rule.maxRequests,
				now,
				windowMs: rule.windowMs,
			})
			if (!decision.allowed) {
				throw new Error('Account confirmation failed. Please wait and try again')
			}
			if (args.proof.password.length === 0 || args.proof.password.length > 1024) {
				throw new Error('Account confirmation failed. Please try again')
			}
			try {
				await auth.api.verifyPassword({
					body: { password: args.proof.password },
					headers,
				})
			} catch {
				// Do not reveal whether this user has a credential account, whether
				// its hash is valid, or how Better Auth classified the failure.
				throw new Error('Account confirmation failed. Please try again')
			}
		} else {
			if (current.isAnonymous) {
				throw new Error('Temporary accounts do not have a social sign-in method')
			}
			if (!isSocialDeletionChallengeIdentifier(args.proof.challenge)) {
				throw new Error('Sign-in confirmation expired. Please try again')
			}
			const stored = await authContext.internalAdapter.consumeVerificationValue(
				args.proof.challenge,
			)
			socialChallenge =
				stored && typeof stored.value === 'string'
					? parseSocialDeletionChallenge(stored.value)
					: null
			if (
				socialChallenge === null ||
				!socialDeletionChallengeAuthorizes(
					socialChallenge,
					{
						userId: current.userId,
						ownerId: current.identity.tokenIdentifier,
						sessionId: current.sessionId,
					},
					Date.now(),
				)
			) {
				throw new Error('Sign-in confirmation was not completed. Please try again')
			}
		}

		if (socialChallenge !== null) {
			const accounts = await authContext.internalAdapter.findAccounts(current.userId)
			if (
				!accounts.some(
					(account) =>
						account.providerId === socialChallenge.provider &&
						account.accountId === socialChallenge.providerAccountId,
				)
			) {
				throw new Error('Sign-in confirmation was not completed. Please try again')
			}
		}

		// Install the durable cross-store gate before the completion action takes
		// its first provider-account snapshot. This same transaction schedules a
		// recovery chain, so a process crash cannot reopen app writes later.
		await ctx.runMutation(internal.account.beginOwnerDeletion, {
			ownerId: current.identity.tokenIdentifier,
			authUserId: current.userId,
			attemptId: args.attemptId,
		})
		return await ctx.runAction(internal.auth.completeAccountDeletion, {
			ownerId: current.identity.tokenIdentifier,
			authUserId: current.userId,
		})
	},
})

/**
 * Capability-scoped reconciliation for a lost deletion response. No owner or
 * auth identifier is accepted or returned; an unguessable UUID created for the
 * destructive press is the only lookup key.
 */
export const getAccountDeletionStatus = query({
	args: { attemptId: v.string() },
	returns: v.union(
		v.object({ status: v.literal('missing') }),
		v.object({
			status: v.literal('pending'),
			appleManualRevokeRequired: v.boolean(),
		}),
		v.object({
			status: v.literal('completed'),
			appleManualRevokeRequired: v.boolean(),
		}),
	),
	handler: async (ctx, args) => {
		if (!isAccountDeletionAttemptId(args.attemptId)) return { status: 'missing' as const }
		const receipt = await ctx.db
			.query('accountDeletionAttempts')
			.withIndex('by_attemptId', (q) => q.eq('attemptId', args.attemptId))
			.unique()
		if (receipt === null) return { status: 'missing' as const }
		const tombstone = await ctx.db
			.query('accountDeletionTombstones')
			.withIndex('by_ownerId', (q) => q.eq('ownerId', receipt.ownerId))
			.unique()
		if (tombstone === null) return { status: 'missing' as const }
		return {
			status: tombstone.completedAt === undefined ? ('pending' as const) : ('completed' as const),
			appleManualRevokeRequired: tombstone.appleManualRevokeRequired === true,
		}
	},
})

export const getCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		return authComponent.getAuthUser(ctx)
	},
})

/**
 * Non-throwing identity probe for the anonymous → permanent account handoff.
 * The client waits for this server view to match its Better Auth session before
 * auto-resuming a sensitive action, so the resumed mutation uses the new owner.
 */
export const getAccountStatus = query({
	args: {},
	returns: v.union(
		v.null(),
		v.object({
			userId: v.string(),
			isAnonymous: v.boolean(),
		}),
	),
	handler: async (ctx) => {
		const user = await authComponent.safeGetAuthUser(ctx)
		if (user === undefined) return null
		const rawUser = user as { _id?: unknown; id?: unknown; isAnonymous?: unknown }
		const userId = rawUser._id ?? rawUser.id
		if (typeof userId !== 'string') return null
		return { userId, isAnonymous: rawUser.isAnonymous === true }
	},
})

/**
 * One-shot repair: deletes the stored JWKS and regenerates it under the
 * deployment's current `BETTER_AUTH_SECRET`. Needed after the secret changes
 * (or a deployment is restored/cloned), because the existing signing key is
 * encrypted with the old secret — every `/convex/token` request then fails
 * with "Failed to decrypt private key" and no session ever authenticates.
 * Run once via `npx convex run auth:rotateKeys`.
 */
export const rotateKeys = internalAction({
	args: {},
	handler: async (ctx) => {
		const auth = createAuth(ctx)
		return await auth.api.rotateKeys()
	},
})
