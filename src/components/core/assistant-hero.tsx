import { StyledLucideIcon } from '@/components/styled-icon'
import { useEffect } from 'react'
import { View } from 'react-native'
import Animated, {
	cancelAnimation,
	Easing,
	useAnimatedStyle,
	useReducedMotion,
	useSharedValue,
	withRepeat,
	withTiming,
} from 'react-native-reanimated'

/** Ping-pong a shared value 0→1 forever on its own slow period. */
function useIdleLoop(duration: number, enabled: boolean) {
	const value = useSharedValue(0)
	useEffect(() => {
		if (!enabled) return
		value.value = withRepeat(
			withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }),
			-1,
			true,
		)
		return () => cancelAnimation(value)
	}, [duration, enabled, value])
	return value
}

type AssistantHeroProps = {
	/** Width of the form card in px; the composition scales around it. */
	width?: number
}

/**
 * Assistant-tab intro graphic: an open question drifting above the one form it
 * resolves to. The question chip has no ground shadow and no accent — it
 * wanders and its line breathes, still unanswered. The card below sits on the
 * house ground shadow, carries the single terracotta line (the form's name),
 * and only rises and settles. That contrast is the whole idea: a question in
 * your own words becomes one clear direction. Nothing lands, completes, or is
 * marked — the assistant names a form, never an outcome.
 *
 * Sibling of `CaseTrackingHero`, `AccountHero` and `ResourcesHero`: the same
 * idle-loop primitives on different periods, theme tokens only, transform +
 * opacity only, and a static resting pose under Reduce Motion.
 *
 * Accent budget is deliberately one step tighter than `AccountHero` and
 * `ResourcesHero` (which each spend three terracottas): exactly one accent BAR
 * and one accent BADGE GLYPH. The `file-text` well stays `text-muted` so the
 * intro's accent-filled "Got it" button remains the loudest terracotta on the
 * screen.
 */
export function AssistantHero({ width = 140 }: AssistantHeroProps) {
	const reduceMotion = useReducedMotion()
	const animated = !reduceMotion

	// Three loops on deliberately different periods → organic, non-synced idle.
	// 35 / 51 / 29 are pairwise coprime, so the pair never visibly re-syncs.
	const float = useIdleLoop(3500, animated)
	const drift = useIdleLoop(5100, animated)
	const pulse = useIdleLoop(2900, animated)

	const cardW = width
	const cardH = width * 0.7
	const askW = width * 0.62
	const badge = width * 0.3
	const well = cardH * 0.32

	// The answer: grounded and steady — vertical breathing only.
	const cardStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: -6 * float.value }, { rotate: `${1.5 - 1.2 * drift.value}deg` }],
	}))
	// The question: unmoored — lateral wander and a wider tilt that runs against
	// the card's on the same `drift`, so the pair never looks mechanically linked.
	const askStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateY: -4 * pulse.value },
			{ translateX: 4 * drift.value },
			{ rotate: `${-2.5 + 2 * drift.value}deg` },
		],
	}))
	// Still open: the one opacity beat in the piece, and it never nears zero.
	const askBarStyle = useAnimatedStyle(() => ({
		opacity: 0.55 + 0.35 * pulse.value,
	}))
	// The badge overshoots its card, coupled to two loops (house idiom).
	const badgeStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: -8 * float.value - 3 * drift.value }],
	}))
	// Ground shadow sells the float; hairline-border system, so it stays faint.
	const shadowStyle = useAnimatedStyle(() => ({
		transform: [{ scaleX: 1 - 0.12 * float.value }],
		opacity: 0.1 - 0.03 * float.value,
	}))

	return (
		<View
			accessible={false}
			importantForAccessibility="no-hide-descendants"
			style={{ width: cardW * 1.55, height: cardH * 2 }}
			className="items-center justify-center"
		>
			<View style={{ width: cardW, height: cardH }}>
				<Animated.View
					style={[
						{
							position: 'absolute',
							bottom: -12,
							alignSelf: 'center',
							width: cardW * 0.62,
							height: 12,
							borderRadius: 999,
						},
						shadowStyle,
					]}
					className="bg-foreground"
				/>

				{/* The question, still in the air: no tail, no shadow, no accent. */}
				<Animated.View
					style={[
						{ position: 'absolute', top: -cardH * 0.42, left: -cardW * 0.2, width: askW },
						askStyle,
					]}
					className="flex-row items-center gap-tight rounded-2xl border border-border bg-surface-secondary px-control py-tight"
				>
					<StyledLucideIcon name="circle-help" size={13} className="text-muted" />
					<Animated.View
						style={askBarStyle}
						className="h-1.5 flex-1 rounded-full bg-surface-tertiary"
					/>
				</Animated.View>

				{/* The direction: one form, named. */}
				<Animated.View
					style={[{ width: cardW, height: cardH }, cardStyle]}
					className="overflow-hidden rounded-2xl border border-border bg-surface"
				>
					<View className="flex-1 justify-center gap-control p-card">
						<View className="flex-row items-center gap-control">
							<View
								style={{ width: well, height: well, borderRadius: well / 2 }}
								className="items-center justify-center bg-surface-secondary"
							>
								<StyledLucideIcon name="file-text" size={well * 0.54} className="text-muted" />
							</View>
							{/* The one terracotta moment: the form you actually need, named. */}
							<View
								className="h-2.5 flex-1 rounded-full bg-accent"
								style={{ maxWidth: cardW * 0.42 }}
							/>
						</View>
						<View className="h-1.5 w-1/2 rounded-full bg-surface-tertiary" />
					</View>
				</Animated.View>

				{/* The assistant's own mark, pinned to what it pointed you to. */}
				<Animated.View
					style={[
						{
							position: 'absolute',
							top: -badge * 0.4,
							right: -badge * 0.34,
							width: badge,
							height: badge,
							borderRadius: badge / 2,
						},
						badgeStyle,
					]}
					className="items-center justify-center border border-border bg-surface"
				>
					<StyledLucideIcon name="sparkles" size={badge * 0.46} className="text-accent" />
				</Animated.View>
			</View>
		</View>
	)
}
