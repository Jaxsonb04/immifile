import type { GenericDocument, PaginationResult } from 'convex/server'
import { v } from 'convex/values'
import { components, internal } from './_generated/api'
import { internalAction, query } from './_generated/server'
import { authComponent } from './auth'
import { getAccountIdentity } from './lib/auth'
import {
	TEMP_ACCOUNT_RETENTION_MS,
	isExpiredTempAccount,
	tempAccountCreatedAtMs,
	type TempAccountUser,
} from './shared/tempAccounts'

/**
 * Deletion deadline for the calling session, or null for credentialed (or
 * unauthenticated) callers. The client uses this for the "your temporary
 * account and its data will be deleted soon" warning (M6-T4).
 */
export const tempAccountStatus = query({
	args: {},
	returns: v.union(v.null(), v.object({ createdAt: v.number(), deleteAt: v.number() })),
	handler: async (ctx) => {
		const account = await getAccountIdentity(ctx)
		if (account === null || !account.isAnonymous) return null
		const user = await authComponent.safeGetAuthUser(ctx)
		if (user === undefined) return null
		const createdAt = tempAccountCreatedAtMs(user)
		if (createdAt === null) return null
		return { createdAt, deleteAt: createdAt + TEMP_ACCOUNT_RETENTION_MS }
	},
})

const PAGE_SIZE = 50

/**
 * Hourly cleanup of expired temp accounts (M6-T4): permanently deletes
 * anonymous Better Auth accounts created more than 48 hours ago that never
 * converted, together with all of their app data.
 *
 * Safety properties (the deletion boundary):
 * - The candidate list only ever contains users the Better Auth store says are
 *   `isAnonymous: true`. Converted accounts are unreachable two ways: linking
 *   deletes the anonymous user record entirely (anonymous-plugin post-link
 *   cleanup), and a credentialed user is never `isAnonymous`.
 * - Every candidate is re-fetched and re-checked against
 *   `isExpiredTempAccount` (strictly >48h AND still anonymous) in the same
 *   action run, immediately before deletion.
 * - App data is purged BEFORE the auth records: if the run dies in between,
 *   the still-existing (empty) account is retried on the next run. If the
 *   user converts while the run is in flight, `onLinkAccount`'s remap and the
 *   purge conflict on the same rows and Convex serializes them — whichever
 *   commits first wins, which is the same outcome as converting just before
 *   vs. just after the deadline.
 */
export const cleanupTempAccounts = internalAction({
	args: {},
	returns: v.object({ deleted: v.number(), skipped: v.number() }),
	handler: async (ctx) => {
		const now = Date.now()
		const siteUrl = (globalThis as { process?: { env?: Record<string, string | undefined> } })
			.process?.env?.CONVEX_SITE_URL
		if (!siteUrl) throw new Error('CONVEX_SITE_URL is not set; cannot derive owner ids')

		// Collect candidate ids first (isAnonymous only — the age check happens
		// in code via the shared predicate so it cannot drift from the tests).
		const candidateIds: string[] = []
		let cursor: string | null = null
		for (;;) {
			const page = (await ctx.runQuery(components.betterAuth.adapter.findMany, {
				model: 'user',
				where: [{ field: 'isAnonymous', value: true, operator: 'eq' }],
				paginationOpts: { numItems: PAGE_SIZE, cursor },
			})) as PaginationResult<GenericDocument>
			for (const doc of page.page) {
				const id = (doc as { _id?: unknown; id?: unknown })._id ?? (doc as { id?: unknown }).id
				if (typeof id === 'string' && isExpiredTempAccount(doc as TempAccountUser, now)) {
					candidateIds.push(id)
				}
			}
			if (page.isDone) break
			cursor = page.continueCursor
		}

		let deleted = 0
		let skipped = 0
		for (const userId of candidateIds) {
			// Re-fetch and re-check right before the destructive step: a user who
			// converted since the scan is no longer anonymous (or no longer exists)
			// and MUST be skipped.
			const fresh = await authComponent.getAnyUserById(ctx, userId)
			if (fresh === null || !isExpiredTempAccount(fresh, now)) {
				skipped += 1
				continue
			}
			const ownerId = `${siteUrl}|${userId}`
			await ctx.runMutation(internal.account.beginOwnerDeletion, {
				ownerId,
				authUserId: userId,
			})
			await ctx.runAction(internal.auth.completeAccountDeletion, {
				ownerId,
				authUserId: userId,
			})
			deleted += 1
		}
		if (deleted > 0 || skipped > 0) {
			console.log(`tempAccounts cleanup: deleted ${deleted}, skipped ${skipped}`)
		}
		return { deleted, skipped }
	},
})
