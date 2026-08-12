import { View } from 'react-native';
import type * as SelectPrimitivesTypes from '../../primitives/select/select.types';
import type { TimePickerContentProps, TimePickerPortalProps, TimePickerRootProps, TimePickerSelectProps, TimePickerTriggerProps, TimePickerWheelProps } from './time-picker.types';
/**
 * `Select.Portal` renders into a host via the portal system, which breaks React context from
 * ancestors. Re-wrap `children` with `TimePickerProvider` so `TimePicker.Content` / `TimePicker.Wheel`
 * can still call `useTimePicker()` when portaled.
 */
declare function TimePickerPortal(props: TimePickerPortalProps): import("react/jsx-runtime").JSX.Element;
declare namespace TimePickerPortal {
    var displayName: string;
}
/**
 * TimePicker — field shell with optional managed state for `TimePicker.Select` + `TimePicker.Wheel`.
 *
 * For managed behavior, pass `value` / `onValueChange` / `isOpen` / `onOpenChange` on the root (or use
 * uncontrolled defaults) and use **`TimePicker.Select`** with **`TimePicker.Portal`**, **`TimePicker.Content`**,
 * and **`TimePicker.Wheel`**. Use a raw **`Select`** only if you omit root state props and wire
 * everything manually.
 *
 * @component TimePicker - Field shell owning selection, open state, and commit behavior.
 * @component TimePicker.Select - Wires `Select` (single mode) to the root state.
 * @component TimePicker.Portal - Portals content and re-provides `TimePicker` context.
 * @component TimePicker.Overlay - Backdrop behind portaled content.
 * @component TimePicker.Content - Presentation surface (popover / dialog / bottom-sheet).
 * @component TimePicker.Trigger - Trigger surface with invalid border styling.
 * @component TimePicker.Value - Selected label / placeholder.
 * @component TimePicker.TriggerIndicator - Trailing clock icon.
 * @component TimePicker.Wheel - Wheel time selector wired to commit on scroll; renders the default
 * wheel parts when no children are passed.
 * @component TimePicker.WheelHour - Hour column (`WheelTimePicker.Hour`).
 * @component TimePicker.WheelMinute - Minute column (`WheelTimePicker.Minute`).
 * @component TimePicker.WheelPeriod - AM/PM column (`WheelTimePicker.Period`).
 * @component TimePicker.WheelIndicator - Shared selection band (`WheelTimePicker.Indicator`).
 * @component TimePicker.WheelMask - Fade overlays with an overlay-surface-aware default color.
 */
declare const TimePicker: import("react").ForwardRefExoticComponent<TimePickerRootProps & import("react").RefAttributes<View>> & {
    Select: import("react").ForwardRefExoticComponent<TimePickerSelectProps & import("react").RefAttributes<View>>;
    Portal: typeof TimePickerPortal;
    Overlay: import("react").ForwardRefExoticComponent<import("heroui-native").SelectOverlayProps & import("react").RefAttributes<View>>;
    Content: import("react").ForwardRefExoticComponent<TimePickerContentProps & import("react").RefAttributes<View>>;
    Trigger: import("react").ForwardRefExoticComponent<TimePickerTriggerProps & import("react").RefAttributes<SelectPrimitivesTypes.TriggerRef>>;
    Value: import("react").ForwardRefExoticComponent<Omit<import("heroui-native").SelectValueProps, "placeholder"> & {
        placeholder?: string;
    } & import("react").RefAttributes<import("react-native").Text>>;
    TriggerIndicator: import("react").ForwardRefExoticComponent<import("heroui-native").SelectTriggerIndicatorProps & import("react").RefAttributes<View>>;
    Wheel: import("react").ForwardRefExoticComponent<TimePickerWheelProps & import("react").RefAttributes<View>>;
    WheelHour: import("react").ForwardRefExoticComponent<import("../wheel-time-picker").WheelTimePickerHourProps & import("react").RefAttributes<import("../wheel-picker").WheelPickerRootRef>>;
    WheelMinute: import("react").ForwardRefExoticComponent<import("../wheel-time-picker").WheelTimePickerMinuteProps & import("react").RefAttributes<import("../wheel-picker").WheelPickerRootRef>>;
    WheelPeriod: import("react").ForwardRefExoticComponent<import("../wheel-time-picker").WheelTimePickerPeriodProps & import("react").RefAttributes<import("../wheel-picker").WheelPickerRootRef>>;
    WheelIndicator: import("react").ForwardRefExoticComponent<import("../wheel-time-picker").WheelTimePickerIndicatorProps & import("react").RefAttributes<View>>;
    WheelMask: import("react").ForwardRefExoticComponent<import("../wheel-time-picker").WheelTimePickerMaskProps & import("react").RefAttributes<View>>;
};
export default TimePicker;
//# sourceMappingURL=time-picker.d.ts.map