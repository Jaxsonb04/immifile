/// <reference types="vite/client" />
import { convexTest } from 'convex-test'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { api, internal } from './_generated/api'
import schema from './schema'
import { parseModeratorEmails, targetIdFromKey, targetKeyFor } from './shared/community'

// M4-T3: moderator authorization, the report queue, hide/restore, and
// per-viewer blocks. Same convex-test identity mocking as community.test.ts —
// a moderator is a credentialed identity whose JWT email is on the
// MODERATOR_EMAILS allowlist (never a client-supplied flag).

// This suite exercises the feature implementation itself, so it runs with the
// release gate open. That the gate actually closes these endpoints in the
// shipped policy is covered separately by convex/releaseGate.test.ts.
vi.mock('../release-policy.json', () => ({
	default: {
		filingPreparation: true,
		assistant: true,
		community: true,
		socialLogin: true,
		passwordRecovery: true,
	},
}))

const modules = import.meta.glob('./**/*.ts')
const newT = () => convexTest(schema, modules)

const credentialed = (t: ReturnType<typeof newT>, subject: string, email?: string) =>
	t.withIdentity({ subject, ...(email === undefined ? {} : { email }) })
const anon = (t: ReturnType<typeof newT>, subject: string) =>
	t.withIdentity({ subject, isAnonymous: true })
// The allowlist entry is mixed-case and padded; the identity email differs in
// case — matching must be trimmed + case-insensitive.
const moderator = (t: ReturnType<typeof newT>) =>
	t.withIdentity({ subject: 'mod', email: 'MOD@Immifile.test' })

const firstPage = { numItems: 50, cursor: null }

beforeEach(() => {
	vi.stubEnv('MODERATOR_EMAILS', ' Mod@immifile.test , second@immifile.test ')
})

/** Every key present anywhere in a payload, recursively. */
function collectKeys(value: unknown, keys: Set<string> = new Set()): Set<string> {
	if (Array.isArray(value)) {
		for (const item of value) collectKeys(item, keys)
		return keys
	}
	if (value !== null && typeof value === 'object') {
		for (const [key, child] of Object.entries(value)) {
			keys.add(key)
			collectKeys(child, keys)
		}
	}
	return keys
}

const PRIVATE_KEYS = [
	'ownerId',
	'authorOwnerId',
	'reporterOwnerId',
	'blockerOwnerId',
	'email',
	'reportCount',
]

async function seedReportedPost(t: ReturnType<typeof newT>) {
	const alice = credentialed(t, 'alice')
	const bob = credentialed(t, 'bob')
	const postId = await alice.mutation(api.community.createPost, { title: 'Reported', body: 'body' })
	await bob.mutation(api.community.reportContent, {
		targetType: 'post',
		targetId: postId,
		reason: 'spam',
		note: 'looks fishy',
	})
	return { alice, bob, postId }
}

describe('pure helpers', () => {
	test('parseModeratorEmails trims, lowercases, and drops empties', () => {
		expect(parseModeratorEmails(undefined)).toEqual([])
		expect(parseModeratorEmails('')).toEqual([])
		expect(parseModeratorEmails(' , ,, ')).toEqual([])
		expect(parseModeratorEmails(' A@B.c ,d@E.f')).toEqual(['a@b.c', 'd@e.f'])
	})

	test('targetIdFromKey inverts targetKeyFor and rejects malformed keys', () => {
		expect(targetIdFromKey('post', targetKeyFor('post', 'abc'))).toBe('abc')
		expect(targetIdFromKey('comment', targetKeyFor('comment', 'xyz'))).toBe('xyz')
		expect(targetIdFromKey('post', 'c:abc')).toBeNull() // wrong table prefix
		expect(targetIdFromKey('comment', 'p:abc')).toBeNull()
		expect(targetIdFromKey('post', 'p:')).toBeNull() // empty id
		expect(targetIdFromKey('post', 'garbage')).toBeNull()
	})
})

