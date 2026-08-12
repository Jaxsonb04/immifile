import type { AnimationRootDisableAll } from '../../helpers/internal/types';
import type { NumberPadKeyAnimation } from './number-pad.types';
/**
 * Animation hook for NumberPad root component.
 * Handles root-level animation configuration and provides cascading disable state.
 */
export declare function useNumberPadRootAnimation(options: {
    animation: AnimationRootDisableAll | undefined;
}): {
    isAllAnimationsDisabled: boolean;
};
/**
 * Animation hook for NumberPad.Key and NumberPad.Backspace components.
 * Provides subtle scale feedback on press via onPressIn/onPressOut callbacks.
 */
export declare function useNumberPadKeyAnimation(options: {
    animation: NumberPadKeyAnimation | undefined;
}): {
    animationOnPressIn: () => void;
    animationOnPressOut: () => void;
    rContainerStyle: import("react-native-reanimated/lib/typescript/hook/commonTypes").AnimatedStyleHandle<{
        transform: {
            scale: number;
        }[];
    }>;
};
//# sourceMappingURL=number-pad.animation.d.ts.map