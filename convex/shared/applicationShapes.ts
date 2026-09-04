import { z } from 'zod/v4'

// Single-source Zod shapes for application data (ADR-0005, ADR-0013): these
// shapes derive the Convex storage validators via zodToConvex AND the
// interview's per-step validation schemas (strict .pick()/.required()
// projections). Do not re-declare field shapes elsewhere.

export const formTypes = ['i765', 'i90'] as const
export type FormType = (typeof formTypes)[number]

export const applicationKinds = ['initial', 'renewal', 'replacement'] as const
export type ApplicationKind = (typeof applicationKinds)[number]

// The five supported situations (ADR-0003 as amended): I-90 has no "initial".
export const supportedSituations: readonly {
	formType: FormType
	applicationKind: ApplicationKind
}[] = [
	{ formType: 'i765', applicationKind: 'initial' },
	{ formType: 'i765', applicationKind: 'renewal' },
	{ formType: 'i765', applicationKind: 'replacement' },
	{ formType: 'i90', applicationKind: 'renewal' },
	{ formType: 'i90', applicationKind: 'replacement' },
]

export const isSupportedSituation = (formType: FormType, applicationKind: ApplicationKind) =>
	supportedSituations.some((s) => s.formType === formType && s.applicationKind === applicationKind)

const isoDate = z.iso.date('Enter a valid date')

// I-90 biographic value sets, matched 1:1 to the printed form's checkbox and
// dropdown options (edition 2025-02-27; the PDF maps pin the destinations).
// The printed sex item offers exactly two boxes; the height dropdowns offer
// 2-8 feet / 0-11 inches.
export const genders = ['male', 'female'] as const
export type Gender = (typeof genders)[number]

export const heightFeetValues = ['2', '3', '4', '5', '6', '7', '8'] as const
export const heightInchesValues = [
	'0',
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'10',
	'11',
] as const

export const eyeColors = [
	'black',
	'blue',
	'brown',
	'gray',
	'green',
	'hazel',
	'maroon',
	'pink',
	'unknownOrOther',
] as const
export type EyeColor = (typeof eyeColors)[number]

export const hairColors = [
	'bald',
	'black',
	'blond',
	'brown',
	'gray',
	'red',
	'sandy',
	'white',
	'unknownOrOther',
] as const
export type HairColor = (typeof hairColors)[number]

export const ethnicities = ['hispanicOrLatino', 'notHispanicOrLatino'] as const
export type Ethnicity = (typeof ethnicities)[number]

export const races = [
	'americanIndianOrAlaskaNative',
	'asian',
	'blackOrAfricanAmerican',
	'nativeHawaiianOrOtherPacificIslander',
	'white',
] as const
export type Race = (typeof races)[number]

/** Plain yes/no answers stored as enums so radios and checkbox pairs map 1:1. */
export const yesNo = ['yes', 'no'] as const
export type YesNo = (typeof yesNo)[number]

// I-765 Item 11 marital status — the four boxes the printed form offers.
export const maritalStatuses = ['single', 'married', 'divorced', 'widowed'] as const
export type MaritalStatus = (typeof maritalStatuses)[number]

// How the person became a permanent resident (I-90 Part 3 Item 3 note): an
// immigrant visa at a port of entry, or adjustment of status inside the U.S.
export const residencyPaths = ['immigrantVisa', 'adjustmentOfStatus'] as const
export type ResidencyPath = (typeof residencyPaths)[number]

// I-90 Part 1 Item 4 (Y/N/NA — the NA box is printed "I never received my
// previous card").
export const nameChangeAnswers = ['yes', 'no', 'neverReceivedCard'] as const
export type NameChangeAnswer = (typeof nameChangeAnswers)[number]

// The exact option list shared by EVERY state dropdown on both bundled
// templates (verified identical across I-765 mailing and I-90 mailing +
// physical): 50 states plus DC, territories, and AA/AE/AP military codes.
// Validating against it up front keeps a typo from surfacing only as a
// failed dropdown-select at clean-export time.
export const usStateCodes = [
	'AA',
	'AE',
	'AK',
	'AL',
	'AP',
	'AR',
	'AS',
	'AZ',
	'CA',
	'CO',
	'CT',
	'DC',
	'DE',
	'FL',
	'FM',
	'GA',
	'GU',
	'HI',
	'IA',
	'ID',
	'IL',
	'IN',
	'KS',
	'KY',
	'LA',
	'MA',
	'MD',
	'ME',
	'MH',
	'MI',
	'MN',
	'MO',
	'MP',
	'MS',
	'MT',
	'NC',
	'ND',
	'NE',
	'NH',
	'NJ',
	'NM',
	'NV',
	'NY',
	'OH',
	'OK',
	'OR',
	'PA',
	'PR',
	'PW',
	'RI',
	'SC',
	'SD',
	'TN',
	'TX',
	'UT',
	'VA',
	'VI',
	'VT',
	'WA',
	'WI',
	'WV',
	'WY',
] as const

