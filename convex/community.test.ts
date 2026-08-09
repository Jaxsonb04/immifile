/// <reference types="vite/client" />
import { convexTest } from 'convex-test'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { api } from './_generated/api'
import schema from './schema'

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

// A credentialed (non-anonymous) account: no isAnonymous claim on the identity.
const credentialed = (t: ReturnType<typeof newT>, subject: string) => t.withIdentity({ subject })
// An anonymous Better Auth session carries isAnonymous: true.
const anon = (t: ReturnType<typeof newT>, subject: string) =>
	t.withIdentity({ subject, isAnonymous: true })

const firstPage = { numItems: 50, cursor: null }

beforeEach(() => {
	vi.stubEnv('DEV_SEED_ENABLED', 'true')
})

describe('write gate — identity + credentials', () => {
	test('unauthenticated callers cannot write', async () => {
		const t = newT()
		await expect(t.mutation(api.community.ensureProfile, {})).rejects.toThrow(/authenticat/i)
		await expect(t.mutation(api.community.createPost, { title: 'x', body: 'y' })).rejects.toThrow(
			/authenticat/i,
		)
	})

	test('anonymous accounts cannot post, comment, or report', async () => {
		const t = newT()
		const a = anon(t, 'anon-1')
		await expect(
			a.mutation(api.community.createPost, { title: 'Hi', body: 'there' }),
		).rejects.toThrow(/account/i)
		await expect(a.mutation(api.community.ensureProfile, {})).rejects.toThrow(/account/i)
	})

	test('a credentialed account can post', async () => {
		const t = newT()
		const alice = credentialed(t, 'alice')
		await expect(
			alice.mutation(api.community.createPost, { title: 'Hello', body: 'world' }),
		).resolves.toBeDefined()
	})

	test('every write mutation rejects unauthenticated and anonymous callers', async () => {
		const t = newT()
		const alice = credentialed(t, 'alice')
		const postId = await alice.mutation(api.community.createPost, { title: 'P', body: 'b' })
		const commentId = await alice.mutation(api.community.addComment, { postId, body: 'c' })
		const a = anon(t, 'anon-w')

		// The credentialed gate is the first line of every write, so it fires before
		// any ownership/existence check even for a foreign caller.
		const report = { targetType: 'post', targetId: postId, reason: 'spam' } as const
		await expect(t.mutation(api.community.addComment, { postId, body: 'x' })).rejects.toThrow(
			/authenticat/i,
		)
		await expect(a.mutation(api.community.addComment, { postId, body: 'x' })).rejects.toThrow(
			/account/i,
		)
		await expect(t.mutation(api.community.reportContent, report)).rejects.toThrow(/authenticat/i)
		await expect(a.mutation(api.community.reportContent, report)).rejects.toThrow(/account/i)
		await expect(t.mutation(api.community.deletePost, { postId })).rejects.toThrow(/authenticat/i)
		await expect(a.mutation(api.community.deletePost, { postId })).rejects.toThrow(/account/i)
		await expect(t.mutation(api.community.deleteComment, { commentId })).rejects.toThrow(
			/authenticat/i,
		)
		await expect(a.mutation(api.community.deleteComment, { commentId })).rejects.toThrow(/account/i)
	})
})

describe('profiles', () => {
	test('ensureProfile is idempotent and never mutates an existing handle', async () => {
		const t = newT()
		const alice = credentialed(t, 'alice')
		const first = await alice.mutation(api.community.ensureProfile, { handle: 'AliceHandle' })
		const again = await alice.mutation(api.community.ensureProfile, { handle: 'DifferentNow' })
		expect(again).toBe(first)
		const profile = await alice.query(api.community.getMyProfile, {})
		expect(profile?.handle).toBe('AliceHandle')
	})

	test('auto-generates a valid handle when none is supplied', async () => {
		const t = newT()
		const alice = credentialed(t, 'alice')
		await alice.mutation(api.community.ensureProfile, {})
		const profile = await alice.query(api.community.getMyProfile, {})
		expect(profile?.handle).toMatch(/^[A-Za-z0-9_]{3,20}$/)
	})

	test('rejects an invalid handle and a duplicate handle', async () => {
		const t = newT()
		const alice = credentialed(t, 'alice')
		const bob = credentialed(t, 'bob')
		await expect(
			alice.mutation(api.community.ensureProfile, { handle: 'no spaces' }),
		).rejects.toThrow(/handle/i)
		await alice.mutation(api.community.ensureProfile, { handle: 'Taken' })
		await expect(bob.mutation(api.community.ensureProfile, { handle: 'Taken' })).rejects.toThrow(
			/taken/i,
		)
	})

	test('getMyProfile returns null for a caller with no profile', async () => {
		const t = newT()
		expect(await credentialed(t, 'nobody').query(api.community.getMyProfile, {})).toBeNull()
		expect(await t.query(api.community.getMyProfile, {})).toBeNull() // unauthenticated
	})
})

