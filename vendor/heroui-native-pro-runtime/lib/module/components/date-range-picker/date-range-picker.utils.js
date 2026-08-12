"use strict";

import InternationalizedDatePackage from "../../optional/internationalized-date.js";
const {
  DateFormatter,
  getLocalTimeZone,
  parseDate
} = InternationalizedDatePackage ?? {};

/**
 * Wire format for `DateRangePickerOption.value`: JSON object with ISO calendar date strings.
 */

/**
 * Built-in date label styles for `DateRangePicker` (maps to `Intl.DateTimeFormat` `dateStyle`).
 */

/**
 * Options for building the trigger label for a committed date range.
 */

/**
 * Formats a `CalendarDate` for display using presets or a custom formatter.
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
 * Formats start and end calendar dates for the select label.
 */
export function formatDateRangeForDisplay(start, end, options) {
  if (options.formatDateRange) {
    return options.formatDateRange(start, end);
  }
  const sep = options.rangeSeparator ?? '\u2013';
  const single = formatCalendarDateForDisplay(start, {
    dateDisplayFormat: options.dateDisplayFormat,
    locale: options.locale
  });
  const endStr = formatCalendarDateForDisplay(end, {
    dateDisplayFormat: options.dateDisplayFormat,
    locale: options.locale
  });
  if (start.compare(end) === 0) {
    return single;
  }
  return `${single} ${sep} ${endStr}`;
}

/**
 * Serializes a range to `SelectOption.value` (JSON with `start` / `end` ISO strings).
 */
export function serializeDateRangeToSelectValue(range) {
  const payload = {
    start: range.start.toString(),
    end: range.end.toString()
  };
  return JSON.stringify(payload);
}

/**
 * Parses `DateRangePickerOption.value` into calendar dates. Returns `undefined` if invalid.
 */
export function tryParseDateRangeFromSelectValue(value) {
  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch {
    return undefined;
  }
  if (typeof parsed !== 'object' || parsed === null || !('start' in parsed) || !('end' in parsed)) {
    return undefined;
  }
  const rec = parsed;
  const startRaw = rec.start;
  const endRaw = rec.end;
  if (typeof startRaw !== 'string' || typeof endRaw !== 'string') {
    return undefined;
  }
  try {
    const start = parseDate(startRaw);
    const end = parseDate(endRaw);
    return {
      start,
      end
    };
  } catch {
    return undefined;
  }
}