"use strict";

/**
 * Computes the scroll offset that centers the row at `index` under the
 * selection indicator. Always equals `index * itemHeight` because the
 * FlatList content container is padded by
 * `(viewportHeight - itemHeight) / 2` so the first/last rows can sit at
 * the center.
 *
 * @param index - Zero-based row index to center.
 * @param itemHeight - Pixel height of one row.
 * @returns Scroll offset in pixels (clamped to `>= 0`).
 */
export function getScrollOffsetForIndex(index, itemHeight) {
  if (index < 0 || itemHeight <= 0) {
    return 0;
  }
  return index * itemHeight;
}

/**
 * Worklet-compatible inverse of {@link getScrollOffsetForIndex}. Maps a
 * scroll offset to the index that should be considered "selected" using
 * center-biased rounding so a row is selected as soon as its midpoint
 * crosses the indicator.
 *
 * @worklet
 *
 * @param offset - Current scroll offset in pixels.
 * @param itemHeight - Pixel height of one row.
 * @param maxIndex - Largest valid index in the data set (`items.length - 1`).
 * @returns Clamped index in `[0, maxIndex]`.
 */
export function getIndexFromOffset(offset, itemHeight, maxIndex) {
  'worklet';

  if (itemHeight <= 0 || maxIndex < 0) {
    return 0;
  }
  const raw = Math.floor((offset + itemHeight / 2) / itemHeight);
  if (raw < 0) {
    return 0;
  }
  if (raw > maxIndex) {
    return maxIndex;
  }
  return raw;
}

/**
 * Clamps an arbitrary index into the inclusive `[0, maxIndex]` range. Used
 * by programmatic scroll helpers that accept user-supplied indices.
 *
 * @param index - Index to clamp.
 * @param maxIndex - Largest valid index. When negative, the function
 *   returns `0` (no items in the data set).
 */
export function clampIndex(index, maxIndex) {
  if (maxIndex < 0) {
    return 0;
  }
  if (index < 0) {
    return 0;
  }
  if (index > maxIndex) {
    return maxIndex;
  }
  return index;
}

/**
 * Finds the index of the first item whose `value` matches `targetValue`
 * using `Object.is` equality. Returns `-1` when no item matches.
 *
 * @template T - The value type stored on each item.
 *
 * @param items - The data set.
 * @param targetValue - Value to locate.
 */
export function getIndexForValue(items, targetValue) {
  if (targetValue === undefined) {
    return -1;
  }
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (item !== undefined && Object.is(item.value, targetValue)) {
      return i;
    }
  }
  return -1;
}

/**
 * Resolves a mask-half height prop into a concrete pixel value relative
 * to the wheel's full half-mask height (the space above / below the
 * selection band).
 *
 * - `undefined` → use the full `baseMaskHeight` (100%).
 * - `number` → treated as raw pixels.
 * - `"<n>%"` string → percentage of `baseMaskHeight` (e.g. `"50%"` →
 *   half of the available space).
 * - Any other string is parsed as a number; invalid input falls back to
 *   `baseMaskHeight` so the mask never collapses unexpectedly.
 *
 * @param value - User-supplied `height` prop.
 * @param baseMaskHeight - Maximum pixel height of one mask half.
 */
export function resolveMaskHeight(value, baseMaskHeight) {
  if (value === undefined) {
    return baseMaskHeight;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) && value >= 0 ? value : baseMaskHeight;
  }
  const trimmed = value.trim();
  if (trimmed.endsWith('%')) {
    const pct = Number.parseFloat(trimmed);
    if (!Number.isFinite(pct)) {
      return baseMaskHeight;
    }
    return Math.max(0, pct / 100 * baseMaskHeight);
  }
  const numeric = Number.parseFloat(trimmed);
  return Number.isFinite(numeric) && numeric >= 0 ? numeric : baseMaskHeight;
}