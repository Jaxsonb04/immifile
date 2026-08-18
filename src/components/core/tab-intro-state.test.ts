import { describe, expect, test } from 'vitest'
import { resolveTabIntroVisibility, retainObservedTabIntroDismissal } from './tab-intro-state'

describe('resolveTabIntroVisibility', () => {
	test('keeps a persisted dismissal monotonic when account deletion removes preferences', () => {
		let observed = false
		const phases = ([undefined, true, false] as const).map((dismissed) => {
			observed = retainObservedTabIntroDismissal(observed, dismissed)
			return resolveTabIntroVisibility({
				dismissed: observed ? true : dismissed,
				preparing: false,
				dismissing: false,
				acknowledged: false,
			}).phase
		})

		expect(phases).toEqual(['loading', 'content', 'content'])
		expect(
			resolveTabIntroVisibility({
				dismissed: false,
				preparing: false,
				dismissing: false,
				acknowledged: false,
			}).phase,
		).toBe('intro')
	})

	test('keeps content mounted but hidden and inaccessible while the preference loads', () => {
		expect(
			resolveTabIntroVisibility({
				dismissed: undefined,
				preparing: false,
				dismissing: false,
				acknowledged: false,
			}),
		).toEqual({
			phase: 'loading',
			showCover: true,
			showIntro: false,
			contentMounted: true,
			contentAccessible: false,
			contentHeaderReady: false,
			chromeHidden: true,
		})
	})

	test('covers and blocks the preloaded content for a first-time user', () => {
		expect(
			resolveTabIntroVisibility({
				dismissed: false,
				preparing: false,
				dismissing: false,
				acknowledged: false,
			}),
		).toEqual({
			phase: 'intro',
			showCover: true,
			showIntro: true,
			contentMounted: true,
			contentAccessible: false,
			contentHeaderReady: false,
			chromeHidden: true,
		})
	})

	test('reveals chrome only after Got it while an opaque cover prepares live content', () => {
		expect(
			resolveTabIntroVisibility({
				dismissed: true,
				preparing: true,
				dismissing: false,
				acknowledged: false,
			}),
		).toEqual({
			phase: 'preparing',
			showCover: true,
			showIntro: true,
			contentMounted: true,
			contentAccessible: false,
			contentHeaderReady: true,
			chromeHidden: false,
		})
	})

	test('keeps the cover in place but leaves acknowledged chrome visible during dismissal', () => {
		expect(
			resolveTabIntroVisibility({
				dismissed: true,
				preparing: false,
				dismissing: true,
				acknowledged: false,
			}),
		).toEqual({
			phase: 'dismissing',
			showCover: true,
			showIntro: true,
			contentMounted: true,
			contentAccessible: false,
			contentHeaderReady: true,
			chromeHidden: false,
		})
	})

	test.each([
		{ label: 'a persisted dismissal', dismissed: true, acknowledged: false },
		{ label: 'the just-finished local dismissal', dismissed: false, acknowledged: true },
	])('exposes content and chrome after $label', ({ dismissed, acknowledged }) => {
		expect(
			resolveTabIntroVisibility({
				dismissed,
				preparing: false,
				dismissing: false,
				acknowledged,
			}),
		).toEqual({
			phase: 'content',
			showCover: false,
			showIntro: false,
			contentMounted: true,
			contentAccessible: true,
			contentHeaderReady: true,
			chromeHidden: false,
		})
	})
})
