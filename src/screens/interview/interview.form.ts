import type {
	ApplicationKind,
	FormType,
	I765DraftAnswers,
	I90DraftAnswers,
} from '@convex/shared/applicationShapes'
import {
	addressShape,
	normalizeReceiptNumber,
	personFactsShape,
	RECEIPT_NUMBER_RE,
} from '@convex/shared/applicationShapes'
import { preReviewStepKeys } from '@convex/shared/interviewSteps'
import { i90RenewalCardIsEligible } from '@convex/shared/interviewValidation'
import {
	I765_CATEGORY_NOT_LISTED,
	isI90CardStatus,
	isSupportedI765Category,
	screenI90,
} from '@convex/shared/screening'
import type { DeepKeys } from '@tanstack/react-form'
import { formOptions } from '@tanstack/react-form'
import { z } from 'zod/v4'

// Pure interview metadata — no React Native imports, so it unit-tests in
// vitest. Step BODIES live in steps/ (one component per file); the two are
// joined by step key. Field constraints are projections of the shared Zod
// single-source shapes (ADR-0013) — never re-declared.

/**
 * The single form instance's value shape (ADR-0013): fully defaulted strings
 * so every field is controlled; empties are stripped when building the
 * Next-save payload.
 */
export type InterviewValues = {
	personFacts: {
		givenName: string
		middleName: string
		familyName: string
		dateOfBirth: string
		countryOfBirth: string
		cityOfBirth: string
		stateProvinceOfBirth: string
		countryOfCitizenship: string
		secondCountryOfCitizenship: string
		daytimePhone: string
		email: string
		aNumber: string
		mailingAddress: {
			street: string
			unit: string
			city: string
			state: string
			zipCode: string
		}
		eligibilityCategory: string
		gender: string
		maritalStatus: string
		motherGivenName: string
		fatherGivenName: string
		classOfAdmission: string
		dateOfAdmission: string
		heightFeet: string
		heightInches: string
		weightPounds: string
		eyeColor: string
		hairColor: string
		ethnicity: string
		races: string[]
		locationAppliedVisa: string
		locationIssuedVisa: string
		becameResidentVia: string
		destinationAtAdmission: string
		portOfEntryCityState: string
		everInProceedings: string
		filedI407OrAbandoned: string
		hasUsedOtherNames: string
		otherNames: { familyName: string; givenName: string; middleName: string }[]
		i94Number: string
		usedTravelDocument: string
		passportNumber: string
		travelDocNumber: string
		travelDocCountryOfIssuance: string
		travelDocExpirationDate: string
		dateOfLastEntry: string
		placeOfLastEntry: string
		statusAtLastEntry: string
		currentImmigrationStatus: string
		sevisNumber: string
	}
	form: {
		previousEadCardNumber: string
		replacementReason: string
		ssn: string
		cardExpirationDate: string
		cardStatus: string
		nameChangedSinceIssuance: string
		previousFamilyName: string
		previousGivenName: string
		previousMiddleName: string
		physicalAddressSameAsMailing: string
		physicalAddress: {
			street: string
			unit: string
			city: string
			state: string
			zipCode: string
			province: string
			postalCode: string
			country: string
		}
		previouslyFiledI765: string
		preparedSelfInEnglish: string
		c26SpouseReceiptNumber: string
		c8EverArrestedOrConvicted: string
		requestingAccommodation: string
		accommodationDeafSignLanguage: string
		accommodationBlindDetail: string
		accommodationOtherDetail: string
	}
}

/** Payload slice for `saveApplicationStep` — matches the mutation validator. */
export type StepData = {
	personFacts?: I765DraftAnswers['personFacts']
	form?: I765DraftAnswers['form'] | I90DraftAnswers['form']
}

export type InterviewFieldPath = DeepKeys<InterviewValues>

export type StepDescriptor = {
	key: string
	question: string
	help: string
	/** Paths validated (and marked touched) when Next is pressed. */
	fieldPaths: readonly InterviewFieldPath[]
	/** Slice of the form values persisted by this step's Next-save. */
	buildStepData: (values: InterviewValues, applicationKind: ApplicationKind) => StepData
}

