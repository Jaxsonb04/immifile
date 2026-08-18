const IOS_18_EXPANDED_NAVIGATION_BAR_HEIGHT = 96
const IOS_26_EXPANDED_NAVIGATION_BAR_HEIGHT = 106

/**
 * NativeTabs can collapse a root large-title ScrollView when a tab bar changes
 * from hidden to visible after a first-use intro. iOS 18 and iOS 26 use
 * different expanded navigation-bar heights; unrelated releases retain
 * UIKit's automatic offset and must not receive a guessed correction.
 */
export function getLargeTitleRestoreOffset({
	platform,
	osVersion,
	topInset,
}: {
	platform: string
	osVersion: string | number
	topInset: number
}): number | undefined {
	const osMajor = Number.parseInt(String(osVersion), 10)
	if (platform !== 'ios') return undefined
	if (osMajor === 18) return -(topInset + IOS_18_EXPANDED_NAVIGATION_BAR_HEIGHT)
	if (osMajor !== 26) return undefined

	return -(topInset + IOS_26_EXPANDED_NAVIGATION_BAR_HEIGHT)
}