describe('posts — create, validate, read', () => {
	test('creates a post and reads it back sanitized', async () => {
		const t = newT()
		const alice = credentialed(t, 'alice')
		const postId = await alice.mutation(api.community.createPost, {
			title: '  Renewing my EAD  ',
			body: 'How long does it take?',
		})
		const post = await alice.query(api.community.getPost, { postId })
		expect(post).toMatchObject({
			title: 'Renewing my EAD', // trimmed
			body: 'How long does it take?',
			commentCount: 0,
			isMine: true,
		})
		expect(post?.authorHandle).toMatch(/^[A-Za-z0-9_]+$/)
	})

	test.each([
		{ title: '', body: 'ok' },
		{ title: '   ', body: 'ok' },
		{ title: 'ok', body: '' },
		{ title: 'x'.repeat(121), body: 'ok' },
	])('rejects invalid post %o', async (args) => {
		const t = newT()
		await expect(
			credentialed(t, 'alice').mutation(api.community.createPost, args),
		).rejects.toThrow()
	})

	test('listPosts is a public read (works unauthenticated) and only shows visible posts', async () => {
		const t = newT()
		const alice = credentialed(t, 'alice')
		const postId = await alice.mutation(api.community.createPost, { title: 'Public', body: 'read' })
		const page = await t.query(api.community.listPosts, { paginationOpts: firstPage })
		expect(page.page).toHaveLength(1)
		expect(page.page[0]?._id).toBe(postId)

		await alice.mutation(api.community.deletePost, { postId })
		const after = await t.query(api.community.listPosts, { paginationOpts: firstPage })
		expect(after.page).toHaveLength(0)
	})

	test('feed is ordered by newest activity; a new comment bumps a post to the top', async () => {
		const t = newT()
		const alice = credentialed(t, 'alice')
		const a = await alice.mutation(api.community.createPost, { title: 'A', body: 'a' })
		const b = await alice.mutation(api.community.createPost, { title: 'B', body: 'b' })
		// Pin deterministic activity times (a older than b) — Date.now() can collide
		// within a test, so don't rely on creation order for the timestamp.
		await t.run(async (ctx) => {
			await ctx.db.patch('forumPosts', a, { lastActivityAt: 1000 })
			await ctx.db.patch('forumPosts', b, { lastActivityAt: 2000 })
		})
		expect(
			(await t.query(api.community.listPosts, { paginationOpts: firstPage })).page.map(
				(p) => p._id,
			),
		).toEqual([b, a])

		// A new comment on `a` bumps its lastActivityAt to now (>> 2000), so it leads.
		await alice.mutation(api.community.addComment, { postId: a, body: 'bump' })
		expect(
			(await t.query(api.community.listPosts, { paginationOpts: firstPage })).page.map(
				(p) => p._id,
			),
		).toEqual([a, b])
	})

	test('honors the requested page size (pagination flows through)', async () => {
		const t = newT()
		const alice = credentialed(t, 'alice')
		await alice.mutation(api.community.createPost, { title: 'A', body: 'a' })
		await alice.mutation(api.community.createPost, { title: 'B', body: 'b' })
		const page = await t.query(api.community.listPosts, {
			paginationOpts: { numItems: 1, cursor: null },
		})
		expect(page.page).toHaveLength(1)
		expect(page.isDone).toBe(false)
	})
})

describe('privacy — public reads never leak the owner identity', () => {
	test('a listed/fetched post exposes no authorOwnerId, ownerId, or reportCount', async () => {
		const t = newT()
		const alice = credentialed(t, 'alice')
		const postId = await alice.mutation(api.community.createPost, { title: 'Hi', body: 'body' })
		// A different reporter so reportCount is non-zero server-side.
		await credentialed(t, 'bob').mutation(api.community.reportContent, {
			targetType: 'post',
			targetId: postId,
			reason: 'spam',
		})

		const reader = anon(t, 'reader') // an anonymous reader
		const listed = (await reader.query(api.community.listPosts, { paginationOpts: firstPage }))
			.page[0]
		const fetched = await reader.query(api.community.getPost, { postId })
		for (const shape of [listed, fetched]) {
			const keys = Object.keys(shape ?? {})
			expect(keys).not.toContain('authorOwnerId')
			expect(keys).not.toContain('ownerId')
			expect(keys).not.toContain('reportCount')
			expect(shape?.isMine).toBe(false) // reader is not the author
		}
	})

	test('isMine is true only for the author', async () => {
		const t = newT()
		const alice = credentialed(t, 'alice')
		const postId = await alice.mutation(api.community.createPost, { title: 'Mine', body: 'b' })
		expect((await alice.query(api.community.getPost, { postId }))?.isMine).toBe(true)
		expect((await credentialed(t, 'bob').query(api.community.getPost, { postId }))?.isMine).toBe(
			false,
		)
		expect((await t.query(api.community.getPost, { postId }))?.isMine).toBe(false)
	})
})

