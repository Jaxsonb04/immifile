const APP_AUTH_ORIGINS = ['immigrationrenewalhelp://', 'https://auth.immifile.app'] as const

function expoGoOrigin(request?: Request): string | null {
	const value = request?.headers.get('expo-origin')
	if (!value) return null

	try {
		const url = new URL(value)
		const isBareDevelopmentOrigin =
			url.protocol === 'exp:' &&
			url.hostname !== '' &&
			url.port !== '' &&
			url.username === '' &&
			url.password === '' &&
			url.pathname === '' &&
			url.search === '' &&
			url.hash === ''
		return isBareDevelopmentOrigin ? url.href : null
	} catch {
		return null
	}
}

/**
 * Trusted origins for a Better Auth request.
 *
 * Standalone builds use the fixed app scheme. Expo Go instead generates a
 * LAN-specific `exp://host:port` origin at runtime, so trust that exact value
 * only when it arrived through the Expo client's dedicated header — and only
 * when the deployment opted in (`allowExpoDevOrigins`, from the
 * AUTH_TRUST_EXPO_DEV_ORIGINS env var, set on dev deployments only). The
 * header is client-controlled, so honoring it in production would let any
 * non-browser client mint its own "trusted" origin and sidestep the origin
 * check entirely; a production build never runs inside Expo Go, so nothing
 * legitimate needs it there.
 */
export function trustedAuthOrigins(request?: Request, allowExpoDevOrigins = false): string[] {
	const expoOrigin = allowExpoDevOrigins ? expoGoOrigin(request) : null
	return expoOrigin ? [...APP_AUTH_ORIGINS, expoOrigin] : [...APP_AUTH_ORIGINS]
}
