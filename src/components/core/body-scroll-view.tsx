import { cn } from 'heroui-native'
import { type ScrollViewProps, ScrollView } from 'react-native'
import { initialWindowMetrics, useSafeAreaInsets } from 'react-native-safe-area-context'

type BodyScrollViewProps = ScrollViewProps & {
	/** Additional space for trailing content above native tab chrome. */
	bottomClearance?: number
}

export const BodyScrollView = ({
	contentContainerClassName,
	contentContainerStyle,
	bottomClearance = 32,
	...props
}: BodyScrollViewProps) => {
	const liveInsets = useSafeAreaInsets()
	const bottomInset = initialWindowMetrics?.insets.bottom ?? liveInsets.bottom
	return (
		<ScrollView
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
		/>
	)
}
