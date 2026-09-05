import { useAccountSession } from '@/components/account'
import { authClient } from '@/lib/auth-client'
import { api } from '@convex/_generated/api'
import { useMutation, useQuery } from 'convex/react'
import { Button, Input, Label, Spinner, TextField, Typography } from 'heroui-native'
import { Calendar } from 'heroui-native-pro/calendar'
import { DatePicker, type DatePickerOption } from 'heroui-native-pro/date-picker'
import { useState } from 'react'
import { Alert, View } from 'react-native'

import { BodyScrollView } from '@/components/core'
import { formatIsoDate } from '@/lib/application-labels'

type Draft = {
	givenName: string
	middleName: string
	familyName: string
	dateOfBirth: string
	countryOfBirth: string
	aNumber: string
	street: string
	unit: string
	city: string
	state: string
	zipCode: string
}

type SelfApplicant = NonNullable<ReturnType<typeof useSelfApplicant>>
function useSelfApplicant() {
	return useQuery(api.applicants.getSelfApplicant, {})
}

function draftFrom(self: SelfApplicant | null): Draft {
	const profile = self?.profile ?? {}
	const address = profile.mailingAddress
	return {
		givenName: profile.givenName ?? '',
		middleName: profile.middleName ?? '',
		familyName: profile.familyName ?? '',
		dateOfBirth: profile.dateOfBirth ?? '',
		countryOfBirth: profile.countryOfBirth ?? '',
		aNumber: profile.aNumber ?? '',
		street: address?.street ?? '',
		unit: address?.unit ?? '',
		city: address?.city ?? '',
		state: address?.state ?? '',
		zipCode: address?.zipCode ?? '',
	}
}

/** Omit empty strings so the shared shape's per-field rules only run on what
 * the person actually entered. */
function profileFrom(draft: Draft) {
	const text = (value: string) => (value.trim().length > 0 ? value.trim() : undefined)
	const hasAddress = [draft.street, draft.city, draft.state, draft.zipCode].some(
		(value) => value.trim().length > 0,
	)
	return {
		givenName: text(draft.givenName),
		middleName: text(draft.middleName),
		familyName: text(draft.familyName),
		dateOfBirth: text(draft.dateOfBirth),
		countryOfBirth: text(draft.countryOfBirth),
		aNumber: text(draft.aNumber),
		...(hasAddress
			? {
					mailingAddress: {
						street: draft.street.trim(),
						unit: text(draft.unit),
						city: draft.city.trim(),
						state: draft.state.trim().toUpperCase(),
						zipCode: draft.zipCode.trim(),
					},
				}
			: {}),
	}
}

/** Date of birth via the Pro DatePicker (M7 fix): calendar + year picker
 * instead of hand-typing an ISO string; the option's `value` is already the
 * YYYY-MM-DD shape the shared applicant shape validates. */
function DateOfBirthField(props: { value: string; onChange: (value: string) => void }) {
	const selected: DatePickerOption | undefined = props.value
		? { value: props.value, label: formatIsoDate(props.value) }
		: undefined
	return (
		<DatePicker value={selected} onValueChange={(option) => props.onChange(option?.value ?? '')}>
			<Label>Date of birth</Label>
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
								{/* Year jumping matters: birth years sit decades back. */}
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
	)
}

function Field(props: {
	label: string
	value: string
	onChangeText: (value: string) => void
	placeholder?: string
	autoCapitalize?: 'none' | 'words' | 'characters'
	keyboardType?: 'default' | 'number-pad'
	maxLength?: number
}) {
	return (
		<TextField>
			<Label>{props.label}</Label>
			<Input
				value={props.value}
				onChangeText={props.onChangeText}
				placeholder={props.placeholder}
				autoCapitalize={props.autoCapitalize ?? 'none'}
				autoCorrect={false}
				keyboardType={props.keyboardType}
				maxLength={props.maxLength}
			/>
		</TextField>
	)
}

/**
 * Editable identity details (M6-T5, re-homed to the Account tab in M7-T3),
 * backed by the owner's SELF applicant row (convex/applicants.ts) — the exact
 * record filings prefill from, so anything saved here shows up in the next
 * interview.
 */