export function isUsStateCode(value: unknown): boolean {
	return (
		typeof value === 'string' && (usStateCodes as readonly string[]).includes(value.toUpperCase())
	)
}

// A USCIS receipt number is 3 letters (service-center code, e.g. EAC/WAC/LIN/
// SRC/MSC/IOE) followed by 10 digits, with asterisks retained when printed
// on the notice (https://egov.uscis.gov/e-request/ndd). Shared so the case backend,
// the M3 case UI, and the I-765 c(26) receipt item validate identically.
export const RECEIPT_NUMBER_RE = /^[A-Z]{3}[\d*]{10}$/

// One "other name" row (I-765 Items 2-3 offer three rows).
export const otherNameShape = z.object({
	familyName: z.string().min(1, 'Family name is required'),
	givenName: z.string().min(1, 'First name is required'),
	middleName: z.string().optional(),
})
export type OtherName = z.infer<typeof otherNameShape>

// Physical address, only provided when different from the mailing address
// (I-90 Part 1 Item 7 / I-765 Items 6-7). Commuters normally live abroad, so
// the foreign fields (province/postal code/country) are first-class for the
// I-90; the I-765's Item 7 is a "U.S. Physical Address", so its completion
// rule requires a US state + ZIP (interviewValidation).
export const physicalAddressShape = z.object({
	street: z.string().min(1, 'Street address is required'),
	unit: z.string().optional(),
	city: z.string().min(1, 'City is required'),
	state: z.string().optional(),
	zipCode: z.string().optional(),
	province: z.string().optional(),
	postalCode: z.string().optional(),
	country: z.string().optional(),
})

export const addressShape = z.object({
	street: z.string().min(1, 'Street address is required'),
	unit: z.string().optional(),
	city: z.string().min(1, 'City is required'),
	// Stored as entered; validated case-insensitively against the dropdowns'
	// real option list, emitted uppercased by the PDF maps.
	state: z.string().refine(isUsStateCode, 'Use a valid 2-letter state code'),
	zipCode: z.string().min(5, 'Enter a 5-digit ZIP code'),
})

