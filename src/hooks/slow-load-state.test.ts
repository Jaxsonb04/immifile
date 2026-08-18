import { describe, expect, test } from 'vitest'
import { resolveSlowLoadState, SLOW_LOAD_RETRY_MESSAGE } from './slow-load-state'

describe('resolveSlowLoadState', () => {
	test('starts with an uncluttered loading state', () => {
		expect(resolveSlowLoadState(true, false)).toBe('loading')
	})

	test('becomes an explanatory automatic-retry fallback after the bound', () => {
		expect(resolveSlowLoadState(true, true)).toBe('stalled')
		expect(SLOW_LOAD_RETRY_MESSAGE).toMatch(/keep trying automatically/i)
	})

	test('clears the fallback as soon as data arrives', () => {
		expect(resolveSlowLoadState(false, true)).toBe('ready')
	})
})
