"use strict";

/** Precomputed `2π` for `getCategoryAngles`. */
const TWO_PI = Math.PI * 2;

/**
 * `cos(45°)` — boundary between the top/bottom 90° wedge (labels need vertical anchoring) and
 * the left/right 90° wedge (labels need horizontal anchoring). Mirrors Recharts' `COS_45`.
 */
const COS_45 = Math.cos(Math.PI / 4);

/**
 * Tolerance for `sin` / `cos` comparisons in {@link getAngleLabelAlignment} so floating-point
 * noise at the cardinal directions doesn't flip a label into the wrong quadrant.
 */
const ANGLE_EPSILON = 1e-5;

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
export function polarToCartesian(center, radius, angle) {
  return {
    x: center.x + radius * Math.sin(angle),
    y: center.y - radius * Math.cos(angle)
  };
}

/**
 * Computes the spoke angle (in radians) for each category. First spoke sits at 12 o'clock;
 * subsequent spokes rotate clockwise by `2π / numCategories`. Returns `[]` when
 * `numCategories <= 0` so callers can `.map` without an extra guard.
 *
 * @param numCategories Number of categorical axes (typically `data.length`).
 * @returns `numCategories` angles in radians.
 */
export function getCategoryAngles(numCategories) {
  if (numCategories <= 0) {
    return [];
  }
  const step = TWO_PI / numCategories;
  return Array.from({
    length: numCategories
  }, (_, index) => index * step);
}

/**
 * Builds a closed polygon `SkPath` from an ordered list of vertices. Returns `null` when no
 * Skia runtime is available (optional peer dependency missing) or when fewer than three points
 * are supplied — both cases render as no-ops upstream.
 *
 * @param skia Skia factory namespace (`ReactNativeSkiaPackage.Skia`).
 * @param points Ordered polygon vertices in canvas space.
 * @returns Closed `SkPath`, or `null` when geometry cannot be built.
 */
export function buildPolygonPath(skia, points) {
  if (skia === undefined || points.length < 3) {
    return null;
  }
  const path = skia.Path.Make();
  const [first, ...rest] = points;
  if (first === undefined) {
    return null;
  }
  path.moveTo(first.x, first.y);
  rest.forEach(point => {
    path.lineTo(point.x, point.y);
  });
  path.close();
  return path;
}

/**
 * Builds a circular `SkPath`. Used by `RadarChart.Grid` when `shape="circle"`. Returns `null`
 * when Skia is unavailable so callers render nothing instead of crashing.
 *
 * @param skia Skia factory namespace (`ReactNativeSkiaPackage.Skia`).
 * @param center Ring center in canvas space.
 * @param radius Ring radius in pixels.
 * @returns Circular `SkPath`, or `null` when Skia is unavailable.
 */
export function buildCirclePath(skia, center, radius) {
  if (skia === undefined || radius <= 0) {
    return null;
  }
  const path = skia.Path.Make();
  path.addCircle(center.x, center.y, radius);
  return path;
}

/**
 * Coerces a possibly-missing data-row value into a finite number. Treats `null`, `undefined`,
 * `NaN`, and non-numeric strings as `0` so missing measurements draw at the chart center
 * rather than corrupting the polygon shape.
 *
 * @param value Raw value sourced from `row[dataKey]`.
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
 * Maximum value across `data` for the given `dataKey`. Returns `0` for an empty dataset so
 * callers can fall back safely (the chart then renders an empty radar at the center).
 *
 * @param data Source rows.
 * @param dataKey Numeric key inspected on each row.
 * @returns Maximum coerced numeric value across all rows.
 */
export function getMaxValueForKey(data, dataKey) {
  return data.reduce((acc, row) => {
    const value = coerceNumericValue(row[dataKey]);
    return value > acc ? value : acc;
  }, 0);
}

/**
 * Evenly-spaced tick values in `(0, maxValue]`. Matches the ring count drawn by
 * `RadarChart.Grid` so each tick label aligns with one concrete concentric ring.
 *
 * @param maxValue Upper bound of the radial scale.
 * @param numTicks Number of ticks to produce (typically the grid's `numTicks`).
 * @returns Ascending tick values from the first ring outward.
 */
export function buildAxisTicks(maxValue, numTicks) {
  if (numTicks <= 0 || maxValue <= 0) {
    return [];
  }
  return Array.from({
    length: numTicks
  }, (_, index) => (index + 1) / numTicks * maxValue);
}

/**
 * Per-axis alignment offsets for an angle-axis tick label.
 *
 * Skia's `<Text>` anchors at the **left edge of the baseline**, not the geometric center, so
 * each label needs `(x, y)` shifts relative to its spoke endpoint to stay clear of the grid.
 * Both functions are pure offsets — callers add the result to the endpoint coordinate.
 */

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
export function getAngleLabelAlignment(angle) {
  const sinA = Math.sin(angle);
  const cosA = Math.cos(angle);
  let offsetX;
  if (sinA > ANGLE_EPSILON) {
    offsetX = () => 0;
  } else if (sinA < -ANGLE_EPSILON) {
    offsetX = width => -width;
  } else {
    offsetX = width => -width / 2;
  }
  let offsetY;
  if (Math.abs(sinA) <= COS_45) {
    if (cosA > 0) {
      // Top sector — bottom edge of text at the endpoint, baseline `descent` above.
      offsetY = (_, descent) => -descent;
    } else {
      // Bottom sector — top edge of text at the endpoint, baseline `|ascent|` below.
      offsetY = ascent => -ascent;
    }
  } else {
    // Left/right wedge — vertically center text on the endpoint.
    offsetY = (ascent, descent) => -(ascent + descent) / 2;
  }
  return {
    offsetX,
    offsetY
  };
}