import { AccountHero, TabIntro } from '@/components/core'
import { AccountScreen } from '@/screens/account'
import { Stack } from 'expo-router'
import { useThemeColor } from 'heroui-native'
import { View } from 'react-native'

/** The Account tab (M7-T1/T3, MASTER_PLAN Layout) — identity preview and
 * progressively disclosed sections. Replaces the old header-avatar modal. */
export default function AccountTab() {
	const themeColorForeground = useThemeColor('foreground')
	return (
		<>
			<Stack.Title
				large
				largeStyle={{
					fontFamily: 'LibreFranklin_600SemiBold',
					color: themeColorForeground,
				}}
			>
				Account
			</Stack.Title>

			<View className="flex-1">
				<TabIntro
					prefKey="accountIntroDismissed"
					hero={<AccountHero size={104} />}
					title={'Your account.\nYour control.'}
					body="Manage your sign-in, saved case data, privacy choices, and support."
					features={[
						{
							icon: 'lock-keyhole',
							title: 'Persistent when you choose',
							detail: 'Create an account before saving a receipt number.',
						},
						{
							icon: 'shield-check',
							title: 'Privacy in plain language',
							detail: 'See what is stored and how it is used from this tab.',
						},
						{
							icon: 'trash-2',
							title: 'Yours to control',
							detail: 'Delete your account and its associated data at any time.',
						},
					]}
				>
					<AccountScreen />
				</TabIntro>
			</View>
		</>
	)
}
