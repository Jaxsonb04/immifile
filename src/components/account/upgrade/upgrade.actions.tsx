import { authClient } from '@/lib/auth-client'
import { PASSWORD_RECOVERY_ENABLED } from '@/lib/password-recovery'
import { ensureSessionResolved } from '@/lib/session-sync'
import { useRouter } from 'expo-router'
import { Button, Input, Label, Spinner, TextField, Typography } from 'heroui-native'
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
			const { error } = isCreating
				? await authClient.signUp.email({
						name: name.trim(),
						email: email.trim(),
						password,
					})
				: await authClient.signIn.email({
						email: email.trim(),
						password,
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
			const resolved = await ensureSessionResolved()
			if (!resolved) {
				Alert.alert('Almost there', "We couldn't finish loading your account. Please try again.")
			}
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

	return (
		<View className="gap-section">
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
						textContentType={mode === 'create' ? 'newPassword' : 'password'}
						editable={!pending}
					/>
				</TextField>
			</View>

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