export const emptyInterviewValues: InterviewValues = {
	personFacts: {
		givenName: '',
		middleName: '',
		familyName: '',
		dateOfBirth: '',
		countryOfBirth: '',
		cityOfBirth: '',
		stateProvinceOfBirth: '',
		countryOfCitizenship: '',
		secondCountryOfCitizenship: '',
		daytimePhone: '',
		email: '',
		aNumber: '',
		mailingAddress: { street: '', unit: '', city: '', state: '', zipCode: '' },
		eligibilityCategory: '',
		gender: '',
		maritalStatus: '',
		motherGivenName: '',
		fatherGivenName: '',
		classOfAdmission: '',
		dateOfAdmission: '',
		heightFeet: '',
		heightInches: '',
		weightPounds: '',
		eyeColor: '',
		hairColor: '',
		ethnicity: '',
		races: [],
		locationAppliedVisa: '',
		locationIssuedVisa: '',
		becameResidentVia: '',
		destinationAtAdmission: '',
		portOfEntryCityState: '',
		everInProceedings: '',
		filedI407OrAbandoned: '',
		hasUsedOtherNames: '',
		otherNames: [
			{ familyName: '', givenName: '', middleName: '' },
			{ familyName: '', givenName: '', middleName: '' },
			{ familyName: '', givenName: '', middleName: '' },
		],
		i94Number: '',
		usedTravelDocument: '',
		passportNumber: '',
		travelDocNumber: '',
		travelDocCountryOfIssuance: '',
		travelDocExpirationDate: '',
		dateOfLastEntry: '',
		placeOfLastEntry: '',
		statusAtLastEntry: '',
		currentImmigrationStatus: '',
		sevisNumber: '',
	},
	form: {
		previousEadCardNumber: '',
		replacementReason: '',
		ssn: '',
		cardExpirationDate: '',
		cardStatus: '',
		nameChangedSinceIssuance: '',
		previousFamilyName: '',
		previousGivenName: '',
		previousMiddleName: '',
		physicalAddressSameAsMailing: '',
		physicalAddress: {
			street: '',
			unit: '',
			city: '',
			state: '',
			zipCode: '',
			province: '',
			postalCode: '',
			country: '',
		},
		previouslyFiledI765: '',
		preparedSelfInEnglish: '',
		c26SpouseReceiptNumber: '',
		c8EverArrestedOrConvicted: '',
		requestingAccommodation: '',
		accommodationDeafSignLanguage: '',
		accommodationBlindDetail: '',
		accommodationOtherDetail: '',
	},
}

/**
 * Shared form options: the ONE `useAppForm` instance (screen) and every
 * `withForm` step body derive from these, so their types line up (ADR-0013).
 */
export const interviewFormOptions = formOptions({
	defaultValues: emptyInterviewValues,
})

type DraftAnswers = I765DraftAnswers | I90DraftAnswers

/** Seed the form from the persisted draft (itself profile-seeded at creation). */
export function seedFromDraft(answers: DraftAnswers): InterviewValues {
	const pf = answers.personFacts
	const form = answers.form as Partial<
		Omit<Record<keyof InterviewValues['form'], string>, 'physicalAddress'>
	> & { physicalAddress?: Partial<Record<string, string>> }
	return {
		personFacts: {
			givenName: pf.givenName ?? '',
			middleName: pf.middleName ?? '',
			familyName: pf.familyName ?? '',
			dateOfBirth: pf.dateOfBirth ?? '',
			countryOfBirth: pf.countryOfBirth ?? '',
			cityOfBirth: pf.cityOfBirth ?? '',
			stateProvinceOfBirth: pf.stateProvinceOfBirth ?? '',
			countryOfCitizenship: pf.countryOfCitizenship ?? '',
			secondCountryOfCitizenship: pf.secondCountryOfCitizenship ?? '',
			daytimePhone: pf.daytimePhone ?? '',
			email: pf.email ?? '',
			aNumber: pf.aNumber ?? '',
			gender: pf.gender ?? '',
			maritalStatus: pf.maritalStatus ?? '',
			motherGivenName: pf.motherGivenName ?? '',
			fatherGivenName: pf.fatherGivenName ?? '',
			classOfAdmission: pf.classOfAdmission ?? '',
			dateOfAdmission: pf.dateOfAdmission ?? '',
			heightFeet: pf.heightFeet ?? '',
			heightInches: pf.heightInches ?? '',
			weightPounds: pf.weightPounds ?? '',
			eyeColor: pf.eyeColor ?? '',
			hairColor: pf.hairColor ?? '',
			ethnicity: pf.ethnicity ?? '',
			races: pf.races !== undefined ? [...pf.races] : [],
			locationAppliedVisa: pf.locationAppliedVisa ?? '',
			locationIssuedVisa: pf.locationIssuedVisa ?? '',
			becameResidentVia: pf.becameResidentVia ?? '',
			destinationAtAdmission: pf.destinationAtAdmission ?? '',
			portOfEntryCityState: pf.portOfEntryCityState ?? '',
			everInProceedings: pf.everInProceedings ?? '',
			filedI407OrAbandoned: pf.filedI407OrAbandoned ?? '',
			hasUsedOtherNames: pf.hasUsedOtherNames ?? '',
			// The wizard renders three fixed rows; persisted rows fill from the top.
			otherNames: Array.from({ length: 3 }, (_, index) => ({
				familyName: pf.otherNames?.[index]?.familyName ?? '',
				givenName: pf.otherNames?.[index]?.givenName ?? '',
				middleName: pf.otherNames?.[index]?.middleName ?? '',
			})),
			i94Number: pf.i94Number ?? '',
			usedTravelDocument: pf.usedTravelDocument ?? '',
			passportNumber: pf.passportNumber ?? '',
			travelDocNumber: pf.travelDocNumber ?? '',
			travelDocCountryOfIssuance: pf.travelDocCountryOfIssuance ?? '',
			travelDocExpirationDate: pf.travelDocExpirationDate ?? '',
			dateOfLastEntry: pf.dateOfLastEntry ?? '',
			placeOfLastEntry: pf.placeOfLastEntry ?? '',
			statusAtLastEntry: pf.statusAtLastEntry ?? '',
			currentImmigrationStatus: pf.currentImmigrationStatus ?? '',
			sevisNumber: pf.sevisNumber ?? '',
			mailingAddress: {
				street: pf.mailingAddress?.street ?? '',
				unit: pf.mailingAddress?.unit ?? '',
				city: pf.mailingAddress?.city ?? '',
				state: pf.mailingAddress?.state ?? '',
				zipCode: pf.mailingAddress?.zipCode ?? '',
			},
			eligibilityCategory: pf.eligibilityCategory ?? '',
		},
		form: {
			previousEadCardNumber: form.previousEadCardNumber ?? '',
			replacementReason: form.replacementReason ?? '',
			ssn: form.ssn ?? '',
			cardExpirationDate: form.cardExpirationDate ?? '',
			cardStatus: form.cardStatus ?? '',
			nameChangedSinceIssuance: form.nameChangedSinceIssuance ?? '',
			previousFamilyName: form.previousFamilyName ?? '',
			previousGivenName: form.previousGivenName ?? '',
			previousMiddleName: form.previousMiddleName ?? '',
			physicalAddressSameAsMailing: form.physicalAddressSameAsMailing ?? '',
			physicalAddress: {
				street: form.physicalAddress?.street ?? '',
				unit: form.physicalAddress?.unit ?? '',
				city: form.physicalAddress?.city ?? '',
				state: form.physicalAddress?.state ?? '',
				zipCode: form.physicalAddress?.zipCode ?? '',
				province: form.physicalAddress?.province ?? '',
				postalCode: form.physicalAddress?.postalCode ?? '',
				country: form.physicalAddress?.country ?? '',
			},
			previouslyFiledI765: form.previouslyFiledI765 ?? '',
			preparedSelfInEnglish: form.preparedSelfInEnglish ?? '',
			c26SpouseReceiptNumber: form.c26SpouseReceiptNumber ?? '',
			c8EverArrestedOrConvicted: form.c8EverArrestedOrConvicted ?? '',
			requestingAccommodation: form.requestingAccommodation ?? '',
			accommodationDeafSignLanguage: form.accommodationDeafSignLanguage ?? '',
			accommodationBlindDetail: form.accommodationBlindDetail ?? '',
			accommodationOtherDetail: form.accommodationOtherDetail ?? '',
		},
	}
}

