import { useEffect } from 'react'
import { Card } from 'heroui-native'
import { Text, View } from 'react-native'
import Animated, {
	cancelAnimation,
	Easing,
	ReduceMotion,
	useAnimatedStyle,
	useReducedMotion,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated'

const EXAMPLE_RECEIPT = 'IOE0912345678'
const FIRST_KEY_MS = 400
const KEY_INTERVAL_MS = 95
const DURATION_MS = 4600
type Clock = ReturnType<typeof useSharedValue<number>>

function ReceiptCharacter({
	character,
	index,
	clock,
	compact,
}: {
	character: string
	index: number
	clock: Clock
	compact: boolean
}) {
	const style = useAnimatedStyle(() => ({
		opacity: clock.value >= FIRST_KEY_MS + index * KEY_INTERVAL_MS ? 1 : 0,
	}))

	return (
		<Animated.Text
			className="font-mono text-foreground"
			allowFontScaling={false}
			style={[{ width: compact ? 18 : 20, fontSize: compact ? 23 : 25, lineHeight: 34 }, style]}
		>
			{character}
		</Animated.Text>
	)
}

/** Decorative example: fixed character slots keep typing from moving the layout. */
export function WelcomeCasePreview({ compact }: { compact: boolean }) {
	const reduceMotion = useReducedMotion()
	const clock = useSharedValue(reduceMotion ? DURATION_MS : 0)
	const cellWidth = compact ? 18 : 20

	useEffect(() => {
		clock.value = reduceMotion
			? DURATION_MS
			: withTiming(DURATION_MS, {
					duration: DURATION_MS,
					easing: Easing.linear,
					reduceMotion: ReduceMotion.System,
				})
		return () => cancelAnimation(clock)
	}, [clock, reduceMotion])

	const caretStyle = useAnimatedStyle(() => {
		const characters = Math.min(
			EXAMPLE_RECEIPT.length,
			Math.max(0, Math.floor((clock.value - FIRST_KEY_MS) / KEY_INTERVAL_MS) + 1),
		)
		const isTyping = characters < EXAMPLE_RECEIPT.length
		const isVisible =
			clock.value < DURATION_MS && (isTyping || Math.floor(clock.value / 500) % 2 === 0)
		return {
			opacity: isVisible ? 1 : 0,
			transform: [{ translateX: characters * cellWidth }],
		}
	})

	return (
		<Card
			className="gap-card rounded-3xl border border-border p-gutter"
			animation="disable-all"
			accessible
			accessibilityLabel="Example USCIS receipt number"
			accessibilityRole="image"
		>
			<View
				accessibilityElementsHidden
				importantForAccessibility="no-hide-descendants"
				className="gap-card"
			>
				<View className="flex-row flex-wrap items-center justify-between gap-tight">
					<Text className="font-medium text-sm text-muted">USCIS receipt number</Text>
					<Text className="text-xs text-muted">Example</Text>
				</View>
				<View className="self-center" style={{ width: EXAMPLE_RECEIPT.length * cellWidth + 3 }}>
					<View className="flex-row">
						{Array.from(EXAMPLE_RECEIPT, (character, index) => (
							<ReceiptCharacter key={index} {...{ character, index, clock, compact }} />
						))}
					</View>
					<Animated.View
						className="absolute left-0 top-1 rounded-full bg-accent"
						style={[{ width: 2, height: 26 }, caretStyle]}
					/>
				</View>
			</View>
		</Card>
	)
}
