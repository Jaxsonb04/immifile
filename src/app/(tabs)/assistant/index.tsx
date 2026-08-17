import { AssistantHero, TabIntro } from '@/components/core'
import { AssistantScreen } from '@/screens/assistant'
import { Stack } from 'expo-router'
import { useThemeColor } from 'heroui-native'
import { View } from 'react-native'

/** The Assistant tab (post-M7 revision, MASTER_PLAN Layout) — the safe
 * navigator lives between Cases and Forum again. The floating "Ask" bubble
 * it replaced sat on top of the Forms and Cases surfaces and was reported
 * as being in the way; a dedicated tab gives it room without crowding
 * either surface. The screen itself — navigator, quota, retry — is
 * unchanged from the bubble sheet.
 *
 * The title goes through the intro's `renderTitle` rather than sitting
 * beside it: this screen owns its own layout instead of being a root
 * large-title ScrollView, so its title lives in the navigation bar, above
 * the intro cover. Handing it over withholds it for exactly as long as the
 * tab bar is hidden. */
export default function AssistantTab() {
	const themeColorForeground = useThemeColor('foreground')
	return (
		<View className="flex-1">
			<TabIntro
				prefKey="assistantIntroDismissed"
				renderTitle={(hidden) => (
					<Stack.Title
						large
						largeStyle={{
							fontFamily: 'LibreFranklin_600SemiBold',
							color: themeColorForeground,
						}}
					>
						{hidden ? '' : 'Assistant'}
					</Stack.Title>
				)}
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