const orEmpty = <T extends z.ZodType<string, string>>(schema: T) => z.union([schema, z.literal('')])

/**
 * Field validators, projected from the shared shapes. Kind-aware where the
 * requirement genuinely depends on the situation (an initial work-permit
 * applicant may not have an A-Number yet).
 */
export const fieldValidators = {
	givenName: personFactsShape.shape.givenName,
	familyName: personFactsShape.shape.familyName,
	dateOfBirth: personFactsShape.shape.dateOfBirth,
	countryOfBirth: personFactsShape.shape.countryOfBirth,
	cityOfBirth: personFactsShape.shape.cityOfBirth,
	countryOfCitizenship: personFactsShape.shape.countryOfCitizenship,
	// UI accepts separators; buildStepData strips to the digits the shape stores.
	daytimePhone: z
		.string()
		.refine(
			(value) => value.replace(/\D/g, '').length === 10,
			'Enter a 10-digit U.S. phone number',
		),
	email: orEmpty(z.email('Enter a valid email address')),
	// i90 immigration-history / card-details / statement additions. Choice
	// fields share one required-choice rule; the pickers enforce the value sets.
	requiredChoice: z.string().min(1, 'Choose an option'),
	locationAppliedVisa: personFactsShape.shape.locationAppliedVisa,
	locationIssuedVisa: personFactsShape.shape.locationIssuedVisa,
	destinationAtAdmission: personFactsShape.shape.destinationAtAdmission,
	portOfEntryCityState: personFactsShape.shape.portOfEntryCityState,
	previousFamilyName: z.string().min(1, 'Family name is required'),
	previousGivenName: z.string().min(1, 'First name is required'),
	physicalStreet: z.string().min(1, 'Street address is required'),
	physicalCity: z.string().min(1, 'City is required'),
	// i765 last-arrival + category items.
	otherNameFamily: z.string().min(1, 'Family name is required'),
	otherNameGiven: z.string().min(1, 'First name is required'),
	i94Number: orEmpty(personFactsShape.shape.i94Number),
	travelDocCountryOfIssuance: personFactsShape.shape.travelDocCountryOfIssuance,
	travelDocExpirationDate: personFactsShape.shape.travelDocExpirationDate,
	dateOfLastEntry: personFactsShape.shape.dateOfLastEntry,
	placeOfLastEntry: personFactsShape.shape.placeOfLastEntry,
	statusAtLastEntry: personFactsShape.shape.statusAtLastEntry,
	currentImmigrationStatus: personFactsShape.shape.currentImmigrationStatus,
	sevisNumber: orEmpty(personFactsShape.shape.sevisNumber),
	c26SpouseReceiptNumber: z
		.string()
		.refine(
			(value) => RECEIPT_NUMBER_RE.test(normalizeReceiptNumber(value)),
			'Enter the 13-character receipt number from your notice, including any asterisks',
		),
	// i90 personal-details / physical-description (choice sets are enforced by
	// the pickers; these gate required-ness and formats).
	gender: z.string().min(1, 'Choose an option'),
	motherGivenName: personFactsShape.shape.motherGivenName,
	fatherGivenName: personFactsShape.shape.fatherGivenName,
	classOfAdmission: personFactsShape.shape.classOfAdmission,
	dateOfAdmission: personFactsShape.shape.dateOfAdmission,
	heightFeet: z.string().min(1, 'Feet'),
	heightInches: z.string().min(1, 'Inches'),
	weightPounds: personFactsShape.shape.weightPounds,
	eyeColor: z.string().min(1, 'Choose your eye color'),
	hairColor: z.string().min(1, 'Choose your hair color'),
	ethnicity: z.string().min(1, 'Choose an option'),
	races: z.array(z.string()).min(1, 'Select at least one'),
	// Conditional validators return one widened type so TanStack's per-field
	// validator generic unifies across both branches.
	aNumber: (kind: ApplicationKind): z.ZodType<string, string> =>
		kind === 'initial' ? orEmpty(personFactsShape.shape.aNumber) : personFactsShape.shape.aNumber,
	street: addressShape.shape.street,
	city: addressShape.shape.city,
	state: addressShape.shape.state,
	zipCode: addressShape.shape.zipCode,
	eligibilityCategory: z
		.string()
		.min(1, 'Choose your category')
		.refine(
			(value) => isSupportedI765Category(value),
			"This app doesn't prepare that category yet — see the note below.",
		),
	replacementReason: (kind: ApplicationKind): z.ZodType<string, string> =>
		kind === 'replacement'
			? z.string().min(1, 'Choose what happened to your card')
			: orEmpty(z.string()),
	nameChangedSinceIssuance: (
		kind: ApplicationKind,
		replacementReason: string,
	): z.ZodType<string, string> =>
		z
			.string()
			.min(1, 'Choose an answer')
			.refine(
				(value) =>
					kind === 'renewal'
						? value === 'no'
						: replacementReason !== 'nameChange' || value === 'yes',
				kind === 'renewal'
					? 'A legal name change or never-received card uses a different I-90 reason; start a replacement instead'
					: 'Choose Yes because this replacement reason says your legal name changed',
			),
	cardExpirationDate: (kind: ApplicationKind): z.ZodType<string, string> =>
		kind === 'renewal'
			? personFactsShape.shape.dateOfBirth.refine(
					(value) => i90RenewalCardIsEligible(value),
					'Form I-90 renewal is for a card that is expired or expires within six months',
				)
			: orEmpty(personFactsShape.shape.dateOfBirth),
	// Kind-aware: the value set is enforced by the radio options; the refine
	// blocks the one unsupported combination (conditional resident + renewal,
	// shared/screening.ts) with an inline explanation below the field.
	cardStatus: (kind: ApplicationKind): z.ZodType<string, string> =>
		z
			.string()
			.min(1, 'Choose your card type')
			.refine(
				(value) => !isI90CardStatus(value) || screenI90(value, kind).supported,
				"A 2-year conditional card can't be renewed with Form I-90 — see the note below.",
			),
}

