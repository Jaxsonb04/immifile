/// <reference types="vite/client" />
import { convexTest } from 'convex-test'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { api, internal } from './_generated/api'
import schema from './schema'
import { filingWindowDays } from './shared/applicationShapes'
import { DELETION_TOMBSTONE_TTL_MS } from './shared/authSecurity'

const modules = import.meta.glob('./**/*.ts')

const TABLES = [
	'applicants',
	'applications',
	'applicationDrafts',
	'applicationDocuments',
	'documents',
	'cases',
	'entitlements',
] as const

function newT() {
	return convexTest(schema, modules)
}

beforeEach(() => {
	vi.stubEnv('DEV_SEED_ENABLED', 'true')
})

describe('dev seed', () => {
	test('builds the family demo walkthrough dataset', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })

		const summary = await alice.action(internal.dev.seed.seedDemo, {})
		expect(summary).toEqual({ applicants: 3, applications: 5, documents: 5 })

		await t.run(async (ctx) => {
			const applicants = await ctx.db.query('applicants').collect()
			const applications = await ctx.db.query('applications').collect()
			const drafts = await ctx.db.query('applicationDrafts').collect()
			const slots = await ctx.db.query('applicationDocuments').collect()
			const documents = await ctx.db.query('documents').collect()
			const cases = await ctx.db.query('cases').collect()
			const entitlements = await ctx.db.query('entitlements').collect()

			// Exactly one self applicant.
			expect(applicants).toHaveLength(3)
			expect(applicants.filter((a) => a.isSelf)).toHaveLength(1)

			// Every application has exactly one draft, and the journey stages
			// cover the walkthrough checklist.
			expect(applications).toHaveLength(5)
			expect(drafts).toHaveLength(5)
			const statuses = applications.map((a) => a.status).sort()
			expect(statuses).toEqual(['closed', 'draft', 'draft', 'draft', 'filed'])

			// Fresh mid-interview draft exists (progress summary on the
			// application row, not the draft).
			const midInterview = applications.find(
				(a) => a.status === 'draft' && a.completedStepCount < a.totalStepCount,
			)
			expect(midInterview).toBeDefined()

			// Exactly one application is missing a required document.
			const needed = slots.filter((s) => s.status === 'needed')
			expect(needed).toHaveLength(1)
			expect(needed[0]!.documentId).toBeUndefined()

			// Attached slots pin real documents.
			for (const slot of slots.filter((s) => s.status === 'attached')) {
				expect(slot.documentId).toBeDefined()
				const doc = await ctx.db.get('documents', slot.documentId!)
				expect(doc).not.toBeNull()
			}

			// Superseded pair: links are mutual, current side has no successor.
			const superseded = documents.filter((d) => d.supersededById !== undefined)
			expect(superseded).toHaveLength(1)
			const successor = await ctx.db.get('documents', superseded[0]!.supersededById!)
			expect(successor?.supersedesId).toBe(superseded[0]!._id)
			expect(successor?.supersededById).toBeUndefined()

			// At least one CURRENT document expires inside the filing window
			// (attention item input) and one is healthy.
			const today = new Date().toISOString().slice(0, 10)
			const windowEnd = new Date(Date.now() + filingWindowDays * 24 * 60 * 60 * 1000)
				.toISOString()
				.slice(0, 10)
			const current = documents.filter((d) => d.supersededById === undefined)
			const expiring = current.filter(
				(d) => d.expiryDate !== undefined && d.expiryDate >= today && d.expiryDate <= windowEnd,
			)
			const healthy = current.filter((d) => d.expiryDate !== undefined && d.expiryDate > windowEnd)
			expect(expiring.length).toBeGreaterThanOrEqual(1)
			expect(healthy.length).toBeGreaterThanOrEqual(1)

			// Cases: one mid-pipeline linked to the filed application, one
			// terminal on the closed application; history is ordered.
			expect(cases).toHaveLength(2)
			const filedApp = applications.find((a) => a.status === 'filed')!
			const midCase = cases.find((c) => c.applicationId === filedApp._id)!
			expect(midCase.status).toBe('biometrics')
			for (const c of cases) {
				const times = c.statusHistory.map((h) => h.occurredAt)
				expect([...times].sort((x, y) => x - y)).toEqual(times)
				expect(c.statusHistory.at(-1)!.status).toBe(c.status)
			}

			// Entitlements: active dev stubs, including the unlocked draft.
			expect(entitlements).toHaveLength(3)
			expect(entitlements.every((e) => e.status === 'active' && e.source === 'devStub')).toBe(true)
			const unlockedDraft = applications.find(
				(a) => a.status === 'draft' && entitlements.some((e) => e.applicationId === a._id),
			)
			expect(unlockedDraft).toBeDefined()

			// Every document's blob really exists in storage.
			for (const doc of documents) {
				expect(await ctx.storage.getUrl(doc.storageId)).not.toBeNull()
			}
		})
	})

	test('re-seeding is idempotent: one dataset, no orphaned files', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })

		await alice.action(internal.dev.seed.seedDemo, {})
		await alice.action(internal.dev.seed.seedDemo, {})

		await t.run(async (ctx) => {
			expect(await ctx.db.query('applicants').collect()).toHaveLength(3)
			expect(await ctx.db.query('applications').collect()).toHaveLength(5)
			expect(await ctx.db.query('documents').collect()).toHaveLength(5)
			// Old blobs were deleted by the wipe; only the fresh five remain.
			expect(await ctx.db.system.query('_storage').collect()).toHaveLength(5)
		})
	})

	test('requires authentication', async () => {
		const t = newT()
		await expect(t.action(internal.dev.seed.seedDemo, {})).rejects.toThrow('Not authenticated')
		await expect(t.mutation(internal.dev.seed.resetOwner, {})).rejects.toThrow('Not authenticated')
	})

	test('is disabled unless DEV_SEED_ENABLED=true', async () => {
		vi.stubEnv('DEV_SEED_ENABLED', '')
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })
		await expect(alice.action(internal.dev.seed.seedDemo, {})).rejects.toThrow(/disabled/)
		await expect(alice.mutation(internal.dev.seed.resetOwner, {})).rejects.toThrow(/disabled/)
	})
})

