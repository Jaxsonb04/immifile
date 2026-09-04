import { UpgradeActions } from '@/components/account/upgrade/upgrade.actions'
import { useCredentialedAccountReadiness } from '@/components/account/account.session'
import { BodyScrollView } from '@/components/core'
import { situationLabel } from '@/lib/application-labels'
import { humanErrorMessage } from '@/lib/error-message'
import { RELEASE_FEATURES, releaseApplicationLink } from '@/lib/release-policy'
import type { Id } from '@convex/_generated/dataModel'
import { isValidReceiptNumber, normalizeReceiptNumber } from '@convex/shared/applicationShapes'
import { router } from 'expo-router'
import { Button, FieldError, Input, Label, Surface, TextField, Typography } from 'heroui-native'
import { useRef, useState } from 'react'
import { Alert, Keyboard, Pressable, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { StyledLucideIcon } from '@/components/styled-icon'
import { useCreateCase, useLinkableApplications, type LinkableApplication } from './cases.data'

function ApplicationOption(props: {
	application: LinkableApplication
	selected: boolean
	onPress: () => void
}) {
	const { application, selected, onPress } = props
	const label = situationLabel(application.formType, application.applicationKind)
	return (
		<Pressable accessibilityRole="button" onPress={onPress}>
			<Surface
				variant={selected ? 'default' : 'secondary'}
				className="flex-row items-center gap-control rounded-xl p-control"
			>
				<StyledLucideIcon
					name={selected ? 'circle-check' : 'circle'}
					size={20}
					className={selected ? 'text-accent' : 'text-muted'}
				/>
				<View className="flex-1">
					<Typography.Paragraph className="font-medium">{label.primary}</Typography.Paragraph>
					<Typography.Paragraph color="muted" className="text-sm">
						{application.applicantName} · {application.status === 'filed' ? 'Filed' : 'Draft'}
					</Typography.Paragraph>
				</View>
			</Surface>
		</Pressable>
	)
}

/** Create-case modal (M3-T2): enter a USCIS receipt number and optionally link
 * a filed application, then track it. */
export function NewCaseScreen() {
	const { isCredentialedReady } = useCredentialedAccountReadiness()
	const createCase = useCreateCase()
	const applications = useLinkableApplications(RELEASE_FEATURES.filingPreparation)
	const [receipt, setReceipt] = useState('')
	const [linkedId, setLinkedId] = useState<Id<'applications'> | null>(null)
	const [showError, setShowError] = useState(false)
	const [busy, setBusy] = useState(false)
	const savingRef = useRef(false)
	const [showAccountSetup, setShowAccountSetup] = useState(false)
	const [accountMode, setAccountMode] = useState<'create' | 'sign-in'>('create')

	const normalized = normalizeReceiptNumber(receipt)
	const isValid = isValidReceiptNumber(normalized)

	function submit() {
		if (savingRef.current) return
		if (!isValid) {
			setShowError(true)
			return
		}
		Keyboard.dismiss()
		if (!isCredentialedReady) {
			setShowAccountSetup(true)
			return
		}
		void save()
	}

	async function save() {
		if (savingRef.current) return
		savingRef.current = true
		setBusy(true)
		try {
			await createCase({
				receiptNumber: normalized,
				applicationId: releaseApplicationLink(linkedId),
			})
			if (router.canGoBack()) router.back()
			else router.replace('/(tabs)/cases')
		} catch (error) {
			Alert.alert('Could not add case', humanErrorMessage(error, 'Please try again.'))
		} finally {
			savingRef.current = false
			setBusy(false)
		}
	}

	// This screen is already a native modal. The app-root upgrade sheet sits
	// behind it, so present account setup inside this modal and retain the receipt.
	if (showAccountSetup) {
		return (
			<KeyboardAwareScrollView
				contentContainerClassName="gap-section p-gutter pb-16"
				keyboardShouldPersistTaps="handled"
				keyboardDismissMode="on-drag"
				bottomOffset={24}
			>
				<View className="gap-tight">
					<Typography.Heading className="text-2xl font-semibold">
						{accountMode === 'create'
							? 'Create an account to save a case'
							: 'Sign in to save this case'}
					</Typography.Heading>
					<Typography.Paragraph color="muted">
						Your receipt number will be saved after you sign in. A permanent account keeps your
						cases available across devices.
					</Typography.Paragraph>
				</View>
				<UpgradeActions
					onModeChange={setAccountMode}
					onUpgraded={() => {
						setShowAccountSetup(false)
						void save()
					}}
				/>
				<Button
					variant="ghost"
					onPress={() => {
						setShowAccountSetup(false)
						setAccountMode('create')
					}}
				>
					<Button.Label>Back to receipt number</Button.Label>
				</Button>
			</KeyboardAwareScrollView>
		)
	}

	return (
		<BodyScrollView contentContainerClassName="gap-section py-gutter">
			<View className="gap-hairline">
				<Typography.Paragraph color="muted">
					Save the USCIS receipt number from your notice for quick access. Immifile does not
					automatically receive status updates from USCIS.
				</Typography.Paragraph>
			</View>

			<TextField isInvalid={showError && !isValid}>
				<Label>USCIS receipt number</Label>
				<Input
					accessibilityLabel="USCIS receipt number"
					value={receipt}
					onChangeText={(value) => {
						setReceipt(value)
						if (showError) setShowError(false)
					}}
					placeholder="e.g. EAC1234567890"
					autoCapitalize="characters"
					autoCorrect={false}
				/>
				{showError && !isValid ? (
					<FieldError>
						Enter a receipt number like EAC1234567890 — 3 letters and 10 digits.
					</FieldError>
				) : null}
			</TextField>

			{RELEASE_FEATURES.filingPreparation && applications && applications.length > 0 ? (
				<View className="gap-tight">
					<Typography.Heading className="text-base font-semibold">
						Link an application (optional)
					</Typography.Heading>
					<Typography.Paragraph color="muted" className="text-sm">
						A receipt number means USCIS received your filing — linking a draft marks it as filed.
					</Typography.Paragraph>
					{applications.map((application) => (
						<ApplicationOption
							key={application._id}
							application={application}
							selected={linkedId === application._id}
							onPress={() =>
								setLinkedId((current) => (current === application._id ? null : application._id))
							}
						/>
					))}
				</View>
			) : null}

			<Button isDisabled={busy || normalized.length === 0} onPress={submit}>
				<Button.Label>{busy ? 'Adding…' : 'Track this case'}</Button.Label>
			</Button>
		</BodyScrollView>
	)
}
