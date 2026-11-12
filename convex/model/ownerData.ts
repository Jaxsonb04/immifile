import type { MutationCtx } from '../_generated/server'
import { targetKeyFor } from '../shared/community'

// The account-deletion contract (docs/internal/REARCHITECTURE.md): removing an owner wipes
// every app-owned row AND every stored file. No financial records survive in
// Convex. The walkthrough seed's reset path reuses this same cascade so the
// two can never drift apart.

const DELETE_BATCH = 100
const SAFE_DELETE_BATCH = 25

/** Every non-global schema table that can retain one account's data. Tests
 * compare this inventory with schema.ts so adding a table fails closed until
 * its deletion behavior is reviewed. */
export const OWNER_DATA_TABLES = [
	'applicants',
	'applications',
	'applicationDrafts',
	'applicationDocuments',
	'documents',
	'cases',
	'entitlements',
	'assistantUsage',
	'ownerPreferences',
	'renewalEntries',
	'communityProfiles',
	'forumPosts',
	'forumComments',
	'communityBlocks',
	'forumReports',
] as const

export const OWNER_DELETION_PHASES = [
	'documents',
	'applicationDocuments',
	'applicationDrafts',
	'entitlements',
	'cases',
	'applications',
	'applicants',
	'assistantUsage',
	'ownerPreferences',
	'renewalEntries',
	'filedReports',
	'comments',
	'posts',
	'createdBlocks',
	'profiles',
] as const

export type OwnerDeletionPhase = (typeof OWNER_DELETION_PHASES)[number]

export type OwnerDeletionBatchResult =
	{ done: true } | { done: false; nextPhase: OwnerDeletionPhase }

function repeatPhase(phase: OwnerDeletionPhase): OwnerDeletionBatchResult {
	return { done: false, nextPhase: phase }
}

function advancePhase(phase: OwnerDeletionPhase): OwnerDeletionBatchResult {
	const index = OWNER_DELETION_PHASES.indexOf(phase)
	const nextPhase = OWNER_DELETION_PHASES[index + 1]
	return nextPhase === undefined ? { done: true } : { done: false, nextPhase }
}

/**
 * Delete one bounded portion of an owner's data. Each call is intended to run
 * as its own mutation transaction; an action repeatedly invokes it until
 * `done` so large accounts never accumulate every read/write in one Convex
 * transaction.
 */
