import type { CalendarDate, CalendarDateTime } from '@internationalized/date';
import type { WheelPickerOption } from '../wheel-picker';
import { buildHourItems, buildMinuteItems, buildPeriodItems } from '../wheel-time-picker/wheel-time-picker.utils';
import type { WheelDateTimePickerFormatDate, WheelDateTimePickerHourFormat, WheelDateTimePickerValues } from './wheel-date-time-picker.types';
export { buildHourItems, buildMinuteItems, buildPeriodItems };
/**
 * Inclusive lower/upper bounds for the date column, resolved from props.
 */
export interface ResolvedDateRange {
    /** Inclusive first selectable day. */
    min: CalendarDate;
    /** Inclusive last selectable day. */
    max: CalendarDate;
}
/**
 * Resolves the date column bounds from optional `minValue` / `maxValue` props,
 * defaulting to `today` through `today + DEFAULT_DATE_RANGE_YEARS`. The range
 * is always widened to include `value` (when present) so the active selection
 * can render, and normalized so `min` never exceeds `max`.
 */
export declare function resolveDateRange(options: {
    value: CalendarDateTime | undefined;
    minValue: CalendarDate | undefined;
    maxValue: CalendarDate | undefined;
}): ResolvedDateRange;
/**
 * Builds the date column options spanning `[min, max]` inclusive. Each
 * option's value is the ISO calendar-date string; labels are localized via
 * `locale` (or the supplied `formatDate` override).
 */
export declare function buildDateItems(options: {
    min: CalendarDate;
    max: CalendarDate;
    locale: string | undefined;
    formatDate: WheelDateTimePickerFormatDate | undefined;
}): WheelPickerOption<string>[];
/**
 * Decomposes a {@link CalendarDateTime} into the wheel values record for the
 * given format. Minutes are snapped to the active `minuteInterval`.
 */
export declare function dateTimeToWheelValues(value: CalendarDateTime, hourFormat: WheelDateTimePickerHourFormat, minuteInterval: number): WheelDateTimePickerValues;
/**
 * Reconstructs a {@link CalendarDateTime} from a `WheelPickerGroup` values
 * record for the given format. Unknown or missing fields fall back to the
 * supplied `fallbackDate` at midnight.
 */
export declare function wheelValuesToDateTime(values: Readonly<Record<string, unknown>>, hourFormat: WheelDateTimePickerHourFormat, fallbackDate: CalendarDate): CalendarDateTime;
//# sourceMappingURL=wheel-date-time-picker.utils.d.ts.map