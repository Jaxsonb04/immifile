// @vitest-environment node

import { describe, expect, test, vi } from 'vitest'

import { createSessionReconcileScheduler } from '@/lib/session-reconciliation'

describe('createSessionReconcileScheduler', () => {
	test('does not compete with the auth refresh that clears a deleted account', async () => {
		let snapshot = { hasSession: true, isPending: false, isRefetching: true }
		const resolveSession = vi.fn<() => Promise<boolean>>().mockResolvedValue(false)
		const reconcile = createSessionReconcileScheduler({
			getSnapshot: () => snapshot,
			getCookie: () => '',
			resolveSession,
		})

		await reconcile()
		snapshot = { hasSession: false, isPending: false, isRefetching: false }
		await reconcile()

		expect(resolveSession).not.toHaveBeenCalled()
	})

	test('runs one trailing reconciliation when a new cookie arrives in flight', async () => {
		let cookie = 'session-cookie-1'
		let releaseReconciliation!: () => void
		const reconciliationGate = new Promise<void>((resolve) => {
			releaseReconciliation = resolve
		})
		const resolveSession = vi
			.fn<() => Promise<boolean>>()
			.mockImplementationOnce(async () => {
				await reconciliationGate
				return true
			})
			.mockResolvedValue(true)
		const reconcile = createSessionReconcileScheduler({
			getSnapshot: () => ({ hasSession: true, isPending: false, isRefetching: false }),
			getCookie: () => cookie,
			resolveSession,
		})

		const first = reconcile()
		cookie = 'session-cookie-2'
		const rotatedCookieNotification = reconcile()
		await Promise.resolve()
		expect(resolveSession).toHaveBeenCalledOnce()

		releaseReconciliation()
		await Promise.all([first, rotatedCookieNotification])
		expect(resolveSession).toHaveBeenCalledTimes(2)

		await reconcile()
		expect(resolveSession).toHaveBeenCalledTimes(2)
	})

	test('bounds reconciliation when every refresh rotates the cookie', async () => {
		let cookieVersion = 1
		const resolveSession = vi.fn(async () => {
			cookieVersion += 1
			return true
		})
		const reconcile = createSessionReconcileScheduler({
			getSnapshot: () => ({ hasSession: true, isPending: false, isRefetching: false }),
			getCookie: () => `session-cookie-${cookieVersion}`,
			resolveSession,
		})

		await reconcile()
		expect(resolveSession).toHaveBeenCalledTimes(2)

		await reconcile()
		expect(resolveSession).toHaveBeenCalledTimes(2)
	})
})
