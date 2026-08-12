import type { GestureResponderEvent, LayoutChangeEvent } from 'react-native';
import { type SharedValue } from 'react-native-reanimated';
import type { ProgressButtonRootAnimation } from './progress-button.types';
/**
 * Animation hook for the ProgressButton root component.
 * Manages shared values (progress, pressScale, layout measurements),
 * press handlers with animation, controlled sync with external state,
 * and the container press-scale style.
 *
 * Consumer-provided `onPressIn`, `onPressOut`, and `onLayout` callbacks
 * are forwarded after the internal animation logic runs.
 */
export declare function useProgressButtonRootAnimation(options: {
    /** Root animation configuration (spring config, disable-all) */
    animation: ProgressButtonRootAnimation | undefined;
    /** Current completion state (for initial shared value and controlled sync) */
    isCompleted: boolean;
    /** Duration in ms for the hold-to-fill timing animation */
    holdDuration: number;
    /** Ref flag set by the component before internal state changes to skip sync */
    isInternalChangeRef: {
        current: boolean;
    };
    /** Consumer-provided press-in callback to forward */
    onPressIn?: ((event: GestureResponderEvent) => void) | null;
    /** Consumer-provided press-out callback to forward */
    onPressOut?: ((event: GestureResponderEvent) => void) | null;
    /** Consumer-provided layout callback to forward */
    onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
}): {
    isAllAnimationsDisabled: boolean;
    progress: SharedValue<number>;
    isProgressCompleted: import("react-native-reanimated").DerivedValue<boolean>;
    trackWidth: SharedValue<number>;
    textX: SharedValue<number>;
    textWidth: SharedValue<number>;
    rContainerStyle: import("react-native-reanimated/lib/typescript/hook/commonTypes").AnimatedStyleHandle<{
        transform: {
            scale: number;
        }[];
    }>;
    handlePressIn: (event: GestureResponderEvent) => void;
    handlePressOut: (event: GestureResponderEvent) => void;
    handleLayout: (event: LayoutChangeEvent) => void;
    resetProgress: () => void;
};
/**
 * Animation hook for the ProgressButton overlay.
 * Produces a translateX style that sweeps the overlay from left to right
 * as progress goes from 0 to 1. At 0 the overlay is entirely off-screen
 * to the left; at 1 it fully covers the root.
 * Also produces a width style that keeps the overlay at track width.
 */
export declare function useProgressButtonOverlayAnimation(options: {
    progress: SharedValue<number>;
    trackWidth: SharedValue<number>;
}): {
    rOverlayStyle: import("react-native-reanimated/lib/typescript/hook/commonTypes").AnimatedStyleHandle<{
        transform: {
            translateX: number;
        }[];
    }>;
    rWidthStyle: import("react-native-reanimated/lib/typescript/hook/commonTypes").AnimatedStyleHandle<{
        width: number;
    }>;
};
/**
 * Animation hook for the ProgressButton mask label.
 * Counter-translates the MaskLabel so it stays visually aligned with
 * the base Label as the overlay sweeps across. Uses textX and textWidth
 * to compute the progress window where counter-translation occurs.
 */
export declare function useProgressButtonMaskLabelAnimation(options: {
    progress: SharedValue<number>;
    trackWidth: SharedValue<number>;
    textX: SharedValue<number>;
    textWidth: SharedValue<number>;
}): {
    rMaskLabelStyle: import("react-native-reanimated/lib/typescript/hook/commonTypes").AnimatedStyleHandle<{
        transform: {
            translateX: number;
        }[];
    }>;
};
//# sourceMappingURL=progress-button.animation.d.ts.map