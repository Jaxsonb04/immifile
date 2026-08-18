import { literals } from 'convex-helpers/validators'
import { v } from 'convex/values'
import { internal } from './_generated/api'
import {
	type ActionCtx,
	internalAction,
	internalMutation,
	internalQuery,
} from './_generated/server'
import {
	ACCOUNT_DELETION_RECOVERY_DELAY_MS,
	DELETION_TOMBSTONE_TTL_MS,
} from './shared/authSecurity'
import {
	OWNER_DELETION_PHASES,
	deleteOwnerDataBatch,
	reassignOwnerData,
	type OwnerDeletionBatchResult,
	type OwnerDeletionPhase,
} from './model/ownerData'
import { isAccountDeletionAttemptId } from './shared/accountDeletion'

const ownerDeletionPhase = literals(...OWNER_DELETION_PHASES)
const MAX_ACCOUNT_DELETION_RECEIPTS_PER_OWNER = 16

/**
 * Complete an owner purge as a sequence of separate mutation transactions.
 * The caller awaits every batch, so Better Auth never deletes the identity
 * until all app data and storage blobs are gone.
 */
export async function purgeOwnerDataInBatches(
	ctx: Pick<ActionCtx, 'runMutation'>,
	ownerId: string,
): Promise<void> {
	await ctx.runMutation(internal.account.beginOwnerDeletion, { ownerId })
	let phase: OwnerDeletionPhase = OWNER_DELETION_PHASES[0]
	for (;;) {
		const result: OwnerDeletionBatchResult = await ctx.runMutation(
			internal.account.purgeOwnerDataBatch,
			{ ownerId, phase },
		)
		if (result.done) return
		phase = result.nextPhase
	}
}

/**
 * Internal cascade exercise for an authenticated ANONYMOUS account.
 *
 * Interactive deletion must go through auth.deleteAccount so app purge,
 * tombstone, provider revocation, and auth-row deletion stay one orchestrated
 * server flow. Keeping this helper internal removes the legacy public partial-
 * deletion path while retaining focused cascade/tombstone tests.
 */
export const deleteAccountData = internalAction({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity()
		if (identity === null) throw new Error('Not authenticated')
		if ((identity as { isAnonymous?: boolean | null }).isAnonymous !== true) {
			throw new Error('Deleting a permanent account requires your password')
		}
		await purgeOwnerDataInBatches(ctx, identity.tokenIdentifier)
		return null
	},
})

/**
 * Data carryover for Better Auth anonymous account linking (M6-T3). Called
 * only from the server-side `onLinkAccount` hook in convex/auth.ts — never
 * from a client — with owner ids the hook derives from the two Better Auth
 * user records. Moves the anonymous session's applications, answers,
 * documents, cases, and usage to the permanent account (merge rules in
 * `reassignOwnerData`).
 */
export const reassignAccountData = internalMutation({
	args: { fromOwnerId: v.string(), toOwnerId: v.string() },
	handler: async (ctx, args) => {
		await reassignOwnerData(ctx, args.fromOwnerId, args.toOwnerId)
		return null
	},
})

