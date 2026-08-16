import { StyledLucideIcon } from '@/components/styled-icon'
import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
	cancelAnimation,
	Easing,
	useAnimatedStyle,
	useReducedMotion,
	useSharedValue,
	withRepeat,
	withTiming,
} from 'react-native-reanimated'

type FilingStackHeroProps = {
	/** Width of the (front) card in px; the whole stack scales around it. */
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
 * Editorial hero: a small stack of filing "cards" that fans and floats, standing
 * in for the immigration paperwork the app assembles. No character, no image
 * asset — every surface is drawn from theme tokens (warm paper, hairline
 * borders, the single cobalt accent), so it reads correctly in both light
 * and dark themes.
 *
 * Motion is calm and continuous: the whole stack drifts up and down while each
 * card sways on its own slow period, so the fan never snaps into a mechanical
 * loop. Transform + opacity only (compositor-friendly). When the user enables
 * Reduce Motion the stack settles into a static resting pose.
 */
export function FilingStackHero({ width = 148 }: FilingStackHeroProps) {
	const reduceMotion = useReducedMotion()
	const animated = !reduceMotion

	// Three loops on deliberately different periods → organic, non-synced idle.
	const float = useIdleLoop(2800, animated)
	const fan = useIdleLoop(4200, animated)
	const drift = useIdleLoop(3600, animated)

	const cardW = width
	const cardH = width * 1.28
	const stackW = width * 1.7
	const stackH = cardH * 1.24

	const groupStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: -6 * float.value }],
	}))

	const backStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateX: -cardW * 0.13 },
			{ translateY: cardH * 0.03 },
			{ rotate: `${-10 + 3 * fan.value}deg` },
		],
	}))

	const midStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateX: cardW * 0.13 },
			{ translateY: cardH * 0.02 },
			{ rotate: `${8 - 3 * drift.value}deg` },
		],
	}))

	const frontStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateY: -3 * float.value },
			{ rotate: `${-2 + 1.5 * (fan.value - drift.value)}deg` },
		],
	}))

	const shadowStyle = useAnimatedStyle(() => ({
		transform: [{ scaleX: 1 - 0.12 * float.value }],
		opacity: 0.1 - 0.03 * float.value,
	}))

	return (
		<View
			accessible={false}
			importantForAccessibility="no-hide-descendants"
			style={{ width: stackW, height: stackH }}
			className="items-center justify-center"
		>
			{/* Ground shadow sells the float; hairline-border system, so it stays faint. */}
			<Animated.View
				style={[
					{
						position: 'absolute',
						bottom: cardH * 0.05,
						width: cardW * 0.68,
						height: cardW * 0.11,
						borderRadius: 999,
					},
					shadowStyle,
				]}
				className="bg-foreground"
			/>

			<Animated.View style={groupStyle} className="items-center justify-center">
				<View style={{ width: cardW, height: cardH }}>
					<Animated.View
						style={[StyleSheet.absoluteFill, backStyle]}
						className="rounded-2xl border border-border bg-surface opacity-80"
					/>
					<Animated.View
						style={[StyleSheet.absoluteFill, midStyle]}
						className="rounded-2xl border border-border bg-surface opacity-90"
					/>
					<Animated.View
						style={[StyleSheet.absoluteFill, frontStyle]}
						className="overflow-hidden rounded-2xl border border-border bg-surface"
					>
						<View className="flex-1 gap-control p-card">
							{/* The one cobalt moment: a single "filled" field. */}
							<View className="h-2.5 w-10 rounded-full bg-accent" />
							<View className="mt-hairline h-1.5 w-4/5 rounded-full bg-surface-tertiary" />
							<View className="h-1.5 w-3/5 rounded-full bg-surface-tertiary" />
							<View className="h-1.5 w-11/12 rounded-full bg-surface-tertiary" />
							<View className="h-1.5 w-2/3 rounded-full bg-surface-tertiary" />
							<View className="flex-1" />
							<View className="h-px w-full bg-separator" />
							<View className="flex-row items-center gap-tight">
								<StyledLucideIcon name="paperclip" size={13} className="text-muted" />
								<View className="h-1.5 flex-1 rounded-full bg-surface-tertiary" />
							</View>
						</View>
					</Animated.View>
				</View>
			</Animated.View>
		</View>
	)
}
