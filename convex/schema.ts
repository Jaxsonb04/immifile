import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
import { literals } from 'convex-helpers/validators'
import { zodToConvex } from 'convex-helpers/server/zod4'
import {
	applicationKinds,
	applicationStatuses,
	caseStatuses,
	documentTypes,
	entitlementSources,
	entitlementStatuses,
	formTypes,
	i765DraftAnswersShape,
	i90DraftAnswersShape,
	personFactsShape,
	requirementStatuses,
} from './shared/applicationShapes'
import {
	moderationStatuses,
	reportReasons,
	reportStatuses,
	reportTargetTypes,
} from './shared/community'

// Seven app-owned tables (REARCHITECTURE.md "Resolved Decisions", 2026-07-01)
// plus the M4 community-forum tables. Every table is scoped by a server-derived
// ownerId (convex/lib/auth.ts); ownerIds are never accepted from clients. Better
// Auth owns identity in its own component namespace — there is no user-profile
// table here. Forum authorship is pseudonymous: the real ownerId is stored for
// authorization only and is NEVER returned by a public read (convex/community.ts
// sanitizes to a denormalized handle).

const formType = literals(...formTypes)
const applicationKind = literals(...applicationKinds)
const applicationStatus = literals(...applicationStatuses)
const requirementStatus = literals(...requirementStatuses)
const caseStatus = literals(...caseStatuses)
const documentType = literals(...documentTypes)
const moderationStatus = literals(...moderationStatuses)
const reportReason = literals(...reportReasons)
const reportStatus = literals(...reportStatuses)
const reportTargetType = literals(...reportTargetTypes)

