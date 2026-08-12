import type { SharedValue } from 'react-native-reanimated';
import type { AnimationDisabled } from '../../helpers/internal/types';
import type { StepperAnimationContextValue, StepperRootAnimation } from './stepper.types';
declare const StepperAnimationProvider: import("react").Provider<StepperAnimationContextValue>, useStepperAnimation: () => StepperAnimationContextValue;
export { StepperAnimationProvider, useStepperAnimation };
export declare function useStepperRootAnimation(options: {
    /** Root animation prop (timing and disable-all cascade). */
    animation: StepperRootAnimation | undefined;
    /** Active step index from stepper root context (same as primitive `currentStep`). */
    currentStep: number;
}): {
    progress: SharedValue<number>;
    isAllAnimationsDisabled: boolean;
};
/**
 * Animated scale for `Stepper.SeparatorFill` from root `progress` and step `index`.
 * Output maps `[index - 1, index]` to scale `[0, 1]`; vertical: `scaleY`; horizontal: `scaleX`.
 * When fill animation is disabled, scale snaps to `0` or `1` (no interpolation vs `progress`).
 */
export declare function useStepperSeparatorFillAnimation(options: {
    animation: AnimationDisabled | undefined;
    index: number;
    orientation: 'horizontal' | 'vertical';
    progress: SharedValue<number>;
}): {
    animatedStyle: import("react-native-reanimated/lib/typescript/hook/commonTypes").AnimatedStyleHandle<{
        transform: {
            scaleY: number;
        }[];
        transformOrigin: string;
    } | {
        transform: {
            scaleX: number;
        }[];
        transformOrigin: string;
    }>;
};
//# sourceMappingURL=stepper.animation.d.ts.map