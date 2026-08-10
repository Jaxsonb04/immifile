/**
 * Offline accuracy eval for the safe navigator (convex/navigator.ts).
 *
 * WHY THIS EXISTS: the whole assistant rests on a cheap model reliably filling
 * four fields. Nothing in the vitest suite can catch it drifting — those tests
 * mock the transport — so a model update, a prompt edit, or a parameter change
 * can silently break routing in production. On 2026-08-09 exactly that happened:
 * the extractor deflected the app's own "which form do I need?" use case on
 * roughly one attempt in three. Run this before a release and after ANY change
 * to the prompt, the model id, or the reasoning effort.
 *
 *   OPENAI_API_KEY=$(npx convex env get OPENAI_API_KEY) bun run eval:navigator
 *
 * Flags:
 *   --runs N        repetitions per case (default 3; the failure mode was
 *                   nondeterminism, so a single green pass proves little)
 *   --effort LEVEL  minimal | low | medium | high (default minimal, matching
 *                   production) — use this to justify changing the default
 *   --model ID      override the model under test
 *   --filter TEXT   only run cases whose id contains TEXT
 *
 * Exits non-zero if any case fails any repetition.
 */

import { readFileSync } from 'node:fs'

import { DEFAULT_ASSISTANT_MODEL } from '../convex/shared/assistantModel'
import {
	type AssistantRecommendation,
	navigatorFactsShape,
	preScreen,
	recommend,
} from '../convex/shared/navigator'
import { EXTRACTION_SYSTEM, FACTS_FORMAT } from '../convex/shared/navigatorPrompt'

type HistoryPreset = 'none' | 'greeting' | 'afterRecommendation'
type ChatTurn = { role: 'user' | 'assistant'; content: string }

type ExpectedShape = {
	type: string | string[]
	formType?: string
	applicationKind?: string
	reason?: string
	missing?: string
}

type EvalCase = {
	id: string
	message: string
	history?: HistoryPreset
	expect: ExpectedShape
}

// The greeting is verbatim from src/screens/assistant/assistant.screen.tsx —
// it is the context that was flipping the safety flags, so the eval must carry
// it exactly rather than an approximation.
const GREETING =
	'Hi! I can help you figure out which form to prepare — a work permit (Form I-765) or a green card (Form I-90). Tell me what you need, and I’ll point you to the right one. I share general information only, not legal advice.'

const HISTORIES: Record<HistoryPreset, ChatTurn[]> = {
	none: [],
	greeting: [{ role: 'assistant', content: GREETING }],
	// Mirrors src/screens/assistant/assistant.data.ts `toActionHistory`, which
	// flattens a recommendation card to "<title> (<formLabel>)".
	afterRecommendation: [
		{ role: 'assistant', content: GREETING },
		{ role: 'user', content: 'I need to renew my work permit (EAD).' },
		{ role: 'assistant', content: 'Work permit renewal (Form I-765)' },
	],
}

function arg(name: string): string | undefined {
	const index = process.argv.indexOf(`--${name}`)
	return index === -1 ? undefined : process.argv[index + 1]
}

const RUNS = Number(arg('runs') ?? 3)
const EFFORT = arg('effort') ?? 'minimal'
const MODEL = arg('model') ?? DEFAULT_ASSISTANT_MODEL
const FILTER = arg('filter')

const API_KEY = process.env.OPENAI_API_KEY?.trim()
if (!API_KEY) {
	console.error(
		'OPENAI_API_KEY is not set. Try:\n' +
			'  OPENAI_API_KEY=$(npx convex env get OPENAI_API_KEY) bun run eval:navigator',
	)
	process.exit(2)
}

const fixtures = JSON.parse(
	readFileSync(new URL('./navigator-eval-cases.json', import.meta.url), 'utf8'),
) as { cases: EvalCase[] }

const cases = fixtures.cases.filter((item) => !FILTER || item.id.includes(FILTER))

/** True when the deterministic pre-screen already decides this case, so the
 * model cannot influence it. Reported separately: a suite dominated by these
 * would look green while saying nothing about extraction quality. */
function isDeterministic(message: string): boolean {
	return preScreen(message) !== null
}

