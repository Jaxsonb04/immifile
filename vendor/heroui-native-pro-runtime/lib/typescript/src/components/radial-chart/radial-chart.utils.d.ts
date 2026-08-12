import type { Color, Skia, SkPath, SkPoint } from '@shopify/react-native-skia';
import type { RadialBarSector, RadialChartBarGapValue, RadialChartDomainBound, RadialChartRadiusValue } from './radial-chart.types';
/**
 * Coerces a possibly-missing data-row value into a finite number.
 *
 * @param value Raw value sourced from `row[valueKey]`.
 * @returns Finite number used for scale computation.
 */
export declare function coerceNumericValue(value: unknown): number;
/**
 * Maximum value across `data` for the given `valueKey`.
 *
 * @param data Source rows.
 * @param valueKey Numeric key inspected on each row.
 * @returns Maximum coerced numeric value across all rows.
 */
export declare function getMaxValueForKey(data: ReadonlyArray<Record<string, unknown>>, valueKey: string): number;
/**
 * Minimum value across `data` for the given `valueKey`.
 *
 * @param data Source rows.
 * @param valueKey Numeric key inspected on each row.
 * @returns Minimum coerced numeric value across all rows.
 */
export declare function getMinValueForKey(data: ReadonlyArray<Record<string, unknown>>, valueKey: string): number;
/**
 * Resolves a radius value (pixels or percentage string) against a maximum chart radius.
 *
 * @param value Radius expressed as pixels or a percentage string (e.g. `"40%"`).
 * @param maxRadius Maximum radius in pixels derived from the measured canvas.
 * @returns Resolved radius in pixels.
 */
export declare function resolvePixelRadius(value: RadialChartRadiusValue, maxRadius: number): number;
/**
 * Computes the clockwise angular sweep in degrees between `startAngle` and `endAngle`
 * (degrees clockwise from 12 o'clock).
 *
 * Worklet-compatible — safe to call from Reanimated UI-thread callbacks.
 *
 * @param startAngle Start angle in degrees.
 * @param endAngle End angle in degrees.
 * @returns Positive clockwise sweep in degrees.
 */
export declare function getDomainSweepDegrees(startAngle: number, endAngle: number): number;
/**
 * Converts a polar angle (degrees clockwise from 12 o'clock) to a Skia `addArc` start angle
 * (degrees clockwise from 3 o'clock).
 *
 * Worklet-compatible — safe to call from Reanimated UI-thread callbacks.
 *
 * @param polarAngleDegrees Angle in degrees clockwise from 12 o'clock.
 * @returns Skia-compatible start angle in degrees.
 */
export declare function polarAngleToSkiaDegrees(polarAngleDegrees: number): number;
/**
 * Returns the baseline value for a radial bar sector.
 *
 * When the domain straddles zero the baseline is `0`; otherwise it is the domain edge closest
 * to the data range.
 *
 * @param domainMin Resolved domain lower bound.
 * @param domainMax Resolved domain upper bound.
 * @returns Baseline value used as the sector's angular start.
 */
export declare function getBaseValueOfBar(domainMin: number, domainMax: number): number;
/**
 * Resolves an angle-axis domain tuple into numeric bounds.
 *
 * @param domain Domain tuple with optional `"auto"` bounds.
 * @param data Source rows used to resolve `"auto"` bounds.
 * @param valueKey Numeric key inspected on each row.
 * @returns Resolved `[min, max]` domain.
 */
export declare function resolveRadialChartDomain(domain: [RadialChartDomainBound, RadialChartDomainBound], data: ReadonlyArray<Record<string, unknown>>, valueKey: string): [number, number];
/**
 * Maps a data value onto the chart's angular range with a linear scale.
 *
 * @param value Data value to map.
 * @param domain Resolved numeric domain.
 * @param rootStartAngle Chart start angle in degrees (clockwise from 12 o'clock).
 * @param rootEndAngle Chart end angle in degrees (clockwise from 12 o'clock).
 * @returns Mapped angle in degrees (clockwise from 12 o'clock).
 */
export declare function mapValueToAngle(value: number, domain: [number, number], rootStartAngle: number, rootEndAngle: number): number;
/**
 * Resolves the inner / outer radii for one concentric band when `barGap` is a fixed pixel
 * value. Bands are anchored from the **outer** bound inward so the outermost ring
 * (`index === count - 1`) always touches `outerRadiusPx` and the chart fills its space.
 * Each step inward removes `barSize + barGap`.
 *
 * @param options Band placement inputs.
 * @returns Inner and outer radii for the band, or `null` when the band does not fit
 * within `[innerRadiusPx, outerRadiusPx]`.
 */
export declare function getRadialBarBandRadiiFixed(options: {
    barGap: number;
    barSize: number;
    count: number;
    index: number;
    innerRadiusPx: number;
    outerRadiusPx: number;
}): {
    innerRadius: number;
    outerRadius: number;
} | null;
/**
 * Resolves the inner / outer radii for one concentric band when `barGap="auto"` — bands are
 * distributed evenly across `[innerRadiusPx, outerRadiusPx]` so index `0` starts at the inner
 * bound and the last index ends at the outer bound.
 *
 * @param options Band placement inputs.
 * @returns Inner and outer radii for the band, or `null` when the band does not fit.
 */
export declare function getRadialBarBandRadiiAuto(options: {
    barSize: number;
    count: number;
    index: number;
    innerRadiusPx: number;
    outerRadiusPx: number;
}): {
    innerRadius: number;
    outerRadius: number;
} | null;
/**
 * Options for {@link computeRadialBarSectors}.
 */
export type ComputeRadialBarSectorsOptions = {
    data: ReadonlyArray<Record<string, unknown>>;
    valueKey: string;
    domain: [number, number];
    rootStartAngle: number;
    rootEndAngle: number;
    innerRadiusPx: number;
    outerRadiusPx: number;
    barSize: number;
    barGap: RadialChartBarGapValue;
};
/**
 * Builds per-row radial bar sector descriptors for the radial layout.
 *
 * @param options Sector computation inputs.
 * @returns One sector per data row that fits within the radius bounds.
 */
export declare function computeRadialBarSectors(options: ComputeRadialBarSectorsOptions): RadialBarSector[];
/**
 * Builds a circular arc `SkPath` suitable for stroking a radial bar ring.
 *
 * @param skia Skia factory namespace.
 * @param center Arc center in canvas space.
 * @param radius Centerline radius in pixels.
 * @param skiaStartAngleDeg Skia start angle in degrees (clockwise from 3 o'clock).
 * @param sweepAngleDeg Clockwise sweep in degrees.
 * @returns Arc path, or `null` when Skia is unavailable or sweep is zero.
 */
export declare function buildArcPath(skia: typeof Skia | undefined, center: SkPoint, radius: number, skiaStartAngleDeg: number, sweepAngleDeg: number): SkPath | null;
/**
 * Type guard for values that satisfy Skia's {@link Color} union.
 */
export declare function isSkiaColor(value: unknown): value is Color;
//# sourceMappingURL=radial-chart.utils.d.ts.map