import { v } from 'convex/values'
import { env, internalAction, internalMutation } from '../_generated/server'
import type { ActionCtx } from '../_generated/server'
import { internal } from '../_generated/api'
import { requireOwnerId } from '../lib/auth'
import { deleteOwnerData } from '../model/ownerData'
import type { FormType } from '../shared/applicationShapes'
import { EVIDENCE_CONTRACT_VERSION } from '../shared/evidenceRequirements'
import { interviewStepKeys } from '../shared/interviewSteps'

const completeAllSteps = (formType: FormType): Record<string, boolean> =>
	Object.fromEntries(interviewStepKeys[formType].map((key) => [key, true]))

// Walkthrough-phase demo data (docs/internal/REARCHITECTURE.md "Resolved Decisions" #12).
// The family demo makes every Home / Documents / Journey Hub / Review state
// reachable, and doubles as the walkthrough acceptance checklist:
//   - 3 applicants (self + spouse + child)
//   - documents: one expiring inside the filing window, one healthy,
//     one superseded pair
//   - 5 applications: fresh mid-interview draft, Review-complete,
//     unlocked (dev entitlement), filed with a linked mid-history case,
//     and closed
//   - exactly one application missing a required document
//
// Gated on the DEV_SEED_ENABLED deployment env var:
//   npx convex env set DEV_SEED_ENABLED true

function assertSeedEnabled() {
	if (env.DEV_SEED_ENABLED !== 'true') {
		throw new Error('Dev seed is disabled. Run: npx convex env set DEV_SEED_ENABLED true')
	}
}

const DAY_MS = 24 * 60 * 60 * 1000

function isoDateFromNow(days: number): string {
	return new Date(Date.now() + days * DAY_MS).toISOString().slice(0, 10)
}

type SeedSummary = { applicants: number; applications: number; documents: number }

async function storeDemoBlobs(ctx: ActionCtx) {
	const store = (name: string) =>
		ctx.storage.store(new Blob([`demo placeholder: ${name}`], { type: 'text/plain' }))
	return {
		eadOld: await store('Maria EAD (superseded)'),
		eadCurrent: await store('Maria EAD (current)'),
		passport: await store('Maria passport'),
		permanentResidentCard: await store('Diego Permanent Resident Card'),
		pendingI485: await store('Maria I-485 receipt notice'),
	}
}

/**
 * Seed the calling owner's workspace with the family demo.
 *
 * Internal: a destructive, data-writing endpoint must not be deployed to the
 * public internet where a single `DEV_SEED_ENABLED` flip on the wrong
 * deployment would open it to every authenticated caller. Operators use
 * `seedOwner` / `resetOwnerById` from the CLI instead. Wipes the owner's
 * existing data first, so re-running always yields exactly one demo dataset.
 * An action (not a mutation) because placeholder files go through
 * `ctx.storage.store`.
 */
export const seedDemo = internalAction({
	args: {},
	handler: async (ctx) => {
		assertSeedEnabled()
		const identity = await ctx.auth.getUserIdentity()
		if (identity === null) throw new Error('Not authenticated')
		const ownerId = identity.tokenIdentifier

		const storageIds = await storeDemoBlobs(ctx)
		const summary: SeedSummary = await ctx.runMutation(internal.dev.seed.insertDemoData, {
			ownerId,
			storageIds,
		})
		return summary
	},
})

/**
 * CLI/dashboard variant for operators (no user identity available there):
 *   npx convex run dev/seed:seedOwner '{"ownerId": "<tokenIdentifier>"}'
 * Internal-only, so the never-trust-client-owner-ids rule is not violated.
 */
export const seedOwner = internalAction({
	args: { ownerId: v.string() },
	handler: async (ctx, { ownerId }) => {
		assertSeedEnabled()
		const storageIds = await storeDemoBlobs(ctx)
		const summary: SeedSummary = await ctx.runMutation(internal.dev.seed.insertDemoData, {
			ownerId,
			storageIds,
		})
		return summary
	},
})

/**
 * CLI/dashboard reset for operators, mirroring `seedOwner`:
 *   npx convex run dev/seed:resetOwnerById '{"ownerId": "<tokenIdentifier>"}'
 */
export const resetOwnerById = internalMutation({
	args: { ownerId: v.string() },
	handler: async (ctx, { ownerId }) => {
		assertSeedEnabled()
		await deleteOwnerData(ctx, ownerId)
		return null
	},
})

