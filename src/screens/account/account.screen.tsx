import { TempAccountCard, useAccountSession, useViewer } from '@/components/account'
import { BodyScrollView } from '@/components/core'
import { styledIcon, type StyledIconComponent } from '@/components/styled-icon'
import {
	APPLE_MANUAL_REVOCATION_INSTRUCTIONS,
	confirmAndDeleteSocialAccount,
	reconcileAmbiguousAccountDeletion,
	resolveAccountDeletionMode,
	resolveCredentialedDeletionMethod,
	socialDeletionOAuthAdditionalData,
	type SocialDeletionProvider,
} from '@/lib/account-deletion'
import { authClient } from '@/lib/auth-client'
import { humanErrorMessage } from '@/lib/error-message'
import { RELEASE_FEATURES } from '@/lib/release-policy'
import { ensureSessionResolved, ensureSignedOutAfterDeletion } from '@/lib/session-sync'
import { useMyBlocks, useUnblockAuthor } from '@/screens/community/community.data'
import { api } from '@convex/_generated/api'
import { useAction, useConvex } from 'convex/react'
import * as Crypto from 'expo-crypto'
import { router, type Href } from 'expo-router'
import { Avatar, Button, ListGroup, Separator, Typography } from 'heroui-native'
import { useEffect, useState } from 'react'
import { Alert, Platform, View } from 'react-native'

/** Initials for the avatar — first letters of up to two name words. */
function initialsFor(name: string | undefined): string {
	const words = (name ?? '').trim().split(/\s+/).filter(Boolean)
	if (words.length === 0) return '?'
	return words
		.slice(0, 2)
		.map((word) => word[0]!.toUpperCase())
		.join('')
}

const PROVIDER_LABELS: Record<string, string> = {
	google: 'Google',
	apple: 'Apple',
	credential: 'Email & password',
}

type LinkedAccountState = {
	providerIds: string[] | undefined
	label: string | null
}

/** The linked sign-in method(s), e.g. "Google" — loaded once per session. */
function useLinkedAccounts(isCredentialed: boolean): LinkedAccountState {
	const [providerIds, setProviderIds] = useState<string[] | undefined>()
	useEffect(() => {
		if (!isCredentialed) return
		let cancelled = false
		void authClient
			.listAccounts()
			.then(({ data }) => {
				if (cancelled || !data) return
				setProviderIds([...new Set(data.map((account) => account.providerId))])
			})
			.catch(() => {
				// Fail closed for deletion when the linked method cannot be verified.
				if (!cancelled) setProviderIds([])
			})
		return () => {
			cancelled = true
		}
	}, [isCredentialed])
	if (!isCredentialed) return { providerIds: [], label: null }
	const labels = providerIds?.map((id) => PROVIDER_LABELS[id] ?? id) ?? []
	return { providerIds, label: labels.length > 0 ? labels.join(', ') : null }
}

/**
 * Who you are, at a glance (M7-T3): avatar, name, and how you're signed in.
 * The name comes from the Better Auth user record — the same source every
 * greeting reads (useViewer) — so an edit elsewhere shows up here the moment
 * it saves.
 */
function IdentityPreview() {
	const { isTemp } = useViewer()
	const { data } = authClient.useSession()
	const user = data?.user

	return (
		<View className="items-center gap-control pt-tight">
			<Avatar size="lg" variant="soft" color="accent" alt="Your account">
				<Avatar.Fallback>
					<Typography.Heading className="text-xl text-accent">
						{isTemp ? '·' : initialsFor(user?.name)}
					</Typography.Heading>
				</Avatar.Fallback>
			</Avatar>
			<View className="items-center gap-hairline">
				<Typography.Heading className="font-display text-2xl">
					{isTemp ? 'Welcome' : (user?.name ?? 'Welcome back')}
				</Typography.Heading>
				<Typography.Paragraph color="muted" className="text-sm">
					{isTemp ? 'Temporary account' : (user?.email ?? '')}
				</Typography.Paragraph>
			</View>
		</View>
	)
}

