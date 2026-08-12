import type { ComponentType } from 'react';
import type { CartesianChart } from 'victory-native';
import type { AnimationRoot } from '../../helpers/internal/types';
import type { AreaChartAreaProps, AreaChartAreaRangeProps, AreaChartStackedAreaProps } from '../area-chart/area-chart.types';
import type { BarChartBarGroupItemProps, BarChartBarGroupProps, BarChartBarProps, BarChartStackedBarProps } from '../bar-chart/bar-chart.types';
import type { LineChartAnimatedLineProps, LineChartLineProps } from '../line-chart/line-chart.types';
/**
 * Mirror of victory-native's internal `InputFieldType` — valid `xKey` axis values (string or number).
 * Re-declared locally because the upstream alias is not re-exported from the package.
 */
type InputFieldType = number | string;
/**
 * Mirror of victory-native's internal `MaybeNumber` — each `yKeys` field may hold gaps.
 */
type MaybeNumber = number | null | undefined;
/**
 * Keys whose values are valid X-axis field types (`number` or `string`).
 * Mirrors victory-native `InputFields` (not re-exported from the package).
 */
export type ComposedChartInputFields<T> = {
    [K in keyof T as T[K] extends InputFieldType ? K : never]: T[K] extends InputFieldType ? T[K] : never;
};
/**
 * Keys whose values are numeric (or nullable) Y-axis fields.
 * Mirrors victory-native `NumericalFields` (not re-exported from the package).
 */
export type ComposedChartNumericalFields<T> = {
    [K in keyof T as T[K] extends MaybeNumber ? K : never]: T[K];
};
/**
 * Serializable data row type for chart series — mirrors victory-native's expectation that each
 * point is a record with known keys for `xKey` and each `yKeys` entry.
 */
export type ComposedChartDatum = Record<string, unknown>;
/**
 * Props for the `ComposedChart` root wrapper.
 *
 * Generic parameters mirror `CartesianChart` so `xKey`, `yKeys`, and `points` stay correctly typed
 * in the render callback. Adds `wrapperClassName` for the outer React Native `View` and
 * `animation` for cascading `"disable-all"` to animated compound parts.
 *
 * **Ref as prop**: `CartesianChart` accepts `ref` as a regular prop (React 19). The root forwards
 * that `ref` through `BaseCartesianChart` to the underlying chart.
 *
 * @example
 * ```tsx
 * <ComposedChart
 *   data={DATA}
 *   xKey="month"
 *   yKeys={["revenue", "orders"]}
 *   yAxis={[
 *     { yKeys: ["revenue"], formatYLabel: (v) => `$${(v / 1000).toFixed(0)}k` },
 *     { yKeys: ["orders"], axisSide: "right" },
 *   ]}
 *   wrapperClassName="h-52 w-full bg-surface"
 * >
 *   {({ points, chartBounds }) => (
 *     <>
 *       <ComposedChart.Bar points={points.revenue} chartBounds={chartBounds} />
 *       <ComposedChart.Line points={points.orders} colorClassName="accent-chart-1" />
 *     </>
 *   )}
 * </ComposedChart>
 * ```
 */
export type ComposedChartRootProps<RawData extends Record<string, unknown>, XK extends keyof ComposedChartInputFields<RawData>, YK extends keyof ComposedChartNumericalFields<RawData>> = Parameters<typeof CartesianChart<RawData, XK, YK>>[0] & {
    /**
     * Additional Tailwind classes for the outer `View` that wraps `CartesianChart`.
     */
    wrapperClassName?: string;
    /**
     * Animation configuration for the chart root.
     *
     * The root does not animate its own layout, but accepting an `AnimationRoot` lets callers cascade
     * `"disable-all"` through `AnimationSettingsProvider` to compound parts that use victory-native's
     * `animate` prop (e.g. `ComposedChart.Bar`, `ComposedChart.Line`, `ComposedChart.Area`).
     */
    animation?: ComposedChartRootAnimation;
};
/**
 * Animation configuration for the `ComposedChart` root — cascades `isAllAnimationsDisabled` to children.
 */
export type ComposedChartRootAnimation = AnimationRoot;
/** Themed Skia bar series — reuses {@link BarChart.Bar} implementation. */
export type ComposedChartBarProps = BarChartBarProps;
/** Clustered bars — reuses {@link BarChart.BarGroup} implementation. */
export type ComposedChartBarGroupProps = BarChartBarGroupProps;
/** One series inside {@link ComposedChart.BarGroup}. */
export type ComposedChartBarGroupItemProps = BarChartBarGroupItemProps;
/** Stacked columns — reuses {@link BarChart.StackedBar} implementation. */
export type ComposedChartStackedBarProps = BarChartStackedBarProps;
/** Themed Skia line series — reuses {@link LineChart.Line} implementation. */
export type ComposedChartLineProps = LineChartLineProps;
/** Replayable draw-on line — reuses {@link LineChart.AnimatedLine} implementation. */
export type ComposedChartAnimatedLineProps = LineChartAnimatedLineProps;
/** Themed Skia area series — reuses {@link AreaChart.Area} implementation. */
export type ComposedChartAreaProps = AreaChartAreaProps;
/** Stacked area layers — reuses {@link AreaChart.StackedArea} implementation. */
export type ComposedChartStackedAreaProps = AreaChartStackedAreaProps;
/** Range band between upper and lower bounds — reuses {@link AreaChart.AreaRange} implementation. */
export type ComposedChartAreaRangeProps = AreaChartAreaRangeProps;
/**
 * Compound parts attached to {@link ComposedChart} root.
 *
 * Typed with {@link ComponentType} and exported prop aliases so declaration emit does not
 * reference non-exported symbols from `BarChart`, `LineChart`, or `AreaChart` (TS4023).
 */
export type ComposedChartStaticParts = {
    Bar: ComponentType<ComposedChartBarProps>;
    BarGroup: ComponentType<ComposedChartBarGroupProps>;
    BarGroupItem: ComponentType<ComposedChartBarGroupItemProps>;
    StackedBar: ComponentType<ComposedChartStackedBarProps>;
    Line: ComponentType<ComposedChartLineProps>;
    AnimatedLine: ComponentType<ComposedChartAnimatedLineProps>;
    Area: ComponentType<ComposedChartAreaProps>;
    StackedArea: ComponentType<ComposedChartStackedAreaProps>;
    AreaRange: ComponentType<ComposedChartAreaRangeProps>;
};
export {};
//# sourceMappingURL=composed-chart.types.d.ts.map