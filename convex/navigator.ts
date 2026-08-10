'use node'

import { v } from 'convex/values'
import { action, env } from './_generated/server'
import { internal } from './_generated/api'
import type { AssistantUsage } from './assistantQuota'
import {
	type AssistantRecommendation,
	navigatorFactsShape,
	recommend,
} from './shared/navigator'
import { assertFeatureEnabled } from './lib/releaseGate'
import { createChatCompletion, type OpenAIChatMessage } from './lib/openaiChat'
import { DEFAULT_ASSISTANT_MODEL } from './shared/assistantModel'
import { EXTRACTION_SYSTEM, FACTS_FORMAT } from './shared/navigatorPrompt'

// M1-T2: the safe navigator's model call (ported Anthropic → OpenAI
// 2026-08-08). It extracts ONLY the four NavigatorFacts fields via strict
// structured output, validates them at the boundary (Zod), then runs the
// deterministic classifier (convex/shared/navigator.ts). The model never
// decides eligibility or picks a form. Secrets stay server-side and the daily
// quota is shared with the chat assistant (M1-T1).

const MAX_MESSAGE_CHARS = 4000
const MAX_HISTORY_TURNS = 40
// GPT-5-family models spend part of this budget on hidden reasoning tokens
// (pinned to minimal in the transport); 512 leaves the ~80-token JSON payload
// comfortable headroom where the old Anthropic call used 256.
const MAX_OUTPUT_TOKENS = 512

// Safe fallback when the model output can't be validated: treat every field as
// undisclosed, which the classifier resolves to needsClarification — never
// `supported`.
const UNKNOWN_FACTS = {
	credential: 'unclear',
	situation: 'unclear',
	wantsEligibilityOrOutcomeJudgment: false,
	mentionsUnsupportedMatter: false,
} as const

type RecommendResult = { recommendation: AssistantRecommendation; usage: AssistantUsage }

export const getRecommendation = action({
	args: {
		message: v.string(),
		history: v.optional(
			v.array(
				v.object({
					role: v.union(v.literal('user'), v.literal('assistant')),
					content: v.string(),
				}),
			),
		),
	},
	handler: async (ctx, args): Promise<RecommendResult> => {
		assertFeatureEnabled('assistant')
		const message = args.message.trim()
		if (message.length === 0) {
			throw new Error('Message cannot be empty')
		}
		if (message.length > MAX_MESSAGE_CHARS) {
			throw new Error('Message is too long')
		}
		const history = args.history ?? []
		if (history.length > MAX_HISTORY_TURNS) {
			throw new Error('Conversation is too long')
		}
		if (history.some((turn) => turn.content.length > MAX_MESSAGE_CHARS)) {
			throw new Error('A previous message is too long')
		}

		const apiKey = env.OPENAI_API_KEY
		if (!apiKey) {
			throw new Error('The assistant is not configured')
		}
		const model = env.OPENAI_MODEL ?? DEFAULT_ASSISTANT_MODEL

		// A billed OpenAI call; count it against the shared daily quota. Only a
		// pre-billing failure refunds (see M1-T1 assistant.ts for the rationale).
		const usage = await ctx.runMutation(internal.assistantQuota.reserveDailyMessage, {})

		let response: { content: string; refused: boolean }
		try {
			const messages: OpenAIChatMessage[] = [...history, { role: 'user', content: message }]
			response = await createChatCompletion({
				apiKey,
				model,
				system: EXTRACTION_SYSTEM,
				messages,
				maxCompletionTokens: MAX_OUTPUT_TOKENS,
				responseFormat: FACTS_FORMAT,
			})
		} catch (error) {
			// The call never produced a (billed) response — refund and surface a
			// generic error without leaking OpenAI internals. Log the underlying
			// cause server-side only (never returned to the client).
			console.error('[navigator] OpenAI extraction failed:', error)
			await ctx.runMutation(internal.assistantQuota.refundDailyMessage, {})
			throw new Error('The assistant is temporarily unavailable. Please try again.')
		}

		// The call was billed, so the message counts. Parse defensively: malformed
		// or off-schema output (including a refusal, which carries no JSON) falls
		// back to "undisclosed" facts, which the classifier resolves to
		// needsClarification — never `supported`.
		let rawFacts: unknown = null
		try {
			rawFacts = JSON.parse(response.content)
		} catch {
			rawFacts = null
		}
		const parsed = navigatorFactsShape.safeParse(rawFacts)
		const facts = parsed.success ? parsed.data : UNKNOWN_FACTS
		return { recommendation: recommend(message, facts), usage }
	},
})
