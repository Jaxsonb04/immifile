import { StyledLucideIcon } from '@/components/styled-icon'
import { WelcomeCasePreview } from '@/screens/welcome/welcome.case-preview'
import { establishAnonymousSession } from '@/lib/anonymous-session'
import { authClient } from '@/lib/auth-client'
import { waitForAuthenticatedOrUnmounted } from '@/lib/auth-transition'
import { ensureSessionResolved, getPersistedSessionCookie } from '@/lib/session-sync'
import { TEMP_ACCOUNT_WELCOME_NOTE } from '@/lib/temp-account-notice'
import { resolveWelcomeLayout } from '@/screens/welcome/welcome.layout'
import { useConvexAuth } from 'convex/react'
import { useRouter } from 'expo-router'
import { Button } from 'heroui-native'
import { useEffect, useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
	Alert,
	Linking,
	Pressable,
	ScrollView,
	Text,
	useWindowDimensions,
	View,
} from 'react-native'

/** Anonymous-first entry: all copy, account disclosure, and actions are visible
 * immediately. The preview illustrates manual case organization, not live data. */
const PRIVACY_POLICY_URL =
	process.env.EXPO_PUBLIC_PRIVACY_URL ?? 'https://jaxsonb04.github.io/immifile/privacy/'

export default function WelcomeScreen() {
	const router = useRouter()
	const { isAuthenticated } = useConvexAuth()
	const { height, fontScale } = useWindowDimensions()
	const insets = useSafeAreaInsets()
	const [pending, setPending] = useState(false)
	const mountedRef = useRef(true)
	const convexAuthenticatedRef = useRef(isAuthenticated)
	const layout = resolveWelcomeLayout({ height, fontScale })

	useEffect(() => {
		mountedRef.current = true
		return () => {
			mountedRef.current = false
		}
	}, [])

	useEffect(() => {
		convexAuthenticatedRef.current = isAuthenticated
	}, [isAuthenticated])

	async function handleContinue(): Promise<void> {
		setPending(true)
		try {
			const session = await establishAnonymousSession({
				hasPersistedCookie: () => !!getPersistedSessionCookie(),
				resolveSession: ensureSessionResolved,
				signInAnonymously: () =>
					authClient.signIn.anonymous({ fetchOptions: { disableSignal: true } }),
			})
			if (!session.ok) {
				Alert.alert("Couldn't start", session.message)
				return
			}

			// Better Auth owning a session is only the first half of the handoff.
			// Stay pending until Convex accepts that session's JWT and the
			// protected route swaps to the retained tabs (which unmounts this screen).
			const enteredApp = await waitForAuthenticatedOrUnmounted({
				isAuthenticated: () => convexAuthenticatedRef.current,
				isMounted: () => mountedRef.current,
			})
			if (!enteredApp) {
				Alert.alert("Couldn't start", "We couldn't finish loading your session. Please try again.")
			}
		} catch (err) {
			Alert.alert('Something went wrong', err instanceof Error ? err.message : 'Please try again.')
		} finally {
			if (mountedRef.current) setPending(false)
		}
	}

	async function openPrivacyPolicy(): Promise<void> {
		try {
			await Linking.openURL(PRIVACY_POLICY_URL)
		} catch {
			Alert.alert(
				'Could not open the privacy policy',
				'Please try again when you have a connection.',
			)
		}
	}

	return (
		<ScrollView
			className="flex-1 bg-background"
			contentContainerStyle={{
				flexGrow: 1,
				paddingTop: insets.top + (layout.compact ? 12 : 20),
				paddingBottom: Math.max(insets.bottom, 16),
			}}
			contentContainerClassName="px-section"
			showsVerticalScrollIndicator={layout.showsScrollIndicator}
			bounces={false}
		>
			<View className="flex-row items-center gap-tight">
				<View className="size-8 items-center justify-center rounded-xl bg-accent">
					<StyledLucideIcon name="folder" size={18} className="text-accent-foreground" />
				</View>
				<Text className="font-display text-lg text-foreground">Immifile</Text>
			</View>

			<View className={layout.compact ? 'gap-tight pt-gutter' : 'gap-control pt-8'}>
				<Text
					accessibilityRole="header"
					className="font-display tracking-tight text-foreground"
					style={{ fontSize: layout.headlineFontSize, lineHeight: layout.headlineLineHeight }}
				>
					{layout.forceHeadlineBreak
						? 'Less searching.\nMore clarity.'
						: 'Less searching. More clarity.'}
				</Text>
				<Text className="text-base text-muted" style={{ lineHeight: layout.bodyLineHeight }}>
					Your USCIS cases, updates, and official tools. Together in one place.
				</Text>
			</View>

			<View className={layout.compact ? 'py-gutter' : 'flex-1 justify-center py-section'}>
				<WelcomeCasePreview compact={layout.compact || layout.accessibilityText} />
			</View>

			<View className="gap-tight">
				<Text className="text-center font-semibold text-base text-foreground">
					Take a look. Make it yours.
				</Text>
				<Text
					className="text-center text-xs text-muted"
					style={{ lineHeight: layout.disclosureLineHeight }}
				>
					{TEMP_ACCOUNT_WELCOME_NOTE}
				</Text>
				<Button
					size="lg"
					className="mt-hairline h-auto min-h-12 py-control"
					style={layout.accessibilityText ? { minHeight: layout.buttonMinHeight } : undefined}
					isDisabled={pending}
					onPress={handleContinue}
				>
					<Button.Label
						className="shrink text-center"
						style={{ lineHeight: layout.buttonLabelLineHeight }}
					>
						{pending ? 'Opening…' : 'Explore Immifile'}
					</Button.Label>
				</Button>
				<Button
					variant="ghost"
					className="h-auto min-h-11 py-tight"
					isDisabled={pending}
					onPress={() => router.push('/sign-in')}
				>
					<Button.Label className="shrink text-center">Sign in</Button.Label>
				</Button>
				<Pressable
					accessibilityRole="link"
					accessibilityLabel="Open Immifile privacy policy"
					className="min-h-11 items-center justify-center self-center px-control"
					onPress={() => void openPrivacyPolicy()}
				>
					<Text
						className="text-xs text-muted underline"
						style={{ lineHeight: layout.linkLineHeight }}
					>
						Privacy policy
					</Text>
				</Pressable>
			</View>
		</ScrollView>
	)
}
