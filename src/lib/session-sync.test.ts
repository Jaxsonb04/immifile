// @vitest-environment node

import { beforeEach, describe, expect, test, vi } from 'vitest'

import { ensureSessionResolved, ensureSignedOut } from './session-sync'

const sessionStore = vi.hoisted(() => ({
	value: {
		data: null as {
			session?: { id: string }
			user?: { id: string }
		} | null,
		isPending: false,
	},
	refetch: vi.fn<() => Promise<void>>(),
	notify: vi.fn(),
	subscribe: vi.fn(() => vi.fn()),
	getCookie: vi.fn(() => ''),
}))

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
	},
}))

describe('ensureSessionResolved', () => {
	beforeEach(() => {
		vi.useRealTimers()
		sessionStore.value = { data: null, isPending: false }
		sessionStore.refetch.mockReset()
		sessionStore.notify.mockReset()
		sessionStore.subscribe.mockClear()
		sessionStore.getCookie.mockReset()
		sessionStore.getCookie.mockReturnValue('')
	})

	test('does not accept a stale cached user when resolving a newly created session', async () => {
		sessionStore.value = {
			data: {
				session: { id: 'stale-session' },
				user: { id: 'stale-user' },
			},
			isPending: false,
		}
		sessionStore.refetch.mockImplementation(async () => {
			sessionStore.value = {
				data: {
					session: { id: 'fresh-session' },
					user: { id: 'fresh-user' },
				},
				isPending: false,
			}
		})

		await expect(ensureSessionResolved('fresh-user')).resolves.toBe(true)
		expect(sessionStore.refetch).toHaveBeenCalledOnce()
	})

	test('coalesces concurrent refreshes while preserving each caller session check', async () => {
		let releaseRefetch!: () => void
		const refetchGate = new Promise<void>((resolve) => {
			releaseRefetch = resolve
		})
		sessionStore.refetch.mockImplementation(async () => {
			await refetchGate
			sessionStore.value = {
				data: {
					session: { id: 'fresh-session' },
					user: { id: 'fresh-user' },
				},
				isPending: false,
			}
		})

		const strictResult = ensureSessionResolved('fresh-user')
		const genericResult = ensureSessionResolved()
		expect(sessionStore.refetch).toHaveBeenCalledOnce()

		releaseRefetch()
		await expect(Promise.all([strictResult, genericResult])).resolves.toEqual([true, true])
		expect(sessionStore.refetch).toHaveBeenCalledOnce()
	})

	test('retries an aborted refetch before accepting the expected user', async () => {
		vi.useFakeTimers()
		sessionStore.value = {
			data: {
				session: { id: 'stale-session' },
				user: { id: 'stale-user' },
			},
			isPending: false,
		}
		sessionStore.refetch
			.mockRejectedValueOnce(new Error('aborted'))
			.mockImplementationOnce(async () => {
				sessionStore.value = {
					data: {
						session: { id: 'fresh-session' },
						user: { id: 'fresh-user' },
					},
					isPending: false,
				}
			})

		const result = ensureSessionResolved('fresh-user')
		await vi.advanceTimersByTimeAsync(200)

		await expect(result).resolves.toBe(true)
		expect(sessionStore.refetch).toHaveBeenCalledTimes(2)
	})

	test('does not accept an unchanged cached session after a rejected refetch', async () => {
		vi.useFakeTimers()
		sessionStore.value = {
			data: {
				session: { id: 'stale-session' },
				user: { id: 'stale-user' },
			},
			isPending: false,
		}
		sessionStore.refetch
			.mockRejectedValueOnce(new Error('aborted'))
			.mockImplementationOnce(async () => {
				sessionStore.value = {
					data: {
						session: { id: 'fresh-session' },
						user: { id: 'fresh-user' },
					},
					isPending: false,
				}
			})

		const result = ensureSessionResolved()
		await vi.advanceTimersByTimeAsync(200)

		await expect(result).resolves.toBe(true)
		expect(sessionStore.refetch).toHaveBeenCalledTimes(2)
	})

	test('fails closed when the refreshed session never matches the created user', async () => {
		vi.useFakeTimers()
		sessionStore.value = {
			data: {
				session: { id: 'stale-session' },
				user: { id: 'stale-user' },
			},
			isPending: false,
		}
		sessionStore.refetch.mockResolvedValue()

		const result = ensureSessionResolved('fresh-user')
		await vi.runAllTimersAsync()

		await expect(result).resolves.toBe(false)
		expect(sessionStore.refetch).toHaveBeenCalledTimes(12)
	})
})

describe('ensureSignedOut', () => {
	beforeEach(() => {
		vi.useRealTimers()
		sessionStore.value = { data: null, isPending: false }
		sessionStore.refetch.mockReset()
	})

	test('resolves immediately once the refetched atom reads signed-out', async () => {
		sessionStore.value = {
			data: {
				session: { id: 'deleted-session' },
				user: { id: 'deleted-user' },
			},
			isPending: false,
		}
		sessionStore.refetch.mockImplementation(async () => {
			sessionStore.value = { data: null, isPending: false }
		})

		await expect(ensureSignedOut()).resolves.toBe(true)
		expect(sessionStore.refetch).toHaveBeenCalledOnce()
	})

	test('retries past a refetch that still reports the deleted session from cache', async () => {
		vi.useFakeTimers()
		sessionStore.value = {
			data: {
				session: { id: 'deleted-session' },
				user: { id: 'deleted-user' },
			},
			isPending: false,
		}
		sessionStore.refetch
			.mockResolvedValueOnce()
			.mockImplementationOnce(async () => {
				sessionStore.value = { data: null, isPending: false }
			})

		const result = ensureSignedOut()
		await vi.advanceTimersByTimeAsync(200)

		await expect(result).resolves.toBe(true)
		expect(sessionStore.refetch).toHaveBeenCalledTimes(2)
	})

	test('fails closed when the session never clears', async () => {
		vi.useFakeTimers()
		sessionStore.value = {
			data: {
				session: { id: 'immortal-session' },
				user: { id: 'immortal-user' },
			},
			isPending: false,
		}
		sessionStore.refetch.mockResolvedValue()

		const result = ensureSignedOut()
		await vi.runAllTimersAsync()

		await expect(result).resolves.toBe(false)
		expect(sessionStore.refetch).toHaveBeenCalledTimes(12)
	})
})