describe('comments', () => {
	test('adds a comment, bumps commentCount, lists oldest-first, sanitized', async () => {
		const t = newT()
		const alice = credentialed(t, 'alice')
		const bob = credentialed(t, 'bob')
		const postId = await alice.mutation(api.community.createPost, { title: 'Q', body: 'body' })
		await bob.mutation(api.community.addComment, { postId, body: 'first' })
		await alice.mutation(api.community.addComment, { postId, body: 'second' })

		expect((await t.query(api.community.getPost, { postId }))?.commentCount).toBe(2)
		const comments = await t.query(api.community.listComments, {
			postId,
			paginationOpts: firstPage,
		})
		expect(comments.page.map((c) => c.body)).toEqual(['first', 'second'])
		const keys = Object.keys(comments.page[0] ?? {})
		expect(keys).not.toContain('authorOwnerId')
		expect(keys).not.toContain('ownerId')
		expect(keys).not.toContain('reportCount')
		expect(comments.page[0]?.isMine).toBe(false) // listed by an anonymous reader
	})

	test('cannot comment on a missing or removed post', async () => {
		const t = newT()
		const alice = credentialed(t, 'alice')
		const postId = await alice.mutation(api.community.createPost, { title: 'P', body: 'b' })
		await alice.mutation(api.community.deletePost, { postId })
		await expect(
			credentialed(t, 'bob').mutation(api.community.addComment, { postId, body: 'hi' }),
		).rejects.toThrow(/not found/i)
	})

	test('comments under a hidden or removed post are not listable', async () => {
		const t = newT()
		const alice = credentialed(t, 'alice')
		const postId = await alice.mutation(api.community.createPost, { title: 'P', body: 'b' })
		await alice.mutation(api.community.addComment, { postId, body: 'visible-comment' })
		// Simulate an M4-T3 moderator hide directly on the row.
		await t.run(async (ctx) => {
			await ctx.db.patch('forumPosts', postId, { moderationStatus: 'hidden' })
		})
		const comments = await t.query(api.community.listComments, {
			postId,
			paginationOpts: firstPage,
		})
		expect(comments.page).toHaveLength(0)
	})
})

describe('author deletion (tombstone)', () => {
	test('only the author can delete; delete is idempotent', async () => {
		const t = newT()
		const alice = credentialed(t, 'alice')
		const postId = await alice.mutation(api.community.createPost, { title: 'P', body: 'b' })
		await expect(
			credentialed(t, 'bob').mutation(api.community.deletePost, { postId }),
		).rejects.toThrow(/not found/i)
		await alice.mutation(api.community.deletePost, { postId })
		await expect(alice.mutation(api.community.deletePost, { postId })).resolves.toBeNull() // idempotent
		expect(await alice.query(api.community.getPost, { postId })).toBeNull()
	})

	test('deleting a comment decrements commentCount exactly once (idempotent)', async () => {
		const t = newT()
		const alice = credentialed(t, 'alice')
		const postId = await alice.mutation(api.community.createPost, { title: 'P', body: 'b' })
		const commentId = await alice.mutation(api.community.addComment, { postId, body: 'c' })
		expect((await t.query(api.community.getPost, { postId }))?.commentCount).toBe(1)
		await alice.mutation(api.community.deleteComment, { commentId })
		await alice.mutation(api.community.deleteComment, { commentId }) // double-delete
		expect((await t.query(api.community.getPost, { postId }))?.commentCount).toBe(0) // not -1
		const comments = await t.query(api.community.listComments, {
			postId,
			paginationOpts: firstPage,
		})
		expect(comments.page).toHaveLength(0)
	})
})