const dropEmpty = <T extends Record<string, string>>(record: T): Partial<T> =>
	Object.fromEntries(Object.entries(record).filter(([, value]) => value !== '')) as Partial<T>

const sharedSteps: StepDescriptor[] = [
	{
		key: 'legal-name',
		question: 'What is your legal name?',
		help: 'Use your name exactly as it appears on your immigration documents. If your name has changed, use your current legal name — you can note prior names later.',
		fieldPaths: [
			'personFacts.givenName',
			'personFacts.middleName',
			'personFacts.familyName',
			'personFacts.hasUsedOtherNames',
			'personFacts.otherNames[0].familyName',
			'personFacts.otherNames[0].givenName',
			'personFacts.otherNames[0].middleName',
			'personFacts.otherNames[1].familyName',
			'personFacts.otherNames[1].givenName',
			'personFacts.otherNames[1].middleName',
			'personFacts.otherNames[2].familyName',
			'personFacts.otherNames[2].givenName',
			'personFacts.otherNames[2].middleName',
		],
		buildStepData: (values) => {
			// Compact the three fixed rows down to the ones actually filled; a
			// partially filled row is kept so the server's Zod parse rejects it
			// (the row validators surface the problem first in the UI).
			const otherNames = values.personFacts.otherNames
				.filter(
					(row) =>
						row.familyName.trim() !== '' ||
						row.givenName.trim() !== '' ||
						row.middleName.trim() !== '',
				)
				.map((row) => ({
					familyName: row.familyName,
					givenName: row.givenName,
					...(row.middleName === '' ? {} : { middleName: row.middleName }),
				}))
			return {
				personFacts: {
					...dropEmpty({
						givenName: values.personFacts.givenName,
						middleName: values.personFacts.middleName,
						familyName: values.personFacts.familyName,
						hasUsedOtherNames: values.personFacts.hasUsedOtherNames,
					}),
					// Only an i765 answers the question; the rows ride along only
					// on a yes (the i90 UI never sets either).
					...(values.personFacts.hasUsedOtherNames === 'yes' && otherNames.length > 0
						? { otherNames }
						: {}),
				} as StepData['personFacts'],
			}
		},
	},
	{
		key: 'date-of-birth',
		question: 'When were you born?',
		help: 'Use your date of birth exactly as it appears on your passport or birth certificate.',
		fieldPaths: ['personFacts.dateOfBirth'],
		buildStepData: (values) => ({
			personFacts: dropEmpty({ dateOfBirth: values.personFacts.dateOfBirth }),
		}),
	},
	{
		key: 'country-of-birth',
		question: 'Where were you born?',
		help: 'Enter your birthplace as it appears on your passport or birth certificate, even if the country has since changed its name.',
		fieldPaths: [
			'personFacts.cityOfBirth',
			'personFacts.stateProvinceOfBirth',
			'personFacts.countryOfBirth',
		],
		buildStepData: (values) => ({
			personFacts: dropEmpty({
				cityOfBirth: values.personFacts.cityOfBirth,
				stateProvinceOfBirth: values.personFacts.stateProvinceOfBirth,
				countryOfBirth: values.personFacts.countryOfBirth,
			}),
		}),
	},
	{
		key: 'a-number',
		question: 'What is your A-Number?',
		help: 'Your Alien Registration Number starts with "A" followed by 7–9 digits. Find it on your Green Card, EAD, or any USCIS notice. If this is your first work permit and you don\'t have one yet, leave it blank.',
		fieldPaths: ['personFacts.aNumber'],
		buildStepData: (values) => ({
			personFacts: dropEmpty({ aNumber: values.personFacts.aNumber }),
		}),
	},
	{
		key: 'mailing-address',
		question: 'Where should USCIS send your mail?',
		help: 'Use an address where you can reliably receive mail for the next several months — USCIS sends your receipt notice, biometrics appointment, and your new card here.',
		fieldPaths: [
			'personFacts.mailingAddress.street',
			'personFacts.mailingAddress.unit',
			'personFacts.mailingAddress.city',
			'personFacts.mailingAddress.state',
			'personFacts.mailingAddress.zipCode',
			// i90-only (Part 1 Item 7): the physical-address question; the UI
			// renders these only for I-90, so I-765 saves emit no form keys.
			'form.physicalAddressSameAsMailing',
			'form.physicalAddress.street',
			'form.physicalAddress.unit',
			'form.physicalAddress.city',
			'form.physicalAddress.state',
			'form.physicalAddress.zipCode',
			'form.physicalAddress.province',
			'form.physicalAddress.postalCode',
			'form.physicalAddress.country',
		],
		buildStepData: (values) => {
			const address = values.personFacts.mailingAddress
			const same = values.form.physicalAddressSameAsMailing
			const physical = values.form.physicalAddress
			return {
				personFacts: {
					mailingAddress: {
						street: address.street,
						...(address.unit === '' ? {} : { unit: address.unit }),
						city: address.city,
						state: address.state,
						zipCode: address.zipCode,
					},
				},
				form: {
					...dropEmpty({ physicalAddressSameAsMailing: same }),
					...(same === 'no'
						? {
								physicalAddress: {
									street: physical.street,
									city: physical.city,
									...dropEmpty({
										unit: physical.unit,
										state: physical.state,
										zipCode: physical.zipCode,
										province: physical.province,
										postalCode: physical.postalCode,
										country: physical.country,
									}),
								},
							}
						: {}),
				} as StepData['form'],
			}
		},
	},
]

