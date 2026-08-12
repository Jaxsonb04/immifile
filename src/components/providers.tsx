import { Fraunces_600SemiBold } from '@expo-google-fonts/fraunces'
import {
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
	Inter_700Bold,
	useFonts,
} from '@expo-google-fonts/inter'
import { ConvexReactClient } from 'convex/react'
import { StatusBar } from 'expo-status-bar'
import { HeroUINativeProvider } from 'heroui-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { AccountGateProvider } from '@/components/account'
import { ImmifileConvexAuthProvider } from '@/components/immifile-convex-auth-provider'
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router'
import { useCallback } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { useUniwind } from 'uniwind'

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
	// expectAuth: true,
	unsavedChangesWarning: false,
})

/**
 * Component that wraps app content inside KeyboardProvider
 * Contains the contentWrapper and HeroUINativeProvider configuration
 */
function AppContent({ children }: { children: React.ReactNode }) {
	const { theme } = useUniwind()
	const contentWrapper = useCallback(
		(children: React.ReactNode) => (
			<KeyboardAvoidingView
				pointerEvents="box-none"
				behavior="padding"
				keyboardVerticalOffset={12}
				className="flex-1"
			>
				{children}
			</KeyboardAvoidingView>
		),
		[],
	)

	return (
		<ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
			<HeroUINativeProvider
				config={{
					...(Platform.OS !== 'web' && { toast: { contentWrapper } }),
					devInfo: {
						stylingPrinciples: false,
					},
				}}
			>
				<AccountGateProvider>{children}</AccountGateProvider>
			</HeroUINativeProvider>
		</ThemeProvider>
	)
}

export function Providers({ children }: { children: React.ReactNode }) {
	const [fontsLoaded] = useFonts({
		Inter_400Regular,
		Inter_500Medium,
		Inter_600SemiBold,
		Inter_700Bold,
		Fraunces_600SemiBold,
	})

	if (!fontsLoaded) {
		return null
	}

	return (
		<ImmifileConvexAuthProvider client={convex}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<KeyboardProvider>
					<AppContent>
						{children}
						<StatusBar style="auto" />
					</AppContent>
				</KeyboardProvider>
			</GestureHandlerRootView>
		</ImmifileConvexAuthProvider>
	)
}