export function AccountDetailsScreen() {
	const self = useSelfApplicant()
	if (self === undefined) {
		return (
			<View className="items-center py-section">
				<Spinner />
			</View>
		)
	}
	// Keyed remount prefills the form whenever a different row loads, without
	// any state-sync effect.
	return <DetailsForm key={self?._id ?? 'new'} initial={draftFrom(self)} />
}

function DetailsForm({ initial }: { initial: Draft }) {
	const updateSelfProfile = useMutation(api.applicants.updateSelfProfile)
	const { user, isCredentialed } = useAccountSession()
	const [draft, setDraft] = useState<Draft>(initial)
	const [dirty, setDirty] = useState(false)
	const [saving, setSaving] = useState(false)

	const set = (key: keyof Draft) => (value: string) => {
		setDirty(true)
		setDraft((current) => ({ ...current, [key]: value }))
	}

	async function save() {
		setSaving(true)
		try {
			const profile = profileFrom(draft)
			const fullName = [profile.givenName, profile.familyName].filter(Boolean).join(' ')
			await updateSelfProfile({
				profile,
				...(fullName.length > 0 ? { displayName: fullName } : {}),
			})
			// M7-T3 name propagation: useViewer() — the greeting/avatar spine —
			// reads the Better Auth user record, not the applicants row, so Save
			// must also update user.name or the app keeps greeting the old name.
			// Anonymous sessions are skipped: they never render a name, and a
			// later sign-up brings its own.
			if (isCredentialed && fullName.length > 0 && fullName !== user?.name) {
				const { error } = await authClient.updateUser({ name: fullName })
				if (error) {
					throw new Error(error.message ?? "Your details saved, but the name didn't update")
				}
			}
			setDirty(false)
		} catch (error) {
			Alert.alert(
				"Couldn't save your details",
				error instanceof Error ? error.message : 'Please check the fields and try again.',
			)
		} finally {
			setSaving(false)
		}
	}

	return (
		<BodyScrollView contentContainerClassName="gap-card px-gutter pt-card pb-8">
			<Typography.Paragraph color="muted" className="text-sm">
				You’re the applicant on your own filings — these details prefill every form you start.
			</Typography.Paragraph>

			<Field
				label="First (given) name"
				value={draft.givenName}
				onChangeText={set('givenName')}
				autoCapitalize="words"
			/>
			<Field
				label="Middle name"
				value={draft.middleName}
				onChangeText={set('middleName')}
				autoCapitalize="words"
			/>
			<Field
				label="Family (last) name"
				value={draft.familyName}
				onChangeText={set('familyName')}
				autoCapitalize="words"
			/>
			<DateOfBirthField value={draft.dateOfBirth} onChange={set('dateOfBirth')} />
			<Field
				label="Country of birth"
				value={draft.countryOfBirth}
				onChangeText={set('countryOfBirth')}
				autoCapitalize="words"
			/>
			<Field
				label="A-Number (if you have one)"
				value={draft.aNumber}
				onChangeText={set('aNumber')}
				placeholder="7–9 digits"
				keyboardType="number-pad"
				maxLength={9}
			/>

			<View className="gap-hairline pt-hairline">
				<Typography.Paragraph className="font-medium">Mailing address</Typography.Paragraph>
				<Typography.Paragraph color="muted" className="text-sm">
					Where USCIS sends notices and cards.
				</Typography.Paragraph>
			</View>
			<Field
				label="Street address"
				value={draft.street}
				onChangeText={set('street')}
				autoCapitalize="words"
			/>
			<Field label="Apt / unit (optional)" value={draft.unit} onChangeText={set('unit')} />
			<Field label="City" value={draft.city} onChangeText={set('city')} autoCapitalize="words" />
			<View className="flex-row gap-control">
				<View className="flex-1">
					<Field
						label="State"
						value={draft.state}
						onChangeText={set('state')}
						placeholder="CA"
						autoCapitalize="characters"
						maxLength={2}
					/>
				</View>
				<View className="flex-1">
					<Field
						label="ZIP code"
						value={draft.zipCode}
						onChangeText={set('zipCode')}
						keyboardType="number-pad"
						maxLength={10}
					/>
				</View>
			</View>

			<Button isDisabled={!dirty || saving} onPress={() => void save()}>
				<Button.Label>{saving ? 'Saving…' : 'Save details'}</Button.Label>
			</Button>
		</BodyScrollView>
	)
}
