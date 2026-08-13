import { getAuthConfigProvider } from '@convex-dev/better-auth/auth-config'
import type { AuthConfig } from 'convex/server'

const provider = getAuthConfigProvider()
const authOrigin = process.env.BETTER_AUTH_URL?.replace(/\/+$/, '')

export default {
	providers: [
		authOrigin
			? {
					...provider,
					// Fetch public signing keys through the branded proxy for consistent
					// routing and observability. The exact direct JWKS GET remains public
					// for protocol compatibility; the token issuer stays CONVEX_SITE_URL.
					jwks: `${authOrigin}/api/auth/convex/jwks`,
				}
			: provider,
	],
} satisfies AuthConfig
