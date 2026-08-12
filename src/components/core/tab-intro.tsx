import {
	resolveTabIntroVisibility,
	retainObservedTabIntroDismissal,
} from '@/components/core/tab-intro-state'
import { TabIntroTransitionContext } from '@/components/core/tab-intro-transition'
import { StyledLucideIcon } from '@/components/styled-icon'
import { TabBarContext } from '@/hooks/use-tab-bar'
import { api } from '@convex/_generated/api'
import { useMutation, useQuery } from 'convex/react'
import { useFocusEffect } from 'expo-router'
import { Button, Spinner, Typography } from 'heroui-native'
import { use, useCallback, useEffect, useState, type ComponentProps, type ReactNode } from 'react'
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

// Staggered rise for the intro content. Welcome deliberately no longer uses
// this — it owns a bespoke recording entrance (sheet-of-record-hero.tsx), and
// a signature that plays on five screens is not a signature. Tab intros keep
// the stagger on purpose: their content IS the payload, and staggering aids
// reading order through real text.
const rise = (order: number) =>
	FadeInDown.duration(320)
		.delay(80 + order * 90)
		.reduceMotion(ReduceMotion.System)

// Calm dismissal: the overlay eases its own opacity to 0 (with a slight scale)
// to reveal the live tab beneath — an unhurried, animated exit, not a blink.
const DISMISS_DURATION_MS = 340
const DISMISS_EASING = Easing.out(Easing.cubic)
const LARGE_TITLE_HEADER_HEIGHT = 96

type PrefKey =
	| 'formsIntroDismissed'
	| 'casesIntroDismissed'
	| 'forumIntroDismissed'
	| 'accountIntroDismissed'
	| 'resourcesIntroDismissed'
	| 'assistantIntroDismissed'

/** Air beneath the acknowledgement after the hidden tab bar's safe-area inset. */
const INTRO_BOTTOM_CLEARANCE = 12

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
	 * buttons receive the same hidden state as the native tab bar. */
	renderToolbar?: (hidden: boolean) => ReactNode
	/** The tab's real content. It stays mounted behind the opaque cover so its
	 * data is ready before the intro leaves, but cannot receive touch or
	 * accessibility focus until the cover is gone. */
	children: ReactNode
}

// Title-only rows keep the teaching surface calm and let the hidden tab bar's
// reclaimed height become breathing room instead of adding more copy.
function FeatureRow({ icon, title }: TabIntroFeature) {
	return (
		<View className="flex-row items-center gap-card">
			<View className="size-10 items-center justify-center rounded-2xl bg-surface-secondary">
				<StyledLucideIcon name={icon} size={18} className="text-muted" />
			</View>
			<Typography.Paragraph className="flex-1 font-medium text-foreground">
				{title}
			</Typography.Paragraph>
		</View>
	)
}