/** I-765 only (Item 14): citizenship is distinct from country of birth. */
const citizenshipStep: StepDescriptor = {
	key: 'citizenship',
	question: 'What country are you a citizen of?',
	help: 'List every country where you are currently a citizen or national. If you are stateless, enter the country where you were last a citizen.',
	fieldPaths: ['personFacts.countryOfCitizenship', 'personFacts.secondCountryOfCitizenship'],
	buildStepData: (values) => ({
		personFacts: dropEmpty({
			countryOfCitizenship: values.personFacts.countryOfCitizenship,
			secondCountryOfCitizenship: values.personFacts.secondCountryOfCitizenship,
		}),
	}),
}

/** Both forms: USCIS applicant contact block (I-765 Part 3 / I-90 Part 5). */
const contactInfoStep: StepDescriptor = {
	key: 'contact-info',
	question: 'How can USCIS reach you?',
	help: 'USCIS may need to call about your application. Use a daytime phone number you actually answer; email is optional but recommended.',
	fieldPaths: ['personFacts.daytimePhone', 'personFacts.email'],
	buildStepData: (values) => ({
		personFacts: dropEmpty({
			// The shape stores digits only; the field accepts human formatting.
			daytimePhone: values.personFacts.daytimePhone.replace(/\D/g, ''),
			email: values.personFacts.email.trim(),
		}),
	}),
}

/** I-90 only: Part 1 Additional Information (all required printed items). */
const personalDetailsStep: StepDescriptor = {
	key: 'personal-details',
	question: 'A few details about you',
	help: 'USCIS uses these to match your immigration record. Your class of admission is the category code printed on your Green Card under "Category" (for example IR1); your date of admission is the "Resident Since" date.',
	fieldPaths: [
		'personFacts.gender',
		'personFacts.motherGivenName',
		'personFacts.fatherGivenName',
		'personFacts.classOfAdmission',
		'personFacts.dateOfAdmission',
	],
	buildStepData: (values) => ({
		// The pickers restrict the values to the shared enums; the string-typed
		// form state needs the cast back to the shaped slice.
		personFacts: dropEmpty({
			gender: values.personFacts.gender,
			motherGivenName: values.personFacts.motherGivenName,
			fatherGivenName: values.personFacts.fatherGivenName,
			classOfAdmission: values.personFacts.classOfAdmission.trim().toUpperCase(),
			dateOfAdmission: values.personFacts.dateOfAdmission,
		}) as StepData['personFacts'],
	}),
}

