"use strict";

/**
 * Resolves a snap point value to absolute pixels.
 * Values in `[0, 1]` are treated as ratios of `containerHeight`; values above `1` are px.
 *
 * @param value - Ratio (0..1) or absolute height in px (> 1).
 * @param containerHeight - Measured container height in px.
 */
export function resolveSnapPoint(value, containerHeight) {
  if (containerHeight <= 0) {
    return 0;
  }
  if (value >= 0 && value <= 1) {
    return value * containerHeight;
  }
  return value;
}

/**
 * Resolves the `maxHeight` prop into an absolute pixel cap for the top section.
 *
 * - Non-negative values: same as {@link resolveSnapPoint} (ratio `0`..`1` of container, or px if `> 1`).
 * - Values strictly between `-1` and `0`: treated as an offset from a full ratio of `1`, i.e.
 *   `(1 + value) * containerHeight` — e.g. `-0.1` → `0.9 * containerHeight`.
 * - Values at most `-1`: pixel offset subtracted from `maxTopCeiling` (layout max before clamp), e.g.
 *   `-50` → `maxTopCeiling - 50`.
 *
 * @param value - `maxHeight` prop value.
 * @param containerHeight - Measured root height.
 * @param maxTopCeiling - `containerHeight` minus drag strip (and any other fixed layout the root uses).
 */
export function resolveMaxHeight(value, containerHeight, maxTopCeiling) {
  if (containerHeight <= 0) {
    return 0;
  }
  if (value >= 0) {
    return resolveSnapPoint(value, containerHeight);
  }
  if (value > -1) {
    return (1 + value) * containerHeight;
  }
  return maxTopCeiling + value;
}

/**
 * Resolves all snap points, clamps to `[minPx, maxPx]`, sorts ascending, and removes duplicates.
 *
 * @param snapPoints - User-defined snap points (ratios or px).
 * @param containerHeight - Measured container height.
 * @param minPx - Minimum allowed top section height.
 * @param maxPx - Maximum allowed top section height.
 */
export function resolveSnapPoints(snapPoints, containerHeight, minPx, maxPx) {
  if (containerHeight <= 0 || snapPoints.length === 0) {
    return [minPx];
  }
  const resolved = [];
  for (let i = 0; i < snapPoints.length; i += 1) {
    const sp = snapPoints[i];
    if (sp === undefined) {
      continue;
    }
    const raw = resolveSnapPoint(sp, containerHeight);
    const clamped = Math.max(minPx, Math.min(raw, maxPx));
    resolved.push(clamped);
  }
  resolved.sort((a, b) => a - b);
  const deduped = [];
  const epsilon = 0.5;
  for (let j = 0; j < resolved.length; j += 1) {
    const current = resolved[j];
    if (current === undefined) {
      continue;
    }
    const prev = deduped[deduped.length - 1];
    if (deduped.length === 0) {
      deduped.push(current);
      continue;
    }
    if (prev === undefined || Math.abs(current - prev) > epsilon) {
      deduped.push(current);
    }
  }
  const largest = deduped[deduped.length - 1];
  if (largest !== undefined && maxPx - largest > epsilon) {
    deduped.push(maxPx);
  }
  return deduped.length > 0 ? deduped : [minPx];
}

/** Matches `resolveSnapPoints` dedupe tolerance; used to break ties between equidistant snaps. */
const NEAREST_SNAP_TIE_EPSILON = 0.5;

/**
 * Returns the index of the nearest snap height to `height`.
 *
 * When two snaps are equally close (within {@link NEAREST_SNAP_TIE_EPSILON}), prefers the **larger**
 * height so release halfway between the last user snap and `maxPx` still settles on the maximum.
 */
export function findNearestSnapIndex(height, points) {
  if (points.length === 0) {
    return 0;
  }
  const first = points[0];
  if (first === undefined) {
    return 0;
  }
  let bestIndex = 0;
  let bestDist = Math.abs(height - first);
  for (let i = 1; i < points.length; i += 1) {
    const p = points[i];
    if (p === undefined) {
      continue;
    }
    const d = Math.abs(height - p);
    const prevBest = points[bestIndex];
    if (prevBest === undefined) {
      continue;
    }
    if (d + 1e-9 < bestDist) {
      bestDist = d;
      bestIndex = i;
    } else if (Math.abs(d - bestDist) <= NEAREST_SNAP_TIE_EPSILON && p > prevBest) {
      bestIndex = i;
    }
  }
  return bestIndex;
}

/**
 * Picks snap index after a high-velocity flick: steps toward min or max from current index.
 *
 * @param currentIndex - Current snap index before release.
 * @param velocityY - Pan gesture velocity on Y.
 * @param pointsLength - Number of snap points.
 * @param flickRatio - Fraction of range to move (0..1).
 */
export function pickFlickSnapIndex(currentIndex, velocityY, pointsLength, flickRatio) {
  if (pointsLength <= 1) {
    return 0;
  }
  const step = Math.max(1, Math.round(flickRatio * (pointsLength - 1)));
  if (velocityY > 0) {
    return Math.min(pointsLength - 1, currentIndex + step);
  }
  if (velocityY < 0) {
    return Math.max(0, currentIndex - step);
  }
  return currentIndex;
}