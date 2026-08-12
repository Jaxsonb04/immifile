"use strict";

import { DEFAULT_FORMAT_OPTIONS } from "./progress-bar.constants.js";

/**
 * Clamps and normalizes a value within [min, max] to a 0–100 percentage.
 */
export const clampPercentage = (value, minValue, maxValue) => {
  if (maxValue <= minValue) return 0;
  const clamped = Math.min(Math.max(value, minValue), maxValue);
  return (clamped - minValue) / (maxValue - minValue) * 100;
};

/**
 * Formats the progress value as a human-readable string using `Intl.NumberFormat`.
 *
 * When `style: 'percent'`, the value is first converted to the 0–1 range
 * that `Intl.NumberFormat` expects for percentage formatting.
 */
export const formatProgressValue = (value, minValue, maxValue, formatOptions = DEFAULT_FORMAT_OPTIONS) => {
  const percentage = clampPercentage(value, minValue, maxValue) / 100;
  if (formatOptions.style === 'percent') {
    return new Intl.NumberFormat(undefined, formatOptions).format(percentage);
  }
  return new Intl.NumberFormat(undefined, formatOptions).format(value);
};