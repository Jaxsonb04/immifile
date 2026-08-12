import type { Color } from '@shopify/react-native-skia';
import type { ComponentProps, ReactNode } from 'react';
import type { PieSliceData, PolarChart } from 'victory-native';
import type { AnimationRoot } from '../../helpers/internal/types';
type PiePieChartComponent = (typeof import('victory-native').Pie)['Chart'];
type PieSliceComponent = (typeof import('victory-native').Pie)['Slice'];
type PieSliceAngularInsetComponent = (typeof import('victory-native').Pie)['SliceAngularInset'];
type PieLabelComponent = (typeof import('victory-native').Pie)['Label'];
/**
 * Mirror of victory-native's internal `InputFieldType` — valid `labelKey` axis values (string or number).
 * Re-declared locally because the upstream alias is not re-exported from the package.
 */
type InputFieldType = number | string;
/**
 * Mirror of victory-native's internal `MaybeNumber` — `valueKey` fields may hold nullable numbers.
 */
type MaybeNumber = number | null | undefined;
/**
 * Keys whose values are valid `labelKey` field types (`number` or `string`).
 * Mirrors victory-native `InputFields` (not re-exported from the package).
 */
export type PieChartInputFields<T> = {
    [K in keyof T as T[K] extends InputFieldType ? K : never]: T[K] extends InputFieldType ? T[K] : never;
};
/**
 * Keys whose values are numeric (or nullable) `valueKey` fields.
 * Mirrors victory-native `NumericalFields` (not re-exported from the package).
 */
export type PieChartNumericalFields<T> = {
    [K in keyof T as T[K] extends MaybeNumber ? K : never]: T[K];
};
/**
 * Keys whose values are Skia `Color` fields — used by victory-native's `colorKey` to look up
 * each slice fill from the data row.
 * Mirrors victory-native `ColorFields` (not re-exported from the package).
 */
export type PieChartColorFields<T> = {
    [K in keyof T as T[K] extends Color ? K : never]: T[K];
};
/**
 * Serializable data row type for pie series — mirrors victory-native's expectation that each
 * datum is a record with known keys for `labelKey`, `valueKey`, and `colorKey`.
 */
export type PieChartDatum = Record<string, unknown>;
/**
 * Children render-callback signature for {@link PieChart.Pie} (not the root). Invoked once per
 * slice with the transformed `PieSliceData`, mirroring victory-native's `Pie.Chart` `children`
 * argument. The root itself (`PieChart`) accepts a plain `ReactNode` — typically a single
 * `PieChart.Pie` element.
 */
export type PieChartRenderFn = (args: {
    slice: PieSliceData;
}) => ReactNode;
/**
 * Props for the `PieChart` root wrapper.
 *
 * Generic parameters mirror `PolarChart` so `labelKey`, `valueKey`, and `colorKey` stay
 * correctly typed against the supplied `data` rows. The root is a themed wrapper around
 * victory-native's `PolarChart` (canvas container); the per-slice render callback and
 * `Pie.Chart` layout props (`innerRadius`, `circleSweepDegrees`, `startAngle`, `size`) live on
 * the {@link PieChart.Pie} compound subcomponent.
 *
 * Adds `wrapperClassName` for the outer React Native `View` and `animation` for cascading
 * `"disable-all"` to animated compound parts (`PieChart.Slice` / `PieChart.SliceAngularInset`).
 * The cascade is bridged from the root into the Skia Canvas via a private React context plus
 * `AnimationSettingsProvider`, so the prop stays on the root even though the animated parts
 * are rendered inside the `PieChart.Pie` render callback.
 *
 * @example
 * ```tsx
 * <PieChart
 *   data={DATA}
 *   labelKey="label"
 *   valueKey="value"
 *   colorKey="color"
 *   wrapperClassName="h-[260px] w-full"
 * >
 *   <PieChart.Pie innerRadius="60%">
 *     {({ slice }) => <PieChart.Slice />}
 *   </PieChart.Pie>
 * </PieChart>
 * ```
 */
