import { literals } from 'convex-helpers/validators'
import { v } from 'convex/values'
import type { Doc, Id } from './_generated/dataModel'
import { type MutationCtx, mutation, query } from './_generated/server'
import { getOwnerId, requireCredentialedOwnerId, requireOwnerId } from './lib/auth'
import {
	getDraftForApplication,
	getOwnedApplication,
	reconcileRequirements,
} from './model/applications'
import {
	caseStatuses,
	isValidReceiptNumber,
	normalizeReceiptNumber,
} from './shared/applicationShapes'
import { EVIDENCE_CONTRACT_VERSION } from './shared/evidenceRequirements'
import { requiredSlotKeys } from './shared/interviewSteps'
import { MAX_CASE_STATUS_HISTORY, MAX_TRACKED_CASES, normalizeCaseNote } from './shared/cases'
import { assertFeatureEnabled } from './lib/releaseGate'

// M3-T1 case tracking (ADR-0008). Manual, owner-scoped receipt-number tracking
// with a status timeline; v1 does NOT scrape USCIS. Every mutation is
// owner-scoped via requireOwnerId and re-checks ownership on every id.

const caseStatus = literals(...caseStatuses)

async function getOwnedCase(
	ctx: MutationCtx,
	ownerId: string,
	caseId: Id<'cases'>,
): Promise<Doc<'cases'>> {
	const found = await ctx.db.get('cases', caseId)
	if (found === null || found.ownerId !== ownerId) throw new Error('Case not found')
	return found
}

export const listCases = query({
	args: {},
	handler: async (ctx) => {
		const ownerId = await getOwnerId(ctx)
		if (ownerId === null) return []
		return await ctx.db
			.query('cases')
			.withIndex('by_ownerId_and_receiptNumber', (q) => q.eq('ownerId', ownerId))
			.take(MAX_TRACKED_CASES)
	},
})

export const getCase = query({
	args: { caseId: v.id('cases') },
	handler: async (ctx, args) => {
		const ownerId = await getOwnerId(ctx)
		if (ownerId === null) return null
		const found = await ctx.db.get('cases', args.caseId)
		if (found === null || found.ownerId !== ownerId) return null
		return found
	},
})

/**
 * Applications a new case can link to: the owner's non-closed applications
 * that don't already have a case (one case per application — getApplication
 * resolves the link with `.first()`). Filed first, then drafts, newest first.
 * Linking a draft marks it filed (see createCase), so drafts are offered too.
 */
export const listLinkableApplications = query({
	args: {},
	handler: async (ctx) => {
		assertFeatureEnabled('filingPreparation')
		const ownerId = await requireOwnerId(ctx)
		const [drafts, filed] = await Promise.all([
			ctx.db
				.query('applications')
				.withIndex('by_ownerId_and_status', (q) => q.eq('ownerId', ownerId).eq('status', 'draft'))
				.take(100),
			ctx.db
				.query('applications')
				.withIndex('by_ownerId_and_status', (q) => q.eq('ownerId', ownerId).eq('status', 'filed'))
				.take(100),
		])
		const linkable = []
		for (const application of [...filed, ...drafts]) {
			const linkedCase = await ctx.db
				.query('cases')
				.withIndex('by_applicationId', (q) => q.eq('applicationId', application._id))
				.first()
			if (linkedCase !== null) continue
			const applicant = await ctx.db.get('applicants', application.applicantId)
			linkable.push({
				_id: application._id,
				formType: application.formType,
				applicationKind: application.applicationKind,
				status: application.status,
				updatedAt: application.updatedAt,
				applicantName: applicant?.displayName ?? 'Unknown',
			})
		}
		return linkable.sort((a, b) => {
			if (a.status !== b.status) return a.status === 'filed' ? -1 : 1
			return b.updatedAt - a.updatedAt
		})
	},
})

/**
 * Track a new case by its USCIS receipt number. The receipt is normalized and
 * validated (`^[A-Z]{3}\d{10}$`), unique per owner, and seeds a one-entry status
 * timeline. An optional application link must belong to the same owner.
 *
 * Case-link assisted filing (decision 6): a real receipt number is decisive
 * evidence the application was filed, so linking a draft transitions it to
 * `filed` — idempotently: an already-filed application and its original
 * filedAt are left untouched.
 */
