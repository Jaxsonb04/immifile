import { authClient } from '@/lib/auth-client'
import { SLOW_LOAD_RETRY_MESSAGE, resolveSlowLoadState } from '@/hooks/slow-load-state'
import { useSlowLoad } from '@/hooks/use-slow-load'
import { PASSWORD_RECOVERY_ENABLED } from '@/lib/password-recovery'
import { ensureSessionResolved } from '@/lib/session-sync'
import { useSocialProviders, type SocialProvider } from '@/lib/social-login'
import { useRouter } from 'expo-router'
import {
	Button,
	Input,
	Label,
	Separator,
	Spinner,
	TextField,
	Typography,
	useBottomSheetAwareHandlers,
} from 'heroui-native'
import { SocialAuthButton } from 'heroui-native-pro'
import { useEffect, useRef, useState } from 'react'
import { Alert, View } from 'react-native'
import { useCredentialedAccountReadiness } from '../account.session'

export type UpgradeMode = 'create' | 'sign-in'

/**
 * The reusable email account form that replaces the current anonymous session
 * with either a new or existing permanent account. Shared by the contextual
 * `UpgradeSheet` (bottom sheet) and the `/upgrade` full-screen modal.
 *
 * Better Auth's anonymous plugin handles both email sign-up and sign-in,
 * invoking `onLinkAccount` so temporary data moves before the temporary
 * identity is removed. `onUpgraded` fires only when the local session and
 * Convex agree on the same non-anonymous user.
 */
