import { type SharedValue } from 'react-native-reanimated';
import type { SlideButtonRootAnimation, SlideButtonThumbAnimation } from './slide-button.types';
/**
 * Animation hook for the SlideButton root component.
 * Handles cascading `isAllAnimationsDisabled` to children
 * via `AnimationSettingsProvider`, and extracts `resetSpringConfig`
 * for the reset/auto-reset animation.
 */
export declare function useSlideButtonRootAnimation(options: {
    animation: SlideButtonRootAnimation | undefined;
}): {
    isAllAnimationsDisabled: boolean;
    resetSpringConfig: NonNullable<import("react-native-reanimated/lib/typescript/animation/spring").SpringConfig | undefined>;
};
/**
 * Animation hook for the SlideButton overlay content.
 * Produces an animated clip style (outer wrapper) and an inner style
 * that pins the inner container to the full track width so content
 * lays out naturally and is only visually clipped.
 */
export declare function useSlideButtonOverlayAnimation(options: {
    progress: SharedValue<number>;
    trackWidth: SharedValue<number>;
    thumbWidth: SharedValue<number>;
}): {
    rClipStyle: import("react-native-reanimated/lib/typescript/hook/commonTypes").AnimatedStyleHandle<{
        width: number;
    }>;
    rInnerStyle: import("react-native-reanimated/lib/typescript/hook/commonTypes").AnimatedStyleHandle<{
        width: number;
    }>;
};
/**
 * Animation hook for the SlideButton underlay content.
 * Mirrors the overlay clip logic: the outer wrapper is anchored to the right
 * and shrinks as progress increases, revealing only the portion to the right
 * of the thumb. The inner container keeps full track width so text stays
 * naturally laid out and is merely clipped on the left edge.
 */
export declare function useSlideButtonUnderlayAnimation(options: {
    progress: SharedValue<number>;
    trackWidth: SharedValue<number>;
    thumbWidth: SharedValue<number>;
}): {
    rClipStyle: import("react-native-reanimated/lib/typescript/hook/commonTypes").AnimatedStyleHandle<{
        width: number;
    }>;
    rInnerStyle: import("react-native-reanimated/lib/typescript/hook/commonTypes").AnimatedStyleHandle<{
        width: number;
    }>;
};
/**
 * Animation hook for the SlideButton thumb.
 * Drives translateX from gesture progress and builds the pan gesture
 * that tracks the user's drag, snaps to completion, or springs back.
 */
export declare function useSlideButtonThumbAnimation(options: {
    animation: SlideButtonThumbAnimation | undefined;
    progress: SharedValue<number>;
    isCompleted: boolean;
    trackWidth: SharedValue<number>;
    thumbWidth: SharedValue<number>;
    completionThreshold: number;
    isDisabled: boolean;
    complete: () => void;
}): {
    rThumbStyle: import("react-native-reanimated/lib/typescript/hook/commonTypes").AnimatedStyleHandle<{
        transform: {
            translateX: number;
        }[];
    }>;
    panGesture: import("react-native-gesture-handler/lib/typescript/handlers/gestures/panGesture").PanGesture;
};
//# sourceMappingURL=slide-button.animation.d.ts.map