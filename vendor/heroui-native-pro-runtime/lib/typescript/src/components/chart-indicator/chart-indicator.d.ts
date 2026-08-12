import type { ChartIndicatorProps } from './chart-indicator.types';
/**
 * Themed Skia double-dot (outer halo + inner) at chart-press coordinates from
 * `useChartPressState`.
 *
 * Render inside any cartesian chart's Skia children (e.g. `LineChart`, `AreaChart`, `BarChart`)
 * after wiring `chartPressState` on the chart root.
 */
declare function ChartIndicator(props: ChartIndicatorProps): import("react/jsx-runtime").JSX.Element;
declare namespace ChartIndicator {
    var displayName: "HeroUINative.ChartIndicator";
}
export default ChartIndicator;
//# sourceMappingURL=chart-indicator.d.ts.map