export function UpgradeActions({
	onUpgraded,
	onModeChange,
}: {
	onUpgraded?: () => void
	/** Fired when the user switches between create-account and sign-in, so the
	 * hosting surface can swap its heading to match. */
	onModeChange?: (mode: UpgradeMode) => void
}) {
	const router = useRouter()
	const { isCredentialed, isCredentialedReady } = useCredentialedAccountReadiness()
	const socialProviders = useSocialProviders()
	const providerLoadState = resolveSlowLoadState(
		socialProviders === undefined,
		useSlowLoad(socialProviders === undefined),
	)
	const visibleSocialProviders =
		socialProviders ?? (providerLoadState === 'stalled' ? [] : undefined)
	const bottomSheetInputHandlers = useBottomSheetAwareHandlers()
	const [mode, setMode] = useState<UpgradeMode>('create')

	function switchMode(): void {
		setMode((current) => {
			const next: UpgradeMode = current === 'create' ? 'sign-in' : 'create'
			onModeChange?.(next)
			return next
		})
		// The password never carries across modes: a half-typed new password must
		// not silently ride along into a sign-in attempt (and vice versa).
		setPassword('')
	}
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [pending, setPending] = useState(false)

	const onUpgradedRef = useRef(onUpgraded)
	useEffect(() => {
		onUpgradedRef.current = onUpgraded
	})
	useEffect(() => {
		if (isCredentialedReady) {
			onUpgradedRef.current?.()
		}
	}, [isCredentialedReady])

	async function handleEmailUpgrade(): Promise<void> {
		const isCreating = mode === 'create'
		if (!email.trim() || !password || (isCreating && !name.trim())) {
			Alert.alert(
				'Missing details',
				isCreating
					? 'Add your name, email, and a password to create your account.'
					: 'Add your email and password to sign in.',
			)
			return
		}

		setPending(true)
		try {
			const { data, error } = isCreating
				? await authClient.signUp.email({
						name: name.trim(),
						email: email.trim(),
						password,
						fetchOptions: { disableSignal: true },
					})
				: await authClient.signIn.email({
						email: email.trim(),
						password,
						fetchOptions: { disableSignal: true },
					})
			if (error) {
				Alert.alert(
					isCreating ? 'Could not create account' : 'Could not sign in',
					error.message ?? 'Please check your details and try again.',
				)
				return
			}
			// Publish the linked Better Auth session. The server-backed readiness
			// probe above separately waits for Convex to install that user's JWT
			// before it fires `onUpgraded` and resumes the parked action.
			const resolved = await ensureSessionResolved(data?.user.id)
			if (!resolved) {
				Alert.alert('Almost there', "We couldn't finish loading your account. Please try again.")
			}
		} catch (err) {
			Alert.alert('Something went wrong', err instanceof Error ? err.message : 'Please try again.')
		} finally {
			setPending(false)
		}
	}

	async function handleSocialUpgrade(provider: SocialProvider): Promise<void> {
		setPending(true)
		try {
			const { error } = await authClient.signIn.social({
				provider,
				callbackURL: '/',
				fetchOptions: { disableSignal: true },
			})
			if (error) {
				Alert.alert('Could not continue', error.message ?? 'Please try again.')
				return
			}
			// Resolves after the OAuth browser flow persists the linked session
			// cookie (or the user dismisses it). Drive the reactive atom so the
			// `isCredentialedReady` upgrade transition isn't stranded by the
			// refetch race; a dismissed browser simply never resolves, so stay
			// silent.
			await ensureSessionResolved()
		} catch (err) {
			Alert.alert('Something went wrong', err instanceof Error ? err.message : 'Please try again.')
		} finally {
			setPending(false)
		}
	}

	if (isCredentialed && !isCredentialedReady) {
		return (
			<View className="items-center gap-control py-section">
				<Spinner />
				<View className="items-center gap-hairline">
					<Typography.Heading className="text-lg font-semibold">
						Finishing account setup…
					</Typography.Heading>
					<Typography.Paragraph color="muted" className="text-center">
						We’re reconnecting your saved work before continuing.
					</Typography.Paragraph>
				</View>
			</View>
		)
	}
	if (visibleSocialProviders === undefined) {
		return (
			<View className="min-h-64 items-center justify-center gap-control py-section">
				<Spinner accessibilityLabel="Loading account options" />
				<Typography.Paragraph color="muted">Loading account options…</Typography.Paragraph>
			</View>
		)
	}

	return (
		<View className="gap-section">
			{providerLoadState === 'stalled' ? (
				<Typography.Paragraph color="muted" className="text-sm">
					{SLOW_LOAD_RETRY_MESSAGE} Email account setup is still available.
				</Typography.Paragraph>
			) : null}
			{visibleSocialProviders.length > 0 ? (
				<>
					<View className="gap-control">
						{visibleSocialProviders.map((provider) => (
							<SocialAuthButton
								key={provider}
								provider={provider}
								isDisabled={pending}
								onPress={() => handleSocialUpgrade(provider)}
							/>
						))}
					</View>

					<View className="flex-row items-center gap-card">
						<Separator className="flex-1" />
						<Typography.Paragraph color="muted" className="text-sm">
							or use email
						</Typography.Paragraph>
						<Separator className="flex-1" />
					</View>
				</>
			) : null}

			<View className="gap-card">
				{mode === 'create' ? (
					<TextField>
						<Label>Name</Label>
						<Input
							value={name}
							onChangeText={setName}
							placeholder="Jane Doe"
							autoCapitalize="words"
							textContentType="name"
							editable={!pending}
							{...bottomSheetInputHandlers}
						/>
					</TextField>
				) : null}

				<TextField>
					<Label>Email</Label>
					<Input
						value={email}
						onChangeText={setEmail}
						placeholder="you@example.com"
						autoCapitalize="none"
						autoComplete="email"
						keyboardType="email-address"
						textContentType="emailAddress"
						editable={!pending}
						{...bottomSheetInputHandlers}
					/>
				</TextField>

				<TextField>
					<Label>Password</Label>
					<Input
						value={password}
						onChangeText={setPassword}
						placeholder="••••••••"
						secureTextEntry
						autoCapitalize="none"
						textContentType={mode === 'create' ? 'newPassword' : 'password'}
						editable={!pending}
						{...bottomSheetInputHandlers}
					/>
				</TextField>
			</View>
			{mode === 'create' && !PASSWORD_RECOVERY_ENABLED ? (
				<Typography.Paragraph color="muted" className="text-center text-xs leading-relaxed">
					Password reset isn’t available yet. Choose a password you can keep.
				</Typography.Paragraph>
			) : null}

			<Button isDisabled={pending} onPress={handleEmailUpgrade}>
				<Button.Label>
					{pending
						? mode === 'create'
							? 'Creating account…'
							: 'Signing in…'
						: mode === 'create'
							? 'Create account'
							: 'Sign in'}
				</Button.Label>
			</Button>
			<Button variant="ghost" isDisabled={pending} onPress={switchMode}>
				<Button.Label>
					{mode === 'create' ? 'Already have an account? Sign in' : 'Need an account? Create one'}
				</Button.Label>
			</Button>
			{mode === 'sign-in' && PASSWORD_RECOVERY_ENABLED ? (
				<Button
					variant="ghost"
					isDisabled={pending}
					onPress={() => router.push('/forgot-password')}
				>
					<Button.Label>Forgot password?</Button.Label>
				</Button>
			) : null}
		</View>
	)
}
