/// <reference types="vite/client" />
import { convexTest } from 'convex-test'
import { expect, test } from 'vitest'
import { api } from './_generated/api'
import schema from './schema'

const modules = import.meta.glob('./**/*.ts')

test('a shipping case write cannot reopen filing preparation through an application link', async () => {
	const t = convexTest(schema, modules)
	const applicationId = await t.run(async (ctx) => {
		const applicantId = await ctx.db.insert('applicants', {
			ownerId: 'alice', displayName: 'Alice', isSelf: true, profile: {},
			updatedAt: Date.now(),
		})
		return await ctx.db.insert('applications', {
			ownerId: 'alice', applicantId, formType: 'i765', applicationKind: 'renewal',
			status: 'filed', completedStepCount: 0, totalStepCount: 1, updatedAt: Date.now(),
		})
	})
	const alice = t.withIdentity({ subject: 'alice', tokenIdentifier: 'alice' })
	await expect(alice.mutation(api.cases.createCase, {
		receiptNumber: 'EAC1234567890', applicationId,
	})).rejects.toThrow(/not available in this release/i)
	expect(await alice.query(api.cases.listCases, {})).toEqual([])
	expect(await t.run((ctx) => ctx.db.get('applications', applicationId))).toMatchObject({ status: 'filed' })
})
