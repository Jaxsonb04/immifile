import { useRequireAccount } from '@/components/account'
import { BodyScrollView, ScreenError, ScreenLoading } from '@/components/core'
import { StyledLucideIcon } from '@/components/styled-icon'
import { runAccountGatedAction } from '@/lib/account-gated-action'
import {
	documentTypeLabel,
	formatIsoDate,
	requirementLabel,
	situationLabel,
} from '@/lib/application-labels'
import { isoToOption } from '@/lib/date-picker'
import { pickAndUploadFile } from '@/lib/document-upload'
import { humanErrorMessage } from '@/lib/error-message'
import type { Id } from '@convex/_generated/dataModel'
import type { Href } from 'expo-router'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { Alert, Button, Chip, Label, Separator, Surface, Typography } from 'heroui-native'
import { Calendar } from 'heroui-native-pro/calendar'
import { DatePicker } from 'heroui-native-pro/date-picker'
import { useState } from 'react'
import { Alert as RNAlert, Pressable, View } from 'react-native'
import type { DocumentDetail } from './documents.detail.data'
import {
	useDeleteDocument,
	useDocumentDetail,
	useGenerateUploadUrl,
	useUpdateDocumentExpiry,
	useUploadNewVersion,
} from './documents.detail.data'

/** Past its expiry date. Expired ≠ unusable — an I-765 renewal attaches the
 * very card that's expiring — so this is informational, never a block. */
function isExpired(expiryDate: string | undefined): boolean {
	if (!expiryDate) return false
	return new Date(`${expiryDate}T23:59:59`).getTime() < Date.now()
}

/** Inline expiry editor: every change saves immediately (no separate Save
 * step — matches the picker's own "pick and it's done" affordance), with a
 * Clear action since expiry is optional and not every document has one. */
function ExpirySection({
	documentId,
	expiryDate,
}: {
	documentId: Id<'documents'>
	expiryDate?: string
}) {
	const updateExpiry = useUpdateDocumentExpiry()
	const [draft, setDraft] = useState(expiryDate)
	const [busy, setBusy] = useState(false)

	async function save(next: string | undefined) {
		const previous = draft
		setDraft(next)
		setBusy(true)
		try {
			await updateExpiry({ documentId, expiryDate: next })
		} catch (error) {
			setDraft(previous)
			RNAlert.alert("Couldn't update expiry", humanErrorMessage(error))
		} finally {
			setBusy(false)
		}
	}

	return (
		<View className="gap-tight">
			<DatePicker
				value={isoToOption(draft)}
				onValueChange={(option) => void save(option?.value)}
				isDisabled={busy}
			>
				<Label>Expiry date</Label>
				<DatePicker.Select>
					<DatePicker.Trigger>
						<DatePicker.Value placeholder="No expiry set" />
						<DatePicker.TriggerIndicator />
					</DatePicker.Trigger>
					<DatePicker.Portal>
						<DatePicker.Overlay />
						<DatePicker.Content presentation="popover" width="trigger">
							<DatePicker.Calendar>
								<Calendar.Header>
									<Calendar.YearPickerTrigger>
										<Calendar.YearPickerTriggerHeading />
										<Calendar.YearPickerTriggerIndicator />
									</Calendar.YearPickerTrigger>
									<Calendar.NavButton slot="previous" />
									<Calendar.NavButton slot="next" />
								</Calendar.Header>
								<Calendar.Grid>
									<Calendar.GridHeader>
										{(day) => <Calendar.HeaderCell day={day} />}
									</Calendar.GridHeader>
									<Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
								</Calendar.Grid>
								<Calendar.YearPickerGrid>
									<Calendar.YearPickerGridBody>
										{({ year, isSelected }) => (
											<Calendar.YearPickerCell year={year} isSelected={isSelected} />
										)}
									</Calendar.YearPickerGridBody>
								</Calendar.YearPickerGrid>
							</DatePicker.Calendar>
						</DatePicker.Content>
					</DatePicker.Portal>
				</DatePicker.Select>
			</DatePicker>
			{draft !== undefined ? (
				<Pressable accessibilityRole="button" disabled={busy} onPress={() => void save(undefined)}>
					<Typography.Paragraph className="text-sm text-accent">Clear expiry</Typography.Paragraph>
				</Pressable>
			) : null}
		</View>
	)
}

function AttachedToList({ attachedTo }: { attachedTo: DocumentDetail['attachedTo'] }) {
	const router = useRouter()
	if (attachedTo.length === 0) return null
	return (
		<View className="gap-tight">
			<Typography.Heading className="text-base font-semibold">Currently used by</Typography.Heading>
			{attachedTo.map((entry, index) => (
				<Pressable
					key={`${entry.applicationId}-${index}`}
					accessibilityRole="button"
					onPress={() => router.push(`/application/${entry.applicationId}` as Href)}
				>
					<Surface
						variant="secondary"
						className="flex-row items-center gap-control rounded-2xl p-card"
					>
						<View className="flex-1">
							<Typography.Paragraph className="font-medium">
								{situationLabel(entry.formType, entry.applicationKind).primary}
							</Typography.Paragraph>
							<Typography.Paragraph color="muted" className="text-sm">
								{requirementLabel(entry.requirementKey)}
							</Typography.Paragraph>
						</View>
						<StyledLucideIcon name="chevron-right" size={16} className="text-muted" />
					</Surface>
				</Pressable>
			))}
		</View>
	)
}