type Row = {
	icon: StyledIconComponent
	title: string
	/** Push destination; omitted for rows that run `onPress` instead. */
	href?: Href
	onPress?: () => void
	/** Static value shown on the right instead of a disclosure chevron. */
	value?: string
	destructive?: boolean
}

const PROFILE_ROWS: Row[] = [
	{
		icon: styledIcon({ family: 'lucide', name: 'user-round' }),
		title: 'Personal details',
		href: '/account/details',
	},
	{
		icon: styledIcon({ family: 'lucide', name: 'folder' }),
		title: 'Documents',
		href: '/account/documents',
	},
]

const HELP_ROWS: Row[] = [
	{
		icon: styledIcon({ family: 'lucide', name: 'life-buoy' }),
		title: 'Support',
		href: '/account/support' as Href,
	},
	{
		icon: styledIcon({ family: 'lucide', name: 'shield-check' }),
		title: 'Privacy policy',
		href: '/account/privacy' as Href,
	},
	{
		icon: styledIcon({ family: 'lucide', name: 'file-text' }),
		title: 'Terms of use',
		href: '/account/terms' as Href,
	},
]

function RowGroup({ label, rows }: { label?: string; rows: Row[] }) {
	return (
		<View className="gap-tight">
			{label ? (
				<Typography.Paragraph color="muted" className="ml-hairline text-sm">
					{label}
				</Typography.Paragraph>
			) : null}
			<ListGroup>
				{rows.map((row, index) => {
					const Icon = row.icon
					const interactive = row.href !== undefined || row.onPress !== undefined
					return (
						<View key={row.title}>
							{index > 0 ? <Separator className="mx-card" /> : null}
							<ListGroup.Item
								// Informational rows (e.g. "Signed in with") must not announce
								// as tappable, and an explicit label suppresses the sibling
								// value text for screen readers, so fold it in.
								accessibilityRole={interactive ? 'button' : 'text'}
								accessibilityLabel={
									row.value !== undefined ? `${row.title}, ${row.value}` : row.title
								}
								onPress={
									interactive
										? () => {
												if (row.onPress) row.onPress()
												else if (row.href) router.push(row.href)
											}
										: undefined
								}
							>
								<ListGroup.ItemPrefix>
									<Icon size={20} className={row.destructive ? 'text-danger' : 'text-muted'} />
								</ListGroup.ItemPrefix>
								<ListGroup.ItemContent>
									<ListGroup.ItemTitle className={row.destructive ? 'text-danger' : undefined}>
										{row.title}
									</ListGroup.ItemTitle>
								</ListGroup.ItemContent>
								{row.value !== undefined ? (
									<Typography.Paragraph color="muted" className="text-sm">
										{row.value}
									</Typography.Paragraph>
								) : row.href !== undefined ? (
									<ListGroup.ItemSuffix />
								) : null}
							</ListGroup.Item>
						</View>
					)
				})}
			</ListGroup>
		</View>
	)
}

/** Blocked community authors (M4-T3): handles only, with one-tap unblock.
 * Rendered only while the community feature ships (the hooks query gated
 * endpoints) and hidden entirely while the viewer has no blocks. */
function BlockedAuthorsSection() {
	const blocks = useMyBlocks()
	const unblockAuthor = useUnblockAuthor()
	if (blocks === undefined || blocks.length === 0) return null
	return (
		<View className="gap-control">
			<Typography.Paragraph color="muted" className="ml-hairline text-sm">
				Blocked in Community
			</Typography.Paragraph>
			{blocks.map((block) => (
				<View key={block.profileId} className="flex-row items-center justify-between gap-control">
					<Typography.Paragraph className="flex-1 font-medium">{block.handle}</Typography.Paragraph>
					<Button
						size="sm"
						variant="secondary"
						onPress={() =>
							void unblockAuthor({ profileId: block.profileId }).catch((error: unknown) => {
								Alert.alert(
									'Unblock',
									humanErrorMessage(error, 'Could not unblock right now. Please try again.'),
								)
							})
						}
					>
						<Button.Label>Unblock</Button.Label>
					</Button>
				</View>
			))}
		</View>
	)
}

