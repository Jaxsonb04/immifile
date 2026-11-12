import { api } from '@convex/_generated/api'
import { useAction, useQuery } from 'convex/react'
import { useCallback, useRef, useState } from 'react'

import { useToday } from '@/hooks/use-today'

import { describeRecommendation } from './assistant.recommendation'
import type { AssistantSendOptions, ChatTurn } from './assistant.types'

// Device-session chat state for the safe navigator (M1-T3). Each user message
// runs the deterministic navigator action once (navigator-first: one billed
// OpenAI call per turn, shared 20/day quota). Immifile does not persist the
// transcript; selected user messages are sent to OpenAI under the provider
// retention disclosed before consent (MASTER_PLAN "Interfaces").

import { prepareAssistantRetry, prepareAssistantSend } from './assistant.history'

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
		(
			raw: string,
			{ startNewTopic = false, retryId }: AssistantSendOptions & { retryId?: string } = {},
		): boolean => {
			const message = raw.trim()
			if (message.length === 0 || isSendingRef.current || outOfMessages) return false

			const retryRequest = retryId ? prepareAssistantRetry(turns, retryId) : null
			if (retryId && !retryRequest) return false
			const newRequest = retryRequest ? null : prepareAssistantSend(turns, startNewTopic)

			isSendingRef.current = true
			setIsSending(true)

			// Snapshot history BEFORE appending this turn, then optimistically show
			// the user bubble and an assistant "thinking" placeholder.
			const history = retryRequest?.history ?? newRequest!.history
			const pendingId = retryId ?? nextId()
			if (retryRequest) setTurns(retryRequest.turns)
			else
				setTurns((prev) => [
					...prev,
					{ id: nextId(), kind: 'user', text: message, startsNewTopic: newRequest?.startsNewTopic },
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

	/** A rejected retry leaves the error and the original message intact. */
	const retry = useCallback(
		(failedId: string, failedText: string) => {
			send(failedText, { retryId: failedId })
		},
		[send],
	)

	return { turns, usage, isSending, canSend, outOfMessages, send, retry }
}
