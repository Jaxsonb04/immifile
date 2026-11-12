import { isoToOption, todayIso } from '@/lib/date-picker'
import { humanErrorMessage } from '@/lib/error-message'
import { Button, Label, Typography } from 'heroui-native'
import { Calendar } from 'heroui-native-pro/calendar'
import { DatePicker } from 'heroui-native-pro/date-picker'
import { useState } from 'react'
import { Alert, View } from 'react-native'
import { useJourneyHub } from './journey-hub.context'
import { useMarkFiled } from './journey-hub.data'

/**
 * The user-confirmed "I filed this with USCIS" transition (the last workflow-
 * repair P0): pick the filing date, confirm, and the server moves the
 * application draft -> filed. If the readiness contract says the application
 * isn't complete in the app, the confirm says so honestly and passes the
 * explicit acknowledgment — recording a real-world filing is allowed, faking
 * readiness is not.
 */
export function MarkFiled() {
	const { application, readiness } = useJourneyHub()
	const markFiled = useMarkFiled()
	const [filedDate, setFiledDate] = useState(todayIso)
	const [busy, setBusy] = useState(false)

	if (application.status !== 'draft') return null

	async function submit(acknowledgeNotReady: boolean) {
		setBusy(true)
		try {
			await markFiled({
				applicationId: application._id,
				// Local noon dodges DST edges when turning the date into a timestamp.
				filedAt: new Date(`${filedDate}T12:00:00`).getTime(),
				...(acknowledgeNotReady ? { acknowledgeNotReady: true } : {}),
			})
		} catch (error) {
			Alert.alert('Could not mark as filed', humanErrorMessage(error, 'Please try again.'))
		} finally {
			setBusy(false)
		}
	}

	function confirm() {
		const dateLabel = isoToOption(filedDate)?.label ?? filedDate
		if (readiness.isReadyToFile) {
			Alert.alert(
				'Mark as filed?',
				`This records that you filed this application with USCIS on ${dateLabel}. Editing locks, and you can add your receipt number to track the case. You can still download your filing package.`,
				[
					{ text: 'Cancel', style: 'cancel' },
					{ text: 'I filed it', onPress: () => void submit(false) },
				],
			)
			return
		}
		Alert.alert(
			'This application isn’t complete here',
			`The app still lists missing items for this application, so it can’t verify what you mailed was complete. If you really did file it with USCIS on ${dateLabel}, you can record that anyway.`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{ text: 'I filed it anyway', style: 'destructive', onPress: () => void submit(true) },
			],
		)
	}

	return (
		<View className="gap-control">
			<Typography.Heading className="text-base font-semibold">
				Already mailed it to USCIS?
			</Typography.Heading>
			<Typography.Paragraph color="muted" type="body-sm">
				Once you’ve mailed your application, record it here so this application moves to Completed
				and you can track the case.
			</Typography.Paragraph>
			<DatePicker
				value={isoToOption(filedDate)}
				onValueChange={(option) => setFiledDate(option?.value ?? todayIso())}
				isDisabled={busy}
			>
				<Label>Date you filed</Label>
				<DatePicker.Select>
					<DatePicker.Trigger>
						<DatePicker.Value placeholder="Choose a date" />
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
			<Button variant="secondary" isDisabled={busy} onPress={confirm}>
				<Button.Label>{busy ? 'Recording…' : 'I filed this with USCIS'}</Button.Label>
			</Button>
		</View>
	)
}
