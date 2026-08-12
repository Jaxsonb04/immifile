"use strict";

import InternationalizedDatePackage from "../../optional/internationalized-date.js";
const {
  DateFormatter,
  endOfMonth,
  startOfMonth,
  startOfWeek,
  today
} = InternationalizedDatePackage ?? {};
/**
 * Module-level cache for {@link DateFormatter} instances keyed by locale + the option fields we
 * actually use. Instantiating `DateFormatter` wraps `Intl.DateTimeFormat`, which is expensive on
 * Hermes/JSC (1-3 ms per allocation). Cells / headings / year pickers all share the same formatter
 * for a given (locale, calendar, timeZone, style) combination, so caching avoids hundreds of
 * redundant allocations when opening a calendar.
 */
const dateFormatterCache = new Map();
/**
 * Returns a cached {@link DateFormatter} for the given locale and subset of options used by the
 * calendar primitives. Never invalidates — locales and time zones are effectively stable for the
 * lifetime of the app, and the total set of distinct keys is tiny.
 */
export function getCachedDateFormatter(locale, options) {
  const key = [locale, options.calendar ?? '', options.timeZone ?? '', options.day ?? '', options.month ?? '', options.year ?? '', options.weekday ?? ''].join('|');
  let formatter = dateFormatterCache.get(key);
  if (!formatter) {
    formatter = new DateFormatter(locale, options);
    dateFormatterCache.set(key, formatter);
  }
  return formatter;
}

/**
 * Number of week rows needed to display the month containing `monthAnchor`.
 */
export function getWeeksInMonth(monthAnchor, locale, firstDayOfWeek) {
  const firstOfMonth = startOfMonth(monthAnchor);
  const lastOfMonth = endOfMonth(monthAnchor);
  let gridStart = startOfWeek(firstOfMonth, locale, firstDayOfWeek);
  let weeks = 0;
  while (gridStart.compare(lastOfMonth) <= 0) {
    weeks += 1;
    gridStart = gridStart.add({
      weeks: 1
    });
  }
  return Math.max(weeks, 1);
}

/**
 * Localized weekday names for the calendar header row.
 */
export function getWeekdayLabels(locale, timeZone, style, firstDayOfWeek) {
  const formatter = getCachedDateFormatter(locale, {
    weekday: style,
    timeZone
  });
  const ref = today(timeZone);
  const weekStart = startOfWeek(ref, locale, firstDayOfWeek);
  const labels = [];
  for (let i = 0; i < 7; i++) {
    const d = weekStart.add({
      days: i
    });
    labels.push(formatter.format(d.toDate(timeZone)));
  }
  return labels;
}