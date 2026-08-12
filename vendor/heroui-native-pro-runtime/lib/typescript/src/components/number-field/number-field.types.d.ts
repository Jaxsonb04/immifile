import type { InputProps } from 'heroui-native';
import type { PressableProps, StyleProp, ViewProps, ViewStyle } from 'react-native';
import type { WithTimingConfig } from 'react-native-reanimated';
import type { Animation, AnimationRootDisableAll, AnimationValue, ElementSlots } from '../../helpers/internal/types';
import type { DecrementButtonSlots } from './number-field.styles';
/**
 * Animation configuration for NumberField increment/decrement buttons.
 * Controls the subtle scale feedback on press.
 *
 * - `false` or `"disabled"`: Disable button press animation
 * - `undefined`: Use default animation
 * - `object`: Custom animation configuration
 */
export type NumberFieldButtonAnimation = Animation<{
    scale?: AnimationValue<{
        /**
         * Scale values `[unpressed, pressed]`.
         *
         * @default [1, 0.9]
         */
        value?: [number, number];
        /**
         * Animation timing configuration.
         *
         * @default { duration: 150 }
         */
        timingConfig?: WithTimingConfig;
    }>;
}>;
/**
 * Context value provided by NumberField root to child components.
 * Carries number state, formatting, and button width measurements
 * so child components can read/update the value and auto-pad the input.
 */
export interface NumberFieldContextType {
    /** Current numeric value (NaN when the field is empty) */
    numberValue: number;
    /** Display string shown in the input (formatted or raw while editing) */
    displayValue: string;
    /** Whether the entire number field is disabled */
    isDisabled: boolean;
    /** Whether the number field is in an invalid state */
    isInvalid: boolean;
    /** Whether the number field is required */
    isRequired: boolean;
    /** Whether the value can be incremented (not at max) */
    canIncrement: boolean;
    /** Whether the value can be decremented (not at min) */
    canDecrement: boolean;
    /** Increment the value by one step */
    increment: () => void;
    /** Decrement the value by one step */
    decrement: () => void;
    /** Update the raw input string (while the user is typing) */
    setDisplayValue: (text: string) => void;
    /** Parse, clamp, format, and commit the current input value */
    commit: () => void;
    /** Measured width of the decrement button (0 when absent) */
    decrementButtonWidth: number;
    /** Measured width of the increment button (0 when absent) */
    incrementButtonWidth: number;
    /** Called by DecrementButton after layout to report its width */
    setDecrementButtonWidth: (width: number) => void;
    /** Called by IncrementButton after layout to report its width */
    setIncrementButtonWidth: (width: number) => void;
}
/**
 * Props for the NumberField root component.
 * Combines TextField (form field provider) and InputGroup (group container)
 * patterns with number-specific state management.
 */
export interface NumberFieldProps extends ViewProps {
    /**
     * Children elements (Label, NumberField.Group, Description, FieldError, etc.)
     */
    children?: React.ReactNode;
    /**
     * Additional CSS classes
     */
    className?: string;
    /**
     * Controlled numeric value
     */
    value?: number;
    /**
     * Default value for uncontrolled usage
     */
    defaultValue?: number;
    /**
     * Handler called when the numeric value changes
     */
    onChange?: (value: number) => void;
    /**
     * Minimum allowed value. The decrement button is disabled when the
     * value reaches this limit.
     */
    minValue?: number;
    /**
     * Maximum allowed value. The increment button is disabled when the
     * value reaches this limit.
     */
    maxValue?: number;
    /**
     * Step value for increment/decrement operations.
     *
     * @default 1
     */
    step?: number;
    /**
     * Intl.NumberFormat options for formatting the displayed value
     * (currency, percent, decimal, unit, etc.).
     */
    formatOptions?: Intl.NumberFormatOptions;
    /**
     * Whether the entire number field and its children are disabled.
     *
     * @default false
     */
    isDisabled?: boolean;
    /**
     * Whether the number field is in an invalid state.
     *
     * @default false
     */
    isInvalid?: boolean;
    /**
     * Whether the number field is required (shows asterisk in label).
     *
     * @default false
     */
    isRequired?: boolean;
    /**
     * Animation configuration for number field
     * - `"disable-all"`: Disable all animations including children (cascades down)
     * - `undefined`: Use default animations
     */
    animation?: AnimationRootDisableAll;
}
/**
 * Render props passed to NumberField.Group's children render function.
 * Picked from NumberFieldContextType.
 */
