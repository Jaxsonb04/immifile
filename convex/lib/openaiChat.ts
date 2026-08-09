// Minimal OpenAI Chat Completions client over fetch — deliberately no SDK
// dependency. Only the two "use node" assistant actions import this; the API
// key never leaves the server.

export type OpenAIChatMessage = { role: 'user' | 'assistant'; content: string }

export type OpenAIChatRequest = {
	apiKey: string
	model: string
	system: string
	messages: OpenAIChatMessage[]
	maxCompletionTokens: number
	/** When set, forces strict JSON-schema structured output. */
	responseFormat?: { name: string; schema: Record<string, unknown> }
}

export type OpenAIChatResult = {
	/** Assembled text (or JSON) content; empty string when the model sent none. */
	content: string
	/** True when the model refused (structured-output refusal or content filter). */
	refused: boolean
}

const OPENAI_CHAT_COMPLETIONS_URL = 'https://api.openai.com/v1/chat/completions'

/**
 * One chat-completion round trip. Throws on network failure or a non-2xx
 * status (callers treat a throw as "not billed" and refund the quota
 * reservation); a 2xx with a refusal or empty content resolves normally so the
 * billed call still counts against quota.
 */
export async function createChatCompletion(request: OpenAIChatRequest): Promise<OpenAIChatResult> {
	const body: Record<string, unknown> = {
		model: request.model,
		messages: [{ role: 'system', content: request.system }, ...request.messages],
		max_completion_tokens: request.maxCompletionTokens,
	}
	// GPT-5-family models spend completion budget on hidden reasoning tokens;
	// pin reasoning and verbosity to the floor so the cheap tier stays cheap.
	// Older models reject these parameters, so send them only where they apply.
	if (request.model.startsWith('gpt-5')) {
		body.reasoning_effort = 'minimal'
		body.verbosity = 'low'
	}
	if (request.responseFormat) {
		body.response_format = {
			type: 'json_schema',
			json_schema: {
				name: request.responseFormat.name,
				strict: true,
				schema: request.responseFormat.schema,
			},
		}
	}

	const response = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			authorization: `Bearer ${request.apiKey}`,
		},
		body: JSON.stringify(body),
	})
	if (!response.ok) {
		// Callers log server-side; never surface OpenAI internals to clients.
		throw new Error(`OpenAI request failed with status ${response.status}`)
	}

	const data = (await response.json()) as {
		choices?: {
			message?: { content?: string | null; refusal?: string | null }
			finish_reason?: string | null
		}[]
	}
	const choice = data.choices?.[0]
	const refused =
		(typeof choice?.message?.refusal === 'string' && choice.message.refusal.length > 0) ||
		choice?.finish_reason === 'content_filter'
	return { content: choice?.message?.content ?? '', refused }
}
