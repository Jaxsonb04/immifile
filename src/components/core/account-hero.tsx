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

type AccountHeroProps = {
	/** Base scale in px; the ID card is 1.5× this wide. */
	size?: number
}

/**
 * Identity hero for the Account intro (M7-T5, redrawn for the App Store
 * release): a floating ID card — avatar, name lines, a separator — with a
 * shield badge pinned to its corner. A direct sibling of `CaseTrackingHero`'s
 * receipt card: same idle-loop primitives, theme tokens only, transform +
 * opacity only, and a static resting pose under Reduce Motion.
 */
export function AccountHero({ size = 120 }: AccountHeroProps) {
	const reduceMotion = useReducedMotion()
	const animated = !reduceMotion

	// 32 / 47 / 29 share no common factor pairwise. The old 3200/4800 pair was a
	// clean 2:3 that re-synced every 9.6s, which reads as one mechanism ticking.
	const float = useIdleLoop(3200, animated)
	const drift = useIdleLoop(4700, animated)
	const orbit = useIdleLoop(2900, animated)

	const cardW = size * 1.5
	const cardH = cardW * 0.62
	const badge = size * 0.4

	// The card lifts and tilts far enough to be read as motion rather than as a
	// drawing. At the old 6px / 1.2deg the whole piece looked static beside
	// `CaseTrackingHero`, whose envelope crosses 40px of rail.
	const cardStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: -13 * float.value }, { rotate: `${-1.5 + 4 * drift.value}deg` }],
	}))
	// The signature travel: the shield keeps its own slow arc out from the corner
	// it guards — X on `orbit` alone, Y on `orbit` plus `float`, so the path curves
	// instead of sliding along a line.
	const badgeStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateX: 14 * orbit.value },
			{ translateY: -14 * float.value - 6 * orbit.value },
		],
	}))
	const shadowStyle = useAnimatedStyle(() => ({
		transform: [{ scaleX: 1 - 0.2 * float.value }],
		opacity: 0.1 - 0.045 * float.value,
	}))

	return (
		<View
			accessible={false}
			importantForAccessibility="no-hide-descendants"
			// Wide enough that the shield's full arc stays inside the composition's
			// own box instead of overhanging it.
			style={{ width: cardW * 1.45, height: cardH * 1.5 }}
			className="items-center justify-center"
		>
			<View style={{ width: cardW, height: cardH }}>
				<Animated.View
					style={[
						{ position: 'absolute', bottom: -12, alignSelf: 'center', width: cardW * 0.62, height: 12, borderRadius: 999 },
						shadowStyle,
					]}
					className="bg-foreground"
				/>
				<Animated.View
					style={[{ width: cardW, height: cardH }, cardStyle]}
					className="overflow-hidden rounded-2xl border border-border bg-surface"
				>
					<View className="flex-1 flex-row items-center gap-card p-card">
						<View
							style={{ width: cardH * 0.42, height: cardH * 0.42, borderRadius: cardH * 0.21 }}
							className="items-center justify-center bg-surface-secondary"
						>
							<StyledLucideIcon name="user-round" size={cardH * 0.22} className="text-accent" />
						</View>
						<View className="flex-1 gap-control">
							{/* The one cobalt moment: the name line. */}
							<View className="h-2.5 w-3/5 rounded-full bg-accent" />
							<View className="h-1.5 w-4/5 rounded-full bg-surface-tertiary" />
							<View className="h-1.5 w-1/2 rounded-full bg-surface-tertiary" />
						</View>
					</View>
				</Animated.View>
				<Animated.View
					style={[
						{ position: 'absolute', top: -badge * 0.4, right: -badge * 0.34, width: badge, height: badge, borderRadius: badge / 2 },
						badgeStyle,
					]}
					className="items-center justify-center border border-border bg-surface"
				>
					<StyledLucideIcon name="shield-check" size={badge * 0.46} className="text-accent" />
				</Animated.View>
			</View>
		</View>
	)
}
