import { authClient } from '@/lib/auth-client'

/**
 * The reactive session atom behind `authClient.useSession()` / `useConvexAuth()`,
 * reached through the client's private store — the public types don't surface it.
 * `refetch` lives on the atom's *value*; `subscribe` lives on the atom itself.
 */
type SessionAtomValue = {
	data?: {
		session?: { id?: string }
		user?: { id?: string }
	} | null
	isPending?: boolean
	isRefetching?: boolean
	refetch: (params?: { query?: { disableCookieCache?: boolean } }) => Promise<unknown>
}

type SessionAtom = {
	get: () => SessionAtomValue
	subscribe: (listener: (value: SessionAtomValue) => void) => () => void
}

function getSessionAtom(): SessionAtom {
	return (authClient.$store as unknown as { atoms: { session: SessionAtom } }).atoms.session
}

/**
 * The cookie header better-auth's expo plugin has persisted to secure storage
 * for the current session (`''` when signed out). Exposed by the expo plugin as
 * a client action; typed loosely here because the convex/expo client cast in
 * providers.tsx erases it from the public surface.
 */
export function getPersistedSessionCookie(): string {
	const client = authClient as unknown as { getCookie?: () => string }
	return client.getCookie?.() ?? ''
}

/** Whether the reactive atom currently reflects an authenticated session. */
export function getSessionSnapshot(): {
	hasSession: boolean
	isPending: boolean
	isRefetching: boolean
} {
	const value = getSessionAtom().get()
	return {
		hasSession: !!value.data?.session,
		isPending: !!value.isPending,
		isRefetching: !!value.isRefetching,
	}
}

/** Subscribe to reactive session changes; returns an unsubscribe function. */
export function subscribeToSession(listener: () => void): () => void {
	return getSessionAtom().subscribe(() => listener())
}

const SESSION_SIGNAL_WAIT_MS = 400
const SESSION_IN_FLIGHT_SETTLE_WAIT_MS = 4_600
let inFlightSessionRefetch: Promise<boolean> | null = null

function isSettled(value: SessionAtomValue): boolean {
	return !value.isPending && !value.isRefetching
}

function waitForSessionState(
	atom: SessionAtom,
	matches: (value: SessionAtomValue) => boolean,
	timeoutMs = SESSION_SIGNAL_WAIT_MS,
): Promise<boolean> {
	if (matches(atom.get())) return Promise.resolve(true)

	return new Promise((resolve) => {
		let finished = false
		let timeout: ReturnType<typeof setTimeout> | undefined
		let unsubscribe = () => {}
		const finish = (matched: boolean) => {
			if (finished) return
			finished = true
			if (timeout !== undefined) clearTimeout(timeout)
			unsubscribe()
			resolve(matched)
		}

		unsubscribe = atom.subscribe(() => {
			if (matches(atom.get())) finish(true)
		})
		timeout = setTimeout(() => finish(false), timeoutMs)

		// Close the gap between the first read and installing the subscription.
		if (matches(atom.get())) finish(true)
	})
}

type OwnerSignalOutcome = 'matched' | 'settled-mismatch' | 'still-in-flight'

/** Give Better Auth's already-running request ownership of the transition. A
 * forced app fallback while that request is pending would abort and replace it,
 * which is the refresh loop this module exists to prevent. */
async function waitForOwnerSignal(
	atom: SessionAtom,
	matches: (value: SessionAtomValue) => boolean,
): Promise<OwnerSignalOutcome> {
	if (await waitForSessionState(atom, matches)) return 'matched'
	if (matches(atom.get())) return 'matched'
	if (isSettled(atom.get())) return 'settled-mismatch'

	await waitForSessionState(
		atom,
		(value) => matches(value) || isSettled(value),
		SESSION_IN_FLIGHT_SETTLE_WAIT_MS,
	)
	if (matches(atom.get())) return 'matched'
	return isSettled(atom.get()) ? 'settled-mismatch' : 'still-in-flight'
}