export const createCase = mutation({
	args: {
		receiptNumber: v.string(),
		applicationId: v.optional(v.id('applications')),
		status: v.optional(caseStatus),
		note: v.optional(v.string()),
	},
	handler: async (ctx, args): Promise<Id<'cases'>> => {
		const ownerId = await requireCredentialedOwnerId(ctx)
		const receiptNumber = normalizeReceiptNumber(args.receiptNumber)
		if (!isValidReceiptNumber(receiptNumber)) {
			throw new Error('Enter a receipt number like EAC1234567890 (3 letters + 10 digits)')
		}

		const existing = await ctx.db
			.query('cases')
			.withIndex('by_ownerId_and_receiptNumber', (q) =>
				q.eq('ownerId', ownerId).eq('receiptNumber', receiptNumber),
			)
			.first()
		if (existing !== null) throw new Error('You’re already tracking that receipt number')

		const trackedCases = await ctx.db
			.query('cases')
			.withIndex('by_ownerId_and_receiptNumber', (q) => q.eq('ownerId', ownerId))
			.take(MAX_TRACKED_CASES)
		if (trackedCases.length >= MAX_TRACKED_CASES) {
			throw new Error(
				`You can track up to ${MAX_TRACKED_CASES} cases. Delete one before adding another.`,
			)
		}

		const now = Date.now()
		if (args.applicationId !== undefined) {
			// Ownership check; the link is one-way (a case references an application).
			const application = await getOwnedApplication(ctx, ownerId, args.applicationId)
			if (application.status === 'closed') {
				throw new Error('That application is closed — reopen it before linking a case to it')
			}
			const alreadyLinked = await ctx.db
				.query('cases')
				.withIndex('by_applicationId', (q) => q.eq('applicationId', application._id))
				.first()
			if (alreadyLinked !== null) {
				throw new Error('That application is already linked to another case')
			}
			// Receipt-number reconcile: the receipt proves the filing happened.
			if (application.status === 'draft') {
				// Materialize every currently expected row before freezing the
				// filing, including requirements introduced after draft creation.
				await reconcileRequirements(ctx, application)
				const draft = await getDraftForApplication(ctx, application._id)
				const filingRequirementKeys = requiredSlotKeys(
					application.formType,
					application.applicationKind,
					draft.answers,
				)
				await ctx.db.patch('applications', application._id, {
					status: 'filed',
					filedAt: application.filedAt ?? now,
					filingEvidenceContractVersion: EVIDENCE_CONTRACT_VERSION,
					filingRequirementKeys: [...filingRequirementKeys],
					updatedAt: now,
				})
			}
		}

		const status = args.status ?? 'caseReceived'
		const note = normalizeCaseNote(args.note)
		return await ctx.db.insert('cases', {
			ownerId,
			receiptNumber,
			applicationId: args.applicationId,
			status,
			statusHistory: [{ status, occurredAt: now, note }],
			updatedAt: now,
		})
	},
})

/**
 * Append a manual status update to a case's timeline and advance its current
 * status. `occurredAt` lets the owner backdate an update they're recording after
 * the fact; it defaults to now.
 */
export const addStatusUpdate = mutation({
	args: {
		caseId: v.id('cases'),
		status: caseStatus,
		occurredAt: v.optional(v.number()),
		note: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const ownerId = await requireCredentialedOwnerId(ctx)
		const found = await getOwnedCase(ctx, ownerId, args.caseId)
		if (found.statusHistory.length >= MAX_CASE_STATUS_HISTORY) {
			throw new Error(`This case has reached its ${MAX_CASE_STATUS_HISTORY}-update limit.`)
		}
		const now = Date.now()
		const entry = {
			status: args.status,
			occurredAt: args.occurredAt ?? now,
			note: normalizeCaseNote(args.note),
		}
		await ctx.db.patch('cases', found._id, {
			status: args.status,
			statusHistory: [...found.statusHistory, entry],
			updatedAt: now,
		})
	},
})

/** Permanently remove one tracked case. Owner-scoped and idempotent only for
 * the owning caller while the row exists; foreign and missing ids are
 * indistinguishable. */
export const deleteCase = mutation({
	args: { caseId: v.id('cases') },
	handler: async (ctx, args): Promise<null> => {
		const ownerId = await requireOwnerId(ctx)
		const found = await getOwnedCase(ctx, ownerId, args.caseId)
		await ctx.db.delete('cases', found._id)
		return null
	},
})
