import { StyledLucideIcon } from '@/components/styled-icon'
import { Stack, useRouter } from 'expo-router'
import { Button, Surface, Typography, useThemeColor } from 'heroui-native'
import type { ComponentProps } from 'react'
import { ScrollView, useWindowDimensions, View } from 'react-native'
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ASSISTANT_CONSENT_COPY } from './assistant-consent-copy'

type ConsentDetailProps = {
	icon: ComponentProps<typeof StyledLucideIcon>['name']
	title: string
	body: string
}

function ConsentDetail({ icon, title, body }: ConsentDetailProps) {
	return (
		<View className="flex-row items-start gap-control">
			<View className="size-10 items-center justify-center rounded-2xl bg-surface-tertiary">
				<StyledLucideIcon name={icon} size={18} className="text-accent" />
			</View>
			<View className="flex-1 gap-hairline">
				<Typography.Paragraph className="font-semibold text-foreground">
					{title}
				</Typography.Paragraph>
				<Typography.Paragraph color="muted" className="text-sm leading-relaxed">
					{body}
				</Typography.Paragraph>
			</View>
		</View>
	)
}

export function AssistantConsent({
	isSaving,
	onAccept,
}: {
	isSaving: boolean
	onAccept: () => void
}) {
	const insets = useSafeAreaInsets()
	const { height, fontScale } = useWindowDimensions()
	const router = useRouter()
	const backgroundColor = useThemeColor('background')
	const compact = height < 750
	// Standard text is deliberately a single, non-scrolling decision surface.
	// Large Dynamic Type keeps a real scroll path instead of clipping disclosure
	// or actions for people who rely on accessibility text sizes.
	const scrollForAccessibility = fontScale > 1.2

	return (
		<View className="flex-1 bg-background">
			<Stack.Title>Assistant</Stack.Title>
			<Stack.Screen
				options={{
					title: 'Assistant',
					headerLargeTitle: false,
					headerTransparent: false,
					headerShadowVisible: false,
					headerStyle: { backgroundColor },
				}}
			/>
			<ScrollView
				className="flex-1"
				contentInsetAdjustmentBehavior="automatic"
				scrollEnabled={scrollForAccessibility}
				bounces={scrollForAccessibility}
				showsVerticalScrollIndicator={scrollForAccessibility}
				contentContainerClassName={`grow px-gutter ${compact ? 'gap-card pt-card' : 'gap-section pt-section'}`}
				contentContainerStyle={{ paddingBottom: insets.bottom + (compact ? 60 : 72) }}
			>
				<Animated.View
					entering={FadeIn.duration(260).reduceMotion(ReduceMotion.System)}
					className="items-center gap-tight"
				>
					<Typography.Heading className="text-center font-display text-title text-foreground">
						{ASSISTANT_CONSENT_COPY.title}
					</Typography.Heading>
					<Typography.Paragraph
						color="muted"
						className="max-w-[330px] text-center text-[15px] leading-snug"
					>
						{ASSISTANT_CONSENT_COPY.summary}
					</Typography.Paragraph>
				</Animated.View>

				<Animated.View entering={FadeIn.delay(70).duration(260).reduceMotion(ReduceMotion.System)}>
					<Surface
						variant="secondary"
						className={`rounded-3xl border border-border p-card ${compact ? 'gap-control' : 'gap-section'}`}
					>
						<ConsentDetail
							icon="smartphone"
							title={ASSISTANT_CONSENT_COPY.storageTitle}
							body={ASSISTANT_CONSENT_COPY.storageBody}
						/>
						<ConsentDetail
							icon="shield-alert"
							title={ASSISTANT_CONSENT_COPY.privacyTitle}
							body={ASSISTANT_CONSENT_COPY.privacyBody}
						/>
					</Surface>
				</Animated.View>

				<View className="min-h-tight grow" />

				<Typography.Paragraph color="muted" className="text-center text-xs leading-relaxed">
					{ASSISTANT_CONSENT_COPY.withdrawal}
				</Typography.Paragraph>

				<Animated.View
					entering={FadeIn.delay(140).duration(260).reduceMotion(ReduceMotion.System)}
					className="gap-tight"
				>
					<Button isDisabled={isSaving} onPress={onAccept}>
						<Button.Label maxFontSizeMultiplier={1.5}>
							{isSaving ? 'Saving choice…' : ASSISTANT_CONSENT_COPY.accept}
						</Button.Label>
					</Button>
					<Button variant="ghost" isDisabled={isSaving} onPress={() => router.navigate('/cases')}>
						<Button.Label maxFontSizeMultiplier={1.5}>
							{ASSISTANT_CONSENT_COPY.decline}
						</Button.Label>
					</Button>
				</Animated.View>
			</ScrollView>
		</View>
	)
}