describe('moderator authorization', () => {
	test('isModerator is false (never throws) for unauthenticated, anonymous, email-less, and unlisted callers', async () => {
		const t = newT()
		expect(await t.query(api.moderation.isModerator, {})).toBe(false)
		expect(await anon(t, 'anon-1').query(api.moderation.isModerator, {})).toBe(false)
		expect(await credentialed(t, 'no-email').query(api.moderation.isModerator, {})).toBe(false)
		expect(
			await credentialed(t, 'eve', 'eve@immifile.test').query(api.moderation.isModerator, {}),
		).toBe(false)
	})

	test('isModerator is true for a listed email, case-insensitively', async () => {
		const t = newT()
		expect(await moderator(t).query(api.moderation.isModerator, {})).toBe(true)
		expect(
			await credentialed(t, 's', 'SECOND@IMMIFILE.TEST').query(api.moderation.isModerator, {}),
		).toBe(true)
	})

	test('moderator-only surfaces reject unauthenticated, anonymous, and unlisted callers', async () => {
		const t = newT()
		const { postId } = await seedReportedPost(t)
		const hide = {
			targetType: 'post',
			targetKey: targetKeyFor('post', postId),
			status: 'hidden',
		} as const
		await expect(
			t.query(api.moderation.listReports, { paginationOpts: firstPage }),
		).rejects.toThrow(/authenticat/i)
		await expect(
			anon(t, 'a').query(api.moderation.listReports, { paginationOpts: firstPage }),
		).rejects.toThrow(/account/i)
		await expect(
			credentialed(t, 'eve', 'eve@immifile.test').query(api.moderation.listReports, {
				paginationOpts: firstPage,
			}),
		).rejects.toThrow(/authorized/i)
		await expect(t.mutation(api.moderation.setModerationStatus, hide)).rejects.toThrow(
			/authenticat/i,
		)
		await expect(anon(t, 'a').mutation(api.moderation.setModerationStatus, hide)).rejects.toThrow(
			/account/i,
		)
		await expect(
			credentialed(t, 'eve', 'eve@immifile.test').mutation(
				api.moderation.setModerationStatus,
				hide,
			),
		).rejects.toThrow(/authorized/i)
	})

	test('an empty/unset MODERATOR_EMAILS means nobody moderates', async () => {
		const t = newT()
		vi.stubEnv('MODERATOR_EMAILS', '')
		expect(await moderator(t).query(api.moderation.isModerator, {})).toBe(false)
	})
})

describe('listReports — the moderator queue', () => {
	test('shows open reports newest-first with the public target shape and no private identifiers anywhere', async () => {
		const t = newT()
		const { alice, bob, postId } = await seedReportedPost(t)
		const commentId = await alice.mutation(api.community.addComment, { postId, body: 'a comment' })
		await bob.mutation(api.community.reportContent, {
			targetType: 'comment',
			targetId: commentId,
			reason: 'harassment',
		})
		// Pin deterministic report times (Date.now can collide within a test).
		await t.run(async (ctx) => {
			const reports = await ctx.db.query('forumReports').collect()
			for (const report of reports) {
				await ctx.db.patch('forumReports', report._id, {
					createdAt: report.targetType === 'post' ? 1000 : 2000,
				})
			}
		})

		const result = await moderator(t).query(api.moderation.listReports, {
			paginationOpts: firstPage,
		})
		expect(result.page).toHaveLength(2)
		// Newest first: the comment report (2000) leads.
		expect(result.page.map((r) => r.targetType)).toEqual(['comment', 'post'])

		const [commentReport, postReport] = result.page
		expect(postReport?.reason).toBe('spam')
		expect(postReport?.note).toBe('looks fishy')
		expect(postReport?.target).toMatchObject({
			kind: 'post',
			moderationStatus: 'visible',
			post: { title: 'Reported', body: 'body', _id: postId },
		})
		expect(postReport?.target?.kind === 'post' && postReport.target.post.authorHandle).toMatch(
			/^[A-Za-z0-9_]+$/,
		)
		expect(commentReport?.target).toMatchObject({
			kind: 'comment',
			moderationStatus: 'visible',
			comment: { body: 'a comment', _id: commentId },
		})

		// The privacy invariant, recursively over the whole payload: no owner
		// identifiers, reporter identifiers, or emails anywhere.
		const keys = collectKeys(result)
		for (const key of PRIVATE_KEYS) expect(keys).not.toContain(key)
	})

	test('a report whose target has been deleted still lists, with target: null', async () => {
		const t = newT()
		const { postId } = await seedReportedPost(t)
		await t.run(async (ctx) => {
			await ctx.db.delete('forumPosts', postId)
		})
		const result = await moderator(t).query(api.moderation.listReports, {
			paginationOpts: firstPage,
		})
		expect(result.page).toHaveLength(1)
		expect(result.page[0]?.target).toBeNull()
	})
})

