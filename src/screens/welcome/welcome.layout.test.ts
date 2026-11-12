import { describe, expect, test } from 'vitest'
import { resolveWelcomeLayout } from './welcome.layout'

describe('resolveWelcomeLayout', () => {
	test('keeps the established compact layout at standard text size', () => {
		expect(resolveWelcomeLayout({ height: 667, fontScale: 1 })).toMatchObject({
			compact: true,
			accessibilityText: false,
			headlineFontSize: 36,
			headlineLineHeight: 40,
			forceHeadlineBreak: true,
		})
	})

	test('reflows an iPhone SE instead of capping Accessibility Large text', () => {
		expect(resolveWelcomeLayout({ height: 667, fontScale: 3.1 })).toEqual({
			compact: true,
			accessibilityText: true,
			headlineFontSize: 26,
			headlineLineHeight: 34,
			bodyLineHeight: 24,
			disclosureLineHeight: 18,
			linkLineHeight: 20,
			buttonLabelLineHeight: 24,
			buttonMinHeight: 107,
			forceHeadlineBreak: false,
			showsScrollIndicator: true,
		})
	})

	test('uses the larger headline only when the viewport has room', () => {
		expect(resolveWelcomeLayout({ height: 852, fontScale: 1 }).headlineFontSize).toBe(42)
	})
})
