import { describe, expect, test } from 'vitest'

import { getStableStateShellBottomPadding } from './screen-state-layout'

describe('getStableStateShellBottomPadding', () => {
	test('does not move centered content when NativeTabs changes the live bottom inset', () => {
		const hiddenChrome = getStableStateShellBottomPadding({
			initialBottomInset: 34,
			liveBottomInset: 34,
			tabBarClearance: 72,
		})
		const visibleChrome = getStableStateShellBottomPadding({
			initialBottomInset: 34,
			liveBottomInset: 96,
			tabBarClearance: 72,
		})

		expect(hiddenChrome).toBe(106)
		expect(visibleChrome).toBe(hiddenChrome)
	})
})
