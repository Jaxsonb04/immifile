import { api } from '@convex/_generated/api'
import { useQuery } from 'convex/react'
import type { SocialAuthButtonProvider } from 'heroui-native-pro'

import { RELEASE_FEATURES } from './release-policy'

/** The social providers this app knows how to render a button for. Apple leads
 * so Sign in with Apple sits above the alternatives, per Apple's HIG. */
export type SocialProvider = Extract<SocialAuthButtonProvider, 'apple' | 'google'>
const RENDERABLE: SocialProvider[] = ['apple', 'google']

function isRenderable(id: string): id is SocialProvider {
	return (RENDERABLE as string[]).includes(id)
}

/**
 * The social sign-in buttons to show, as reported by the deployment itself.
 *
 * Returns an empty list while the query is in flight, when the release policy
 * closes social login, or when no provider has credentials — so a button only
 * ever appears if pressing it can actually complete a sign-in. See
 * convex/shared/socialProviders.ts for why this is derived rather than
 * hardcoded.
 */
export function useSocialProviders(): SocialProvider[] {
	const configured = useQuery(api.socialLogin.availableProviders, RELEASE_FEATURES.socialLogin ? {} : 'skip')
	if (!configured) return []
	// Order by RENDERABLE, not by the server's ordering, so button order is a
	// deliberate UI decision rather than a side effect of env-var naming.
	return RENDERABLE.filter((provider) => configured.filter(isRenderable).includes(provider))
}
