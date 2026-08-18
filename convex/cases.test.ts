/// <reference types="vite/client" />
import { convexTest } from 'convex-test'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { api } from './_generated/api'
import schema from './schema'
import { EVIDENCE_CONTRACT_VERSION } from './shared/evidenceRequirements'

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

beforeEach(() => {
	vi.stubEnv('DEV_SEED_ENABLED', 'true')
})

const RECEIPT = 'EAC1234567890'

describe('createCase', () => {
	test('tracks a valid receipt and seeds a one-entry timeline', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })
		const caseId = await alice.mutation(api.cases.createCase, { receiptNumber: RECEIPT })
		const tracked = await alice.query(api.cases.getCase, { caseId })
		expect(tracked).toMatchObject({ receiptNumber: RECEIPT, status: 'caseReceived' })
		expect(tracked!.statusHistory).toHaveLength(1)
		expect(tracked!.statusHistory[0]).toMatchObject({ status: 'caseReceived' })
	})

	test('requires a permanent account before storing a receipt number', async () => {
		const t = newT()
		const temporary = t.withIdentity({ subject: 'temp', isAnonymous: true })
		await expect(
			temporary.mutation(api.cases.createCase, { receiptNumber: RECEIPT }),
		).rejects.toThrow(/account/i)
	})

	test('normalizes case and whitespace before validating', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })
		const caseId = await alice.mutation(api.cases.createCase, {
			receiptNumber: '  eac 123 456 7890 ',
		})
		const tracked = await alice.query(api.cases.getCase, { caseId })
		expect(tracked!.receiptNumber).toBe(RECEIPT)
	})

	test.each(['EAC123', 'EA1234567890', 'EAC12345678901', '1234567890EAC', 'EACABCDEFGHIJ'])(
		'rejects malformed receipt %s',
		async (bad) => {
			const t = newT()
			const alice = t.withIdentity({ subject: 'alice' })
			await expect(alice.mutation(api.cases.createCase, { receiptNumber: bad })).rejects.toThrow(
				/receipt number/i,
			)
		},
	)

	test('rejects a duplicate receipt for the same owner, but not across owners', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })
		const bob = t.withIdentity({ subject: 'bob' })
		await alice.mutation(api.cases.createCase, { receiptNumber: RECEIPT })
		await expect(alice.mutation(api.cases.createCase, { receiptNumber: RECEIPT })).rejects.toThrow(
			/already tracking/i,
		)
		// Owner-scoped uniqueness: Bob can track the same receipt.
		await expect(
			bob.mutation(api.cases.createCase, { receiptNumber: RECEIPT }),
		).resolves.toBeDefined()
	})

	test('rejects a 101st tracked case so every accepted case remains listable', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })

		for (let index = 0; index < 100; index += 1) {
			await alice.mutation(api.cases.createCase, {
				receiptNumber: `EAC${String(index).padStart(10, '0')}`,
			})
		}

		await expect(
			alice.mutation(api.cases.createCase, { receiptNumber: 'WAC9999999999' }),
		).rejects.toThrow(/up to 100 cases/i)
		expect(await alice.query(api.cases.listCases, {})).toHaveLength(100)
	})

	test('links an owned application; rejects a foreign one', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })
		const applicantId = await alice.mutation(api.applicants.createApplicant, {
			displayName: 'Alice',
			isSelf: true,
		})
		const applicationId = await alice.mutation(api.applications.createApplication, {
			applicantId,
			formType: 'i765',
			applicationKind: 'renewal',
		})
		const caseId = await alice.mutation(api.cases.createCase, {
			receiptNumber: RECEIPT,
			applicationId,
		})
		expect((await alice.query(api.cases.getCase, { caseId }))!.applicationId).toBe(applicationId)

		const bob = t.withIdentity({ subject: 'bob' })
		await expect(
			bob.mutation(api.cases.createCase, { receiptNumber: 'WAC9876543210', applicationId }),
		).rejects.toThrow('Application not found')
	})
})

