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

type ResourcesHeroProps = {
	/** Width of the front link card in px; the composition scales around it. */
	width?: number
}

/**
 * Resources-tab intro graphic: an official-link card (landmark chip + text
 * bars) floating over a fanned sibling card, with an outbound-arrow badge —
 * "the official pages, one tap away". Sibling of `CaseTrackingHero` and
 * `AccountHero`: same idle-loop primitives on different periods, theme tokens
 * only, transform + opacity only, and a static resting pose under Reduce
 * Motion.
 */
export function ResourcesHero({ width = 150 }: ResourcesHeroProps) {
	const reduceMotion = useReducedMotion()
	const animated = !reduceMotion

	// 34 / 50 / 29 share no common factor pairwise, so the loops never visibly
	// re-sync.
	const float = useIdleLoop(3400, animated)
	const drift = useIdleLoop(5000, animated)
	const depart = useIdleLoop(2900, animated)

	const cardW = width
	const cardH = width * 0.6
	const badge = width * 0.3

	// The signature travel: the sibling card fans out from behind the front one
	// and tucks back. `CaseTrackingHero` earns its "this is animated" read from an
	// envelope crossing 40px of rail; a stack breathing 6px in place reads as a
	// static drawing however carefully it is drawn, which is exactly how this one
	// read next to it.
	const backStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateX: -cardW * 0.17 * drift.value },
			{ translateY: 5 * float.value },
			{ rotate: `${-7 - 6 * drift.value}deg` },
		],
	}))
	const frontStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: -7 * float.value }, { rotate: `${1.5 - 1.2 * drift.value}deg` }],
	}))
	// "One tap away": the outbound badge leaves along its own arrow's diagonal and
	// comes back, coupled to two loops so the path is an arc, not a line.
	const badgeStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateX: 13 * depart.value },
			{ translateY: -7 * float.value - 13 * depart.value },
		],
	}))
	const shadowStyle = useAnimatedStyle(() => ({
		transform: [{ scaleX: 1 - 0.16 * float.value }],
		opacity: 0.1 - 0.04 * float.value,
	}))

	return (
		<View
			accessible={false}
			importantForAccessibility="no-hide-descendants"
			// Wide enough that the fanned card's full travel stays inside the
			// composition's own box instead of overhanging it.
			style={{ width: cardW * 1.7, height: cardH * 1.8 }}
			className="items-center justify-center"
		>
			<View style={{ width: cardW, height: cardH }}>
				<Animated.View
					style={[
						{ position: 'absolute', bottom: -14, alignSelf: 'center', width: cardW * 0.62, height: 12, borderRadius: 999 },
						shadowStyle,
					]}
					className="bg-foreground"
				/>
				{/* The fanned sibling card behind — depth without detail. */}
				<Animated.View
					style={[
						{ position: 'absolute', width: cardW * 0.9, height: cardH * 0.9, left: -cardW * 0.16, top: -cardH * 0.18 },
						backStyle,
					]}
					className="rounded-2xl border border-separator bg-surface-secondary"
				/>
				<Animated.View
					style={[{ width: cardW, height: cardH }, frontStyle]}
					className="overflow-hidden rounded-2xl border border-border bg-surface"
				>
					<View className="flex-1 gap-control p-card">
						<View className="flex-row items-center gap-control">
							<View
								style={{ width: cardH * 0.3, height: cardH * 0.3, borderRadius: cardH * 0.15 }}
								className="items-center justify-center bg-surface-secondary"
							>
								<StyledLucideIcon name="landmark" size={cardH * 0.17} className="text-accent" />
							</View>
							{/* The one cobalt moment: the page title. */}
							<View className="h-2.5 flex-1 rounded-full bg-accent" style={{ maxWidth: cardW * 0.4 }} />
						</View>
						<View className="h-1.5 w-4/5 rounded-full bg-surface-tertiary" />
						<View className="h-1.5 w-3/5 rounded-full bg-surface-tertiary" />
					</View>
				</Animated.View>
				<Animated.View
					style={[
						{ position: 'absolute', top: -badge * 0.42, right: -badge * 0.36, width: badge, height: badge, borderRadius: badge / 2 },
						badgeStyle,
					]}
					className="items-center justify-center border border-border bg-surface"
				>
					<StyledLucideIcon name="arrow-up-right" size={badge * 0.44} className="text-accent" />
				</Animated.View>
			</View>
		</View>
	)
}
