import { router } from 'expo-router'
import { Button, Typography } from 'heroui-native'
import { EmptyState } from 'heroui-native-pro/empty-state'
import { Pressable, useWindowDimensions, View } from 'react-native'
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { StyledLucideIcon } from '@/components/styled-icon'

import { UscisNews } from './community.news'

const rise = (order: number) =>
	FadeInDown.duration(320)
		.delay(80 + order * 90)
		.reduceMotion(ReduceMotion.System)

/**
 * Empty Community screen: official USCIS news at the top (the Pro Widget
 * carries the visual weight), then a Pro `EmptyState` prompt centered in the
 * space below it, with the primary "Start a post" CTA in its content area.
 *
 * The whole thing is fixed-geometry (like `home.empty.tsx`) rather than a
 * ScrollView: an earlier version stacked the news card and a full-height
 * centered empty shell inside a scroll view, so the shell claimed its own
 * viewport of height and pushed the CTA under the nav bar. Explicit
 * header/tab-bar clearance keeps everything on one screen, iPhone SE included.
 */
export function CommunityEmpty() {
	const { height } = useWindowDimensions()
	// iPhone SE class — the news card drops to two items so the prompt and CTA
	// still rest comfortably above the tab bar.
	const compact = height < 750
	const insets = useSafeAreaInsets()

	return (
		<View
			className="flex-1 px-gutter"
			style={{ paddingTop: insets.top + 96, paddingBottom: insets.bottom + 12 }}
		>
			<Animated.View entering={rise(0)}>
				<UscisNews maxItems={compact ? 2 : 3} />
			</Animated.View>

			<Animated.View entering={rise(1)} className="grow items-center justify-center">
				<EmptyState>
					<EmptyState.Header>
						<EmptyState.Media variant="icon">
							<StyledLucideIcon name="messages-square" size={22} className="text-muted" />
						</EmptyState.Media>
						<EmptyState.Title className="font-display text-2xl">No posts yet</EmptyState.Title>
						<EmptyState.Description className="text-[15px] leading-snug">
							Be the first to ask a question or share your renewal experience.
						</EmptyState.Description>
					</EmptyState.Header>
					<EmptyState.Content className="w-full gap-control">
						<Button onPress={() => router.push('/new-post')}>
							<Button.Label>Start a post</Button.Label>
						</Button>
						<Pressable
							accessibilityRole="link"
							accessibilityLabel="Read the community rules"
							onPress={() => router.push('/community-rules')}
							className="self-center"
						>
							<Typography.Paragraph
								color="muted"
								className="text-center text-xs font-medium underline"
							>
								Community rules
							</Typography.Paragraph>
						</Pressable>
					</EmptyState.Content>
				</EmptyState>
			</Animated.View>
		</View>
	)
}
