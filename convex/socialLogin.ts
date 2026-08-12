import { env, query } from './_generated/server'
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
		return configuredSocialProviderIds({
			BETTER_AUTH_URL: env.BETTER_AUTH_URL,
			GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
			GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
			APPLE_CLIENT_ID: env.APPLE_CLIENT_ID,
			APPLE_TEAM_ID: env.APPLE_TEAM_ID,
			APPLE_KEY_ID: env.APPLE_KEY_ID,
			APPLE_PRIVATE_KEY: env.APPLE_PRIVATE_KEY,
		})
	},
})
