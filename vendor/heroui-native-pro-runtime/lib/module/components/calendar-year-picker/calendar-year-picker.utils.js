"use strict";

import { getGregorianYearOffset } from "../../helpers/internal/utils/index.js";
/**
 * Default lower/upper Gregorian year bounds used when `minValue` / `maxValue`
 * are not supplied. Shifted per calendar system via
 * {@link getGregorianYearOffset} so the year picker still renders sensible
 * years under non-Gregorian calendars (Buddhist, Hebrew, Persian, …) when the
 * primitive is used directly without the styled wrapper.
 */
const DEFAULT_MIN_GREGORIAN_YEAR = 1900;
const DEFAULT_MAX_GREGORIAN_YEAR = 2099;

/**
 * Builds an inclusive list of calendar years between optional min/max bounds.
 *
 * Year numbers are emitted in the bound calendar system's numbering — e.g.
 * `2443`–`2642` under the Buddhist calendar — because `minValue.year` /
 * `maxValue.year` on `DateValue` already return the calendar-system year.
 *
 * When bounds are missing, the fallback range is derived from the Gregorian
 * `1900`–`2099` window and shifted into `calendarIdentifier`'s numbering via
 * {@link getGregorianYearOffset}, so a primitive-only consumer still gets a
 * valid year list.
 *
 * @param minValue - Lower bound from calendar state; uses its `year` when set.
 * @param maxValue - Upper bound from calendar state; uses its `year` when set.
 * @param calendarIdentifier - Identifier of the calendar system currently in
 *   effect (e.g. from `focusedDate.calendar.identifier`); used only for the
 *   fallback path when `minValue` / `maxValue` are not provided.
 * @returns Ascending numeric years in the inclusive range.
 */
export function getYearRange(minValue, maxValue, calendarIdentifier) {
  const offset = getGregorianYearOffset(calendarIdentifier ?? 'gregory');
  const startYear = minValue?.year ?? DEFAULT_MIN_GREGORIAN_YEAR + offset;
  const endYear = maxValue?.year ?? DEFAULT_MAX_GREGORIAN_YEAR + offset;
  if (endYear < startYear) {
    return [];
  }
  const length = endYear - startYear + 1;
  return Array.from({
    length
  }, (_, index) => startYear + index);
}

/**
 * Computes the `FlatList.scrollToOffset` position for a given year index so
 * that the corresponding row is vertically centered in the viewport, clamped
 * to the list's scroll bounds.
 *
 * @param params.targetIndex - Index of the target year in the data array. A
 *   negative value (year not in range) yields an offset of `0`.
 * @param params.totalCount - Total number of years in the data array.
 * @param params.numColumns - Number of grid columns (cells per row).
 * @param params.cellHeight - Rendered height of a single row cell.
 * @param params.viewportHeight - Measured height of the scrollable viewport.
 *   When `0`, centering is skipped and the row is aligned to the top.
 */
export function getYearScrollOffset(params) {
  const {
    targetIndex,
    totalCount,
    numColumns,
    cellHeight,
    viewportHeight
  } = params;
  if (targetIndex < 0 || totalCount <= 0 || cellHeight <= 0) {
    return 0;
  }
  const safeColumns = Math.max(1, numColumns);
  const targetRow = Math.floor(targetIndex / safeColumns);
  const rowCount = Math.ceil(totalCount / safeColumns);
  const contentHeight = rowCount * cellHeight;
  const centeringOffset = viewportHeight > 0 ? (viewportHeight - cellHeight) / 2 : 0;
  const maxOffset = Math.max(0, contentHeight - viewportHeight);
  const rawOffset = targetRow * cellHeight - centeringOffset;
  return Math.max(0, Math.min(rawOffset, maxOffset));
}