export async function deleteOwnerDataBatch(
	ctx: MutationCtx,
	ownerId: string,
	phase: OwnerDeletionPhase,
): Promise<OwnerDeletionBatchResult> {
	switch (phase) {
		case 'documents': {
			const rows = await ctx.db
				.query('documents')
				.withIndex('by_ownerId', (q) => q.eq('ownerId', ownerId))
				.take(SAFE_DELETE_BATCH)
			if (rows.length === 0) return advancePhase(phase)
			for (const row of rows) {
				await ctx.storage.delete(row.storageId)
				await ctx.db.delete('documents', row._id)
			}
			return repeatPhase(phase)
		}
		case 'applicationDocuments': {
			const rows = await ctx.db
				.query('applicationDocuments')
				.withIndex('by_ownerId_and_status', (q) => q.eq('ownerId', ownerId))
				.take(SAFE_DELETE_BATCH)
			if (rows.length === 0) return advancePhase(phase)
			for (const row of rows) await ctx.db.delete('applicationDocuments', row._id)
			return repeatPhase(phase)
		}
		case 'applicationDrafts': {
			const rows = await ctx.db
				.query('applicationDrafts')
				.withIndex('by_ownerId', (q) => q.eq('ownerId', ownerId))
				.take(SAFE_DELETE_BATCH)
			if (rows.length === 0) return advancePhase(phase)
			for (const row of rows) await ctx.db.delete('applicationDrafts', row._id)
			return repeatPhase(phase)
		}
		case 'entitlements': {
			const rows = await ctx.db
				.query('entitlements')
				.withIndex('by_ownerId', (q) => q.eq('ownerId', ownerId))
				.take(SAFE_DELETE_BATCH)
			if (rows.length === 0) return advancePhase(phase)
			for (const row of rows) await ctx.db.delete('entitlements', row._id)
			return repeatPhase(phase)
		}
		case 'cases': {
			const rows = await ctx.db
				.query('cases')
				.withIndex('by_ownerId_and_receiptNumber', (q) => q.eq('ownerId', ownerId))
				.take(SAFE_DELETE_BATCH)
			if (rows.length === 0) return advancePhase(phase)
			for (const row of rows) await ctx.db.delete('cases', row._id)
			return repeatPhase(phase)
		}
		case 'applications': {
			const rows = await ctx.db
				.query('applications')
				.withIndex('by_ownerId_and_status', (q) => q.eq('ownerId', ownerId))
				.take(SAFE_DELETE_BATCH)
			if (rows.length === 0) return advancePhase(phase)
			for (const row of rows) await ctx.db.delete('applications', row._id)
			return repeatPhase(phase)
		}
		case 'applicants': {
			const rows = await ctx.db
				.query('applicants')
				.withIndex('by_ownerId', (q) => q.eq('ownerId', ownerId))
				.take(SAFE_DELETE_BATCH)
			if (rows.length === 0) return advancePhase(phase)
			for (const row of rows) await ctx.db.delete('applicants', row._id)
			return repeatPhase(phase)
		}
		case 'assistantUsage': {
			const rows = await ctx.db
				.query('assistantUsage')
				.withIndex('by_ownerId_and_day', (q) => q.eq('ownerId', ownerId))
				.take(SAFE_DELETE_BATCH)
			if (rows.length === 0) return advancePhase(phase)
			for (const row of rows) await ctx.db.delete('assistantUsage', row._id)
			return repeatPhase(phase)
		}
		case 'ownerPreferences': {
			const rows = await ctx.db
				.query('ownerPreferences')
				.withIndex('by_ownerId_and_key', (q) => q.eq('ownerId', ownerId))
				.take(SAFE_DELETE_BATCH)
			if (rows.length === 0) return advancePhase(phase)
			for (const row of rows) await ctx.db.delete('ownerPreferences', row._id)
			return repeatPhase(phase)
		}
		case 'renewalEntries': {
			const rows = await ctx.db
				.query('renewalEntries')
				.withIndex('by_ownerId', (q) => q.eq('ownerId', ownerId))
				.take(SAFE_DELETE_BATCH)
			if (rows.length === 0) return advancePhase(phase)
			for (const row of rows) await ctx.db.delete('renewalEntries', row._id)
			return repeatPhase(phase)
		}
		case 'filedReports': {
			const rows = await ctx.db
				.query('forumReports')
				.withIndex('by_reporter_and_targetKey', (q) => q.eq('reporterOwnerId', ownerId))
				.take(SAFE_DELETE_BATCH)
			if (rows.length === 0) return advancePhase(phase)
			for (const row of rows) await ctx.db.delete('forumReports', row._id)
			return repeatPhase(phase)
		}
		case 'comments': {
			const row = await ctx.db
				.query('forumComments')
				.withIndex('by_author', (q) => q.eq('authorOwnerId', ownerId))
				.first()
			if (row === null) return advancePhase(phase)

			const reports = await ctx.db
				.query('forumReports')
				.withIndex('by_targetKey', (q) => q.eq('targetKey', targetKeyFor('comment', row._id)))
				.take(SAFE_DELETE_BATCH)
			if (reports.length > 0) {
				for (const report of reports) await ctx.db.delete('forumReports', report._id)
				return repeatPhase(phase)
			}

			if (row.moderationStatus === 'visible') {
				const post = await ctx.db.get('forumPosts', row.postId)
				if (
					post !== null &&
					post.moderationStatus !== 'removed' &&
					post.authorOwnerId !== ownerId
				) {
					await ctx.db.patch('forumPosts', post._id, {
						commentCount: Math.max(0, post.commentCount - 1),
						updatedAt: Date.now(),
					})
				}
			}
			await ctx.db.delete('forumComments', row._id)
			return repeatPhase(phase)
		}
		case 'posts': {
			const row = await ctx.db
				.query('forumPosts')
				.withIndex('by_author', (q) => q.eq('authorOwnerId', ownerId))
				.first()
			if (row === null) return advancePhase(phase)

			const reports = await ctx.db
				.query('forumReports')
				.withIndex('by_targetKey', (q) => q.eq('targetKey', targetKeyFor('post', row._id)))
				.take(SAFE_DELETE_BATCH)
			if (reports.length > 0) {
				for (const report of reports) await ctx.db.delete('forumReports', report._id)
				return repeatPhase(phase)
			}
			await ctx.db.delete('forumPosts', row._id)
			return repeatPhase(phase)
		}
		case 'createdBlocks': {
			const rows = await ctx.db
				.query('communityBlocks')
				.withIndex('by_blocker', (q) => q.eq('blockerOwnerId', ownerId))
				.take(SAFE_DELETE_BATCH)
			if (rows.length === 0) return advancePhase(phase)
			for (const row of rows) await ctx.db.delete('communityBlocks', row._id)
			return repeatPhase(phase)
		}
		case 'profiles': {
			const row = await ctx.db
				.query('communityProfiles')
				.withIndex('by_ownerId', (q) => q.eq('ownerId', ownerId))
				.first()
			if (row === null) return advancePhase(phase)

			const blocks = await ctx.db
				.query('communityBlocks')
				.withIndex('by_blockedProfile', (q) => q.eq('blockedProfileId', row._id))
				.take(SAFE_DELETE_BATCH)
			if (blocks.length > 0) {
				for (const block of blocks) await ctx.db.delete('communityBlocks', block._id)
				return repeatPhase(phase)
			}
			await ctx.db.delete('communityProfiles', row._id)
			return repeatPhase(phase)
		}
	}
}

