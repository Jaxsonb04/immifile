export type AccountDeletionMode = 'loading' | 'credentialed' | 'temporary'
export type SocialDeletionProvider = 'apple' | 'google'
export type CredentialedDeletionMethod =
	'loading' | 'password' | 'unsupported' | { kind: 'social'; provider: SocialDeletionProvider }

type AccountDeletionError = { message?: string } | null

type SocialAccountDeletionDependencies = {
	provider: SocialDeletionProvider
	getSessionId: () => Promise<string | null>
	reauthenticate: (provider: SocialDeletionProvider) => Promise<AccountDeletionError>
	resolveSession: () => Promise<boolean>
	deleteAccount: () => Promise<AccountDeletionError>
}

export type SocialAccountDeletionResult =
	| { ok: true }
	| { ok: false; reason: 'reauth-failed' | 'reauth-incomplete' | 'delete-failed'; message?: string }

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

/**
 * Require a genuinely new provider-backed session before deleting a
 * social-only account. Expo's OAuth client resolves without an error when its
 * browser is dismissed, so comparing session ids is the reliable cancellation
 * boundary.
 */
export async function confirmAndDeleteSocialAccount({
	provider,
	getSessionId,
	reauthenticate,
	resolveSession,
	deleteAccount,
}: SocialAccountDeletionDependencies): Promise<SocialAccountDeletionResult> {
	const previousSessionId = await getSessionId()
	const reauthError = await reauthenticate(provider)
	if (reauthError) {
		return { ok: false, reason: 'reauth-failed', message: reauthError.message }
	}

	const resolved = await resolveSession()
	const confirmedSessionId = resolved ? await getSessionId() : null
	if (!confirmedSessionId || confirmedSessionId === previousSessionId) {
		return { ok: false, reason: 'reauth-incomplete' }
	}

	const deleteError = await deleteAccount()
	if (deleteError) {
		return { ok: false, reason: 'delete-failed', message: deleteError.message }
	}
	return { ok: true }
}