describe('reports', () => {
	async function reportCountOf(t: ReturnType<typeof newT>, postId: string): Promise<number> {
		return await t.run(async (ctx) => {
			const post = await ctx.db.get('forumPosts', postId as never)
			return (post as { reportCount: number } | null)?.reportCount ?? -1
		})
	}

	test('a report increments reportCount and records an open report', async () => {
		const t = newT()
		const alice = credentialed(t, 'alice')
		const bob = credentialed(t, 'bob')
		const postId = await alice.mutation(api.community.createPost, { title: 'P', body: 'b' })
		await bob.mutation(api.community.reportContent, {
			targetType: 'post',
			targetId: postId,
			reason: 'harassment',
			note: 'not ok',
		})
		expect(await reportCountOf(t, postId)).toBe(1)
		const report = await t.run(async (ctx) => (await ctx.db.query('forumReports').collect())[0])
		expect(report).toMatchObject({ status: 'open', reason: 'harassment', targetType: 'post' })
	})

	test('dedupes repeat reports from the same reporter but counts distinct reporters', async () => {
		const t = newT()
		const alice = credentialed(t, 'alice')
		const bob = credentialed(t, 'bob')
		const carol = credentialed(t, 'carol')
		const postId = await alice.mutation(api.community.createPost, { title: 'P', body: 'b' })
		const r1 = await bob.mutation(api.community.reportContent, {
			targetType: 'post',
			targetId: postId,
			reason: 'spam',
		})
		const r2 = await bob.mutation(api.community.reportContent, {
			targetType: 'post',
			targetId: postId,
			reason: 'spam',
		})
		expect(r2).toBe(r1) // same report returned, not a new one
		await carol.mutation(api.community.reportContent, {
			targetType: 'post',
			targetId: postId,
			reason: 'other',
		})
		expect(await reportCountOf(t, postId)).toBe(2)
		const count = await t.run(async (ctx) => (await ctx.db.query('forumReports').collect()).length)
		expect(count).toBe(2)
	})

	test('cannot report your own content or non-visible content', async () => {
		const t = newT()
		const alice = credentialed(t, 'alice')
		const postId = await alice.mutation(api.community.createPost, { title: 'P', body: 'b' })
		await expect(
			alice.mutation(api.community.reportContent, {
				targetType: 'post',
				targetId: postId,
				reason: 'spam',
			}),
		).rejects.toThrow(/your own/i)
		await alice.mutation(api.community.deletePost, { postId })
		await expect(
			credentialed(t, 'bob').mutation(api.community.reportContent, {
				targetType: 'post',
				targetId: postId,
				reason: 'spam',
			}),
		).rejects.toThrow(/not found/i)
	})
})

describe('account deletion cascade wipes all forum data', () => {
	test('erasing an owner removes their profile, posts, comments, reports; foreign counts adjust', async () => {
		const t = newT()
		const alice = credentialed(t, 'alice')
		const bob = credentialed(t, 'bob')

		const bobPost = await bob.mutation(api.community.createPost, { title: 'Bob', body: 'b' })
		await alice.mutation(api.community.addComment, { postId: bobPost, body: 'from alice' })
		const alicePost = await alice.mutation(api.community.createPost, { title: 'Alice', body: 'a' })
		await alice.mutation(api.community.addComment, { postId: alicePost, body: 'own comment' })
		// A report alice FILED (against bob) ...
		await alice.mutation(api.community.reportContent, {
			targetType: 'post',
			targetId: bobPost,
			reason: 'spam',
		})
		// ... and a third-party report FILED AGAINST alice's content (its note may
		// describe her erased post) — erasure must remove this one too.
		await bob.mutation(api.community.reportContent, {
			targetType: 'post',
			targetId: alicePost,
			reason: 'harassment',
			note: 'about alice',
		})

		// Bob's post now has 1 (visible) comment from alice.
		expect((await t.query(api.community.getPost, { postId: bobPost }))?.commentCount).toBe(1)

		// deleteAccountData is the anonymous-session path (same owner identity).
		await t
			.withIdentity({ subject: 'alice', isAnonymous: true })
			.action(api.account.deleteAccountData, {})

		const counts = await t.run(async (ctx) => ({
			profiles: (await ctx.db.query('communityProfiles').collect()).length,
			posts: (await ctx.db.query('forumPosts').collect()).length,
			comments: (await ctx.db.query('forumComments').collect()).length,
			reports: (await ctx.db.query('forumReports').collect()).length,
		}))
		// Only bob's profile + post survive; BOTH reports are gone (alice's filed one
		// and bob's report targeting alice's now-deleted post).
		expect(counts).toEqual({ profiles: 1, posts: 1, comments: 0, reports: 0 })

		// Bob's post survives with its commentCount decremented for alice's erased comment.
		const survivor = await t.query(api.community.getPost, { postId: bobPost })
		expect(survivor?.commentCount).toBe(0)
		// Alice's profile is gone. Her previously issued session can observe the
		// empty state while Better Auth finishes deleting the identity, but the
		// tombstone still prevents that session from recreating owner-scoped data.
		await expect(alice.query(api.community.getMyProfile, {})).resolves.toBeNull()
		await expect(
			alice.mutation(api.community.createPost, { title: 'Stale', body: 'session' }),
		).rejects.toThrow(/deletion is in progress/i)
	})
})
