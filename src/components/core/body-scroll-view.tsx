import { TabBarContext } from '@/hooks/use-tab-bar'
import { useFocusEffect } from 'expo-router'
import { cn } from 'heroui-native'
import { use, useCallback, useEffect, useRef } from 'react'
import { Platform, ScrollView, type ScrollViewProps } from 'react-native'
import { initialWindowMetrics, useSafeAreaInsets } from 'react-native-safe-area-context'
import { getLargeTitleRestoreOffset } from './large-title-restore'
import { TabIntroTransitionContext } from './tab-intro-transition'

type BodyScrollViewProps = ScrollViewProps & {
	/** Extra space above floating tab chrome for root-tab trailing content. */
	bottomClearance?: number
	/** iOS workaround for a root large-title ScrollView whose native tab bar
	 * starts hidden for a first-use introduction. */
	restoreLargeTitleOnTabReveal?: boolean
}

export const BodyScrollView = ({
	contentContainerClassName,
	contentContainerStyle,
	bottomClearance = 32,
	restoreLargeTitleOnTabReveal = false,
	...props
}: BodyScrollViewProps) => {
	const liveInsets = useSafeAreaInsets()
	const scrollRef = useRef<ScrollView>(null)
	const hasSeenHiddenTabBarRef = useRef(false)
	const lastAppliedRestoreStageRef = useRef<'preparing' | 'complete' | undefined>(undefined)
	const { isTabBarHidden } = use(TabBarContext)
	const introTransitionComplete = use(TabIntroTransitionContext)
	// NativeTabs reports a tab-bar-inclusive bottom inset when its floating bar
	// appears. Using that live value changes content height at the end of an intro
	// and can yank the ScrollView to its bottom/collapse the large title. The
	// launch-time device inset is stable across hidden/visible tab chrome.
	const bottomInset = initialWindowMetrics?.insets.bottom ?? liveInsets.bottom
	const topInset = initialWindowMetrics?.insets.top ?? liveInsets.top
	const largeTitleRestoreOffset = getLargeTitleRestoreOffset({
		platform: Platform.OS,
		osVersion: Platform.Version,
		topInset,
	})
	useEffect(() => {
		if (isTabBarHidden) hasSeenHiddenTabBarRef.current = true
	}, [isTabBarHidden])

	useFocusEffect(
		useCallback(() => {
			const restoreStage = introTransitionComplete ? 'complete' : 'preparing'
			if (
				!restoreLargeTitleOnTabReveal ||
				isTabBarHidden ||
				!hasSeenHiddenTabBarRef.current ||
				largeTitleRestoreOffset === undefined ||
				restoreStage === lastAppliedRestoreStageRef.current
			) {
				return
			}

			lastAppliedRestoreStageRef.current = restoreStage
			const restore = () =>
				scrollRef.current?.scrollTo({
					x: 0,
					y: largeTitleRestoreOffset,
					animated: false,
				})
			// The final acknowledgement render removes the intro cover. UIKit can
			// reconcile the large-title layout back to zero in that commit. The command
			// always executes after it;
			// unlike repeated setNativeProps values, Fabric does not deduplicate it.
			if (introTransitionComplete) {
				restore()
				return
			}
			// NativeTabs updates UIKit after the React commit that exposes the bar.
			// Wait through two display frames, then issue the initial command.
			let restoreFrame: number | undefined
			const layoutFrame = requestAnimationFrame(() => {
				restoreFrame = requestAnimationFrame(() => {
					restore()
				})
			})
			return () => {
				cancelAnimationFrame(layoutFrame)
				if (restoreFrame !== undefined) cancelAnimationFrame(restoreFrame)
			}
		}, [
			introTransitionComplete,
			isTabBarHidden,
			largeTitleRestoreOffset,
			restoreLargeTitleOnTabReveal,
		]),
	)
	return (
		<ScrollView
			ref={scrollRef}
			automaticallyAdjustsScrollIndicatorInsets
			contentInsetAdjustmentBehavior="automatic"
			// iOS: grow the bottom inset when the keyboard opens and keep the
			// focused input visible — without this, inline editors low on the page
			// (e.g. the case-detail status note) sit behind the keyboard and the
			// user types blind. Interactive dismiss gives the standard drag-down
			// escape. Callers can override both via props.
			automaticallyAdjustKeyboardInsets
			keyboardDismissMode="interactive"
			showsVerticalScrollIndicator={false}
			contentContainerClassName={cn('px-gutter', contentContainerClassName)}
			contentContainerStyle={[
				{ paddingBottom: bottomInset + bottomClearance },
				contentContainerStyle,
			]}
			{...props}
			scrollToOverflowEnabled={
				props.scrollToOverflowEnabled ||
				(restoreLargeTitleOnTabReveal && largeTitleRestoreOffset !== undefined)
			}
		/>
	)
}
