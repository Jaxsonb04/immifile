"use strict";

import InternationalizedDatePackage from "../../optional/internationalized-date.js";
const {
  parseTime
} = InternationalizedDatePackage ?? {};

/**
 * Built-in time label styles for `TimePicker`.
 * - `"short"`: hour and minute only (e.g. `"2:30 PM"` / `"14:30"`).
 * - `"medium"`: includes seconds (e.g. `"2:30:00 PM"`).
 */

/**
 * Options controlling how a `Time` is formatted into the select label.
 */

/**
 * Formats a `Time` for the select label using presets or a custom formatter.
 */
export function formatTimeForDisplay(time, options) {
  if (options.formatTime) {
    return options.formatTime(time);
  }
  const locale = options.locale ?? 'en-US';

  // `Intl.DateTimeFormat` works on `Date`, so seed a throwaway date with the
  // time fields. The calendar date is irrelevant to the rendered label.
  const referenceDate = new Date(2000, 0, 1, time.hour, time.minute, time.second, 0);
  const intlOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: options.hourFormat === 12
  };
  if (options.timeDisplayFormat === 'medium') {
    intlOptions.second = '2-digit';
  }
  return new Intl.DateTimeFormat(locale, intlOptions).format(referenceDate);
}

/**
 * Parses an ISO time string from `TimePickerOption.value` for the wheel.
 * Returns `undefined` if the string is not a valid time (avoids render crashes).
 */
export function tryParseTimePickerValueString(value) {
  try {
    return parseTime(value);
  } catch (_error) {
    return undefined;
  }
}