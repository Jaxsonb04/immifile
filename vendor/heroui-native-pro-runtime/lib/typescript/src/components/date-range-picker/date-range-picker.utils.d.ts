import type { CalendarDate } from '@internationalized/date';
import type { RangeValue } from '../../primitives/calendar/state/types';
/**
 * Wire format for `DateRangePickerOption.value`: JSON object with ISO calendar date strings.
 */
export interface DateRangeSelectWirePayload {
    start: string;
    end: string;
}
/**
 * Built-in date label styles for `DateRangePicker` (maps to `Intl.DateTimeFormat` `dateStyle`).
 */
export type DateRangePickerDateDisplayFormat = 'short' | 'medium' | 'long' | 'full';
export type FormatCalendarDateForDisplayOptions = {
    dateDisplayFormat: DateRangePickerDateDisplayFormat;
    /**
     * BCP 47 locale; defaults to `"en-US"` when omitted.
     */
    locale?: string;
    /**
     * When set, overrides `dateDisplayFormat` and `locale`.
     */
    formatDate?: (date: CalendarDate) => string;
};
/**
 * Options for building the trigger label for a committed date range.
 */
export type FormatDateRangeForDisplayOptions = {
    dateDisplayFormat: DateRangePickerDateDisplayFormat;
    /**
     * BCP 47 locale; defaults to `"en-US"` when omitted.
     */
    locale?: string;
    /**
     * When set, overrides preset formatting for both bounds.
     */
    formatDateRange?: (start: CalendarDate, end: CalendarDate) => string;
    /**
     * Placed between formatted start and end when using presets (not when `formatDateRange` is set).
     *
     * @default Unicode en dash (U+2013)
     */
    rangeSeparator?: string;
};
/**
 * Formats a `CalendarDate` for display using presets or a custom formatter.
 */
export declare function formatCalendarDateForDisplay(date: CalendarDate, options: FormatCalendarDateForDisplayOptions): string;
/**
 * Formats start and end calendar dates for the select label.
 */
export declare function formatDateRangeForDisplay(start: CalendarDate, end: CalendarDate, options: FormatDateRangeForDisplayOptions): string;
/**
 * Serializes a range to `SelectOption.value` (JSON with `start` / `end` ISO strings).
 */
export declare function serializeDateRangeToSelectValue(range: RangeValue<CalendarDate>): string;
/**
 * Parses `DateRangePickerOption.value` into calendar dates. Returns `undefined` if invalid.
 */
export declare function tryParseDateRangeFromSelectValue(value: string): RangeValue<CalendarDate> | undefined;
//# sourceMappingURL=date-range-picker.utils.d.ts.map