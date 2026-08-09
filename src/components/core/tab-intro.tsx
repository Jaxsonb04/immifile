import { resolveTabIntroVisibility } from '@/components/core/tab-intro-state'
import { StyledLucideIcon } from '@/components/styled-icon'
import { api } from '@convex/_generated/api'
import { useMutation, useQuery } from 'convex/react'
import { Button, Typography } from 'heroui-native'
import { useEffect, useState, type ComponentProps, type ReactNode } from 'react'
import { ScrollView, Text, useWindowDimensions, View } from 'react-native'
import Animated, {
	Easing,
	FadeInDown,
	ReduceMotion,
	useAnimatedStyle,
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

type PrefKey =
	| 'formsIntroDismissed'
	| 'casesIntroDismissed'
	| 'forumIntroDismissed'
	| 'accountIntroDismissed'
	| 'resourcesIntroDismissed'
	| 'assistantIntroDismissed'

/** Height of the transparent large-title header the intro sits below. */
const LARGE_TITLE_HEADER_HEIGHT = 96
/** Clearance for the floating iOS tab bar so the "Got it" button clears it — the
 * bar stays visible during the intro (hiding/covering it lagged the native tab
 * switch by a frame and glimpsed the tab first). Measured against the iOS 26
 * floating bar, which rises ~82pt above the screen bottom (~48pt of that past
 * the home-indicator inset added below), leaving ~24pt of air under the button. */
const TAB_BAR_CLEARANCE = 72

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
	/** The tab's real content. It remains available while the preference loads,
	 * then unmounts only when a confirmed first-run intro covers the surface. */
	children: ReactNode
}

// Title-only rows: with the tab bar visible during the intro, the page has less
// height, so the one-liner detail under each feature is dropped everywhere —
// the icon + title reads cleaner and keeps standard text sizes scroll-free.
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
 * Presentation: the live tab stays mounted while its preference resolves so a
 * slow or offline request cannot produce an empty screen. Once a first-run
 * preference resolves false, the intro becomes the tab's content as a plain flex
 * child and the live content unmounts. During dismissal the intro becomes an
 * absolute cover so its fade reveals the content mounting beneath it. The tab
 * bar stays visible throughout to avoid replaying its native selection animation.
 */
export function TabIntro({
	prefKey,
	hero,
	title,
	body,
	features,
	contentStartsBelowHeader = false,
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
	const [acknowledged, setAcknowledged] = useState(false)
	const [dismissing, setDismissing] = useState(false)

	// Keep the live tab mounted while Convex resolves the preference so a slow or
	// offline request can never leave the whole screen blank. If the preference
	// resolves false, the first-use intro still replaces it; during dismissal both
	// remain mounted so the fade reveals the live content beneath.
	const { showIntro, showContent } = resolveTabIntroVisibility({
		dismissed,
		dismissing,
		acknowledged,
	})

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

	// Unmount the intro only once the fade has fully played.
	useEffect(() => {
		if (!dismissing) return
		const timer = setTimeout(() => setAcknowledged(true), DISMISS_DURATION_MS)
		return () => clearTimeout(timer)
	}, [dismissing])

	function dismiss() {
		if (dismissing) return
		// Best-effort marker. During account deletion the server's write gate
		// rejects this mutation while the intro can briefly re-mount over the
		// purged tab — a failed write must not surface as an uncaught error.
		setPreference({ key: prefKey, value: true }).catch((error) => {
			if (__DEV__) console.warn('tab-intro: could not persist the seen marker', error)
		})
		setDismissing(true)
	}

	return (
		<View collapsable={false} className="flex-1 bg-background">
			{showContent ? children : null}
			{showIntro ? (
				<Animated.View
					// Taps fall through to the content beneath once the fade starts.
					pointerEvents={dismissing ? 'none' : 'auto'}
					// A flex child while shown (present from frame 1, can't drop during
					// the switch); an absolute cover during the dismiss fade so it reveals
					// the content mounting beneath.
					className={
						dismissing
							? 'absolute inset-0 bg-background px-section'
							: 'flex-1 bg-background px-section'
					}
					style={[
						overlayStyle,
						{
							paddingTop: contentStartsBelowHeader ? 0 : insets.top + LARGE_TITLE_HEADER_HEIGHT,
							paddingBottom: insets.bottom + TAB_BAR_CLEARANCE,
						},
					]}
				>
					<ScrollView
						className="flex-1"
						contentContainerStyle={{ flexGrow: 1 }}
						bounces={scrollForAccessibility}
						showsVerticalScrollIndicator={scrollForAccessibility}
					>
						<Animated.View
							entering={rise(0)}
							className="items-center"
							style={compact ? { transform: [{ scale: 0.72 }], marginVertical: -20 } : undefined}
						>
							{hero}
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
				</Animated.View>
			) : null}
		</View>
	)
}
