import {
	resolveTabIntroVisibility,
	retainObservedTabIntroDismissal,
} from '@/components/core/tab-intro-state'
import { StyledLucideIcon } from '@/components/styled-icon'
import { SLOW_LOAD_RETRY_MESSAGE, resolveSlowLoadState } from '@/hooks/slow-load-state'
import { useSlowLoad } from '@/hooks/use-slow-load'
import { api } from '@convex/_generated/api'
import { useMutation, useQuery } from 'convex/react'
import { Button, Spinner, Typography } from 'heroui-native'
import { useEffect, useState, type ComponentProps, type ReactNode } from 'react'
import { ScrollView, Text, useWindowDimensions, View } from 'react-native'
import Animated, {
	Easing,
	FadeInDown,
	ReduceMotion,
	useAnimatedStyle,
	useReducedMotion,
	withTiming,
} from 'react-native-reanimated'
import { initialWindowMetrics, useSafeAreaInsets } from 'react-native-safe-area-context'

const rise = (order: number) =>
	FadeInDown.duration(320)
		.delay(80 + order * 90)
		.reduceMotion(ReduceMotion.System)

// Fade the cover without changing native navigation or content geometry.
const DISMISS_DURATION_MS = 240
const DISMISS_EASING = Easing.out(Easing.cubic)
const LARGE_TITLE_HEADER_HEIGHT = 96

type PrefKey =
	| 'formsIntroDismissed'
	| 'casesIntroDismissed'
	| 'forumIntroDismissed'
	| 'accountIntroDismissed'
	| 'resourcesIntroDismissed'
	| 'assistantIntroDismissed'

/** The acknowledgement remains above native tab chrome. */
const INTRO_BOTTOM_CLEARANCE = 76

export type TabIntroFeature = {
	icon: ComponentProps<typeof StyledLucideIcon>['name']
	title: string
	detail: string
}

type TabIntroProps = {
	prefKey: PrefKey
	hero: ReactNode
	title: string
	body: string
	features: TabIntroFeature[]
	/** Set when the native stack header is opaque and already places this
	 * surface below its large-title chrome. */
	contentStartsBelowHeader?: boolean
	/** Native header actions for this tab. The callback stays mounted while its
	 * buttons remain hidden until the content can be used. */
	renderToolbar?: (hidden: boolean) => ReactNode
	/** The tab's real content. It stays mounted behind the opaque cover so its
	 * data is ready before the intro leaves, but cannot receive touch or
	 * accessibility focus until the cover is gone. */
	children: ReactNode
}

function FeatureRow({ icon, title }: TabIntroFeature) {
	return (
		<View className="flex-row items-center gap-card">
			<View className="size-9 items-center justify-center rounded-xl bg-accent/10">
				<StyledLucideIcon name={icon} size={18} className="text-accent" />
			</View>
			<Typography.Paragraph className="flex-1 font-medium text-foreground">
				{title}
			</Typography.Paragraph>
		</View>
	)
}

/** Persisted, per-owner teaching overlay. Content stays mounted and inaccessible
 * behind it, while native headers and tabs retain their final geometry. */
