// @vitest-environment node

import { describe, expect, test, vi } from 'vitest'

import { createSessionReconcileScheduler } from '@/lib/session-reconciliation'

describe('createSessionReconcileScheduler', () => {
	test('does nothing when the cookie and reactive session already agree', async () => {
		const resolveSession = vi.fn<() => Promise<boolean>>().mockResolvedValue(true)
		const clearSession = vi.fn<() => Promise<boolean>>().mockResolvedValue(true)
		const reconcile = createSessionReconcileScheduler({
			getSnapshot: () => ({ hasSession: true, isPending: false, isRefetching: false }),
			getCookie: () => 'healthy-cookie',
			resolveSession,
			clearSession,
		})

		await reconcile()

		expect(resolveSession).not.toHaveBeenCalled()
		expect(clearSession).not.toHaveBeenCalled()
	})

	test('resolves one missing-session mismatch per persisted cookie', async () => {
		const resolveSession = vi.fn<() => Promise<boolean>>().mockResolvedValue(true)
		const clearSession = vi.fn<() => Promise<boolean>>().mockResolvedValue(true)
		const reconcile = createSessionReconcileScheduler({
			getSnapshot: () => ({ hasSession: false, isPending: false, isRefetching: false }),
			getCookie: () => 'stranded-cookie',
			resolveSession,
			clearSession,
		})

		await reconcile()
		await reconcile()

		expect(resolveSession).toHaveBeenCalledOnce()
		expect(clearSession).not.toHaveBeenCalled()
	})

	test('clears one stale reactive session when its cookie is gone', async () => {
		const resolveSession = vi.fn<() => Promise<boolean>>().mockResolvedValue(true)
		const clearSession = vi.fn<() => Promise<boolean>>().mockResolvedValue(true)
		const reconcile = createSessionReconcileScheduler({
			getSnapshot: () => ({ hasSession: true, isPending: false, isRefetching: false }),
			getCookie: () => '',
			resolveSession,
			clearSession,
		})

		await reconcile()
		await reconcile()

		expect(clearSession).toHaveBeenCalledOnce()
		expect(resolveSession).not.toHaveBeenCalled()
	})

	test('does not compete with a Better Auth refresh already in progress', async () => {
		const resolveSession = vi.fn<() => Promise<boolean>>().mockResolvedValue(true)
		const clearSession = vi.fn<() => Promise<boolean>>().mockResolvedValue(true)
		const reconcile = createSessionReconcileScheduler({
			getSnapshot: () => ({ hasSession: true, isPending: false, isRefetching: true }),
			getCookie: () => '',
			resolveSession,
			clearSession,
		})

		await reconcile()

		expect(resolveSession).not.toHaveBeenCalled()
		expect(clearSession).not.toHaveBeenCalled()
	})

	test('re-evaluates one genuinely new mismatch that arrives in flight', async () => {
		let cookie = 'cookie-1'
		let hasSession = false
		let releaseFirst!: () => void
		const firstGate = new Promise<void>((resolve) => {
			releaseFirst = resolve
		})
		const resolveSession = vi
			.fn<() => Promise<boolean>>()
			.mockImplementationOnce(async () => {
				await firstGate
				return false
			})
			.mockResolvedValue(true)
		const reconcile = createSessionReconcileScheduler({
			getSnapshot: () => ({ hasSession, isPending: false, isRefetching: false }),
			getCookie: () => cookie,
			resolveSession,
			clearSession: vi.fn().mockResolvedValue(true),
		})

		const first = reconcile()
		cookie = 'cookie-2'
		const newCookieNotification = reconcile()
		releaseFirst()
		await Promise.all([first, newCookieNotification])

		expect(resolveSession).toHaveBeenCalledTimes(2)
		hasSession = true
		await reconcile()
		expect(resolveSession).toHaveBeenCalledTimes(2)
	})
})
