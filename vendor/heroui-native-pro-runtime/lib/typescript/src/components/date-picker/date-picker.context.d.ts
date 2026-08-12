import type { CalendarDate } from '@internationalized/date';
import type { DatePickerOption } from './date-picker.types';
/**
 * Context for `DatePicker` managed selection, open state, and calendar commit behavior.
 */
export interface DatePickerContextValue {
    /**
     * Current select option (ISO date string in `value`, display string in `label`).
     */
    value: DatePickerOption | undefined;
    /**
     * Updates the selected option (same contract as `Select` single mode).
     */
    onValueChange: (next: DatePickerOption | undefined) => void;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    /**
     * Commits a calendar date: updates the option with a formatted label and closes the overlay.
     */
    commitDate: (date: CalendarDate) => void;
    /**
     * Formats a date using root `dateDisplayFormat` / `locale` / `formatDate`.
     */
    formatLabel: (date: CalendarDate) => string;
    /**
     * `isDisabled` from the `DatePicker` root (for merging into `DatePicker.Select`).
     */
    isDisabledRoot: boolean;
    /**
     * Root `locale` — forwarded to `DatePicker.Calendar` when its own `locale` is omitted.
     */
    locale: string | undefined;
}
declare const DatePickerProvider: import("react").Provider<DatePickerContextValue>, useDatePicker: () => DatePickerContextValue;
export { DatePickerProvider, useDatePicker };
//# sourceMappingURL=date-picker.context.d.ts.map