/** I-90 only: Part 3 Processing Information (Items 1-5). */
const immigrationHistoryStep: StepDescriptor = {
	key: 'immigration-history',
	question: 'How you became a permanent resident',
	help: 'These match your original immigrant-visa or adjustment-of-status record. If you don\'t remember an exact office name, use the city and country (for example "Ciudad Juarez, Mexico") or the USCIS office (for example "USCIS Chicago").',
	fieldPaths: [
		'personFacts.locationAppliedVisa',
		'personFacts.locationIssuedVisa',
		'personFacts.becameResidentVia',
		'personFacts.destinationAtAdmission',
		'personFacts.portOfEntryCityState',
		'personFacts.everInProceedings',
		'personFacts.filedI407OrAbandoned',
	],
	buildStepData: (values) => {
		const via = values.personFacts.becameResidentVia
		return {
			personFacts: dropEmpty({
				locationAppliedVisa: values.personFacts.locationAppliedVisa,
				locationIssuedVisa: values.personFacts.locationIssuedVisa,
				becameResidentVia: via,
				// Items 3.A/3.A.1 apply only to immigrant-visa entries.
				...(via === 'immigrantVisa'
					? {
							destinationAtAdmission: values.personFacts.destinationAtAdmission,
							portOfEntryCityState: values.personFacts.portOfEntryCityState,
						}
					: {}),
				everInProceedings: values.personFacts.everInProceedings,
				filedI407OrAbandoned: values.personFacts.filedI407OrAbandoned,
			}) as StepData['personFacts'],
		}
	},
}

/** I-765 only: Part 2 Items 17-26, Information About Your Last Arrival. */
const lastArrivalStep: StepDescriptor = {
	key: 'last-arrival',
	question: 'Your last arrival in the U.S.',
	help: 'Answer about your most recent entry. If CBP issued you an electronic I-94, you can look it up at cbp.gov/i94. If you entered without a passport or travel document, answer "No" to that question — the form allows it.',
	fieldPaths: [
		'personFacts.dateOfLastEntry',
		'personFacts.placeOfLastEntry',
		'personFacts.statusAtLastEntry',
		'personFacts.currentImmigrationStatus',
		'personFacts.i94Number',
		'personFacts.usedTravelDocument',
		'personFacts.passportNumber',
		'personFacts.travelDocNumber',
		'personFacts.travelDocCountryOfIssuance',
		'personFacts.travelDocExpirationDate',
		'personFacts.sevisNumber',
	],
	buildStepData: (values) => {
		const pf = values.personFacts
		return {
			personFacts: dropEmpty({
				dateOfLastEntry: pf.dateOfLastEntry,
				placeOfLastEntry: pf.placeOfLastEntry,
				statusAtLastEntry: pf.statusAtLastEntry,
				currentImmigrationStatus: pf.currentImmigrationStatus,
				i94Number: pf.i94Number,
				usedTravelDocument: pf.usedTravelDocument,
				sevisNumber: pf.sevisNumber,
				// Items 18-21 apply only when a document was used to travel.
				...(pf.usedTravelDocument === 'yes'
					? {
							passportNumber: pf.passportNumber,
							travelDocNumber: pf.travelDocNumber,
							travelDocCountryOfIssuance: pf.travelDocCountryOfIssuance,
							travelDocExpirationDate: pf.travelDocExpirationDate,
						}
					: {}),
			}) as StepData['personFacts'],
		}
	},
}

/** I-765 only: Part 2 Other Information (Items 10-12). Item 13 (SSN, "if
 * known") is deliberately not collected — the app files it blank rather than
 * store the most sensitive identifier, and this edition has no SSA
 * card-request items at all. */
const otherInformationStep: StepDescriptor = {
	key: 'other-information',
	question: 'A few details about you',
	help: 'USCIS asks these on the work-permit form. We do not ask for your Social Security number — that box is optional and this app leaves it blank.',
	fieldPaths: ['personFacts.gender', 'personFacts.maritalStatus', 'form.previouslyFiledI765'],
	buildStepData: (values) => ({
		personFacts: dropEmpty({
			gender: values.personFacts.gender,
			maritalStatus: values.personFacts.maritalStatus,
		}) as StepData['personFacts'],
		form: dropEmpty({
			previouslyFiledI765: values.form.previouslyFiledI765,
		}) as StepData['form'],
	}),
}

/** Both forms: the applicant's statement (I-765 Part 3 / I-90 Part 5). The
 * accommodation questions are I-90-only (its Part 4) and the UI renders them
 * only for that form, so an I-765 save simply drops those empty keys. */
const applicantStatementStep: StepDescriptor = {
	key: 'applicant-statement',
	question: 'A few final declarations',
	help: 'The official form asks how you prepared this application, and (on Form I-90) whether you need an accommodation from USCIS because of a disability or impairment.',
	fieldPaths: [
		'form.preparedSelfInEnglish',
		'form.requestingAccommodation',
		'form.accommodationDeafSignLanguage',
		'form.accommodationBlindDetail',
		'form.accommodationOtherDetail',
	],
	buildStepData: (values) => {
		const requesting = values.form.requestingAccommodation
		return {
			form: {
				...dropEmpty({
					preparedSelfInEnglish: values.form.preparedSelfInEnglish,
					requestingAccommodation: requesting,
				}),
				...(requesting === 'yes'
					? dropEmpty({
							accommodationDeafSignLanguage: values.form.accommodationDeafSignLanguage,
							accommodationBlindDetail: values.form.accommodationBlindDetail,
							accommodationOtherDetail: values.form.accommodationOtherDetail,
						})
					: {}),
			} as StepData['form'],
		}
	},
}