function ManageSection({ detail }: { detail: DocumentDetail }) {
	const router = useRouter()
	const requireAccount = useRequireAccount()
	const generateUploadUrl = useGenerateUploadUrl()
	const uploadNewVersion = useUploadNewVersion()
	const deleteDocument = useDeleteDocument()
	const [busy, setBusy] = useState(false)
	const isAttached = detail.attachedTo.length > 0

	async function replace() {
		try {
			await runAccountGatedAction(
				requireAccount,
				{
					title: 'Create an account before replacing this file',
					description:
						'Immigration documents contain sensitive information. Create an account or continue with Google first; your saved work will carry over.',
				},
				async () => {
					setBusy(true)
					try {
						const picked = await pickAndUploadFile(() => generateUploadUrl({}))
						if (picked === null) return
						await uploadNewVersion({
							supersedesId: detail._id,
							storageId: picked.storageId,
							label: picked.fileName,
						})
						router.back()
					} finally {
						setBusy(false)
					}
				},
			)
		} catch (error) {
			RNAlert.alert("Couldn't replace document", humanErrorMessage(error))
		}
	}

	function confirmDelete() {
		RNAlert.alert(
			'Delete this document?',
			'This permanently removes the file from your Vault. This cannot be undone.',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					// Leave the screen before the delete commits, matching the
					// application-delete precedent: the live query behind this
					// screen is null-safe, so a fallback renders instead of a crash
					// if it re-fires before navigation finishes.
					onPress: () => {
						router.back()
						void deleteDocument({ documentId: detail._id }).catch((error) => {
							RNAlert.alert("Couldn't delete", humanErrorMessage(error))
						})
					},
				},
			],
		)
	}

	return (
		<View className="gap-tight">
			<Typography.Heading className="text-base font-semibold">Manage</Typography.Heading>

			{isAttached ? (
				<Alert status="default">
					<Alert.Indicator />
					<Alert.Content>
						<Alert.Title>Attached to an application</Alert.Title>
						<Alert.Description>
							Detach this document from the application{detail.attachedTo.length > 1 ? 's' : ''}{' '}
							listed above before deleting it.
						</Alert.Description>
					</Alert.Content>
				</Alert>
			) : null}

			{detail.isCurrent ? (
				<Button variant="secondary" isDisabled={busy} onPress={() => void replace()}>
					<Button.Label>{busy ? 'Replacing…' : 'Replace file'}</Button.Label>
				</Button>
			) : null}
			<Button variant="ghost" isDisabled={busy || isAttached} onPress={confirmDelete}>
				<Button.Label>Delete document</Button.Label>
			</Button>
		</View>
	)
}

export function DocumentDetailScreen({ documentId }: { documentId: Id<'documents'> }) {
	const detail = useDocumentDetail(documentId)

	if (detail === undefined) return <ScreenLoading />
	if (detail === null) {
		return (
			<ScreenError title="Document not found" description="It may have already been deleted." />
		)
	}

	return (
		<BodyScrollView contentContainerClassName="gap-section pt-card">
			<View className="gap-hairline">
				<View className="flex-row items-center gap-tight">
					<Typography.Heading className="text-2xl font-semibold">
						{detail.label ?? documentTypeLabel(detail.type)}
					</Typography.Heading>
					{!detail.isCurrent ? (
						<Chip size="sm" variant="soft">
							<Chip.Label>Replaced</Chip.Label>
						</Chip>
					) : null}
				</View>
				<Typography.Paragraph color="muted">
					{detail.applicantName} · {documentTypeLabel(detail.type)}
				</Typography.Paragraph>
				{detail.expiryDate !== undefined ? (
					<Typography.Paragraph
						color={isExpired(detail.expiryDate) ? 'default' : 'muted'}
						className={`text-sm ${isExpired(detail.expiryDate) ? 'text-danger' : ''}`}
					>
						{isExpired(detail.expiryDate) ? 'Expired' : 'Expires'}{' '}
						{formatIsoDate(detail.expiryDate)}
					</Typography.Paragraph>
				) : null}
			</View>

			<Button
				variant="secondary"
				isDisabled={detail.url === null}
				onPress={() => {
					if (detail.url !== null) void WebBrowser.openBrowserAsync(detail.url)
				}}
			>
				<Button.Label>View document</Button.Label>
			</Button>

			<Separator />
			<ExpirySection documentId={detail._id} expiryDate={detail.expiryDate} />

			<AttachedToList attachedTo={detail.attachedTo} />

			<Separator />
			<ManageSection detail={detail} />
		</BodyScrollView>
	)
}
