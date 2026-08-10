import { cn } from 'heroui-native'
import { ScrollView, type ScrollViewProps } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const BodyScrollView = ({ contentContainerClassName, ...props }: ScrollViewProps) => {
	const insets = useSafeAreaInsets()
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
			contentContainerStyle={{
				paddingBottom: insets.bottom + 32,
			}}
			{...props}
		/>
	)
}
