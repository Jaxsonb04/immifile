import { describe, expect, test } from 'vitest'
import { configuredSocialProviderIds, socialProvidersForRelease } from './socialProviders'

const GOOGLE = { GOOGLE_CLIENT_ID: 'google-id', GOOGLE_CLIENT_SECRET: 'google-secret' }
const APPLE = { APPLE_CLIENT_ID: 'apple-id', APPLE_CLIENT_SECRET: 'apple-secret' }

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

	test('Apple carries an explicit callback so the browser flow can complete', () => {
		const providers = socialProvidersForRelease(APPLE)
		expect(providers.apple).toMatchObject({
			clientId: 'apple-id',
			clientSecret: 'apple-secret',
			redirectURI: 'https://auth.immifile.app/api/auth/callback/apple',
			appBundleIdentifier: 'dev.uing.immigrationrenewalhelp',
		})
	})

	test('a partial credential pair does not activate a provider', () => {
		expect(socialProvidersForRelease({ GOOGLE_CLIENT_ID: 'google-id' })).toEqual({})
		expect(socialProvidersForRelease({ APPLE_CLIENT_SECRET: 'apple-secret' })).toEqual({})
	})

	// A hardcoded production callback bounces a dev sign-in to production, where
	// the OAuth state does not match and the flow dies confusingly.
	test('the callback follows the deployment its own auth origin', () => {
		const providers = socialProvidersForRelease({
			...GOOGLE,
			...APPLE,
			BETTER_AUTH_URL: 'https://wandering-jaguar-543.convex.site',
		})
		expect(providers.google).toMatchObject({
			redirectURI: 'https://wandering-jaguar-543.convex.site/api/auth/callback/google',
		})
		expect(providers.apple).toMatchObject({
			redirectURI: 'https://wandering-jaguar-543.convex.site/api/auth/callback/apple',
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