export type PieChartRootProps<RawData extends Record<string, unknown>, LabelKey extends Extract<keyof PieChartInputFields<RawData>, string>, ValueKey extends Extract<keyof PieChartNumericalFields<RawData>, string>, ColorKey extends Extract<keyof PieChartColorFields<RawData>, string>> = Omit<Parameters<typeof PolarChart<RawData, LabelKey, ValueKey, ColorKey>>[0], 'children'> & {
    /**
     * Compound subcomponents rendered inside the chart canvas. Expected to be a single
     * `PieChart.Pie` element (victory-native's `PolarChart` only supports `Pie.Chart` as a
     * child today).
     */
    children: ReactNode;
    /**
     * Additional Tailwind classes for the outer `View` that wraps `PolarChart`.
     */
    wrapperClassName?: string;
    /**
     * Animation configuration for the chart root.
     *
     * The root does not animate its own layout, but accepting an `AnimationRoot` lets callers
     * cascade `"disable-all"` through a private bridge context plus `AnimationSettingsProvider`
     * to compound parts that use victory-native's `animate` prop (e.g. `PieChart.Slice`,
     * `PieChart.SliceAngularInset`).
     */
    animation?: PieChartRootAnimation;
};
/**
 * Props for {@link PieChart.Pie} — the `Pie.Chart` layout subcomponent.
 *
 * Owns all victory-native `Pie.Chart` props (`innerRadius`, `circleSweepDegrees`, `startAngle`,
 * `size`) plus the per-slice render callback. Rendered as a child of `PieChart` so the
 * compound shape mirrors victory-native's natural `PolarChart > Pie.Chart` composition.
 *
 * `animation` lives on the root (`PieChart`) and is bridged into this subcomponent via a
 * private context, so there is no `animation` prop here.
 *
 * @example
 * ```tsx
 * <PieChart.Pie innerRadius="60%" startAngle={-90}>
 *   {({ slice }) => <PieChart.Slice />}
 * </PieChart.Pie>
 * ```
 */
export type PieChartPieProps = Omit<ComponentProps<PiePieChartComponent>, 'children'> & {
    /**
     * Render function invoked for every slice of the pie. Receives the transformed
     * `PieSliceData` for the slice. Compose `PieChart.Slice`, `PieChart.SliceAngularInset`,
     * and `PieChart.Label` inside the returned tree.
     */
    children: PieChartRenderFn;
};
/**
 * Animation configuration for the `PieChart` root.
 *
 * Currently exposes no custom config — the root is a passthrough whose sole animation-related
 * responsibility is cascading `isAllAnimationsDisabled` (via `"disable-all"`) to compound parts.
 */
export type PieChartRootAnimation = AnimationRoot;
/**
 * Props for {@link PieChart.Slice} — a single pie/donut slice.
 *
 * `Pie.Slice` strips both `color` and `path` from `PathProps`: the slice fill is sourced from
 * `data[colorKey]` automatically and the slice path is computed internally from the slice
 * geometry. Accepts any other Skia `Path` paint prop plus an `animate` config and an optional
 * `Pie.Label` child.
 *
 * @example
 * ```tsx
 * <PieChart.Slice animate={{ type: 'timing', duration: 500 }} />
 * ```
 */
export type PieChartSliceProps = ComponentProps<PieSliceComponent>;
/**
 * Props for {@link PieChart.SliceAngularInset} — stroke drawn between adjacent slices.
 *
 * Use to visually separate slices (typically the chart background color) for a "segmented"
 * donut look. Accepts an `angularInset` `{ angularStrokeWidth, angularStrokeColor }` plus an
 * `animate` config.
 *
 * @example
 * ```tsx
 * <PieChart.SliceAngularInset
 *   angularInset={{ angularStrokeWidth: 4, angularStrokeColor: 'white' }}
 * />
 * ```
 */
export type PieChartSliceAngularInsetProps = ComponentProps<PieSliceAngularInsetComponent>;
/**
 * Props for {@link PieChart.Label} — text label rendered inside a slice.
 *
 * Accepts a Skia `font`, a `radiusOffset` to nudge the label toward/away from the chart center,
 * a `color`, an explicit `text` override (defaults to `slice.label`), and a render-function
 * `children` for fully custom label content.
 *
 * @example
 * ```tsx
 * <PieChart.Slice>
 *   <PieChart.Label font={font} color="white" />
 * </PieChart.Slice>
 * ```
 */
export type PieChartLabelProps = ComponentProps<PieLabelComponent>;
export {};
//# sourceMappingURL=pie-chart.types.d.ts.map