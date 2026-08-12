import type { CalendarDate } from '@internationalized/date';
/**
 * Built-in date label styles for `DatePicker` (maps to `Intl.DateTimeFormat` `dateStyle`).
 */
export type DatePickerDateDisplayFormat = 'short' | 'medium' | 'long' | 'full';
export type FormatCalendarDateForDisplayOptions = {
    dateDisplayFormat: DatePickerDateDisplayFormat;
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
 * Formats a `CalendarDate` for the select label using presets or a custom formatter.
 */
export declare function formatCalendarDateForDisplay(date: CalendarDate, options: FormatCalendarDateForDisplayOptions): string;
/**
 * Parses an ISO date string from `DatePickerOption.value` for the calendar.
 * Returns `undefined` if the string is not a valid calendar date (avoids render crashes).
 */
export declare function tryParseDatePickerValueString(value: string): CalendarDate | undefined;
//# sourceMappingURL=date-picker.utils.d.ts.map