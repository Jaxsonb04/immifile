import { authClient } from '@/lib/auth-client'

/**
 * The reactive session atom behind `authClient.useSession()` / `useConvexAuth()`,
 * reached through the client's private store — the public types don't surface it.
 * `refetch` lives on the atom's *value*; `subscribe` lives on the atom itself.
 */
type SessionAtomValue = {
	data?: {
		session?: unknown
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

const SESSION_RESOLVE_ATTEMPTS = 12
const SESSION_RESOLVE_INTERVAL_MS = 200
let inFlightSessionRefetch: Promise<boolean> | null = null

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
 * Force better-auth's reactive session atom to reflect a session that has
 * already been written to secure storage.
 *
 * Every sign-in path (`signIn.email`, `signIn.social`, `signIn.anonymous`,
 * `signUp.email`) persists the session cookie and then fires a single
 * `$sessionSignal` refetch. That refetch can lose a race with the cookie write,
 * or be aborted by an overlapping one, and settle the atom signed-out with
 * nothing to retrigger it — the app then sits on the sign-in screen even though
 * the server authenticated the request (a cold start reads the cookie fine).
 *
 * Re-drive the atom's own `refetch` (cookie cache bypassed) until it reflects
 * the persisted session. When a sign-in just created a user, `expectedUserId`
 * prevents a still-valid local cache entry for an older session from being
 * mistaken for the new identity. The awaited refetch publishes the session
 * atom itself, which changes the Convex provider's token fetcher when the
 * session id changes.
 *
 * Bounded so a genuinely-signed-out caller still gets control back. Returns
 * whether the expected session is present when it finishes.
 */
export async function ensureSessionResolved(expectedUserId?: string): Promise<boolean> {
	const atom = getSessionAtom()

	const matchesExpectedSession = (): boolean => {
		const data = atom.get().data
		if (!data?.session) return false
		return expectedUserId === undefined || data.user?.id === expectedUserId
	}

	for (let attempt = 0; attempt < SESSION_RESOLVE_ATTEMPTS; attempt += 1) {
		const refreshed = await refetchSessionAtom(atom)
		if (refreshed && matchesExpectedSession()) return true
		if (attempt < SESSION_RESOLVE_ATTEMPTS - 1) {
			await new Promise((resolve) => setTimeout(resolve, SESSION_RESOLVE_INTERVAL_MS))
		}
	}
	return false
}

/**
 * Deletion counterpart of `ensureSessionResolved`: drive the atom (cookie
 * cache bypassed) until it reflects a signed-out state.
 *
 * Better Auth's anonymous plugin refreshes the session atom on
 * `/sign-in/anonymous` but not on `/delete-anonymous-user`, so after an
 * identity deletion the app keeps rendering the deleted account until the
 * cached Convex JWT expires — and a retried delete then fails with 401. A
 * single post-delete refetch is not enough either: it can race the expo
 * plugin's cookie clearing and settle signed-in off the still-cached
 * `session_data` cookie, which is why the cache is bypassed here.
 *
 * Bounded like `ensureSessionResolved`; returns whether the atom reads
 * signed-out when it finishes.
 */
export async function ensureSignedOut(): Promise<boolean> {
	const atom = getSessionAtom()
	for (let attempt = 0; attempt < SESSION_RESOLVE_ATTEMPTS; attempt += 1) {
		await refetchSessionAtom(atom)
		if (!atom.get().data?.session) return true
		if (attempt < SESSION_RESOLVE_ATTEMPTS - 1) {
			await new Promise((resolve) => setTimeout(resolve, SESSION_RESOLVE_INTERVAL_MS))
		}
	}
	return false
}
