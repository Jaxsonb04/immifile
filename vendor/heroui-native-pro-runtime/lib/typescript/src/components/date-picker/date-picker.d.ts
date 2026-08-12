import { View } from 'react-native';
import type * as SelectPrimitivesTypes from '../../primitives/select/select.types';
import type { DatePickerPortalProps, DatePickerRootProps, DatePickerSelectProps, DatePickerTriggerProps } from './date-picker.types';
/**
 * `Select.Portal` renders into a host via the portal system, which breaks React context from
 * ancestors. Re-wrap `children` with `DatePickerProvider` so `DatePicker.Content` / `DatePicker.Calendar`
 * can still call `useDatePicker()` when portaled.
 */
declare function DatePickerPortal(props: DatePickerPortalProps): import("react/jsx-runtime").JSX.Element;
declare namespace DatePickerPortal {
    var displayName: string;
}
/**
 * DatePicker — field shell with optional managed state for `DatePicker.Select` + `DatePicker.Calendar`.
 *
 * For managed behavior, pass `value` / `onValueChange` / `isOpen` / `onOpenChange` on the root (or use
 * uncontrolled defaults) and use **`DatePicker.Select`** with **`DatePicker.Portal`**, **`DatePicker.Content`**,
 * and **`DatePicker.Calendar`**. Use a raw **`Select`** only if you omit root state props and wire
 * everything manually.
 */
declare const DatePicker: import("react").ForwardRefExoticComponent<DatePickerRootProps & import("react").RefAttributes<View>> & {
    Select: import("react").ForwardRefExoticComponent<DatePickerSelectProps & import("react").RefAttributes<View>>;
    Portal: typeof DatePickerPortal;
    Overlay: import("react").ForwardRefExoticComponent<import("heroui-native").SelectOverlayProps & import("react").RefAttributes<View>>;
    Content: import("react").ForwardRefExoticComponent<import("heroui-native").SelectContentProps & import("react").RefAttributes<View>>;
    Calendar: import("react").ForwardRefExoticComponent<Omit<import("../calendar").CalendarProps, "accessibilityLabel"> & {
        accessibilityLabel?: string;
    } & import("react").RefAttributes<View>>;
    Trigger: import("react").ForwardRefExoticComponent<DatePickerTriggerProps & import("react").RefAttributes<SelectPrimitivesTypes.TriggerRef>>;
    Value: import("react").ForwardRefExoticComponent<Omit<import("heroui-native").SelectValueProps, "placeholder"> & {
        placeholder?: string;
    } & import("react").RefAttributes<import("react-native").Text>>;
    TriggerIndicator: import("react").ForwardRefExoticComponent<import("heroui-native").SelectTriggerIndicatorProps & import("react").RefAttributes<View>>;
};
export default DatePicker;
//# sourceMappingURL=date-picker.d.ts.map