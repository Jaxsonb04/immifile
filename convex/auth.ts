import { expo } from '@better-auth/expo'
import { isValidIP, normalizeIP } from '@better-auth/core/utils/ip'
import { createClient, type GenericCtx } from '@convex-dev/better-auth'
import { convex } from '@convex-dev/better-auth/plugins'
import { betterAuth } from 'better-auth/minimal'
import { anonymous } from 'better-auth/plugins'
import type { BetterAuthPlugin } from 'better-auth/types'
import { v } from 'convex/values'
import { components, internal } from './_generated/api'
import { DataModel } from './_generated/dataModel'
import { env as deploymentEnv, internalAction, query } from './_generated/server'
import { purgeOwnerDataInBatches } from './account'
import authConfig from './auth.config'
import { authEmailWebhookConfig, sendPasswordResetEmail } from './shared/authEmail'
import { CONVEX_JWT_EXPIRATION_SECONDS } from './shared/authSecurity'
import { socialProvidersForRelease } from './shared/socialProviders'
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
	[
		'/request-password-reset',
		{ bucket: 'password-recovery-origin', maxRequests: 20, windowMs: 60 * 60 * 1000 },
	],
])

const PUBLIC_AUTH_GET_PATHS = new Set(['/convex/.well-known/openid-configuration', '/convex/jwks'])

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
			const path =
				pathname === basePath
					? '/'
					: pathname.startsWith(`${basePath}/`)
						? pathname.slice(basePath.length)
						: pathname
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
		// Account deletion is a complete server-side operation: app-owned rows and
		// stored files are purged first, then Better Auth removes the user, linked
		// accounts, and sessions. Credentialed clients provide the account password;
		// temporary accounts use the anonymous plugin's dedicated deletion endpoint
		// after explicitly purging their app-owned data.
		user: {
			deleteUser: {
				enabled: true,
				beforeDelete: async (user) => {
					const siteUrl = runtimeEnv.CONVEX_SITE_URL
					if (!siteUrl) throw new Error('CONVEX_SITE_URL is not set; cannot delete account data')
					if (!('runMutation' in ctx)) {
						throw new Error('Account deletion ran outside an action context; data not deleted')
					}
					await purgeOwnerDataInBatches(ctx, `${siteUrl}|${user.id}`)
				},
			},
		},
		socialProviders,
		plugins: [
			originRateLimitPlugin(ctx, authSecret, originProof),
			expo(),
			anonymous({
				// M6-T3 data carryover: when a temporary first-run session
				// creates (or signs into) a permanent account, move every app-owned
				// row to the new owner id BEFORE the plugin deletes the anonymous
				// user. Owner ids are `${CONVEX_SITE_URL}|${betterAuthUserId}` — the
				// same tokenIdentifier convex/lib/auth.ts derives for every write.
				// If carryover fails, fail this hook rather than knowingly continue
				// with app data under the old owner. Better Auth component writes are
				// not assumed to roll back across this boundary; recovery/merge
				// semantics for an existing credential remain a separate decision.
				onLinkAccount: async ({ anonymousUser, newUser }) => {
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
				},
			}),
			convex({
				authConfig,
				jwt: { expirationSeconds: CONVEX_JWT_EXPIRATION_SECONDS },
			}),
		],
	})
}

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