// Person-facts: the projection that promotes draft → applicant profile when
// the user reaches Review (ADR-0014). The interview never writes these to the
// applicant row directly; promotion copies them, latest promotion wins.
export const personFactsShape = z.object({
	givenName: z.string().min(1, 'First name is required'),
	middleName: z.string().optional(),
	familyName: z.string().min(1, 'Family name is required'),
	dateOfBirth: isoDate,
	countryOfBirth: z.string().min(1, 'Country of birth is required'),
	// Place of birth (I-765 Item 15.A/B, I-90 Item 10): city is required on
	// both printed forms; state/province is an I-765-only box and optional.
	cityOfBirth: z.string().min(1, 'City or town of birth is required'),
	stateProvinceOfBirth: z.string().optional(),
	// Citizenship (I-765 Item 14, misnamed Line17* in the AcroForm): distinct
	// from country of birth. Only I-765 interviews collect it; the second line
	// exists for dual citizens.
	countryOfCitizenship: z.string().min(1, 'Country of citizenship is required'),
	secondCountryOfCitizenship: z.string().optional(),
	// Contact (I-765 Part 3, I-90 Part 5): stored digits-only, 10 digits.
	daytimePhone: z.string().regex(/^\d{10}$/, 'Enter a 10-digit U.S. phone number'),
	email: z.email('Enter a valid email address').optional(),
	// I-90 Part 1 Additional Information + Part 3 Biographic Information
	// (currently collected only by I-90 interviews; person-level, promotable).
	gender: z.enum(genders),
	// I-765 Item 11 (person-level, so it promotes to the reusable profile).
	maritalStatus: z.enum(maritalStatuses),
	motherGivenName: z.string().min(1, "Mother's given (first) name is required"),
	fatherGivenName: z.string().min(1, "Father's given (first) name is required"),
	classOfAdmission: z.string().min(1, 'Class of admission is required'),
	dateOfAdmission: isoDate,
	heightFeet: z.enum(heightFeetValues),
	heightInches: z.enum(heightInchesValues),
	weightPounds: z.string().regex(/^\d{1,3}$/, 'Enter your weight in pounds'),
	eyeColor: z.enum(eyeColors),
	hairColor: z.enum(hairColors),
	ethnicity: z.enum(ethnicities),
	races: z.array(z.enum(races)).min(1, 'Select at least one'),
	// I-90 Part 3 Processing Information — person-level immigration history.
	locationAppliedVisa: z.string().min(1, 'This location is required'),
	locationIssuedVisa: z.string().min(1, 'This location is required'),
	becameResidentVia: z.enum(residencyPaths),
	destinationAtAdmission: z.string().min(1, 'Your destination is required'),
	portOfEntryCityState: z.string().min(1, 'City and state are required'),
	everInProceedings: z.enum(yesNo),
	filedI407OrAbandoned: z.enum(yesNo),
	// I-765 Items 2-3 "Other Names Used": the printed form requires an answer
	// (all other names ever used, or N/A). Person-level, promotable.
	hasUsedOtherNames: z.enum(yesNo),
	otherNames: z.array(otherNameShape).max(3, 'The form has room for three other names'),
	// I-765 Items 17-26 "Information About Your Last Arrival": the I-94, SEVIS,
	// and travel-document items are conditional per the official instructions
	// ("If CBP or USCIS issued you a Form I-94…", "If you used a passport or
	// travel document to travel to the United States…"); Items 22-25 are
	// required for everyone. Person-level immigration history.
	i94Number: z.string().regex(/^[A-Za-z0-9]{11}$/, 'An I-94 number is 11 characters'),
	usedTravelDocument: z.enum(yesNo),
	passportNumber: z.string().min(1, 'Enter the passport number'),
	travelDocNumber: z.string().min(1, 'Enter the travel document number'),
	travelDocCountryOfIssuance: z.string().min(1, 'Country of issuance is required'),
	travelDocExpirationDate: isoDate,
	dateOfLastEntry: isoDate,
	placeOfLastEntry: z.string().min(1, 'Where you last entered is required'),
	statusAtLastEntry: z.string().min(1, 'Your status at last arrival is required'),
	currentImmigrationStatus: z.string().min(1, 'Your current status is required'),
	sevisNumber: z.string().regex(/^[Nn]?\d{10}$/, 'A SEVIS number is N followed by 10 digits'),
	aNumber: z.string().regex(/^\d{7,9}$/, 'An A-Number is 7 to 9 digits'),
	mailingAddress: addressShape,
	// Person-level per the glossary (identifies the legal basis the person
	// qualifies under); only I-765 interviews collect it.
	eligibilityCategory: z.string().optional(),
})

// Application-specific answers: never promoted, die with the application.
export const i765SpecificsShape = z.object({
	previousEadCardNumber: z.string().optional(),
	replacementReason: z.enum(['lost', 'stolen', 'destroyed', 'damaged', 'error']).optional(),
	// NOTE: there is deliberately NO `ssn` field. Item 13 ("if known") is
	// optional and this edition has no SSA card-request or consent items, so the
	// app files that box blank and cannot store a Social Security number at all
	// — the storage validator itself rejects one.
	// Item 12 "Have you previously filed Form I-765?" — required.
	previouslyFiledI765: z.enum(yesNo).optional(),
	// Part 3 statement 1.A — 'no' means an interpreter/preparer was involved,
	// which needs Parts 4/5 this app does not prepare.
	preparedSelfInEnglish: z.enum(yesNo).optional(),
	// Items 6-7: physical address only when different from mailing. The I-765's
	// Item 7 is a "U.S. Physical Address" (domestic only) — the shared address
	// shape's foreign fields stay unused here and completion requires a US
	// state + ZIP (interviewValidation).
	physicalAddressSameAsMailing: z.enum(yesNo).optional(),
	physicalAddress: physicalAddressShape.optional(),
	// Item 29 — (c)(26) only: the H-1B spouse's most recent I-797 receipt.
	c26SpouseReceiptNumber: z
		.string()
		.regex(
			RECEIPT_NUMBER_RE,
			'Enter the 13-character receipt number from your notice, including any asterisks',
		)
		.optional(),
	// Item 30 — (c)(8) only: the arrest/conviction question. A "yes" is
	// fileable but requires certified court dispositions (answer-aware
	// document slot) per the form's own note.
	c8EverArrestedOrConvicted: z.enum(yesNo).optional(),
})

