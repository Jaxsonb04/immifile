type SessionSnapshot = {
	hasSession: boolean
	isPending: boolean
	isRefetching: boolean
}

type SessionReconcileDependencies = {
	getSnapshot: () => SessionSnapshot
	getCookie: () => string
	resolveSession: () => Promise<unknown>
	clearSession: () => Promise<unknown>
}

type SessionMismatch = {
	key: string
	action: 'resolve' | 'clear'
}

function sessionMismatch(snapshot: SessionSnapshot, cookie: string): SessionMismatch | null {
	if (snapshot.isPending || snapshot.isRefetching) return null
	if (cookie && !snapshot.hasSession) {
		return { key: `missing-session:${cookie}`, action: 'resolve' }
	}
	if (!cookie && snapshot.hasSession) {
		return { key: 'session-without-cookie', action: 'clear' }
	}
	return null
}

/**
 * Coalesce root-level recovery for actual cookie/session mismatches. Healthy
 * cookie+session pairs are owned by Better Auth and never revalidated here;
 * doing so used to add two redundant refresh passes to every auth transition.
 *
 * A notification arriving during recovery is inspected once afterward. Only a
 * genuinely different mismatch (for example, a new cookie) earns one trailing
 * recovery; cookie rotation on a now-healthy session does not.
 */
export function createSessionReconcileScheduler({
	getSnapshot,
	getCookie,
	resolveSession,
	clearSession,
}: SessionReconcileDependencies): () => Promise<void> {
	let attemptedKey: string | null = null
	let inFlight: Promise<void> | null = null
	let notifiedWhileInFlight = false

	const inspect = () => sessionMismatch(getSnapshot(), getCookie())
	const execute = async (mismatch: SessionMismatch): Promise<void> => {
		attemptedKey = mismatch.key
		try {
			if (mismatch.action === 'resolve') await resolveSession()
			else await clearSession()
		} catch {
			// Inline auth flows surface errors. This root path is recovery-only.
		}
	}

	return function reconcile(): Promise<void> {
		if (inFlight !== null) {
			notifiedWhileInFlight = true
			return inFlight
		}

		const mismatch = inspect()
		if (mismatch === null) {
			attemptedKey = null
			return Promise.resolve()
		}
		if (mismatch.key === attemptedKey) return Promise.resolve()

		const reconciliation = Promise.resolve()
			.then(async () => {
				await execute(mismatch)
				if (!notifiedWhileInFlight) return

				notifiedWhileInFlight = false
				const latestMismatch = inspect()
				if (latestMismatch === null) {
					attemptedKey = null
					return
				}
				if (latestMismatch.key !== attemptedKey) await execute(latestMismatch)
			})
			.finally(() => {
				if (inFlight === reconciliation) inFlight = null
			})
		inFlight = reconciliation
		return reconciliation
	}
}
