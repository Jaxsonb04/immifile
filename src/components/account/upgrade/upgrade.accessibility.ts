export type UpgradeAccessibilityState = {
	backgroundAccessibilityElementsHidden: boolean
	backgroundImportantForAccessibility: 'auto' | 'no-hide-descendants'
	portalIsAccessibilityModal: boolean
	sheetIsAccessibilityModal: boolean
	sheetAccessible: false
}

/**
 * Keep the three native accessibility boundaries in lockstep with the
 * controlled sheet state. The portal constrains VoiceOver to its window, the
 * background wrapper handles platforms where that portal flag is unavailable,
 * and `accessible: false` keeps Gorhom's sheet wrapper from collapsing all of
 * the form controls into one "Bottom Sheet" element.
 */
export function resolveUpgradeAccessibility(isOpen: boolean): UpgradeAccessibilityState {
	return {
		backgroundAccessibilityElementsHidden: isOpen,
		backgroundImportantForAccessibility: isOpen ? 'no-hide-descendants' : 'auto',
		portalIsAccessibilityModal: isOpen,
		sheetIsAccessibilityModal: isOpen,
		sheetAccessible: false,
	}
}
