import type { ComposedChartInputFields, ComposedChartNumericalFields, ComposedChartRootProps, ComposedChartStaticParts } from './composed-chart.types';
declare function ComposedChartRoot<RawData extends Record<string, unknown>, XK extends keyof ComposedChartInputFields<RawData>, YK extends keyof ComposedChartNumericalFields<RawData>>(props: ComposedChartRootProps<RawData, XK, YK>): import("react/jsx-runtime").JSX.Element;
declare namespace ComposedChartRoot {
    var displayName: "HeroUINative.ComposedChart.Root";
}
/**
 * Compound `ComposedChart` wrapping victory-native `CartesianChart` with a themed outer `View`.
 *
 * Bundles bar, line, and area series parts from the existing chart components under one root so
 * multi-metric dashboards can mix column, stroke, and fill layers in a single cartesian plot.
 * Series parts reuse the themed Skia implementations from `BarChart`, `LineChart`, and `AreaChart`
 * and honour the same `AnimationSettingsProvider` cascade for `"disable-all"`.
 *
 * Configure axes and grid through victory-native root props (`xAxis`, `yAxis`, `domain`, `frame`).
 * For dual-scale charts, pass a `yAxis` array with per-axis `yKeys` and `domain` entries.
 *
 * For press-driven overlays (indicator dot, vertical crosshair), use `ChartIndicator` and
 * `ChartCrosshair` from `heroui-native-pro` with `useChartPressState` — they are Skia
 * primitives in the same canvas as `ComposedChart` children.
 *
 * @component ComposedChart — Renders `CartesianChart` inside a full-width `View`. Pass chart height
 * on `wrapperClassName` (for example `h-52`). Forward `ref` to access the chart handle. Accepts an
 * `animation` prop typed as {@link ComposedChartRootAnimation} for cascading `"disable-all"` to
 * animated compound parts.
 *
 * @component ComposedChart.Bar — Themed Skia bar series (from {@link BarChart.Bar}).
 *
 * @component ComposedChart.BarGroup — Clustered bars (from {@link BarChart.BarGroup}).
 *
 * @component ComposedChart.BarGroupItem — One series inside {@link ComposedChart.BarGroup}.
 *
 * @component ComposedChart.StackedBar — Stacked columns (from {@link BarChart.StackedBar}).
 *
 * @component ComposedChart.Line — Themed Skia line series (from {@link LineChart.Line}).
 *
 * @component ComposedChart.AnimatedLine — Replayable draw-on line (from {@link LineChart.AnimatedLine}).
 *
 * @component ComposedChart.Area — Themed Skia area series (from {@link AreaChart.Area}).
 *
 * @component ComposedChart.StackedArea — Stacked area layers (from {@link AreaChart.StackedArea}).
 *
 * @component ComposedChart.AreaRange — Shaded band between bounds (from {@link AreaChart.AreaRange}).
 */
declare const ComposedChart: typeof ComposedChartRoot & ComposedChartStaticParts;
export default ComposedChart;
//# sourceMappingURL=composed-chart.d.ts.map