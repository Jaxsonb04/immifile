import type { ChatTurn } from './assistant.types'

export function toActionHistory(turns: ChatTurn[]) {
	const history: { role: 'user' | 'assistant'; content: string }[] = []
	for (const turn of turns) {
		if (turn.kind === 'user') history.push({ role: 'user', content: turn.text })
		else if (turn.kind === 'assistant') {
			history.push({ role: 'assistant', content: turn.content.kind === 'text'
				? turn.content.text : `${turn.content.title} (${turn.content.formLabel})` })
		}
	}
	return history.slice(-40)
}

/** Retry the original exchange in place, with only the history preceding it. */
export function prepareAssistantRetry(turns: ChatTurn[], failedId: string) {
	const index = turns.findIndex((turn) => turn.id === failedId && turn.kind === 'error')
	const failed = turns[index]
	const user = turns[index - 1]
	if (failed?.kind !== 'error' || user?.kind !== 'user' || user.text !== failed.failedText) return null
	return {
		message: failed.failedText,
		history: toActionHistory(turns.slice(0, index - 1)),
		turns: turns.map((turn): ChatTurn => turn.id === failedId ? { id: failedId, kind: 'pending' } : turn),
	}
}
