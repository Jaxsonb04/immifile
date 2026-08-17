import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { View } from 'react-native'
import { accountGateStore, useAccountGateRequest } from './account.data'
import { UpgradeSheet } from './upgrade'
import { resolveUpgradeAccessibility } from './upgrade/upgrade.accessibility'

/**
 * Optional app-root provider that hosts the contextual upgrade bottom sheet.
 *
 * Mount it once near the root (e.g. inside `Providers`) so `useRequireAccount()`
 * opens an in-place bottom sheet. When it is NOT mounted, `useRequireAccount()`
 * falls back to navigating to the already-registered `/upgrade` modal route, so
 * the gate still works end-to-end either way.
 */
export function AccountGateProvider({ children }: { children: ReactNode }) {
	const request = useAccountGateRequest()
	const accessibility = resolveUpgradeAccessibility(request !== null)

	// Advertise this surface so `useRequireAccount()` prefers the in-place sheet
	// over the `/upgrade` modal fallback while the provider is mounted.
	useEffect(() => accountGateStore.registerSurface(), [])

	return (
		<>
			<View
				collapsable={false}
				className="flex-1"
				accessibilityElementsHidden={accessibility.backgroundAccessibilityElementsHidden}
				importantForAccessibility={accessibility.backgroundImportantForAccessibility}
			>
				{children}
			</View>
			<UpgradeSheet
				isOpen={request !== null}
				recap={request?.recap}
				onUpgraded={() => accountGateStore.settle(true)}
				onDismiss={() => accountGateStore.settle(false)}
			/>
		</>
	)
}
