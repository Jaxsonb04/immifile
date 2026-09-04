import { StyledLucideIcon } from '@/components/styled-icon'
import { router } from 'expo-router'
import { Typography } from 'heroui-native'
import { Pressable, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type ModalHeaderProps = {
	title: string
	/** Optional line under the title, e.g. a quota note or context. */
	subtitle?: string
	/** Defaults to router.back() — override for custom dismissal. */
	onClose?: () => void
}

/**
 * The one modal header (M7-T7): every sheet/modal route opens with the same
 * title row, correct top safe-area padding, and an always-visible close
 * affordance — a user never scrolls a popup to find the way out.
 */
export function ModalHeader({ title, subtitle, onClose }: ModalHeaderProps) {
	const insets = useSafeAreaInsets()
	return (
		<View
			className="flex-row items-center gap-control px-gutter pb-control"
			style={{ paddingTop: Math.max(insets.top, 16) }}
		>
			<View className="flex-1">
				<Typography.Heading className="text-xl">{title}</Typography.Heading>
				{subtitle ? (
					<Typography.Paragraph color="muted" className="text-sm">
						{subtitle}
					</Typography.Paragraph>
				) : null}
			</View>
			<Pressable
				accessibilityRole="button"
				accessibilityLabel="Close"
				onPress={
					onClose ??
					(() => {
						if (router.canGoBack()) router.back()
						else router.replace('/cases')
					})
				}
				className="size-9 items-center justify-center rounded-full bg-surface-secondary active:opacity-70"
				hitSlop={8}
			>
				<StyledLucideIcon name="x" size={18} className="text-foreground" />
			</Pressable>
		</View>
	)
}
