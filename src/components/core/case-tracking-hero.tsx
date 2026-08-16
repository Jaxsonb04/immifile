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

type CaseTrackingHeroProps = {
	/** Width of the receipt card in px; the composition scales around it. */
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
 * Cases-tab empty-state graphic (M6-T8): a USCIS receipt notice drifting above
 * a three-stop status timeline, sibling of `FilingStackHero` — same idle-loop
 * primitives on different periods, theme tokens only, transform + opacity
 * only, and a static resting pose under Reduce Motion. The envelope glides
 * gently between the first two timeline stops: tracking, in motion, calm.
 */
export function CaseTrackingHero({ width = 148 }: CaseTrackingHeroProps) {
	const reduceMotion = useReducedMotion()
	const animated = !reduceMotion

	const float = useIdleLoop(3200, animated)
	const glide = useIdleLoop(5200, animated)
	const pulse = useIdleLoop(2600, animated)

	const cardW = width
	const cardH = width * 0.72
	const stackW = width * 1.7
	const railW = cardW * 1.3

	const cardStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: -6 * float.value }, { rotate: `${-2 + 1.5 * glide.value}deg` }],
	}))

	const envelopeStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: railW * 0.3 * glide.value }, { translateY: -2 * pulse.value }],
	}))

	const middleDotStyle = useAnimatedStyle(() => ({
		opacity: 0.35 + 0.4 * pulse.value,
	}))

	const shadowStyle = useAnimatedStyle(() => ({
		transform: [{ scaleX: 1 - 0.12 * float.value }],
		opacity: 0.1 - 0.03 * float.value,
	}))

	return (
		<View
			accessible={false}
			importantForAccessibility="no-hide-descendants"
			style={{ width: stackW, height: cardH * 2 }}
			className="items-center justify-center gap-gutter"
		>
			{/* Receipt notice: number line, status chip, body lines. */}
			<View style={{ width: cardW, height: cardH }}>
				<Animated.View
					style={[{ position: 'absolute', bottom: -10, alignSelf: 'center', width: cardW * 0.62, height: 12, borderRadius: 999 }, shadowStyle]}
					className="bg-foreground"
				/>
				<Animated.View
					style={[{ width: cardW, height: cardH }, cardStyle]}
					className="overflow-hidden rounded-2xl border border-border bg-surface"
				>
					<View className="flex-1 gap-control p-card">
						<View className="flex-row items-center justify-between">
							{/* The one cobalt moment: the receipt number. */}
							<View className="h-2.5 w-16 rounded-full bg-accent" />
							<View className="h-4 w-12 rounded-full bg-surface-tertiary" />
						</View>
						<View className="mt-hairline h-1.5 w-4/5 rounded-full bg-surface-tertiary" />
						<View className="h-1.5 w-3/5 rounded-full bg-surface-tertiary" />
						<View className="flex-1" />
						<View className="h-px w-full bg-separator" />
						<View className="flex-row items-center gap-tight">
							<StyledLucideIcon name="landmark" size={13} className="text-muted" />
							<View className="h-1.5 w-1/2 rounded-full bg-surface-tertiary" />
						</View>
					</View>
				</Animated.View>
			</View>

			{/* Status timeline: three stops; the envelope glides along the rail. */}
			<View style={{ width: railW }} className="justify-center">
				<View className="h-px w-full bg-separator" />
				<View className="absolute w-full flex-row items-center justify-between">
					<View className="size-2.5 rounded-full bg-accent" />
					<Animated.View style={middleDotStyle} className="size-2.5 rounded-full bg-muted" />
					<View className="size-2.5 rounded-full border border-border bg-surface" />
				</View>
				<Animated.View
					style={[{ position: 'absolute', left: railW * 0.16, top: -22 }, envelopeStyle]}
				>
					<View className="size-9 items-center justify-center rounded-full border border-border bg-surface">
						<StyledLucideIcon name="mail" size={15} className="text-muted" />
					</View>
				</Animated.View>
			</View>
		</View>
	)
}