describe('addStatusUpdate', () => {
	test('appends to the timeline and advances the current status', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })
		const caseId = await alice.mutation(api.cases.createCase, { receiptNumber: RECEIPT })
		await alice.mutation(api.cases.addStatusUpdate, {
			caseId,
			status: 'biometrics',
			note: 'ASC appointment 8/1',
		})
		const tracked = await alice.query(api.cases.getCase, { caseId })
		expect(tracked!.status).toBe('biometrics')
		expect(tracked!.statusHistory).toHaveLength(2)
		expect(tracked!.statusHistory[1]).toMatchObject({
			status: 'biometrics',
			note: 'ASC appointment 8/1',
		})
	})

	test('backdates when occurredAt is provided', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })
		const caseId = await alice.mutation(api.cases.createCase, { receiptNumber: RECEIPT })
		await alice.mutation(api.cases.addStatusUpdate, {
			caseId,
			status: 'approved',
			occurredAt: 1_700_000_000_000,
		})
		const tracked = await alice.query(api.cases.getCase, { caseId })
		expect(tracked!.statusHistory[1]!.occurredAt).toBe(1_700_000_000_000)
	})

	test('a temporary session cannot update an existing case', async () => {
		const t = newT()
		const credentialed = t.withIdentity({ subject: 'same-owner' })
		const temporary = t.withIdentity({ subject: 'same-owner', isAnonymous: true })
		const caseId = await credentialed.mutation(api.cases.createCase, {
			receiptNumber: RECEIPT,
		})

		await expect(
			temporary.mutation(api.cases.addStatusUpdate, {
				caseId,
				status: 'approved',
				note: 'must not persist',
			}),
		).rejects.toThrow(/account/i)

		const tracked = await credentialed.query(api.cases.getCase, { caseId })
		expect(tracked!.status).toBe('caseReceived')
		expect(tracked!.statusHistory).toHaveLength(1)
	})
})

describe('authorization / owner isolation', () => {
	test('all reads and writes are owner-scoped', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })
		const bob = t.withIdentity({ subject: 'bob' })
		const caseId = await alice.mutation(api.cases.createCase, { receiptNumber: RECEIPT })

		expect(await bob.query(api.cases.getCase, { caseId })).toBeNull()
		await expect(
			bob.mutation(api.cases.addStatusUpdate, { caseId, status: 'approved' }),
		).rejects.toThrow('Case not found')
		expect(await bob.query(api.cases.listCases, {})).toHaveLength(0)
		expect(await alice.query(api.cases.listCases, {})).toHaveLength(1)
	})

	test('unauthenticated reads reveal no data and writes remain authentication-gated', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })
		const caseId = await alice.mutation(api.cases.createCase, { receiptNumber: RECEIPT })

		// Reactive reads may rerun during a client token handoff. A neutral result
		// keeps the UI alive without exposing another owner's row.
		await expect(t.query(api.cases.listCases, {})).resolves.toEqual([])
		await expect(t.query(api.cases.getCase, { caseId })).resolves.toBeNull()
		await expect(t.mutation(api.cases.createCase, { receiptNumber: RECEIPT })).rejects.toThrow(
			'Not authenticated',
		)
	})
})

describe('deleteCase', () => {
	test('removes only the owner’s tracked case', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })
		const bob = t.withIdentity({ subject: 'bob' })
		const caseId = await alice.mutation(api.cases.createCase, { receiptNumber: RECEIPT })

		await expect(bob.mutation(api.cases.deleteCase, { caseId })).rejects.toThrow('Case not found')
		await expect(alice.mutation(api.cases.deleteCase, { caseId })).resolves.toBeNull()
		expect(await alice.query(api.cases.getCase, { caseId })).toBeNull()
	})
})

