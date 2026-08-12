"use strict";

import InternationalizedDatePackage from "../../optional/internationalized-date.js";
const {
  DateFormatter,
  getLocalTimeZone,
  parseDate
} = InternationalizedDatePackage ?? {};

/**
 * Built-in date label styles for `DatePicker` (maps to `Intl.DateTimeFormat` `dateStyle`).
 */

/**
 * Formats a `CalendarDate` for the select label using presets or a custom formatter.
 */
export function formatCalendarDateForDisplay(date, options) {
  if (options.formatDate) {
    return options.formatDate(date);
  }
  const locale = options.locale ?? 'en-US';
  const formatter = new DateFormatter(locale, {
    dateStyle: options.dateDisplayFormat
  });
  return formatter.format(date.toDate(getLocalTimeZone()));
}

/**
 * Parses an ISO date string from `DatePickerOption.value` for the calendar.
 * Returns `undefined` if the string is not a valid calendar date (avoids render crashes).
 */
export function tryParseDatePickerValueString(value) {
  try {
    return parseDate(value);
  } catch {
    return undefined;
  }
}