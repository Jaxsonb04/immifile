import { describe, expect, test } from 'vitest'
import { getLargeTitleRestoreOffset } from './large-title-restore'

describe('getLargeTitleRestoreOffset', () => {
	test('restores the expanded iOS 26 header below the safe area', () => {
		expect(getLargeTitleRestoreOffset({ platform: 'ios', osVersion: '26.5', topInset: 62 })).toBe(
			-168,
		)
	})

	test.each([
		{ platform: 'ios', osVersion: '18.1' },
		{ platform: 'ios', osVersion: '27.0' },
		{ platform: 'android', osVersion: 36 },
	])('leaves native automatic inset handling alone on $platform $osVersion', (target) => {
		expect(getLargeTitleRestoreOffset({ ...target, topInset: 20 })).toBeUndefined()
	})
})
