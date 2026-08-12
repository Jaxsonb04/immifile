"use strict";

import InternationalizedDatePackage from "../../optional/internationalized-date.js";
import { HOURS_IN_12H, HOURS_IN_24H, MINUTES_PER_HOUR } from "./wheel-time-picker.constants.js";
const {
  Time: TimeCtor
} = InternationalizedDatePackage ?? {};

/**
 * Clamps and normalizes a minute step into a positive integer in `[1, 59]`.
 * Falls back to `1` for invalid input so the minute column is never empty.
 */
export function normalizeMinuteInterval(minuteInterval) {
  if (!Number.isFinite(minuteInterval)) {
    return 1;
  }
  const rounded = Math.floor(minuteInterval);
  if (rounded < 1) {
    return 1;
  }
  if (rounded > MINUTES_PER_HOUR - 1) {
    return MINUTES_PER_HOUR - 1;
  }
  return rounded;
}

/**
 * Snaps a raw minute value to the nearest multiple of `minuteInterval`,
 * clamped to the last representable option so it always maps to a row.
 */
export function snapMinute(minute, minuteInterval) {
  const interval = normalizeMinuteInterval(minuteInterval);
  const snapped = Math.round(minute / interval) * interval;
  if (snapped >= MINUTES_PER_HOUR) {
    return MINUTES_PER_HOUR - interval;
  }
  if (snapped < 0) {
    return 0;
  }
  return snapped;
}

/**
 * Builds the hour column options for the requested format.
 * - 12-hour: values `1`–`12`, unpadded labels.
 * - 24-hour: values `0`–`23`, zero-padded labels.
 */
export function buildHourItems(hourFormat) {
  if (hourFormat === 24) {
    return Array.from({
      length: HOURS_IN_24H
    }, (_unused, index) => ({
      value: index,
      label: String(index).padStart(2, '0')
    }));
  }
  return Array.from({
    length: HOURS_IN_12H
  }, (_unused, index) => {
    const hour = index + 1;
    return {
      value: hour,
      label: String(hour)
    };
  });
}

/**
 * Builds the minute column options stepped by `minuteInterval`.
 * Labels are always zero-padded to two digits.
 */
export function buildMinuteItems(minuteInterval) {
  const interval = normalizeMinuteInterval(minuteInterval);
  const items = [];
  for (let minute = 0; minute < MINUTES_PER_HOUR; minute += interval) {
    items.push({
      value: minute,
      label: String(minute).padStart(2, '0')
    });
  }
  return items;
}

/**
 * Resolves a localized day-period label (e.g. "AM" / "PM", or locale
 * equivalents) for the given hour. Falls back to English on failure.
 */
function getPeriodLabel(locale, hour) {
  const fallback = hour < 12 ? 'AM' : 'PM';
  try {
    const referenceDate = new Date(2000, 0, 1, hour, 0, 0, 0);
    const parts = new Intl.DateTimeFormat(locale ?? 'en-US', {
      hour: 'numeric',
      hour12: true
    }).formatToParts(referenceDate);
    const dayPeriod = parts.find(part => part.type === 'dayPeriod');
    return dayPeriod?.value ?? fallback;
  } catch (_error) {
    return fallback;
  }
}

/**
 * Builds the AM/PM period column options. Values are canonical `"AM"` /
 * `"PM"`; labels are localized via `locale`.
 */
export function buildPeriodItems(locale) {
  return [{
    value: 'AM',
    label: getPeriodLabel(locale, 6)
  }, {
    value: 'PM',
    label: getPeriodLabel(locale, 18)
  }];
}

/**
 * Decomposes a {@link Time} into the wheel values record for the given
 * format. Minutes are snapped to the active `minuteInterval`.
 */
export function timeToWheelValues(time, hourFormat, minuteInterval) {
  const minute = snapMinute(time.minute, minuteInterval);
  if (hourFormat === 24) {
    return {
      hour: time.hour,
      minute
    };
  }
  const period = time.hour >= 12 ? 'PM' : 'AM';
  const hour12 = time.hour % 12;
  return {
    hour: hour12 === 0 ? 12 : hour12,
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
 * Reconstructs a {@link Time} from a `WheelPickerGroup` values record for
 * the given format. Unknown or missing fields default to midnight.
 */
export function wheelValuesToTime(values, hourFormat) {
  const minute = toNumber(values.minute, 0);
  if (hourFormat === 24) {
    return new TimeCtor(toNumber(values.hour, 0), minute);
  }
  const hour12 = toNumber(values.hour, 12);
  const period = values.period === 'PM' ? 'PM' : 'AM';
  let hour24;
  if (period === 'AM') {
    hour24 = hour12 === 12 ? 0 : hour12;
  } else {
    hour24 = hour12 === 12 ? 12 : hour12 + 12;
  }
  return new TimeCtor(hour24, minute);
}