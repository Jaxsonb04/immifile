"use strict";

/**
 * Display name constants for the WheelDateTimePicker compound component parts.
 */
export const DISPLAY_NAME = {
  ROOT: 'HeroUINative.WheelDateTimePicker.Root',
  DATE: 'HeroUINative.WheelDateTimePicker.Date',
  HOUR: 'HeroUINative.WheelDateTimePicker.Hour',
  MINUTE: 'HeroUINative.WheelDateTimePicker.Minute',
  PERIOD: 'HeroUINative.WheelDateTimePicker.Period',
  INDICATOR: 'HeroUINative.WheelDateTimePicker.Indicator',
  MASK: 'HeroUINative.WheelDateTimePicker.Mask'
};

/**
 * Stable `name` keys for the wheel columns inside the underlying group.
 */
export const COLUMN_NAME = {
  DATE: 'date',
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
 * Number of years the default date range spans forward from today when no
 * explicit `maxValue` is provided.
 */
export const DEFAULT_DATE_RANGE_YEARS = 1;