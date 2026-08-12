// @vitest-environment node

import { beforeEach, describe, expect, test, vi } from 'vitest'

import {
	ensureSessionResolved,
	ensureSignedOut,
	ensureSignedOutAfterDeletion,
} from './session-sync'

type TestSessionValue = {
	data: {
		session?: { id: string }
		user?: { id: string }
	} | null
	isPending: boolean
	isRefetching?: boolean
}

const sessionStore = vi.hoisted(() => ({
	value: {
		data: null,
		isPending: false,
	} as TestSessionValue,
	refetch: vi.fn<(params?: { query?: { disableCookieCache?: boolean } }) => Promise<void>>(),
	signOut: vi.fn<() => Promise<unknown>>(),
	notify: vi.fn(),
	listeners: new Set<(value: unknown) => void>(),
	subscribe: vi.fn((listener: (value: unknown) => void) => {
		sessionStore.listeners.add(listener)
		return () => sessionStore.listeners.delete(listener)
	}),
	getCookie: vi.fn(() => ''),
}))

function publishSession(value: typeof sessionStore.value): void {
	sessionStore.value = value
	for (const listener of sessionStore.listeners) listener(value)
}

vi.mock('@/lib/auth-client', () => ({
	authClient: {
		$store: {
			atoms: {
				session: {
					get: () => ({
						...sessionStore.value,
						refetch: sessionStore.refetch,
					}),
					subscribe: sessionStore.subscribe,
				},
			},
			notify: sessionStore.notify,
		},
		getCookie: sessionStore.getCookie,
		signOut: sessionStore.signOut,
	},
}))

function resetSessionStore(): void {
	vi.useRealTimers()
	sessionStore.value = { data: null, isPending: false }
	sessionStore.refetch.mockReset()
	sessionStore.signOut.mockReset()
	sessionStore.notify.mockReset()
	sessionStore.subscribe.mockClear()
	sessionStore.listeners.clear()
	sessionStore.getCookie.mockReset()
	sessionStore.getCookie.mockReturnValue('')
}

describe('ensureSessionResolved', () => {
	beforeEach(resetSessionStore)

	test('uses the expected session already settled by Better Auth without refetching', async () => {
		sessionStore.value = {
			data: { session: { id: 'fresh-session' }, user: { id: 'fresh-user' } },
			isPending: false,
		}

		await expect(ensureSessionResolved('fresh-user')).resolves.toBe(true)
		expect(sessionStore.refetch).not.toHaveBeenCalled()
	})

	test("waits for Better Auth's cookie signal before starting a fallback refetch", async () => {
		vi.useFakeTimers()
		sessionStore.value = { data: null, isPending: true }

		const result = ensureSessionResolved('fresh-user')
		expect(sessionStore.refetch).not.toHaveBeenCalled()
		publishSession({
			data: { session: { id: 'fresh-session' }, user: { id: 'fresh-user' } },
			isPending: false,
		})

		await expect(result).resolves.toBe(true)
		expect(sessionStore.refetch).not.toHaveBeenCalled()
	})

	test('does not replace a slow Better Auth refetch when it crosses the short signal window', async () => {
		vi.useFakeTimers()
		sessionStore.value = { data: null, isPending: true, isRefetching: true }
		sessionStore.refetch.mockResolvedValue()

		const result = ensureSessionResolved('fresh-user')
		await vi.advanceTimersByTimeAsync(400)

		expect(sessionStore.refetch).not.toHaveBeenCalled()
		publishSession({
			data: { session: { id: 'fresh-session' }, user: { id: 'fresh-user' } },
			isPending: false,
			isRefetching: false,
		})

		await expect(result).resolves.toBe(true)
		expect(sessionStore.refetch).not.toHaveBeenCalled()
	})

	test('uses one cache-bypassed fallback when the normal signal never settles', async () => {
		vi.useFakeTimers()
		sessionStore.value = {
			data: { session: { id: 'stale-session' }, user: { id: 'stale-user' } },
			isPending: false,
		}
		sessionStore.refetch.mockImplementation(async () => {
			sessionStore.value = {
				data: { session: { id: 'fresh-session' }, user: { id: 'fresh-user' } },
				isPending: false,
			}
		})

		const result = ensureSessionResolved('fresh-user')
		await vi.advanceTimersByTimeAsync(400)

		await expect(result).resolves.toBe(true)
		expect(sessionStore.refetch).toHaveBeenCalledOnce()
		expect(sessionStore.refetch).toHaveBeenCalledWith({
			query: { disableCookieCache: true },
		})
	})

	test('coalesces concurrent fallback refetches', async () => {
		vi.useFakeTimers()
		let releaseRefetch!: () => void
		const refetchGate = new Promise<void>((resolve) => {
			releaseRefetch = resolve
		})
		sessionStore.refetch.mockImplementation(async () => {
			await refetchGate
			sessionStore.value = {
				data: { session: { id: 'fresh-session' }, user: { id: 'fresh-user' } },
				isPending: false,
			}
		})

		const strictResult = ensureSessionResolved('fresh-user')
		const genericResult = ensureSessionResolved()
		await vi.advanceTimersByTimeAsync(400)
		expect(sessionStore.refetch).toHaveBeenCalledOnce()

		releaseRefetch()
		await expect(Promise.all([strictResult, genericResult])).resolves.toEqual([true, true])
		expect(sessionStore.refetch).toHaveBeenCalledOnce()
	})

	test('validates an unchanged generic session once instead of trusting it as new', async () => {
		vi.useFakeTimers()
		sessionStore.value = {
			data: { session: { id: 'existing-session' }, user: { id: 'existing-user' } },
			isPending: false,
		}
		sessionStore.refetch.mockResolvedValue()

		const result = ensureSessionResolved()
		await vi.advanceTimersByTimeAsync(400)

		await expect(result).resolves.toBe(true)
		expect(sessionStore.refetch).toHaveBeenCalledOnce()
	})

	test('fails closed after one fallback when the expected user never appears', async () => {
		vi.useFakeTimers()
		sessionStore.value = {
			data: { session: { id: 'stale-session' }, user: { id: 'stale-user' } },
			isPending: false,
		}
		sessionStore.refetch.mockResolvedValue()

		const result = ensureSessionResolved('fresh-user')
		await vi.advanceTimersByTimeAsync(400)

		await expect(result).resolves.toBe(false)
		expect(sessionStore.refetch).toHaveBeenCalledOnce()
	})
})

