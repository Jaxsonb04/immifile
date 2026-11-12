import type {
	ApplicationKind,
	CaseStatus,
	DocumentType,
	FormType,
} from '@convex/shared/applicationShapes'
import { evidenceRequirementFor } from '@convex/shared/evidenceRequirements'

// Plain labels first, technical labels second (docs/internal/REARCHITECTURE.md
// "Terminology"): display copy is composed from formType + applicationKind —
// never stored, never the raw form number as the primary label.

const productNoun: Record<FormType, string> = {
	i765: 'Work Permit',
	i90: 'Green Card',
}

const formNumber: Record<FormType, string> = {
	i765: 'Form I-765',
	i90: 'Form I-90',
}

export function situationLabel(
	formType: FormType,
	applicationKind: ApplicationKind,
): { primary: string; secondary: string } {
	const product = productNoun[formType]
	const primary =
		applicationKind === 'initial'
			? `First ${product}`
			: `${product} ${applicationKind === 'renewal' ? 'renewal' : 'replacement'}`
	return { primary, secondary: formNumber[formType] }
}

const requirementLabels: Record<string, string> = {
	eadCard: 'Current EAD card',
	passportPhoto: 'Passport-style photo',
	passport: 'Passport',
	i94: 'I-94 record',
	permanentResidentCard: 'Permanent Resident Card',
	// Answer-aware (I-90 Item 5 NOTE): required when the name legally changed.
	nameChangeEvidence: 'Legal name-change document (marriage certificate, court order, or decree)',
	// Answer-aware (I-765 Item 30 NOTE): required when a (c)(8) applicant
	// answers yes to the arrest/conviction question.
	courtDispositions: 'Certified court disposition for each arrest or conviction',
}

export function requirementLabel(requirementKey: string): string {
	return (
		evidenceRequirementFor(requirementKey)?.label ??
		requirementLabels[requirementKey] ??
		requirementKey
	)
}

// The one Vault document-type vocabulary (was drifting into two: journey-hub's
// upload flow and the Vault list each had their own copy). Plain-language
// first, matching situationLabel's "Work Permit"/"Green Card" convention.
const documentTypeLabels: Record<DocumentType, string> = {
	passport: 'Passport',
	ead: 'Work permit (EAD)',
	permanentResidentCard: 'Green card',
	i94: 'Form I-94',
	socialSecurityCard: 'Social Security card',
	photo: 'Photo',
	other: 'Document',
}

export function documentTypeLabel(type: DocumentType): string {
	return documentTypeLabels[type]
}

export const caseStatusLabels: Record<CaseStatus, string> = {
	caseReceived: 'Case received',
	biometrics: 'Biometrics',
	requestForEvidence: 'Request for Evidence',
	approved: 'Approved',
	cardBeingProduced: 'Card is being produced',
	cardMailed: 'Card was mailed',
	cardDelivered: 'Card was delivered',
}

export function progressLabel(application: {
	status: 'draft' | 'filed' | 'closed'
	completedStepCount: number
	totalStepCount: number
}): string {
	if (application.status === 'filed') return 'Filed — tracking'
	if (application.status === 'closed') return 'Closed'
	if (application.completedStepCount >= application.totalStepCount - 1) {
		// Deliberately NOT "Ready to file/review": step count only proves the
		// interview answers, not documents or the app's own form coverage. The
		// server-owned readiness contract (convex/shared/readiness.ts) is the
		// only thing allowed to claim filing readiness.
		return 'Answers complete'
	}
	return `Step ${Math.min(application.completedStepCount + 1, application.totalStepCount)} of ${application.totalStepCount}`
}

export function relativeTime(at: number): string {
	const deltaMs = Date.now() - at
	const minutes = Math.round(deltaMs / 60_000)
	if (minutes < 1) return 'just now'
	if (minutes < 60) return `${minutes}m ago`
	const hours = Math.round(minutes / 60)
	if (hours < 24) return `${hours}h ago`
	const days = Math.round(hours / 24)
	if (days < 30) return `${days}d ago`
	const months = Math.round(days / 30)
	return `${months}mo ago`
}

export function formatIsoDate(isoDate: string): string {
	const [year, month, day] = isoDate.split('-').map(Number)
	const date = new Date(year!, (month ?? 1) - 1, day ?? 1)
	return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}
