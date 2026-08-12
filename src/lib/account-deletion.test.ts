import { describe, expect, test, vi } from 'vitest'
import {
	confirmAndDeleteSocialAccount,
	resolveAccountDeletionMode,
	resolveCredentialedDeletionMethod,
} from './account-deletion'

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
		const sessionIds = ['old-session', 'old-session']

		await expect(
			confirmAndDeleteSocialAccount({
				provider: 'google',
				getSessionId: vi.fn(async () => sessionIds.shift() ?? null),
				reauthenticate: vi.fn(async () => null),
				resolveSession: vi.fn(async () => true),
				deleteAccount,
			}),
		).resolves.toEqual({ ok: false, reason: 'reauth-incomplete' })
		expect(deleteAccount).not.toHaveBeenCalled()
	})

	test('deletes only after the provider returns a new confirmed session', async () => {
		const deleteAccount = vi.fn(async () => null)
		const sessionIds = ['old-session', 'confirmed-session']

		await expect(
			confirmAndDeleteSocialAccount({
				provider: 'apple',
				getSessionId: vi.fn(async () => sessionIds.shift() ?? null),
				reauthenticate: vi.fn(async () => null),
				resolveSession: vi.fn(async () => true),
				deleteAccount,
			}),
		).resolves.toEqual({ ok: true })
		expect(deleteAccount).toHaveBeenCalledOnce()
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
