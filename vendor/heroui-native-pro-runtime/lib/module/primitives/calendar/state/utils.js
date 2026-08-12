"use strict";

import InternationalizedDatePackage from "../../../optional/internationalized-date.js";
const {
  CalendarDate,
  isSameDay,
  maxDate,
  minDate,
  startOfMonth,
  startOfWeek,
  startOfYear,
  toCalendarDate
} = InternationalizedDatePackage ?? {};
export function isInvalid(date, minValue, maxValue) {
  return minValue != null && date.compare(minValue) < 0 || maxValue != null && date.compare(maxValue) > 0;
}
export function alignCenter(date, duration, locale, minValue, maxValue) {
  const halfDuration = {};
  for (const key in duration) {
    if (!Object.prototype.hasOwnProperty.call(duration, key)) {
      continue;
    }
    const k = key;
    const unit = duration[k];
    if (typeof unit !== 'number') {
      continue;
    }
    let half = Math.floor(unit / 2);
    if (half > 0 && unit % 2 === 0) {
      half--;
    }
    halfDuration[k] = half;
  }
  let aligned = alignStart(date, duration, locale, minValue, maxValue).subtract(halfDuration);
  aligned = constrainStart(date, aligned, duration, locale, minValue, maxValue);
  return aligned;
}
export function alignStart(date, duration, locale, minValue, maxValue) {
  let aligned = date;
  if (duration.years) {
    aligned = startOfYear(date);
  } else if (duration.months) {
    aligned = startOfMonth(date);
  } else if (duration.weeks) {
    aligned = startOfWeek(date, locale);
  }
  return constrainStart(date, aligned, duration, locale, minValue, maxValue);
}
export function alignEnd(date, duration, locale, minValue, maxValue) {
  const d = {
    ...duration
  };
  if (d.days) {
    d.days--;
  } else if (d.weeks) {
    d.weeks--;
  } else if (d.months) {
    d.months--;
  } else if (d.years) {
    d.years--;
  }
  let aligned = alignStart(date, duration, locale, minValue, maxValue).subtract(d);
  aligned = constrainStart(date, aligned, duration, locale, minValue, maxValue);
  return aligned;
}
export function constrainStart(date, aligned, duration, locale, minValue, maxValue) {
  let next = aligned;
  if (minValue && date.compare(minValue) >= 0) {
    const newDate = maxDate(next, alignStart(toCalendarDate(minValue), duration, locale));
    if (newDate) {
      next = newDate;
    }
  }
  if (maxValue && date.compare(maxValue) <= 0) {
    const newDate = minDate(next, alignEnd(toCalendarDate(maxValue), duration, locale));
    if (newDate) {
      next = newDate;
    }
  }
  return next;
}
export function constrainValue(date, minValue, maxValue) {
  let next = date;
  if (minValue) {
    const newDate = maxDate(next, toCalendarDate(minValue));
    if (newDate) {
      next = newDate;
    }
  }
  if (maxValue) {
    const newDate = minDate(next, toCalendarDate(maxValue));
    if (newDate) {
      next = newDate;
    }
  }
  return next;
}

/**
 * Walks backward from `date` until `isDateUnavailable` is false.
 * If `minBound` is set, stops when the previous day would be before `minBound`.
 */
export function previousAvailableDate(date, minBound, isDateUnavailable) {
  if (!isDateUnavailable) {
    return date;
  }
  let current = date;
  while (isDateUnavailable(current)) {
    const prev = current.subtract({
      days: 1
    });
    if (minBound != null && prev.compare(minBound) < 0) {
      return null;
    }
    if (isSameDay(current, prev)) {
      return null;
    }
    current = prev;
  }
  return current;
}