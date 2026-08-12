export function getStableStateShellBottomPadding({
	initialBottomInset,
	liveBottomInset,
	tabBarClearance,
}: {
	initialBottomInset: number | undefined
	liveBottomInset: number
	tabBarClearance: number
}): number {
	return (initialBottomInset ?? liveBottomInset) + tabBarClearance
}