/** Install the write gate before the first deletion transaction. */
export const beginOwnerDeletion = internalMutation({
	args: {
		ownerId: v.string(),
		authUserId: v.optional(v.string()),
		attemptId: v.optional(v.string()),
	},
	handler: async (ctx, args): Promise<null> => {
		const now = Date.now()
		let existingReceipt: { ownerId: string } | null = null
		if (args.attemptId !== undefined) {
			if (args.authUserId === undefined || !isAccountDeletionAttemptId(args.attemptId)) {
				throw new Error('The deletion request could not be verified')
			}
			existingReceipt = await ctx.db
				.query('accountDeletionAttempts')
				.withIndex('by_attemptId', (q) => q.eq('attemptId', args.attemptId!))
				.unique()
			if (existingReceipt !== null && existingReceipt.ownerId !== args.ownerId) {
				throw new Error('The deletion request could not be verified')
			}
			if (existingReceipt === null) {
				const ownerReceipts = await ctx.db
					.query('accountDeletionAttempts')
					.withIndex('by_ownerId', (q) => q.eq('ownerId', args.ownerId))
					.take(MAX_ACCOUNT_DELETION_RECEIPTS_PER_OWNER)
				if (ownerReceipts.length >= MAX_ACCOUNT_DELETION_RECEIPTS_PER_OWNER) {
					throw new Error('Account deletion is already being completed')
				}
			}
		}
		const existing = await ctx.db
			.query('accountDeletionTombstones')
			.withIndex('by_ownerId', (q) => q.eq('ownerId', args.ownerId))
			.unique()
		if (args.authUserId === undefined) {
			// Purge-only callers (focused cascade helpers and any future maintenance
			// jobs) do not own a Better Auth identity to finish. Preserve their old
			// finite JWT-drain gate instead of creating an unscheduled pending delete.
			if (existing === null) {
				await ctx.db.insert('accountDeletionTombstones', {
					ownerId: args.ownerId,
					createdAt: now,
					completedAt: now,
					expiresAt: now + DELETION_TOMBSTONE_TTL_MS,
				})
				await ctx.scheduler.runAfter(
					DELETION_TOMBSTONE_TTL_MS,
					internal.account.clearOwnerDeletionTombstone,
					{ ownerId: args.ownerId },
				)
			} else if (existing.authUserId === undefined) {
				const expiresAt = Math.max(existing.expiresAt, now + DELETION_TOMBSTONE_TTL_MS)
				await ctx.db.patch('accountDeletionTombstones', existing._id, {
					completedAt: existing.completedAt ?? now,
					expiresAt,
				})
				await ctx.scheduler.runAfter(
					expiresAt - now,
					internal.account.clearOwnerDeletionTombstone,
					{ ownerId: args.ownerId },
				)
			}
			return null
		}

		if (existing === null) {
			await ctx.db.insert('accountDeletionTombstones', {
				ownerId: args.ownerId,
				createdAt: now,
				// Pending gates never clear based on this timestamp. `completedAt`
				// starts the real JWT-drain window only after auth is absent.
				expiresAt: now,
				authUserId: args.authUserId,
			})
		} else {
			if (
				args.authUserId !== undefined &&
				existing.authUserId !== undefined &&
				existing.authUserId !== args.authUserId
			) {
				throw new Error('Account deletion identity mismatch')
			}
			if (existing.authUserId === undefined) {
				await ctx.db.patch('accountDeletionTombstones', existing._id, {
					authUserId: args.authUserId,
					completedAt: undefined,
					expiresAt: now,
				})
			}
		}
		if (args.attemptId !== undefined && existingReceipt === null) {
			await ctx.db.insert('accountDeletionAttempts', {
				attemptId: args.attemptId,
				ownerId: args.ownerId,
				createdAt: now,
			})
		}
		// Schedule exactly one durable recovery chain when this owner first gains
		// an auth identity. Scheduling is part of this mutation transaction, so a
		// process crash cannot strand a pending gate without a retry.
		if (existing?.authUserId === undefined) {
			await ctx.scheduler.runAfter(
				ACCOUNT_DELETION_RECOVERY_DELAY_MS,
				internal.auth.recoverAccountDeletion,
				{ ownerId: args.ownerId, authUserId: args.authUserId },
			)
		}
		return null
	},
})

export const getOwnerDeletionState = internalQuery({
	args: { ownerId: v.string() },
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query('accountDeletionTombstones')
			.withIndex('by_ownerId', (q) => q.eq('ownerId', args.ownerId))
			.unique()
		if (existing === null) return null
		return {
			authUserId: existing.authUserId,
			completedAt: existing.completedAt,
			expiresAt: existing.expiresAt,
			appleManualRevokeRequired: existing.appleManualRevokeRequired === true,
		}
	},
})

export const hasOwnerDeletionTombstone = internalQuery({
	args: { ownerId: v.string() },
	returns: v.boolean(),
	handler: async (ctx, args) => {
		return (
			(await ctx.db
				.query('accountDeletionTombstones')
				.withIndex('by_ownerId', (q) => q.eq('ownerId', args.ownerId))
				.unique()) !== null
		)
	},
})

/** Mark authoritative auth absence and only now start the old-JWT drain TTL. */
export const completeOwnerDeletion = internalMutation({
	args: {
		ownerId: v.string(),
		authUserId: v.string(),
		appleManualRevokeRequired: v.boolean(),
	},
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query('accountDeletionTombstones')
			.withIndex('by_ownerId', (q) => q.eq('ownerId', args.ownerId))
			.unique()
		if (existing === null) throw new Error('Account deletion gate is missing')
		if (existing.authUserId !== undefined && existing.authUserId !== args.authUserId) {
			throw new Error('Account deletion identity mismatch')
		}
		if (existing.completedAt !== undefined) {
			return {
				appleManualRevokeRequired: existing.appleManualRevokeRequired === true,
			}
		}
		const appleManualRevokeRequired =
			existing.appleManualRevokeRequired === true || args.appleManualRevokeRequired
		const completedAt = Date.now()
		const expiresAt = completedAt + DELETION_TOMBSTONE_TTL_MS
		await ctx.db.patch('accountDeletionTombstones', existing._id, {
			authUserId: args.authUserId,
			completedAt,
			expiresAt,
			appleManualRevokeRequired,
		})
		// The final recovery runs at the disclosed drain boundary, performs one
		// clean Better Auth sweep, and then clears the gate. A failure keeps the
		// opaque gate and its durable retry chain instead of clearing unsafely.
		await ctx.scheduler.runAfter(DELETION_TOMBSTONE_TTL_MS, internal.auth.recoverAccountDeletion, {
			ownerId: args.ownerId,
			authUserId: args.authUserId,
		})
		return { appleManualRevokeRequired }
	},
})

