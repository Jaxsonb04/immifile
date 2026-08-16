import { BodyScrollView, ScreenError, ScreenLoading } from '@/components/core'
import { StyledLucideIcon } from '@/components/styled-icon'
import { caseStatusLabels } from '@/lib/application-labels'
import { humanErrorMessage } from '@/lib/error-message'
import type { Id } from '@convex/_generated/dataModel'
import { caseStatuses, type CaseStatus } from '@convex/shared/applicationShapes'
import { CASE_NOTE_MAX } from '@convex/shared/cases'
import * as Clipboard from 'expo-clipboard'
import { router } from 'expo-router'
import {
	Alert,
	Button,
	Chip,
	Input,
	Separator,
	Surface,
	TextField,
	Typography,
} from 'heroui-native'
import { useState } from 'react'
import { Alert as RNAlert, Linking, Pressable, View } from 'react-native'
import {
	formatCaseDate,
	statusTone,
	useAddStatusUpdate,
	useCase,
	useDeleteCase,
	type CaseDetail,
} from './cases.data'
import { copyReceiptAndOpenUscis } from './uscis-case-status'

const DOT_COLOR = { attention: 'bg-warning', positive: 'bg-success', neutral: 'bg-muted' } as const

type TimelineEntry = CaseDetail['statusHistory'][number]

function TimelineRow({ entry, isLatest }: { entry: TimelineEntry; isLatest: boolean }) {
	const tone = statusTone(entry.status)
	return (
		<View className="flex-row gap-control">
			<View className="items-center pt-hairline">
				<View className={`h-3 w-3 rounded-full ${DOT_COLOR[tone]}`} />
			</View>
			<View className="flex-1 gap-hairline pb-card">
				<Typography.Paragraph className={isLatest ? 'font-semibold' : 'font-medium'}>
					{caseStatusLabels[entry.status]}
				</Typography.Paragraph>
				<Typography.Paragraph color="muted" className="text-xs tabular-nums">
					{formatCaseDate(entry.occurredAt)}
				</Typography.Paragraph>
				{entry.note ? (
					<Typography.Paragraph className="text-sm leading-relaxed">
						{entry.note}
					</Typography.Paragraph>
				) : null}
			</View>
		</View>
	)
}

function AddUpdate({ caseId }: { caseId: Id<'cases'> }) {
	const addStatusUpdate = useAddStatusUpdate()
	const [open, setOpen] = useState(false)
	const [status, setStatus] = useState<CaseStatus | null>(null)
	const [note, setNote] = useState('')
	const [busy, setBusy] = useState(false)

	async function save() {
		if (status === null) return
		setBusy(true)
		try {
			await addStatusUpdate({ caseId, status, note: note.trim() || undefined })
			setOpen(false)
			setStatus(null)
			setNote('')
		} catch (error) {
			RNAlert.alert('Could not add update', humanErrorMessage(error, 'Try again.'))
		} finally {
			setBusy(false)
		}
	}

	if (!open) {
		return (
			<Button variant="secondary" onPress={() => setOpen(true)}>
				<Button.Label>Add a status update</Button.Label>
			</Button>
		)
	}

	return (
		<Surface variant="secondary" className="gap-control rounded-2xl p-card">
			<Typography.Paragraph className="font-medium">New status</Typography.Paragraph>
			<View className="flex-row flex-wrap gap-tight">
				{caseStatuses.map((option) => (
					<Chip
						key={option}
						variant={status === option ? 'primary' : 'soft'}
						color="accent"
						onPress={() => setStatus(option)}
					>
						<Chip.Label>{caseStatusLabels[option]}</Chip.Label>
					</Chip>
				))}
			</View>
			<TextField>
				<Input
					value={note}
					onChangeText={setNote}
					placeholder="Add a note (optional)"
					multiline
					maxLength={CASE_NOTE_MAX}
					className="min-h-11"
				/>
			</TextField>
			<View className="flex-row gap-tight">
				<Button variant="ghost" className="flex-1" isDisabled={busy} onPress={() => setOpen(false)}>
					<Button.Label>Cancel</Button.Label>
				</Button>
				<Button className="flex-[2]" isDisabled={busy || status === null} onPress={save}>
					<Button.Label>{busy ? 'Saving…' : 'Save update'}</Button.Label>
				</Button>
			</View>
		</Surface>
	)
}

