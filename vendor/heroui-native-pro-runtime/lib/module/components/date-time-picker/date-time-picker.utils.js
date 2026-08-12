"use strict";

import InternationalizedDatePackage from "../../optional/internationalized-date.js";
const {
  parseDateTime,
  getLocalTimeZone
} = InternationalizedDatePackage ?? {};

/**
 * Built-in date-time label styles for `DateTimePicker`.
 * - `"short"`: month / day / year + hour and minute (e.g. `"Jun 1, 2026, 2:30 PM"`).
 * - `"medium"`: includes the weekday and seconds (e.g. `"Mon, Jun 1, 2026, 2:30:00 PM"`).
 */

/**
 * Options controlling how a `CalendarDateTime` is formatted into the select
 * label.
 */

/**
 * Formats a `CalendarDateTime` for the select label using presets or a custom
 * formatter.
 */
export function formatDateTimeForDisplay(value, options) {
  if (options.formatDateTime) {
    return options.formatDateTime(value);
  }
  const locale = options.locale ?? 'en-US';
  const referenceDate = value.toDate(getLocalTimeZone());
  const intlOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: options.hourFormat === 12
  };
  if (options.dateTimeDisplayFormat === 'medium') {
    intlOptions.weekday = 'short';
    intlOptions.second = '2-digit';
  }
  return new Intl.DateTimeFormat(locale, intlOptions).format(referenceDate);
}

/**
 * Parses an ISO date-time string from `DateTimePickerOption.value` for the
 * wheel. Returns `undefined` if the string is not a valid date-time (avoids
 * render crashes).
 */
export function tryParseDateTimePickerValueString(value) {
  try {
    return parseDateTime(value);
  } catch (_error) {
    return undefined;
  }
}