describe('ensureSignedOut', () => {
	beforeEach(resetSessionStore)

	test('returns immediately when Better Auth is already settled signed-out', async () => {
		await expect(ensureSignedOut()).resolves.toBe(true)
		expect(sessionStore.refetch).not.toHaveBeenCalled()
	})

	test("waits for Better Auth's delete signal before starting a fallback refetch", async () => {
		vi.useFakeTimers()
		sessionStore.value = {
			data: { session: { id: 'deleted-session' }, user: { id: 'deleted-user' } },
			isPending: true,
		}

		const result = ensureSignedOut()
		expect(sessionStore.refetch).not.toHaveBeenCalled()
		publishSession({ data: null, isPending: false })

		await expect(result).resolves.toBe(true)
		expect(sessionStore.refetch).not.toHaveBeenCalled()
	})

	test('uses one cache-bypassed fallback when the delete signal is stranded', async () => {
		vi.useFakeTimers()
		sessionStore.value = {
			data: { session: { id: 'deleted-session' }, user: { id: 'deleted-user' } },
			isPending: false,
		}
		sessionStore.refetch.mockImplementation(async () => {
			sessionStore.value = { data: null, isPending: false }
		})

		const result = ensureSignedOut()
		await vi.advanceTimersByTimeAsync(400)

		await expect(result).resolves.toBe(true)
		expect(sessionStore.refetch).toHaveBeenCalledOnce()
	})

	test('fails closed after one fallback when the session never clears', async () => {
		vi.useFakeTimers()
		sessionStore.value = {
			data: { session: { id: 'immortal-session' }, user: { id: 'immortal-user' } },
			isPending: false,
		}
		sessionStore.refetch.mockResolvedValue()

		const result = ensureSignedOut()
		await vi.advanceTimersByTimeAsync(400)

		await expect(result).resolves.toBe(false)
		expect(sessionStore.refetch).toHaveBeenCalledOnce()
	})
})

describe('ensureSignedOutAfterDeletion', () => {
	beforeEach(resetSessionStore)

	test('uses Better Auth sign-out to clear a zombie deleted-session cookie', async () => {
		vi.useFakeTimers()
		sessionStore.value = {
			data: { session: { id: 'deleted-session' }, user: { id: 'deleted-user' } },
			isPending: false,
		}
		sessionStore.refetch.mockResolvedValue()
		sessionStore.signOut.mockImplementation(async () => {
			publishSession({ data: null, isPending: false })
		})

		const result = ensureSignedOutAfterDeletion()
		await vi.advanceTimersByTimeAsync(400)

		await expect(result).resolves.toBe(true)
		expect(sessionStore.refetch).toHaveBeenCalledOnce()
		expect(sessionStore.signOut).toHaveBeenCalledOnce()
	})
})
