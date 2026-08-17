export type ResourcesLayout = {
	largeText: boolean
	groupLabelLineHeight: number
	titleLineHeight: number
	detailLineHeight: number
	footerLineHeight: number
	rowMinHeight: number
}

/**
 * React Native applies Dynamic Type to logical line-height values in the native
 * text renderer. The row itself is non-text geometry, so its minimum height is
 * the part that must explicitly follow the font scale.
 */
export function resolveResourcesLayout(fontScale: number): ResourcesLayout {
	const groupLabelLineHeight = 24
	const titleLineHeight = 24
	const detailLineHeight = 20
	const footerLineHeight = 20

	return {
		largeText: fontScale > 1.2,
		groupLabelLineHeight,
		titleLineHeight,
		detailLineHeight,
		footerLineHeight,
		rowMinHeight: Math.ceil((titleLineHeight + detailLineHeight) * fontScale + 32),
	}
}
