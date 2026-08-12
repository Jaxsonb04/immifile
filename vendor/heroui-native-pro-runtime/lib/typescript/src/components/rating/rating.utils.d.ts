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
export declare function getRatingItemState(itemValue: number, currentValue: number, allowPartial: boolean): {
    isActive: boolean;
    isPartial: boolean;
    partialPercent: number;
};
//# sourceMappingURL=rating.utils.d.ts.map