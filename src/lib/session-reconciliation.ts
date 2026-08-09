type SessionSnapshot = {
	hasSession: boolean
	isPending: boolean
	isRefetching: boolean
}

type SessionReconcileDependencies = {
	getSnapshot: () => SessionSnapshot
	getCookie: () => string
	resolveSession: () => Promise<unknown>
}

function reconciliationKey(snapshot: SessionSnapshot, cookie: string): string {
	if (cookie) return `cookie:${cookie}`
	return snapshot.hasSession ? 'session-without-cookie' : ''
}

/**
 * Coalesces root-level session reconciliation notifications. A successful
 * Better Auth refetch can rotate the persisted cookie and synchronously notify
 * subscribers; those rotations belong to the in-progress reconciliation and
 * must not recursively start another auth refresh.
 */
export function createSessionReconcileScheduler({
	getSnapshot,
	getCookie,
	resolveSession,
}: SessionReconcileDependencies): () => Promise<void> {
	let reconciledKey: string | null = null
	let inFlight: Promise<void> | null = null

	return function reconcile(): Promise<void> {
		if (inFlight !== null) return inFlight

		const snapshot = getSnapshot()
		// Better Auth already owns an in-progress refresh. Starting the recovery
		// loop here would abort/replace it, especially when deletion clears the
		// cookie and publishes its signed-out state.
		if (snapshot.isPending || snapshot.isRefetching) return Promise.resolve()

		const key = reconciliationKey(snapshot, getCookie())
		if (!key) {
			reconciledKey = null
			return Promise.resolve()
		}
		if (key === reconciledKey) return Promise.resolve()

		reconciledKey = key
		const reconciliation = Promise.resolve()
			.then(async () => {
				// A successful refetch may rotate the persisted cookie. One trailing
				// pass ensures a genuinely new sign-in cookie that arrives in the same
				// window is not mistaken for that rotation. The two-pass bound prevents
				// a server that rotates on every response from creating a refresh loop.
				let passKey = key
				for (let pass = 0; pass < 2; pass += 1) {
					try {
						await resolveSession()
					} catch {
						// The root reconciler is a safety net. Inline sign-in flows surface
						// their own errors; a later session notification can retry this path.
					}

					const latestSnapshot = getSnapshot()
					if (latestSnapshot.isPending) return
					const latestKey = reconciliationKey(latestSnapshot, getCookie())
					if (pass === 0 && latestKey && latestKey !== passKey) {
						passKey = latestKey
						reconciledKey = latestKey
						continue
					}
					reconciledKey = latestKey || null
					return
				}
			})
			.finally(() => {
				if (inFlight !== reconciliation) return
				inFlight = null
			})
		inFlight = reconciliation
		return reconciliation
	}
}
