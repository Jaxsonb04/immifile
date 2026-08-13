/// <reference types="vite/client" />
import { convexTest } from 'convex-test'
import { describe, expect, test } from 'vitest'
import { internal } from './_generated/api'
import schema from './schema'

const modules = import.meta.glob('./**/*.ts')

function newT() {
	return convexTest(schema, modules)
}

describe('origin auth rate limit', () => {
	test('blocks at the budget and resets exactly when the window expires', async () => {
		const t = newT()
		const consume = (now: number) =>
			t.mutation(internal.authRateLimit.consume, {
				key: 'window-test',
				maxRequests: 2,
				now,
				windowMs: 1_000,
			})

		expect(await consume(1_000)).toEqual({ allowed: true })
		expect(await consume(1_100)).toEqual({ allowed: true })
		expect(await consume(1_999)).toEqual({ allowed: false, retryAfterSeconds: 1 })
		expect(await consume(2_000)).toEqual({ allowed: true })
	})

	test('admits no more than the configured budget under a concurrent burst', async () => {
		const t = newT()
		const decisions = await Promise.all(
			Array.from({ length: 12 }, () =>
				t.mutation(internal.authRateLimit.consume, {
					key: 'concurrency-test',
					maxRequests: 3,
					now: 1_000,
					windowMs: 60_000,
				}),
			),
		)

		expect(decisions.filter((decision) => decision.allowed)).toHaveLength(3)
		expect(decisions.filter((decision) => !decision.allowed)).toHaveLength(9)
	})

	test('cleanup removes expired buckets and preserves active buckets', async () => {
		const t = newT()
		const now = Date.now()
		const [expiredId, activeId] = await t.run(async (ctx) => {
			return await Promise.all([
				ctx.db.insert('authRateLimits', {
					key: 'expired',
					count: 1,
					windowExpiresAt: now - 1,
				}),
				ctx.db.insert('authRateLimits', {
					key: 'active',
					count: 1,
					windowExpiresAt: now + 60_000,
				}),
			])
		})

		await t.mutation(internal.authRateLimit.cleanupExpired, {})
		await t.run(async (ctx) => {
			expect(await ctx.db.get(expiredId)).toBeNull()
			expect(await ctx.db.get(activeId)).not.toBeNull()
		})
	})
})
