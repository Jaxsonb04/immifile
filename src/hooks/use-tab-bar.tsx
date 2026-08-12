import * as Device from 'expo-device'
import { useFocusEffect } from 'expo-router'
import { createContext, use } from 'react'

export const TabBarContext = createContext<{
	isTabBarHidden: boolean
	setIsTabBarHidden: (hidden: boolean) => void
}>({
	isTabBarHidden: false,
	setIsTabBarHidden: () => {},
})

/** Automaticaly hide tab bar in nested routes.
 *
 * Tablet devices have their own tab bar and should not be hidden
 */
export const useHideTabBar = () => {
	const { setIsTabBarHidden } = use(TabBarContext)

	useFocusEffect(() => {
		// ignore tablet devices
		if (Device.deviceType === Device.DeviceType.TABLET) return
		setIsTabBarHidden(true)
		return () => setIsTabBarHidden(false)
	})
}
