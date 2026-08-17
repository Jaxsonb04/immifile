import { describe, expect, test, vi } from 'vitest'
import {
	APPLE_MANUAL_REVOCATION_INSTRUCTIONS,
	confirmAndDeleteSocialAccount,
	reconcileAmbiguousAccountDeletion,
	resolveAccountDeletionMode,
	resolveCredentialedDeletionMethod,
	socialDeletionOAuthAdditionalData,
} from './account-deletion'

describe('ambiguous account-deletion response', () => {
	test('requires a completed receipt plus a cache-bypassed null session', async () => {
		const ensureSignedOut = vi.fn(async () => true)
		await expect(
			reconcileAmbiguousAccountDeletion({
				deletionWasRequested: true,
				getDeletionStatus: vi.fn(async () => ({
					status: 'completed' as const,
					appleManualRevokeRequired: true,
				})),
				getAuthoritativeSession: vi.fn(async () => ({ data: null, error: null })),
				ensureSignedOut,
			}),
		).resolves.toEqual({
			status: 'completed',
			localSessionCleared: true,
			appleManualRevokeRequired: true,
		})
		expect(ensureSignedOut).toHaveBeenCalledOnce()
	})

	test('does not claim deletion for an expired session when no tombstone receipt exists', async () => {
		const ensureSignedOut = vi.fn(async () => true)
		const getAuthoritativeSession = vi.fn(async () => ({ data: null, error: null }))
		await expect(
			reconcileAmbiguousAccountDeletion({
				deletionWasRequested: true,
				getDeletionStatus: vi.fn(async () => ({ status: 'missing' as const })),
				getAuthoritativeSession,
				ensureSignedOut,
			}),
		).resolves.toEqual({ status: 'not-confirmed' })
		expect(getAuthoritativeSession).not.toHaveBeenCalled()
		expect(ensureSignedOut).not.toHaveBeenCalled()
	})

	test('does not sign out after a completed receipt if session absence is inconclusive', async () => {
		const ensureSignedOut = vi.fn(async () => true)
		await expect(
			reconcileAmbiguousAccountDeletion({
				deletionWasRequested: true,
				getDeletionStatus: vi.fn(async () => ({
					status: 'completed' as const,
					appleManualRevokeRequired: false,
				})),
				getAuthoritativeSession: vi.fn(async () => {
					throw new Error('offline')
				}),
				ensureSignedOut,
			}),
		).resolves.toEqual({ status: 'not-confirmed' })
		expect(ensureSignedOut).not.toHaveBeenCalled()
	})

	test('does not query or sign out when deletion never reached the server action', async () => {
		const getDeletionStatus = vi.fn(async () => ({ status: 'missing' as const }))
		const getAuthoritativeSession = vi.fn(async () => ({ data: null, error: null }))
		const ensureSignedOut = vi.fn(async () => true)
		await expect(
			reconcileAmbiguousAccountDeletion({
				deletionWasRequested: false,
				getDeletionStatus,
				getAuthoritativeSession,
				ensureSignedOut,
			}),
		).resolves.toEqual({ status: 'not-confirmed' })
		expect(getDeletionStatus).not.toHaveBeenCalled()
		expect(getAuthoritativeSession).not.toHaveBeenCalled()
		expect(ensureSignedOut).not.toHaveBeenCalled()
	})

	test('reports a durable pending deletion without calling it completed', async () => {
		await expect(
			reconcileAmbiguousAccountDeletion({
				deletionWasRequested: true,
				getDeletionStatus: vi.fn(async () => ({
					status: 'pending' as const,
					appleManualRevokeRequired: false,
				})),
				getAuthoritativeSession: vi.fn(async () => ({ data: null, error: null })),
				ensureSignedOut: vi.fn(async () => false),
			}),
		).resolves.toEqual({
			status: 'pending',
			localSessionCleared: false,
			appleManualRevokeRequired: false,
		})
	})
})

test('manual Apple revocation copy gives the exact actionable Settings path', () => {
	expect(APPLE_MANUAL_REVOCATION_INSTRUCTIONS).toContain('Settings')
	expect(APPLE_MANUAL_REVOCATION_INSTRUCTIONS).toContain('Sign in with Apple')
	expect(APPLE_MANUAL_REVOCATION_INSTRUCTIONS).toContain('Stop Using Apple ID')
})