/**
 * Delete every report pointing at a given target (all reporters). Used during
 * erasure so third-party reports whose free-text notes may describe the erased
 * owner's now-deleted content do not survive.
 */
async function deleteReportsForTarget(ctx: MutationCtx, targetKey: string): Promise<void> {
	for (;;) {
		const rows = await ctx.db
			.query('forumReports')
			.withIndex('by_targetKey', (q) => q.eq('targetKey', targetKey))
			.take(DELETE_BATCH)
		if (rows.length === 0) break
		for (const row of rows) await ctx.db.delete('forumReports', row._id)
	}
}

/**
 * Delete every app-owned row (and stored document files) for one owner.
 * Batched so a large vault stays within transaction read limits.
 */
export async function deleteOwnerData(ctx: MutationCtx, ownerId: string): Promise<void> {
	// Documents first, so their storage blobs are deleted alongside the rows.
	for (;;) {
		const docs = await ctx.db
			.query('documents')
			.withIndex('by_ownerId', (q) => q.eq('ownerId', ownerId))
			.take(DELETE_BATCH)
		if (docs.length === 0) break
		for (const doc of docs) {
			await ctx.storage.delete(doc.storageId)
			await ctx.db.delete('documents', doc._id)
		}
	}

	for (;;) {
		const rows = await ctx.db
			.query('applicationDocuments')
			.withIndex('by_ownerId_and_status', (q) => q.eq('ownerId', ownerId))
			.take(DELETE_BATCH)
		if (rows.length === 0) break
		for (const row of rows) await ctx.db.delete('applicationDocuments', row._id)
	}

	for (;;) {
		const rows = await ctx.db
			.query('applicationDrafts')
			.withIndex('by_ownerId', (q) => q.eq('ownerId', ownerId))
			.take(DELETE_BATCH)
		if (rows.length === 0) break
		for (const row of rows) await ctx.db.delete('applicationDrafts', row._id)
	}

	for (;;) {
		const rows = await ctx.db
			.query('entitlements')
			.withIndex('by_ownerId', (q) => q.eq('ownerId', ownerId))
			.take(DELETE_BATCH)
		if (rows.length === 0) break
		for (const row of rows) await ctx.db.delete('entitlements', row._id)
	}

	for (;;) {
		const rows = await ctx.db
			.query('cases')
			.withIndex('by_ownerId_and_receiptNumber', (q) => q.eq('ownerId', ownerId))
			.take(DELETE_BATCH)
		if (rows.length === 0) break
		for (const row of rows) await ctx.db.delete('cases', row._id)
	}

	for (;;) {
		const rows = await ctx.db
			.query('applications')
			.withIndex('by_ownerId_and_status', (q) => q.eq('ownerId', ownerId))
			.take(DELETE_BATCH)
		if (rows.length === 0) break
		for (const row of rows) await ctx.db.delete('applications', row._id)
	}

	for (;;) {
		const rows = await ctx.db
			.query('applicants')
			.withIndex('by_ownerId', (q) => q.eq('ownerId', ownerId))
			.take(DELETE_BATCH)
		if (rows.length === 0) break
		for (const row of rows) await ctx.db.delete('applicants', row._id)
	}

	// Assistant daily-usage counters (M1-T1): per-owner data, so it goes too.
	for (;;) {
		const rows = await ctx.db
			.query('assistantUsage')
			.withIndex('by_ownerId_and_day', (q) => q.eq('ownerId', ownerId))
			.take(DELETE_BATCH)
		if (rows.length === 0) break
		for (const row of rows) await ctx.db.delete('assistantUsage', row._id)
	}

	// M6-T6 per-owner UI preferences and manual renewal entries.
	for (;;) {
		const rows = await ctx.db
			.query('ownerPreferences')
			.withIndex('by_ownerId_and_key', (q) => q.eq('ownerId', ownerId))
			.take(DELETE_BATCH)
		if (rows.length === 0) break
		for (const row of rows) await ctx.db.delete('ownerPreferences', row._id)
	}
	for (;;) {
		const rows = await ctx.db
			.query('renewalEntries')
			.withIndex('by_ownerId', (q) => q.eq('ownerId', ownerId))
			.take(DELETE_BATCH)
		if (rows.length === 0) break
		for (const row of rows) await ctx.db.delete('renewalEntries', row._id)
	}

	// Community forum (M4-T1). Erasure hard-deletes the owner's own reports,
	// comments, posts, and profile — no tombstone that would let pseudonymous
	// content survive — AND every third-party report that points at the owner's
	// deleted content (its free-text note may describe the erased user). Other
	// owners' comments on a deleted post are NOT touched (that is their data);
	// listComments makes them unreachable once the parent is gone.

	// Reports the owner FILED.
	for (;;) {
		const rows = await ctx.db
			.query('forumReports')
			.withIndex('by_reporter_and_targetKey', (q) => q.eq('reporterOwnerId', ownerId))
			.take(DELETE_BATCH)
		if (rows.length === 0) break
		for (const row of rows) await ctx.db.delete('forumReports', row._id)
	}

	// Owner's comments. Deleting a comment that still counts (parent not
	// `removed`) decrements its foreign parent's commentCount (floored at 0) so
	// an erased owner leaves no footprint in a public number; own posts are
	// skipped (deleted next anyway). Reports AGAINST each comment go too.
	for (;;) {
		const rows = await ctx.db
			.query('forumComments')
			.withIndex('by_author', (q) => q.eq('authorOwnerId', ownerId))
			.take(DELETE_BATCH)
		if (rows.length === 0) break
		for (const row of rows) {
			if (row.moderationStatus === 'visible') {
				const post = await ctx.db.get('forumPosts', row.postId)
				if (
					post !== null &&
					post.moderationStatus !== 'removed' &&
					post.authorOwnerId !== ownerId
				) {
					await ctx.db.patch('forumPosts', post._id, {
						commentCount: Math.max(0, post.commentCount - 1),
						updatedAt: Date.now(),
					})
				}
			}
			await deleteReportsForTarget(ctx, targetKeyFor('comment', row._id))
			await ctx.db.delete('forumComments', row._id)
		}
	}

	// Owner's posts, plus every report AGAINST each post.
	for (;;) {
		const rows = await ctx.db
			.query('forumPosts')
			.withIndex('by_author', (q) => q.eq('authorOwnerId', ownerId))
			.take(DELETE_BATCH)
		if (rows.length === 0) break
		for (const row of rows) {
			await deleteReportsForTarget(ctx, targetKeyFor('post', row._id))
			await ctx.db.delete('forumPosts', row._id)
		}
	}

	// Blocks the owner CREATED (they are the blocker).
	for (;;) {
		const rows = await ctx.db
			.query('communityBlocks')
			.withIndex('by_blocker', (q) => q.eq('blockerOwnerId', ownerId))
			.take(DELETE_BATCH)
		if (rows.length === 0) break
		for (const row of rows) await ctx.db.delete('communityBlocks', row._id)
	}

	// The owner's profile(s), plus every OTHER viewer's block pointing AT that
	// profile (a dangling block row would otherwise pin the erased pseudonym's
	// handle forever). Must run while the profile rows still exist.
	for (;;) {
		const rows = await ctx.db
			.query('communityProfiles')
			.withIndex('by_ownerId', (q) => q.eq('ownerId', ownerId))
			.take(DELETE_BATCH)
		if (rows.length === 0) break
		for (const row of rows) {
			for (;;) {
				const blocks = await ctx.db
					.query('communityBlocks')
					.withIndex('by_blockedProfile', (q) => q.eq('blockedProfileId', row._id))
					.take(DELETE_BATCH)
				if (blocks.length === 0) break
				for (const block of blocks) await ctx.db.delete('communityBlocks', block._id)
			}
			await ctx.db.delete('communityProfiles', row._id)
		}
	}
	// NOTE: reportCount on FOREIGN targets the erased owner reported is a
	// non-personal aggregate and may drift down by the deleted reports; the
	// M4-T3 moderation view recomputes it from forumReports.by_targetKey.
}

