import { api } from '@convex/_generated/api'
import { useAction, useQuery } from 'convex/react'
import { useCallback, useRef, useState } from 'react'

import { useToday } from '@/hooks/use-today'

import { describeRecommendation } from './assistant.recommendation'
import type { ChatTurn } from './assistant.types'

// Device-session chat state for the safe navigator (M1-T3). Each user message
// runs the deterministic navigator action once (navigator-first: one billed
// Claude call per turn, shared 20/day quota). The transcript lives only in this
// hook's state — nothing is persisted (MASTER_PLAN "Interfaces").

// Keep the sent history within the action's own bound (MAX_HISTORY_TURNS = 40).
const MAX_HISTORY_TURNS = 40

type ActionHistoryTurn = { role: 'user' | 'assistant'; content: string }

/** Flatten prior transcript turns into the {role, content} history the action
 * accepts, so the extractor can combine facts across the clarification loop.
 * Pending/error turns carry no content and are skipped. */
function toActionHistory(turns: ChatTurn[]): ActionHistoryTurn[] {
	const history: ActionHistoryTurn[] = []
	for (const turn of turns) {
		if (turn.kind === 'user') {
			history.push({ role: 'user', content: turn.text })
		} else if (turn.kind === 'assistant') {
			const content =
				turn.content.kind === 'text'
					? turn.content.text
					: `${turn.content.title} (${turn.content.formLabel})`
			history.push({ role: 'assistant', content })
		}
	}
	return history.slice(-MAX_HISTORY_TURNS)
}

export type AssistantChat = ReturnType<typeof useAssistantChat>

export function useAssistantChat() {
	const getRecommendation = useAction(api.navigator.getRecommendation)
	const utcDay = useToday()
	const usage = useQuery(api.assistantQuota.dailyUsage, { day: utcDay })

	const [turns, setTurns] = useState<ChatTurn[]>([])
	const [isSending, setIsSending] = useState(false)
	// Synchronous mirror of `isSending`: two taps in the same tick both see the
	// stale `false` from a state closure, so the state guard alone can't stop a
	// double-fire of the billed action. The ref flips before any await.
	const isSendingRef = useRef(false)
	const idRef = useRef(0)
	const nextId = () => `t${(idRef.current += 1)}`

	const outOfMessages = usage !== undefined && usage.remaining <= 0
	const canSend = !isSending && !outOfMessages

	/**
	 * Enqueue one user message and run the navigator once. Returns synchronously
	 * whether the message was ACCEPTED (passed the guard and was appended) so the
	 * composer only clears its input on acceptance — a rejected send never loses
	 * the user's text. The network round-trip resolves the pending bubble later.
	 */
	const send = useCallback(
		(raw: string): boolean => {
			const message = raw.trim()
			if (message.length === 0 || isSendingRef.current || outOfMessages) return false

			isSendingRef.current = true
			setIsSending(true)

			// Snapshot history BEFORE appending this turn, then optimistically show
			// the user bubble and an assistant "thinking" placeholder.
			const history = toActionHistory(turns)
			const userId = nextId()
			const pendingId = nextId()
			setTurns((prev) => [
				...prev,
				{ id: userId, kind: 'user', text: message },
				{ id: pendingId, kind: 'pending' },
			])

			void (async () => {
				try {
					const { recommendation } = await getRecommendation({ message, history })
					const content = describeRecommendation(recommendation)
					setTurns((prev) =>
						prev.map((turn) =>
							turn.id === pendingId ? { id: turn.id, kind: 'assistant', content } : turn,
						),
					)
				} catch {
					// A failed call was refunded server-side (pre-billing) or counts
					// (billed) — either way, surface a retryable error, never the raw
					// server message.
					setTurns((prev) =>
						prev.map((turn) =>
							turn.id === pendingId ? { id: turn.id, kind: 'error', failedText: message } : turn,
						),
					)
				} finally {
					isSendingRef.current = false
					setIsSending(false)
				}
			})()

			return true
		},
		[getRecommendation, outOfMessages, turns],
	)

	/** Drop the failed turn and resend its text. */
	const retry = useCallback(
		(failedId: string, failedText: string) => {
			setTurns((prev) => prev.filter((turn) => turn.id !== failedId))
			send(failedText)
		},
		[send],
	)

	return { turns, usage, isSending, canSend, outOfMessages, send, retry }
}
