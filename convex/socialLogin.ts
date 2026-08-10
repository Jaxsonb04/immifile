import { query } from './_generated/server'
import { configuredSocialProviderIds } from './shared/socialProviders'

/**
 * Which social sign-in buttons the app should render.
 *
 * Deliberately public and callable while signed out — the sign-in screen and
 * the anonymous upgrade sheet both need it before any identity exists. It
 * returns provider NAMES only (e.g. ["apple", "google"]); credentials never
 * leave the deployment.
 *
 * See convex/shared/socialProviders.ts for why the client derives this instead
 * of hardcoding a list.
 */
export const availableProviders = query({
	args: {},
	handler: async (): Promise<string[]> => {
		// Convex exposes deployment env vars on `process.env` at runtime, but the
		// convex/ tsconfig ships no Node typings — read through globalThis to stay
		// typed without pulling in @types/node (same approach as convex/auth.ts).
		const env =
			(globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {}
		return configuredSocialProviderIds(env)
	},
})
