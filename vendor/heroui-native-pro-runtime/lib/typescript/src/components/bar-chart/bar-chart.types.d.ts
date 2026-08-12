import type { ComponentProps } from 'react';
import type { ApplyUniwind } from 'uniwind';
import type { BarGroup, CartesianChart } from 'victory-native';
import type { AnimationRoot } from '../../helpers/internal/types';
type CartesianBarComponent = typeof import('victory-native').Bar;
type CartesianStackedBarComponent = typeof import('victory-native').StackedBar;
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
export type BarChartInputFields<T> = {
    [K in keyof T as T[K] extends InputFieldType ? K : never]: T[K] extends InputFieldType ? T[K] : never;
};
/**
 * Keys whose values are numeric (or nullable) Y-axis fields.
 * Mirrors victory-native `NumericalFields` (not re-exported from the package).
 */
export type BarChartNumericalFields<T> = {
    [K in keyof T as T[K] extends MaybeNumber ? K : never]: T[K];
};
/**
 * Serializable data row type for chart series — mirrors victory-native's expectation that each
 * point is a record with known keys for `xKey` and each `yKeys` entry.
 */
export type BarChartDatum = Record<string, unknown>;
/**
 * Props for the `BarChart` root wrapper.
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
 * <BarChart
 *   data={DATA}
 *   xKey="month"
 *   yKeys={["sales"]}
 *   wrapperClassName="h-52 w-full bg-surface"
 * >
 *   {({ points, chartBounds }) => (
 *     <BarChart.Bar points={points.sales} chartBounds={chartBounds} />
 *   )}
 * </BarChart>
 * ```
 */
export type BarChartRootProps<RawData extends Record<string, unknown>, XK extends keyof BarChartInputFields<RawData>, YK extends keyof BarChartNumericalFields<RawData>> = Parameters<typeof CartesianChart<RawData, XK, YK>>[0] & {
    /**
     * Additional Tailwind classes for the outer `View` that wraps `CartesianChart`.
     */
    wrapperClassName?: string;
    /**
     * Animation configuration for the chart root.
     *
     * The root does not animate its own layout, but accepting an `AnimationRoot` lets callers cascade
     * `"disable-all"` through `AnimationSettingsProvider` to compound parts that use victory-native's
     * `animate` prop (e.g. `BarChart.Bar`).
     */
    animation?: BarChartRootAnimation;
};
/**
 * Animation configuration for the `BarChart` root — cascades `isAllAnimationsDisabled` to children.
 */
export type BarChartRootAnimation = AnimationRoot;
/**
 * Props for {@link BarChart.Bar} — themed Skia bar series via Uniwind `colorClassName`.
 *
 * @example
 * ```tsx
 * <BarChart.Bar
 *   points={points.revenue}
 *   chartBounds={chartBounds}
 *   colorClassName="accent-chart-1"
 * />
 * ```
 */
export type BarChartBarProps = ApplyUniwind<ComponentProps<CartesianBarComponent>>;
/**
 * Props for {@link BarChart.BarGroup} — clustered bars; pass {@link BarChart.BarGroupItem} children.
 *
 * @example
 * ```tsx
 * <BarChart.BarGroup chartBounds={chartBounds}>
 *   <BarChart.BarGroupItem points={points.online} colorClassName="accent-chart-3" />
 *   <BarChart.BarGroupItem points={points.retail} colorClassName="accent-chart-2" />
 * </BarChart.BarGroup>
 * ```
 */
export type BarChartBarGroupProps = ComponentProps<typeof BarGroup>;
/**
 * Props for {@link BarChart.BarGroupItem} — one series inside a {@link BarChart.BarGroup}.
 *
 * @example
 * ```tsx
 * <BarChart.BarGroupItem points={points.direct} colorClassName="accent-chart-1" />
 * ```
 */
export type BarChartBarGroupItemProps = ApplyUniwind<ComponentProps<typeof BarGroup.Bar>>;
/**
 * Props for {@link BarChart.StackedBar} — stacked columns from multiple `PointsArray` entries.
 *
 * @example
 * ```tsx
 * <BarChart.StackedBar
 *   chartBounds={chartBounds}
 *   points={[points.starter, points.pro, points.enterprise]}
 *   colors={[starterColor, proColor, enterpriseColor]}
 * />
 * ```
 */
export type BarChartStackedBarProps = ComponentProps<CartesianStackedBarComponent>;
export {};
//# sourceMappingURL=bar-chart.types.d.ts.map