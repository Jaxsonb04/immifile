import type { AnimationRootDisableAll } from '../../helpers/internal/types';
import type { NumberStepperDirection } from '../../primitives/number-stepper/number-stepper.types';
import type { NumberStepperButtonAnimation, NumberStepperValueAnimation } from './number-stepper.types';
/**
 * Animation hook for NumberStepper root component.
 * Handles root-level animation configuration and provides cascading disable state.
 */
export declare function useNumberStepperRootAnimation(options: {
    animation: AnimationRootDisableAll | undefined;
}): {
    isAllAnimationsDisabled: boolean;
};
/**
 * Animation hook for NumberStepper.Value component.
 * Provides direction-aware Keyframe-based entering/exiting animations
 * with spring-like easing. Automatically mirrors translateY based on
 * whether the value is increasing or decreasing.
 */
export declare function useNumberStepperValueAnimation(options: {
    animation: NumberStepperValueAnimation | undefined;
    direction: NumberStepperDirection;
}): {
    entering: import("react-native-reanimated").BaseAnimationBuilder | ((targetValues: import("react-native-reanimated").EntryAnimationsValues) => import("react-native-reanimated").LayoutAnimation) | ((targetValues: import("react-native-reanimated").ExitAnimationsValues) => import("react-native-reanimated").LayoutAnimation) | import("react-native-reanimated").ReanimatedKeyframe | undefined;
    exiting: import("react-native-reanimated").BaseAnimationBuilder | ((targetValues: import("react-native-reanimated").EntryAnimationsValues) => import("react-native-reanimated").LayoutAnimation) | ((targetValues: import("react-native-reanimated").ExitAnimationsValues) => import("react-native-reanimated").LayoutAnimation) | import("react-native-reanimated").ReanimatedKeyframe | undefined;
};
/**
 * Animation hook for NumberStepper increment/decrement buttons.
 * Provides a subtle scale-on-press feedback driven by a SharedValue toggled
 * via onPressIn/onPressOut callbacks.
 */
export declare function useNumberStepperButtonAnimation(options: {
    animation: NumberStepperButtonAnimation | undefined;
}): {
    rButtonStyle: import("react-native-reanimated/lib/typescript/hook/commonTypes").AnimatedStyleHandle<{
        transform: {
            scale: number;
        }[];
    }>;
    animationOnPressIn: () => void;
    animationOnPressOut: () => void;
};
//# sourceMappingURL=number-stepper.animation.d.ts.map