import { ConvexProviderWithAuth, type ConvexReactClient } from 'convex/react'
import { useCallback, useMemo, useRef, useState } from 'react'

import { authClient } from '@/lib/auth-client'

type PendingToken = {
	key: string
	promise: Promise<string | null>
}

function useImmifileBetterAuth() {
	const { data: session, isPending } = authClient.useSession()
	const sessionId = session?.session?.id
	const tokenKey = sessionId ?? 'signed-out'
	const pendingTokenRef = useRef<PendingToken | null>(null)
	const [hasSettledInitialSession, setHasSettledInitialSession] = useState(!isPending)
	if (!isPending && !hasSettledInitialSession) setHasSettledInitialSession(true)

	const fetchAccessToken = useCallback(
		async ({ forceRefreshToken = false }: { forceRefreshToken?: boolean } = {}) => {
			const pending = pendingTokenRef.current
			if (!forceRefreshToken && pending?.key === tokenKey) {
				return pending.promise
			}

			const tokenPromise = authClient.convex
				.token({ fetchOptions: { throw: false } })
				.then(({ data }) => data?.token ?? null)
				.catch(() => null)
				.finally(() => {
					if (pendingTokenRef.current?.promise === tokenPromise) {
						pendingTokenRef.current = null
					}
				})

			pendingTokenRef.current = { key: tokenKey, promise: tokenPromise }
			return tokenPromise
		},
		[tokenKey],
	)

	return useMemo(
		() => ({
			isLoading: isPending && !hasSettledInitialSession,
			isAuthenticated: Boolean(session?.session),
			fetchAccessToken,
		}),
		[fetchAccessToken, hasSettledInitialSession, isPending, session?.session],
	)
}

export function ImmifileConvexAuthProvider({
	children,
	client,
}: {
	children: React.ReactNode
	client: ConvexReactClient
}) {
	return (
		<ConvexProviderWithAuth client={client} useAuth={useImmifileBetterAuth}>
			{children}
		</ConvexProviderWithAuth>
	)
}
