import { describe, expect, test } from 'vitest'

import { resolveSocialProviders } from './social-login-state'

describe('resolveSocialProviders', () => {
	test('keeps auth controls unmounted until provider discovery settles', () => {
		expect(resolveSocialProviders(undefined, true)).toBeUndefined()
		expect(resolveSocialProviders(undefined, false)).toEqual([])
		expect(resolveSocialProviders(['google', 'unknown', 'apple'], true)).toEqual([
			'apple',
			'google',
		])
	})
})
