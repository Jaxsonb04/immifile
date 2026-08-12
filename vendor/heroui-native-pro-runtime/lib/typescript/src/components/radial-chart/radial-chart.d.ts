import type { RadialChartBarProps, RadialChartColorFields, RadialChartInputFields, RadialChartNumericalFields, RadialChartRootProps } from './radial-chart.types';
declare function RadialChartRoot<RawData extends Record<string, unknown>, LabelKey extends Extract<keyof RadialChartInputFields<RawData>, string>, ValueKey extends Extract<keyof RadialChartNumericalFields<RawData>, string>, ColorKey extends Extract<keyof RadialChartColorFields<RawData>, string>>(props: RadialChartRootProps<RawData, LabelKey, ValueKey, ColorKey>): import("react/jsx-runtime").JSX.Element;
declare namespace RadialChartRoot {
    var displayName: "HeroUINative.RadialChart.Root";
}
declare function RadialChartBar(props: RadialChartBarProps): import("react/jsx-runtime").JSX.Element | null;
declare namespace RadialChartBar {
    var displayName: "HeroUINative.RadialChart.Bar";
}
/**
 * Compound `RadialChart` — themed `BasePolarChart` wrapper with Skia-rendered concentric
 * rounded arc rings.
 *
 * @component RadialChart — Themed `PolarChart` wrapper. Constrain chart sizing on
 *   `wrapperClassName` (e.g. `w-[200px]`). Accepts an `animation` prop that cascades
 *   `"disable-all"` to {@link RadialChart.Bar}.
 * @component RadialChart.Bar — Renders all concentric rings with optional background tracks and
 *   sweep-fill animation. Row `0` is the innermost ring.
 */
declare const RadialChart: typeof RadialChartRoot & {
    /** Concentric rounded arc rings for every data row. */
    Bar: typeof RadialChartBar;
};
export default RadialChart;
//# sourceMappingURL=radial-chart.d.ts.map