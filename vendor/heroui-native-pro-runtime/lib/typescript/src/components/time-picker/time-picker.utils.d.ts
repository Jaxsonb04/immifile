import type { Time } from '@internationalized/date';
import type { WheelTimePickerHourFormat } from '../wheel-time-picker';
/**
 * Built-in time label styles for `TimePicker`.
 * - `"short"`: hour and minute only (e.g. `"2:30 PM"` / `"14:30"`).
 * - `"medium"`: includes seconds (e.g. `"2:30:00 PM"`).
 */
export type TimePickerTimeDisplayFormat = 'short' | 'medium';
/**
 * Options controlling how a `Time` is formatted into the select label.
 */
export type FormatTimeForDisplayOptions = {
    /**
     * Preset controlling whether seconds are included.
     */
    timeDisplayFormat: TimePickerTimeDisplayFormat;
    /**
     * Hour display mode. Drives `hour12` (12-hour adds an AM/PM marker).
     */
    hourFormat: WheelTimePickerHourFormat;
    /**
     * BCP 47 locale; defaults to `"en-US"` when omitted.
     */
    locale?: string;
    /**
     * When set, overrides `timeDisplayFormat`, `hourFormat`, and `locale`.
     */
    formatTime?: (time: Time) => string;
};
/**
 * Formats a `Time` for the select label using presets or a custom formatter.
 */
export declare function formatTimeForDisplay(time: Time, options: FormatTimeForDisplayOptions): string;
/**
 * Parses an ISO time string from `TimePickerOption.value` for the wheel.
 * Returns `undefined` if the string is not a valid time (avoids render crashes).
 */
export declare function tryParseTimePickerValueString(value: string): Time | undefined;
//# sourceMappingURL=time-picker.utils.d.ts.map