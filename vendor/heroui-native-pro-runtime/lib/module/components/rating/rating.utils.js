"use strict";

/**
 * Computes the display state for a single rating item.
 *
 * - A fully-active item has `isActive: true` and `partialPercent: 0`.
 * - A partially-active item has `isActive: false`, `isPartial: true`, and a
 *   positive `partialPercent` in the 0-100 range.
 * - An inactive item has every flag `false`/`0`.
 *
 * Partial fills are only ever emitted when `allowPartial` is `true` — the
 * root enforces this for read-only mode only, because fractional ratings
 * cannot be expressed through the underlying `RadioGroup` selection.
 *
 * @param itemValue - 1-based value of the item being evaluated
 * @param currentValue - current rating value (may be fractional)
 * @param allowPartial - whether partial fills should be computed
 */
export function getRatingItemState(itemValue, currentValue, allowPartial) {
  if (!Number.isFinite(itemValue) || !Number.isFinite(currentValue)) {
    return {
      isActive: false,
      isPartial: false,
      partialPercent: 0
    };
  }
  const isActive = itemValue <= Math.floor(currentValue);
  if (isActive) {
    return {
      isActive: true,
      isPartial: false,
      partialPercent: 0
    };
  }
  if (allowPartial && itemValue - 1 < currentValue && currentValue < itemValue) {
    const rawPercent = (currentValue - (itemValue - 1)) * 100;
    const clamped = Math.max(0, Math.min(100, rawPercent));
    const partialPercent = Math.round(clamped);
    return {
      isActive: false,
      isPartial: partialPercent > 0,
      partialPercent
    };
  }
  return {
    isActive: false,
    isPartial: false,
    partialPercent: 0
  };
}