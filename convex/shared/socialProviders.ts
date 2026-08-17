import type { BetterAuthOptions } from 'better-auth/minimal'
import { importPKCS8, SignJWT } from 'jose'
import releasePolicy from '../../release-policy.json'

type AuthEnvironment = Record<string, string | undefined>

const FALLBACK_AUTH_ORIGIN = 'https://auth.immifile.app'
const APP_BUNDLE_IDENTIFIER = 'dev.uing.immigrationrenewalhelp'
const APPLE_CLIENT_SECRET_TTL_SECONDS = 180 * 24 * 60 * 60

type AppleCredentials = {
	clientId: string
	teamId: string
	keyId: string
	privateKey: string
}

export type AppleAuthorizationTokens = {
	refreshToken?: string | null
	accessToken?: string | null
}

export type AppleAuthorizationRevocationResult = 'revoked' | 'manual-required'

/**
 * Apple uses a signed JWT as its OAuth client secret. Build it when Better
 * Auth resolves the provider so each auth instance gets a fresh 180-day token
 * rather than a static deployment secret that silently expires in six months.
 */
async function generateAppleClientSecret(credentials: AppleCredentials): Promise<string> {
	const signingKey = await importPKCS8(credentials.privateKey, 'ES256')
	const now = Math.floor(Date.now() / 1000)

	return await new SignJWT({})
		.setProtectedHeader({ alg: 'ES256', kid: credentials.keyId })
		.setIssuer(credentials.teamId)
		.setSubject(credentials.clientId)
		.setAudience('https://appleid.apple.com')
		.setIssuedAt(now)
		.setExpirationTime(now + APPLE_CLIENT_SECRET_TTL_SECONDS)
		.sign(signingKey)
}

function appleCredentials(env: AuthEnvironment): AppleCredentials | null {
	if (!env.APPLE_CLIENT_ID || !env.APPLE_TEAM_ID || !env.APPLE_KEY_ID || !env.APPLE_PRIVATE_KEY) {
		return null
	}
	return {
		clientId: env.APPLE_CLIENT_ID,
		teamId: env.APPLE_TEAM_ID,
		keyId: env.APPLE_KEY_ID,
		privateKey: env.APPLE_PRIVATE_KEY,
	}
}

/**
 * Revoke Sign in with Apple before removing the local Better Auth account.
 * Apple accepts either token and recommends the durable refresh token. When an
 * old account has neither, deletion must still proceed and the UI must direct
 * the user to revoke Immifile manually from their Apple account settings.
 */
export async function revokeAppleAuthorization(
	env: AuthEnvironment,
	tokens: AppleAuthorizationTokens,
	fetcher: typeof fetch = fetch,
): Promise<AppleAuthorizationRevocationResult> {
	const refreshToken = tokens.refreshToken?.trim()
	const accessToken = tokens.accessToken?.trim()
	const token = refreshToken || accessToken
	if (!token) return 'manual-required'

	const credentials = appleCredentials(env)
	if (credentials === null) {
		throw new Error('Apple account deletion is temporarily unavailable')
	}

	const body = new URLSearchParams({
		client_id: credentials.clientId,
		client_secret: await generateAppleClientSecret(credentials),
		token,
		token_type_hint: refreshToken ? 'refresh_token' : 'access_token',
	})
	const response = await fetcher('https://appleid.apple.com/auth/revoke', {
		method: 'POST',
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		body,
	})
	if (response.status !== 200) {
		throw new Error('Apple authorization could not be revoked')
	}
	return 'revoked'
}

/**
 * Where the provider sends the user back after consent.
 *
 * Derived from this deployment's own auth origin rather than hardcoded:
 * production answers on auth.immifile.app but dev answers on its
 * auth-dev.immifile.app proxy, and a hardcoded production callback silently bounces a dev
 * sign-in to production, where the state does not match. Both URLs have to be
 * registered with the provider — consoles accept a list.
 */
function callbackUrl(env: AuthEnvironment, provider: 'google' | 'apple'): string {
	const origin = (env.BETTER_AUTH_URL || FALLBACK_AUTH_ORIGIN).replace(/\/+$/, '')
	return `${origin}/api/auth/callback/${provider}`
}

/**
 * Social providers are server-gated by the same machine-readable policy as
 * the client. Credentials left in a deployment cannot silently re-enable an
 * unreviewed login method.
 */
export function socialProvidersForRelease(
	env: AuthEnvironment,
): NonNullable<BetterAuthOptions['socialProviders']> {
	const providers: NonNullable<BetterAuthOptions['socialProviders']> = {}
	if (!releasePolicy.socialLogin) return providers

	if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
		providers.google = {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			redirectURI: callbackUrl(env, 'google'),
		}
	}
	const credentials = appleCredentials(env)
	if (credentials !== null) {
		providers.apple = async () => ({
			clientId: credentials.clientId,
			clientSecret: await generateAppleClientSecret(credentials),
			// The browser flow needs an explicit callback, exactly like Google;
			// `appBundleIdentifier` only covers native id-token verification, so
			// without this Apple sign-in fails at the redirect.
			redirectURI: callbackUrl(env, 'apple'),
			appBundleIdentifier: APP_BUNDLE_IDENTIFIER,
			// Apple sends email only on the first authorization. Better Auth still
			// requires an email-shaped value on repeat sign-ins before it can find
			// the existing provider account, so use Apple's stable subject as a
			// non-deliverable fallback. The real first-login email remains stored
			// because provider profile updates are not enabled.
			mapProfileToUser: (profile) => ({
				email: profile.email ?? `${profile.sub}@apple.placeholder.invalid`,
			}),
		})
	}
	return providers
}

/**
 * The provider ids a deployment can actually complete a sign-in with — the
 * release policy allows it AND its credentials are present.
 *
 * The client renders its buttons from this list (convex/socialLogin.ts) rather
 * than a hardcoded one. A hardcoded list silently drifts from deployment
 * config, and the failure is user-visible: a button that opens a browser only
 * to fail with "Provider not found". Deriving it means a provider appears the
 * moment its credentials are set and disappears if they are removed, with no
 * app update.
 *
 * Returns only provider NAMES. Never widen this to include credential values.
 */
export function configuredSocialProviderIds(env: AuthEnvironment): string[] {
	return Object.keys(socialProvidersForRelease(env)).sort()
}
