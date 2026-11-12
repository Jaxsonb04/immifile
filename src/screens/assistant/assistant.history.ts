import type { ChatTurn } from './assistant.types'

export function toActionHistory(turns: ChatTurn[], startNewTopic = false) {
	if (startNewTopic) return []
	const history: { role: 'user' | 'assistant'; content: string }[] = []
	for (const turn of turns) {
		if (turn.kind === 'user') {
			if (turn.startsNewTopic) history.length = 0
			history.push({ role: 'user', content: turn.text })
		} else if (turn.kind === 'assistant') {
			history.push({
				role: 'assistant',
				content:
					turn.content.kind === 'text'
						? turn.content.text
						: `${turn.content.title} (${turn.content.formLabel})`,
			})
		}
	}
	return history.slice(-40)
}

/** History and topic marker for a new message; retries retain their original exchange. */
export function prepareAssistantSend(turns: ChatTurn[], startNewTopic = false) {
	const latest = turns.at(-1)
	// A form recommendation completes the current topic. Only the transcript's
	// latest turn can close it: older cards must not erase a clarification or a
	// failed request that the user is still continuing.
	const startsNewTopic =
		startNewTopic || (latest?.kind === 'assistant' && latest.content.kind === 'recommendation')
	return { history: toActionHistory(turns, startsNewTopic), startsNewTopic }
}

/** Retry the original exchange in place, with only the history preceding it. */
export function prepareAssistantRetry(turns: ChatTurn[], failedId: string) {
	const index = turns.findIndex((turn) => turn.id === failedId && turn.kind === 'error')
	const failed = turns[index]
	const user = turns[index - 1]
	if (failed?.kind !== 'error' || user?.kind !== 'user' || user.text !== failed.failedText)
		return null
	return {
		history: toActionHistory(turns.slice(0, index - 1), user.startsNewTopic),
		turns: turns.map((turn): ChatTurn =>
			turn.id === failedId ? { id: failedId, kind: 'pending' } : turn,
		),
	}
}