function confirmSignOut(providerLabel: string | null) {
	const method = providerLabel ?? 'your sign-in method'
	Alert.alert('Sign out?', `You can sign back in with ${method} anytime.`, [
		{ text: 'Cancel', style: 'cancel' },
		{
			text: 'Sign out',
			style: 'destructive',
			onPress: () =>
				void authClient
					.signOut({ fetchOptions: { disableSignal: true } })
					.catch((error: unknown) => {
						Alert.alert(
							'Sign out',
							humanErrorMessage(error, 'Could not sign out right now. Please try again.'),
						)
					}),
		},
	])
}

/**
 * Permanent in-app account deletion, presented Apple-style: a red row, a
 * confirm alert, and (for credentialed accounts) a secure password prompt.
 *
 * Every mode calls one Convex action that revalidates the Better Auth session,
 * verifies password/social proof when applicable, revokes Apple authorization,
 * purges app data behind a tombstone, and finally removes the auth identity.
 */
function useDeleteAccountRow(linkedProviderIds: string[] | undefined): {
	busy: boolean
	confirmDelete: () => void
} {
	const { isCredentialed, isPending } = useAccountSession()
	const convex = useConvex()
	const beginSocialAccountDeletion = useAction(api.auth.beginSocialAccountDeletion)
	const deleteAccount = useAction(api.auth.deleteAccount)
	const [busy, setBusy] = useState(false)
	const deletionMode = resolveAccountDeletionMode(isPending, isCredentialed)
	const credentialedMethod = resolveCredentialedDeletionMethod(linkedProviderIds)

	async function eraseAccount(password?: string) {
		setBusy(true)
		// A CSPRNG-backed capability lets the client reconcile a response lost
		// after the server durably accepted deletion without trusting session loss.
		const attemptId = Crypto.randomUUID()
		let serverDeletionRequested = false
		let appleManualRevokeRequired = false
		const appleWasLinked = linkedProviderIds?.includes('apple') === true
		try {
			if (deletionMode === 'temporary') {
				// Never infer deletion success from a missing client session: an
				// expired/offline anonymous session could still have server-owned data.
				// The server action is the sole source of truth for the whole cascade.
				serverDeletionRequested = true
				const deletion = await deleteAccount({
					attemptId,
					proof: { kind: 'anonymous' },
				})
				appleManualRevokeRequired = deletion.appleManualRevokeRequired
			} else if (credentialedMethod === 'password') {
				serverDeletionRequested = true
				const deletion = await deleteAccount({
					attemptId,
					proof: { kind: 'password', password: password ?? '' },
				})
				appleManualRevokeRequired = deletion.appleManualRevokeRequired
			} else if (typeof credentialedMethod === 'object') {
				const provider = credentialedMethod.provider
				const result = await confirmAndDeleteSocialAccount({
					provider,
					beginChallenge: (socialProvider: SocialDeletionProvider) =>
						beginSocialAccountDeletion({ provider: socialProvider }),
					reauthenticate: async (socialProvider: SocialDeletionProvider, challenge) => {
						const socialResult = await authClient.linkSocial({
							provider: socialProvider,
							callbackURL: '/',
							additionalData: socialDeletionOAuthAdditionalData(challenge),
							fetchOptions: { disableSignal: true },
						})
						return socialResult.error
							? {
									message:
										socialResult.error.message ??
										`Could not confirm with ${PROVIDER_LABELS[provider]}.`,
								}
							: null
					},
					resolveSession: ensureSessionResolved,
					deleteAccount: async (challenge) => {
						try {
							serverDeletionRequested = true
							const deletion = await deleteAccount({
								attemptId,
								proof: { kind: 'social', challenge },
							})
							return { error: null, ...deletion }
						} catch (error) {
							return {
								error: {
									message: humanErrorMessage(error, 'The account could not be deleted.'),
								},
							}
						}
					},
				})
				if (!result.ok) {
					throw new Error(
						result.reason === 'reauth-incomplete'
							? `${PROVIDER_LABELS[provider]} confirmation was not completed. Your account was not deleted.`
							: (result.message ?? 'The account could not be deleted.'),
					)
				}
				appleManualRevokeRequired = result.appleManualRevokeRequired
			} else {
				throw new Error('The sign-in method could not be verified. Please try again.')
			}
			// Drive the session atom to signed-out (rationale in ensureSignedOut):
			// the Convex action cannot clear Expo's local cookie, and without this
			// the app keeps rendering the deleted account until the cached Convex
			// JWT expires — a retried delete then hits 401.
			const signedOut = await ensureSignedOutAfterDeletion()
			if (!signedOut) {
				throw new Error(
					`Your account was deleted, but this device could not clear the old session. Please restart the app.${appleManualRevokeRequired ? ` ${APPLE_MANUAL_REVOCATION_INSTRUCTIONS}` : ''}`,
				)
			}
			if (appleManualRevokeRequired) {
				Alert.alert(
					'Remove Immifile from Apple',
					`Your Immifile account and data were deleted, but Apple did not provide a token that Immifile could revoke. ${APPLE_MANUAL_REVOCATION_INSTRUCTIONS}`,
				)
			}
		} catch (error) {
			const reconciliation = await reconcileAmbiguousAccountDeletion({
				deletionWasRequested: serverDeletionRequested,
				getDeletionStatus: () => convex.query(api.auth.getAccountDeletionStatus, { attemptId }),
				getAuthoritativeSession: async () => {
					const session = await authClient.getSession({
						query: { disableCookieCache: true },
						fetchOptions: { disableSignal: true },
					})
					return { data: session.data, error: session.error }
				},
				ensureSignedOut: ensureSignedOutAfterDeletion,
			})
			if (reconciliation.status !== 'not-confirmed') {
				const manualAppleCleanup =
					appleManualRevokeRequired || reconciliation.appleManualRevokeRequired || appleWasLinked
				if (reconciliation.status === 'pending') {
					Alert.alert(
						'Deletion accepted',
						`Your deletion request was securely accepted and is being completed. Your account is blocked from further use.${
							reconciliation.localSessionCleared
								? ''
								: ' This device could not clear the old session, so please restart the app.'
						}${manualAppleCleanup ? ` ${APPLE_MANUAL_REVOCATION_INSTRUCTIONS}` : ''}`,
					)
				} else if (!reconciliation.localSessionCleared) {
					Alert.alert(
						'Account deleted',
						`Your account and data were deleted, but this device could not clear the old session. Please restart the app.${manualAppleCleanup ? ` ${APPLE_MANUAL_REVOCATION_INSTRUCTIONS}` : ''}`,
					)
				} else if (manualAppleCleanup) {
					Alert.alert(
						'Remove Immifile from Apple',
						`Your Immifile account and data were deleted. Because the server response was interrupted, confirm the Apple authorization is removed too. ${APPLE_MANUAL_REVOCATION_INSTRUCTIONS}`,
					)
				} else {
					Alert.alert('Account deleted', 'Your account and data were deleted.')
				}
				return
			}
			Alert.alert(
				'Delete account',
				humanErrorMessage(error, 'Something went wrong. Please try again.'),
			)
		} finally {
			setBusy(false)
		}
	}

	function promptForPassword() {
		if (Platform.OS !== 'ios') {
			// Alert.prompt is iOS-only; this build ships iOS-first. Fail loud so a
			// future Android build gets a real password step instead of silence.
			Alert.alert('Delete account', 'Password confirmation is not available on this device yet.')
			return
		}
		Alert.prompt(
			'Confirm your password',
			'Enter your current password to permanently delete this account.',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: (password?: string) => {
						if (!password) {
							Alert.alert(
								'Password required',
								'Enter your current password to delete this account.',
							)
							return
						}
						void eraseAccount(password)
					},
				},
			],
			'secure-text',
		)
	}

	function confirmDelete() {
		if (
			busy ||
			deletionMode === 'loading' ||
			(deletionMode === 'credentialed' && credentialedMethod === 'loading')
		) {
			return
		}
		if (deletionMode === 'credentialed' && credentialedMethod === 'unsupported') {
			Alert.alert(
				'Could not verify sign-in method',
				'Please check your connection and try again before deleting this account.',
			)
			return
		}
		const socialProvider =
			deletionMode === 'credentialed' && typeof credentialedMethod === 'object'
				? credentialedMethod.provider
				: null
		const confirmationDetail = socialProvider
			? ` To confirm it’s you, Immifile will open ${PROVIDER_LABELS[socialProvider]} sign-in first.`
			: ''
		Alert.alert(
			'Delete your account?',
			`This permanently deletes your login account and all data associated with it, including saved cases and any previously stored Immifile data. It cannot be undone.${confirmationDetail}`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: socialProvider
						? `Continue with ${PROVIDER_LABELS[socialProvider]}`
						: deletionMode === 'credentialed'
							? 'Continue'
							: 'Delete everything',
					style: 'destructive',
					onPress: () => {
						if (deletionMode === 'credentialed' && credentialedMethod === 'password') {
							promptForPassword()
						} else void eraseAccount()
					},
				},
			],
		)
	}

	return { busy, confirmDelete }
}

