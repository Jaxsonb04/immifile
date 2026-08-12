import { View } from 'react-native';
import type * as SelectPrimitivesTypes from '../../primitives/select/select.types';
import type { DateTimePickerContentProps, DateTimePickerPortalProps, DateTimePickerRootProps, DateTimePickerSelectProps, DateTimePickerTriggerProps, DateTimePickerWheelProps } from './date-time-picker.types';
/**
 * `Select.Portal` renders into a host via the portal system, which breaks React context from
 * ancestors. Re-wrap `children` with `DateTimePickerProvider` so `DateTimePicker.Content` / `DateTimePicker.Wheel`
 * can still call `useDateTimePicker()` when portaled.
 */
declare function DateTimePickerPortal(props: DateTimePickerPortalProps): import("react/jsx-runtime").JSX.Element;
declare namespace DateTimePickerPortal {
    var displayName: string;
}
/**
 * DateTimePicker — field shell with optional managed state for `DateTimePicker.Select` + `DateTimePicker.Wheel`.
 *
 * For managed behavior, pass `value` / `onValueChange` / `isOpen` / `onOpenChange` on the root (or use
 * uncontrolled defaults) and use **`DateTimePicker.Select`** with **`DateTimePicker.Portal`**, **`DateTimePicker.Content`**,
 * and **`DateTimePicker.Wheel`**. Use a raw **`Select`** only if you omit root state props and wire
 * everything manually.
 *
 * @component DateTimePicker - Field shell owning selection, open state, and commit behavior.
 * @component DateTimePicker.Select - Wires `Select` (single mode) to the root state.
 * @component DateTimePicker.Portal - Portals content and re-provides `DateTimePicker` context.
 * @component DateTimePicker.Overlay - Backdrop behind portaled content.
 * @component DateTimePicker.Content - Presentation surface (popover / dialog / bottom-sheet).
 * @component DateTimePicker.Trigger - Trigger surface with invalid border styling.
 * @component DateTimePicker.Value - Selected label / placeholder.
 * @component DateTimePicker.TriggerIndicator - Trailing calendar icon.
 * @component DateTimePicker.Wheel - Wheel date-time selector wired to commit on scroll; renders the default
 * wheel parts when no children are passed.
 * @component DateTimePicker.WheelDate - Combined day column (`WheelDateTimePicker.Date`).
 * @component DateTimePicker.WheelHour - Hour column (`WheelDateTimePicker.Hour`).
 * @component DateTimePicker.WheelMinute - Minute column (`WheelDateTimePicker.Minute`).
 * @component DateTimePicker.WheelPeriod - AM/PM column (`WheelDateTimePicker.Period`).
 * @component DateTimePicker.WheelIndicator - Shared selection band (`WheelDateTimePicker.Indicator`).
 * @component DateTimePicker.WheelMask - Fade overlays with an overlay-surface-aware default color.
 */
declare const DateTimePicker: import("react").ForwardRefExoticComponent<DateTimePickerRootProps & import("react").RefAttributes<View>> & {
    Select: import("react").ForwardRefExoticComponent<DateTimePickerSelectProps & import("react").RefAttributes<View>>;
    Portal: typeof DateTimePickerPortal;
    Overlay: import("react").ForwardRefExoticComponent<import("heroui-native").SelectOverlayProps & import("react").RefAttributes<View>>;
    Content: import("react").ForwardRefExoticComponent<DateTimePickerContentProps & import("react").RefAttributes<View>>;
    Trigger: import("react").ForwardRefExoticComponent<DateTimePickerTriggerProps & import("react").RefAttributes<SelectPrimitivesTypes.TriggerRef>>;
    Value: import("react").ForwardRefExoticComponent<Omit<import("heroui-native").SelectValueProps, "placeholder"> & {
        placeholder?: string;
    } & import("react").RefAttributes<import("react-native").Text>>;
    TriggerIndicator: import("react").ForwardRefExoticComponent<import("heroui-native").SelectTriggerIndicatorProps & import("react").RefAttributes<View>>;
    Wheel: import("react").ForwardRefExoticComponent<DateTimePickerWheelProps & import("react").RefAttributes<View>>;
    WheelDate: import("react").ForwardRefExoticComponent<import("../wheel-date-time-picker").WheelDateTimePickerDateProps & import("react").RefAttributes<import("../wheel-picker").WheelPickerRootRef>>;
    WheelHour: import("react").ForwardRefExoticComponent<import("../wheel-date-time-picker").WheelDateTimePickerHourProps & import("react").RefAttributes<import("../wheel-picker").WheelPickerRootRef>>;
    WheelMinute: import("react").ForwardRefExoticComponent<import("../wheel-date-time-picker").WheelDateTimePickerMinuteProps & import("react").RefAttributes<import("../wheel-picker").WheelPickerRootRef>>;
    WheelPeriod: import("react").ForwardRefExoticComponent<import("../wheel-date-time-picker").WheelDateTimePickerPeriodProps & import("react").RefAttributes<import("../wheel-picker").WheelPickerRootRef>>;
    WheelIndicator: import("react").ForwardRefExoticComponent<import("../wheel-date-time-picker").WheelDateTimePickerIndicatorProps & import("react").RefAttributes<View>>;
    WheelMask: import("react").ForwardRefExoticComponent<import("../wheel-date-time-picker").WheelDateTimePickerMaskProps & import("react").RefAttributes<View>>;
};
export default DateTimePicker;
//# sourceMappingURL=date-time-picker.d.ts.map