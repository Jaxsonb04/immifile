import { StyledLucideIcon } from '@/components/styled-icon'
import { PasswordInput } from '@/components/core/password-input'
import { authClient } from '@/lib/auth-client'
import { SLOW_LOAD_RETRY_MESSAGE, resolveSlowLoadState } from '@/hooks/slow-load-state'
import { useSlowLoad } from '@/hooks/use-slow-load'
import { PASSWORD_RECOVERY_ENABLED } from '@/lib/password-recovery'
import { ensureSessionResolved } from '@/lib/session-sync'
import { useSocialProviders, type SocialProvider } from '@/lib/social-login'
import { useRouter } from 'expo-router'
import { Button, Input, Label, Separator, Spinner, TextField, Typography } from 'heroui-native'
import { SocialAuthButton } from 'heroui-native-pro'
import { useState } from 'react'
import { Alert, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'

type Mode = 'sign-in' | 'sign-up'

/**
 * Dedicated sign-in screen for returning users, pushed from the Welcome screen
 * (ADR-0009). Anonymous-first onboarding means this is no longer the app's
 * entry wall — it's an opt-in destination for people who already have an
 * account. The sign-up toggle is retained for now.
 */
export default function SignInScreen() {
	const router = useRouter()
	const socialProviders = useSocialProviders()
	const providerLoadState = resolveSlowLoadState(
		socialProviders === undefined,
		useSlowLoad(socialProviders === undefined),
	)
	// Provider discovery is optional. If it cannot resolve promptly, keep the
	// email path usable while the reactive query continues retrying.
	const visibleSocialProviders =
		socialProviders ?? (providerLoadState === 'stalled' ? [] : undefined)
	const [mode, setMode] = useState<Mode>('sign-in')
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [pending, setPending] = useState(false)

	const isSignUp = mode === 'sign-up'

	async function handleEmailAuth(): Promise<void> {
		if (!email.trim() || !password || (isSignUp && !name.trim())) {
			Alert.alert('Missing details', 'Please fill in all of the fields to continue.')
			return
		}

		setPending(true)
		try {
			const { data, error } = isSignUp
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
					'Authentication failed',
					error.message ?? 'Please check your details and try again.',
				)
				return
			}
			// The credentials were accepted and the session cookie is persisted;
			// the protected route in the root layout redirects into the app once
			// the reactive session atom reflects it. Drive that atom past the
			// refetch race so the redirect is not stranded (see ensureSessionResolved).
			const resolved = await ensureSessionResolved(data?.user.id)
			if (!resolved) {
				Alert.alert('Almost there', "We couldn't finish loading your session. Please try again.")
			}
		} catch (err) {
			Alert.alert('Something went wrong', err instanceof Error ? err.message : 'Please try again.')
		} finally {
			setPending(false)
		}
	}

	async function handleSocialAuth(provider: SocialProvider): Promise<void> {
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
			// Resolves once the OAuth browser flow persists the session cookie (or
			// the user dismisses the browser, which simply never resolves a
			// session — stay silent in that case).
			await ensureSessionResolved()
		} catch (err) {
			Alert.alert('Something went wrong', err instanceof Error ? err.message : 'Please try again.')
		} finally {
			setPending(false)
		}
	}

	if (visibleSocialProviders === undefined) {
		return (
			<KeyboardAwareScrollView
				contentContainerClassName="min-h-96 p-gutter gap-card"
				contentInsetAdjustmentBehavior="automatic"
			>
				<View className="gap-tight">
					<View className="mb-tight flex-row items-center justify-between">
						<View className="size-12 items-center justify-center rounded-2xl bg-accent/10">
							<StyledLucideIcon
								name={isSignUp ? 'user-round-plus' : 'lock-keyhole'}
								size={24}
								className="text-accent"
							/>
						</View>
						<Button
							variant="ghost"
							isIconOnly
							accessibilityLabel="Close sign in"
							onPress={() => (router.canGoBack() ? router.back() : router.replace('/welcome'))}
						>
							<StyledLucideIcon name="x" size={20} className="text-muted" />
						</Button>
					</View>
					<Text className="font-display text-[28px] leading-9 text-foreground">
						{isSignUp ? 'Create your account' : 'Welcome back'}
					</Text>
					<Typography.Paragraph color="muted" className="text-[15px]">
						{isSignUp
							? 'One account for your cases, wherever you are.'
							: 'Your cases and updates are right where you left them.'}
					</Typography.Paragraph>
				</View>
				<View className="min-h-64 items-center justify-center gap-control">
					<Spinner accessibilityLabel="Loading sign-in options" />
					<Typography.Paragraph color="muted">Loading sign-in options…</Typography.Paragraph>
				</View>
			</KeyboardAwareScrollView>
		)
	}

	return (
		<KeyboardAwareScrollView
			contentContainerClassName="px-section pt-gutter pb-12 gap-section"
			keyboardDismissMode="on-drag"
			keyboardShouldPersistTaps="handled"
			contentInsetAdjustmentBehavior="automatic"
		>
			<View className="gap-tight">
				<View className="mb-tight flex-row items-center justify-between">
					<View className="size-12 items-center justify-center rounded-2xl bg-accent/10">
						<StyledLucideIcon
							name={isSignUp ? 'user-round-plus' : 'lock-keyhole'}
							size={24}
							className="text-accent"
						/>
					</View>
					<Button
						variant="ghost"
						isIconOnly
						accessibilityLabel="Close sign in"
						onPress={() => (router.canGoBack() ? router.back() : router.replace('/welcome'))}
					>
						<StyledLucideIcon name="x" size={20} className="text-muted" />
					</Button>
				</View>
				<Text className="font-display text-[28px] leading-9 text-foreground">
					{isSignUp ? 'Create your account' : 'Welcome back'}
				</Text>
				<Typography.Paragraph color="muted" className="text-[15px]">
					{isSignUp
						? 'One account for your cases, wherever you are.'
						: 'Your cases and updates are right where you left them.'}
				</Typography.Paragraph>
			</View>
			{providerLoadState === 'stalled' ? (
				<Typography.Paragraph color="muted" className="text-sm">
					{SLOW_LOAD_RETRY_MESSAGE} Email sign-in is still available.
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
								onPress={() => handleSocialAuth(provider)}
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
				{isSignUp ? (
					<TextField>
						<Label>Name</Label>
						<Input
							accessibilityLabel="Name"
							value={name}
							onChangeText={setName}
							placeholder="Jane Doe"
							autoCapitalize="words"
							textContentType="name"
							returnKeyType="done"
							editable={!pending}
						/>
					</TextField>
				) : null}

				<TextField>
					<Label>Email</Label>
					<Input
						accessibilityLabel="Email"
						value={email}
						onChangeText={setEmail}
						placeholder="you@example.com"
						autoCapitalize="none"
						autoComplete="email"
						keyboardType="email-address"
						textContentType="emailAddress"
						returnKeyType="done"
						editable={!pending}
					/>
				</TextField>

				<TextField>
					<Label>Password</Label>
					<PasswordInput
						key={mode}
						accessibilityLabel="Password"
						value={password}
						onChangeText={setPassword}
						placeholder="Enter your password"
						autoCapitalize="none"
						textContentType={isSignUp ? 'newPassword' : 'password'}
						editable={!pending}
						onSubmitEditing={handleEmailAuth}
						submitBehavior="submit"
						returnKeyType="done"
					/>
				</TextField>

				<Button
					className="mt-tight h-auto min-h-12 py-control"
					isDisabled={pending}
					onPress={handleEmailAuth}
				>
					<Button.Label className="shrink text-center">
						{pending
							? isSignUp
								? 'Creating account…'
								: 'Signing in…'
							: isSignUp
								? 'Create account'
								: 'Sign in'}
					</Button.Label>
				</Button>

				<Button
					variant="ghost"
					className="h-auto min-h-12 py-control"
					isDisabled={pending}
					onPress={() => {
						setMode(isSignUp ? 'sign-in' : 'sign-up')
						setPassword('')
					}}
				>
					<Button.Label className="shrink text-center">
						{isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
					</Button.Label>
				</Button>
				{isSignUp && !PASSWORD_RECOVERY_ENABLED ? (
					<View className="rounded-2xl border border-warning/30 bg-warning/10 px-card py-control">
						<Text className="font-medium text-sm leading-relaxed text-foreground">
							No password reset in this version — store your password somewhere safe.
						</Text>
					</View>
				) : null}

				{!isSignUp && PASSWORD_RECOVERY_ENABLED ? (
					<Button
						variant="ghost"
						isDisabled={pending}
						onPress={() => router.push('/forgot-password')}
					>
						<Button.Label className="shrink text-center">Forgot password?</Button.Label>
					</Button>
				) : null}
			</View>
		</KeyboardAwareScrollView>
	)
}
