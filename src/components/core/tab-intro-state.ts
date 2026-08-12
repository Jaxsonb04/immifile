type TabIntroState = {
	dismissed: boolean | undefined
	preparing: boolean
	dismissing: boolean
	acknowledged: boolean
}

export type TabIntroPhase = 'loading' | 'intro' | 'preparing' | 'dismissing' | 'content'

/** Once a mounted owner has acknowledged an intro, preference deletion must
 * not turn that same tab back into a first-run surface while account deletion
 * is still signing the session out. A genuinely new mount starts at `false`. */
export function retainObservedTabIntroDismissal(
	hasObservedDismissal: boolean,
	dismissed: boolean | undefined,
): boolean {
	return hasObservedDismissal || dismissed === true
}

export function resolveTabIntroVisibility({
	dismissed,
	preparing,
	dismissing,
	acknowledged,
}: TabIntroState) {
	const phase: TabIntroPhase = acknowledged
		? 'content'
		: dismissing
			? 'dismissing'
			: preparing
				? 'preparing'
				: dismissed === undefined
					? 'loading'
					: dismissed
						? 'content'
						: 'intro'
	const showCover = phase !== 'content'
	return {
		phase,
		showCover,
		showIntro: phase === 'intro' || phase === 'preparing' || phase === 'dismissing',
		contentMounted: true,
		contentAccessible: !showCover,
		chromeHidden: phase === 'loading' || phase === 'intro',
	}
}
