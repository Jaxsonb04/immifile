"use strict";

import InternationalizedDatePackage from "../../optional/internationalized-date.js";
import { buildHourItems, buildMinuteItems, buildPeriodItems, snapMinute } from "../wheel-time-picker/wheel-time-picker.utils.js";
import { DEFAULT_DATE_RANGE_YEARS } from "./wheel-date-time-picker.constants.js";
const {
  CalendarDateTime: CalendarDateTimeCtor,
  parseDate,
  toCalendarDate,
  today,
  getLocalTimeZone,
  DateFormatter
} = InternationalizedDatePackage ?? {};

// Re-export the hour / minute / period builders so the picker shares the exact
// same column data construction as `WheelTimePicker`.
export { buildHourItems, buildMinuteItems, buildPeriodItems };

/**
 * Inclusive lower/upper bounds for the date column, resolved from props.
 */

/**
 * Resolves the date column bounds from optional `minValue` / `maxValue` props,
 * defaulting to `today` through `today + DEFAULT_DATE_RANGE_YEARS`. The range
 * is always widened to include `value` (when present) so the active selection
 * can render, and normalized so `min` never exceeds `max`.
 */
export function resolveDateRange(options) {
  const {
    value,
    minValue,
    maxValue
  } = options;
  const todayDate = today(getLocalTimeZone());
  let min = minValue ?? todayDate;
  let max = maxValue ?? todayDate.add({
    years: DEFAULT_DATE_RANGE_YEARS
  });

  // Guard against inverted bounds so iteration always terminates.
  if (min.compare(max) > 0) {
    max = min;
  }
  if (value !== undefined) {
    const valueDate = toCalendarDate(value);
    if (valueDate.compare(min) < 0) {
      min = valueDate;
    }
    if (valueDate.compare(max) > 0) {
      max = valueDate;
    }
  }
  return {
    min,
    max
  };
}

/**
 * Whether `locale` is English (or unset). Used to decide whether the hardcoded
 * English `"Today"` is an acceptable fallback when `Intl.RelativeTimeFormat`
 * is unavailable in the runtime.
 */
function isEnglishLocale(locale) {
  return locale === undefined || locale.toLowerCase().startsWith('en');
}

/**
 * Resolves a localized "today" label (e.g. "today", "今天") via
 * `Intl.RelativeTimeFormat`. Returns `undefined` when the API is unavailable
 * in the current runtime (e.g. an environment without the relevant Intl
 * polyfill) so the caller can fall back to a locale-appropriate label rather
 * than stray English text.
 */
function getTodayLabel(locale) {
  try {
    const formatter = new Intl.RelativeTimeFormat(locale ?? 'en-US', {
      numeric: 'auto'
    });
    const label = formatter.format(0, 'day');
    return label.charAt(0).toUpperCase() + label.slice(1);
  } catch (_error) {
    return undefined;
  }
}

/**
 * Builds the localized weekday + month + day label for a date (e.g.
 * `"Wed, Jun 3"`). Falls back to the ISO date string when `Intl.DateTimeFormat`
 * is unavailable.
 */
function getCalendarDateLabel(date, locale, timeZone) {
  try {
    return new DateFormatter(locale ?? 'en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(date.toDate(timeZone));
  } catch (_error) {
    return date.toString();
  }
}

/**
 * Builds the localized label for a single date column row. The current day
 * renders as a localized "Today" when `Intl.RelativeTimeFormat` is available;
 * otherwise it falls back to the hardcoded English `"Today"` only for English
 * locales, and to the localized weekday + month + day for every other locale
 * so no stray English appears. Non-today rows always render the localized
 * weekday + month + day (e.g. `"Wed, Jun 3"`).
 */
function getDefaultDateLabel(date, isToday, locale, timeZone) {
  if (isToday) {
    const todayLabel = getTodayLabel(locale);
    if (todayLabel !== undefined) {
      return todayLabel;
    }
    if (isEnglishLocale(locale)) {
      return 'Today';
    }
  }
  return getCalendarDateLabel(date, locale, timeZone);
}

/**
 * Builds the date column options spanning `[min, max]` inclusive. Each
 * option's value is the ISO calendar-date string; labels are localized via
 * `locale` (or the supplied `formatDate` override).
 */
export function buildDateItems(options) {
  const {
    min,
    max,
    locale,
    formatDate
  } = options;
  const timeZone = getLocalTimeZone();
  const todayDate = today(timeZone);
  const items = [];
  let cursor = min;
  while (cursor.compare(max) <= 0) {
    const isToday = cursor.compare(todayDate) === 0;
    const label = formatDate ? formatDate(cursor, {
      isToday
    }) : getDefaultDateLabel(cursor, isToday, locale, timeZone);
    items.push({
      value: cursor.toString(),
      label
    });
    cursor = cursor.add({
      days: 1
    });
  }
  return items;
}

/**
 * Splits a 24-hour value into a 12-hour value plus a day period.
 */
function splitHour12(hour24) {
  const period = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12;
  return {
    hour: hour12 === 0 ? 12 : hour12,
    period
  };
}

/**
 * Combines a 12-hour value and day period back into a 24-hour value.
 */
function combineHour24(hour12, period) {
  if (period === 'AM') {
    return hour12 === 12 ? 0 : hour12;
  }
  return hour12 === 12 ? 12 : hour12 + 12;
}

/**
 * Decomposes a {@link CalendarDateTime} into the wheel values record for the
 * given format. Minutes are snapped to the active `minuteInterval`.
 */
export function dateTimeToWheelValues(value, hourFormat, minuteInterval) {
  const date = toCalendarDate(value).toString();
  const minute = snapMinute(value.minute, minuteInterval);
  if (hourFormat === 24) {
    return {
      date,
      hour: value.hour,
      minute
    };
  }
  const {
    hour,
    period
  } = splitHour12(value.hour);
  return {
    date,
    hour,
    minute,
    period
  };
}

/**
 * Coerces an `unknown` group value into a finite number, returning
 * `fallback` when it cannot be parsed.
 */
function toNumber(value, fallback) {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Coerces an `unknown` group value into a string, returning `fallback` when it
 * is not a non-empty string.
 */
function toDateString(value, fallback) {
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

/**
 * Reconstructs a {@link CalendarDateTime} from a `WheelPickerGroup` values
 * record for the given format. Unknown or missing fields fall back to the
 * supplied `fallbackDate` at midnight.
 */
export function wheelValuesToDateTime(values, hourFormat, fallbackDate) {
  const dateString = toDateString(values.date, fallbackDate.toString());
  let date;
  try {
    date = parseDate(dateString);
  } catch (_error) {
    date = fallbackDate;
  }
  const minute = toNumber(values.minute, 0);
  let hour24;
  if (hourFormat === 24) {
    hour24 = toNumber(values.hour, 0);
  } else {
    const hour12 = toNumber(values.hour, 12);
    const period = values.period === 'PM' ? 'PM' : 'AM';
    hour24 = combineHour24(hour12, period);
  }
  return new CalendarDateTimeCtor(date.year, date.month, date.day, hour24, minute);
}