async function refetchSessionAtom(atom: SessionAtom): Promise<boolean> {
	if (inFlightSessionRefetch !== null) return inFlightSessionRefetch

	const refresh = atom
		.get()
		.refetch({ query: { disableCookieCache: true } })
		.then(() => true)
		.catch(() => false)
	inFlightSessionRefetch = refresh
	try {
		return await refresh
	} finally {
		if (inFlightSessionRefetch === refresh) inFlightSessionRefetch = null
	}
}

/**
 * Wait for better-auth's reactive session atom to reflect a session that has
 * already been written to secure storage, with one forced fallback refetch.
 *
 * Every sign-in path persists the session cookie and the Expo plugin then fires
 * `$sessionSignal`. Let that owner-driven refresh settle first. Starting an app
 * refetch immediately would abort it, toggle the Convex provider back to
 * loading, and repeatedly remount the root navigator.
 *
 * If the signal never reaches the desired state, re-drive the atom once with
 * the cookie cache bypassed. When a sign-in just created a user, `expectedUserId`
 * prevents a still-valid local cache entry for an older session from being
 * mistaken for the new identity. The awaited refetch publishes the session
 * atom itself, which changes the Convex provider's token fetcher when the
 * session id changes.
 *
 * Calls without an expected user require a real atom transition before they
 * accept the normal signal path, so an old stable session cannot masquerade as
 * a newly authenticated one. Returns whether the expected session is present.
 */
export async function ensureSessionResolved(expectedUserId?: string): Promise<boolean> {
	const atom = getSessionAtom()

	const matchesExpectedSession = (value: SessionAtomValue): boolean => {
		if (!isSettled(value)) return false
		const data = value.data
		if (!data?.session) return false
		return expectedUserId === undefined || data.user?.id === expectedUserId
	}
	const current = atom.get()
	if (expectedUserId !== undefined && matchesExpectedSession(current)) {
		return true
	}

	const initialSessionId = current.data?.session?.id
	const normalSignalOutcome = await waitForOwnerSignal(atom, (value) => {
		if (!matchesExpectedSession(value)) return false
		if (expectedUserId !== undefined || !initialSessionId) return true
		if (current.isPending || current.isRefetching) return true
		return value.data?.session?.id !== initialSessionId
	})
	if (normalSignalOutcome === 'matched') return true
	if (normalSignalOutcome === 'still-in-flight') return false

	await refetchSessionAtom(atom)
	return matchesExpectedSession(atom.get())
}

/**
 * Deletion counterpart of `ensureSessionResolved`: wait for Better Auth's
 * cookie-clearing signal, then perform at most one cache-bypassed fallback.
 *
 * Returns whether the atom reads signed-out when it finishes.
 */
export async function ensureSignedOut(): Promise<boolean> {
	const atom = getSessionAtom()
	const readsSignedOut = (value: SessionAtomValue) => isSettled(value) && !value.data?.session
	if (readsSignedOut(atom.get())) return true
	const normalSignalOutcome = await waitForOwnerSignal(atom, readsSignedOut)
	if (normalSignalOutcome === 'matched') return true
	if (normalSignalOutcome === 'still-in-flight') return false

	await refetchSessionAtom(atom)
	return readsSignedOut(atom.get())
}

/**
 * Finish deletion even when the identity disappeared before the Expo cookie
 * cache did. Better Auth's sign-out endpoint is idempotent: it clears the
 * session cookie and Expo's local session cache even for an already-deleted
 * server session.
 */
export async function ensureSignedOutAfterDeletion(): Promise<boolean> {
	if (await ensureSignedOut()) return true
	try {
		await authClient.signOut({ fetchOptions: { disableSignal: true } })
	} catch {
		// The Expo fetch hook can still have cleared local state before a later
		// client hook throws, so always inspect the atom once more.
	}
	return ensureSignedOut()
}