export function TabIntro({
	prefKey,
	hero,
	title,
	body,
	features,
	contentStartsBelowHeader = false,
	renderToolbar,
	children,
}: TabIntroProps) {
	const liveInsets = useSafeAreaInsets()
	// The per-tab SafeAreaProvider NativeTabs wraps every screen in reports
	// UNSTABLE insets on a tab's first paint (0/0, then device, then tab-bar-
	// inclusive), which made the intro's padding jump on entry (Expo #42486 /
	// react-native-screens #3573). The launch-time device insets are stable.
	const insets = initialWindowMetrics?.insets ?? liveInsets
	const { height, fontScale } = useWindowDimensions()
	// iPhone SE class — standard text sizes compress into one screen.
	const compact = height < 750
	// The teaching content scrolls whenever it outgrows the frame; the button
	// below it never does. Bounce and the indicator stay off until Dynamic Type
	// makes overflow the norm, so the common one-screen case still feels static.
	const scrollForAccessibility = fontScale > 1.2
	const dismissed = useQuery(api.preferences.getPreference, { key: prefKey })
	const preferenceLoadState = resolveSlowLoadState(
		dismissed === undefined,
		useSlowLoad(dismissed === undefined),
	)
	const setPreference = useMutation(api.preferences.setPreference)
	const [hasObservedDismissal, setHasObservedDismissal] = useState(dismissed === true)
	const [acknowledged, setAcknowledged] = useState(false)
	const [dismissing, setDismissing] = useState(false)
	const reduceMotion = useReducedMotion()
	const observedDismissal = retainObservedTabIntroDismissal(hasObservedDismissal, dismissed)
	if (observedDismissal !== hasObservedDismissal) {
		setHasObservedDismissal(observedDismissal)
	}
	const effectiveDismissed = observedDismissal ? true : dismissed

	const { showCover, showIntro, contentMounted, contentAccessible, toolbarHidden } =
		resolveTabIntroVisibility({
			dismissed: effectiveDismissed,
			dismissing,
			acknowledged,
		})

	// Only the dismiss transition animates; while shown the intro is fully opaque
	// and static. Declarative tween, not an imperative shared-value write (the
	// React Compiler rejects `opacity.value =`).
	const overlayStyle = useAnimatedStyle(() => {
		if (!dismissing) return { opacity: 1 }
		const out = {
			duration: DISMISS_DURATION_MS,
			easing: DISMISS_EASING,
			reduceMotion: ReduceMotion.System,
		}
		return { opacity: withTiming(0, out) }
	})

	// Unmount the intro only once the fade has fully played.
	useEffect(() => {
		if (!dismissing) return
		const timer = setTimeout(() => setAcknowledged(true), reduceMotion ? 0 : DISMISS_DURATION_MS)
		return () => clearTimeout(timer)
	}, [dismissing, reduceMotion])

	function dismiss() {
		if (dismissing) return
		// Best-effort marker. During account deletion the server's write gate can
		// reject a late mutation; a failed write must not surface as an uncaught
		// error. The observed-dismissal latch above prevents a teardown flash.
		setPreference({ key: prefKey, value: true }).catch((error) => {
			if (__DEV__) console.warn('tab-intro: could not persist the seen marker', error)
		})
		setDismissing(true)
	}

	const teachingContent = (
		<>
			<Animated.View entering={rise(0)} className="items-center">
				{compact ? (
					// Keep the static compact-device scale off the layout-animated
					// component. Reanimated otherwise warns that its entrance transform
					// will overwrite this transform and LogBox covers the acknowledgement.
					<View style={{ transform: [{ scale: 0.72 }], marginVertical: -20 }}>{hero}</View>
				) : (
					hero
				)}
			</Animated.View>

			<Animated.View entering={rise(1)} className="items-center gap-tight pt-tight">
				<Text
					className={`text-center font-display text-foreground ${compact ? 'text-2xl leading-8' : 'text-[28px] leading-9'}`}
				>
					{title}
				</Text>
				<Typography.Paragraph
					color="muted"
					className="max-w-[320px] text-center text-[15px] leading-snug"
				>
					{body}
				</Typography.Paragraph>
			</Animated.View>

			<Animated.View
				entering={rise(2)}
				className={compact ? 'gap-tight pt-card' : 'gap-card pt-section'}
			>
				{features.map((feature) => (
					<FeatureRow key={feature.title} {...feature} />
				))}
			</Animated.View>

			{/* min-h keeps real air between the last feature row and the button
			    even when the content runs tall. */}
			<View className={compact ? 'min-h-2 grow' : 'min-h-6 grow'} />
		</>
	)
	return (
		<>
			{renderToolbar?.(toolbarHidden)}
			<View collapsable={false} className="flex-1 bg-background">
				<View
					className="flex-1"
					pointerEvents={contentAccessible ? 'auto' : 'none'}
					accessibilityElementsHidden={!contentAccessible}
					importantForAccessibility={contentAccessible ? 'auto' : 'no-hide-descendants'}
				>
					{contentMounted ? children : null}
				</View>
				{showCover ? (
					<Animated.View
						// The cover continues intercepting touches through the fade; mounted
						// content underneath is data-ready but never accidentally actionable.
						pointerEvents="auto"
						className="absolute inset-0 bg-background px-section"
						style={[
							overlayStyle,
							{
								paddingTop: contentStartsBelowHeader
									? 20
									: insets.top + LARGE_TITLE_HEADER_HEIGHT + 12,
								paddingBottom: insets.bottom + INTRO_BOTTOM_CLEARANCE,
							},
						]}
					>
						{showIntro ? (
							<>
								<ScrollView
									className="flex-1"
									contentContainerStyle={{ flexGrow: 1 }}
									bounces={scrollForAccessibility}
									showsVerticalScrollIndicator={scrollForAccessibility}
								>
									{teachingContent}
								</ScrollView>

								{/* The acknowledgement lives OUTSIDE the ScrollView. Inside it, a
					    frame too short for the content sheared the button's bottom edge
					    off instead of scrolling; as a sibling it is laid out before the
					    scroll area gets the remaining height, so it is always whole and
					    always tappable. */}
								<Animated.View entering={rise(3)} className="pt-card">
									<Button isDisabled={dismissing} onPress={dismiss}>
										<Button.Label maxFontSizeMultiplier={1.5}>Got it</Button.Label>
									</Button>
								</Animated.View>
							</>
						) : (
							<View className="flex-1 items-center justify-center">
								<Spinner accessibilityLabel="Loading page introduction" />
								{preferenceLoadState === 'stalled' ? (
									<Typography.Paragraph color="muted" className="mt-control text-center text-sm">
										{SLOW_LOAD_RETRY_MESSAGE}
									</Typography.Paragraph>
								) : null}
							</View>
						)}
					</Animated.View>
				) : null}
			</View>
		</>
	)
}
