import type { BetterAuthOptions } from 'better-auth/minimal'
import releasePolicy from '../../release-policy.json'

type AuthEnvironment = Record<string, string | undefined>

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
			redirectURI: 'https://auth.immifile.app/api/auth/callback/google',
		}
	}
	if (env.APPLE_CLIENT_ID && env.APPLE_CLIENT_SECRET) {
		providers.apple = {
			clientId: env.APPLE_CLIENT_ID,
			clientSecret: env.APPLE_CLIENT_SECRET,
			// The browser flow needs an explicit callback, exactly like Google;
			// `appBundleIdentifier` only covers native id-token verification, so
			// without this Apple sign-in fails at the redirect.
			redirectURI: 'https://auth.immifile.app/api/auth/callback/apple',
			appBundleIdentifier: 'dev.uing.immigrationrenewalhelp',
		}
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
