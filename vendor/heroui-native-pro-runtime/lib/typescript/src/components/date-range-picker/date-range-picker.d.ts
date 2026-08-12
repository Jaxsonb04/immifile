import type { DateValue } from '@internationalized/date';
import { View } from 'react-native';
import type { RangeValue } from '../../primitives/calendar/state/types';
import type * as SelectPrimitivesTypes from '../../primitives/select/select.types';
import type { DateRangePickerPortalProps, DateRangePickerRootProps, DateRangePickerSelectProps, DateRangePickerTriggerProps } from './date-range-picker.types';
/**
 * `Select.Portal` renders into a host via the portal system, which breaks React context from
 * ancestors. Re-wrap `children` with `DateRangePickerProvider` so `DateRangePicker.Content` / `DateRangePicker.Calendar`
 * can still call `useDateRangePicker()` when portaled.
 */
declare function DateRangePickerPortal(props: DateRangePickerPortalProps): import("react/jsx-runtime").JSX.Element;
declare namespace DateRangePickerPortal {
    var displayName: string;
}
/**
 * DateRangePicker — field shell with optional managed state for `DateRangePicker.Select` + `DateRangePicker.Calendar`.
 *
 * For managed behavior, pass `value` / `onValueChange` / `isOpen` / `onOpenChange` on the root (or use
 * uncontrolled defaults) and use **`DateRangePicker.Select`** with **`DateRangePicker.Portal`**, **`DateRangePicker.Content`**,
 * and **`DateRangePicker.Calendar`** (range selection: two taps). Use a raw **`Select`** only if you omit root state props and wire
 * everything manually.
 */
declare const DateRangePicker: import("react").ForwardRefExoticComponent<DateRangePickerRootProps & import("react").RefAttributes<View>> & {
    Select: import("react").ForwardRefExoticComponent<DateRangePickerSelectProps & import("react").RefAttributes<View>>;
    Portal: typeof DateRangePickerPortal;
    Overlay: import("react").ForwardRefExoticComponent<import("heroui-native").SelectOverlayProps & import("react").RefAttributes<View>>;
    Content: import("react").ForwardRefExoticComponent<import("heroui-native").SelectContentProps & import("react").RefAttributes<View>>;
    Calendar: import("react").ForwardRefExoticComponent<Omit<import("../range-calendar").RangeCalendarProps, "accessibilityLabel" | "onChange"> & {
        accessibilityLabel?: string;
        onChange?: (value: RangeValue<DateValue> | null) => void;
    } & import("react").RefAttributes<View>>;
    Trigger: import("react").ForwardRefExoticComponent<DateRangePickerTriggerProps & import("react").RefAttributes<SelectPrimitivesTypes.TriggerRef>>;
    Value: import("react").ForwardRefExoticComponent<Omit<import("heroui-native").SelectValueProps, "placeholder"> & {
        placeholder?: string;
    } & import("react").RefAttributes<import("react-native").Text>>;
    TriggerIndicator: import("react").ForwardRefExoticComponent<import("heroui-native").SelectTriggerIndicatorProps & import("react").RefAttributes<View>>;
};
export default DateRangePicker;
//# sourceMappingURL=date-range-picker.d.ts.map