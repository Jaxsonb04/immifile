"use strict";

/**
 * Coerces a possibly-missing data-row value into a finite number.
 *
 * @param value Raw value sourced from `row[valueKey]`.
 * @returns Finite number used for scale computation.
 */
export function coerceNumericValue(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return 0;
}

/**
 * Maximum value across `data` for the given `valueKey`.
 *
 * @param data Source rows.
 * @param valueKey Numeric key inspected on each row.
 * @returns Maximum coerced numeric value across all rows.
 */
export function getMaxValueForKey(data, valueKey) {
  return data.reduce((acc, row) => {
    const value = coerceNumericValue(row[valueKey]);
    return value > acc ? value : acc;
  }, 0);
}

/**
 * Minimum value across `data` for the given `valueKey`.
 *
 * @param data Source rows.
 * @param valueKey Numeric key inspected on each row.
 * @returns Minimum coerced numeric value across all rows.
 */
export function getMinValueForKey(data, valueKey) {
  if (data.length === 0) {
    return 0;
  }
  return data.reduce((acc, row) => {
    const value = coerceNumericValue(row[valueKey]);
    return value < acc ? value : acc;
  }, coerceNumericValue(data[0]?.[valueKey]));
}

/**
 * Resolves a radius value (pixels or percentage string) against a maximum chart radius.
 *
 * @param value Radius expressed as pixels or a percentage string (e.g. `"40%"`).
 * @param maxRadius Maximum radius in pixels derived from the measured canvas.
 * @returns Resolved radius in pixels.
 */
export function resolvePixelRadius(value, maxRadius) {
  if (typeof value === 'number') {
    return Math.max(0, value);
  }
  const trimmed = value.trim();
  if (trimmed.endsWith('%')) {
    const percent = Number.parseFloat(trimmed.slice(0, -1));
    if (Number.isFinite(percent)) {
      return Math.max(0, percent / 100 * maxRadius);
    }
  }
  const parsed = Number.parseFloat(trimmed);
  if (Number.isFinite(parsed)) {
    return Math.max(0, parsed);
  }
  return 0;
}

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
export function getDomainSweepDegrees(startAngle, endAngle) {
  'worklet';

  const rawSweep = startAngle - endAngle;
  const normalized = (rawSweep % 360 + 360) % 360;
  return normalized === 0 && rawSweep !== 0 ? 360 : normalized;
}

/**
 * Converts a polar angle (degrees clockwise from 12 o'clock) to a Skia `addArc` start angle
 * (degrees clockwise from 3 o'clock).
 *
 * Worklet-compatible — safe to call from Reanimated UI-thread callbacks.
 *
 * @param polarAngleDegrees Angle in degrees clockwise from 12 o'clock.
 * @returns Skia-compatible start angle in degrees.
 */
export function polarAngleToSkiaDegrees(polarAngleDegrees) {
  'worklet';

  return ((360 - polarAngleDegrees) % 360 + 360) % 360;
}

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
export function getBaseValueOfBar(domainMin, domainMax) {
  if (domainMin <= 0 && domainMax >= 0) {
    return 0;
  }
  if (domainMin > 0) {
    return domainMin;
  }
  return domainMax;
}

/**
 * Resolves an angle-axis domain tuple into numeric bounds.
 *
 * @param domain Domain tuple with optional `"auto"` bounds.
 * @param data Source rows used to resolve `"auto"` bounds.
 * @param valueKey Numeric key inspected on each row.
 * @returns Resolved `[min, max]` domain.
 */
export function resolveRadialChartDomain(domain, data, valueKey) {
  const [minBound, maxBound] = domain;
  const resolvedMin = minBound === 'auto' ? getMinValueForKey(data, valueKey) : minBound;
  const resolvedMax = maxBound === 'auto' ? getMaxValueForKey(data, valueKey) : maxBound;
  if (resolvedMin <= resolvedMax) {
    return [resolvedMin, resolvedMax];
  }
  return [resolvedMax, resolvedMin];
}

/**
 * Maps a data value onto the chart's angular range with a linear scale.
 *
 * @param value Data value to map.
 * @param domain Resolved numeric domain.
 * @param rootStartAngle Chart start angle in degrees (clockwise from 12 o'clock).
 * @param rootEndAngle Chart end angle in degrees (clockwise from 12 o'clock).
 * @returns Mapped angle in degrees (clockwise from 12 o'clock).
 */
