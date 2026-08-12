import type { WheelTimePickerHourProps, WheelTimePickerIndicatorProps, WheelTimePickerMaskProps, WheelTimePickerMinuteProps, WheelTimePickerPeriodProps, WheelTimePickerRootProps } from './wheel-time-picker.types';
/**
 * Standalone wheel time selector built on `WheelPickerGroup`.
 *
 * Renders hour and minute columns (plus an AM/PM period column in 12-hour
 * mode) and exchanges an `@internationalized/date` `Time` value. Usable
 * anywhere, or rendered inside `TimePicker.Wheel` for a trigger + presentation
 * experience.
 *
 * When `children` are omitted the root renders the full default set
 * (`Hour`, `Minute`, `Period` in 12-hour mode, `Indicator`, `Mask`). Pass
 * children to take full ownership of column order, content, and styling.
 *
 * @component WheelTimePicker - Root owning the `Time` value, item data, and the
 * underlying `WheelPickerGroup`. Cascades `animation="disable-all"`.
 * @component WheelTimePicker.Hour - Hour column. Root-owned `name` / `items`.
 * @component WheelTimePicker.Minute - Minute column. Root-owned `name` / `items`.
 * @component WheelTimePicker.Period - AM/PM column (12-hour). Root-owned `name` / `items`.
 * @component WheelTimePicker.Indicator - Shared selection band (`WheelPickerGroup.Indicator`).
 * @component WheelTimePicker.Mask - Top / bottom fade overlays (`WheelPickerGroup.Mask`).
 */
declare const WheelTimePicker: import("react").ForwardRefExoticComponent<WheelTimePickerRootProps & import("react").RefAttributes<import("react-native").View>> & {
    /** Hour column. */
    Hour: import("react").ForwardRefExoticComponent<WheelTimePickerHourProps & import("react").RefAttributes<import("../wheel-picker").WheelPickerRootRef>>;
    /** Minute column. */
    Minute: import("react").ForwardRefExoticComponent<WheelTimePickerMinuteProps & import("react").RefAttributes<import("../wheel-picker").WheelPickerRootRef>>;
    /** @optional AM/PM period column (rendered by default in 12-hour mode). */
    Period: import("react").ForwardRefExoticComponent<WheelTimePickerPeriodProps & import("react").RefAttributes<import("../wheel-picker").WheelPickerRootRef>>;
    /** @optional Shared selection band spanning every column. */
    Indicator: import("react").ForwardRefExoticComponent<WheelTimePickerIndicatorProps & import("react").RefAttributes<import("react-native").View>>;
    /** @optional Shared top / bottom fade overlays. */
    Mask: import("react").ForwardRefExoticComponent<WheelTimePickerMaskProps & import("react").RefAttributes<import("react-native").View>>;
};
export default WheelTimePicker;
//# sourceMappingURL=wheel-time-picker.d.ts.map