import type { Skia, SkPath, SkPoint } from '@shopify/react-native-skia';
/**
 * Converts a polar coordinate into a Cartesian point in Skia canvas space. Angle is in radians
 * and measured **clockwise from 12 o'clock** (`0` points up, `π/2` points right) to match
 * Recharts' default radar layout.
 *
 * @param center Chart center in canvas-space.
 * @param radius Distance from the center to the resulting point.
 * @param angle Angle in radians, clockwise from 12 o'clock.
 * @returns `{ x, y }` in Skia canvas-space.
 */
export declare function polarToCartesian(center: SkPoint, radius: number, angle: number): SkPoint;
/**
 * Computes the spoke angle (in radians) for each category. First spoke sits at 12 o'clock;
 * subsequent spokes rotate clockwise by `2π / numCategories`. Returns `[]` when
 * `numCategories <= 0` so callers can `.map` without an extra guard.
 *
 * @param numCategories Number of categorical axes (typically `data.length`).
 * @returns `numCategories` angles in radians.
 */
export declare function getCategoryAngles(numCategories: number): number[];
/**
 * Builds a closed polygon `SkPath` from an ordered list of vertices. Returns `null` when no
 * Skia runtime is available (optional peer dependency missing) or when fewer than three points
 * are supplied — both cases render as no-ops upstream.
 *
 * @param skia Skia factory namespace (`ReactNativeSkiaPackage.Skia`).
 * @param points Ordered polygon vertices in canvas space.
 * @returns Closed `SkPath`, or `null` when geometry cannot be built.
 */
export declare function buildPolygonPath(skia: typeof Skia | undefined, points: SkPoint[]): SkPath | null;
/**
 * Builds a circular `SkPath`. Used by `RadarChart.Grid` when `shape="circle"`. Returns `null`
 * when Skia is unavailable so callers render nothing instead of crashing.
 *
 * @param skia Skia factory namespace (`ReactNativeSkiaPackage.Skia`).
 * @param center Ring center in canvas space.
 * @param radius Ring radius in pixels.
 * @returns Circular `SkPath`, or `null` when Skia is unavailable.
 */
export declare function buildCirclePath(skia: typeof Skia | undefined, center: SkPoint, radius: number): SkPath | null;
/**
 * Coerces a possibly-missing data-row value into a finite number. Treats `null`, `undefined`,
 * `NaN`, and non-numeric strings as `0` so missing measurements draw at the chart center
 * rather than corrupting the polygon shape.
 *
 * @param value Raw value sourced from `row[dataKey]`.
 * @returns Finite number used for scale computation.
 */
export declare function coerceNumericValue(value: unknown): number;
/**
 * Maximum value across `data` for the given `dataKey`. Returns `0` for an empty dataset so
 * callers can fall back safely (the chart then renders an empty radar at the center).
 *
 * @param data Source rows.
 * @param dataKey Numeric key inspected on each row.
 * @returns Maximum coerced numeric value across all rows.
 */
export declare function getMaxValueForKey(data: ReadonlyArray<Record<string, unknown>>, dataKey: string): number;
/**
 * Evenly-spaced tick values in `(0, maxValue]`. Matches the ring count drawn by
 * `RadarChart.Grid` so each tick label aligns with one concrete concentric ring.
 *
 * @param maxValue Upper bound of the radial scale.
 * @param numTicks Number of ticks to produce (typically the grid's `numTicks`).
 * @returns Ascending tick values from the first ring outward.
 */
export declare function buildAxisTicks(maxValue: number, numTicks: number): number[];
/**
 * Per-axis alignment offsets for an angle-axis tick label.
 *
 * Skia's `<Text>` anchors at the **left edge of the baseline**, not the geometric center, so
 * each label needs `(x, y)` shifts relative to its spoke endpoint to stay clear of the grid.
 * Both functions are pure offsets — callers add the result to the endpoint coordinate.
 */
export type AngleLabelAlignment = {
    /** Horizontal offset from `position.x` to the text's `x` (left edge). */
    offsetX: (textWidth: number) => number;
    /**
     * Vertical offset from `position.y` to the text baseline. Receives Skia's
     * `FontMetrics.ascent` (negative, baseline → top of glyphs) and `FontMetrics.descent`
     * (positive, baseline → bottom of glyphs).
     */
    offsetY: (ascent: number, descent: number) => number;
};
/**
 * Anchor offsets for an angle-axis tick label so it never overlaps the radar grid.
 *
 * Ports Recharts' [`getTickTextAnchor`](https://github.com/recharts/recharts/blob/main/src/polar/PolarAngleAxis.tsx)
 * + `getTickTextVerticalAnchor` to our angle convention (radians CW from 12 o'clock) and
 * Skia's baseline-anchored text rendering:
 *
 * - **Horizontal** — `sin(angle) > 0` ⇒ anchor left edge; `< 0` ⇒ anchor right edge; ≈ 0
 *   (top/bottom) ⇒ horizontally center.
 * - **Vertical** — inside the top/bottom 90° wedge (`|sin(angle)| ≤ cos(45°)`), push the label
 *   outside the grid (text above the endpoint in the top sector, below in the bottom sector);
 *   otherwise vertically center on the endpoint.
 *
 * @param angle Spoke angle in radians (`0` = 12 o'clock, increasing clockwise).
 * @returns Offset functions that turn the font's width / metrics into `(x, y)` deltas
 *          relative to the spoke endpoint.
 */
export declare function getAngleLabelAlignment(angle: number): AngleLabelAlignment;
//# sourceMappingURL=radar-chart.utils.d.ts.map