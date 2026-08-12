import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { BottomSheet } from 'heroui-native'
import { useState } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { InvestedProgress } from '../account.data'
import { InvestedProgressRecap, SIGN_IN_RECAP } from './upgrade.invested-progress-recap'
import { UpgradeActions, type UpgradeMode } from './upgrade.actions'

type UpgradeSheetProps = {
	/** Controlled open state. */
	isOpen: boolean
	/** Optional invested-progress recap shown above the actions. */
	recap?: InvestedProgress
	/** Fired once the anonymous session is upgraded to a permanent account. */
	onUpgraded: () => void
	/** Fired when the sheet is dismissed without upgrading (action parked). */
	onDismiss: () => void
}

/**
 * Contextual upgrade bottom sheet (ADR-0010 contextual gate). Presents the
 * invested-progress recap and the shared upgrade actions; converts an anonymous
 * user to a credentialed account in place and auto-resumes via `onUpgraded`.
 */
export function UpgradeSheet({ isOpen, recap, onUpgraded, onDismiss }: UpgradeSheetProps) {
	// In sign-in mode the create-account pitch ("Create an account to save…")
	// would mislabel the form, so the heading swaps to the sign-in recap.
	const [mode, setMode] = useState<UpgradeMode>('create')
	const insets = useSafeAreaInsets()
	return (
		<BottomSheet
			isOpen={isOpen}
			onOpenChange={(open) => {
				if (!open) {
					onDismiss()
				}
			}}
		>
			<BottomSheet.Portal>
				<BottomSheet.Overlay />
				<BottomSheet.Content
					snapPoints={['92%']}
					enableOverDrag={false}
					enableDynamicSizing={false}
					keyboardBehavior="extend"
					contentContainerClassName="h-full"
				>
					<BottomSheetScrollView
						keyboardShouldPersistTaps="handled"
						contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
					>
						<View className="gap-section px-section pt-tight">
							<InvestedProgressRecap recap={mode === 'sign-in' ? SIGN_IN_RECAP : recap} />
							<UpgradeActions onUpgraded={onUpgraded} onModeChange={setMode} />
						</View>
					</BottomSheetScrollView>
				</BottomSheet.Content>
			</BottomSheet.Portal>
		</BottomSheet>
	)
}
