import { useEffect, useRef } from 'react'

import {
	ensureSessionResolved,
	ensureSignedOut,
	getPersistedSessionCookie,
	getSessionSnapshot,
	subscribeToSession,
} from '@/lib/session-sync'
import { createSessionReconcileScheduler } from '@/lib/session-reconciliation'

/**
 * Root-level safety net for the "authenticated on the server, stranded
 * signed-out in the app" race (see `ensureSessionResolved`). Every sign-in call
 * site already drives the atom itself, but mounting this once at the root
 * guarantees recovery no matter which path created the session — including any
 * future sign-in that forgets to await `ensureSessionResolved`.
 *
 * Only reconcile a stable mismatch: a cookie without a reactive session, or a
 * cached reactive session whose cookie is gone. A healthy pair is left to
 * Better Auth; revalidating it here used to multiply every normal transition.
 * Mismatch keys are deduplicated so a dead cookie cannot spin forever.
 */
export function useSessionReconciler(): void {
	const mountedRef = useRef(false)

	useEffect(() => {
		mountedRef.current = true
		const reconcile = createSessionReconcileScheduler({
			getSnapshot: getSessionSnapshot,
			getCookie: getPersistedSessionCookie,
			resolveSession: ensureSessionResolved,
			clearSession: ensureSignedOut,
		})
		const notify = () => {
			if (mountedRef.current) void reconcile()
		}

		notify()
		const unsubscribe = subscribeToSession(notify)
		return () => {
			mountedRef.current = false
			unsubscribe()
		}
	}, [])
}
