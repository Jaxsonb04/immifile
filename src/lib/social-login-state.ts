import type { SocialAuthButtonProvider } from 'heroui-native-pro'

/** Apple leads per Apple's HIG; unknown deployment identifiers are ignored. */
export type SocialProvider = Extract<SocialAuthButtonProvider, 'apple' | 'google'>
const RENDERABLE: readonly SocialProvider[] = ['apple', 'google']

export function resolveSocialProviders(
	configured: readonly string[] | undefined,
	enabled: boolean,
): SocialProvider[] | undefined {
	if (!enabled) return []
	if (configured === undefined) return undefined
	return RENDERABLE.filter((provider) => configured.includes(provider))
}