export type NumberFieldGroupRenderProps = Pick<NumberFieldContextType, 'numberValue' | 'displayValue' | 'canIncrement' | 'canDecrement' | 'isDisabled' | 'isInvalid' | 'isRequired' | 'decrementButtonWidth' | 'incrementButtonWidth'>;
/**
 * Props for the NumberField.Group component.
 * A plain View wrapper (like InputGroupRoot) that contains
 * DecrementButton, Input, and IncrementButton.
 */
export interface NumberFieldGroupProps extends Omit<ViewProps, 'children'> {
    /**
     * Children elements, or a render function receiving group state.
     */
    children?: React.ReactNode | ((props: NumberFieldGroupRenderProps) => React.ReactNode);
    /**
     * Additional CSS classes
     */
    className?: string;
}
/**
 * Props for the NumberField.Input component.
 * Passes all props directly through to the underlying Input component.
 */
export interface NumberFieldInputProps extends InputProps {
    /**
     * Whether the input automatically adds inner padding to avoid
     * overlapping with the increment/decrement buttons.
     *
     * @default true
     */
    isAutoPaddingActive?: boolean;
    /**
     * Extra horizontal spacing (in logical pixels) added between
     * a button edge and the text content when auto-padding is active.
     *
     * @default 12
     */
    autoPaddingAddon?: number;
}
/**
 * Props for NumberField.IncrementButton and NumberField.DecrementButton.
 * Absolutely positioned over the Input, similar to InputGroup.Prefix/Suffix.
 *
 * Both button types share the same slot structure (`container`, `contentContainer`).
 * `DecrementButtonSlots` and `IncrementButtonSlots` are structurally identical.
 */
export interface NumberFieldButtonProps extends Omit<PressableProps, 'children' | 'style'> {
    /**
     * Button content. When omitted, the default icon (MinusIcon / PlusIcon) is rendered.
     */
    children?: React.ReactNode;
    /**
     * Style applied to the outer Pressable container.
     */
    style?: StyleProp<ViewStyle>;
    /**
     * Additional CSS classes for the outer container slot.
     */
    className?: string;
    /**
     * Additional CSS classes for individual slots.
     */
    classNames?: ElementSlots<DecrementButtonSlots>;
    /**
     * Styles for individual slots.
     */
    styles?: Partial<Record<DecrementButtonSlots, ViewStyle>>;
    /**
     * Animation configuration for the button press scale feedback.
     *
     * - `false` or `"disabled"`: Disable press animation
     * - `undefined`: Use default scale animation
     * - `object`: Custom scale animation configuration
     */
    animation?: NumberFieldButtonAnimation;
    /**
     * Whether the animated style is applied to the `contentContainer`.
     * Set to `false` to completely disable animated styles and apply your
     * own via `classNames` or `styles`.
     *
     * @default true
     */
    isAnimatedStyleActive?: boolean;
    /**
     * Props forwarded to the default icon (MinusIcon / PlusIcon).
     * Ignored when custom `children` are provided.
     */
    iconProps?: {
        /**
         * Icon size in logical pixels.
         *
         * @default 16
         */
        size?: number;
        /**
         * Icon fill color.
         * When omitted the current theme foreground color is used.
         */
        color?: string;
    };
}
//# sourceMappingURL=number-field.types.d.ts.map