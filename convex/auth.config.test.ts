import { afterEach, describe, expect, test, vi } from 'vitest'

const SITE_URL = 'https://configured.convex.site'

afterEach(() => {
	vi.unstubAllEnvs()
	vi.resetModules()
})

describe('Convex auth provider', () => {
	test('keeps the issuer stable while fetching JWKS through the branded proxy', async () => {
		vi.stubEnv('CONVEX_SITE_URL', SITE_URL)
		vi.stubEnv('BETTER_AUTH_URL', 'https://auth.immifile.app/')
		vi.resetModules()

		const { default: config } = await import('./auth.config')
		expect(config.providers[0]).toMatchObject({
			issuer: SITE_URL,
			jwks: 'https://auth.immifile.app/api/auth/convex/jwks',
		})
	})

	test('falls back to the direct JWKS route before a branded origin is configured', async () => {
		vi.stubEnv('CONVEX_SITE_URL', SITE_URL)
		vi.stubEnv('BETTER_AUTH_URL', '')
		vi.resetModules()

		const { default: config } = await import('./auth.config')
		expect(config.providers[0]).toMatchObject({
			issuer: SITE_URL,
			jwks: `${SITE_URL}/api/auth/convex/jwks`,
		})
	})
})
