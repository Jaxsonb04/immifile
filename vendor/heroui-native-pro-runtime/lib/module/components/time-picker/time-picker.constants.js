"use strict";

/**
 * Display names for each compound part, consumed by `displayName` assignments.
 */
export const DISPLAY_NAME = {
  ROOT: 'HeroUINative.TimePicker.Root',
  SELECT: 'HeroUINative.TimePicker.Select',
  PORTAL: 'HeroUINative.TimePicker.Portal',
  OVERLAY: 'HeroUINative.TimePicker.Overlay',
  CONTENT: 'HeroUINative.TimePicker.Content',
  WHEEL: 'HeroUINative.TimePicker.Wheel',
  WHEEL_HOUR: 'HeroUINative.TimePicker.WheelHour',
  WHEEL_MINUTE: 'HeroUINative.TimePicker.WheelMinute',
  WHEEL_PERIOD: 'HeroUINative.TimePicker.WheelPeriod',
  WHEEL_INDICATOR: 'HeroUINative.TimePicker.WheelIndicator',
  WHEEL_MASK: 'HeroUINative.TimePicker.WheelMask',
  TRIGGER: 'HeroUINative.TimePicker.Trigger',
  VALUE: 'HeroUINative.TimePicker.Value',
  TRIGGER_INDICATOR: 'HeroUINative.TimePicker.TriggerIndicator'
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
export const DEFAULT_TIME_DISPLAY_FORMAT = 'short';