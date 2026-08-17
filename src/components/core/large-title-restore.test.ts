import { describe, expect, test } from 'vitest'
import { getLargeTitleRestoreOffset } from './large-title-restore'

describe('getLargeTitleRestoreOffset', () => {
	test('restores the expanded iOS 26 header below the safe area', () => {
		expect(getLargeTitleRestoreOffset({ platform: 'ios', osVersion: '26.5', topInset: 62 })).toBe(
			-168,
		)
	})

	test('restores the expanded iOS 18 header after an intro reveals native chrome', () => {
		expect(getLargeTitleRestoreOffset({ platform: 'ios', osVersion: '18.1', topInset: 20 })).toBe(
			-116,
		)
	})

	test.each([
		{ platform: 'ios', osVersion: '17.7' },
		{ platform: 'ios', osVersion: '27.0' },
		{ platform: 'android', osVersion: 36 },
	])('leaves native automatic inset handling alone on $platform $osVersion', (target) => {
		expect(getLargeTitleRestoreOffset({ ...target, topInset: 20 })).toBeUndefined()
	})
})
