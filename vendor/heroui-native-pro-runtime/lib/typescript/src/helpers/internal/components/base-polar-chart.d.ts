import type { Color } from '@shopify/react-native-skia';
import VictoryNativePackage from '../../../optional/victory-native';
/**
 * Resolved victory-native module type (the package is an optional peer dependency, so the runtime
 * value may be `undefined`).
 */
type VictoryNativeModule = NonNullable<typeof VictoryNativePackage>;
/**
 * Explicitly annotated so TypeScript emits the portable indexed-access type
 * (`VictoryNativeModule["PolarChart"]`) into the generated `.d.ts` instead of inlining
 * victory-native's non-portable internal types (which triggers TS2742).
 */
declare const PolarChart: VictoryNativeModule['PolarChart'];
type InputFieldType = number | string;
type MaybeNumber = number | null | undefined;
/**
 * Keys of `T` whose values are valid `labelKey` input types (`number` or `string`).
 *
 * Mirrors victory-native's internal `InputFields` helper (not re-exported from the package) so
 * `BasePolarChart` can be parameterized with the same generic constraints as `PolarChart`.
 */
export type BasePolarChartInputFields<T> = {
    [K in keyof T as T[K] extends InputFieldType ? K : never]: T[K] extends InputFieldType ? T[K] : never;
};
/**
 * Keys of `T` whose values are numeric (or nullable) `valueKey` fields.
 *
 * Mirrors victory-native's internal `NumericalFields` helper.
 */
export type BasePolarChartNumericalFields<T> = {
    [K in keyof T as T[K] extends MaybeNumber ? K : never]: T[K];
};
/**
 * Keys of `T` whose values are Skia `Color` fields — used by victory-native's `colorKey` to look
 * up each slice fill from the data row.
 *
 * Mirrors victory-native's internal `ColorFields` helper.
 */
export type BasePolarChartColorFields<T> = {
    [K in keyof T as T[K] extends Color ? K : never]: T[K];
};
/**
 * Full set of props accepted by `BasePolarChart` — identical to the underlying victory-native
 * `PolarChart` props for the chosen data / label-key / value-key / color-key.
 *
 * We derive the shape from the wrapped component so any additions upstream flow through without
 * needing manual re-declaration.
 */
export type BasePolarChartProps<RawData extends Record<string, unknown>, LabelKey extends Extract<keyof BasePolarChartInputFields<RawData>, string>, ValueKey extends Extract<keyof BasePolarChartNumericalFields<RawData>, string>, ColorKey extends Extract<keyof BasePolarChartColorFields<RawData>, string>> = Parameters<typeof PolarChart<RawData, LabelKey, ValueKey, ColorKey>>[0];
/**
 * Themed wrapper around victory-native `PolarChart`.
 *
 * Currently a generic-preserving passthrough — unlike `BaseCartesianChart`, the polar chart has
 * no axis/font surface to theme. Reserved as the integration seam so future polar-specific
 * theming (transform state, themed backdrops, etc.) lands in one place.
 *
 * **Generics**: kept as a function (not `forwardRef`) so the `RawData` / `LabelKey` / `ValueKey`
 * / `ColorKey` generic parameters survive into the consumer — `PolarChart` itself does not
 * expose a ref.
 *
 * @example
 * ```tsx
 * <BasePolarChart
 *   data={data}
 *   labelKey="label"
 *   valueKey="value"
 *   colorKey="color"
 * >
 *   <Pie.Chart />
 * </BasePolarChart>
 * ```
 */
export declare function BasePolarChart<RawData extends Record<string, unknown>, LabelKey extends Extract<keyof BasePolarChartInputFields<RawData>, string>, ValueKey extends Extract<keyof BasePolarChartNumericalFields<RawData>, string>, ColorKey extends Extract<keyof BasePolarChartColorFields<RawData>, string>>(props: BasePolarChartProps<RawData, LabelKey, ValueKey, ColorKey>): import("react/jsx-runtime").JSX.Element;
export declare namespace BasePolarChart {
    var displayName: string;
}
export {};
//# sourceMappingURL=base-polar-chart.d.ts.map