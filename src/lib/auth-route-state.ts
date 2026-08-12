type CurrentAuthState = {
	isLoading: boolean
	isAuthenticated: boolean
}

/**
 * Keep the last settled auth guard while Convex refreshes its token. Replacing
 * the whole navigator with a boot spinner on every refresh replays `/home` and
 * makes a single sign-in or deletion look like several page reloads.
 */
export function resolveAuthRouteState(
	lastSettledAuthenticated: boolean | null,
	current: CurrentAuthState,
): { authenticated: boolean | null; showBootLoader: boolean } {
	const authenticated = current.isLoading ? lastSettledAuthenticated : current.isAuthenticated
	return {
		authenticated,
		showBootLoader: authenticated === null,
	}
}
