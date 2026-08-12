import { api } from '@convex/_generated/api'
import { useQuery } from 'convex/react'

import { RELEASE_FEATURES } from './release-policy'
import { resolveSocialProviders, type SocialProvider } from './social-login-state'

export type { SocialProvider } from './social-login-state'

/**
 * The social sign-in buttons to show, as reported by the deployment itself.
 *
 * Returns undefined while the query is in flight so auth forms can withhold
 * moving tap targets until provider discovery settles. An empty list means the
 * release policy is closed or no provider has credentials. See
 * convex/shared/socialProviders.ts for why this is derived rather than hardcoded.
 */
export function useSocialProviders(): SocialProvider[] | undefined {
	const configured = useQuery(api.socialLogin.availableProviders, RELEASE_FEATURES.socialLogin ? {} : 'skip')
	return resolveSocialProviders(configured, RELEASE_FEATURES.socialLogin)
}
