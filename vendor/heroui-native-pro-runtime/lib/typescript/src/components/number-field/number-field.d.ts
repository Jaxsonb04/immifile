import { type TextInput as TextInputType, View } from 'react-native';
import type { NumberFieldButtonProps, NumberFieldGroupProps, NumberFieldInputProps, NumberFieldProps } from './number-field.types';
/**
 * Compound NumberField component with sub-components.
 *
 * @component NumberField - Root form field container that provides
 * FormFieldProvider (for Label, Description, FieldError), number state
 * management (controlled/uncontrolled), and animation settings context.
 * Combines TextField (form field) and InputGroup (group container) patterns
 * with number-specific logic (formatting, min/max/step, increment/decrement).
 *
 * @component NumberField.Group - Plain View wrapper (like InputGroup root)
 * that contains DecrementButton, Input, and IncrementButton.
 *
 * @component NumberField.Input - Pass-through to the Input component.
 * Displays the formatted numeric value and automatically receives
 * paddingLeft/paddingRight from measured button widths. Commits the
 * value on blur.
 *
 * @component NumberField.DecrementButton - Absolutely positioned button
 * anchored to the left side of the Input. Decrements the value by one step.
 * Auto-disabled when the value reaches minValue. Supports long-press repeat.
 *
 * @component NumberField.IncrementButton - Absolutely positioned button
 * anchored to the right side of the Input. Increments the value by one step.
 * Auto-disabled when the value reaches maxValue. Supports long-press repeat.
 *
 */
declare const CompoundNumberField: import("react").ForwardRefExoticComponent<NumberFieldProps & import("react").RefAttributes<View>> & {
    /** Plain View wrapper for DecrementButton, Input, and IncrementButton */
    Group: import("react").ForwardRefExoticComponent<NumberFieldGroupProps & import("react").RefAttributes<View>>;
    /** Pass-through to Input — displays formatted number value */
    Input: import("react").ForwardRefExoticComponent<NumberFieldInputProps & import("react").RefAttributes<TextInputType>>;
    /** Decrements value by one step; absolutely positioned left */
    DecrementButton: import("react").ForwardRefExoticComponent<NumberFieldButtonProps & import("react").RefAttributes<View>>;
    /** Increments value by one step; absolutely positioned right */
    IncrementButton: import("react").ForwardRefExoticComponent<NumberFieldButtonProps & import("react").RefAttributes<View>>;
};
export default CompoundNumberField;
//# sourceMappingURL=number-field.d.ts.map