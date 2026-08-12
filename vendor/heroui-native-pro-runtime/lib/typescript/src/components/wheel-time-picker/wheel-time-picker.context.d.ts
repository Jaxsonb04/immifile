import type { WheelPickerOption } from '../wheel-picker';
import type { WheelTimePickerHourFormat, WheelTimePickerPeriod } from './wheel-time-picker.types';
/**
 * Context for `WheelTimePicker`. The root builds the column item data from
 * `hourFormat` / `minuteInterval` / `locale` and exposes it here so the
 * `Hour` / `Minute` / `Period` subcomponents stay value-correct without each
 * rebuilding (or being passed) the item arrays.
 */
export interface WheelTimePickerContextValue {
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
    periodItems: WheelPickerOption<WheelTimePickerPeriod>[];
    /**
     * Resolved hour display mode.
     */
    hourFormat: WheelTimePickerHourFormat;
}
declare const WheelTimePickerProvider: import("react").Provider<WheelTimePickerContextValue>, useWheelTimePicker: () => WheelTimePickerContextValue;
export { useWheelTimePicker, WheelTimePickerProvider };
//# sourceMappingURL=wheel-time-picker.context.d.ts.map