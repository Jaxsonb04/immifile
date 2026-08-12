import type { RadialChartRootAnimation } from './radial-chart.types';
/**
 * Root cascade hook for `RadialChart`. Owns no animated styles — combines global + parent +
 * own disable-all state into `isAllAnimationsDisabled` so {@link RadialChart.Bar} can skip
 * sweep animations when the cascade fires.
 *
 * @param options.animation Root's `animation` prop value.
 * @returns `{ isAllAnimationsDisabled }` — `true` when cascaded `"disable-all"` is active.
 */
export declare function useRadialChartRootAnimation(options: {
    animation: RadialChartRootAnimation | undefined;
}): {
    isAllAnimationsDisabled: boolean;
};
//# sourceMappingURL=radial-chart.animation.d.ts.map