/** Wipe the calling owner back to zero rows, for empty-state review. Internal — see `seedDemo`. */
export const resetOwner = internalMutation({
	args: {},
	handler: async (ctx) => {
		assertSeedEnabled()
		const ownerId = await requireOwnerId(ctx)
		await deleteOwnerData(ctx, ownerId)
		return null
	},
})

export const insertDemoData = internalMutation({
	args: {
		ownerId: v.string(),
		storageIds: v.object({
			eadOld: v.id('_storage'),
			eadCurrent: v.id('_storage'),
			passport: v.id('_storage'),
			permanentResidentCard: v.id('_storage'),
			pendingI485: v.id('_storage'),
		}),
	},
	handler: async (ctx, { ownerId, storageIds }) => {
		// Idempotent re-seed: the previous demo dataset (but not the caller's
		// auth identity) is replaced wholesale. Note: wiping deletes prior
		// seeded files' rows; their blobs were deleted by the cascade, and the
		// fresh blobs were stored by the calling action just now.
		await deleteOwnerData(ctx, ownerId)

		const now = Date.now()

		const mailingAddress = {
			street: '2350 Mission St',
			unit: 'Apt 4',
			city: 'San Francisco',
			state: 'CA',
			zipCode: '94110',
		}

		// -- Applicants (self + spouse + child) --------------------------------
		const mariaId = await ctx.db.insert('applicants', {
			ownerId,
			isSelf: true,
			displayName: 'Maria Santos',
			// Promoted at Review of her unlocked replacement application (ADR-0014).
			profile: {
				givenName: 'Maria',
				familyName: 'Santos',
				dateOfBirth: '1990-04-12',
				countryOfBirth: 'Mexico',
				aNumber: '012345678',
				mailingAddress,
				eligibilityCategory: 'C09',
			},
			updatedAt: now,
		})
		const diegoId = await ctx.db.insert('applicants', {
			ownerId,
			isSelf: false,
			displayName: 'Diego Santos',
			profile: {
				givenName: 'Diego',
				familyName: 'Santos',
				dateOfBirth: '1988-09-03',
				countryOfBirth: 'Mexico',
				aNumber: '087654321',
				mailingAddress,
			},
			updatedAt: now,
		})
		const luciaId = await ctx.db.insert('applicants', {
			ownerId,
			isSelf: false,
			displayName: 'Lucia Santos',
			profile: {
				givenName: 'Lucia',
				familyName: 'Santos',
				dateOfBirth: '2007-01-25',
				countryOfBirth: 'United States',
				aNumber: '076543210',
				mailingAddress,
				eligibilityCategory: 'C09',
			},
			updatedAt: now,
		})

		// -- Documents: superseded pair, expiring-in-window, healthy -----------
		const eadOldId = await ctx.db.insert('documents', {
			ownerId,
			applicantId: mariaId,
			type: 'ead',
			label: 'EAD (previous card)',
			storageId: storageIds.eadOld,
			expiryDate: isoDateFromNow(-240),
			updatedAt: now,
		})
		const eadCurrentId = await ctx.db.insert('documents', {
			ownerId,
			applicantId: mariaId,
			type: 'ead',
			label: 'EAD',
			storageId: storageIds.eadCurrent,
			// Inside the 180-day filing window -> attention item.
			expiryDate: isoDateFromNow(90),
			supersedesId: eadOldId,
			updatedAt: now,
		})
		await ctx.db.patch('documents', eadOldId, { supersededById: eadCurrentId })
		const passportId = await ctx.db.insert('documents', {
			ownerId,
			applicantId: mariaId,
			type: 'passport',
			label: 'Passport',
			storageId: storageIds.passport,
			expiryDate: isoDateFromNow(4 * 365),
			updatedAt: now,
		})
		const prcId = await ctx.db.insert('documents', {
			ownerId,
			applicantId: diegoId,
			type: 'permanentResidentCard',
			label: 'Permanent Resident Card',
			storageId: storageIds.permanentResidentCard,
			expiryDate: isoDateFromNow(-30),
			updatedAt: now,
		})
		const pendingI485Id = await ctx.db.insert('documents', {
			ownerId,
			applicantId: mariaId,
			type: 'other',
			label: 'I-485 receipt notice',
			storageId: storageIds.pendingI485,
			updatedAt: now,
		})

		// -- Application 1: Maria's EAD renewal, fresh mid-interview draft -----
		// The one application missing a required document (passportPhoto).
		const app1 = await ctx.db.insert('applications', {
			ownerId,
			applicantId: mariaId,
			formType: 'i765',
			applicationKind: 'renewal',
			status: 'draft',
			currentStepKey: 'country-of-birth',
			completedStepCount: 2,
			totalStepCount: 12,
			updatedAt: now,
		})
		await ctx.db.insert('applicationDrafts', {
			ownerId,
			applicationId: app1,
			formType: 'i765',
			answers: {
				personFacts: { givenName: 'Maria', familyName: 'Santos', dateOfBirth: '1990-04-12' },
				form: {},
			},
			stepCompletion: { 'legal-name': true, 'date-of-birth': true },
			evidenceRevision: 0,
			updatedAt: now,
		})
		await ctx.db.insert('applicationDocuments', {
			ownerId,
			applicationId: app1,
			requirementKey: 'eadCard',
			status: 'attached',
			documentId: eadCurrentId,
			confirmedDocumentId: eadCurrentId,
			confirmationVersion: EVIDENCE_CONTRACT_VERSION,
			confirmationRevision: 0,
			confirmedAt: now,
			updatedAt: now,
		})
		await ctx.db.insert('applicationDocuments', {
			ownerId,
			applicationId: app1,
			requirementKey: 'entryDocument',
			status: 'attached',
			documentId: passportId,
			confirmedDocumentId: passportId,
			confirmationVersion: EVIDENCE_CONTRACT_VERSION,
			confirmationRevision: 0,
			confirmedAt: now,
			updatedAt: now,
		})
		await ctx.db.insert('applicationDocuments', {
			ownerId,
			applicationId: app1,
			requirementKey: 'passportPhoto',
			status: 'needed',
			updatedAt: now,
		})

		// -- Application 2: Diego's Green Card renewal, Review-complete --------
		const app2 = await ctx.db.insert('applications', {
			ownerId,
			applicantId: diegoId,
			formType: 'i90',
			applicationKind: 'renewal',
			status: 'draft',
			currentStepKey: 'review',
			completedStepCount: 12,
			totalStepCount: 12,
			updatedAt: now,
		})
		await ctx.db.insert('applicationDrafts', {
			ownerId,
			applicationId: app2,
			formType: 'i90',
			answers: {
				personFacts: {
					givenName: 'Diego',
					familyName: 'Santos',
					dateOfBirth: '1988-09-03',
					countryOfBirth: 'Mexico',
					cityOfBirth: 'Guadalajara',
					daytimePhone: '4155550134',
					gender: 'male',
					motherGivenName: 'Rosa',
					fatherGivenName: 'Miguel',
					classOfAdmission: 'IR1',
					dateOfAdmission: '2015-06-10',
					heightFeet: '5',
					heightInches: '9',
					weightPounds: '170',
					eyeColor: 'brown',
					hairColor: 'black',
					ethnicity: 'hispanicOrLatino',
					races: ['white'],
					locationAppliedVisa: 'Ciudad Juarez, Mexico',
					locationIssuedVisa: 'Ciudad Juarez, Mexico',
					becameResidentVia: 'immigrantVisa',
					destinationAtAdmission: 'San Francisco, CA',
					portOfEntryCityState: 'San Ysidro, CA',
					everInProceedings: 'no',
					filedI407OrAbandoned: 'no',
					aNumber: '087654321',
					mailingAddress,
				},
				form: {
					cardStatus: 'permanentResident',
					cardExpirationDate: isoDateFromNow(-30),
					nameChangedSinceIssuance: 'no',
					physicalAddressSameAsMailing: 'yes',
					preparedSelfInEnglish: 'yes',
					requestingAccommodation: 'no',
				},
			},
			stepCompletion: completeAllSteps('i90'),
			evidenceRevision: 0,
			updatedAt: now,
		})
		await ctx.db.insert('applicationDocuments', {
			ownerId,
			applicationId: app2,
			requirementKey: 'permanentResidentCard',
			status: 'attached',
			documentId: prcId,
			confirmedDocumentId: prcId,
			confirmationVersion: EVIDENCE_CONTRACT_VERSION,
			confirmationRevision: 0,
			confirmedAt: now,
			updatedAt: now,
		})

		// -- Application 3: Maria's EAD replacement, unlocked (paid) -----------
		const app3 = await ctx.db.insert('applications', {
			ownerId,
			applicantId: mariaId,
			formType: 'i765',
			applicationKind: 'replacement',
			status: 'draft',
			currentStepKey: 'review',
			completedStepCount: 12,
			totalStepCount: 12,
			updatedAt: now,
		})
		await ctx.db.insert('applicationDrafts', {
			ownerId,
			applicationId: app3,
			formType: 'i765',
			answers: {
				personFacts: {
					givenName: 'Maria',
					familyName: 'Santos',
					dateOfBirth: '1990-04-12',
					countryOfBirth: 'Mexico',
					cityOfBirth: 'Oaxaca',
					countryOfCitizenship: 'Mexico',
					daytimePhone: '4155550112',
					aNumber: '012345678',
					mailingAddress,
					eligibilityCategory: 'C09',
					gender: 'female',
					maritalStatus: 'married',
					hasUsedOtherNames: 'no',
					dateOfLastEntry: '2019-08-14',
					placeOfLastEntry: 'JFK Airport, New York',
					statusAtLastEntry: 'F-1 student',
					currentImmigrationStatus: 'Pending adjustment applicant',
					usedTravelDocument: 'yes',
					passportNumber: 'G12345678',
					travelDocCountryOfIssuance: 'Mexico',
					travelDocExpirationDate: '2026-01-01',
				},
				form: {
					replacementReason: 'lost',
					previouslyFiledI765: 'yes',
					preparedSelfInEnglish: 'yes',
					physicalAddressSameAsMailing: 'yes',
				},
			},
			stepCompletion: completeAllSteps('i765'),
			evidenceRevision: 0,
			updatedAt: now,
		})
		await ctx.db.insert('applicationDocuments', {
			ownerId,
			applicationId: app3,
			requirementKey: 'identityEvidence',
			status: 'attached',
			documentId: passportId,
			confirmedDocumentId: passportId,
			confirmationVersion: EVIDENCE_CONTRACT_VERSION,
			confirmationRevision: 0,
			confirmedAt: now,
			updatedAt: now,
		})
		await ctx.db.insert('applicationDocuments', {
			ownerId,
			applicationId: app3,
			requirementKey: 'passportPhoto',
			status: 'confirmed',
			confirmationVersion: EVIDENCE_CONTRACT_VERSION,
			confirmationRevision: 0,
			confirmedAt: now,
			updatedAt: now,
		})
		await ctx.db.insert('applicationDocuments', {
			ownerId,
			applicationId: app3,
			requirementKey: 'pendingI485Evidence',
			status: 'attached',
			documentId: pendingI485Id,
			confirmedDocumentId: pendingI485Id,
			confirmationVersion: EVIDENCE_CONTRACT_VERSION,
			confirmationRevision: 0,
			confirmedAt: now,
			updatedAt: now,
		})
		await ctx.db.insert('entitlements', {
			ownerId,
			applicationId: app3,
			status: 'active',
			source: 'devStub',
			providerTransactionId: 'dev-stub-app3',
			updatedAt: now,
		})

		// -- Application 4: Lucia's first EAD, filed with a linked case --------
		const app4 = await ctx.db.insert('applications', {
			ownerId,
			applicantId: luciaId,
			formType: 'i765',
			applicationKind: 'initial',
			status: 'filed',
			currentStepKey: 'review',
			completedStepCount: 12,
			totalStepCount: 12,
			filedAt: now - 14 * DAY_MS,
			updatedAt: now,
		})
		await ctx.db.insert('applicationDrafts', {
			ownerId,
			applicationId: app4,
			formType: 'i765',
			answers: {
				personFacts: {
					givenName: 'Lucia',
					familyName: 'Santos',
					dateOfBirth: '2007-01-25',
					countryOfBirth: 'United States',
					cityOfBirth: 'San Francisco',
					countryOfCitizenship: 'Mexico',
					daytimePhone: '4155550178',
					aNumber: '076543210',
					mailingAddress,
					eligibilityCategory: 'C09',
					gender: 'female',
					maritalStatus: 'single',
					hasUsedOtherNames: 'no',
					dateOfLastEntry: '2019-08-14',
					placeOfLastEntry: 'JFK Airport, New York',
					statusAtLastEntry: 'F-1 student',
					currentImmigrationStatus: 'Pending adjustment applicant',
					usedTravelDocument: 'yes',
					passportNumber: 'G12345678',
					travelDocCountryOfIssuance: 'Mexico',
					travelDocExpirationDate: '2026-01-01',
				},
				form: {
					previouslyFiledI765: 'no',
					preparedSelfInEnglish: 'yes',
					physicalAddressSameAsMailing: 'yes',
				},
			},
			stepCompletion: completeAllSteps('i765'),
			evidenceRevision: 0,
			updatedAt: now,
		})
		await ctx.db.insert('applicationDocuments', {
			ownerId,
			applicationId: app4,
			requirementKey: 'passportPhoto',
			status: 'waived',
			updatedAt: now,
		})
		await ctx.db.insert('entitlements', {
			ownerId,
			applicationId: app4,
			status: 'active',
			source: 'devStub',
			providerTransactionId: 'dev-stub-app4',
			updatedAt: now,
		})
		await ctx.db.insert('cases', {
			ownerId,
			receiptNumber: 'IOE0912345678',
			applicationId: app4,
			status: 'biometrics',
			statusHistory: [
				{ status: 'caseReceived', occurredAt: now - 12 * DAY_MS },
				{ status: 'biometrics', occurredAt: now - 5 * DAY_MS },
			],
			updatedAt: now,
		})

		// -- Application 5: Maria's old Green Card replacement, closed ---------
		const app5 = await ctx.db.insert('applications', {
			ownerId,
			applicantId: mariaId,
			formType: 'i90',
			applicationKind: 'replacement',
			status: 'closed',
			currentStepKey: 'review',
			completedStepCount: 12,
			totalStepCount: 12,
			filedAt: now - 520 * DAY_MS,
			closedAt: now - 400 * DAY_MS,
			updatedAt: now,
		})
		await ctx.db.insert('applicationDrafts', {
			ownerId,
			applicationId: app5,
			formType: 'i90',
			answers: {
				personFacts: {
					givenName: 'Maria',
					familyName: 'Santos',
					dateOfBirth: '1990-04-12',
					countryOfBirth: 'Mexico',
					cityOfBirth: 'Oaxaca',
					daytimePhone: '4155550112',
					gender: 'female',
					motherGivenName: 'Elena',
					fatherGivenName: 'Jorge',
					classOfAdmission: 'IR6',
					dateOfAdmission: '2015-06-10',
					heightFeet: '5',
					heightInches: '9',
					weightPounds: '170',
					eyeColor: 'brown',
					hairColor: 'black',
					ethnicity: 'hispanicOrLatino',
					races: ['white'],
					locationAppliedVisa: 'Ciudad Juarez, Mexico',
					locationIssuedVisa: 'Ciudad Juarez, Mexico',
					becameResidentVia: 'immigrantVisa',
					destinationAtAdmission: 'San Francisco, CA',
					portOfEntryCityState: 'San Ysidro, CA',
					everInProceedings: 'no',
					filedI407OrAbandoned: 'no',
					aNumber: '012345678',
					mailingAddress,
				},
				form: {
					cardStatus: 'permanentResident',
					replacementReason: 'damaged',
					nameChangedSinceIssuance: 'no',
					physicalAddressSameAsMailing: 'yes',
					preparedSelfInEnglish: 'yes',
					requestingAccommodation: 'no',
				},
			},
			stepCompletion: completeAllSteps('i90'),
			evidenceRevision: 0,
			updatedAt: now,
		})
		await ctx.db.insert('entitlements', {
			ownerId,
			applicationId: app5,
			status: 'active',
			source: 'devStub',
			providerTransactionId: 'dev-stub-app5',
			updatedAt: now,
		})
		await ctx.db.insert('cases', {
			ownerId,
			receiptNumber: 'MSC2187654321',
			applicationId: app5,
			status: 'cardDelivered',
			statusHistory: [
				{ status: 'caseReceived', occurredAt: now - 510 * DAY_MS },
				{ status: 'biometrics', occurredAt: now - 480 * DAY_MS },
				{ status: 'approved', occurredAt: now - 420 * DAY_MS },
				{ status: 'cardBeingProduced', occurredAt: now - 415 * DAY_MS },
				{ status: 'cardMailed', occurredAt: now - 408 * DAY_MS },
				{ status: 'cardDelivered', occurredAt: now - 401 * DAY_MS },
			],
			updatedAt: now,
		})

		return { applicants: 3, applications: 5, documents: 5 }
	},
})
