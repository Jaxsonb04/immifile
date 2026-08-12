import type { ComposedChartRootAnimation } from './composed-chart.types';
/**
 * Resolves root-level animation disable state for {@link ComposedChart}.
 *
 * Cascades `"disable-all"` through {@link AnimationSettingsProvider} so reused
 * `BarChart` / `LineChart` / `AreaChart` series parts drop their `animate` props when disabled.
 */
export declare function useComposedChartRootAnimation(options: {
    animation: ComposedChartRootAnimation | undefined;
}): {
    isAllAnimationsDisabled: boolean;
};
//# sourceMappingURL=composed-chart.animation.d.ts.map