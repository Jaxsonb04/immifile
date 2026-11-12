import { useTabLayoutStyle } from '@/hooks/use-layout-style'
import { isReleaseTabVisible } from '@/lib/release-policy'
import { NativeTabs } from 'expo-router/unstable-native-tabs'

// All triggers stay statically declared because NativeTabs requires a trigger
// for every tab. Review-sensitive surfaces are hidden by the source-controlled
// release policy and protected separately against deep links in the root layout.
export default function TabsLayout() {
	const { tabBarStyle } = useTabLayoutStyle()
	// Introductions are in-tab overlays. Keep native chrome mounted so dismissing
	// one cannot change safe-area insets or a large title's scroll position.
	return (
		<NativeTabs {...tabBarStyle} sidebarAdaptable>
			<NativeTabs.Trigger name="(forms)" hidden={!isReleaseTabVisible('(forms)')}>
				<NativeTabs.Trigger.Icon sf="doc.text.fill" md="description" />
				<NativeTabs.Trigger.Label>Forms</NativeTabs.Trigger.Label>
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="cases">
				<NativeTabs.Trigger.Icon sf="folder.fill" md="folder" />
				<NativeTabs.Trigger.Label>Cases</NativeTabs.Trigger.Label>
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="resources">
				<NativeTabs.Trigger.Icon sf="books.vertical.fill" md="menu_book" />
				<NativeTabs.Trigger.Label>Resources</NativeTabs.Trigger.Label>
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="assistant" hidden={!isReleaseTabVisible('assistant')}>
				<NativeTabs.Trigger.Icon sf="sparkles" md="auto_awesome" />
				<NativeTabs.Trigger.Label>Assistant</NativeTabs.Trigger.Label>
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="community" hidden={!isReleaseTabVisible('community')}>
				<NativeTabs.Trigger.Icon sf="person.2.fill" md="groups" />
				<NativeTabs.Trigger.Label>Community</NativeTabs.Trigger.Label>
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="account">
				<NativeTabs.Trigger.Icon sf="person.crop.circle.fill" md="account_circle" />
				<NativeTabs.Trigger.Label>Account</NativeTabs.Trigger.Label>
			</NativeTabs.Trigger>
		</NativeTabs>
	)
}
