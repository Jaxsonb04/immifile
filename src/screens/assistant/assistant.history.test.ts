// @vitest-environment node
import { expect, test } from 'vitest'
import { prepareAssistantRetry } from './assistant.history'
import type { ChatTurn } from './assistant.types'

const turns: ChatTurn[] = [
	{ id: 'u1', kind: 'user', text: 'Earlier question' },
	{ id: 'a1', kind: 'assistant', content: { kind: 'text', text: 'Earlier reply' } },
	{ id: 'u2', kind: 'user', text: 'Renew my green card' },
	{ id: 'e2', kind: 'error', failedText: 'Renew my green card' },
]

test('retry preserves one user bubble and excludes that message from its own history', () => {
	const retry = prepareAssistantRetry(turns, 'e2')!
	expect(retry.message).toBe('Renew my green card')
	expect(retry.history).toEqual([{ role: 'user', content: 'Earlier question' }, { role: 'assistant', content: 'Earlier reply' }])
	expect(retry.turns).toHaveLength(4)
	expect(retry.turns.at(-1)).toEqual({ id: 'e2', kind: 'pending' })
	expect(turns.at(-1)?.kind).toBe('error')
})

test('retrying an older error preserves newer exchanges without sending them as earlier history', () => {
	const later: ChatTurn = { id: 'u3', kind: 'user', text: 'A later question' }
	const retry = prepareAssistantRetry([...turns, later], 'e2')!
	expect(retry.turns.at(-1)).toEqual(later)
	expect(retry.history).toHaveLength(2)
})

test('stale retry callbacks cannot remove or recreate completed turns', () => {
	expect(prepareAssistantRetry(turns, 'missing')).toBeNull()
	expect(prepareAssistantRetry(turns, 'a1')).toBeNull()
})
