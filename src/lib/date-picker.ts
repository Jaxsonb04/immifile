import type { DatePickerOption } from 'heroui-native-pro/date-picker'

/** Today as a local ISO date (YYYY-MM-DD) — not UTC, so a late evening never
 * rolls the default over to tomorrow. */
export function todayIso(): string {
	const now = new Date()
	const month = String(now.getMonth() + 1).padStart(2, '0')
	const day = String(now.getDate()).padStart(2, '0')
	return `${now.getFullYear()}-${month}-${day}`
}

/**
 * Map an ISO date string (`YYYY-MM-DD`, the shape `CalendarDate.toString()`
 * produces) to the `DatePickerOption` a heroui-native-pro `DatePicker` binds
 * to. The `value` is the ISO string; `label` is the human-readable text shown
 * in the trigger. Undefined/empty maps to `undefined` (no selection) — every
 * caller here has an optional date field.
 */
export function isoToOption(iso: string | undefined): DatePickerOption {
	if (!iso) return undefined
	const parsed = new Date(`${iso}T00:00:00`)
	const label = Number.isNaN(parsed.getTime())
		? iso
		: parsed.toLocaleDateString(undefined, { dateStyle: 'medium' })
	return { value: iso, label }
}
