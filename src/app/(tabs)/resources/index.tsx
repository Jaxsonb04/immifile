import { ResourcesHero, TabIntro } from '@/components/core'
import { ResourcesScreen } from '@/screens/resources'
import { Stack } from 'expo-router'
import { useThemeColor } from 'heroui-native'
import { View } from 'react-native'

export default function ResourcesTab() {
	const foreground = useThemeColor('foreground')
	return (
		<>
			<Stack.Title
				large
				largeStyle={{
					fontFamily: 'LibreFranklin_600SemiBold',
					color: foreground,
				}}
			>
				Resources
			</Stack.Title>

			<View className="flex-1">
				<TabIntro
					prefKey="resourcesIntroDismissed"
					hero={<ResourcesHero width={130} />}
					title={'Official help,\none tap away.'}
					body="Direct links to the USCIS and Department of Justice pages people rely on most."
					features={[
						{
							icon: 'landmark',
							title: 'USCIS tools in one place',
							detail: 'Case status, processing times, and address changes.',
						},
						{
							icon: 'scale',
							title: 'Find qualified legal help',
							detail: 'The official DOJ directory of accredited representatives.',
						},
						{
							icon: 'shield-check',
							title: 'Official .gov sources only',
							detail: 'Every link opens a government page in your browser.',
						},
					]}
				>
					<ResourcesScreen />
				</TabIntro>
			</View>
		</>
	)
}
