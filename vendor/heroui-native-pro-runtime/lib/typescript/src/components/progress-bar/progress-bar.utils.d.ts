/**
 * Clamps and normalizes a value within [min, max] to a 0–100 percentage.
 */
export declare const clampPercentage: (value: number, minValue: number, maxValue: number) => number;
/**
 * Formats the progress value as a human-readable string using `Intl.NumberFormat`.
 *
 * When `style: 'percent'`, the value is first converted to the 0–1 range
 * that `Intl.NumberFormat` expects for percentage formatting.
 */
export declare const formatProgressValue: (value: number, minValue: number, maxValue: number, formatOptions?: Intl.NumberFormatOptions) => string;
//# sourceMappingURL=progress-bar.utils.d.ts.map