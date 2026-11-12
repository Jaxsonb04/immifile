import { SectionHeading } from '@/components/core'
import { StyledLucideIcon } from '@/components/styled-icon'
import { useToday } from '@/hooks/use-today'
import { formatIsoDate } from '@/lib/application-labels'
import { api } from '@convex/_generated/api'
import { renewalStateFor, type RenewalKind, type RenewalState } from '@convex/shared/renewals'
import { useMutation, useQuery } from 'convex/react'
import type { FunctionReturnType } from 'convex/server'
import { Button, Label, Typography } from 'heroui-native'
import { Calendar } from 'heroui-native-pro/calendar'
import { DatePicker, type DatePickerOption } from 'heroui-native-pro/date-picker'
import { useState } from 'react'
import { Alert, Pressable, View } from 'react-native'

export type RenewalItem = FunctionReturnType<typeof api.renewals.listRenewalItems>[number]

export function useRenewalItems(): RenewalItem[] | undefined {
	return useQuery(api.renewals.listRenewalItems, {})
}

export const KIND_LABELS: Record<RenewalKind, string> = {
	ead: 'Work permit (EAD)',
	greenCard: 'Green card',
}

/** One-line copy + tone for a renewal state — shared with the M7-T4 hub row. */
export function renewalStateCopy(state: RenewalState): {
	text: string
	tone: 'danger' | 'warning' | 'muted'
} {
	switch (state.status) {
		case 'expired':
			return {
				text: `Expired ${state.daysSinceExpiry} ${state.daysSinceExpiry === 1 ? 'day' : 'days'} ago — file as soon as possible`,
				tone: 'danger',
			}
		case 'windowOpen':
			return {
				text:
					state.daysUntilExpiry === 0
						? 'Expires today — you can file now'
						: `Renewal window open — expires in ${state.daysUntilExpiry} days`,
				tone: 'warning',
			}
		case 'windowOpens':
			return {
				text: `Renewal window opens ${formatIsoDate(state.opensOn)} (180 days before expiry)`,
				tone: 'muted',
			}
		case 'awaitingCard':
			return {
				text: `Filed ${formatIsoDate(state.filedOn)} — add the new card’s expiry when it arrives`,
				tone: 'muted',
			}
	}
}

function stateIcon(tone: 'danger' | 'warning' | 'muted') {
	if (tone === 'danger')
		return <StyledLucideIcon name="triangle-alert" size={20} className="text-danger" />
	if (tone === 'warning')
		return <StyledLucideIcon name="calendar-clock" size={20} className="text-warning" />
	return <StyledLucideIcon name="calendar" size={20} className="text-muted" />
}

function Row({ item, onRemove }: { item: RenewalItem; onRemove?: () => void }) {
	const today = useToday()
	const state = renewalStateFor(item, today)
	if (state === null) return null
	const copy = renewalStateCopy(state)
	return (
		<View className="flex-row items-center gap-control py-tight">
			{stateIcon(copy.tone)}
			<View className="flex-1">
				<Typography.Paragraph className="font-medium">
					{KIND_LABELS[item.kind]}
					{item.expiryDate !== undefined ? ` · expires ${formatIsoDate(item.expiryDate)}` : ''}
				</Typography.Paragraph>
				<Typography.Paragraph
					color="muted"
					className={`text-sm ${copy.tone === 'danger' ? 'text-danger' : copy.tone === 'warning' ? 'text-warning' : ''}`}
				>
					{copy.text}
				</Typography.Paragraph>
			</View>
			{onRemove !== undefined && (
				<Pressable accessibilityRole="button" accessibilityLabel="Remove entry" onPress={onRemove}>
					<StyledLucideIcon name="x" size={16} className="text-muted" />
				</Pressable>
			)}
		</View>
	)
}

type DateMeaning = 'expiry' | 'filed'

/** Inline manual entry (M6-T6 decision 6): log an existing card's expiry or a
 * prior filing date without uploading anything. Also rendered by the empty
 * dashboard so the manual path exists before any other data does. */