// Receipt-number reconcile (workflow repair, filed lifecycle): a real receipt
// is decisive evidence of filing, so linking a draft transitions it to filed.
describe('receipt-number filing reconcile', () => {
	async function setupDraft(t: ReturnType<typeof newT>) {
		const alice = t.withIdentity({ subject: 'alice' })
		const applicantId = await alice.mutation(api.applicants.createApplicant, {
			displayName: 'Alice',
			isSelf: true,
		})
		const applicationId = await alice.mutation(api.applications.createApplication, {
			applicantId,
			formType: 'i765',
			applicationKind: 'renewal',
		})
		return { alice, applicantId, applicationId }
	}

	test('linking a draft marks it filed with a filing date', async () => {
		const t = newT()
		const { alice, applicationId } = await setupDraft(t)
		const before = Date.now()
		await alice.mutation(api.cases.createCase, { receiptNumber: RECEIPT, applicationId })
		const { application, readiness, requirements } = (await alice.query(
			api.applications.getApplication,
			{ applicationId },
		))!
		expect(application.status).toBe('filed')
		expect(application.filedAt).toBeGreaterThanOrEqual(before)
		expect(application.filingEvidenceContractVersion).toBe(EVIDENCE_CONTRACT_VERSION)
		expect(readiness.isReadyToFile).toBe(false)
		expect(requirements.map((requirement) => requirement.requirementKey).sort()).toEqual([
			'eadCard',
			'entryDocument',
			'passportPhoto',
		])
	})

	test('linking an already-filed application keeps its original filedAt', async () => {
		const t = newT()
		const { alice, applicationId } = await setupDraft(t)
		// Within the allowed window (a filing can't predate the application).
		const original = Date.now() - 60 * 60 * 1000
		await alice.mutation(api.applications.markFiled, {
			applicationId,
			filedAt: original,
			acknowledgeNotReady: true,
		})
		await alice.mutation(api.cases.createCase, { receiptNumber: RECEIPT, applicationId })
		const { application } = (await alice.query(api.applications.getApplication, { applicationId }))!
		expect(application.status).toBe('filed')
		expect(application.filedAt).toBe(original)
	})

	test('a closed application cannot be linked', async () => {
		const t = newT()
		const { alice, applicationId } = await setupDraft(t)
		await alice.mutation(api.applications.closeApplication, { applicationId })
		await expect(
			alice.mutation(api.cases.createCase, { receiptNumber: RECEIPT, applicationId }),
		).rejects.toThrow(/closed/i)
	})

	test('an application already linked to a case cannot be linked again', async () => {
		const t = newT()
		const { alice, applicationId } = await setupDraft(t)
		await alice.mutation(api.cases.createCase, { receiptNumber: RECEIPT, applicationId })
		await expect(
			alice.mutation(api.cases.createCase, { receiptNumber: 'WAC9876543210', applicationId }),
		).rejects.toThrow(/already linked/i)
	})
})

describe('listLinkableApplications', () => {
	test('offers non-closed, unlinked applications; filed first', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })
		const applicantId = await alice.mutation(api.applicants.createApplicant, {
			displayName: 'Alice',
			isSelf: true,
		})
		const make = () =>
			alice.mutation(api.applications.createApplication, {
				applicantId,
				formType: 'i765',
				applicationKind: 'renewal',
			})
		const draftId = await make()
		const filedId = await make()
		const closedId = await make()
		const linkedId = await make()
		await alice.mutation(api.applications.markFiled, {
			applicationId: filedId,
			filedAt: Date.now(),
			acknowledgeNotReady: true,
		})
		await alice.mutation(api.applications.closeApplication, { applicationId: closedId })
		await alice.mutation(api.cases.createCase, {
			receiptNumber: RECEIPT,
			applicationId: linkedId,
		})

		const linkable = await alice.query(api.cases.listLinkableApplications, {})
		expect(linkable.map((a) => a._id)).toEqual([filedId, draftId])
		expect(linkable[0]).toMatchObject({ status: 'filed', applicantName: 'Alice' })

		// Owner-scoped like everything else.
		const bob = t.withIdentity({ subject: 'bob' })
		expect(await bob.query(api.cases.listLinkableApplications, {})).toHaveLength(0)
	})
})
