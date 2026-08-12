import type { WheelPickerOption } from '../wheel-picker';
import type { WheelDateTimePickerHourFormat, WheelDateTimePickerPeriod } from './wheel-date-time-picker.types';
/**
 * Context for `WheelDateTimePicker`. The root builds the column item data from
 * `minValue` / `maxValue` / `hourFormat` / `minuteInterval` / `locale` and
 * exposes it here so the `Date` / `Hour` / `Minute` / `Period` subcomponents
 * stay value-correct without each rebuilding (or being passed) the item
 * arrays.
 */
export interface WheelDateTimePickerContextValue {
    /**
     * Date column options. Each option's value is an ISO calendar-date string
     * (`"YYYY-MM-DD"`); labels are localized.
     */
    dateItems: WheelPickerOption<string>[];
    /**
     * Hour column options (`1`–`12` in 12-hour mode, `0`–`23` in 24-hour mode).
     */
    hourItems: WheelPickerOption<number>[];
    /**
     * Minute column options stepped by the active `minuteInterval`.
     */
    minuteItems: WheelPickerOption<number>[];
    /**
     * AM/PM period column options with localized labels.
     */
    periodItems: WheelPickerOption<WheelDateTimePickerPeriod>[];
    /**
     * Resolved hour display mode.
     */
    hourFormat: WheelDateTimePickerHourFormat;
}
declare const WheelDateTimePickerProvider: import("react").Provider<WheelDateTimePickerContextValue>, useWheelDateTimePicker: () => WheelDateTimePickerContextValue;
export { useWheelDateTimePicker, WheelDateTimePickerProvider };
//# sourceMappingURL=wheel-date-time-picker.context.d.ts.map