export default defineSchema({
	// People managed by the owner. The account holder is a lazily created row
	// flagged isSelf (at most one per owner); dependents are sibling rows.
	// `profile` holds promoted person-facts (ADR-0014) — partial until the
	// first promotion at Review.
	applicants: defineTable({
		ownerId: v.string(),
		isSelf: v.boolean(),
		displayName: v.string(),
		profile: zodToConvex(personFactsShape.partial()),
		updatedAt: v.number(),
	}).index('by_ownerId', ['ownerId']),

	// The durable product object: small and stable. High-churn interview
	// answers live in applicationDrafts; only the progress summary is patched
	// here on each Next-save (decision 5). Status transitions are explicit
	// user actions or case-link assisted (decision 6) — payment never flips
	// status.
	applications: defineTable({
		ownerId: v.string(),
		applicantId: v.id('applicants'),
		formType,
		applicationKind,
		status: applicationStatus,
		currentStepKey: v.optional(v.string()),
		completedStepCount: v.number(),
		totalStepCount: v.number(),
		filedAt: v.optional(v.number()),
		// Present only when filing happened under the confirmation-aware evidence
		// contract. Its absence identifies genuinely legacy filing records.
		filingEvidenceContractVersion: v.optional(v.string()),
		filingRequirementKeys: v.optional(v.array(v.string())),
		closedAt: v.optional(v.number()),
		updatedAt: v.number(),
	})
		.index('by_ownerId_and_status', ['ownerId', 'status'])
		.index('by_applicantId', ['applicantId']),

	// High-churn interview answers + per-step completion map, one row per
	// application, typed per form family (ADR-0005) via the shared Zod shapes.
	applicationDrafts: defineTable(
		v.union(
			v.object({
				ownerId: v.string(),
				applicationId: v.id('applications'),
				formType: v.literal('i765'),
				answers: zodToConvex(i765DraftAnswersShape),
				stepCompletion: v.record(v.string(), v.boolean()),
				evidenceRevision: v.optional(v.number()),
				updatedAt: v.number(),
			}),
			v.object({
				ownerId: v.string(),
				applicationId: v.id('applications'),
				formType: v.literal('i90'),
				answers: zodToConvex(i90DraftAnswersShape),
				stepCompletion: v.record(v.string(), v.boolean()),
				evidenceRevision: v.optional(v.number()),
				updatedAt: v.number(),
			}),
		),
	)
		.index('by_applicationId', ['applicationId'])
		.index('by_ownerId', ['ownerId']),

	// Explicit requirement slots (decision 7): materialized from the
	// per-(formType, applicationKind) template at creation and reconciled
	// after each Next-save. Current code derives the expected keys independently
	// so a missing legacy row fails closed until reconciliation backfills it.
	applicationDocuments: defineTable({
		ownerId: v.string(),
		applicationId: v.id('applications'),
		requirementKey: v.string(),
		status: requirementStatus,
		documentId: v.optional(v.id('documents')),
		// A document attachment is not evidence-complete until the owner reviews
		// the exact file version against the current requirement checklist.
		confirmedDocumentId: v.optional(v.id('documents')),
		confirmationVersion: v.optional(v.string()),
		// Binds confirmation to the exact semantic answer revision. Any actual
		// answer edit invalidates every prior evidence confirmation fail closed.
		confirmationRevision: v.optional(v.number()),
		confirmedAt: v.optional(v.number()),
		updatedAt: v.number(),
	})
		.index('by_applicationId', ['applicationId'])
		.index('by_ownerId_and_status', ['ownerId', 'status'])
		.index('by_documentId', ['documentId']),

	// Vault: append-only rows; supersession via explicit links set only by
	// "Upload new version" (decision 9). Current = supersededById unset. Two
	// passports coexist as independent rows.
	documents: defineTable({
		ownerId: v.string(),
		applicantId: v.id('applicants'),
		type: documentType,
		label: v.optional(v.string()),
		storageId: v.id('_storage'),
		expiryDate: v.optional(v.string()), // ISO date (YYYY-MM-DD)
		supersedesId: v.optional(v.id('documents')),
		supersededById: v.optional(v.id('documents')),
		updatedAt: v.number(),
	})
		.index('by_ownerId', ['ownerId'])
		.index('by_applicantId', ['applicantId']),

	// Post-filing tracking (ADR-0008): manual receipt-number entry; optional
	// one-way link to an application. statusHistory is bounded (~7 canonical
	// statuses, manual entries), so embedding is safe (decision 8).
	cases: defineTable({
		ownerId: v.string(),
		receiptNumber: v.string(),
		applicationId: v.optional(v.id('applications')),
		status: caseStatus,
		statusHistory: v.array(
			v.object({
				status: caseStatus,
				occurredAt: v.number(),
				note: v.optional(v.string()),
			}),
		),
		updatedAt: v.number(),
	})
		.index('by_ownerId_and_receiptNumber', ['ownerId', 'receiptNumber'])
		.index('by_applicationId', ['applicationId']),

	// Per-application authorization mirror (decision 11): Convex is the source
	// of truth for unlocks; written only by RevenueCat webhooks/server
	// validation (idempotent by provider ids) or the walkthrough dev stub.
	entitlements: defineTable({
		ownerId: v.string(),
		applicationId: v.id('applications'),
		status: literals(...entitlementStatuses),
		source: literals(...entitlementSources),
		providerTransactionId: v.optional(v.string()),
		providerEventId: v.optional(v.string()),
		updatedAt: v.number(),
	})
		.index('by_applicationId', ['applicationId'])
		.index('by_ownerId', ['ownerId'])
		.index('by_providerEventId', ['providerEventId']),

	// M5-T2: bounded cache of the latest official USCIS news (RSS). Replaced
	// wholesale on each successful fetch; on fetch failure the previous rows stay
	// (stale-cache fallback, convex/news.ts). Every url is validated against the
	// official https://www.uscis.gov/ prefix before it is written — twice (parse
	// time and write time).
	newsItems: defineTable({
		title: v.string(),
		url: v.string(),
		publishedAt: v.number(),
		summary: v.string(),
		fetchedAt: v.number(),
	}).index('by_publishedAt', ['publishedAt']),

	// Singleton fetch-status row for the news cache; lastSuccessAt/status are
	// diagnostic (the UI staleness note derives from newsItems.fetchedAt).
	newsMeta: defineTable({
		status: literals('ok', 'error'),
		lastFetchAt: v.number(),
		lastSuccessAt: v.optional(v.number()),
	}),

	// Per-owner daily message counter for the OpenAI assistant (M1-T1,
	// MASTER_PLAN "Interfaces"). Immifile does not persist a server-side chat
	// transcript; the only Convex-stored chat data is this bounded counter, which enforces the
	// 20-message daily limit. One row per (ownerId, day); the day key is UTC.
	assistantUsage: defineTable({
		ownerId: v.string(),
		day: v.string(), // UTC calendar day, YYYY-MM-DD
		count: v.number(),
		updatedAt: v.number(),
	}).index('by_ownerId_and_day', ['ownerId', 'day']),

	// M6-T6: small per-owner UI flags (e.g. the Forms intro acknowledged).
	// Server-side (not device storage) so they survive reinstalls and carry
	// over when an anonymous session links to a real account.
	ownerPreferences: defineTable({
		ownerId: v.string(),
		key: v.string(),
		value: v.boolean(),
		updatedAt: v.number(),
	}).index('by_ownerId_and_key', ['ownerId', 'key']),

	// Short-lived write gate for complete account deletion. It remains after
	// the auth identity is removed until every previously issued Convex JWT has
	// expired, preventing a racing client from recreating rows after a deletion
	// phase has passed.
	accountDeletionTombstones: defineTable({
		ownerId: v.string(),
		createdAt: v.number(),
		expiresAt: v.number(),
		// Present while an auth identity still needs durable server-side
		// completion. This is Better Auth's opaque id, not user-authored data.
		authUserId: v.optional(v.string()),
		// The JWT-drain TTL starts only after authoritative auth absence.
		completedAt: v.optional(v.number()),
		appleManualRevokeRequired: v.optional(v.boolean()),
		// Cross-store Better Auth callbacks can finish after deletion begins.
		// Generations make a failed late-artifact cleanup durably observable;
		// the gate clears only after a successful post-drain sweep catches up.
		authCleanupGeneration: v.optional(v.number()),
		authCleanupCompletedGeneration: v.optional(v.number()),
		lastAuthSweepAt: v.optional(v.number()),
	}).index('by_ownerId', ['ownerId']),

	// High-entropy capabilities created atomically with an auth-backed deletion
	// gate. Keeping them separate preserves reconciliation for two devices that
	// race the same deletion without exposing either owner or auth ids publicly.
	accountDeletionAttempts: defineTable({
		attemptId: v.string(),
		ownerId: v.string(),
		createdAt: v.number(),
	})
		.index('by_attemptId', ['attemptId'])
		.index('by_ownerId', ['ownerId']),

	// Origin-enforced throttling for unauthenticated account-creation and
	// credential-recovery endpoints. The key contains only a keyed one-way
	// digest of proxy-verified client metadata or a normalized account email plus its
	// endpoint family; raw network addresses and emails are never stored.
	authRateLimits: defineTable({
		key: v.string(),
		count: v.number(),
		windowExpiresAt: v.number(),
	})
		.index('by_key', ['key'])
		.index('by_windowExpiresAt', ['windowExpiresAt']),

	// M6-T6 manual renewal entries: a document expiry or a prior filing date
	// the person logs by hand (no upload required), so Upcoming renewals can
	// remind against the real USCIS filing windows alongside vault documents
	// and in-app filings.
	renewalEntries: defineTable({
		ownerId: v.string(),
		kind: literals('ead', 'greenCard'),
		expiryDate: v.optional(v.string()), // ISO date (YYYY-MM-DD)
		filedAt: v.optional(v.string()), // ISO date of a prior filing (YYYY-MM-DD)
		updatedAt: v.number(),
	}).index('by_ownerId', ['ownerId']),

	// M4 community forum. Pseudonymous: one profile per owner maps a real
	// ownerId to a public `handle`. handle is unique and immutable in v1.
	communityProfiles: defineTable({
		ownerId: v.string(),
		handle: v.string(),
		createdAt: v.number(),
	})
		.index('by_ownerId', ['ownerId'])
		.index('by_handle', ['handle']),

	// Forum posts. `authorOwnerId` is private (authorization + moderation only);
	// `authorHandle` is the denormalized public pseudonym so a public read never
	// has to touch communityProfiles. commentCount tracks VISIBLE comments;
	// reportCount is moderator-only and excluded from public reads. The
	// moderation-status index powers the bounded public feed (visible, newest
	// activity first).
	forumPosts: defineTable({
		authorOwnerId: v.string(),
		authorHandle: v.string(),
		title: v.string(),
		body: v.string(),
		moderationStatus,
		commentCount: v.number(),
		reportCount: v.number(),
		lastActivityAt: v.number(),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index('by_moderationStatus_and_lastActivityAt', ['moderationStatus', 'lastActivityAt'])
		.index('by_author', ['authorOwnerId']),

	// Forum comments. Same pseudonymity model as posts. The compound index lets
	// a public read page a post's VISIBLE comments oldest-first in one bounded
	// scan.
	forumComments: defineTable({
		postId: v.id('forumPosts'),
		authorOwnerId: v.string(),
		authorHandle: v.string(),
		body: v.string(),
		moderationStatus,
		reportCount: v.number(),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index('by_postId_and_moderationStatus_and_createdAt', [
			'postId',
			'moderationStatus',
			'createdAt',
		])
		.index('by_author', ['authorOwnerId']),

	// Per-viewer block list (M4-T3). NOT moderation: a block only filters the
	// blocker's own reads. The blocked side is the pseudonymous profile —
	// `blockedProfileId` plus the denormalized (immutable, unique) `blockedHandle`
	// so feed filtering never joins back to communityProfiles. No ownerId of the
	// blocked user is ever stored here.
	communityBlocks: defineTable({
		blockerOwnerId: v.string(),
		blockedProfileId: v.id('communityProfiles'),
		blockedHandle: v.string(),
		createdAt: v.number(),
	})
		.index('by_blocker', ['blockerOwnerId'])
		.index('by_blocker_and_profile', ['blockerOwnerId', 'blockedProfileId'])
		.index('by_blockedProfile', ['blockedProfileId']),

	// Forum reports. `reporterOwnerId` is private and never surfaced. `targetKey`
	// (`p:<id>`/`c:<id>`) is the single dedupe/lookup key spanning both target
	// tables — at most one report per (reporter, target). by_status powers the
	// M4-T3 moderator queue.
	forumReports: defineTable({
		reporterOwnerId: v.string(),
		targetType: reportTargetType,
		targetKey: v.string(),
		reason: reportReason,
		note: v.optional(v.string()),
		status: reportStatus,
		createdAt: v.number(),
	})
		.index('by_reporter_and_targetKey', ['reporterOwnerId', 'targetKey'])
		.index('by_targetKey', ['targetKey'])
		.index('by_status_and_createdAt', ['status', 'createdAt']),
})
