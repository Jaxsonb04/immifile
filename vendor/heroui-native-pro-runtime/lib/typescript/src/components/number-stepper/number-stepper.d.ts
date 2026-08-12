import * as NumberStepperPrimitives from '../../primitives/number-stepper';
import type { NumberStepperDecrementButtonProps, NumberStepperIncrementButtonProps, NumberStepperRootProps, NumberStepperValueProps } from './number-stepper.types';
declare const useNumberStepper: typeof NumberStepperPrimitives.useRootContext;
/**
 * Compound NumberStepper component with sub-components
 *
 * @component NumberStepper - Root container managing numeric value state.
 * Provides disabled context to sub-components.
 * Supports both controlled and uncontrolled value state.
 *
 * @component NumberStepper.DecrementButton - Pressable button that decreases
 * the value by one step. Auto-disabled at minValue. Renders a minus icon
 * by default; accepts custom children for full customization.
 *
 * @component NumberStepper.Value - Displays the current numeric value with
 * flip animations on change (matching InputOTP pattern). Remounts on
 * value change to trigger entering/exiting layout animations.
 *
 * @component NumberStepper.IncrementButton - Pressable button that increases
 * the value by one step. Auto-disabled at maxValue. Renders a plus icon
 * by default; accepts custom children for full customization.
 *
 * Props flow from NumberStepper to sub-components via context (value,
 * isDisabled, isAtMin, isAtMax, increment, decrement).
 *
 */
declare const NumberStepper: import("react").ForwardRefExoticComponent<NumberStepperRootProps & import("react").RefAttributes<import("react-native").View>> & {
    /** @optional Pressable button to decrease value by one step */
    DecrementButton: import("react").ForwardRefExoticComponent<NumberStepperDecrementButtonProps & import("react").RefAttributes<import("react-native").View>>;
    /** @optional Display for the current numeric value with animations */
    Value: import("react").ForwardRefExoticComponent<NumberStepperValueProps & import("react").RefAttributes<import("react-native").Text>>;
    /** @optional Pressable button to increase value by one step */
    IncrementButton: import("react").ForwardRefExoticComponent<NumberStepperIncrementButtonProps & import("react").RefAttributes<import("react-native").View>>;
};
export default NumberStepper;
export { useNumberStepper };
//# sourceMappingURL=number-stepper.d.ts.map