function matches(actual: AssistantRecommendation, expected: ExpectedShape): boolean {
	const acceptableTypes = Array.isArray(expected.type) ? expected.type : [expected.type]
	if (!acceptableTypes.includes(actual.type)) return false
	const record = actual as Record<string, unknown>
	for (const field of ['formType', 'applicationKind', 'reason', 'missing'] as const) {
		const want = expected[field]
		if (want !== undefined && record[field] !== want) return false
	}
	return true
}

function describe(recommendation: AssistantRecommendation): string {
	if (recommendation.type === 'supported') {
		return `supported ${recommendation.formType}/${recommendation.applicationKind}`
	}
	if (recommendation.type === 'outOfScope') return `outOfScope ${recommendation.reason}`
	return `needsClarification ${recommendation.missing}`
}

class RateLimited extends Error {}

/** One extraction round trip, mirroring convex/navigator.ts: same prompt, same
 * schema, same defensive parse (unvalidated output becomes "undisclosed"). */
async function classify(item: EvalCase): Promise<AssistantRecommendation> {
	const history = HISTORIES[item.history ?? 'none']
	const response = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: { 'content-type': 'application/json', authorization: `Bearer ${API_KEY}` },
		body: JSON.stringify({
			model: MODEL,
			messages: [
				{ role: 'system', content: EXTRACTION_SYSTEM },
				...history,
				{ role: 'user', content: item.message },
			],
			max_completion_tokens: 2048,
			reasoning_effort: EFFORT,
			verbosity: 'low',
			response_format: {
				type: 'json_schema',
				json_schema: { name: FACTS_FORMAT.name, strict: true, schema: FACTS_FORMAT.schema },
			},
		}),
	})

	if (response.status === 429) {
		const body = (await response.json()) as { error?: { message?: string } }
		throw new RateLimited(body.error?.message ?? 'rate limited')
	}
	if (!response.ok) throw new Error(`OpenAI request failed with status ${response.status}`)

	const data = (await response.json()) as {
		choices?: { message?: { content?: string | null } }[]
	}
	let raw: unknown = null
	try {
		raw = JSON.parse(data.choices?.[0]?.message?.content ?? '')
	} catch {
		raw = null
	}
	const parsed = navigatorFactsShape.safeParse(raw)
	const facts = parsed.success
		? parsed.data
		: {
				credential: 'unclear' as const,
				situation: 'unclear' as const,
				wantsEligibilityOrOutcomeJudgment: false,
				mentionsUnsupportedMatter: false,
			}
	return recommend(item.message, facts)
}

console.log(
	`navigator eval — model=${MODEL} effort=${EFFORT} runs=${RUNS} cases=${cases.length}\n`,
)

let passed = 0
let failed = 0
let modelDependentTotal = 0
let modelDependentPassed = 0
const failures: string[] = []

for (const item of cases) {
	const deterministic = isDeterministic(item.message)
	const observed: string[] = []
	let caseOk = true

	for (let run = 0; run < RUNS; run++) {
		let recommendation: AssistantRecommendation
		try {
			recommendation = await classify(item)
		} catch (error) {
			if (error instanceof RateLimited) {
				console.error(`\nAborted: OpenAI rate limit reached.\n  ${error.message}`)
				console.error('Results so far are partial — rerun once the limit resets.')
				process.exit(2)
			}
			throw error
		}
		observed.push(describe(recommendation))
		if (!matches(recommendation, item.expect)) caseOk = false
	}

	if (!deterministic) {
		modelDependentTotal++
		if (caseOk) modelDependentPassed++
	}
	if (caseOk) {
		passed++
		console.log(`  PASS  ${item.id}${deterministic ? '  (pre-screen)' : ''}`)
	} else {
		failed++
		const unique = [...new Set(observed)].join(', ')
		console.log(`  FAIL  ${item.id}  got: ${unique}`)
		failures.push(`${item.id}\n    message: ${item.message}\n    got:     ${unique}`)
	}
}

console.log(`\n${passed}/${passed + failed} cases passed (${RUNS} runs each)`)
console.log(
	`${modelDependentPassed}/${modelDependentTotal} model-dependent cases passed ` +
		`(the rest are decided by the deterministic pre-screen)`,
)

if (failures.length > 0) {
	console.log(`\nFailures:\n${failures.map((line) => `  ${line}`).join('\n')}`)
	process.exit(1)
}
