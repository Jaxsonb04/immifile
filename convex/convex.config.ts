import { defineApp } from 'convex/server'
import { v } from 'convex/values'
import betterAuth from '@convex-dev/better-auth/convex.config'

const app = defineApp({
	env: {
		// Better Auth social OAuth configuration. Apple uses durable signing
		// inputs and creates its expiring client-secret JWT at runtime.
		BETTER_AUTH_URL: v.optional(v.string()),
		AUTH_TRUST_EXPO_DEV_ORIGINS: v.optional(v.string()),
		GOOGLE_CLIENT_ID: v.optional(v.string()),
		GOOGLE_CLIENT_SECRET: v.optional(v.string()),
		APPLE_CLIENT_ID: v.optional(v.string()),
		APPLE_TEAM_ID: v.optional(v.string()),
		APPLE_KEY_ID: v.optional(v.string()),
		APPLE_PRIVATE_KEY: v.optional(v.string()),
		// Gates the walkthrough-phase demo seed (convex/dev/seed.ts).
		DEV_SEED_ENABLED: v.optional(v.string()),
		// Anthropic Messages API for the Claude assistant (convex/assistant.ts).
		// Deployment secrets only — never exposed to the client. Set with
		// `npx convex env set OPENAI_API_KEY <key>`; OPENAI_MODEL falls back to
		// DEFAULT_ASSISTANT_MODEL (convex/shared/assistantModel.ts) when unset.
		OPENAI_API_KEY: v.optional(v.string()),
		OPENAI_MODEL: v.optional(v.string()),
		// Comma-separated, case-insensitive moderator email allowlist (M4-T3,
		// convex/lib/moderation.ts). Set with
		// `npx convex env set MODERATOR_EMAILS "mod@immifile.test"`.
		MODERATOR_EMAILS: v.optional(v.string()),
	},
})
app.use(betterAuth)

export default app
