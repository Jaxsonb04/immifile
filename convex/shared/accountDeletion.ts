export const SOCIAL_DELETION_PROVIDERS = ['apple', 'google'] as const

export type SocialDeletionProvider = (typeof SOCIAL_DELETION_PROVIDERS)[number]

export const SOCIAL_DELETION_CHALLENGE_TTL_MS = 10 * 60 * 1000
export const SOCIAL_DELETION_OAUTH_STATE_KEY = 'immifileAccountDeletionChallenge'
const ACCOUNT_DELETION_ATTEMPT_ID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const SOCIAL_DELETION_CHALLENGE_PREFIX = 'immifile-account-deletion:'
const SOCIAL_DELETION_CHALLENGE_HEX_LENGTH = 64

export type SocialDeletionChallenge = {
	version: 1
	userId: string
	ownerId: string
	sessionId: string
	provider: SocialDeletionProvider
	providerAccountId: string
	providerAccountUpdatedAt: number
	createdAt: number
	verifiedAt?: number
}

type OAuthLinkState = {
	link?: { userId?: unknown } | null
}

type UpdatedProviderAccount = {
	userId?: unknown
	providerId?: unknown
	accountId?: unknown
	updatedAt?: unknown
}

function isFiniteNumber(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value)
}

function isNonEmptyString(value: unknown): value is string {
	return typeof value === 'string' && value.length > 0
}

function isSocialDeletionProvider(value: unknown): value is SocialDeletionProvider {
	return value === 'apple' || value === 'google'
}

/** A UUIDv4 carries 122 unpredictable bits and is safe as a status capability. */
export function isAccountDeletionAttemptId(value: string): boolean {
	return ACCOUNT_DELETION_ATTEMPT_ID_PATTERN.test(value)
}

export function timestampMs(value: unknown): number | null {
	if (isFiniteNumber(value)) return value
	if (value instanceof Date) {
		const time = value.getTime()
		return Number.isFinite(time) ? time : null
	}
	if (typeof value === 'string') {
		const time = Date.parse(value)
		return Number.isFinite(time) ? time : null
	}
	return null
}

export function parseSocialDeletionChallenge(value: string): SocialDeletionChallenge | null {
	try {
		const parsed: unknown = JSON.parse(value)
		if (!parsed || typeof parsed !== 'object') return null
		const candidate = parsed as Partial<SocialDeletionChallenge>
		if (
			candidate.version !== 1 ||
			!isNonEmptyString(candidate.userId) ||
			!isNonEmptyString(candidate.ownerId) ||
			!isNonEmptyString(candidate.sessionId) ||
			!isSocialDeletionProvider(candidate.provider) ||
			!isNonEmptyString(candidate.providerAccountId) ||
			!isFiniteNumber(candidate.providerAccountUpdatedAt) ||
			!isFiniteNumber(candidate.createdAt) ||
			(candidate.verifiedAt !== undefined && !isFiniteNumber(candidate.verifiedAt))
		) {
			return null
		}
		return candidate as SocialDeletionChallenge
	} catch {
		return null
	}
}

export function serializeSocialDeletionChallenge(challenge: SocialDeletionChallenge): string {
	return JSON.stringify(challenge)
}

/**
 * One live social-deletion challenge per Better Auth session/provider. The
 * identifier is opaque to the client and contains no raw auth identifiers.
 */
export async function socialDeletionChallengeIdentifier(
	userId: string,
	sessionId: string,
	provider: SocialDeletionProvider,
): Promise<string> {
	const bytes = new TextEncoder().encode(`${userId}\u0000${sessionId}\u0000${provider}`)
	const digest = await crypto.subtle.digest('SHA-256', bytes)
	const hex = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join(
		'',
	)
	return `${SOCIAL_DELETION_CHALLENGE_PREFIX}${hex}`
}

export function isSocialDeletionChallengeIdentifier(value: string): boolean {
	return (
		value.length ===
			SOCIAL_DELETION_CHALLENGE_PREFIX.length + SOCIAL_DELETION_CHALLENGE_HEX_LENGTH &&
		value.startsWith(SOCIAL_DELETION_CHALLENGE_PREFIX) &&
		/^[0-9a-f]+$/.test(value.slice(SOCIAL_DELETION_CHALLENGE_PREFIX.length))
	)
}

/**
 * Convert an OAuth account update into deletion proof only when Better Auth's
 * signed link state names the original user and the exact pre-existing linked
 * account was refreshed. Calls such as refresh-token have no link state, and a
 * different account chosen at the provider cannot match providerAccountId.
 */
export function verifySocialDeletionOAuthAccountUpdate(
	challenge: SocialDeletionChallenge,
	oauthState: OAuthLinkState,
	account: UpdatedProviderAccount,
	verifiedAt: number,
): SocialDeletionChallenge | null {
	const accountUpdatedAt = timestampMs(account.updatedAt)
	if (
		oauthState.link?.userId !== challenge.userId ||
		account.userId !== challenge.userId ||
		account.providerId !== challenge.provider ||
		account.accountId !== challenge.providerAccountId ||
		accountUpdatedAt === null ||
		accountUpdatedAt <= challenge.providerAccountUpdatedAt ||
		!isFiniteNumber(verifiedAt) ||
		verifiedAt < challenge.createdAt ||
		verifiedAt - challenge.createdAt > SOCIAL_DELETION_CHALLENGE_TTL_MS
	) {
		return null
	}
	return { ...challenge, verifiedAt }
}

export function socialDeletionChallengeAuthorizes(
	challenge: SocialDeletionChallenge,
	identity: { userId: string; ownerId: string; sessionId: string },
	now: number,
): boolean {
	return (
		challenge.userId === identity.userId &&
		challenge.ownerId === identity.ownerId &&
		challenge.sessionId === identity.sessionId &&
		challenge.verifiedAt !== undefined &&
		challenge.verifiedAt >= challenge.createdAt &&
		now >= challenge.verifiedAt &&
		now - challenge.createdAt <= SOCIAL_DELETION_CHALLENGE_TTL_MS
	)
}
