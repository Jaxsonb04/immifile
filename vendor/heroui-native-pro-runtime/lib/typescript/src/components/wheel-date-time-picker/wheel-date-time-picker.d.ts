import type { WheelDateTimePickerDateProps, WheelDateTimePickerHourProps, WheelDateTimePickerIndicatorProps, WheelDateTimePickerMaskProps, WheelDateTimePickerMinuteProps, WheelDateTimePickerPeriodProps, WheelDateTimePickerRootProps } from './wheel-date-time-picker.types';
/**
 * Standalone wheel date-time selector built on `WheelPickerGroup`.
 *
 * Renders a combined day column (iOS-style: "Today", "Wed, Jun 3", ...)
 * alongside hour and minute columns (plus an AM/PM period column in 12-hour
 * mode) and exchanges an `@internationalized/date` `CalendarDateTime` value.
 * Usable anywhere, or rendered inside `DateTimePicker.Wheel` for a trigger +
 * presentation experience.
 *
 * When `children` are omitted the root renders the full default set
 * (`Date`, `Hour`, `Minute`, `Period` in 12-hour mode, `Indicator`, `Mask`).
 * Pass children to take full ownership of column order, content, and styling.
 *
 * @component WheelDateTimePicker - Root owning the `CalendarDateTime` value,
 * item data, and the underlying `WheelPickerGroup`. Cascades
 * `animation="disable-all"`.
 * @component WheelDateTimePicker.Date - Combined day column. Root-owned `name` / `items`.
 * @component WheelDateTimePicker.Hour - Hour column. Root-owned `name` / `items`.
 * @component WheelDateTimePicker.Minute - Minute column. Root-owned `name` / `items`.
 * @component WheelDateTimePicker.Period - AM/PM column (12-hour). Root-owned `name` / `items`.
 * @component WheelDateTimePicker.Indicator - Shared selection band (`WheelPickerGroup.Indicator`).
 * @component WheelDateTimePicker.Mask - Top / bottom fade overlays (`WheelPickerGroup.Mask`).
 */
declare const WheelDateTimePicker: import("react").ForwardRefExoticComponent<WheelDateTimePickerRootProps & import("react").RefAttributes<import("react-native").View>> & {
    /** Combined day column. */
    Date: import("react").ForwardRefExoticComponent<WheelDateTimePickerDateProps & import("react").RefAttributes<import("../wheel-picker").WheelPickerRootRef>>;
    /** Hour column. */
    Hour: import("react").ForwardRefExoticComponent<WheelDateTimePickerHourProps & import("react").RefAttributes<import("../wheel-picker").WheelPickerRootRef>>;
    /** Minute column. */
    Minute: import("react").ForwardRefExoticComponent<WheelDateTimePickerMinuteProps & import("react").RefAttributes<import("../wheel-picker").WheelPickerRootRef>>;
    /** @optional AM/PM period column (rendered by default in 12-hour mode). */
    Period: import("react").ForwardRefExoticComponent<WheelDateTimePickerPeriodProps & import("react").RefAttributes<import("../wheel-picker").WheelPickerRootRef>>;
    /** @optional Shared selection band spanning every column. */
    Indicator: import("react").ForwardRefExoticComponent<WheelDateTimePickerIndicatorProps & import("react").RefAttributes<import("react-native").View>>;
    /** @optional Shared top / bottom fade overlays. */
    Mask: import("react").ForwardRefExoticComponent<WheelDateTimePickerMaskProps & import("react").RefAttributes<import("react-native").View>>;
};
export default WheelDateTimePicker;
//# sourceMappingURL=wheel-date-time-picker.d.ts.map