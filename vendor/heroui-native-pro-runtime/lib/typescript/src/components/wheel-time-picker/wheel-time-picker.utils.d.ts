import type { Time } from '@internationalized/date';
import type { WheelPickerOption } from '../wheel-picker';
import type { WheelTimePickerHourFormat, WheelTimePickerPeriod, WheelTimePickerValues } from './wheel-time-picker.types';
/**
 * Clamps and normalizes a minute step into a positive integer in `[1, 59]`.
 * Falls back to `1` for invalid input so the minute column is never empty.
 */
export declare function normalizeMinuteInterval(minuteInterval: number): number;
/**
 * Snaps a raw minute value to the nearest multiple of `minuteInterval`,
 * clamped to the last representable option so it always maps to a row.
 */
export declare function snapMinute(minute: number, minuteInterval: number): number;
/**
 * Builds the hour column options for the requested format.
 * - 12-hour: values `1`–`12`, unpadded labels.
 * - 24-hour: values `0`–`23`, zero-padded labels.
 */
export declare function buildHourItems(hourFormat: WheelTimePickerHourFormat): WheelPickerOption<number>[];
/**
 * Builds the minute column options stepped by `minuteInterval`.
 * Labels are always zero-padded to two digits.
 */
export declare function buildMinuteItems(minuteInterval: number): WheelPickerOption<number>[];
/**
 * Builds the AM/PM period column options. Values are canonical `"AM"` /
 * `"PM"`; labels are localized via `locale`.
 */
export declare function buildPeriodItems(locale: string | undefined): WheelPickerOption<WheelTimePickerPeriod>[];
/**
 * Decomposes a {@link Time} into the wheel values record for the given
 * format. Minutes are snapped to the active `minuteInterval`.
 */
export declare function timeToWheelValues(time: Time, hourFormat: WheelTimePickerHourFormat, minuteInterval: number): WheelTimePickerValues;
/**
 * Reconstructs a {@link Time} from a `WheelPickerGroup` values record for
 * the given format. Unknown or missing fields default to midnight.
 */
export declare function wheelValuesToTime(values: Readonly<Record<string, unknown>>, hourFormat: WheelTimePickerHourFormat): Time;
//# sourceMappingURL=wheel-time-picker.utils.d.ts.map