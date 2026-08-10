import { describe, expect, test } from 'vitest'
import { socialProvidersForRelease } from './socialProviders'

describe('release authentication providers', () => {
	test('Google activates when the deployment carries its OAuth credentials', () => {
		expect(
			socialProvidersForRelease({
				GOOGLE_CLIENT_ID: 'google-id',
				GOOGLE_CLIENT_SECRET: 'google-secret',
			}),
		).toEqual({
			google: {
				clientId: 'google-id',
				clientSecret: 'google-secret',
				redirectURI: 'https://auth.immifile.app/api/auth/callback/google',
			},
		})
	})

	test('Apple activates alongside Google when its credentials are present', () => {
		const providers = socialProvidersForRelease({
			GOOGLE_CLIENT_ID: 'google-id',
			GOOGLE_CLIENT_SECRET: 'google-secret',
			APPLE_CLIENT_ID: 'apple-id',
			APPLE_CLIENT_SECRET: 'apple-secret',
		})
		expect(Object.keys(providers).sort()).toEqual(['apple', 'google'])
	})

	test('a deployment without credentials exposes no social providers', () => {
		expect(socialProvidersForRelease({})).toEqual({})
	})

	test('a partial credential pair does not activate a provider', () => {
		expect(socialProvidersForRelease({ GOOGLE_CLIENT_ID: 'google-id' })).toEqual({})
	})
})
