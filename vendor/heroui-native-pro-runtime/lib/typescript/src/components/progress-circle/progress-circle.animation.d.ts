import { type WithTimingConfig } from 'react-native-reanimated';
import type { AnimationRootDisableAll, AnimationValue } from '../../helpers/internal/types';
import type { ProgressCircleIndicatorAnimation } from './progress-circle.types';
/**
 * Animation hook for the {@link ProgressCircle} root component.
 *
 * Combines the global, parent, and own `disable-all` animation states so the
 * root can cascade `isAllAnimationsDisabled` to children via
 * `AnimationSettingsProvider`.
 *
 * Priority: Global > Parent > Own.
 */
export declare function useProgressCircleRootAnimation(options: {
    /** Root animation prop (controls cascading disable-all behavior). */
    animation: AnimationRootDisableAll | undefined;
}): {
    isAllAnimationsDisabled: boolean;
};
/**
 * Animation hook for the {@link ProgressCircle}.Indicator component.
 * Resolves the timing configurations for both determinate fill and
 * indeterminate spin animations from the `animation` prop, merging with
 * defaults.
 */
export declare function useProgressCircleIndicatorRootAnimation(options: {
    animation: ProgressCircleIndicatorAnimation | undefined;
}): {
    fillTimingConfig: WithTimingConfig;
    spinTimingConfig: WithTimingConfig;
    isAnimationDisabled: boolean;
};
/**
 * Animation hook for the determinate ProgressCircle fill arc.
 * Animates `strokeDashoffset` via `useAnimatedProps` to smoothly
 * transition between percentage values.
 */
export declare function useProgressCircleFillAnimation(options: {
    percentage: number;
    isAnimationDisabled: boolean;
    fillTimingConfig: AnimationValue<WithTimingConfig> | undefined;
}): {
    animatedFillProps: Partial<{
        strokeDashoffset: number;
    }>;
};
/**
 * Animation hook for the indeterminate ProgressCircle spin.
 * Produces a continuous rotation style using `withRepeat`.
 */
export declare function useProgressCircleSpinAnimation(options: {
    isAnimationDisabled: boolean;
    spinTimingConfig: AnimationValue<WithTimingConfig> | undefined;
}): {
    rSpinStyle: import("react-native-reanimated/lib/typescript/hook/commonTypes").AnimatedStyleHandle<{
        transform: {
            rotate: string;
        }[];
    }>;
};
//# sourceMappingURL=progress-circle.animation.d.ts.map