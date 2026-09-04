import { AssistantHero, TabIntro } from '@/components/core'
import { AssistantScreen } from '@/screens/assistant'
import { Stack } from 'expo-router'
import { useThemeColor } from 'heroui-native'
import { View } from 'react-native'

export default function AssistantTab() {
	const backgroundColor = useThemeColor('background')
	return (
		<View className="flex-1">
			<Stack.Screen
				options={{
					title: 'Assistant',
					headerLargeTitle: false,
					headerTransparent: false,
					headerStyle: { backgroundColor },
				}}
			/>
			<TabIntro
				prefKey="assistantIntroDismissed"
				contentStartsBelowHeader
				hero={<AssistantHero width={112} />}
				title={'Not sure which form?\nLet’s figure it out.'}
				body="Ask in your own words. The assistant points you to one of two forms — a work permit (Form I-765) or a green card (Form I-90)."
				features={[
					{
						icon: 'message-circle',
						title: 'No wrong way to ask',
						detail:
							'Describe your situation however it comes out — no form numbers or legal terms needed.',
					},
					{
						icon: 'file-text',
						title: 'Ends with one clear form',
						detail:
							'It narrows Form I-765 and Form I-90 down to the one that fits what you described.',
					},
					{
						icon: 'info',
						title: 'Information, not legal advice',
						detail:
							'For eligibility or a specific decision, it points you to an attorney or accredited representative.',
					},
				]}
			>
				<AssistantScreen />
			</TabIntro>
		</View>
	)
}
