import type { RadarChartAngleAxisProps, RadarChartColorFields, RadarChartGridProps, RadarChartInputFields, RadarChartNumericalFields, RadarChartRadarProps, RadarChartRadiusAxisProps, RadarChartRootProps } from './radar-chart.types';
declare function RadarChartRoot<RawData extends Record<string, unknown>, LabelKey extends Extract<keyof RadarChartInputFields<RawData>, string> & Extract<keyof RadarChartColorFields<RawData>, string>, DataKey extends Extract<keyof RadarChartNumericalFields<RawData>, string>>(props: RadarChartRootProps<RawData, LabelKey, DataKey>): import("react/jsx-runtime").JSX.Element;
declare namespace RadarChartRoot {
    var displayName: "HeroUINative.RadarChart.Root";
}
declare function RadarChartGrid(props: RadarChartGridProps): import("react/jsx-runtime").JSX.Element | null;
declare namespace RadarChartGrid {
    var displayName: "HeroUINative.RadarChart.Grid";
}
declare function RadarChartAngleAxis(props: RadarChartAngleAxisProps): import("react/jsx-runtime").JSX.Element | null;
declare namespace RadarChartAngleAxis {
    var displayName: "HeroUINative.RadarChart.AngleAxis";
}
declare function RadarChartRadiusAxis(props: RadarChartRadiusAxisProps): import("react/jsx-runtime").JSX.Element | null;
declare namespace RadarChartRadiusAxis {
    var displayName: "HeroUINative.RadarChart.RadiusAxis";
}
declare function RadarChartRadar(props: RadarChartRadarProps): import("react/jsx-runtime").JSX.Element | null;
declare namespace RadarChartRadar {
    var displayName: "HeroUINative.RadarChart.Radar";
}
/**
 * Compound `RadarChart` — themed `BasePolarChart` wrapper with a Skia-rendered radar geometry.
 *
 * @component RadarChart — Themed `PolarChart` wrapper. Pass chart dimensions on
 *   `wrapperClassName` (e.g. `h-[260px]`). Accepts an `animation` prop typed as
 *   {@link RadarChartRootAnimation} that cascades `"disable-all"` to animated compound parts.
 * @component RadarChart.Grid — Concentric rings (polygons by default) plus radial spokes.
 *   Renders nothing until the canvas has been measured.
 * @component RadarChart.AngleAxis — Skia text labels around the perimeter (one per row, from
 *   `labelKey`).
 * @component RadarChart.RadiusAxis — Numeric tick labels along the spoke at `angle` (defaults
 *   to 12 o'clock). Tick count defaults to `RadarChart.Grid`'s `numTicks`. Skip to render
 *   without explicit value annotations.
 * @component RadarChart.Radar — Filled + stroked polygon for one series. Pass `dataKey` to
 *   plot a numeric field other than the root's default; render multiple siblings for
 *   multi-series. Respects cascaded `isAllAnimationsDisabled` (drops `animate` when on).
 */
declare const RadarChart: typeof RadarChartRoot & {
    /** @optional Concentric rings + radial spokes drawn behind the radar polygon. */
    Grid: typeof RadarChartGrid;
    /** @optional Category labels rendered around the chart perimeter. */
    AngleAxis: typeof RadarChartAngleAxis;
    /** @optional Numeric tick labels rendered along the 12 o'clock spoke. */
    RadiusAxis: typeof RadarChartRadiusAxis;
    /** One filled + stroked polygon series. */
    Radar: typeof RadarChartRadar;
};
export default RadarChart;
//# sourceMappingURL=radar-chart.d.ts.map