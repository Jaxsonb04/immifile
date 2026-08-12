import type { LineChartAnimatedLineProps, LineChartInputFields, LineChartLineProps, LineChartNumericalFields, LineChartRootProps } from './line-chart.types';
declare function LineChartRoot<RawData extends Record<string, unknown>, XK extends keyof LineChartInputFields<RawData>, YK extends keyof LineChartNumericalFields<RawData>>(props: LineChartRootProps<RawData, XK, YK>): import("react/jsx-runtime").JSX.Element;
declare namespace LineChartRoot {
    var displayName: "HeroUINative.LineChart.Root";
}
declare function LineChartLine(props: LineChartLineProps): import("react/jsx-runtime").JSX.Element;
declare namespace LineChartLine {
    var displayName: "HeroUINative.LineChart.Line";
}
declare function LineChartAnimatedLine(props: LineChartAnimatedLineProps): import("react/jsx-runtime").JSX.Element;
declare namespace LineChartAnimatedLine {
    var displayName: "HeroUINative.LineChart.AnimatedLine";
}
/**
 * Compound `LineChart` wrapping victory-native `CartesianChart` with a themed outer `View`.
 *
 * Provides Uniwind-styled line series and replayable draw-on animations — all rendered through
 * Skia, bridged into the chart's Canvas reconciler via {@link AnimationSettingsProvider} so
 * parts rendered inside the render callback still see cascaded `isAllAnimationsDisabled` state.
 *
 * For press-driven overlays (indicator dot, vertical crosshair), use `ChartIndicator` and
 * `ChartCrosshair` from `heroui-native-pro` with `useChartPressState` — they are Skia
 * primitives in the same canvas as `LineChart` children.
 *
 * @component LineChart — Renders `CartesianChart` inside a full-width `View`. Pass chart
 * dimensions on `wrapperClassName` (for example `h-72`). Forward `ref` to access the Skia canvas
 * and press actions through `CartesianChartRef`. Accepts an `animation` prop typed as
 * {@link LineChartRootAnimation} for cascading `"disable-all"` to animated compound parts.
 *
 * @component LineChart.Line — Themed Skia line series. Defaults to `strokeWidth` 2 and
 * `colorClassName` `accent-chart-3`; override `colorClassName` with any other `accent-*`
 * utility (e.g. `accent-chart-1`, `accent-danger`). Respects cascaded `isAllAnimationsDisabled`:
 * when disabled at the root, the `animate` prop is dropped so data-change path interpolation
 * is skipped.
 *
 * @component LineChart.AnimatedLine — Replayable draw-on line. Accepts a `resetKey` prop whose
 * identity change (plus the initial mount) sweeps the Skia `Path.end` trim from
 * `animation.progress[0]` to `animation.progress[1]` (default `[0, 1]`) using the provided
 * `animation` config. Useful when a chart is revealed after a filter/tab change or when the
 * consumer wants an on-demand "replay animation" affordance.
 */
declare const LineChart: typeof LineChartRoot & {
    /** Theme-styled line series; uses Uniwind `colorClassName` for stroke color. */
    Line: typeof LineChartLine;
    /** Replayable draw-on line with a `resetKey` trigger to re-play the entrance animation. */
    AnimatedLine: typeof LineChartAnimatedLine;
};
export default LineChart;
//# sourceMappingURL=line-chart.d.ts.map