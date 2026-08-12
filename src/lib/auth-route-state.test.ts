// @vitest-environment node

import { describe, expect, test } from 'vitest'

import { resolveAuthRouteState } from './auth-route-state'

describe('resolveAuthRouteState', () => {
	test('shows the boot loader only before the first settled auth result', () => {
		expect(resolveAuthRouteState(null, { isLoading: true, isAuthenticated: false })).toEqual({
			authenticated: null,
			showBootLoader: true,
		})

		expect(resolveAuthRouteState(null, { isLoading: false, isAuthenticated: false })).toEqual({
			authenticated: false,
			showBootLoader: false,
		})
	})

	test('retains the mounted route through later auth refreshes', () => {
		expect(resolveAuthRouteState(false, { isLoading: true, isAuthenticated: true })).toEqual({
			authenticated: false,
			showBootLoader: false,
		})

		expect(resolveAuthRouteState(true, { isLoading: true, isAuthenticated: false })).toEqual({
			authenticated: true,
			showBootLoader: false,
		})
	})

	test('switches routes once the new auth state has settled', () => {
		expect(resolveAuthRouteState(false, { isLoading: false, isAuthenticated: true })).toEqual({
			authenticated: true,
			showBootLoader: false,
		})

		expect(resolveAuthRouteState(true, { isLoading: false, isAuthenticated: false })).toEqual({
			authenticated: false,
			showBootLoader: false,
		})
	})
})
