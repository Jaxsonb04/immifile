/// <reference types="vite/client" />
import { convexTest } from 'convex-test'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { api } from './_generated/api'
import schema from './schema'

// This suite exercises the feature implementation itself, so it runs with the
// release gate open. That the gate actually closes these endpoints in the
// shipped policy is covered separately by convex/releaseGate.test.ts.
vi.mock('../release-policy.json', () => ({
	default: {
		filingPreparation: true,
		assistant: true,
		community: true,
		socialLogin: true,
		passwordRecovery: true,
	},
}))

const modules = import.meta.glob('./**/*.ts')

// Mock the OpenAI transport so tests never hit the network or need a real
// key. `vi.hoisted` makes the spy available inside the hoisted factory.
const { createMock } = vi.hoisted(() => ({ createMock: vi.fn() }))
vi.mock('./lib/openaiChat', () => ({
	createChatCompletion: createMock,
}))

function newT() {
	return convexTest(schema, modules)
}

function okResponse(text = 'Here is some general information about Form I-90.') {
	return { content: text, refused: false }
}

beforeEach(() => {
	vi.stubEnv('OPENAI_API_KEY', 'test-key')
	vi.stubEnv('OPENAI_MODEL', 'gpt-5-nano')
	createMock.mockReset()
	createMock.mockResolvedValue(okResponse())
})

describe('assistant.sendMessage', () => {
	test('returns a validated reply and increments the daily quota', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })

		const res = await alice.action(api.assistant.sendMessage, { message: 'What is Form I-90?' })

		expect(res.reply).toContain('general information')
		expect(res.usage).toEqual({ used: 1, limit: 20, remaining: 19 })
		expect(createMock).toHaveBeenCalledTimes(1)

		// The configured model is used and the user message is the last turn.
		const params = createMock.mock.calls[0]![0]
		expect(params.model).toBe('gpt-5-nano')
		expect(params.messages.at(-1)).toEqual({ role: 'user', content: 'What is Form I-90?' })
		// The daily query reflects the reservation.
		expect(await alice.query(api.assistantQuota.dailyUsage, {})).toEqual({
			used: 1,
			limit: 20,
			remaining: 19,
		})
	})

	test('sends prior device-session history before the new message', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })

		await alice.action(api.assistant.sendMessage, {
			message: 'And the I-765?',
			history: [
				{ role: 'user', content: 'What is Form I-90?' },
				{ role: 'assistant', content: 'It renews a green card.' },
			],
		})

		const params = createMock.mock.calls[0]![0]
		expect(params.messages).toHaveLength(3)
		expect(params.messages[0]).toEqual({ role: 'user', content: 'What is Form I-90?' })
		expect(params.messages.at(-1)).toEqual({ role: 'user', content: 'And the I-765?' })
	})

	test('never exposes secrets in the result', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })

		const res = await alice.action(api.assistant.sendMessage, { message: 'Hello' })

		expect(Object.keys(res).sort()).toEqual(['reply', 'usage'])
		expect(JSON.stringify(res)).not.toContain('test-key')
	})

	test('requires authentication and does not call OpenAI when unauthenticated', async () => {
		const t = newT()
		await expect(t.action(api.assistant.sendMessage, { message: 'hi' })).rejects.toThrow(
			'Not authenticated',
		)
		expect(createMock).not.toHaveBeenCalled()
	})

	test('rejects an empty message before consuming quota', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })

		await expect(
			alice.action(api.assistant.sendMessage, { message: '   ' }),
		).rejects.toThrow(/empty/i)
		expect(createMock).not.toHaveBeenCalled()
		expect(await alice.query(api.assistantQuota.dailyUsage, {})).toMatchObject({ used: 0 })
	})

	test('rejects an over-long message', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })
		await expect(
			alice.action(api.assistant.sendMessage, { message: 'x'.repeat(4001) }),
		).rejects.toThrow(/too long/i)
		expect(createMock).not.toHaveBeenCalled()
	})

	test('enforces the 20-message daily limit', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })

		for (let i = 0; i < 20; i++) {
			await alice.action(api.assistant.sendMessage, { message: `question ${i}` })
		}
		await expect(
			alice.action(api.assistant.sendMessage, { message: 'one too many' }),
		).rejects.toThrow(/message limit/i)

		// The 21st request never reaches OpenAI.
		expect(createMock).toHaveBeenCalledTimes(20)
		expect(await alice.query(api.assistantQuota.dailyUsage, {})).toEqual({
			used: 20,
			limit: 20,
			remaining: 0,
		})
	})

	test("one owner's quota does not affect another owner", async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })
		const bob = t.withIdentity({ subject: 'bob' })

		for (let i = 0; i < 20; i++) {
			await alice.action(api.assistant.sendMessage, { message: `q${i}` })
		}

		const res = await bob.action(api.assistant.sendMessage, { message: 'first for bob' })
		expect(res.usage).toEqual({ used: 1, limit: 20, remaining: 19 })
	})

	test('fails clearly and consumes no quota when the API key is missing', async () => {
		vi.stubEnv('OPENAI_API_KEY', '')
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })

		await expect(
			alice.action(api.assistant.sendMessage, { message: 'Hello' }),
		).rejects.toThrow(/not configured/i)
		expect(createMock).not.toHaveBeenCalled()
		expect(await alice.query(api.assistantQuota.dailyUsage, {})).toMatchObject({ used: 0 })
	})

	test('refunds the reserved message when the OpenAI call fails', async () => {
		createMock.mockRejectedValueOnce(new Error('network down'))
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })

		await expect(
			alice.action(api.assistant.sendMessage, { message: 'Hello' }),
		).rejects.toThrow(/temporarily unavailable/i)

		// Quota refunded — the failed turn did not count.
		expect(await alice.query(api.assistantQuota.dailyUsage, {})).toMatchObject({ used: 0 })
	})

	test('a refusal returns a safe reply and still counts against quota (bounds billed calls)', async () => {
		createMock.mockResolvedValueOnce({ content: '', refused: true })
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })

		const res = await alice.action(api.assistant.sendMessage, { message: 'do something disallowed' })

		expect(res.reply).toMatch(/general information/i)
		// A refusal is a billed OpenAI call, so it is NOT refunded — otherwise
		// refusal-triggering prompts could force unlimited paid calls.
		expect(res.usage).toEqual({ used: 1, limit: 20, remaining: 19 })
		expect(await alice.query(api.assistantQuota.dailyUsage, {})).toMatchObject({ used: 1 })
	})

	test('an empty reply returns a fallback and still counts against quota', async () => {
		createMock.mockResolvedValueOnce({ content: '   ', refused: false })
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })

		const res = await alice.action(api.assistant.sendMessage, { message: 'Hello' })

		expect(res.reply.length).toBeGreaterThan(0)
		expect(res.usage).toEqual({ used: 1, limit: 20, remaining: 19 })
	})

	test('rejects an over-long history turn before consuming quota', async () => {
		const t = newT()
		const alice = t.withIdentity({ subject: 'alice' })

		await expect(
			alice.action(api.assistant.sendMessage, {
				message: 'Hello',
				history: [{ role: 'user', content: 'x'.repeat(4001) }],
			}),
		).rejects.toThrow(/too long/i)
		expect(createMock).not.toHaveBeenCalled()
		expect(await alice.query(api.assistantQuota.dailyUsage, {})).toMatchObject({ used: 0 })
	})
})
