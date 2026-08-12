import { useConvexAuth } from 'convex/react'
import { Redirect, Stack, usePathname } from 'expo-router'
import { Spinner } from 'heroui-native'
import { View } from 'react-native'

import { RouteErrorBoundary } from '@/components/core'
import { Providers } from '@/components/providers'
import { useLayoutStyle } from '@/hooks/use-layout-style'
import { useSessionReconciler } from '@/hooks/use-session-reconciler'
import { resolveAuthRouteState } from '@/lib/auth-route-state'
import { RELEASE_HOME_PATH, isReleasePathBlocked } from '@/lib/release-policy'
import { useState } from 'react'
import '../global.css'

export const unstable_settings = {
	initialRouteName: 'home',
}

// Expo Router renders the nearest exported ErrorBoundary when a route throws.
// Exporting it from the root layout covers every screen in the app.
export { RouteErrorBoundary as ErrorBoundary }

export default function RootLayout() {
	return (
		<Providers>
			<AppContent />
		</Providers>
	)
}

const AppContent = () => {
	const layoutStyle = useLayoutStyle()
	const { isLoading, isAuthenticated } = useConvexAuth()
	const pathname = usePathname()
	const [authHistory, setAuthHistory] = useState(() => ({
		isLoading,
		isAuthenticated,
		lastSettledAuthenticated: isLoading ? null : isAuthenticated,
	}))
	if (authHistory.isLoading !== isLoading || authHistory.isAuthenticated !== isAuthenticated) {
		setAuthHistory({
			isLoading,
			isAuthenticated,
			lastSettledAuthenticated: isLoading ? authHistory.lastSettledAuthenticated : isAuthenticated,
		})
	}

	// Backstop the sign-in refetch race from any path (see useSessionReconciler):
	// if a session cookie is persisted but the reactive atom is stranded
	// signed-out, re-drive resolution so the guard below flips to the app.
	useSessionReconciler()

	const authRoute = resolveAuthRouteState(authHistory.lastSettledAuthenticated, {
		isLoading,
		isAuthenticated,
	})

	// Only the initial hydration gets a full-screen loader. During later token
	// refreshes retain the last guard so the Stack is never destroyed/recreated.
	if (authRoute.showBootLoader) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<Spinner />
			</View>
		)
	}

	// A hidden tab is not a security or deep-link boundary. Apply the release
	// policy before any disabled route mounts so restored state, custom-scheme
	// links, and auth callbacks cannot reveal filing/AI/community screens.
	if (authRoute.authenticated && isReleasePathBlocked(pathname)) {
		return <Redirect href={RELEASE_HOME_PATH} />
	}

	return (
		<Stack screenOptions={layoutStyle}>
			<Stack.Screen name="home" options={{ headerShown: false }} />
			<Stack.Protected guard={!authRoute.authenticated}>
				{/* Anonymous-first onboarding (ADR-0009). `welcome` creates a
				    temporary session for the read-only release surfaces; account
				    gates protect persistent case writes. */}
				<Stack.Screen
					name="welcome"
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="sign-in"
					options={{
						headerShown: false,
						title: 'Sign in',
						presentation: 'formSheet',
						sheetAllowedDetents: 'fitToContents',
					}}
				/>
			</Stack.Protected>
			<Stack.Protected guard={Boolean(authRoute.authenticated)}>
				<Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Home' }} />
				{/* Root-level modal slots present above the tab bar. */}
				<Stack.Screen
					name="(modal)"
					options={{
						presentation: 'modal',
						animation: 'fade_from_bottom',
						headerShown: false,
					}}
				/>
			</Stack.Protected>
			<Stack.Screen
				name="forgot-password"
				options={{
					title: 'Reset password',
					presentation: 'formSheet',
					sheetAllowedDetents: 'fitToContents',
				}}
			/>
			<Stack.Screen
				name="reset-password"
				options={{
					title: 'Choose a new password',
					presentation: 'formSheet',
					sheetAllowedDetents: 'fitToContents',
				}}
			/>
		</Stack>
	)
}
