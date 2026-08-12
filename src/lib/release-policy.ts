import releaseFeatures from '../../release-policy.json'

/**
 * First App Store release boundary.
 *
 * Keep these values source-controlled and build-time static. Re-enabling a
 * feature is an intentional release change that must update the pinned tests,
 * not a remote switch that can reveal unreviewed functionality after approval.
 */
type ReleaseFeatures = {
	filingPreparation: boolean
	assistant: boolean
	community: boolean
	socialLogin: boolean
	passwordRecovery: boolean
}

export const RELEASE_FEATURES: Readonly<ReleaseFeatures> = Object.freeze(releaseFeatures)

export const RELEASE_HOME_PATH = '/cases' as const
export const RELEASE_SIGNED_OUT_PATH = '/welcome' as const

export function getReleaseRedirectPath(authenticated: boolean) {
	return authenticated ? RELEASE_HOME_PATH : RELEASE_SIGNED_OUT_PATH
}

export type ReleaseTab = '(forms)' | 'cases' | 'resources' | 'assistant' | 'community' | 'account'

const TAB_FEATURE: Partial<Record<ReleaseTab, keyof typeof RELEASE_FEATURES>> = {
	'(forms)': 'filingPreparation',
	assistant: 'assistant',
	community: 'community',
}

export function isReleaseTabVisible(tab: ReleaseTab): boolean {
	const feature = TAB_FEATURE[tab]
	return feature === undefined || RELEASE_FEATURES[feature]
}

const FILING_PATHS = [
	'/attention',
	'/completed',
	'/drafts',
	'/renewals',
	'/new-application',
	'/application',
	'/interview',
	'/documents',
	'/account/details',
	'/account/documents',
] as const

const COMMUNITY_PATHS = ['/community', '/new-post', '/community-rules', '/moderation'] as const

const ALWAYS_ALLOWED_EXACT_PATHS = [
	'/cases',
	'/new-case',
	'/resources',
	'/account',
	'/account/privacy',
	'/account/terms',
	'/account/support',
	'/upgrade',
	'/welcome',
	'/sign-in',
] as const

function normalizePathname(rawPathname: string): string {
	const withoutQuery = rawPathname.split(/[?#]/, 1)[0] || '/'
	if (withoutQuery === '/') return '/'
	return withoutQuery.replace(/\/+$/, '') || '/'
}

function matchesPath(pathname: string, route: string): boolean {
	return pathname === route || pathname.startsWith(`${route}/`)
}

/**
 * Central deep-link/restored-state guard. It runs before a disabled screen
 * mounts, so hidden routes never issue sensitive queries or flash their UI.
 */
export function isReleasePathBlocked(rawPathname: string): boolean {
	const pathname = normalizePathname(rawPathname)

	if (
		ALWAYS_ALLOWED_EXACT_PATHS.includes(pathname as (typeof ALWAYS_ALLOWED_EXACT_PATHS)[number]) ||
		matchesPath(pathname, '/cases')
	) {
		return false
	}

	if (
		RELEASE_FEATURES.filingPreparation &&
		(pathname === '/' || FILING_PATHS.some((route) => matchesPath(pathname, route)))
	) {
		return false
	}
	if (RELEASE_FEATURES.assistant && matchesPath(pathname, '/assistant')) return false
	if (RELEASE_FEATURES.community && COMMUNITY_PATHS.some((route) => matchesPath(pathname, route)))
		return false
	if (
		RELEASE_FEATURES.passwordRecovery &&
		(matchesPath(pathname, '/forgot-password') || matchesPath(pathname, '/reset-password'))
	) {
		return false
	}

	// Default deny: a new route cannot silently join the reviewed release.
	return true
}

/** Never allow a disabled build to attach a hidden filing to a new case. */
export function releaseApplicationLink<T>(applicationId: T | null): T | undefined {
	if (!RELEASE_FEATURES.filingPreparation || applicationId === null) return undefined
	return applicationId
}
