import { z } from 'zod/v4'
import { type ApplicationKind, type FormType, isSupportedSituation } from './applicationShapes'

// M1-T2 "Safe navigator" (ADR-0004: information only, never legal advice, never
// infers eligibility). The assistant's Claude call extracts ONLY these
// plain-language facts — enums and booleans, no free text that influences
// branching. Every decision below is deterministic code the model cannot steer.
//
// Defense-in-depth: two redundant, orthogonal legal-advice/out-of-scope signals
// plus a deterministic pre-screen on the raw text. A single mis-extraction can
// never produce an unsafe result — the only way to reach `supported` is honest
// facts that genuinely map to one of the five supported situations.

export const navigatorFactsShape = z.object({
	credential: z.enum(['workPermit', 'greenCard', 'other', 'unclear']),
	situation: z.enum(['firstTime', 'renewal', 'replacement', 'unclear']),
	// True when the user asks for legal judgment about their case: eligibility
	// categories, approval/denial prediction, RFE/denial strategy. Plain
	// "which form do I need?" routing between the two supported forms is the
	// app's purpose and does NOT set this flag (2026-08-09: it previously did,
	// which made the assistant deflect its own advertised use case).
	wantsEligibilityOrOutcomeJudgment: z.boolean(),
	// True when the user mentions any USCIS matter other than a work permit
	// (I-765) or green card (I-90): asylum, family petition, citizenship, a visa,
	// adjustment of status, etc.
	mentionsUnsupportedMatter: z.boolean(),
})
export type NavigatorFacts = z.infer<typeof navigatorFactsShape>

// The plan's discriminated union (MASTER_PLAN "Interfaces"). A `supported`
// result carries only validated formType/applicationKind values.
export type AssistantRecommendation =
	| { type: 'supported'; formType: FormType; applicationKind: ApplicationKind }
	| { type: 'needsClarification'; missing: 'credential' | 'situation' }
	| { type: 'outOfScope'; reason: 'unsupportedForm' | 'unsupportedSituation' | 'legalAdvice' }

type OutOfScope = Extract<AssistantRecommendation, { type: 'outOfScope' }>

// High-confidence unsupported USCIS matters. Deliberately excludes I-90/I-765
// (the supported forms) and ambiguous bare words like "visa"/"citizen" (handled
// by the model's `mentionsUnsupportedMatter` flag instead).
const UNSUPPORTED_FORM_RE =
	/\b(asylum|i-?130|i-?485|i-?589|i-?751|n-?400|naturaliz\w*|citizenship|adjustment of status|family petition|marriage-based|green ?card lottery|diversity visa|visa lottery)\b/i

// Eligibility category codes (C08, (c)(8), a05, (a)(5)) and clear legal-advice
// phrases. Over-matching is safe here: every hit routes to outOfScope.
const LEGAL_ADVICE_RE =
	/\([ac]\)\s*\(\d{1,2}\)|\b[ac]0\d\b|\bam i eligible\b|\bdo i qualify\b|which (eligibility )?category|will i (be )?(approved|denied|qualify)|should i file|was denied|\brfe\b|request for evidence/i

/**
 * Deterministic pre-screen on the raw user text, evaluated before the model's
 * facts are trusted. Returns an outOfScope recommendation on a hit, else null.
 * `unsupportedForm` is checked before `legalAdvice` so an out-of-scope form
 * gets the honest "we don't handle that form" reason.
 */
export function preScreen(text: string): OutOfScope | null {
	if (UNSUPPORTED_FORM_RE.test(text)) return { type: 'outOfScope', reason: 'unsupportedForm' }
	if (LEGAL_ADVICE_RE.test(text)) return { type: 'outOfScope', reason: 'legalAdvice' }
	return null
}

/**
 * Pure classifier over honest facts. Guarantees: no legal-advice, other-form, or
 * i90-initial case can ever return `supported`.
 */
export function classifyFacts(facts: NavigatorFacts): AssistantRecommendation {
	// Out-of-scope form takes precedence over the legal-advice reason.
	if (facts.mentionsUnsupportedMatter || facts.credential === 'other') {
		return { type: 'outOfScope', reason: 'unsupportedForm' }
	}
	if (facts.wantsEligibilityOrOutcomeJudgment) {
		return { type: 'outOfScope', reason: 'legalAdvice' }
	}
	if (facts.credential === 'unclear') return { type: 'needsClarification', missing: 'credential' }
	if (facts.situation === 'unclear') return { type: 'needsClarification', missing: 'situation' }

	const formType: FormType = facts.credential === 'workPermit' ? 'i765' : 'i90'
	const applicationKind: ApplicationKind =
		facts.situation === 'firstTime' ? 'initial' : facts.situation
	if (isSupportedSituation(formType, applicationKind)) {
		return { type: 'supported', formType, applicationKind }
	}
	// The only combo that reaches here is greenCard + firstTime = I-90 initial,
	// which the product does not handle (there is no first Green Card via I-90).
	return { type: 'outOfScope', reason: 'unsupportedSituation' }
}

/**
 * The safe navigator's full recommendation: the deterministic pre-screen wins;
 * otherwise the honest facts are classified.
 */
export function recommend(text: string, facts: NavigatorFacts): AssistantRecommendation {
	return preScreen(text) ?? classifyFacts(facts)
}
