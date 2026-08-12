import type { PieChartColorFields, PieChartInputFields, PieChartLabelProps, PieChartNumericalFields, PieChartPieProps, PieChartRootProps, PieChartSliceAngularInsetProps, PieChartSliceProps } from './pie-chart.types';
declare function PieChartRoot<RawData extends Record<string, unknown>, LabelKey extends Extract<keyof PieChartInputFields<RawData>, string>, ValueKey extends Extract<keyof PieChartNumericalFields<RawData>, string>, ColorKey extends Extract<keyof PieChartColorFields<RawData>, string>>(props: PieChartRootProps<RawData, LabelKey, ValueKey, ColorKey>): import("react/jsx-runtime").JSX.Element;
declare namespace PieChartRoot {
    var displayName: "HeroUINative.PieChart.Root";
}
declare function PieChartPie(props: PieChartPieProps): import("react/jsx-runtime").JSX.Element;
declare namespace PieChartPie {
    var displayName: "HeroUINative.PieChart.Pie";
}
declare function PieChartSlice(props: PieChartSliceProps): import("react/jsx-runtime").JSX.Element;
declare namespace PieChartSlice {
    var displayName: "HeroUINative.PieChart.Slice";
}
declare function PieChartSliceAngularInset(props: PieChartSliceAngularInsetProps): import("react/jsx-runtime").JSX.Element;
declare namespace PieChartSliceAngularInset {
    var displayName: "HeroUINative.PieChart.SliceAngularInset";
}
declare function PieChartLabel(props: PieChartLabelProps): import("react/jsx-runtime").JSX.Element;
declare namespace PieChartLabel {
    var displayName: "HeroUINative.PieChart.Label";
}
/**
 * Compound `PieChart` wrapping victory-native `PolarChart` with a themed outer `View`.
 *
 * The root is a themed `PolarChart` container; `Pie.Chart` (with its layout props and per-slice
 * render callback) is exposed as the {@link PieChart.Pie} compound subcomponent so consumers
 * compose the chart the same way they would in victory-native (`<PolarChart><Pie.Chart>...`).
 *
 * Animation cascading mirrors the cartesian charts: an `animation` prop typed as
 * {@link PieChartRootAnimation} is computed at the root via `usePieChartRootAnimation` and
 * carried to `PieChart.Pie` through a private React context. `PieChart.Pie` then re-emits the
 * value via {@link AnimationSettingsProvider} *inside* the `Pie.Chart` render callback so the
 * cascade crosses the Skia Canvas reconciler boundary and reaches `PieChart.Slice` /
 * `PieChart.SliceAngularInset` via `useAnimationSettings()`.
 *
 * @component PieChart — Themed `PolarChart` wrapper inside a full-width `View`. Pass chart
 * dimensions on `wrapperClassName` (for example `h-[260px]`). Accepts an `animation` prop typed
 * as {@link PieChartRootAnimation} for cascading `"disable-all"` to animated compound parts.
 * Expects a single `PieChart.Pie` child.
 *
 * @component PieChart.Pie — Wraps victory-native's `Pie.Chart`. Owns the layout props
 * (`innerRadius`, `circleSweepDegrees`, `startAngle`, `size`) and the per-slice render callback.
 * Bridges the root's animation cascade into the Skia Canvas via `AnimationSettingsProvider`.
 *
 * @component PieChart.Slice — A single pie/donut slice. `Pie.Slice` strips `color` and `path`
 * from `PathProps` (the fill is sourced from `data[colorKey]` and the path is computed from
 * slice geometry); pass other Skia paint props (`opacity`, `blendMode`, etc.) directly.
 * Respects cascaded `isAllAnimationsDisabled`: when disabled at the root, the `animate` prop
 * is dropped.
 *
 * @component PieChart.SliceAngularInset — Stroke drawn between adjacent slices, typically set
 * to the chart background color for a "segmented" donut look. Pass
 * `angularInset={{ angularStrokeWidth, angularStrokeColor }}`. Respects cascaded
 * `isAllAnimationsDisabled`.
 *
 * @component PieChart.Label — Text label rendered inside a slice. Accepts a Skia `font`,
 * `radiusOffset`, `color`, an explicit `text` override, and a render-function `children` for
 * fully custom label content.
 */
declare const PieChart: typeof PieChartRoot & {
    /** Wraps victory-native `Pie.Chart`; owns the layout props and per-slice render callback. */
    Pie: typeof PieChartPie;
    /** Single pie/donut slice; fill is automatically sourced from `data[colorKey]`. */
    Slice: typeof PieChartSlice;
    /** Angular stroke between adjacent slices for a segmented look. */
    SliceAngularInset: typeof PieChartSliceAngularInset;
    /** Text label rendered inside a slice (must be a child of `PieChart.Slice`). */
    Label: typeof PieChartLabel;
};
export default PieChart;
//# sourceMappingURL=pie-chart.d.ts.map