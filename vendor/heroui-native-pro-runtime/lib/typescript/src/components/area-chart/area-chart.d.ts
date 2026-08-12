import type { AreaChartAreaProps, AreaChartAreaRangeProps, AreaChartInputFields, AreaChartNumericalFields, AreaChartRootProps, AreaChartStackedAreaProps } from './area-chart.types';
declare function AreaChartRoot<RawData extends Record<string, unknown>, XK extends keyof AreaChartInputFields<RawData>, YK extends keyof AreaChartNumericalFields<RawData>>(props: AreaChartRootProps<RawData, XK, YK>): import("react/jsx-runtime").JSX.Element;
declare namespace AreaChartRoot {
    var displayName: "HeroUINative.AreaChart.Root";
}
declare function AreaChartArea(props: AreaChartAreaProps): import("react/jsx-runtime").JSX.Element;
declare namespace AreaChartArea {
    var displayName: "HeroUINative.AreaChart.Area";
}
declare function AreaChartStackedArea(props: AreaChartStackedAreaProps): import("react/jsx-runtime").JSX.Element;
declare namespace AreaChartStackedArea {
    var displayName: "HeroUINative.AreaChart.StackedArea";
}
declare function AreaChartAreaRange(props: AreaChartAreaRangeProps): import("react/jsx-runtime").JSX.Element;
declare namespace AreaChartAreaRange {
    var displayName: "HeroUINative.AreaChart.AreaRange";
}
/**
 * Compound `AreaChart` wrapping victory-native `CartesianChart` with a themed outer `View`.
 *
 * Provides Uniwind-styled area fills, stacked areas, and range bands — all rendered through Skia,
 * bridged into the chart's Canvas reconciler via {@link AnimationSettingsProvider} so parts
 * rendered inside the render callback still see cascaded `isAllAnimationsDisabled` state.
 *
 * For press-driven overlays (indicator dot, vertical crosshair), use `ChartIndicator` and
 * `ChartCrosshair` from `heroui-native-pro` with `useChartPressState` — they are Skia
 * primitives in the same canvas as `AreaChart` children. Pair with `LineChart.Line` to draw
 * solid outline strokes on top of an area or stacked layer using its matching color.
 *
 * @component AreaChart — Renders `CartesianChart` inside a full-width `View`. Pass chart
 * dimensions on `wrapperClassName` (for example `h-72`). Forward `ref` to access the Skia canvas
 * and press actions through `CartesianChartRef`. Accepts an `animation` prop typed as
 * {@link AreaChartRootAnimation} for cascading `"disable-all"` to animated compound parts.
 *
 * @component AreaChart.Area — Themed Skia area series. Defaults `colorClassName` to `accent-chart-3`
 * and `opacity` to `0.2`. Respects cascaded `isAllAnimationsDisabled`: when disabled at the root,
 * the `animate` prop is dropped so data-change path interpolation is skipped.
 *
 * @component AreaChart.StackedArea — victory-native stacked area layers from an ordered `points`
 * array (bottom-most series first). Pass a parallel `colors` array in the same stack order, and
 * an `areaOptions` callback to customize each layer — typically by attaching a per-layer Skia
 * `LinearGradient` as `children` (the callback receives `{ rowIndex, lowestY, highestY }` to
 * size the gradient against the layer's stacked extent). Respects cascaded
 * `isAllAnimationsDisabled`: `animate` is dropped when the root cascade disables animations.
 *
 * @component AreaChart.AreaRange — Shaded band between an upper and lower series. Supply
 * either `upperPoints` + `lowerPoints` (sourced from the chart's render callback) or a single
 * `points` array typed as `AreaRangePointsArray` (`y` is the upper bound, `y0` the lower).
 * Useful for confidence intervals or min/max ranges around a central line — pair with
 * `LineChart.Line` rendered after the band to draw the central tendency on top. Respects
 * cascaded `isAllAnimationsDisabled`.
 */
declare const AreaChart: typeof AreaChartRoot & {
    /** Theme-styled area series; uses Uniwind `colorClassName` for fill color. */
    Area: typeof AreaChartArea;
    /** Stacked area layers from an ordered `points` array (bottom to top). */
    StackedArea: typeof AreaChartStackedArea;
    /** Range band between an upper and a lower series; supports `upperPoints`/`lowerPoints` or a packed `AreaRangePointsArray`. */
    AreaRange: typeof AreaChartAreaRange;
};
export default AreaChart;
//# sourceMappingURL=area-chart.d.ts.map