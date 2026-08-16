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

type CommunityHeroProps = {
	/** Width of the widest bubble in px; the composition scales around it. */
	width?: number
}

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

/**
 * Community-tab empty-state graphic (M6-T8): two pseudonymous voices in a calm
 * exchange — paired avatars and drifting chat bubbles. Sibling of
 * `FilingStackHero`: the same idle-loop primitives on different periods, theme
 * tokens only, transform + opacity only, static under Reduce Motion.
 */
export function CommunityHero({ width = 190 }: CommunityHeroProps) {
	const reduceMotion = useReducedMotion()
	const animated = !reduceMotion

	const floatA = useIdleLoop(3000, animated)
	const floatB = useIdleLoop(4400, animated)
	const sway = useIdleLoop(3800, animated)

	const bubbleW = width
	const stackW = width * 1.45
	const stackH = width * 0.95

	const leftBubble = useAnimatedStyle(() => ({
		transform: [{ translateY: -5 * floatA.value }, { rotate: `${-1.5 + 1.2 * sway.value}deg` }],
	}))
	const rightBubble = useAnimatedStyle(() => ({
		transform: [{ translateY: 5 * floatB.value - 2 }, { rotate: `${1.5 - 1.2 * sway.value}deg` }],
	}))
	const dotsStyle = useAnimatedStyle(() => ({
		opacity: 0.4 + 0.5 * floatA.value,
	}))

	return (
		<View
			accessible={false}
			importantForAccessibility="no-hide-descendants"
			style={{ width: stackW, height: stackH }}
			className="items-center justify-center"
		>
			{/* A question, asked. */}
			<Animated.View style={[{ width: bubbleW, alignSelf: 'flex-start' }, leftBubble]}>
				<View className="flex-row items-end gap-tight">
					<View className="size-8 items-center justify-center rounded-full border border-border bg-surface-secondary">
						<StyledLucideIcon name="user" size={14} className="text-muted" />
					</View>
					<View className="flex-1 gap-tight rounded-2xl rounded-bl-sm border border-border bg-surface p-card">
						<View className="h-1.5 w-4/5 rounded-full bg-surface-tertiary" />
						<View className="h-1.5 w-3/5 rounded-full bg-surface-tertiary" />
					</View>
				</View>
			</Animated.View>

			{/* An answer arriving — the one cobalt moment. */}
			<Animated.View
				style={[{ width: bubbleW * 0.86, alignSelf: 'flex-end', marginTop: 18 }, rightBubble]}
			>
				<View className="flex-row items-end gap-tight">
					<View className="flex-1 gap-tight rounded-2xl rounded-br-sm border border-border bg-surface p-card">
						<View className="h-1.5 w-11/12 rounded-full bg-surface-tertiary" />
						<Animated.View style={dotsStyle} className="flex-row gap-hairline">
							<View className="size-1.5 rounded-full bg-accent" />
							<View className="size-1.5 rounded-full bg-accent opacity-70" />
							<View className="size-1.5 rounded-full bg-accent opacity-40" />
						</Animated.View>
					</View>
					<View className="size-8 items-center justify-center rounded-full border border-border bg-surface-secondary">
						<StyledLucideIcon name="user" size={14} className="text-muted" />
					</View>
				</View>
			</Animated.View>
		</View>
	)
}