describe('setModerationStatus — hide and restore', () => {
	test('hide removes a post from the public feed; restore brings it back', async () => {
		const t = newT()
		const { postId } = await seedReportedPost(t)
		const mod = moderator(t)
		const targetKey = targetKeyFor('post', postId)

		await mod.mutation(api.moderation.setModerationStatus, {
			targetType: 'post',
			targetKey,
			status: 'hidden',
		})
		expect(
			(await t.query(api.community.listPosts, { paginationOpts: firstPage })).page,
		).toHaveLength(0)
		expect(await t.query(api.community.getPost, { postId })).toBeNull()

		await mod.mutation(api.moderation.setModerationStatus, {
			targetType: 'post',
			targetKey,
			status: 'visible',
		})
		const restored = await t.query(api.community.listPosts, { paginationOpts: firstPage })
		expect(restored.page.map((p) => p._id)).toEqual([postId])
	})

	test('refuses to touch author-removed content in either direction', async () => {
		const t = newT()
		const { alice, postId } = await seedReportedPost(t)
		await alice.mutation(api.community.deletePost, { postId })
		const targetKey = targetKeyFor('post', postId)
		for (const status of ['hidden', 'visible'] as const) {
			await expect(
				moderator(t).mutation(api.moderation.setModerationStatus, {
					targetType: 'post',
					targetKey,
					status,
				}),
			).rejects.toThrow(/author/i)
		}
	})

	test('hiding a comment keeps commentCount tracking visible comments; restore puts it back; both idempotent', async () => {
		const t = newT()
		const alice = credentialed(t, 'alice')
		const postId = await alice.mutation(api.community.createPost, { title: 'P', body: 'b' })
		const commentId = await alice.mutation(api.community.addComment, { postId, body: 'c' })
		const mod = moderator(t)
		const targetKey = targetKeyFor('comment', commentId)
		const count = async () => (await t.query(api.community.getPost, { postId }))?.commentCount

		expect(await count()).toBe(1)
		const hide = { targetType: 'comment', targetKey, status: 'hidden' } as const
		await mod.mutation(api.moderation.setModerationStatus, hide)
		expect(await count()).toBe(0)
		const comments = await t.query(api.community.listComments, {
			postId,
			paginationOpts: firstPage,
		})
		expect(comments.page).toHaveLength(0)
		await mod.mutation(api.moderation.setModerationStatus, hide) // idempotent re-hide
		expect(await count()).toBe(0) // not -1

		const restore = { targetType: 'comment', targetKey, status: 'visible' } as const
		await mod.mutation(api.moderation.setModerationStatus, restore)
		expect(await count()).toBe(1)
		await mod.mutation(api.moderation.setModerationStatus, restore) // idempotent re-restore
		expect(await count()).toBe(1) // not 2
		const restoredComments = await t.query(api.community.listComments, {
			postId,
			paginationOpts: firstPage,
		})
		expect(restoredComments.page.map((c) => c._id)).toEqual([commentId])
	})

	test('an author deleting an already-hidden comment does not double-decrement', async () => {
		const t = newT()
		const alice = credentialed(t, 'alice')
		const postId = await alice.mutation(api.community.createPost, { title: 'P', body: 'b' })
		const commentId = await alice.mutation(api.community.addComment, { postId, body: 'c' })
		await moderator(t).mutation(api.moderation.setModerationStatus, {
			targetType: 'comment',
			targetKey: targetKeyFor('comment', commentId),
			status: 'hidden',
		})
		await alice.mutation(api.community.deleteComment, { commentId })
		expect((await t.query(api.community.getPost, { postId }))?.commentCount).toBe(0) // not -1
	})
})

describe('resolveReport', () => {
	test('open -> resolved/dismissed leaves the queue; idempotent; non-moderator rejected', async () => {
		const t = newT()
		const { alice, bob, postId } = await seedReportedPost(t)
		const commentId = await alice.mutation(api.community.addComment, { postId, body: 'c' })
		await bob.mutation(api.community.reportContent, {
			targetType: 'comment',
			targetId: commentId,
			reason: 'other',
		})
		const mod = moderator(t)
		const queue = async () =>
			(await mod.query(api.moderation.listReports, { paginationOpts: firstPage })).page
		const [first, second] = await queue()
		expect([first, second]).toHaveLength(2)

		await expect(
			credentialed(t, 'eve', 'eve@x.test').mutation(api.moderation.resolveReport, {
				reportId: first!._id,
				resolution: 'resolved',
			}),
		).rejects.toThrow(/authorized/i)

		await mod.mutation(api.moderation.resolveReport, {
			reportId: first!._id,
			resolution: 'resolved',
		})
		expect((await queue()).map((r) => r._id)).toEqual([second!._id])
		await mod.mutation(api.moderation.resolveReport, {
			reportId: second!._id,
			resolution: 'dismissed',
		})
		expect(await queue()).toHaveLength(0)
		// Idempotent: closing an already-closed report is a no-op, not an error.
		await mod.mutation(api.moderation.resolveReport, {
			reportId: first!._id,
			resolution: 'dismissed',
		})
		const statuses = await t.run(async (ctx) =>
			(await ctx.db.query('forumReports').collect()).map((r) => r.status).sort(),
		)
		expect(statuses).toEqual(['dismissed', 'resolved'])
	})
})

