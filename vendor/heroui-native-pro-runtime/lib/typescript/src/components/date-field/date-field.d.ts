import type { InputGroupPrefixProps, InputGroupProps, InputGroupSuffixProps } from 'heroui-native/input-group';
import type { TextInput as TextInputType } from 'react-native';
import { View } from 'react-native';
import type * as SelectPrimitivesTypes from '../../primitives/select/select.types';
import type { DateFieldPortalProps, DateFieldRootProps, DateFieldSelectProps, DateFieldTriggerProps } from './date-field.types';
declare const DateFieldRoot: import("react").ForwardRefExoticComponent<DateFieldRootProps & import("react").RefAttributes<View>>;
declare const DateFieldSelect: import("react").ForwardRefExoticComponent<DateFieldSelectProps & import("react").RefAttributes<View>>;
/**
 * `Select.Portal` breaks ancestor context; re-wrap with `DatePickerProvider` so portaled
 * `DateField.Content` / `DateField.Calendar` still resolve `useDatePicker()`.
 */
declare function DateFieldPortal(props: DateFieldPortalProps): import("react/jsx-runtime").JSX.Element;
declare namespace DateFieldPortal {
    var displayName: string;
}
declare const DateFieldOverlay: import("react").ForwardRefExoticComponent<import("heroui-native").SelectOverlayProps & import("react").RefAttributes<View>>;
declare const DateFieldContent: import("react").ForwardRefExoticComponent<import("heroui-native").SelectContentProps & import("react").RefAttributes<View>>;
declare const DateFieldCalendar: import("react").ForwardRefExoticComponent<Omit<import("../calendar").CalendarProps, "accessibilityLabel"> & {
    accessibilityLabel?: string;
} & import("react").RefAttributes<View>>;
declare const DateFieldTrigger: import("react").ForwardRefExoticComponent<DateFieldTriggerProps & import("react").RefAttributes<SelectPrimitivesTypes.TriggerRef>>;
declare const DateFieldTriggerIndicator: import("react").ForwardRefExoticComponent<import("heroui-native").SelectTriggerIndicatorProps & import("react").RefAttributes<View>>;
declare const DateFieldInputGroupRoot: import("react").ForwardRefExoticComponent<InputGroupProps & import("react").RefAttributes<View>>;
declare const DateFieldSuffix: import("react").ForwardRefExoticComponent<InputGroupSuffixProps & import("react").RefAttributes<View>>;
declare const DateFieldInput: import("react").ForwardRefExoticComponent<Omit<import("heroui-native").InputGroupInputProps, "value" | "onChangeText"> & {
    onChangeText?: import("heroui-native").InputGroupInputProps["onChangeText"];
} & import("react").RefAttributes<TextInputType>>;
declare const DateFieldPrefix: import("react").ForwardRefExoticComponent<InputGroupPrefixProps & import("react").RefAttributes<View>>;
/**
 * Static parts attached to the root. We assign properties explicitly instead of only using
 * `Object.assign`: some Metro / Hermes bundles do not reliably retain every key on `forwardRef`
 * results, which surfaced as `DateField.Input` being `undefined` at runtime.
 */
type DateFieldStaticParts = {
    Select: typeof DateFieldSelect;
    Portal: typeof DateFieldPortal;
    Overlay: typeof DateFieldOverlay;
    Content: typeof DateFieldContent;
    Calendar: typeof DateFieldCalendar;
    Trigger: typeof DateFieldTrigger;
    TriggerIndicator: typeof DateFieldTriggerIndicator;
    InputGroup: typeof DateFieldInputGroupRoot;
    Prefix: typeof DateFieldPrefix;
    Input: typeof DateFieldInput;
    Suffix: typeof DateFieldSuffix;
};
declare const DateField: typeof DateFieldRoot & DateFieldStaticParts;
/**
 * `DateField` — text field with `dd/mm/yyyy` input and `DateField.Select` + calendar surface.
 *
 * Compose **`DateField.InputGroup`** with **`DateField.Input`**, **`DateField.Prefix`** / **`DateField.Suffix`**,
 * and nest **`DateField.Select`** (with **`DateField.Trigger`**, **`DateField.Portal`**, **`DateField.Content`**,
 * **`DateField.Calendar`**) inside the suffix when the trigger opens the calendar from the trailing slot.
 */
export default DateField;
//# sourceMappingURL=date-field.d.ts.map