describe('owner scoping', () => {
	test("resetOwner wipes only the caller's rows", async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })
		const bob = t.withIdentity({ subject: 'bob' })

		await alice.action(internal.dev.seed.seedDemo, {})
		await bob.action(internal.dev.seed.seedDemo, {})

		await bob.mutation(internal.dev.seed.resetOwner, {})

		await t.run(async (ctx) => {
			for (const table of TABLES) {
				const rows = await ctx.db.query(table).collect()
				const owners = new Set(rows.map((r) => r.ownerId))
				// Exactly one owner's data remains, and it is a single owner
				// across all tables (alice's).
				expect(owners.size).toBe(1)
			}
			expect(await ctx.db.query('applicants').collect()).toHaveLength(3)
			expect(await ctx.db.query('applications').collect()).toHaveLength(5)
		})
	})
})

describe('account deletion contract', () => {
	test('legacy and purge-only tombstones retain finite cleanup semantics', async () => {
		const t = newT()
		const legacyOwnerId = 'legacy-owner'
		await t.run(async (ctx) => {
			await ctx.db.insert('accountDeletionTombstones', {
				ownerId: legacyOwnerId,
				createdAt: Date.now() - DELETION_TOMBSTONE_TTL_MS - 1,
				expiresAt: Date.now() - 1,
			})
		})
		await t.mutation(internal.account.clearOwnerDeletionTombstone, {
			ownerId: legacyOwnerId,
		})
		expect(
			await t.run((ctx) =>
				ctx.db
					.query('accountDeletionTombstones')
					.withIndex('by_ownerId', (q) => q.eq('ownerId', legacyOwnerId))
					.unique(),
			),
		).toBeNull()

		const purgeOnlyOwnerId = 'purge-only-owner'
		await t.mutation(internal.account.beginOwnerDeletion, { ownerId: purgeOnlyOwnerId })
		const purgeOnly = await t.run((ctx) =>
			ctx.db
				.query('accountDeletionTombstones')
				.withIndex('by_ownerId', (q) => q.eq('ownerId', purgeOnlyOwnerId))
				.unique(),
		)
		expect(purgeOnly?.completedAt).toEqual(expect.any(Number))
		expect(purgeOnly!.expiresAt - purgeOnly!.completedAt!).toBe(DELETION_TOMBSTONE_TTL_MS)
		expect(purgeOnly?.authUserId).toBeUndefined()
	})

	test('an auth-backed pending tombstone never clears merely because time elapsed', async () => {
		const t = newT()
		const ownerId = 'pending-auth-owner'
		await t.run(async (ctx) => {
			await ctx.db.insert('accountDeletionTombstones', {
				ownerId,
				authUserId: 'pending-auth-user',
				createdAt: Date.now() - DELETION_TOMBSTONE_TTL_MS - 1,
				expiresAt: Date.now() - 1,
			})
		})
		await t.mutation(internal.account.clearOwnerDeletionTombstone, { ownerId })
		expect(
			await t.run((ctx) =>
				ctx.db
					.query('accountDeletionTombstones')
					.withIndex('by_ownerId', (q) => q.eq('ownerId', ownerId))
					.unique(),
			),
		).toMatchObject({ ownerId, authUserId: 'pending-auth-user' })
	})

	test('preserves concurrent device receipts and rejects a duplicate capability across owners', async () => {
		const t = newT()
		const ownerId = 'multi-device-deletion-owner'
		const authUserId = 'multi-device-auth-user'
		const firstAttemptId = '10000000-0000-4000-8000-000000000001'
		const secondAttemptId = '20000000-0000-4000-8000-000000000002'

		for (const attemptId of [firstAttemptId, secondAttemptId]) {
			await t.mutation(internal.account.beginOwnerDeletion, {
				ownerId,
				authUserId,
				attemptId,
			})
			await expect(t.query(api.auth.getAccountDeletionStatus, { attemptId })).resolves.toEqual({
				status: 'pending',
				appleManualRevokeRequired: false,
			})
		}

		await expect(
			t.mutation(internal.account.beginOwnerDeletion, {
				ownerId: 'different-owner',
				authUserId: 'different-auth-user',
				attemptId: firstAttemptId,
			}),
		).rejects.toThrow('The deletion request could not be verified')

		await t.mutation(internal.account.completeOwnerDeletion, {
			ownerId,
			authUserId,
			appleManualRevokeRequired: true,
		})
		for (const attemptId of [firstAttemptId, secondAttemptId]) {
			await expect(t.query(api.auth.getAccountDeletionStatus, { attemptId })).resolves.toEqual({
				status: 'completed',
				appleManualRevokeRequired: true,
			})
		}

		await t.run(async (ctx) => {
			const tombstone = await ctx.db
				.query('accountDeletionTombstones')
				.withIndex('by_ownerId', (q) => q.eq('ownerId', ownerId))
				.unique()
			await ctx.db.patch('accountDeletionTombstones', tombstone!._id, {
				expiresAt: Date.now() - 1,
				authCleanupGeneration: 1,
				authCleanupCompletedGeneration: 1,
				lastAuthSweepAt: Date.now(),
			})
		})
		await t.mutation(internal.account.clearOwnerDeletionTombstone, { ownerId })
		for (const attemptId of [firstAttemptId, secondAttemptId]) {
			await expect(t.query(api.auth.getAccountDeletionStatus, { attemptId })).resolves.toEqual({
				status: 'missing',
			})
		}
	})

	test('deleteAccountData removes every row and stored file for the owner', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })

		await alice.action(internal.dev.seed.seedDemo, {})
		// Internal cascade exercise; the interactive path is auth.deleteAccount.
		await t
			.withIdentity({ subject: 'alice', isAnonymous: true })
			.action(internal.account.deleteAccountData, {})

		// A JWT issued before deletion can remain cryptographically valid for a
		// few minutes, but the tombstone must prevent it from recreating data
		// after the case-deletion phase has already passed.
		await expect(
			alice.mutation(api.cases.createCase, { receiptNumber: 'EAC1234567890' }),
		).rejects.toThrow(/deletion is in progress/i)

		await t.run(async (ctx) => {
			for (const table of TABLES) {
				expect(await ctx.db.query(table).collect()).toHaveLength(0)
			}
			// No financial records or files survive (REARCHITECTURE.md).
			expect(await ctx.db.system.query('_storage').collect()).toHaveLength(0)
		})
	})

	test('a stale deletion session can read empty state but cannot recreate data', async () => {
		const t = newT()
		const staleSession = t.withIdentity({ subject: 'alice', isAnonymous: true })

		await staleSession.mutation(api.preferences.setPreference, {
			key: 'casesIntroDismissed',
			value: true,
		})
		await staleSession.action(internal.account.deleteAccountData, {})

		// Reactive reads can rerun between the app-data purge and Better Auth
		// deleting the identity. They must resolve to the now-empty account state
		// rather than crash the UI and interrupt the identity-deletion request.
		await expect(
			staleSession.query(api.preferences.getPreference, { key: 'casesIntroDismissed' }),
		).resolves.toBe(false)

		// The short-lived tombstone is still a write gate: an old JWT cannot
		// recreate owner data after its deletion phase has completed.
		await expect(
			staleSession.mutation(api.preferences.setPreference, {
				key: 'casesIntroDismissed',
				value: true,
			}),
		).rejects.toThrow(/deletion is in progress/i)
	})

	test('deleteAccountData refuses a credentialed session (password path only)', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })
		await expect(alice.action(internal.account.deleteAccountData, {})).rejects.toThrow(/password/i)
	})

	test('deleteAccountData requires authentication', async () => {
		const t = newT()
		await expect(t.action(internal.account.deleteAccountData, {})).rejects.toThrow(
			'Not authenticated',
		)
	})
})
