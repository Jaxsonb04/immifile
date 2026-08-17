import { describe, expect, test } from 'vitest'
import { resolveUpgradeAccessibility } from './upgrade.accessibility'

describe('resolveUpgradeAccessibility', () => {
	test('exposes the sheet controls and hides the underlying screen while open', () => {
		expect(resolveUpgradeAccessibility(true)).toEqual({
			backgroundAccessibilityElementsHidden: true,
			backgroundImportantForAccessibility: 'no-hide-descendants',
			portalIsAccessibilityModal: true,
			sheetIsAccessibilityModal: true,
			sheetAccessible: false,
		})
	})

	test('restores the underlying screen after dismissal', () => {
		expect(resolveUpgradeAccessibility(false)).toMatchObject({
			backgroundAccessibilityElementsHidden: false,
			backgroundImportantForAccessibility: 'auto',
			portalIsAccessibilityModal: false,
			sheetIsAccessibilityModal: false,
		})
	})
})
