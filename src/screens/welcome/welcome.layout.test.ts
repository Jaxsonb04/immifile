import { describe, expect, test } from 'vitest'
import { resolveWelcomeLayout } from './welcome.layout'

describe('resolveWelcomeLayout', () => {
	test('keeps the established compact layout at standard text size', () => {
		expect(resolveWelcomeLayout({ height: 667, fontScale: 1 })).toMatchObject({
			compact: true,
			accessibilityText: false,
			heroHeight: 190,
			headlineFontSize: 42,
			headlineLineHeight: 46.2,
			forceHeadlineBreak: true,
		})
	})

	test('reflows an iPhone SE instead of capping Accessibility Large text', () => {
		expect(resolveWelcomeLayout({ height: 667, fontScale: 3.1 })).toEqual({
			compact: true,
			accessibilityText: true,
			heroHeight: 96,
			headlineFontSize: 22,
			headlineLineHeight: 28,
			bodyLineHeight: 24,
			disclosureLineHeight: 18,
			linkLineHeight: 20,
			buttonLabelLineHeight: 24,
			buttonMinHeight: 107,
			forceHeadlineBreak: false,
			showsScrollIndicator: true,
		})
	})

	test('retains the full-height artwork on a tall standard-text phone', () => {
		expect(resolveWelcomeLayout({ height: 852, fontScale: 1 }).heroHeight).toBe(288)
	})
})