/** I-90 only: Part 3 Biographic Information. */
const physicalDescriptionStep: StepDescriptor = {
	key: 'physical-description',
	question: 'Your physical description',
	help: 'USCIS collects this biographic information for identity verification. Answer as it would appear on official records.',
	fieldPaths: [
		'personFacts.heightFeet',
		'personFacts.heightInches',
		'personFacts.weightPounds',
		'personFacts.eyeColor',
		'personFacts.hairColor',
		'personFacts.ethnicity',
		'personFacts.races',
	],
	buildStepData: (values) => {
		const races = values.personFacts.races
		return {
			personFacts: {
				...dropEmpty({
					heightFeet: values.personFacts.heightFeet,
					heightInches: values.personFacts.heightInches,
					weightPounds: values.personFacts.weightPounds.replace(/\D/g, ''),
					eyeColor: values.personFacts.eyeColor,
					hairColor: values.personFacts.hairColor,
					ethnicity: values.personFacts.ethnicity,
				}),
				...(races.length > 0 ? { races } : {}),
			} as StepData['personFacts'],
		}
	},
}

const i765FinalStep: StepDescriptor = {
	key: 'eligibility-category',
	question: 'What is your eligibility category?',
	help: 'Your category is the code that says why you qualify for a work permit. Find it on your current EAD under "Category". A couple of categories have one extra question, asked below.',
	fieldPaths: [
		'personFacts.eligibilityCategory',
		'form.replacementReason',
		'form.c26SpouseReceiptNumber',
		'form.c8EverArrestedOrConvicted',
	],
	buildStepData: (values, kind) => {
		const category = values.personFacts.eligibilityCategory
		return {
			personFacts: dropEmpty({ eligibilityCategory: category }),
			form: {
				...(kind === 'replacement'
					? dropEmpty({ replacementReason: values.form.replacementReason })
					: {}),
				// Category-specific items ride along only for their category.
				...(category === 'C26' && values.form.c26SpouseReceiptNumber !== ''
					? { c26SpouseReceiptNumber: normalizeReceiptNumber(values.form.c26SpouseReceiptNumber) }
					: {}),
				...(category === 'C08'
					? dropEmpty({ c8EverArrestedOrConvicted: values.form.c8EverArrestedOrConvicted })
					: {}),
			} as StepData['form'],
		}
	},
}

const i90FinalStep: StepDescriptor = {
	key: 'card-details',
	question: 'Tell us about your current card',
	help: 'Confirm what kind of card you have and find the expiration date on its front. If your name has legally changed since the card was issued, we also need the name printed on it.',
	fieldPaths: [
		'form.cardStatus',
		'form.cardExpirationDate',
		'form.replacementReason',
		'form.nameChangedSinceIssuance',
		'form.previousFamilyName',
		'form.previousGivenName',
		'form.previousMiddleName',
	],
	buildStepData: (values, kind) => ({
		form: {
			...dropEmpty({
				cardStatus: values.form.cardStatus,
				cardExpirationDate: values.form.cardExpirationDate,
				nameChangedSinceIssuance: values.form.nameChangedSinceIssuance,
			}),
			// Items 5.A-5.C apply only when the name has legally changed.
			...(values.form.nameChangedSinceIssuance === 'yes'
				? dropEmpty({
						previousFamilyName: values.form.previousFamilyName,
						previousGivenName: values.form.previousGivenName,
						previousMiddleName: values.form.previousMiddleName,
					})
				: {}),
			...(kind === 'replacement'
				? dropEmpty({ replacementReason: values.form.replacementReason })
				: {}),
		} as StepData['form'],
	}),
}

// sharedSteps order: [legal-name, date-of-birth, country-of-birth, a-number,
// mailing-address]. The blueprint-sync unit test pins these composites against
// interviewSteps.ts, so a drifted splice fails CI instead of shipping.
const descriptorsByForm: Record<FormType, readonly StepDescriptor[]> = {
	i765: [
		...sharedSteps.slice(0, 3),
		citizenshipStep,
		otherInformationStep,
		lastArrivalStep,
		...sharedSteps.slice(3),
		contactInfoStep,
		i765FinalStep,
		applicantStatementStep,
	],
	i90: [
		...sharedSteps.slice(0, 3),
		personalDetailsStep,
		immigrationHistoryStep,
		...sharedSteps.slice(3),
		contactInfoStep,
		physicalDescriptionStep,
		i90FinalStep,
		applicantStatementStep,
	],
}

/**
 * The visible interview steps for a form family — every pre-Review blueprint
 * step, in blueprint order (asserted by unit tests so the server's
 * saveApplicationStep never rejects a key we render).
 */
export function stepDescriptorsFor(formType: FormType): readonly StepDescriptor[] {
	return descriptorsByForm[formType]
}

/** First incomplete step index — where the wizard resumes. */
export function initialStepIndex(formType: FormType, currentStepKey: string | undefined): number {
	const index = descriptorsByForm[formType].findIndex((step) => step.key === currentStepKey)
	return index === -1 ? 0 : index
}

// Re-export so tests can assert descriptor/blueprint alignment through one import.
export { preReviewStepKeys }

