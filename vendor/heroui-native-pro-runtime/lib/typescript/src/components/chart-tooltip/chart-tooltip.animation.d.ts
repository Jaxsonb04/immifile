import { type SharedValue } from 'react-native-reanimated';
import type { ChartTooltipAnchorContextValue, ChartTooltipAnchorRootAnimation, ChartTooltipOffset, ChartTooltipPlacement, ChartTooltipRootAnimation, ChartTooltipVisibility } from './chart-tooltip.types';
/**
 * Animation hook for {@link ChartTooltip.Anchor} (root).
 *
 * Owns no animated styles; resolves the combined Global > Parent > Own disabled state so the
 * anchor can cascade `"disable-all"` to {@link ChartTooltip} via `AnimationSettingsProvider`.
 */
export declare function useChartTooltipAnchorRootAnimation(options: {
    animation: ChartTooltipAnchorRootAnimation | undefined;
}): {
    isAllAnimationsDisabled: boolean;
};
/**
 * Animation hook for the {@link ChartTooltip} card.
 *
 * Produces the floating card's animated style: a `withTiming` opacity fade tied to press
 * activity (when `isVisible="auto"`) plus configurable motion (`withSpring` by default,
 * `withTiming` when `type: 'timing'`) that tracks the press indicator and clamps inside
 * `chartBounds` on both axes. Honors the cascaded `disable-all` state from the anchor.
 */
export declare function useChartTooltipRootAnimation(options: {
    animation: ChartTooltipRootAnimation | undefined;
    anchor: ChartTooltipAnchorContextValue;
    measuredWidth: SharedValue<number>;
    measuredHeight: SharedValue<number>;
    gap: number;
    offset: ChartTooltipOffset | undefined;
    placement: ChartTooltipPlacement;
    isVisible: ChartTooltipVisibility;
}): {
    rContainerStyle: import("react-native-reanimated/lib/typescript/hook/commonTypes").AnimatedStyleHandle<{
        opacity: number;
        transform: ({
            translateX: number;
            translateY?: undefined;
        } | {
            translateY: number;
            translateX?: undefined;
        })[];
    }>;
};
//# sourceMappingURL=chart-tooltip.animation.d.ts.map