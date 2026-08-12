import { describe, expect, test } from 'vitest'

import { supportsNativeTabMinimize } from './native-tabs-platform'

describe('supportsNativeTabMinimize', () => {
	test('enables the native option only on iOS 26 and newer', () => {
		expect(supportsNativeTabMinimize('ios', 18.1)).toBe(false)
		expect(supportsNativeTabMinimize('ios', '26.0')).toBe(true)
		expect(supportsNativeTabMinimize('android', 26)).toBe(false)
	})
})
