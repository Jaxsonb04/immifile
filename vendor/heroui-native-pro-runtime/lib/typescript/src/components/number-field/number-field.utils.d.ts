/**
 * Format a numeric value using Intl.NumberFormat.
 *
 * @param value - The number to format
 * @param formatOptions - Intl.NumberFormatOptions (currency, percent, etc.)
 * @param locale - Optional locale string (defaults to device locale)
 * @returns The formatted string, or an empty string when the value is NaN
 */
export declare function formatNumber(value: number, formatOptions?: Intl.NumberFormatOptions, locale?: string): string;
/**
 * Parse a locale-formatted string back into a number.
 *
 * Strips everything that is not a digit, decimal separator, or minus sign,
 * using the Intl.NumberFormat separators for the given locale.
 * Compatible with Hermes (does not use `formatToParts`).
 *
 * @param text - The formatted string to parse
 * @param formatOptions - The same options used for formatting (needed to resolve locale separators)
 * @param locale - Optional locale string (defaults to device locale)
 * @returns The parsed number, or NaN if the string cannot be parsed
 */
export declare function parseNumber(text: string, formatOptions?: Intl.NumberFormatOptions, locale?: string): number;
/**
 * Clamp a value between an optional minimum and maximum.
 *
 * @param value - The value to clamp
 * @param min - Optional minimum (unbounded if undefined)
 * @param max - Optional maximum (unbounded if undefined)
 * @returns The clamped value
 */
export declare function clampValue(value: number, min?: number, max?: number): number;
/**
 * Snap a value to the nearest step boundary in the given direction.
 *
 * When the value is not aligned to the step grid (relative to `min` or 0),
 * this rounds to the next step boundary instead of blindly adding/subtracting.
 * For example: snapToStep(16, 10, 'up')  -> 20, snapToStep(16, 10, 'down') -> 10.
 *
 * @param value - The current value
 * @param step - The step size
 * @param direction - 'up' for increment, 'down' for decrement
 * @param base - The grid origin (typically `minValue`, defaults to 0)
 * @returns The snapped value
 */
export declare function snapToStep(value: number, step: number, direction: 'up' | 'down', base?: number): number;
//# sourceMappingURL=number-field.utils.d.ts.map