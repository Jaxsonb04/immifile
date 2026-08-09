import { authClient } from '@/lib/auth-client'
import { PASSWORD_RECOVERY_ENABLED } from '@/lib/password-recovery'
import { ensureSessionResolved } from '@/lib/session-sync'
import { useRouter } from 'expo-router'
import { Button, Input, Label, TextField, Typography } from 'heroui-native'
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
			const { error } = isSignUp
				? await authClient.signUp.email({ name: name.trim(), email: email.trim(), password })
				: await authClient.signIn.email({ email: email.trim(), password })

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
			const resolved = await ensureSessionResolved()
			if (!resolved) {
				Alert.alert('Almost there', "We couldn't finish loading your session. Please try again.")
			}
		} catch (err) {
			Alert.alert('Something went wrong', err instanceof Error ? err.message : 'Please try again.')
		} finally {
			setPending(false)
		}
	}

	return (
		<KeyboardAwareScrollView
			contentContainerClassName="p-gutter gap-card"
			keyboardDismissMode="on-drag"
			keyboardShouldPersistTaps="handled"
			contentInsetAdjustmentBehavior="automatic"
		>
			<View className="gap-hairline pt-hairline">
				<Text className="font-display text-title text-foreground">
					{isSignUp ? 'Create your account' : 'Welcome back'}
				</Text>
				<Typography.Paragraph color="muted" className="text-[15px]">
					{isSignUp
						? 'Save cases and keep your account across devices.'
						: 'Sign in to return to your saved cases.'}
				</Typography.Paragraph>
			</View>

			<View className="gap-card">
				{isSignUp ? (
					<TextField>
						<Label>Name</Label>
						<Input
							value={name}
							onChangeText={setName}
							placeholder="Jane Doe"
							autoCapitalize="words"
							textContentType="name"
							editable={!pending}
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
						textContentType={isSignUp ? 'newPassword' : 'password'}
						editable={!pending}
						onSubmitEditing={handleEmailAuth}
						submitBehavior="submit"
						returnKeyType="done"
					/>
				</TextField>

				<Button isDisabled={pending} onPress={handleEmailAuth}>
					<Button.Label>
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
					isDisabled={pending}
					onPress={() => setMode(isSignUp ? 'sign-in' : 'sign-up')}
				>
					<Button.Label>
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
						<Button.Label>Forgot password?</Button.Label>
					</Button>
				) : null}
			</View>
		</KeyboardAwareScrollView>
	)
}
