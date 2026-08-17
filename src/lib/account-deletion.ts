import { SOCIAL_DELETION_OAUTH_STATE_KEY } from '@convex/shared/accountDeletion'

export type AccountDeletionMode = 'loading' | 'credentialed' | 'temporary'
export type SocialDeletionProvider = 'apple' | 'google'
export type CredentialedDeletionMethod =
	'loading' | 'password' | 'unsupported' | { kind: 'social'; provider: SocialDeletionProvider }

export const APPLE_MANUAL_REVOCATION_INSTRUCTIONS =
	'On your iPhone, open Settings, tap your name, then Sign-In & Security → Sign in with Apple → Immifile → Stop Using Apple ID.'

type AccountDeletionError = { message?: string } | null

type SocialAccountDeletionDependencies = {
	provider: SocialDeletionProvider
	beginChallenge: (
		provider: SocialDeletionProvider,
	) => Promise<{ challenge: string; userId: string }>
	reauthenticate: (
		provider: SocialDeletionProvider,
		challenge: string,
	) => Promise<AccountDeletionError>
	resolveSession: (expectedUserId: string) => Promise<boolean>
	deleteAccount: (
		challenge: string,
	) => Promise<
		| { error: { message?: string }; appleManualRevokeRequired?: never }
		| { error: null; appleManualRevokeRequired: boolean }
	>
}

export type SocialAccountDeletionResult =
	| { ok: true; appleManualRevokeRequired: boolean }
	| { ok: false; reason: 'reauth-failed' | 'reauth-incomplete' | 'delete-failed'; message?: string }

export type AccountDeletionReceiptStatus =
	{ status: 'missing' } | { status: 'pending' | 'completed'; appleManualRevokeRequired: boolean }

export type AmbiguousDeletionReconciliation =
	| { status: 'not-confirmed' }
	| {
			status: 'pending' | 'completed'
			localSessionCleared: boolean
			appleManualRevokeRequired: boolean
	  }

/**
 * A destructive action can finish on the server even if its response is lost.
 * Reconcile only after an action was actually attempted and the server finds
 * the exact high-entropy receipt it created with the durable deletion gate.
 * Completed status additionally requires a cache-bypassed Better Auth read to
 * report no session. A proof rejection or pre-acceptance network error must
 * never clear a still-valid local session or be described as deletion.
 */
export async function reconcileAmbiguousAccountDeletion({
	deletionWasRequested,
	getDeletionStatus,
	getAuthoritativeSession,
	ensureSignedOut,
}: {
	deletionWasRequested: boolean
	getDeletionStatus: () => Promise<AccountDeletionReceiptStatus>
	getAuthoritativeSession: () => Promise<{ data: unknown | null; error: unknown | null }>
	ensureSignedOut: () => Promise<boolean>
}): Promise<AmbiguousDeletionReconciliation> {
	if (!deletionWasRequested) return { status: 'not-confirmed' }
	let deletionStatus: AccountDeletionReceiptStatus
	try {
		deletionStatus = await getDeletionStatus()
		if (deletionStatus.status === 'missing') return { status: 'not-confirmed' }
		if (deletionStatus.status === 'pending') {
			return {
				status: 'pending',
				localSessionCleared: await ensureSignedOut(),
				appleManualRevokeRequired: deletionStatus.appleManualRevokeRequired,
			}
		}
		const session = await getAuthoritativeSession()
		if (session.error !== null || session.data !== null) return { status: 'not-confirmed' }
	} catch {
		return { status: 'not-confirmed' }
	}
	return {
		status: 'completed',
		localSessionCleared: await ensureSignedOut(),
		appleManualRevokeRequired: deletionStatus.appleManualRevokeRequired,
	}
}

/**
 * Account deletion must default closed while Better Auth restores its session.
 * Treating an unknown user as temporary could purge app data before the
 * anonymous-only identity endpoint rejects a permanent account.
 */
export function resolveAccountDeletionMode(
	isPending: boolean,
	isCredentialed: boolean,
): AccountDeletionMode {
	if (isPending) return 'loading'
	return isCredentialed ? 'credentialed' : 'temporary'
}

/**
 * A permanent identity may be password-backed, social-only, or linked to both.
 * Prefer password confirmation whenever it exists; otherwise reauthenticate
 * with a supported linked provider before deletion.
 */
export function resolveCredentialedDeletionMethod(
	providerIds: readonly string[] | undefined,
): CredentialedDeletionMethod {
	if (providerIds === undefined) return 'loading'
	if (providerIds.includes('credential')) return 'password'
	for (const provider of ['apple', 'google'] as const) {
		if (providerIds.includes(provider)) return { kind: 'social', provider }
	}
	return 'unsupported'
}

export function socialDeletionOAuthAdditionalData(challenge: string): Record<string, string> {
	return { [SOCIAL_DELETION_OAUTH_STATE_KEY]: challenge }
}

/**
 * Ask the backend to bind a short-lived challenge to the current Better Auth
 * user/session, then run Better Auth's authenticated linkSocial flow. Its
 * signed OAuth state keeps the original user fixed and the backend marks the
 * challenge only when the exact linked provider account returns. The final
 * deletion action consumes that proof; client state is only an early guard.
 */
export async function confirmAndDeleteSocialAccount({
	provider,
	beginChallenge,
	reauthenticate,
	resolveSession,
	deleteAccount,
}: SocialAccountDeletionDependencies): Promise<SocialAccountDeletionResult> {
	const { challenge, userId } = await beginChallenge(provider)
	const reauthError = await reauthenticate(provider, challenge)
	if (reauthError) {
		return { ok: false, reason: 'reauth-failed', message: reauthError.message }
	}

	if (!(await resolveSession(userId))) {
		return { ok: false, reason: 'reauth-incomplete' }
	}

	const deletion = await deleteAccount(challenge)
	if (deletion.error) {
		return { ok: false, reason: 'delete-failed', message: deletion.error.message }
	}
	return { ok: true, appleManualRevokeRequired: deletion.appleManualRevokeRequired }
}
