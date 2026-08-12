import { v } from 'convex/values'
import { internalMutation, query } from './_generated/server'
import { requireOwnerId } from './lib/auth'
import { assertFeatureEnabled } from './lib/releaseGate'

// Per-owner daily message quota for the Claude assistant (MASTER_PLAN
// "Interfaces": Convex stores only per-owner daily usage counters with a
// 20-message limit; chat transcripts stay device-session-only). One row per
// (ownerId, day); the day key is UTC — a deliberate v1 simplification, local
// time windows can come later. Owner is always server-derived (lib/auth.ts),
// never accepted from the client.

export const DAILY_MESSAGE_LIMIT = 20

function utcDay(now: number): string {
	return new Date(now).toISOString().slice(0, 10)
}

export type AssistantUsage = { used: number; limit: number; remaining: number }

/**
 * Reserve one message against the caller's daily quota. Authorization is
 * enforced here (never trusting a client-supplied owner), so the "use node"
 * action can delegate both auth and rate-limiting to this one mutation.
 * Throws when the daily limit is already reached.
 */
export const reserveDailyMessage = internalMutation({
	args: {},
	handler: async (ctx): Promise<AssistantUsage> => {
		const ownerId = await requireOwnerId(ctx)
		const day = utcDay(Date.now())
		const existing = await ctx.db
			.query('assistantUsage')
			.withIndex('by_ownerId_and_day', (q) => q.eq('ownerId', ownerId).eq('day', day))
			.unique()
		const used = existing?.count ?? 0
		if (used >= DAILY_MESSAGE_LIMIT) {
			throw new Error("You've reached today's message limit. Please try again tomorrow.")
		}
		const next = used + 1
		if (existing === null) {
			await ctx.db.insert('assistantUsage', { ownerId, day, count: next, updatedAt: Date.now() })
		} else {
			await ctx.db.patch('assistantUsage', existing._id, { count: next, updatedAt: Date.now() })
		}
		return { used: next, limit: DAILY_MESSAGE_LIMIT, remaining: DAILY_MESSAGE_LIMIT - next }
	},
})

/**
 * Return one reserved message to the caller's daily quota — used when the
 * downstream Anthropic call fails or is refused, so a failed turn doesn't burn
 * a message. Best-effort: reserve and refund are separate transactions.
 */
export const refundDailyMessage = internalMutation({
	args: {},
	handler: async (ctx): Promise<null> => {
		const ownerId = await requireOwnerId(ctx)
		const day = utcDay(Date.now())
		const existing = await ctx.db
			.query('assistantUsage')
			.withIndex('by_ownerId_and_day', (q) => q.eq('ownerId', ownerId).eq('day', day))
			.unique()
		if (existing !== null && existing.count > 0) {
			await ctx.db.patch('assistantUsage', existing._id, {
				count: existing.count - 1,
				updatedAt: Date.now(),
			})
		}
		return null
	},
})

/** The caller's current daily assistant usage, for the chat UI's remaining-count. */
export const dailyUsage = query({
	// The client UTC day is a cache key: changing it at midnight forces a fresh
	// subscription even when yesterday's usage row receives no further writes.
	// The server still derives the authoritative day from its own clock below.
	args: { day: v.optional(v.string()) },
	handler: async (ctx): Promise<AssistantUsage> => {
		assertFeatureEnabled('assistant')
		const ownerId = await requireOwnerId(ctx)
		const day = utcDay(Date.now())
		const existing = await ctx.db
			.query('assistantUsage')
			.withIndex('by_ownerId_and_day', (q) => q.eq('ownerId', ownerId).eq('day', day))
			.unique()
		const used = existing?.count ?? 0
		return { used, limit: DAILY_MESSAGE_LIMIT, remaining: Math.max(0, DAILY_MESSAGE_LIMIT - used) }
	},
})