/**
 * Move every app-owned row from one owner to another (M6-T3): the data-
 * carryover half of Better Auth anonymous account linking. `fromOwnerId` is
 * always an anonymous session's owner, so only the filing-side tables can hold
 * rows — every community write goes through `requireCredentialedOwnerId`, so an
 * anonymous owner can never own forum posts/comments/blocks/reports/profiles
 * and those tables are intentionally not touched here.
 *
 * The target account may already have data (linking into an EXISTING account),
 * so the move merges rather than blindly patching where per-owner invariants
 * exist:
 * - applicants: at most one `isSelf` row per owner — moving isSelf rows are
 *   demoted when the target already has one (their applications keep working;
 *   applicantId references are row-stable).
 * - cases: receiptNumber is unique per owner — a moving case whose receipt the
 *   target already tracks is dropped (same real-world case).
 * - assistantUsage: one row per (owner, day) — same-day counts are summed so
 *   the daily quota can't be reset by converting.
 */
export async function reassignOwnerData(
	ctx: MutationCtx,
	fromOwnerId: string,
	toOwnerId: string,
): Promise<void> {
	if (fromOwnerId === toOwnerId) return
	for (const ownerId of [fromOwnerId, toOwnerId]) {
		const deletion = await ctx.db
			.query('accountDeletionTombstones')
			.withIndex('by_ownerId', (q) => q.eq('ownerId', ownerId))
			.unique()
		if (deletion !== null) throw new Error('Account deletion is in progress')
	}

	const targetHasSelf = (
		await ctx.db
			.query('applicants')
			.withIndex('by_ownerId', (q) => q.eq('ownerId', toOwnerId))
			.collect()
	).some((row) => row.isSelf)
	for (;;) {
		const rows = await ctx.db
			.query('applicants')
			.withIndex('by_ownerId', (q) => q.eq('ownerId', fromOwnerId))
			.take(DELETE_BATCH)
		if (rows.length === 0) break
		for (const row of rows) {
			await ctx.db.patch('applicants', row._id, {
				ownerId: toOwnerId,
				...(row.isSelf && targetHasSelf ? { isSelf: false } : {}),
			})
		}
	}

	for (const table of [
		'applicationDrafts',
		'documents',
		'entitlements',
		'renewalEntries',
	] as const) {
		for (;;) {
			const rows = await ctx.db
				.query(table)
				.withIndex('by_ownerId', (q) => q.eq('ownerId', fromOwnerId))
				.take(DELETE_BATCH)
			if (rows.length === 0) break
			for (const row of rows) await ctx.db.patch(table, row._id, { ownerId: toOwnerId })
		}
	}

	// These two index owner + status; the ownerId prefix alone is a valid range.
	for (const table of ['applications', 'applicationDocuments'] as const) {
		for (;;) {
			const rows = await ctx.db
				.query(table)
				.withIndex('by_ownerId_and_status', (q) => q.eq('ownerId', fromOwnerId))
				.take(DELETE_BATCH)
			if (rows.length === 0) break
			for (const row of rows) await ctx.db.patch(table, row._id, { ownerId: toOwnerId })
		}
	}

	for (;;) {
		const rows = await ctx.db
			.query('cases')
			.withIndex('by_ownerId_and_receiptNumber', (q) => q.eq('ownerId', fromOwnerId))
			.take(DELETE_BATCH)
		if (rows.length === 0) break
		for (const row of rows) {
			const existing = await ctx.db
				.query('cases')
				.withIndex('by_ownerId_and_receiptNumber', (q) =>
					q.eq('ownerId', toOwnerId).eq('receiptNumber', row.receiptNumber),
				)
				.unique()
			if (existing !== null) {
				await ctx.db.delete('cases', row._id)
			} else {
				await ctx.db.patch('cases', row._id, { ownerId: toOwnerId })
			}
		}
	}

	for (;;) {
		const rows = await ctx.db
			.query('assistantUsage')
			.withIndex('by_ownerId_and_day', (q) => q.eq('ownerId', fromOwnerId))
			.take(DELETE_BATCH)
		if (rows.length === 0) break
		for (const row of rows) {
			const existing = await ctx.db
				.query('assistantUsage')
				.withIndex('by_ownerId_and_day', (q) => q.eq('ownerId', toOwnerId).eq('day', row.day))
				.unique()
			if (existing !== null) {
				await ctx.db.patch('assistantUsage', existing._id, {
					count: existing.count + row.count,
					updatedAt: Date.now(),
				})
				await ctx.db.delete('assistantUsage', row._id)
			} else {
				await ctx.db.patch('assistantUsage', row._id, { ownerId: toOwnerId })
			}
		}
	}

	// One row per (owner, key): when the target account already holds a
	// preference, its own value wins and the anonymous row is dropped.
	for (;;) {
		const rows = await ctx.db
			.query('ownerPreferences')
			.withIndex('by_ownerId_and_key', (q) => q.eq('ownerId', fromOwnerId))
			.take(DELETE_BATCH)
		if (rows.length === 0) break
		for (const row of rows) {
			const existing = await ctx.db
				.query('ownerPreferences')
				.withIndex('by_ownerId_and_key', (q) => q.eq('ownerId', toOwnerId).eq('key', row.key))
				.unique()
			if (existing !== null) {
				await ctx.db.delete('ownerPreferences', row._id)
			} else {
				await ctx.db.patch('ownerPreferences', row._id, { ownerId: toOwnerId })
			}
		}
	}
}
