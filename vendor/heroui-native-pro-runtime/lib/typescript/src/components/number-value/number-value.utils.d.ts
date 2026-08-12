/**
 * Format a numeric value using `Intl.NumberFormat`.
 *
 * Locale-aware formatting that mirrors the behaviour of the web
 * `@internationalized/number` `NumberFormatter` used by HeroUI's web
 * `NumberValue`. Returns an empty string when `value` is `NaN` so the
 * component can render nothing instead of producing `"NaN"`.
 *
 * @param value - The numeric value to format.
 * @param formatOptions - `Intl.NumberFormatOptions` controlling the output.
 * @param locale - Optional BCP-47 locale identifier (defaults to the device locale).
 * @returns The locale-formatted string, or an empty string when `value` is `NaN`.
 */
export declare function formatNumber(value: number, formatOptions?: Intl.NumberFormatOptions, locale?: string): string;
//# sourceMappingURL=number-value.utils.d.ts.map