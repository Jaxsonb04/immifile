import { afterEach, describe, expect, test, vi } from 'vitest'

import { createChatCompletion } from './openaiChat'

describe('OpenAI chat client data controls', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	test('explicitly disables provider-side application-state storage', async () => {
		const fetchMock = vi.fn(
			async (_input: string | URL | Request, _init?: RequestInit) =>
				new Response(
					JSON.stringify({
						choices: [{ message: { content: 'ok' }, finish_reason: 'stop' }],
					}),
					{ status: 200, headers: { 'content-type': 'application/json' } },
				),
		)
		vi.stubGlobal('fetch', fetchMock)

		await createChatCompletion({
			apiKey: 'test-key',
			model: 'gpt-5-nano',
			system: 'Return a safe test response.',
			messages: [{ role: 'user', content: 'hello' }],
			maxCompletionTokens: 100,
		})

		const request = fetchMock.mock.calls[0]?.[1] as RequestInit | undefined
		const body = JSON.parse(String(request?.body)) as Record<string, unknown>
		expect(body.store).toBe(false)
	})
})
