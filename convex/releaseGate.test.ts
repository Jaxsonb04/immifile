/// <reference types="vite/client" />
import { convexTest } from 'convex-test'
import { describe, expect, test } from 'vitest'
import { api } from './_generated/api'
import releasePolicy from '../release-policy.json'
import schema from './schema'

// Deliberately NOT mocked: this suite is the one that runs against the real
// release-policy.json. Every other convex suite opens the gate so it can test
// the feature implementation underneath; this one proves the shipped policy
// actually closes those endpoints on the server, where a hidden tab and a
// default-denied deep link cannot help — a Convex function is a public
// internet endpoint and an anonymous session token is free to mint.

const modules = import.meta.glob('./**/*.ts')
const newT = () => convexTest(schema, modules)

const NOT_IN_RELEASE = /not available in this release/i
const firstPage = { numItems: 10, cursor: null }

describe('release policy is enforced on the server, not only in the UI', () => {
	test('the shipped policy matches the reviewed release surface', () => {
		expect(releasePolicy).toEqual({
			filingPreparation: false,
			assistant: true,
			community: false,
			socialLogin: true,
			passwordRecovery: false,
		})
	})

	test('community reads are closed even to an unauthenticated caller', async () => {
		const t = newT()
		await expect(t.query(api.community.listPosts, { paginationOpts: firstPage })).rejects.toThrow(
			NOT_IN_RELEASE,
		)
		await expect(t.query(api.news.latestNews, {})).rejects.toThrow(NOT_IN_RELEASE)
	})

	test('community writes are closed to a fully credentialed account', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })
		await expect(
			alice.mutation(api.community.createPost, { title: 'Hello', body: 'world' }),
		).rejects.toThrow(NOT_IN_RELEASE)
		await expect(alice.mutation(api.community.ensureProfile, {})).rejects.toThrow(NOT_IN_RELEASE)
		await expect(alice.mutation(api.community.blockAuthor, { handle: 'someone' })).rejects.toThrow(
			NOT_IN_RELEASE,
		)
	})

	test('moderation surfaces are closed', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })
		await expect(
			alice.query(api.moderation.listReports, { paginationOpts: firstPage }),
		).rejects.toThrow(NOT_IN_RELEASE)
	})

	// The filing surface is the one that stores A-Numbers, passport and I-94
	// numbers, addresses, and parents' names. The shipped privacy policy says
	// this release does not collect them, so the endpoints must agree.
	test('the filing PII write path is closed to a credentialed account', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })
		await expect(alice.query(api.applicants.listApplicants, {})).rejects.toThrow(NOT_IN_RELEASE)
		await expect(alice.query(api.applications.listApplications, {})).rejects.toThrow(NOT_IN_RELEASE)
		await expect(alice.query(api.home.getHomeDashboard, {})).rejects.toThrow(NOT_IN_RELEASE)
		await expect(alice.query(api.renewals.listRenewalItems, {})).rejects.toThrow(NOT_IN_RELEASE)
	})

	// Anonymous identities are free and unlimited, so they are the realistic
	// attacker, not a credentialed account.
	test('an anonymous session cannot open an upload URL', async () => {
		const t = newT()
		const anonymous = t.withIdentity({ subject: 'anon-1', isAnonymous: true })
		await expect(anonymous.mutation(api.documents.generateUploadUrl, {})).rejects.toThrow(
			NOT_IN_RELEASE,
		)
	})

	// The assistant ships in this release. Prove the gate is open with the
	// quota query (it calls assertFeatureEnabled('assistant') first, and it is
	// the only assistant surface that never reaches the OpenAI API — the
	// actions would attempt a real model call once past the gate).
	test('assistant surfaces are open in this release', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })
		await expect(alice.query(api.assistantQuota.dailyUsage, {})).resolves.toMatchObject({
			used: 0,
		})
	})

	test('the filing-linkage read on the shipping Cases surface is closed', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })
		await expect(alice.query(api.cases.listLinkableApplications, {})).rejects.toThrow(
			NOT_IN_RELEASE,
		)
	})
})

describe('the shipping surface stays open', () => {
	test('a credentialed account can still track and read a case', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })
		const caseId = await alice.mutation(api.cases.createCase, { receiptNumber: 'EAC1234567890' })
		await expect(alice.query(api.cases.listCases, {})).resolves.toHaveLength(1)
		await expect(alice.query(api.cases.getCase, { caseId })).resolves.toMatchObject({
			receiptNumber: 'EAC1234567890',
		})
	})

	test('tab-intro preferences still work for a temporary session', async () => {
		const t = newT()
		const anonymous = t.withIdentity({ subject: 'anon-1', isAnonymous: true })
		await anonymous.mutation(api.preferences.setPreference, {
			key: 'casesIntroDismissed',
			value: true,
		})
		await expect(
			anonymous.query(api.preferences.getPreference, { key: 'casesIntroDismissed' }),
		).resolves.toBe(true)
	})

	test('explicit OpenAI consent is stored per owner before assistant use', async () => {
		const t = newT()
		const anonymous = t.withIdentity({ subject: 'anon-consent', isAnonymous: true })

		await expect(
			anonymous.query(api.preferences.getPreference, { key: 'assistantOpenAIConsent' }),
		).resolves.toBe(false)
		await anonymous.mutation(api.preferences.setPreference, {
			key: 'assistantOpenAIConsent',
			value: true,
		})

		await expect(
			anonymous.query(api.preferences.getPreference, { key: 'assistantOpenAIConsent' }),
		).resolves.toBe(true)
	})
})
