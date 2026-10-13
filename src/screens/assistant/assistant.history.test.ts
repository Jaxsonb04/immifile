// @vitest-environment node
import { expect, test } from 'vitest'
import { prepareAssistantRetry, toActionHistory } from './assistant.history'
import { describeRecommendation } from './assistant.recommendation'
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
	expect(retry.history).toEqual([
		{ role: 'user', content: 'Earlier question' },
		{ role: 'assistant', content: 'Earlier reply' },
	])
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

test('an out-of-scope recovery suggestion sends a new topic without the rejected question', () => {
	const content = describeRecommendation({ type: 'outOfScope', reason: 'unsupportedForm' })
	if (content.kind !== 'text') throw new Error('expected recovery suggestions')
	const rejectedTopic: ChatTurn[] = [
		{ id: 'u1', kind: 'user', text: 'Help me with Form I-130.' },
		{ id: 'a1', kind: 'assistant', content },
	]

	expect(content.suggestions?.find((reply) => reply.label === 'Renew my work permit')).toBeDefined()
	expect(toActionHistory(rejectedTopic, content.suggestionsStartNewTopic)).toEqual([])
	expect(rejectedTopic).toHaveLength(2)
})

test('typed follow-ups retain the recovered topic without reintroducing the earlier rejected question', () => {
	const conversation: ChatTurn[] = [
		{ id: 'u1', kind: 'user', text: 'Will I be approved for asylum?' },
		{ id: 'u2', kind: 'user', text: 'I need to renew my work permit (EAD).', startsNewTopic: true },
		{
			id: 'a2',
			kind: 'assistant',
			content: describeRecommendation({
				type: 'supported',
				formType: 'i765',
				applicationKind: 'renewal',
			}),
		},
		{ id: 'u3', kind: 'user', text: 'Actually, it was lost. I need a replacement.' },
	]

	expect(toActionHistory(conversation)).toEqual([
		{ role: 'user', content: 'I need to renew my work permit (EAD).' },
		{ role: 'assistant', content: 'Work permit renewal (Form I-765)' },
		{ role: 'user', content: 'Actually, it was lost. I need a replacement.' },
	])
	expect(conversation).toHaveLength(4)
})

test('retrying a failed recovery suggestion still sends no earlier topic', () => {
	const failedRecovery: ChatTurn[] = [
		{ id: 'u1', kind: 'user', text: 'Which category should I file under?' },
		{ id: 'u2', kind: 'user', text: 'I need to renew my green card.', startsNewTopic: true },
		{ id: 'e2', kind: 'error', failedText: 'I need to renew my green card.' },
	]

	const retry = prepareAssistantRetry(failedRecovery, 'e2')!
	expect(retry.history).toEqual([])
	expect(retry.turns).toHaveLength(failedRecovery.length)
	expect(retry.turns[1]).toEqual(failedRecovery[1])
	expect(retry.turns[2]).toEqual({ id: 'e2', kind: 'pending' })
})

test('retrying an older exchange keeps its original topic even after a newer recovery choice', () => {
	const conversation: ChatTurn[] = [
		{ id: 'u1', kind: 'user', text: 'It is about my work permit.', startsNewTopic: true },
		{ id: 'u2', kind: 'user', text: 'I need a renewal.' },
		{ id: 'e2', kind: 'error', failedText: 'I need a renewal.' },
		{ id: 'u3', kind: 'user', text: 'I need to renew my green card.', startsNewTopic: true },
	]

	const retry = prepareAssistantRetry(conversation, 'e2')!
	expect(retry.history).toEqual([{ role: 'user', content: 'It is about my work permit.' }])
	expect(retry.turns.at(-1)).toEqual(conversation.at(-1))
	expect(toActionHistory(retry.turns)).toEqual([
		{ role: 'user', content: 'I need to renew my green card.' },
	])
})

test('ordinary clarification preserves the topic and unsafe user history for server screening', () => {
	const content = describeRecommendation({ type: 'needsClarification', missing: 'situation' })
	if (content.kind !== 'text') throw new Error('expected clarification')
	const conversation: ChatTurn[] = [
		{ id: 'u1', kind: 'user', text: 'It is about my work permit.' },
		{ id: 'a1', kind: 'assistant', content },
		{ id: 'u2', kind: 'user', text: 'Am I eligible for renewal?' },
	]

	expect(content.suggestionsStartNewTopic).not.toBe(true)
	expect(toActionHistory(conversation, content.suggestionsStartNewTopic)).toEqual([
		{ role: 'user', content: 'It is about my work permit.' },
		{ role: 'assistant', content: content.text },
		{ role: 'user', content: 'Am I eligible for renewal?' },
	])
})
