import { decodeJwt, decodeProtectedHeader } from 'jose'
import { describe, expect, test } from 'vitest'
import { configuredSocialProviderIds, socialProvidersForRelease } from './socialProviders'

const GOOGLE = { GOOGLE_CLIENT_ID: 'google-id', GOOGLE_CLIENT_SECRET: 'google-secret' }
const APPLE = {
	APPLE_CLIENT_ID: 'apple-service-id',
	APPLE_TEAM_ID: 'TEAM123456',
	APPLE_KEY_ID: 'KEY1234567',
	APPLE_PRIVATE_KEY: `-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgqBBjJ3mK5s60aOqj
iTej7m2+7X09tow94qcBONE+vgmhRANCAATTeVa11K2gVIXiAxRbluPtKYW0JaWk
vEYvm1oCiwnmQTxNE2NKIS/zHMS1blV2W7kiNyyUCW6CMF/CzTWTgvzv
-----END PRIVATE KEY-----`,
}

async function appleProvider(environment = APPLE) {
	const configured = socialProvidersForRelease(environment).apple
	expect(configured).toBeTypeOf('function')
	if (typeof configured !== 'function') throw new Error('Apple provider is not configured lazily')
	return await configured()
}

describe('release authentication providers', () => {
	test('Google activates when the deployment carries its OAuth credentials', () => {
		expect(socialProvidersForRelease(GOOGLE)).toEqual({
			google: {
				clientId: 'google-id',
				clientSecret: 'google-secret',
				redirectURI: 'https://auth.immifile.app/api/auth/callback/google',
			},
		})
	})

	test('Apple generates a fresh client-secret JWT and explicit browser callback', async () => {
		const provider = await appleProvider()
		expect(provider).toMatchObject({
			clientId: 'apple-service-id',
			redirectURI: 'https://auth.immifile.app/api/auth/callback/apple',
			appBundleIdentifier: 'dev.uing.immigrationrenewalhelp',
		})

		const clientSecret = provider.clientSecret
		expect(clientSecret).toBeTypeOf('string')
		if (!clientSecret) throw new Error('Apple client secret was not generated')
		const header = decodeProtectedHeader(clientSecret)
		const claims = decodeJwt(clientSecret)
		expect(header).toMatchObject({ alg: 'ES256', kid: 'KEY1234567' })
		expect(claims).toMatchObject({
			iss: 'TEAM123456',
			sub: 'apple-service-id',
			aud: 'https://appleid.apple.com',
		})
		expect(claims.exp! - claims.iat!).toBe(180 * 24 * 60 * 60)
	})

	test('Apple supplies a stable placeholder when repeat sign-in omits email', async () => {
		const provider = await appleProvider()
		const mapProfileToUser = provider.mapProfileToUser
		expect(mapProfileToUser).toBeTypeOf('function')
		if (!mapProfileToUser) throw new Error('Apple profile mapper is not configured')
		type AppleProfile = Parameters<typeof mapProfileToUser>[0]

		expect(await mapProfileToUser({ sub: 'stable-apple-sub' } as AppleProfile)).toEqual({
			email: 'stable-apple-sub@apple.placeholder.invalid',
		})
		expect(
			await mapProfileToUser({
				sub: 'stable-apple-sub',
				email: 'person@example.com',
			} as AppleProfile),
		).toEqual({ email: 'person@example.com' })
	})

	test('partial credentials do not activate a provider', () => {
		expect(socialProvidersForRelease({ GOOGLE_CLIENT_ID: 'google-id' })).toEqual({})
		expect(
			socialProvidersForRelease({
				APPLE_CLIENT_ID: APPLE.APPLE_CLIENT_ID,
				APPLE_TEAM_ID: APPLE.APPLE_TEAM_ID,
				APPLE_KEY_ID: APPLE.APPLE_KEY_ID,
			}),
		).toEqual({})
	})

	// A hardcoded production callback bounces a dev sign-in to production, where
	// the OAuth state does not match and the flow dies confusingly.
	test('the callback follows the deployment its own auth origin', async () => {
		const providers = socialProvidersForRelease({
			...GOOGLE,
			...APPLE,
			BETTER_AUTH_URL: 'https://auth-dev.immifile.app',
		})
		expect(providers.google).toMatchObject({
			redirectURI: 'https://auth-dev.immifile.app/api/auth/callback/google',
		})
		const apple = providers.apple
		if (typeof apple !== 'function') throw new Error('Apple provider is not configured lazily')
		expect(await apple()).toMatchObject({
			redirectURI: 'https://auth-dev.immifile.app/api/auth/callback/apple',
		})
	})

	test('a trailing slash on the auth origin does not double up in the callback', () => {
		const providers = socialProvidersForRelease({
			...GOOGLE,
			BETTER_AUTH_URL: 'https://auth.immifile.app/',
		})
		expect(providers.google).toMatchObject({
			redirectURI: 'https://auth.immifile.app/api/auth/callback/google',
		})
	})
})

// The client renders its buttons from this list, so anything it reports must be
// a provider a user can actually finish signing in with — see
// convex/socialLogin.ts.
describe('provider ids advertised to the client', () => {
	test('reports only the providers whose credentials are present', () => {
		expect(configuredSocialProviderIds({})).toEqual([])
		expect(configuredSocialProviderIds(GOOGLE)).toEqual(['google'])
		expect(configuredSocialProviderIds({ ...GOOGLE, ...APPLE })).toEqual(['apple', 'google'])
	})

	test('never leaks credential values, only provider names', () => {
		const ids = configuredSocialProviderIds({ ...GOOGLE, ...APPLE })
		expect(ids.join(' ')).not.toMatch(/secret|id-/)
		expect(ids).toEqual(ids.filter((id) => /^[a-z]+$/.test(id)))
	})
})
