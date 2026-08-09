import { humanErrorMessage } from '@/lib/error-message'
import type { ErrorBoundaryProps } from 'expo-router'
import { Pressable, Text, View } from 'react-native'

/**
 * The screen someone actually sees when a route throws.
 *
 * Without this, Expo Router falls back to its built-in boundary, which renders
 * an unstyled "Something went wrong / Error: <raw message>" page — and the raw
 * message is whatever the server threw, e.g. a Convex transport string or
 * "Account deletion is in progress". Neither the look nor the wording belongs
 * in a shipping app, so this reuses the app's own error state and never prints
 * the raw error: `humanErrorMessage` extracts the human sentence a handler
 * wrote and falls back to calm copy for transport noise and non-Error throws.
 *
 * This boundary intentionally uses only React Native primitives. Expo Router
 * replaces the throwing route with its ErrorBoundary, so the root layout's
 * HeroUI provider is no longer an ancestor here. Depending on any app-level
 * provider would make the recovery screen throw while handling the first
 * error, masking its cause.
 */
export function RouteErrorBoundary({ error, retry }: ErrorBoundaryProps) {
	return (
		<View className="flex-1 items-center justify-center gap-gutter bg-background px-8">
			<View className="gap-tight">
				<Text
					accessibilityRole="header"
					className="text-center text-xl font-semibold text-foreground"
				>
					Something went wrong
				</Text>
				<Text className="text-center text-base leading-relaxed text-muted">
					{humanErrorMessage(
						error,
						'Immifile could not load this screen. Your saved cases are unaffected.',
					)}
				</Text>
			</View>
			<Pressable
				accessibilityRole="button"
				className="rounded-full bg-default px-card py-control active:opacity-70"
				onPress={() => void retry()}
			>
				<Text className="font-semibold text-default-foreground">Try again</Text>
			</Pressable>
		</View>
	)
}
