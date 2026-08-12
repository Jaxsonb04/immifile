import type { AnimationRootDisableAll } from '../../helpers/internal/types';
import type { NumberFieldButtonAnimation } from './number-field.types';
/**
 * Animation hook for the NumberField root.
 * Handles cascading `isAllAnimationsDisabled` to children
 * via `AnimationSettingsProvider`.
 */
export declare function useNumberFieldRootAnimation(options: {
    animation: AnimationRootDisableAll | undefined;
}): {
    isAllAnimationsDisabled: boolean;
};
/**
 * Animation hook for NumberField increment/decrement buttons.
 * Produces a subtle scale animation on press.
 *
 * @param options.animation - Button animation configuration
 * @param options.isPressed - Whether the button is currently pressed
 * @returns `rContentContainerStyle` animated style
 */
export declare function useNumberFieldButtonAnimation(options: {
    animation: NumberFieldButtonAnimation | undefined;
    isPressed: boolean;
}): {
    rContentContainerStyle: import("react-native-reanimated/lib/typescript/hook/commonTypes").AnimatedStyleHandle<{
        transform: {
            scale: number;
        }[];
    }>;
};
//# sourceMappingURL=number-field.animation.d.ts.map