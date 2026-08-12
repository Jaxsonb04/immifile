import type { ExtendedStackNavigationOptions } from 'expo-router/build/layouts/StackClient'
import type { NativeTabsProps } from 'expo-router/unstable-native-tabs'
import { colorKit, useThemeColor } from 'heroui-native'
import { Platform } from 'react-native'

import { supportsNativeTabMinimize } from './native-tabs-platform'

/**
 * A hook to get the layout style for the app
 */
export const useLayoutStyle = () => {
	const [themeColorForeground, themeColorBackground, themeColorMuted] = useThemeColor([
		'foreground',
		'background',
		'muted',
	])
	const webHeaderConfig = {
		headerTransparent: false,
		headerStyle: {
			backgroundColor: themeColorBackground,
		},
	}
	const iosHeaderConfig = {
		headerTransparent: true,
		headerStyle: {
			backgroundColor: 'transparent',
		},
	}
	const androidHeaderConfig = {
		headerTransparent: false,
		headerStyle: {
			backgroundColor: themeColorBackground,
		},
	}
	const headerConfig = Platform.select({
		ios: iosHeaderConfig,
		android: androidHeaderConfig,
		default: webHeaderConfig,
	})
	return {
		...headerConfig,
		headerTintColor: themeColorForeground,
		contentStyle: {
			backgroundColor: themeColorBackground,
		},
		headerBackButtonDisplayMode: 'generic',
		headerTitleStyle: {
			fontFamily: 'Inter_600SemiBold',
		},
		headerShadowVisible: false,
		headerLargeTitleStyle: {
			fontFamily: 'Fraunces_600SemiBold',
			fontSize: 24,
			color: themeColorMuted,
		},
	} as ExtendedStackNavigationOptions
}

/**
 * Tab bar appearance (M7 redesign): on iOS the bar is the system chrome
 * material — a real glass pill with a firm edge, so content scrolling
 * beneath it is masked by the material instead of showing through
 * (`disableTransparentOnScrollEdge`), and it minimizes out of the way on
 * scroll (iOS 26). Selection carries the single terracotta accent; resting
 * items stay muted so the bar reads quiet.
 */
export const useTabLayoutStyle = () => {
	const [themeColorSurface, themeColorAccent, themeColorAccentForeground, themeColorMuted] =
		useThemeColor(['surface', 'accent', 'accent-foreground', 'muted'])
	return {
		tabBarStyle: {
			blurEffect: 'systemChromeMaterial',
			disableTransparentOnScrollEdge: true,
			...(supportsNativeTabMinimize(Platform.OS, Platform.Version)
				? { minimizeBehavior: 'onScrollDown' as const }
				: {}),
			// iOS keeps the pure material (no paint over the blur); Android gets
			// an opaque surface bar.
			backgroundColor: Platform.select({
				default: themeColorSurface,
				ios: undefined,
			}),
			tintColor: themeColorAccent,
			indicatorColor: colorKit.setAlpha(themeColorAccent, 0.16).rgb().string(),
			labelStyle: {
				default: {
					color: themeColorMuted,
				},
				fontFamily: 'Inter_600SemiBold',
				selected: {
					color: themeColorAccent,
				},
			},
			iconColor: {
				default: themeColorMuted,
				selected: Platform.select({
					default: themeColorAccentForeground,
					ios: themeColorAccent,
				}),
			},
			rippleColor: colorKit.setAlpha(themeColorMuted, 0.16).rgb().string(),
			sidebarAdaptable: true,
		} satisfies NativeTabsProps,
	}
}
