type WelcomeLayoutInput = {
	height: number
	fontScale: number
}

export type WelcomeLayout = {
	compact: boolean
	accessibilityText: boolean
	heroHeight: number
	headlineFontSize: number
	headlineLineHeight: number
	bodyLineHeight: number
	disclosureLineHeight: number
	linkLineHeight: number
	buttonLabelLineHeight: number
	buttonMinHeight: number
	forceHeadlineBreak: boolean
	showsScrollIndicator: boolean
}

/** Responsive measurements for the anonymous-first welcome screen. */
export function resolveWelcomeLayout({ height, fontScale }: WelcomeLayoutInput): WelcomeLayout {
	const compact = height < 750
	const accessibilityText = fontScale > 1.2
	const headlineFontSize = accessibilityText ? 22 : 42
	// React Native's native text renderer applies the effective Dynamic Type
	// multiplier to lineHeight itself. These remain logical base values; only
	// the surrounding non-text button geometry is scaled explicitly below.
	const headlineLineHeight = accessibilityText ? 28 : 46.2
	const bodyLineHeight = 24
	const disclosureLineHeight = 18
	const linkLineHeight = 20
	const buttonLabelLineHeight = 24

	return {
		compact,
		accessibilityText,
		heroHeight: accessibilityText ? 96 : compact ? 190 : 288,
		headlineFontSize,
		headlineLineHeight,
		bodyLineHeight,
		disclosureLineHeight,
		linkLineHeight,
		buttonLabelLineHeight,
		buttonMinHeight: Math.ceil(buttonLabelLineHeight * fontScale + 32),
		forceHeadlineBreak: !accessibilityText,
		showsScrollIndicator: compact || accessibilityText,
	}
}