/** Persist externally required cleanup progress before deleting auth rows. */
export const recordOwnerDeletionProgress = internalMutation({
	args: {
		ownerId: v.string(),
		authUserId: v.string(),
		appleManualRevokeRequired: v.boolean(),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query('accountDeletionTombstones')
			.withIndex('by_ownerId', (q) => q.eq('ownerId', args.ownerId))
			.unique()
		if (existing === null || existing.authUserId !== args.authUserId) {
			throw new Error('Account deletion gate could not be verified')
		}
		if (existing.appleManualRevokeRequired !== true && args.appleManualRevokeRequired) {
			await ctx.db.patch('accountDeletionTombstones', existing._id, {
				appleManualRevokeRequired: true,
			})
		}
		return null
	},
})

/** Mark one auth-artifact cleanup attempt dirty before touching component data. */
export const beginOwnerAuthCleanup = internalMutation({
	args: { ownerId: v.string(), authUserId: v.string() },
	returns: v.number(),
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query('accountDeletionTombstones')
			.withIndex('by_ownerId', (q) => q.eq('ownerId', args.ownerId))
			.unique()
		if (existing === null || existing.authUserId !== args.authUserId) {
			throw new Error('Account deletion gate could not be verified')
		}
		const generation = (existing.authCleanupGeneration ?? 0) + 1
		await ctx.db.patch('accountDeletionTombstones', existing._id, {
			authCleanupGeneration: generation,
		})
		return generation
	},
})

/** Complete only the newest cleanup attempt; an overlapping newer write wins. */
export const completeOwnerAuthCleanup = internalMutation({
	args: { ownerId: v.string(), authUserId: v.string(), generation: v.number() },
	returns: v.boolean(),
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query('accountDeletionTombstones')
			.withIndex('by_ownerId', (q) => q.eq('ownerId', args.ownerId))
			.unique()
		if (existing === null || existing.authUserId !== args.authUserId) return false
		if (existing.authCleanupGeneration !== args.generation) return false
		await ctx.db.patch('accountDeletionTombstones', existing._id, {
			authCleanupCompletedGeneration: args.generation,
			lastAuthSweepAt: Date.now(),
		})
		return true
	},
})

/** Remove only an expired write gate; an older scheduled run cannot clear a
 * gate extended by a later retry. */
export const clearOwnerDeletionTombstone = internalMutation({
	args: { ownerId: v.string() },
	handler: async (ctx, args): Promise<null> => {
		const existing = await ctx.db
			.query('accountDeletionTombstones')
			.withIndex('by_ownerId', (q) => q.eq('ownerId', args.ownerId))
			.unique()
		if (existing === null) return null
		// A failed/crashed auth deletion is a durable write gate. Only
		// completeOwnerDeletion can make it eligible for cleanup.
		if (existing.authUserId !== undefined && existing.completedAt === undefined) return null
		const remainingMs = existing.expiresAt - Date.now()
		if (remainingMs > 0) {
			if (existing.authUserId !== undefined) {
				await ctx.scheduler.runAfter(remainingMs, internal.auth.recoverAccountDeletion, {
					ownerId: args.ownerId,
					authUserId: existing.authUserId,
				})
			} else {
				await ctx.scheduler.runAfter(
					remainingMs,
					internal.account.clearOwnerDeletionTombstone,
					args,
				)
			}
			return null
		}
		if (existing.authUserId !== undefined) {
			const generation = existing.authCleanupGeneration ?? 0
			const completedGeneration = existing.authCleanupCompletedGeneration ?? 0
			if (
				generation !== completedGeneration ||
				(existing.lastAuthSweepAt ?? 0) < existing.expiresAt
			) {
				// Do not clear an auth-backed gate at the drain boundary until a
				// successful component sweep has observed every late account/session.
				await ctx.scheduler.runAfter(0, internal.auth.recoverAccountDeletion, {
					ownerId: args.ownerId,
					authUserId: existing.authUserId,
				})
				return null
			}
		}
		const attempts = await ctx.db
			.query('accountDeletionAttempts')
			.withIndex('by_ownerId', (q) => q.eq('ownerId', args.ownerId))
			.collect()
		for (const attempt of attempts) {
			await ctx.db.delete('accountDeletionAttempts', attempt._id)
		}
		await ctx.db.delete('accountDeletionTombstones', existing._id)
		return null
	},
})

/**
 * One bounded deletion transaction. The action orchestrator invokes this
 * repeatedly; clients and crons never call it directly.
 */
export const purgeOwnerDataBatch = internalMutation({
	args: { ownerId: v.string(), phase: ownerDeletionPhase },
	handler: async (ctx, args) => {
		return await deleteOwnerDataBatch(ctx, args.ownerId, args.phase)
	},
})

/** Full internal cascade for temp-account cleanup and focused tests. */
export const purgeOwnerData = internalAction({
	args: { ownerId: v.string() },
	handler: async (ctx, args) => {
		await purgeOwnerDataInBatches(ctx, args.ownerId)
		return null
	},
})
