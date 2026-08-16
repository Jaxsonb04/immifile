import { FilingStackHero, TabIntro } from '@/components/core'
import { TEMP_ACCOUNT_START_DISCLOSURE } from '@/lib/temp-account-notice'
import { HomeScreen } from '@/screens/home'
import { router, Stack } from 'expo-router'
import { useThemeColor } from 'heroui-native'

// The Forms tab is the applications surface and the app's default tab — its
// route group `(forms)` holds the index route `/` (MASTER_PLAN Layout, M6-T1).
// It renders the one-screen hub (`HomeScreen`, M7-T4); the Document Vault
// lives one level deeper at `/documents`, reachable from the header action
// below and from attention items on the hub.
export default function FormsTab() {
	const [themeColorForeground, themeColorBackground] = useThemeColor(['foreground', 'background'])
	return (
		<>
			<Stack.Screen
				options={{
					// This root now scrolls on compact devices so the persistent
					// temporary-account notice and both actions remain reachable.
					// Keep native chrome opaque while it transitions between large
					// and compact titles; no warning copy can become legible beneath it.
					headerTransparent: false,
					headerStyle: { backgroundColor: themeColorBackground },
				}}
			/>
			<Stack.Title
				large
				largeStyle={{
					fontFamily: 'LibreFranklin_600SemiBold',
					color: themeColorForeground,
				}}
			>
				Forms
			</Stack.Title>
			<TabIntro
				prefKey="formsIntroDismissed"
				hero={<FilingStackHero width={104} />}
				title={'Let’s get your\nrenewal moving.'}
				body={TEMP_ACCOUNT_START_DISCLOSURE}
				contentStartsBelowHeader
				renderToolbar={(hidden) => (
					<Stack.Toolbar placement="right">
						<Stack.Toolbar.Button
							hidden={hidden}
							icon="folder.fill"
							accessibilityLabel="Document vault"
							onPress={() => router.push('/documents')}
						/>
					</Stack.Toolbar>
				)}
				features={[
					{
						icon: 'messages-square',
						title: 'Plain-language questions',
						detail: 'Answer in everyday words — we turn them into the right USCIS forms.',
					},
					{
						icon: 'calendar-clock',
						title: 'Never miss a deadline',
						detail: 'Reminders for every filing window, renewal, and expiring document.',
					},
					{
						icon: 'printer',
						title: 'See your form take shape',
						detail:
							'Preview your answers on the official form as you go — export unlocks only when everything checks out.',
					},
				]}
			>
				<HomeScreen />
			</TabIntro>
		</>
	)
}