/**
 * One-time tab intro (M7-T5): a full-surface intro that teaches what the tab
 * offers, ending in a single "Got it". Dismissal is persisted per owner
 * (convex/preferences.ts) — it survives reinstalls, carries over when an
 * anonymous session converts, and is erased by the deletion cascade.
 *
 * Presentation: the live tab stays mounted from the first frame so its queries
 * can warm while a fully opaque cover owns the visible surface. The cover is a
 * neutral background while the preference resolves, becomes the first-run intro
 * for a confirmed `false`, and remains touch/accessibility-modal through its
 * dismissal fade. Native tab and header actions stay hidden until "Got it";
 * after that tap, they settle behind the still-opaque cover before it fades.
 */
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
	const setPreference = useMutation(api.preferences.setPreference)
	const [hasObservedDismissal, setHasObservedDismissal] = useState(dismissed === true)
	const [acknowledged, setAcknowledged] = useState(false)
	const [preparing, setPreparing] = useState(false)
	const [dismissing, setDismissing] = useState(false)
	const { isTabBarHidden, setIsTabBarHidden } = use(TabBarContext)
	const reduceMotion = useReducedMotion()
	const observedDismissal = retainObservedTabIntroDismissal(hasObservedDismissal, dismissed)
	if (observedDismissal !== hasObservedDismissal) {
		setHasObservedDismissal(observedDismissal)
	}
	const effectiveDismissed = observedDismissal ? true : dismissed

	const { showCover, showIntro, contentMounted, contentAccessible, chromeHidden } =
		resolveTabIntroVisibility({
			dismissed: effectiveDismissed,
			preparing,
			dismissing,
			acknowledged,
		})

	// Native tabs eagerly mount their screens, so only the focused intro may own
	// global tab-bar visibility. Starting the layout hidden also protects the very
	// first authenticated frame before this focus callback commits.
	useFocusEffect(
		useCallback(() => {
			setIsTabBarHidden(chromeHidden)
			return () => setIsTabBarHidden(false)
		}, [chromeHidden, setIsTabBarHidden]),
	)

	// Only the dismiss transition animates; while shown the intro is fully opaque
	// and static. Declarative tween, not an imperative shared-value write (the
	// React Compiler rejects `opacity.value =`).
	const overlayStyle = useAnimatedStyle(() => {
		if (!dismissing) return { opacity: 1, transform: [{ scale: 1 }] }
		const out = {
			duration: DISMISS_DURATION_MS,
			easing: DISMISS_EASING,
			reduceMotion: ReduceMotion.System,
		}
		return { opacity: withTiming(0, out), transform: [{ scale: withTiming(1.03, out) }] }
	})

	// Reveal the native chrome while the cover is still fully opaque. Preserve
	// the already-mounted live subtree so UIKit keeps its automatic large-title
	// inset. Once the parent NativeTabs commit reports visible, two frames let
	// native layout settle (and any root ScrollView correction run); the cover
	// starts fading on the following frame.
	useEffect(() => {
		if (!preparing || isTabBarHidden) return
		let settleFrame: number | undefined
		let fadeFrame: number | undefined
		const layoutFrame = requestAnimationFrame(() => {
			settleFrame = requestAnimationFrame(() => {
				fadeFrame = requestAnimationFrame(() => {
					setPreparing(false)
					setDismissing(true)
				})
			})
		})
		return () => {
			cancelAnimationFrame(layoutFrame)
			if (settleFrame !== undefined) cancelAnimationFrame(settleFrame)
			if (fadeFrame !== undefined) cancelAnimationFrame(fadeFrame)
		}
	}, [isTabBarHidden, preparing])

	// Unmount the intro only once the fade has fully played.
	useEffect(() => {
		if (!dismissing) return
		const timer = setTimeout(() => setAcknowledged(true), reduceMotion ? 0 : DISMISS_DURATION_MS)
		return () => clearTimeout(timer)
	}, [dismissing, reduceMotion])

	function dismiss() {
		if (preparing || dismissing) return
		// Best-effort marker. During account deletion the server's write gate can
		// reject a late mutation; a failed write must not surface as an uncaught
		// error. The observed-dismissal latch above prevents a teardown flash.
		setPreference({ key: prefKey, value: true }).catch((error) => {
			if (__DEV__) console.warn('tab-intro: could not persist the seen marker', error)
		})
		setPreparing(true)
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
				className={compact ? 'gap-tight pt-tight' : 'gap-section pt-9'}
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
		<TabIntroTransitionContext value={contentAccessible}>
			{renderToolbar?.(chromeHidden)}
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
						accessibilityViewIsModal
						className="absolute inset-0 bg-background px-section"
						style={[
							overlayStyle,
							{
								paddingTop: contentStartsBelowHeader ? 0 : insets.top + LARGE_TITLE_HEADER_HEIGHT,
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
									<Button onPress={dismiss}>
										<Button.Label maxFontSizeMultiplier={1.5}>Got it</Button.Label>
									</Button>
								</Animated.View>
							</>
						) : (
							<View className="flex-1 items-center justify-center">
								<Spinner accessibilityLabel="Loading page introduction" />
							</View>
						)}
					</Animated.View>
				) : null}
			</View>
		</TabIntroTransitionContext>
	)
}
