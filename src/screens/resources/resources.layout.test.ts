import { describe, expect, test } from 'vitest'
import { resolveResourcesLayout } from './resources.layout'

describe('resolveResourcesLayout', () => {
	test('keeps standard rows compact with readable line boxes', () => {
		expect(resolveResourcesLayout(1)).toEqual({
			largeText: false,
			groupLabelLineHeight: 24,
			titleLineHeight: 24,
			detailLineHeight: 20,
			footerLineHeight: 20,
			rowMinHeight: 76,
		})
	})

	test('scales line boxes and row minimums with Accessibility Large', () => {
		expect(resolveResourcesLayout(3.1)).toEqual({
			largeText: true,
			groupLabelLineHeight: 24,
			titleLineHeight: 24,
			detailLineHeight: 20,
			footerLineHeight: 20,
			rowMinHeight: 169,
		})
	})
})
