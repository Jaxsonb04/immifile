"use strict";

import VictoryNativePackage from "../../../optional/victory-native.js";

// --------------------------------------------------

/**
 * Resolved victory-native module type (the package is an optional peer dependency, so the runtime
 * value may be `undefined`).
 */
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Explicitly annotated so TypeScript emits the portable indexed-access type
 * (`VictoryNativeModule["PolarChart"]`) into the generated `.d.ts` instead of inlining
 * victory-native's non-portable internal types (which triggers TS2742).
 */
const PolarChart = (VictoryNativePackage ?? {}).PolarChart;

// --------------------------------------------------
// Types
// --------------------------------------------------

/**
 * Keys of `T` whose values are valid `labelKey` input types (`number` or `string`).
 *
 * Mirrors victory-native's internal `InputFields` helper (not re-exported from the package) so
 * `BasePolarChart` can be parameterized with the same generic constraints as `PolarChart`.
 */

/**
 * Keys of `T` whose values are numeric (or nullable) `valueKey` fields.
 *
 * Mirrors victory-native's internal `NumericalFields` helper.
 */

/**
 * Keys of `T` whose values are Skia `Color` fields — used by victory-native's `colorKey` to look
 * up each slice fill from the data row.
 *
 * Mirrors victory-native's internal `ColorFields` helper.
 */

/**
 * Full set of props accepted by `BasePolarChart` — identical to the underlying victory-native
 * `PolarChart` props for the chosen data / label-key / value-key / color-key.
 *
 * We derive the shape from the wrapped component so any additions upstream flow through without
 * needing manual re-declaration.
 */

// --------------------------------------------------
// Component
// --------------------------------------------------

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
export function BasePolarChart(props) {
  return /*#__PURE__*/_jsx(PolarChart, {
    ...props
  });
}
BasePolarChart.displayName = 'HeroUINative.BasePolarChart';