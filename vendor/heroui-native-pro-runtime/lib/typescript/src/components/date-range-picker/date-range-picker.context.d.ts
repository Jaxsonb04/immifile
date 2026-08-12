import type { CalendarDate } from '@internationalized/date';
import type { RangeValue } from '../../primitives/calendar/state/types';
import type { DateRangePickerOption } from './date-range-picker.types';
/**
 * Context for `DateRangePicker` managed selection, open state, and calendar commit behavior.
 */
export interface DateRangePickerContextValue {
    /**
     * Current select option: `value` is JSON `{ start, end }` (ISO calendar strings); `label` is the
     * formatted range for the trigger.
     */
    value: DateRangePickerOption | undefined;
    /**
     * Updates the selected option (same contract as `Select` single mode).
     */
    onValueChange: (next: DateRangePickerOption | undefined) => void;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    /**
     * Commits a completed range: updates the option with a formatted label and closes the overlay.
     */
    commitRange: (range: RangeValue<CalendarDate>) => void;
    /**
     * Formats a range using root `dateDisplayFormat` / `locale` / `formatDateRange` / `rangeSeparator`.
     */
    formatRangeLabel: (start: CalendarDate, end: CalendarDate) => string;
    /**
     * `isDisabled` from the `DateRangePicker` root (for merging into `DateRangePicker.Select`).
     */
    isDisabledRoot: boolean;
    /**
     * Root `locale` — forwarded to `DateRangePicker.Calendar` when its own `locale` is omitted.
     */
    locale: string | undefined;
}
declare const DateRangePickerProvider: import("react").Provider<DateRangePickerContextValue>, useDateRangePicker: () => DateRangePickerContextValue;
export { DateRangePickerProvider, useDateRangePicker };
//# sourceMappingURL=date-range-picker.context.d.ts.map