/**
 * The Account tab root (M7-T3, reshaped for the App Store release): one calm
 * page in the shape people know from Uber/Instagram/Apple — identity up top,
 * then grouped single-line rows. The old Settings sub-screen is folded in
 * here: sign-in method, sign out, and delete account are rows, not a detour.
 */
export function AccountScreen() {
	const { isTemp } = useViewer()
	const { isCredentialed } = useAccountSession()
	const linkedAccounts = useLinkedAccounts(isCredentialed)
	const { busy, confirmDelete } = useDeleteAccountRow(linkedAccounts.providerIds)

	const accountRows: Row[] = [
		...(linkedAccounts.label !== null
			? [
					{
						icon: styledIcon({ family: 'lucide', name: 'key-round' }),
						title: 'Signed in with',
						value: linkedAccounts.label,
					} satisfies Row,
				]
			: []),
		{
			icon: styledIcon({ family: 'lucide', name: 'log-out' }),
			title: 'Sign out',
			onPress: () => confirmSignOut(linkedAccounts.label),
		},
	]

	const dangerRows: Row[] = [
		{
			icon: styledIcon({ family: 'lucide', name: 'trash-2' }),
			title: busy ? 'Deleting…' : 'Delete account',
			onPress: confirmDelete,
			destructive: true,
		},
	]

	// Keep native large-title inset behavior and enough trailing scroll range for
	// the destructive row to clear iOS's floating tab bar on compact screens.
	return (
		<BodyScrollView
			contentContainerClassName="gap-section pt-tight"
			bottomClearance={72}
			restoreLargeTitleOnTabReveal
		>
			<IdentityPreview />
			{isTemp ? <TempAccountCard /> : null}
			{RELEASE_FEATURES.filingPreparation ? (
				<RowGroup label="Your filing profile" rows={PROFILE_ROWS} />
			) : null}
			{isCredentialed ? <RowGroup label="Account" rows={accountRows} /> : null}
			{RELEASE_FEATURES.community ? <BlockedAuthorsSection /> : null}
			<RowGroup label="Help & legal" rows={HELP_ROWS} />
			<RowGroup rows={dangerRows} />
		</BodyScrollView>
	)
}
