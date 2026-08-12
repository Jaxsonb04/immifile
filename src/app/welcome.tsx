import { SheetOfRecordHero } from '@/components/core'
import { establishAnonymousSession } from '@/lib/anonymous-session'
import { authClient } from '@/lib/auth-client'
import { waitForAuthenticatedOrUnmounted } from '@/lib/auth-transition'
import { ensureSessionResolved, getPersistedSessionCookie } from '@/lib/session-sync'
import { TEMP_ACCOUNT_WELCOME_NOTE } from '@/lib/temp-account-notice'
import { useConvexAuth } from 'convex/react'
import { useRouter } from 'expo-router'
import { Button } from 'heroui-native'
import { useEffect, useRef, useState } from 'react'
import {
	Alert,
	Linking,
	Pressable,
	ScrollView,
	Text,
	useWindowDimensions,
	View,
} from 'react-native'

/**
 * Anonymous-first entry point (ADR-0009). Continue creates a temporary Better
 * Auth session for browsing the stable release surfaces. Persistent case writes
 * remain account-gated; returning users can open the dedicated sign-in screen.
 *
 * MOTION. There is deliberately NO entrance on the headline, the body copy, the
 * buttons, the 48-hour disclosure or the privacy link. They are simply present,
 * complete, at frame 1; `SheetOfRecordHero` carries the screen's entire
 * entrance on its own clock. This is on purpose and should not be "restored":
 *
 *   · A promise that fades in reads as less certain than one that was already
 *     there. On a screen whose subject is waiting, the right statement is that
 *     the interface is ready immediately and only the artwork takes its time.
 *   · The pre-creation 48-hour disclosure can never appear after Continue is
 *     tappable, because `entering` does not gate touches and a staggered note
 *     is momentarily less visible than the button it qualifies. Present-at-
 *     frame-1 is the strongest possible form of that commitment.
 *   · Welcome stays mounted underneath the sign-in formSheet, and `entering`
 *     animations do not replay when that sheet is dismissed. Nothing here
 *     depends on an entrance having played.
 *   · The 42px Fraunces headline is never caught mid-opacity on a cold start.
 *
 * If this ever tests as too static on a large phone, the sanctioned fallback is
 * a SINGLE shared opacity ramp on the copy block and a SINGLE shared opacity
 * ramp on the whole action block, with zero translate and zero stagger — never
 * a return to the staggered `FadeInDown`, and never splitting the action block
 * into separately timed children.
 */

const PRIVACY_POLICY_URL =
	process.env.EXPO_PUBLIC_PRIVACY_URL ?? 'https://jaxsonb04.github.io/immifile/privacy/'

export default function WelcomeScreen() {
	const router = useRouter()
	const { isAuthenticated } = useConvexAuth()
	const { height, fontScale } = useWindowDimensions()
	const [pending, setPending] = useState(false)
	const mountedRef = useRef(true)
	const convexAuthenticatedRef = useRef(isAuthenticated)
	const showsScrollIndicator = height < 750 || fontScale > 1.2
	// iPhone SE class. At full size the hero and its generous top paddings push
	// the temporary-account note and the privacy link off the bottom of the
	// frame — reachable only by scrolling a screen that gives no hint it
	// scrolls. Compact trades hero scale for keeping the entry screen whole.
	const compact = height < 750

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
			contentContainerStyle={{ flexGrow: 1 }}
			showsVerticalScrollIndicator={showsScrollIndicator}
			bounces={false}
		>
			<View className="flex-1 justify-end">
				<SheetOfRecordHero height={compact ? 190 : 288} />
			</View>

			<View className={compact ? 'gap-gutter px-section pt-card' : 'gap-gutter px-section pt-9'}>
				<View className="items-center gap-tight">
					<Text className="text-center font-display text-display text-foreground">
						Keep your case{'\n'}close at hand.
					</Text>
					<Text className="max-w-[300px] text-center font-normal text-[17px] leading-relaxed text-muted">
						Track your USCIS cases and open official tools in one place.
					</Text>
				</View>
			</View>

			{/* The 48-hour disclosure, Privacy policy, Continue, and Sign in are
			    ONE block and must stay one block. Their arrival time is a compliance
			    surface, not a design variable: the disclosure is a documented
			    pre-creation commitment (RELEASE_AUDIT_2026-07-27:445), and the
			    privacy link is what App Review looks for on the first screen. Keep
			    the disclosure before Continue so the bottom-anchored actions remain
			    easy to reach without weakening informed consent. */}
			<View
				className={
					compact
						? 'gap-control px-section pt-card pb-safe-offset-4'
						: 'gap-control px-section pt-10 pb-safe-offset-6'
				}
			>
				<Text className="text-center text-xs leading-relaxed text-muted">
					{TEMP_ACCOUNT_WELCOME_NOTE}
				</Text>
				<Pressable
					accessibilityRole="link"
					accessibilityLabel="Open Immifile privacy policy"
					className="self-center px-control py-tight"
					hitSlop={8}
					onPress={() => void openPrivacyPolicy()}
				>
					<Text className="font-medium text-sm text-accent underline">Privacy policy</Text>
				</Pressable>
				<Button size="lg" isDisabled={pending} onPress={handleContinue}>
					<Button.Label maxFontSizeMultiplier={1.5}>
						{pending ? 'Opening…' : 'Continue'}
					</Button.Label>
				</Button>
				<Button
					size="lg"
					variant="ghost"
					isDisabled={pending}
					onPress={() => router.push('/sign-in')}
				>
					<Button.Label maxFontSizeMultiplier={1.5}>Sign in</Button.Label>
				</Button>
			</View>
		</ScrollView>
	)
}
