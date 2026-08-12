import type { PressableRef, SlottablePressableProps, SlottableTextProps, SlottableViewProps, TextRef, ViewRef } from '../../helpers/internal/types';
/**
 * Direction of the most recent value change.
 * Used to drive direction-aware animations on the value display.
 */
export type NumberStepperDirection = 'increase' | 'decrease';
/**
 * Context for the number stepper root component.
 * Provides value state, boundary info, and actions to sub-components.
 */
export type RootContext = {
    /** Unique identifier for accessibility labelling */
    nativeID: string;
    /** Current numeric value of the number stepper */
    value: number;
    /** Step increment/decrement amount */
    step: number;
    /** Minimum allowed value */
    minValue: number;
    /** Maximum allowed value */
    maxValue: number;
    /** Whether the entire number stepper is disabled */
    isDisabled: boolean;
    /** Whether the current value is at or below the minimum */
    isAtMin: boolean;
    /** Whether the current value is at or above the maximum */
    isAtMax: boolean;
    /** Direction of the most recent value change */
    direction: NumberStepperDirection;
    /** Set the direction for the next value change (triggers re-render) */
    setDirection: (direction: NumberStepperDirection) => void;
    /** Decrement the value by one step */
    decrement: () => void;
    /** Increment the value by one step */
    increment: () => void;
};
/**
 * Read-only state values exposed to the render function children.
 * Provides the current value, boundary flags, and disabled state.
 */
export type RootRenderProps = {
    /** Current numeric value of the number stepper */
    value: number;
    /** Whether the current value is at or below the minimum */
    isAtMin: boolean;
    /** Whether the current value is at or above the maximum */
    isAtMax: boolean;
    /** Whether the entire number stepper is disabled */
    isDisabled: boolean;
    /** Step increment/decrement amount */
    step: number;
    /** Minimum allowed value */
    minValue: number;
    /** Maximum allowed value */
    maxValue: number;
};
/**
 * Props for the NumberStepper root component.
 * Manages value state, boundaries, and provides context to sub-components.
 *
 * @extends SlottableViewProps Inherits view props for slot-based composition
 */
export type RootProps = Omit<SlottableViewProps, 'children'> & {
    /** Unique identifier for the number stepper. Auto-generated when not provided. */
    id?: string | number;
    /**
     * Controlled numeric value.
     * When provided, the component operates in controlled mode.
     */
    value?: number;
    /**
     * Default value for uncontrolled mode.
     *
     * @default 0
     */
    defaultValue?: number;
    /**
     * Callback fired when the value changes.
     */
    onValueChange?: (value: number) => void;
    /**
     * Minimum allowed value.
     *
     * @default -Infinity
     */
    minValue?: number;
    /**
     * Maximum allowed value.
     *
     * @default Infinity
     */
    maxValue?: number;
    /**
     * Step amount for increment/decrement operations.
     *
     * @default 1
     */
    step?: number;
    /**
     * Whether the number stepper is disabled.
     *
     * @default false
     */
    isDisabled?: boolean;
    /**
     * Children to render inside the number stepper.
     * Accepts a render function receiving read-only state values for
     * conditional rendering based on number stepper context.
     *
     * @example
     * <NumberStepper minValue={1}>
     *   {({ isAtMin }) => (
     *     <>
     *       <NumberStepper.DecrementButton>
     *         {isAtMin ? <TrashIcon /> : undefined}
     *       </NumberStepper.DecrementButton>
     *       <NumberStepper.Value />
     *       <NumberStepper.IncrementButton />
     *     </>
     *   )}
     * </NumberStepper>
     */
    children?: React.ReactNode | ((props: RootRenderProps) => React.ReactNode);
};
/**
 * Props for the NumberStepper decrement button.
 * Triggers a value decrease by one step when pressed.
 *
 * @extends SlottablePressableProps Inherits pressable props for slot-based composition
 */
export type DecrementButtonProps = SlottablePressableProps & {
    /**
     * Whether this button is individually disabled.
     * When explicitly provided, overrides context-level isDisabled and
     * boundary auto-disable.
     */
    isDisabled?: boolean;
    /**
     * When true, the button stays interactive and visually active at
     * the min boundary instead of auto-disabling.
     * Useful for patterns like showing a trash icon at quantity 1.
     * The value will not change on press at the boundary, but the
     * onPress callback will still fire.
     *
     * @default false
     */
    keepActiveAtBoundary?: boolean;
};
/**
 * Props for the NumberStepper increment button.
 * Triggers a value increase by one step when pressed.
 *
 * @extends SlottablePressableProps Inherits pressable props for slot-based composition
 */
export type IncrementButtonProps = SlottablePressableProps & {
    /**
     * Whether this button is individually disabled.
     * When explicitly provided, overrides context-level isDisabled and
     * boundary auto-disable.
     */
    isDisabled?: boolean;
    /**
     * When true, the button stays interactive and visually active at
     * the max boundary instead of auto-disabling.
     * The value will not change on press at the boundary, but the
     * onPress callback will still fire.
     *
     * @default false
     */
    keepActiveAtBoundary?: boolean;
};
/**
 * Props for the NumberStepper value display component.
 * Renders the current numeric value as text.
 *
 * @extends SlottableTextProps Inherits text props for slot-based composition
 */
export type ValueProps = SlottableTextProps;
/** Reference type for the NumberStepper root component */
export type RootRef = ViewRef;
/** Reference type for the NumberStepper decrement button */
export type DecrementButtonRef = PressableRef;
/** Reference type for the NumberStepper increment button */
export type IncrementButtonRef = PressableRef;
/** Reference type for the NumberStepper value display */
export type ValueRef = TextRef;
//# sourceMappingURL=number-stepper.types.d.ts.map