export function mapValueToAngle(value, domain, rootStartAngle, rootEndAngle) {
  const [domainMin, domainMax] = domain;
  if (domainMax === domainMin) {
    return rootStartAngle;
  }
  const ratio = (value - domainMin) / (domainMax - domainMin);
  return rootStartAngle + ratio * (rootEndAngle - rootStartAngle);
}

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
export function getRadialBarBandRadiiFixed(options) {
  const {
    barGap,
    barSize,
    count,
    index,
    innerRadiusPx,
    outerRadiusPx
  } = options;
  if (barSize <= 0 || count <= 0 || index < 0 || index >= count) {
    return null;
  }
  const positionFromOuter = count - 1 - index;
  const outerRadius = outerRadiusPx - positionFromOuter * (barSize + barGap);
  const innerRadius = outerRadius - barSize;
  if (outerRadius <= 0 || innerRadius < innerRadiusPx - 0.5) {
    return null;
  }
  return {
    innerRadius,
    outerRadius
  };
}

/**
 * Resolves the inner / outer radii for one concentric band when `barGap="auto"` — bands are
 * distributed evenly across `[innerRadiusPx, outerRadiusPx]` so index `0` starts at the inner
 * bound and the last index ends at the outer bound.
 *
 * @param options Band placement inputs.
 * @returns Inner and outer radii for the band, or `null` when the band does not fit.
 */
export function getRadialBarBandRadiiAuto(options) {
  const {
    barSize,
    count,
    index,
    innerRadiusPx,
    outerRadiusPx
  } = options;
  const availableSpan = outerRadiusPx - innerRadiusPx;
  if (availableSpan <= 0 || barSize <= 0 || count <= 0 || index < 0 || index >= count) {
    return null;
  }
  if (count === 1) {
    const resolvedSingleBarSize = Math.min(barSize, availableSpan);
    if (resolvedSingleBarSize <= 0) {
      return null;
    }
    return {
      innerRadius: outerRadiusPx - resolvedSingleBarSize,
      outerRadius: outerRadiusPx
    };
  }
  const maxBarSize = availableSpan / count;
  const resolvedBarSize = Math.min(barSize, maxBarSize);
  if (resolvedBarSize <= 0) {
    return null;
  }
  const step = (availableSpan - resolvedBarSize) / (count - 1);
  const innerRadius = innerRadiusPx + index * step;
  const outerRadius = innerRadius + resolvedBarSize;
  if (outerRadius > outerRadiusPx + 0.5) {
    return null;
  }
  return {
    innerRadius,
    outerRadius
  };
}

/**
 * Options for {@link computeRadialBarSectors}.
 */

/**
 * Builds per-row radial bar sector descriptors for the radial layout.
 *
 * @param options Sector computation inputs.
 * @returns One sector per data row that fits within the radius bounds.
 */
export function computeRadialBarSectors(options) {
  const {
    barGap,
    barSize,
    data,
    domain,
    innerRadiusPx,
    outerRadiusPx,
    rootEndAngle,
    rootStartAngle,
    valueKey
  } = options;
  if (data.length === 0 || barSize <= 0 || outerRadiusPx <= innerRadiusPx) {
    return [];
  }
  const baseValue = getBaseValueOfBar(domain[0], domain[1]);
  const sectors = [];
  const count = data.length;
  const fixedBarGap = barGap === 'auto' ? 0 : barGap;
  for (let index = 0; index < count; index += 1) {
    const row = data[index];
    if (row === undefined) {
      continue;
    }
    const bandRadii = barGap === 'auto' ? getRadialBarBandRadiiAuto({
      barSize,
      count,
      index,
      innerRadiusPx,
      outerRadiusPx
    }) : getRadialBarBandRadiiFixed({
      barGap: fixedBarGap,
      barSize,
      count,
      index,
      innerRadiusPx,
      outerRadiusPx
    });
    if (bandRadii === null) {
      continue;
    }
    const {
      innerRadius,
      outerRadius
    } = bandRadii;
    const value = coerceNumericValue(row[valueKey]);
    const startAngle = mapValueToAngle(baseValue, domain, rootStartAngle, rootEndAngle);
    const endAngle = mapValueToAngle(value, domain, rootStartAngle, rootEndAngle);
    sectors.push({
      background: {
        endAngle: rootEndAngle,
        innerRadius,
        outerRadius,
        startAngle: rootStartAngle
      },
      endAngle,
      index,
      innerRadius,
      outerRadius,
      startAngle,
      value
    });
  }
  return sectors;
}

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
export function buildArcPath(skia, center, radius, skiaStartAngleDeg, sweepAngleDeg) {
  if (skia === undefined || radius <= 0 || sweepAngleDeg === 0) {
    return null;
  }
  const path = skia.Path.Make();
  const oval = {
    height: radius * 2,
    width: radius * 2,
    x: center.x - radius,
    y: center.y - radius
  };
  path.addArc(oval, skiaStartAngleDeg, sweepAngleDeg);
  return path;
}

/**
 * Type guard for values that satisfy Skia's {@link Color} union.
 */
export function isSkiaColor(value) {
  return typeof value === 'string' || typeof value === 'number' || value instanceof Float32Array || Array.isArray(value);
}