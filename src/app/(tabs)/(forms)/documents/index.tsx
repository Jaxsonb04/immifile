import { DocumentsScreen } from '@/screens/documents'
import { Stack } from 'expo-router'
import { useThemeColor } from 'heroui-native'

export default function DocumentsTab() {
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
				Documents
			</Stack.Title>

			<DocumentsScreen basePath="/documents" />
		</>
	)
}
