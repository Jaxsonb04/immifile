import { CaseTrackingHero, TabIntro } from '@/components/core'
import { CasesScreen } from '@/screens/cases'
import { router, Stack } from 'expo-router'
import { useThemeColor } from 'heroui-native'
import { View } from 'react-native'

export default function CasesTab() {
	const themeColorForeground = useThemeColor('foreground')
	return (
		<>
			<Stack.Title
				large
				largeStyle={{
					fontFamily: 'Fraunces_600SemiBold',
					color: themeColorForeground,
				}}
			>
				Cases
			</Stack.Title>
			<View className="flex-1">
				<TabIntro
					prefKey="casesIntroDismissed"
					hero={<CaseTrackingHero width={108} />}
					title={'Keep every case\nwithin reach.'}
					body="Save a USCIS receipt number, record updates from your notices, and jump to the official status tool."
					renderToolbar={(hidden) => (
						<Stack.Toolbar placement="right">
							<Stack.Toolbar.Button
								hidden={hidden}
								icon="plus"
								accessibilityLabel="New case"
								onPress={() => router.push('/new-case')}
							/>
						</Stack.Toolbar>
					)}
					features={[
						{
							icon: 'receipt-text',
							title: 'Track by receipt number',
							detail: 'Keep the number from your USCIS notice close at hand.',
						},
						{
							icon: 'route',
							title: 'A timeline you control',
							detail: 'Record the updates you receive in one clear history.',
						},
						{
							icon: 'external-link',
							title: 'Official status one tap away',
							detail: 'Open the USCIS tool whenever you need the latest status.',
						},
					]}
				>
					<CasesScreen />
				</TabIntro>
			</View>
		</>
	)
}