describe('account deletion mode', () => {
	test('defaults closed while account type is unresolved', () => {
		expect(resolveAccountDeletionMode(true, false)).toBe('loading')
		expect(resolveAccountDeletionMode(true, true)).toBe('loading')
	})

	test('selects password confirmation only for a resolved permanent account', () => {
		expect(resolveAccountDeletionMode(false, true)).toBe('credentialed')
	})

	test('selects anonymous deletion only for a resolved temporary account', () => {
		expect(resolveAccountDeletionMode(false, false)).toBe('temporary')
	})
})

describe('social account deletion', () => {
	test('does not delete when the provider confirmation browser is dismissed', async () => {
		const deleteAccount = vi.fn()

		await expect(
			confirmAndDeleteSocialAccount({
				provider: 'google',
				beginChallenge: vi.fn(async () => ({ challenge: 'challenge-1', userId: 'user-1' })),
				reauthenticate: vi.fn(async () => ({ message: 'The browser was dismissed' })),
				resolveSession: vi.fn(async () => true),
				deleteAccount,
			}),
		).resolves.toEqual({
			ok: false,
			reason: 'reauth-failed',
			message: 'The browser was dismissed',
		})
		expect(deleteAccount).not.toHaveBeenCalled()
	})

	test('does not delete when the original Better Auth user cannot be resolved afterward', async () => {
		const deleteAccount = vi.fn()

		await expect(
			confirmAndDeleteSocialAccount({
				provider: 'google',
				beginChallenge: vi.fn(async () => ({ challenge: 'challenge-2', userId: 'user-1' })),
				reauthenticate: vi.fn(async () => null),
				resolveSession: vi.fn(async (expectedUserId) => expectedUserId === 'different-user'),
				deleteAccount,
			}),
		).resolves.toEqual({ ok: false, reason: 'reauth-incomplete' })
		expect(deleteAccount).not.toHaveBeenCalled()
	})

	test('deletes only after the bound provider challenge and user resolve', async () => {
		const deleteAccount = vi.fn(async (challenge: string) => ({
			error: null,
			appleManualRevokeRequired: challenge === 'challenge-3',
		}))
		const reauthenticate = vi.fn(async () => null)

		await expect(
			confirmAndDeleteSocialAccount({
				provider: 'apple',
				beginChallenge: vi.fn(async () => ({ challenge: 'challenge-3', userId: 'user-3' })),
				reauthenticate,
				resolveSession: vi.fn(async (expectedUserId) => expectedUserId === 'user-3'),
				deleteAccount,
			}),
		).resolves.toEqual({ ok: true, appleManualRevokeRequired: true })
		expect(reauthenticate).toHaveBeenCalledWith('apple', 'challenge-3')
		expect(deleteAccount).toHaveBeenCalledWith('challenge-3')
	})

	test('surfaces a server-side proof/deletion rejection without claiming success', async () => {
		await expect(
			confirmAndDeleteSocialAccount({
				provider: 'google',
				beginChallenge: vi.fn(async () => ({ challenge: 'challenge-4', userId: 'user-4' })),
				reauthenticate: vi.fn(async () => null),
				resolveSession: vi.fn(async () => true),
				deleteAccount: vi.fn(async () => ({
					error: { message: 'Sign-in confirmation was not completed' },
				})),
			}),
		).resolves.toEqual({
			ok: false,
			reason: 'delete-failed',
			message: 'Sign-in confirmation was not completed',
		})
	})

	test('puts only the opaque challenge into Better Auth signed OAuth state', () => {
		expect(socialDeletionOAuthAdditionalData('opaque-challenge')).toEqual({
			immifileAccountDeletionChallenge: 'opaque-challenge',
		})
	})
})

describe('credentialed account deletion method', () => {
	test('uses the linked social provider when the account has no password', () => {
		expect(resolveCredentialedDeletionMethod(['google'])).toEqual({
			kind: 'social',
			provider: 'google',
		})
		expect(resolveCredentialedDeletionMethod(['apple'])).toEqual({
			kind: 'social',
			provider: 'apple',
		})
	})

	test('prefers password confirmation for an account that also links social login', () => {
		expect(resolveCredentialedDeletionMethod(['google', 'credential'])).toBe('password')
		expect(resolveCredentialedDeletionMethod(undefined)).toBe('loading')
		expect(resolveCredentialedDeletionMethod([])).toBe('unsupported')
	})
})