// The picker mirrors shared/screening.ts supportedI765Categories exactly (a
// unit test pins the two in sync) plus the "not listed" stop, which can never
// validate — it exists to explain the boundary instead of hiding it.
export const eligibilityCategoryOptions = [
	{ value: 'C08', label: 'C08 — Pending asylum application' },
	{ value: 'C09', label: 'C09 — Pending green card application' },
	{ value: 'C10', label: 'C10 — Cancellation of removal' },
	{ value: 'C33', label: 'C33 — DACA' },
	{ value: 'A05', label: 'A05 — Asylum granted' },
	{ value: 'A03', label: 'A03 — Refugee' },
	{ value: 'A17', label: 'A17 — Spouse of E visa holder' },
	{ value: 'C26', label: 'C26 — Spouse of H-1B holder' },
	{ value: I765_CATEGORY_NOT_LISTED, label: "My category isn't listed" },
] as const

/** I-90 card/status options (Part 2 Item 1), shared by the new-application
 * pre-screen and the card-details step. */
export const cardStatusOptions = [
	{
		value: 'permanentResident',
		label: '10-year Permanent Resident Card',
		description: 'Lawful permanent resident',
	},
	{
		value: 'commuter',
		label: 'Commuter Green Card',
		description: 'Permanent resident in commuter status',
	},
	{
		value: 'conditionalResident',
		label: '2-year conditional card',
		description: 'Conditional permanent resident (for example CR1, CR2, CF1, CF2)',
	},
] as const

// I-90 biographic pickers — values mirror the applicationShapes enums (pinned
// by unit test), labels mirror the printed form's option text.
export const genderOptions = [
	{ value: 'male', label: 'Male' },
	{ value: 'female', label: 'Female' },
] as const

export const heightFeetOptions = ['2', '3', '4', '5', '6', '7', '8'].map((value) => ({
	value,
	label: `${value} ft`,
}))

export const heightInchesOptions = Array.from({ length: 12 }, (_, index) => ({
	value: String(index),
	label: `${index} in`,
}))

export const eyeColorOptions = [
	{ value: 'black', label: 'Black' },
	{ value: 'blue', label: 'Blue' },
	{ value: 'brown', label: 'Brown' },
	{ value: 'gray', label: 'Gray' },
	{ value: 'green', label: 'Green' },
	{ value: 'hazel', label: 'Hazel' },
	{ value: 'maroon', label: 'Maroon' },
	{ value: 'pink', label: 'Pink' },
	{ value: 'unknownOrOther', label: 'Unknown / other' },
] as const

export const hairColorOptions = [
	{ value: 'bald', label: 'Bald (no hair)' },
	{ value: 'black', label: 'Black' },
	{ value: 'blond', label: 'Blond' },
	{ value: 'brown', label: 'Brown' },
	{ value: 'gray', label: 'Gray' },
	{ value: 'red', label: 'Red' },
	{ value: 'sandy', label: 'Sandy' },
	{ value: 'white', label: 'White' },
	{ value: 'unknownOrOther', label: 'Unknown / other' },
] as const

export const ethnicityOptions = [
	{ value: 'hispanicOrLatino', label: 'Hispanic or Latino' },
	{ value: 'notHispanicOrLatino', label: 'Not Hispanic or Latino' },
] as const

export const raceOptions = [
	{
		value: 'americanIndianOrAlaskaNative',
		label: 'American Indian or Alaska Native',
	},
	{ value: 'asian', label: 'Asian' },
	{ value: 'blackOrAfricanAmerican', label: 'Black or African American' },
	{
		value: 'nativeHawaiianOrOtherPacificIslander',
		label: 'Native Hawaiian or Other Pacific Islander',
	},
	{ value: 'white', label: 'White' },
] as const

export const yesNoOptions = [
	{ value: 'yes', label: 'Yes' },
	{ value: 'no', label: 'No' },
] as const

/** I-765 Item 11 marital status — mirrors the printed form's four boxes. */
export const maritalStatusOptions = [
	{ value: 'single', label: 'Single' },
	{ value: 'married', label: 'Married' },
	{ value: 'divorced', label: 'Divorced' },
	{ value: 'widowed', label: 'Widowed' },
] as const

export const residencyPathOptions = [
	{
		value: 'immigrantVisa',
		label: 'With an immigrant visa',
		description: 'You entered the U.S. at a port of entry using an immigrant visa',
	},
	{
		value: 'adjustmentOfStatus',
		label: 'Adjustment of status',
		description: 'You were already in the U.S. and USCIS granted your green card',
	},
] as const

export const nameChangeOptions = [
	{ value: 'no', label: 'No' },
	{
		value: 'yes',
		label: 'Yes',
		description: 'Attach evidence of the legal name change when you file',
	},
	{
		value: 'neverReceivedCard',
		label: 'Not applicable — I never received my previous card',
	},
] as const

export const replacementReasonOptions = (formType: FormType) => [
	{ value: 'lost', label: 'It was lost' },
	{ value: 'stolen', label: 'It was stolen' },
	{ value: 'destroyed', label: 'It was destroyed' },
	{
		value: 'damaged',
		label: formType === 'i90' ? 'It was damaged or mutilated' : 'It was damaged',
	},
	{
		value: 'error',
		label:
			formType === 'i90'
				? 'DHS put incorrect data on it'
				: 'It has incorrect data not caused by USCIS',
	},
	...(formType === 'i90' ? [{ value: 'nameChange', label: 'My name changed' }] : []),
]
