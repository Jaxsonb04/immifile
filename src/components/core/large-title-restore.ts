const IOS_26_EXPANDED_NAVIGATION_BAR_HEIGHT = 106

/**
 * NativeTabs can collapse a root large-title ScrollView when a tab bar changes
 * from hidden to visible on iOS 26. Older iOS releases retain UIKit's correct
 * automatic offset and must not receive a manual correction.
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
	if (platform !== 'ios' || osMajor !== 26) return undefined

	return -(topInset + IOS_26_EXPANDED_NAVIGATION_BAR_HEIGHT)
}