// I-90 Part 2 Item 1 "My status is": determines eligibility screening (a
// conditional resident cannot renew via I-90, shared/screening.ts) and which
// reason section the PDF checks (Section A vs B). Collected at application
// creation and editable on the card-details step.
export const i90CardStatuses = ['permanentResident', 'commuter', 'conditionalResident'] as const
export type I90CardStatus = (typeof i90CardStatuses)[number]

// The physical-address shape is declared above (physicalAddressShape) and
// shared by both forms.

export const i90SpecificsShape = z.object({
	cardStatus: z.enum(i90CardStatuses).optional(),
	cardExpirationDate: isoDate.optional(),
	replacementReason: z
		.enum(['lost', 'stolen', 'destroyed', 'damaged', 'error', 'nameChange'])
		.optional(),
	// Part 1 Item 4 + Items 5.A-5.C (the name as printed on the CURRENT card,
	// collected only when the name has legally changed since issuance).
	nameChangedSinceIssuance: z.enum(nameChangeAnswers).optional(),
	previousFamilyName: z.string().optional(),
	previousGivenName: z.string().optional(),
	previousMiddleName: z.string().optional(),
	// Part 1 Item 7.
	physicalAddressSameAsMailing: z.enum(yesNo).optional(),
	physicalAddress: physicalAddressShape.optional(),
	// Part 5 Applicant's Statement (1.A) — 'no' means an interpreter/preparer
	// was involved, which needs Parts 6/7 this app does not prepare.
	preparedSelfInEnglish: z.enum(yesNo).optional(),
	// Part 4 Accommodations: an explicit No box exists on the printed form;
	// detail text presence doubles as the 1.A/1.B/1.C checkbox signal.
	requestingAccommodation: z.enum(yesNo).optional(),
	accommodationDeafSignLanguage: z.string().optional(),
	accommodationBlindDetail: z.string().optional(),
	accommodationOtherDetail: z.string().optional(),
})

// Draft answers are partial by nature — steps fill them in incrementally and
// the strict per-step schemas (interview modules) enforce completeness.
export const i765DraftAnswersShape = z.object({
	personFacts: personFactsShape.partial(),
	form: i765SpecificsShape.partial(),
})

export const i90DraftAnswersShape = z.object({
	personFacts: personFactsShape.partial(),
	form: i90SpecificsShape.partial(),
})

export type PersonFacts = z.infer<typeof personFactsShape>
export type I765DraftAnswers = z.infer<typeof i765DraftAnswersShape>
export type I90DraftAnswers = z.infer<typeof i90DraftAnswersShape>

export const emptyDraftAnswers = { personFacts: {}, form: {} }

export const documentTypes = [
	'passport',
	'ead',
	'permanentResidentCard',
	'i94',
	'socialSecurityCard',
	'photo',
	'other',
] as const
export type DocumentType = (typeof documentTypes)[number]

export const applicationStatuses = ['draft', 'filed', 'closed'] as const
export type ApplicationStatus = (typeof applicationStatuses)[number]

export const requirementStatuses = ['needed', 'attached', 'confirmed', 'waived'] as const
export type RequirementStatus = (typeof requirementStatuses)[number]

// Canonical case statuses (ADR-0008), in pipeline order.
export const caseStatuses = [
	'caseReceived',
	'biometrics',
	'requestForEvidence',
	'approved',
	'cardBeingProduced',
	'cardMailed',
	'cardDelivered',
] as const
export type CaseStatus = (typeof caseStatuses)[number]

export const terminalCaseStatuses: readonly CaseStatus[] = [
	'approved',
	'cardMailed',
	'cardDelivered',
]

// RECEIPT_NUMBER_RE is declared above the form shapes (which reference it).

/** Strip whitespace and separator dashes, preserve asterisks, and uppercase. */
export function normalizeReceiptNumber(raw: string): string {
	return raw.replace(/[\s-]/g, '').toUpperCase()
}

export function isValidReceiptNumber(value: string): boolean {
	return RECEIPT_NUMBER_RE.test(value)
}

export const entitlementStatuses = ['active', 'revoked'] as const
export const entitlementSources = ['revenuecat', 'devStub'] as const

// Filing window (decision 8): a document expiring within this many days is an
// attention item. Matches the I-765 renewal window (~180 days before expiry).
export const filingWindowDays = 180
