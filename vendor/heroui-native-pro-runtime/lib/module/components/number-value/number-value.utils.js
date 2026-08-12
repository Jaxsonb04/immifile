"use strict";

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
export function formatNumber(value, formatOptions, locale) {
  if (Number.isNaN(value)) {
    return '';
  }
  const formatter = new Intl.NumberFormat(locale, formatOptions);
  return formatter.format(value);
}