/** Case detail (M3-T2): current status, timeline, official USCIS link, RFE
 * emphasis, and manual status updates. */
export function CaseDetailScreen({ caseId }: { caseId: Id<'cases'> }) {
	const detail = useCase(caseId)
	const deleteCase = useDeleteCase()

	if (detail === undefined) return <ScreenLoading />
	if (detail === null) return <ScreenError title="Case not found" />

	const isRfe = detail.status === 'requestForEvidence'
	const receiptNumber = detail.receiptNumber
	const timeline = [...detail.statusHistory].sort((a, b) => b.occurredAt - a.occurredAt)

	function confirmDelete() {
		RNAlert.alert(
			'Remove this case?',
			'This permanently deletes the receipt number and the timeline you entered from Immifile. It does not affect the case at USCIS.',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Remove case',
					style: 'destructive',
					onPress: () => {
						void deleteCase({ caseId })
							.then(() => router.back())
							.catch((error) => {
								RNAlert.alert(
									'Could not remove case',
									humanErrorMessage(error, 'Please try again.'),
								)
							})
					},
				},
			],
		)
	}

	async function openOfficialStatus() {
		try {
			await copyReceiptAndOpenUscis(receiptNumber, {
				clipboard: Clipboard,
				linking: Linking,
			})
		} catch (error) {
			RNAlert.alert(
				'Could not open USCIS',
				humanErrorMessage(error, 'Copy the receipt number and try again.'),
			)
		}
	}

	return (
		<BodyScrollView contentContainerClassName="gap-gutter py-card">
			<View className="gap-tight">
				<Typography.Heading selectable className="text-2xl font-mono-semibold tabular-nums">
					{receiptNumber}
				</Typography.Heading>
				<View className="flex-row">
					<Chip
						variant="soft"
						color={
							statusTone(detail.status) === 'positive'
								? 'success'
								: statusTone(detail.status) === 'attention'
									? 'warning'
									: 'default'
						}
					>
						<Chip.Label>{caseStatusLabels[detail.status]}</Chip.Label>
					</Chip>
				</View>
			</View>

			{isRfe ? (
				<Alert status="warning">
					<Alert.Indicator />
					<Alert.Content>
						<Alert.Title>Request for Evidence</Alert.Title>
						<Alert.Description>
							Follow the deadline and instructions printed on your USCIS notice. For advice about
							your response, contact a qualified legal representative.
						</Alert.Description>
					</Alert.Content>
				</Alert>
			) : null}

			<Pressable accessibilityRole="link" onPress={() => void openOfficialStatus()}>
				<Surface
					variant="secondary"
					className="flex-row items-center gap-control rounded-2xl p-card"
				>
					<StyledLucideIcon name="external-link" size={20} className="text-accent" />
					<View className="flex-1">
						<Typography.Paragraph className="font-medium">
							Copy receipt &amp; open USCIS
						</Typography.Paragraph>
						<Typography.Paragraph color="muted" className="text-sm">
							Paste the copied number on egov.uscis.gov to see the latest official status.
						</Typography.Paragraph>
					</View>
				</Surface>
			</Pressable>

			<View className="gap-control">
				<Typography.Heading className="text-base font-semibold">Timeline</Typography.Heading>
				<View>
					{timeline.map((entry, index) => (
						<TimelineRow
							key={`${entry.status}-${entry.occurredAt}`}
							entry={entry}
							isLatest={index === 0}
						/>
					))}
				</View>
				<Separator />
				<AddUpdate caseId={caseId} />
			</View>

			<View className="gap-control">
				<Separator />
				<Typography.Heading className="text-base font-semibold">Manage case</Typography.Heading>
				<Button variant="ghost" onPress={confirmDelete}>
					<Button.Label className="text-danger">Remove from Immifile</Button.Label>
				</Button>
			</View>
		</BodyScrollView>
	)
}
