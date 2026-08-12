"use strict";

/**
 * Display names for each compound part, consumed by `displayName` assignments.
 */
export const DISPLAY_NAME = {
  ROOT: 'HeroUINative.DateTimePicker.Root',
  SELECT: 'HeroUINative.DateTimePicker.Select',
  PORTAL: 'HeroUINative.DateTimePicker.Portal',
  OVERLAY: 'HeroUINative.DateTimePicker.Overlay',
  CONTENT: 'HeroUINative.DateTimePicker.Content',
  WHEEL: 'HeroUINative.DateTimePicker.Wheel',
  WHEEL_DATE: 'HeroUINative.DateTimePicker.WheelDate',
  WHEEL_HOUR: 'HeroUINative.DateTimePicker.WheelHour',
  WHEEL_MINUTE: 'HeroUINative.DateTimePicker.WheelMinute',
  WHEEL_PERIOD: 'HeroUINative.DateTimePicker.WheelPeriod',
  WHEEL_INDICATOR: 'HeroUINative.DateTimePicker.WheelIndicator',
  WHEEL_MASK: 'HeroUINative.DateTimePicker.WheelMask',
  TRIGGER: 'HeroUINative.DateTimePicker.Trigger',
  VALUE: 'HeroUINative.DateTimePicker.Value',
  TRIGGER_INDICATOR: 'HeroUINative.DateTimePicker.TriggerIndicator'
};

/**
 * Default hour display mode for the wrapper and forwarded wheel.
 */
export const DEFAULT_HOUR_FORMAT = 12;

/**
 * Default step between consecutive minute options.
 */
export const DEFAULT_MINUTE_INTERVAL = 1;

/**
 * Default preset used to build the trigger label.
 */
export const DEFAULT_DATE_TIME_DISPLAY_FORMAT = 'short';