describe('per-viewer blocks', () => {
	async function seedAlicePostAndComment(t: ReturnType<typeof newT>) {
		const alice = credentialed(t, 'alice')
		const bob = credentialed(t, 'bob')
		const bobPostId = await bob.mutation(api.community.createPost, { title: 'Bobs', body: 'post' })
		const alicePostId = await alice.mutation(api.community.createPost, {
			title: 'Alices',
			body: 'post',
		})
		const aliceCommentId = await alice.mutation(api.community.addComment, {
			postId: bobPostId,
			body: 'alice comments',
		})
		const alicePost = await t.query(api.community.getPost, { postId: alicePostId })
		return {
			alice,
			bob,
			bobPostId,
			alicePostId,
			aliceCommentId,
			aliceHandle: alicePost!.authorHandle,
		}
	}

	test('blocking hides the author for the blocker only; unblocking restores', async () => {
		const t = newT()
		const { bob, bobPostId, alicePostId, aliceHandle } = await seedAlicePostAndComment(t)

		await bob.mutation(api.community.blockAuthor, { handle: aliceHandle })

		// Blocker: alice's post gone from feed + detail; her comment filtered.
		const bobFeed = await bob.query(api.community.listPosts, { paginationOpts: firstPage })
		expect(bobFeed.page.map((p) => p._id)).toEqual([bobPostId])
		expect(await bob.query(api.community.getPost, { postId: alicePostId })).toBeNull()
		const bobComments = await bob.query(api.community.listComments, {
			postId: bobPostId,
			paginationOpts: firstPage,
		})
		expect(bobComments.page).toHaveLength(0)

		// Anonymous/unauthenticated readers are unaffected.
		const anonFeed = await t.query(api.community.listPosts, { paginationOpts: firstPage })
		expect(anonFeed.page).toHaveLength(2)
		expect((await t.query(api.community.getPost, { postId: alicePostId }))?._id).toBe(alicePostId)
		const anonComments = await t.query(api.community.listComments, {
			postId: bobPostId,
			paginationOpts: firstPage,
		})
		expect(anonComments.page).toHaveLength(1)

		// Unblock restores bob's view. listMyBlocks exposes handle + profileId only.
		const blocks = await bob.query(api.community.listMyBlocks, {})
		expect(blocks).toHaveLength(1)
		expect(blocks[0]?.handle).toBe(aliceHandle)
		const keys = collectKeys(blocks)
		for (const key of PRIVATE_KEYS) expect(keys).not.toContain(key)

		await bob.mutation(api.community.unblockAuthor, { profileId: blocks[0]!.profileId })
		expect(await bob.query(api.community.listMyBlocks, {})).toHaveLength(0)
		const restored = await bob.query(api.community.listPosts, { paginationOpts: firstPage })
		expect(restored.page).toHaveLength(2)
	})

	test('cannot block yourself; blocking requires a credentialed account; unknown handle rejected; idempotent re-block', async () => {
		const t = newT()
		const { alice, bob, aliceHandle } = await seedAlicePostAndComment(t)
		await expect(
			alice.mutation(api.community.blockAuthor, { handle: aliceHandle }),
		).rejects.toThrow(/yourself/i)
		await expect(t.mutation(api.community.blockAuthor, { handle: aliceHandle })).rejects.toThrow(
			/authenticat/i,
		)
		await expect(
			anon(t, 'a').mutation(api.community.blockAuthor, { handle: aliceHandle }),
		).rejects.toThrow(/account/i)
		await expect(
			bob.mutation(api.community.blockAuthor, { handle: 'NoSuchHandle999' }),
		).rejects.toThrow(/not found/i)
		await bob.mutation(api.community.blockAuthor, { handle: aliceHandle })
		await bob.mutation(api.community.blockAuthor, { handle: aliceHandle }) // idempotent
		expect(await bob.query(api.community.listMyBlocks, {})).toHaveLength(1)
	})

	test('account deletion removes block rows in both directions', async () => {
		const t = newT()
		const { alice, bob, aliceHandle, bobPostId } = await seedAlicePostAndComment(t)
		const bobHandle = (await t.query(api.community.getPost, { postId: bobPostId }))!.authorHandle
		await bob.mutation(api.community.blockAuthor, { handle: aliceHandle }) // bob -> alice's profile
		await alice.mutation(api.community.blockAuthor, { handle: bobHandle }) // alice -> bob's profile

		// Exercise the internal cascade with the same anonymous owner identity.
		await t
			.withIdentity({ subject: 'alice', isAnonymous: true })
			.action(internal.account.deleteAccountData, {})

		// Alice-as-blocker rows AND rows pointing at alice's profile are both gone.
		const remaining = await t.run(async (ctx) => await ctx.db.query('communityBlocks').collect())
		expect(remaining).toHaveLength(0)
		expect(await bob.query(api.community.listMyBlocks, {})).toHaveLength(0)
	})
})