export function AddRenewalEntry({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
	const addRenewalEntry = useMutation(api.renewals.addRenewalEntry)
	const [open, setOpenState] = useState(false)
	function setOpen(next: boolean) {
		setOpenState(next)
		onOpenChange?.(next)
	}
	const [kind, setKind] = useState<RenewalKind>('ead')
	const [meaning, setMeaning] = useState<DateMeaning>('expiry')
	// The Pro DatePicker option carries the ISO date in `value` — exactly the
	// YYYY-MM-DD shape convex/renewals.ts validates, so hand-typed strings
	// (and their "Enter dates as YYYY-MM-DD" rejections) are gone (M7 fix).
	const [date, setDate] = useState<DatePickerOption | undefined>(undefined)
	const [busy, setBusy] = useState(false)

	if (!open) {
		return (
			<Button variant="ghost" size="sm" onPress={() => setOpen(true)}>
				<Button.Label maxFontSizeMultiplier={1.5}>Add a card or filing date</Button.Label>
			</Button>
		)
	}

	async function save() {
		if (date === undefined) return
		setBusy(true)
		try {
			await addRenewalEntry({
				kind,
				...(meaning === 'expiry' ? { expiryDate: date.value } : { filedAt: date.value }),
			})
			setOpen(false)
			setDate(undefined)
		} catch (error) {
			Alert.alert(
				"Couldn't add the date",
				error instanceof Error ? error.message : 'Please try again.',
			)
		} finally {
			setBusy(false)
		}
	}

	const toggle = (selected: boolean, label: string, onPress: () => void) => (
		<Button
			key={label}
			size="sm"
			variant={selected ? 'primary' : 'secondary'}
			onPress={onPress}
			accessibilityState={{ selected }}
		>
			<Button.Label maxFontSizeMultiplier={1.5}>{label}</Button.Label>
		</Button>
	)

	return (
		<View className="gap-control rounded-2xl bg-surface-secondary p-card">
			<View className="flex-row flex-wrap gap-tight">
				{toggle(kind === 'ead', 'Work permit (EAD)', () => setKind('ead'))}
				{toggle(kind === 'greenCard', 'Green card', () => setKind('greenCard'))}
			</View>
			<View className="flex-row flex-wrap gap-tight">
				{toggle(meaning === 'expiry', 'Card expiry date', () => setMeaning('expiry'))}
				{toggle(meaning === 'filed', 'Date I filed', () => setMeaning('filed'))}
			</View>
			<DatePicker value={date} onValueChange={setDate}>
				<Label>{meaning === 'expiry' ? 'Expiry date' : 'Filing date'}</Label>
				<DatePicker.Select presentation="dialog">
					<DatePicker.Trigger>
						<DatePicker.Value />
						<DatePicker.TriggerIndicator />
					</DatePicker.Trigger>
					<DatePicker.Portal>
						<DatePicker.Overlay />
						<DatePicker.Content presentation="dialog">
							<DatePicker.Calendar>
								<Calendar.Header>
									{/* Year jumping matters here: expiry dates sit years out. */}
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
									<Calendar.GridBody>
										{(gridDate) => <Calendar.Cell date={gridDate} />}
									</Calendar.GridBody>
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
			<View className="flex-row gap-tight">
				<Button size="sm" isDisabled={busy || date === undefined} onPress={() => void save()}>
					<Button.Label maxFontSizeMultiplier={1.5}>{busy ? 'Adding…' : 'Add'}</Button.Label>
				</Button>
				<Button size="sm" variant="ghost" isDisabled={busy} onPress={() => setOpen(false)}>
					<Button.Label maxFontSizeMultiplier={1.5}>Cancel</Button.Label>
				</Button>
			</View>
		</View>
	)
}

/**
 * Upcoming renewals (M6-T6): merged from in-app filings, vault documents with
 * an expiry, and manual entries — reminded against the real USCIS windows
 * (I-765: up to 180 days before EAD expiry; I-90: within six months —
 * citations in convex/shared/renewals.ts).
 */
export function Renewals({ items }: { items: RenewalItem[] }) {
	const deleteRenewalEntry = useMutation(api.renewals.deleteRenewalEntry)
	return (
		<View className="gap-hairline">
			<SectionHeading title="Upcoming renewals" count={items.length} />
			{items.map((item) => (
				<Row
					key={item.id}
					item={item}
					onRemove={
						item.source === 'manual'
							? () =>
									void deleteRenewalEntry({
										entryId: item.id as Parameters<typeof deleteRenewalEntry>[0]['entryId'],
									})
							: undefined
					}
				/>
			))}
			{items.length === 0 && (
				<Typography.Paragraph color="muted" className="text-sm">
					Add your current card’s expiry date and we’ll tell you exactly when the renewal window
					opens.
				</Typography.Paragraph>
			)}
			<AddRenewalEntry />
		</View>
	)
}
