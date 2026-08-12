/**
 * Resolves a snap point value to absolute pixels.
 * Values in `[0, 1]` are treated as ratios of `containerHeight`; values above `1` are px.
 *
 * @param value - Ratio (0..1) or absolute height in px (> 1).
 * @param containerHeight - Measured container height in px.
 */
export declare function resolveSnapPoint(value: number, containerHeight: number): number;
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
export declare function resolveMaxHeight(value: number, containerHeight: number, maxTopCeiling: number): number;
/**
 * Resolves all snap points, clamps to `[minPx, maxPx]`, sorts ascending, and removes duplicates.
 *
 * @param snapPoints - User-defined snap points (ratios or px).
 * @param containerHeight - Measured container height.
 * @param minPx - Minimum allowed top section height.
 * @param maxPx - Maximum allowed top section height.
 */
export declare function resolveSnapPoints(snapPoints: readonly number[], containerHeight: number, minPx: number, maxPx: number): number[];
/**
 * Returns the index of the nearest snap height to `height`.
 *
 * When two snaps are equally close (within {@link NEAREST_SNAP_TIE_EPSILON}), prefers the **larger**
 * height so release halfway between the last user snap and `maxPx` still settles on the maximum.
 */
export declare function findNearestSnapIndex(height: number, points: readonly number[]): number;
/**
 * Picks snap index after a high-velocity flick: steps toward min or max from current index.
 *
 * @param currentIndex - Current snap index before release.
 * @param velocityY - Pan gesture velocity on Y.
 * @param pointsLength - Number of snap points.
 * @param flickRatio - Fraction of range to move (0..1).
 */
export declare function pickFlickSnapIndex(currentIndex: number, velocityY: number, pointsLength: number, flickRatio: number): number;
//# sourceMappingURL=split-view.utils.d.ts.map