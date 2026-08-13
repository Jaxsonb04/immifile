import { v } from 'convex/values'
import { internal } from './_generated/api'
import { internalMutation } from './_generated/server'

const CLEANUP_BATCH_SIZE = 500

export type AuthRateLimitDecision =
	{ allowed: true } | { allowed: false; retryAfterSeconds: number }

export const consume = internalMutation({
	args: {
		key: v.string(),
		maxRequests: v.number(),
		now: v.number(),
		windowMs: v.number(),
	},
	returns: v.union(
		v.object({ allowed: v.literal(true) }),
		v.object({
			allowed: v.literal(false),
			retryAfterSeconds: v.number(),
		}),
	),
	handler: async (ctx, args): Promise<AuthRateLimitDecision> => {
		if (!Number.isInteger(args.maxRequests) || args.maxRequests < 1) {
			throw new Error('maxRequests must be a positive integer')
		}
		if (!Number.isFinite(args.windowMs) || args.windowMs < 1000) {
			throw new Error('windowMs must be at least one second')
		}
		const bucket = await ctx.db
			.query('authRateLimits')
			.withIndex('by_key', (q) => q.eq('key', args.key))
			.unique()
		const windowExpiresAt = args.now + args.windowMs

		if (!bucket) {
			await ctx.db.insert('authRateLimits', {
				key: args.key,
				count: 1,
				windowExpiresAt,
			})
			return { allowed: true }
		}

		if (args.now >= bucket.windowExpiresAt) {
			await ctx.db.patch(bucket._id, {
				count: 1,
				windowExpiresAt,
			})
			return { allowed: true }
		}

		if (bucket.count >= args.maxRequests) {
			return {
				allowed: false,
				retryAfterSeconds: Math.max(1, Math.ceil((bucket.windowExpiresAt - args.now) / 1000)),
			}
		}

		await ctx.db.patch(bucket._id, { count: bucket.count + 1 })
		return { allowed: true }
	},
})

export const cleanupExpired = internalMutation({
	args: {},
	returns: v.null(),
	handler: async (ctx): Promise<null> => {
		const expired = await ctx.db
			.query('authRateLimits')
			.withIndex('by_windowExpiresAt', (q) => q.lt('windowExpiresAt', Date.now()))
			.take(CLEANUP_BATCH_SIZE)
		for (const bucket of expired) await ctx.db.delete(bucket._id)
		if (expired.length === CLEANUP_BATCH_SIZE) {
			await ctx.scheduler.runAfter(0, internal.authRateLimit.cleanupExpired, {})
		}
		return null
	},
})
