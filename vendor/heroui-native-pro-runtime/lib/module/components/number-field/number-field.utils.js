"use strict";

/**
 * Format a numeric value using Intl.NumberFormat.
 *
 * @param value - The number to format
 * @param formatOptions - Intl.NumberFormatOptions (currency, percent, etc.)
 * @param locale - Optional locale string (defaults to device locale)
 * @returns The formatted string, or an empty string when the value is NaN
 */
export function formatNumber(value, formatOptions, locale) {
  if (Number.isNaN(value)) {
    return '';
  }
  const formatter = new Intl.NumberFormat(locale, {
    useGrouping: false,
    ...formatOptions
  });
  return formatter.format(value);
}

/**
 * Detect the grouping and decimal separators for a given locale by
 * formatting a known number and inspecting the output.
 * Works on Hermes (which lacks `formatToParts`).
 */
function detectSeparators(formatOptions, locale) {
  const formatted = new Intl.NumberFormat(locale, {
    ...formatOptions,
    style: 'decimal',
    useGrouping: true,
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(1234.5);

  // Strip digits to isolate separator characters: "1,234.5" -> ",."
  const separators = formatted.replace(/\d/g, '');
  if (separators.length >= 2) {
    return {
      group: separators[0] ?? ',',
      decimal: separators[1] ?? '.'
    };
  }
  if (separators.length === 1) {
    return {
      group: ',',
      decimal: separators[0] ?? '.'
    };
  }
  return {
    group: ',',
    decimal: '.'
  };
}

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
export function parseNumber(text, formatOptions, locale) {
  if (text.trim().length === 0) {
    return NaN;
  }
  const {
    group: groupSeparator,
    decimal: decimalSeparator
  } = detectSeparators(formatOptions, locale);
  const isPercent = formatOptions?.style === 'percent';
  let cleaned = text;
  const escGroup = escapeRegex(groupSeparator);
  const escDecimal = escapeRegex(decimalSeparator);

  // Remove everything except digits, decimal separator, and minus
  cleaned = cleaned.replace(new RegExp(`[^\\d${escDecimal}\\-]`, 'g'), '');

  // Remove grouping separators
  cleaned = cleaned.replace(new RegExp(escGroup, 'g'), '');

  // Normalise decimal separator to "."
  if (decimalSeparator !== '.') {
    cleaned = cleaned.replace(new RegExp(escDecimal, 'g'), '.');
  }
  const result = Number(cleaned);
  if (Number.isNaN(result)) {
    return NaN;
  }
  return isPercent ? result / 100 : result;
}

/**
 * Clamp a value between an optional minimum and maximum.
 *
 * @param value - The value to clamp
 * @param min - Optional minimum (unbounded if undefined)
 * @param max - Optional maximum (unbounded if undefined)
 * @returns The clamped value
 */
export function clampValue(value, min, max) {
  let result = value;
  if (min !== undefined && result < min) {
    result = min;
  }
  if (max !== undefined && result > max) {
    result = max;
  }
  return result;
}

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
export function snapToStep(value, step, direction, base = 0) {
  const offset = value - base;

  // Use a small epsilon to handle floating-point rounding (e.g. 0.1 + 0.2)
  const epsilon = step / 1e10;
  const remainder = (offset % step + step) % step;
  const isAligned = remainder < epsilon || step - remainder < epsilon;
  if (isAligned) {
    return direction === 'up' ? value + step : value - step;
  }
  return direction === 'up' ? base + Math.ceil(offset / step) * step : base + Math.floor(offset / step) * step;
}

/**
 * Escape special regex characters in a string so it can be used in `new RegExp()`.
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}