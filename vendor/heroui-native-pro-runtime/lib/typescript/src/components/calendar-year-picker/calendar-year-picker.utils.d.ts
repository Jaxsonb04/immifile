import type { DateValue } from '../../primitives/calendar/state/types';
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
export declare function getYearRange(minValue?: DateValue | null, maxValue?: DateValue | null, calendarIdentifier?: string): number[];
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
export declare function getYearScrollOffset(params: {
    targetIndex: number;
    totalCount: number;
    numColumns: number;
    cellHeight: number;
    viewportHeight: number;
}): number;
//# sourceMappingURL=calendar-year-picker.utils.d.ts.map