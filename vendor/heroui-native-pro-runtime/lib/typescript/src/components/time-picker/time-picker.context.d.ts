import type { Time } from '@internationalized/date';
import type { WheelTimePickerHourFormat } from '../wheel-time-picker';
import type { TimePickerOption } from './time-picker.types';
/**
 * Options controlling how `commitTime` mutates the surface.
 */
export interface TimePickerCommitOptions {
    /**
     * Whether to close the select surface after committing.
     *
     * @default true
     */
    close?: boolean;
}
/**
 * Context for `TimePicker` managed selection, open state, and wheel commit behavior.
 */
export interface TimePickerContextValue {
    /**
     * Current select option (ISO time string in `value`, display string in `label`).
     */
    value: TimePickerOption | undefined;
    /**
     * Updates the selected option (same contract as `Select` single mode).
     */
    onValueChange: (next: TimePickerOption | undefined) => void;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    /**
     * Commits a time: updates the option with a formatted label and, unless
     * `options.close` is `false`, closes the overlay. The wheel commits with
     * `close: false` so the surface stays open while scrolling.
     */
    commitTime: (time: Time, options?: TimePickerCommitOptions) => void;
    /**
     * Formats a time using root `timeDisplayFormat` / `hourFormat` / `locale` / `formatTime`.
     */
    formatLabel: (time: Time) => string;
    /**
     * Root `hourFormat` — forwarded to `TimePicker.Wheel` when its own is omitted.
     */
    hourFormat: WheelTimePickerHourFormat;
    /**
     * Root `minuteInterval` — forwarded to `TimePicker.Wheel` when its own is omitted.
     */
    minuteInterval: number;
    /**
     * Root `locale` — forwarded to `TimePicker.Wheel` when its own is omitted.
     */
    locale: string | undefined;
    /**
     * `isDisabled` from the `TimePicker` root (for merging into `TimePicker.Select`).
     */
    isDisabledRoot: boolean;
}
declare const TimePickerProvider: import("react").Provider<TimePickerContextValue>, useTimePicker: () => TimePickerContextValue;
export { TimePickerProvider, useTimePicker };
//# sourceMappingURL=time-picker.context.d.ts.map