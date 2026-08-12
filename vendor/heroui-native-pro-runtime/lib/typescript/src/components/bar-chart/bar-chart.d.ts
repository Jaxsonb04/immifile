import type { BarChartBarGroupItemProps, BarChartBarGroupProps, BarChartBarProps, BarChartInputFields, BarChartNumericalFields, BarChartRootProps, BarChartStackedBarProps } from './bar-chart.types';
declare function BarChartRoot<RawData extends Record<string, unknown>, XK extends keyof BarChartInputFields<RawData>, YK extends keyof BarChartNumericalFields<RawData>>(props: BarChartRootProps<RawData, XK, YK>): import("react/jsx-runtime").JSX.Element;
declare namespace BarChartRoot {
    var displayName: "HeroUINative.BarChart.Root";
}
declare function BarChartBar(props: BarChartBarProps): import("react/jsx-runtime").JSX.Element;
declare namespace BarChartBar {
    var displayName: "HeroUINative.BarChart.Bar";
}
/**
 * victory-native `BarGroup` only collects children where `child.type === BarGroup.Bar`. Wrapping
 * `BarGroup.Bar` with Uniwind replaces that reference, so the upstream group renders nothing. This
 * implementation mirrors `BarGroup` layout via {@link useBarGroupPaths} and renders themed items.
 *
 * Because the {@link BarChartBarGroupItem} component is never invoked as an element here, this
 * function reproduces its default `colorClassName` and `animate` cascade so that grouped items
 * honour the same theming and root `animation="disable-all"` contract as {@link BarChartBar}.
 */
declare function BarChartBarGroup({ children, chartBounds, betweenGroupPadding, withinGroupPadding, roundedCorners, onBarSizeChange, barWidth: customBarWidth, barCount, }: BarChartBarGroupProps): (import("react/jsx-runtime").JSX.Element | null)[] | null;
declare namespace BarChartBarGroup {
    var displayName: "HeroUINative.BarChart.BarGroup";
}
declare function BarChartBarGroupItem(props: BarChartBarGroupItemProps): import("react/jsx-runtime").JSX.Element;
declare namespace BarChartBarGroupItem {
    var displayName: "HeroUINative.BarChart.BarGroupItem";
}
declare function BarChartStackedBar(props: BarChartStackedBarProps): import("react/jsx-runtime").JSX.Element;
declare namespace BarChartStackedBar {
    var displayName: "HeroUINative.BarChart.StackedBar";
}
/**
 * Compound `BarChart` wrapping victory-native `CartesianChart` with a themed outer `View`.
 *
 * Provides Uniwind-styled fills for single and grouped bars, themed default `domainPadding`, and
 * cascaded `"disable-all"` via {@link AnimationSettingsProvider} for any child that uses
 * victory-native's `animate` prop.
 *
 * @component BarChart — Renders `CartesianChart` inside a full-width `View`. Pass chart height on
 * `wrapperClassName` (for example `h-52`). Forward `ref` to access the chart handle. Accepts an
 * `animation` prop typed as {@link BarChartRootAnimation} for cascading `"disable-all"` to animated
 * compound parts.
 *
 * @component BarChart.Bar — Themed Skia bar series. Defaults `colorClassName` to `accent-chart-3`
 * and `roundedCorners` to small top radii (`topLeft`/`topRight` of `4`). Respects cascaded
 * `isAllAnimationsDisabled`: when disabled at the root, the `animate` prop is dropped.
 *
 * @component BarChart.BarGroup — Clustered bars for multiple series per category. Defaults
 * `betweenGroupPadding` and `withinGroupPadding` to `0.25`.
 *
 * @component BarChart.BarGroupItem — One series inside `BarChart.BarGroup`; Uniwind-styled like
 * `BarChart.Bar` with the same `colorClassName` default and `animate` cascade.
 *
 * @component BarChart.StackedBar — Stacked columns from an ordered `points` array. Gates `animate`
 * through the same cascade as the other parts. For correct stacking, callers typically set
 * `domain={{ y: [0, maxStackSum] }}` on the root when auto-domain is insufficient.
 */
declare const BarChart: typeof BarChartRoot & {
    /** Theme-styled single-series bars; uses Uniwind `colorClassName` for fill color. */
    Bar: typeof BarChartBar;
    /** Grouped (clustered) bars — compose with {@link BarChart.BarGroupItem}. */
    BarGroup: typeof BarChartBarGroup;
    /** One bar series inside {@link BarChart.BarGroup}. */
    BarGroupItem: typeof BarChartBarGroupItem;
    /** Stacked bars across multiple `PointsArray` entries (order matches stack bottom to top). */
    StackedBar: typeof BarChartStackedBar;
};
export default BarChart;
//# sourceMappingURL=bar-chart.d.ts.map