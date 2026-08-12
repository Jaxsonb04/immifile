import { type WithTimingConfig } from 'react-native-reanimated';
import type { AnimationRootDisableAll, AnimationValue } from '../../helpers/internal/types';
import type { ProgressBarFillAnimation } from './progress-bar.types';
/**
 * Animation hook for the {@link ProgressBar} root component.
 *
 * Combines the global, parent, and own `disable-all` animation states so the
 * root can cascade `isAllAnimationsDisabled` to children via
 * `AnimationSettingsProvider`.
 *
 * Priority: Global > Parent > Own.
 */
export declare function useProgressBarRootAnimation(options: {
    /** Root animation prop (controls cascading disable-all behavior). */
    animation: AnimationRootDisableAll | undefined;
}): {
    isAllAnimationsDisabled: boolean;
};
/**
 * Animation hook for the {@link ProgressBar}.Fill component.
 * Resolves the timing configurations for both determinate and indeterminate
 * fill animations from the `animation` prop, merging with defaults.
 */
export declare function useProgressBarFillRootAnimation(options: {
    animation: ProgressBarFillAnimation | undefined;
}): {
    fillTimingConfig: WithTimingConfig;
    indeterminateFillTimingConfig: WithTimingConfig;
    isAnimationDisabled: boolean;
};
/**
 * Animation hook for the ProgressBar.Fill in determinate mode.
 * Produces an animated width style that transitions smoothly
 * when the percentage changes.
 */
export declare function useProgressBarFillAnimation(options: {
    percentage: number;
    isAnimationDisabled: boolean;
    fillTimingConfig: AnimationValue<WithTimingConfig> | undefined;
}): {
    rFillStyle: import("react-native-reanimated/lib/typescript/hook/commonTypes").AnimatedStyleHandle<{
        width: `${number}%`;
    }>;
};
/**
 * Animation hook for the ProgressBar.Fill in indeterminate mode.
 * Produces a looping translateX animation that sweeps the fill
 * from fully off-screen left to fully off-screen right.
 *
 * `trackWidth` must be the measured width of the Track container
 * (not the fill) so the sweep covers the entire visible area.
 */
export declare function useProgressBarIndeterminateAnimation(options: {
    trackWidth: number;
    isAnimationDisabled: boolean;
    indeterminateFillTimingConfig: AnimationValue<WithTimingConfig> | undefined;
}): {
    rIndeterminateFillStyle: import("react-native-reanimated/lib/typescript/hook/commonTypes").AnimatedStyleHandle<{
        width: "40%";
        transform: {
            translateX: number;
        }[];
    }>;
};
//# sourceMappingURL=progress-bar.animation.d.ts.map