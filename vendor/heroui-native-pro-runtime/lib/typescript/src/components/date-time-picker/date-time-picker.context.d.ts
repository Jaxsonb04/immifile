import type { CalendarDate, CalendarDateTime } from '@internationalized/date';
import type { WheelDateTimePickerFormatDate, WheelDateTimePickerHourFormat } from '../wheel-date-time-picker';
import type { DateTimePickerOption } from './date-time-picker.types';
/**
 * Options controlling how `commitDateTime` mutates the surface.
 */
export interface DateTimePickerCommitOptions {
    /**
     * Whether to close the select surface after committing.
     *
     * @default true
     */
    close?: boolean;
}
/**
 * Context for `DateTimePicker` managed selection, open state, and wheel commit
 * behavior.
 */
export interface DateTimePickerContextValue {
    /**
     * Current select option (ISO date-time string in `value`, display string in `label`).
     */
    value: DateTimePickerOption | undefined;
    /**
     * Updates the selected option (same contract as `Select` single mode).
     */
    onValueChange: (next: DateTimePickerOption | undefined) => void;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    /**
     * Commits a date-time: updates the option with a formatted label and, unless
     * `options.close` is `false`, closes the overlay. The wheel commits with
     * `close: false` so the surface stays open while scrolling.
     */
    commitDateTime: (value: CalendarDateTime, options?: DateTimePickerCommitOptions) => void;
    /**
     * Formats a date-time using root `dateTimeDisplayFormat` / `hourFormat` /
     * `locale` / `formatDateTime`.
     */
    formatLabel: (value: CalendarDateTime) => string;
    /**
     * Root `minValue` — forwarded to `DateTimePicker.Wheel` when its own is omitted.
     */
    minValue: CalendarDate | undefined;
    /**
     * Root `maxValue` — forwarded to `DateTimePicker.Wheel` when its own is omitted.
     */
    maxValue: CalendarDate | undefined;
    /**
     * Root `hourFormat` — forwarded to `DateTimePicker.Wheel` when its own is omitted.
     */
    hourFormat: WheelDateTimePickerHourFormat;
    /**
     * Root `minuteInterval` — forwarded to `DateTimePicker.Wheel` when its own is omitted.
     */
    minuteInterval: number;
    /**
     * Root `locale` — forwarded to `DateTimePicker.Wheel` when its own is omitted.
     */
    locale: string | undefined;
    /**
     * Root `formatDate` — forwarded to `DateTimePicker.Wheel` when its own is omitted.
     */
    formatDate: WheelDateTimePickerFormatDate | undefined;
    /**
     * `isDisabled` from the `DateTimePicker` root (for merging into `DateTimePicker.Select`).
     */
    isDisabledRoot: boolean;
}
declare const DateTimePickerProvider: import("react").Provider<DateTimePickerContextValue>, useDateTimePicker: () => DateTimePickerContextValue;
export { DateTimePickerProvider, useDateTimePicker };
//# sourceMappingURL=date-time-picker.context.d.ts.map