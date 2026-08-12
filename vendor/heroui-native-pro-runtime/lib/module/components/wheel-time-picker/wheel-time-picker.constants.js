"use strict";

/**
 * Display name constants for the WheelTimePicker compound component parts.
 */
export const DISPLAY_NAME = {
  ROOT: 'HeroUINative.WheelTimePicker.Root',
  HOUR: 'HeroUINative.WheelTimePicker.Hour',
  MINUTE: 'HeroUINative.WheelTimePicker.Minute',
  PERIOD: 'HeroUINative.WheelTimePicker.Period',
  INDICATOR: 'HeroUINative.WheelTimePicker.Indicator',
  MASK: 'HeroUINative.WheelTimePicker.Mask'
};

/**
 * Stable `name` keys for the wheel columns inside the underlying group.
 */
export const COLUMN_NAME = {
  HOUR: 'hour',
  MINUTE: 'minute',
  PERIOD: 'period'
};

/**
 * Default hour display mode.
 */
export const DEFAULT_HOUR_FORMAT = 12;

/**
 * Default step between consecutive minute options.
 */
export const DEFAULT_MINUTE_INTERVAL = 1;

/**
 * Number of minutes in an hour. Used to bound the minute column.
 */
export const MINUTES_PER_HOUR = 60;

/**
 * Number of hours displayed in 12-hour mode.
 */
export const HOURS_IN_12H = 12;

/**
 * Number of hours displayed in 24-hour mode.
 */
export const HOURS_IN_24H = 24;