import type { ComponentProps } from 'react';
import type { ApplyUniwind } from 'uniwind';
import type { CartesianChart } from 'victory-native';
import type { AnimationRoot } from '../../helpers/internal/types';
type CartesianAreaComponent = typeof import('victory-native').Area;
type CartesianStackedAreaComponent = typeof import('victory-native').StackedArea;
type CartesianAreaRangeComponent = typeof import('victory-native').AreaRange;
/**
 * Mirror of victory-native's internal `InputFieldType` — the set of value types valid as
 * `xKey` axis values (string categories or numeric positions). Re-declared locally because the
 * upstream alias is not re-exported from the package.
 */
type InputFieldType = number | string;
/**
 * Mirror of victory-native's internal `MaybeNumber` — the value type each `yKeys` field may
 * hold, permitting `null` / `undefined` gaps when the area should break at missing samples
 * (`connectMissingData` off).
 */
type MaybeNumber = number | null | undefined;
/**
 * Keys whose values are valid X-axis field types (`number` or `string`).
 * Mirrors victory-native `InputFields` (not re-exported from the package).
 */
export type AreaChartInputFields<T> = {
    [K in keyof T as T[K] extends InputFieldType ? K : never]: T[K] extends InputFieldType ? T[K] : never;
};
/**
 * Keys whose values are numeric (or nullable) Y-axis fields.
 * Mirrors victory-native `NumericalFields` (not re-exported from the package).
 */
export type AreaChartNumericalFields<T> = {
    [K in keyof T as T[K] extends MaybeNumber ? K : never]: T[K];
};
/**
 * Serializable data row type for chart series — mirrors victory-native's expectation that each
 * point is a record with known keys for `xKey` and each `yKeys` entry.
 */
export type AreaChartDatum = Record<string, unknown>;
/**
 * Props for the `AreaChart` root wrapper.
 *
 * Generic parameters mirror `CartesianChart` so `xKey`, `yKeys`, and `points` stay correctly typed
 * in the render callback. Adds `wrapperClassName` for the outer React Native `View`.
 *
 * **Ref as prop**: `CartesianChart` accepts `ref` as a regular prop (React 19). The root forwards
 * that `ref` to the underlying chart so callers can access the Skia canvas and press actions handle.
 *
 * @example
 * ```tsx
 * <AreaChart
 *   data={DATA}
 *   xKey="day"
 *   yKeys={["revenue"]}
 *   wrapperClassName="h-72 w-full bg-surface"
 * >
 *   {({ points, chartBounds }) => (
 *     <AreaChart.Area points={points.revenue} y0={chartBounds.bottom} />
 *   )}
 * </AreaChart>
 * ```
 */
export type AreaChartRootProps<RawData extends Record<string, unknown>, XK extends keyof AreaChartInputFields<RawData>, YK extends keyof AreaChartNumericalFields<RawData>> = Parameters<typeof CartesianChart<RawData, XK, YK>>[0] & {
    /**
     * Additional Tailwind classes for the outer `View` that wraps `CartesianChart`.
     */
    wrapperClassName?: string;
    /**
     * Animation configuration for the chart root.
     *
     * The root does not currently animate any of its own styles, but accepting an `AnimationRoot`
     * here lets callers cascade `"disable-all"` through `AnimationSettingsProvider` to compound
     * parts that do animate (e.g. `AreaChart.Area` with `animate`). Pass `"disable-all"` to force every
     * animated descendant to skip its animation; pass `false` / `"disabled"` to only disable the
     * root itself; or omit the prop entirely for default behavior.
     */
    animation?: AreaChartRootAnimation;
};
/**
 * Animation configuration for the `AreaChart` root.
 *
 * Currently exposes no custom config — the root is a passthrough whose sole animation-related
 * responsibility is cascading `isAllAnimationsDisabled` (via `"disable-all"`) to compound parts.
 */
export type AreaChartRootAnimation = AnimationRoot;
/**
 * Props for the themed area path rendered inside `CartesianChart`'s children render function.
 *
 * Built from `victory-native` `Area` wrapped with `withUniwind(Area)`. Uniwind adds a `colorClassName`
 * prop mapped to the Skia `color` prop automatically (`ApplyUniwind`).
 *
 * @example
 * ```tsx
 * <AreaChart.Area
 *   points={points.sales}
 *   y0={chartBounds.bottom}
 *   colorClassName="accent-chart-1"
 * />
 * ```
 */
export type AreaChartAreaProps = ApplyUniwind<ComponentProps<CartesianAreaComponent>>;
/**
 * Props for {@link AreaChart.StackedArea} — victory-native stacked area layers.
 *
 * Pass `colors` in stack order (bottom series first) matching `points` array order. Use
 * `areaOptions` to attach per-layer `LinearGradient` children or tune opacity per layer; the
 * callback receives `{ rowIndex, lowestY, highestY }` so the gradient can be sized against the
 * layer's stacked extent.
 *
 * @example
 * ```tsx
 * <AreaChart.StackedArea
 *   points={[points.organic, points.paid, points.referral]}
 *   y0={chartBounds.bottom}
 *   colors={["#22c55e", "#3b82f6", "#eab308"]}
 *   curveType="natural"
 * />
 * ```
 */
export type AreaChartStackedAreaProps = ComponentProps<CartesianStackedAreaComponent>;
/**
 * Props for {@link AreaChart.AreaRange} — shaded band between upper and lower bounds.
 *
 * Supply either `points` (`AreaRangePointsArray` with `y` upper / `y0` lower) or both
 * `upperPoints` and `lowerPoints`. Pair with `LineChart.Line` rendered after the band to draw a
 * central-tendency line on top of the band.
 *
 * @example
 * ```tsx
 * <AreaChart.AreaRange
 *   upperPoints={points.high}
 *   lowerPoints={points.low}
 *   color="rgba(99, 102, 241, 0.18)"
 *   curveType="natural"
 * />
 * ```
 */
export type AreaChartAreaRangeProps = ComponentProps<CartesianAreaRangeComponent>;
export {};
//# sourceMappingURL=area-chart.types.d.ts.map