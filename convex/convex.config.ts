import { defineApp } from "convex/server";
import { v } from "convex/values";
import betterAuth from "@convex-dev/better-auth/convex.config";

const app = defineApp({
	env: {
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
});
app.use(betterAuth);

export default app;
