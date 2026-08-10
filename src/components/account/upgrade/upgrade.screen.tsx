import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { accountGateStore, useAccountGateRequest } from '../account.data'
import { InvestedProgressRecap, SIGN_IN_RECAP } from './upgrade.invested-progress-recap'
import { UpgradeActions, type UpgradeMode } from './upgrade.actions'

/**
 * Full-screen upgrade surface: the invested-progress recap plus the shared
 * upgrade actions. Rendered by the `/upgrade` modal route — the
 * `useRequireAccount()` fallback surface when no `AccountGateProvider` hosts the
 * bottom sheet, and reachable directly (e.g. an account-tab "Create account"
 * action). Settles the same gate as the bottom sheet, so the anonymous →
 * credentialed link (and its data preservation) is identical.
 */
export function UpgradeScreen() {
	const router = useRouter()
	const request = useAccountGateRequest()
	const settledRef = useRef(false)
	// Sign-in mode swaps the create-account heading for the sign-in recap.
	const [mode, setMode] = useState<UpgradeMode>('create')

	// If the modal is dismissed (swipe/back) without upgrading, park any awaiting
	// gated action so the caller can stop. The settled guard prevents a
	// double-settle once an upgrade has already resolved the gate.
	useEffect(() => {
		return () => {
			if (!settledRef.current) {
				accountGateStore.settle(false)
			}
		}
	}, [])

	function handleUpgraded(): void {
		if (settledRef.current) {
			return
		}
		settledRef.current = true
		accountGateStore.settle(true)
		router.back()
	}

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
		>
			<ScrollView
				className="bg-background"
				contentContainerStyle={{ flexGrow: 1, padding: 24, gap: 24 }}
				keyboardShouldPersistTaps="handled"
			>
				<InvestedProgressRecap recap={mode === 'sign-in' ? SIGN_IN_RECAP : request?.recap} />
				<UpgradeActions onUpgraded={handleUpgraded} onModeChange={setMode} />
			</ScrollView>
		</KeyboardAvoidingView>
	)
}
