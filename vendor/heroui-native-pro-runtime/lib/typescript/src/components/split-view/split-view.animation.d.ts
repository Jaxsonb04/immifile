import { type SharedValue } from 'react-native-reanimated';
import type { SplitViewDragHandleAnimation, SplitViewRootAnimation } from './split-view.types';
/**
 * Animation hook for the SplitView root.
 * Resolves spring configs and cascaded `disable-all` for `AnimationSettingsProvider`.
 */
export declare function useSplitViewRootAnimation(options: {
    animation: SplitViewRootAnimation | undefined;
}): {
    isAllAnimationsDisabled: boolean;
    snapSpringConfig: NonNullable<import("react-native-reanimated/lib/typescript/animation/spring").SpringConfig | undefined>;
};
/**
 * Animated height for the top pane (driven by root `topSectionHeight` shared value).
 */
export declare function useSplitViewTopSectionAnimation(options: {
    topSectionHeight: SharedValue<number>;
}): {
    rTopStyle: import("react-native-reanimated/lib/typescript/hook/commonTypes").AnimatedStyleHandle<{
        height: number;
    }>;
};
/**
 * Scale feedback on the drag handle while dragging.
 */
export declare function useSplitViewDragHandleAnimation(options: {
    animation: SplitViewDragHandleAnimation | undefined;
    isDragging: SharedValue<boolean>;
    isAllAnimationsDisabled: boolean;
}): {
    rHandleStyle: import("react-native-reanimated/lib/typescript/hook/commonTypes").AnimatedStyleHandle<{
        transform: {
            scale: number;
        }[];
    }>;
};
//# sourceMappingURL=split-view.animation.d.ts.map