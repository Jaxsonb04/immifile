"use strict";

import { Easing } from 'react-native-reanimated';
/**
 * Display name constants for the ProgressCircle compound component parts.
 */
export const DISPLAY_NAME = {
  ROOT: 'HeroUINative.ProgressCircle.Root',
  INDICATOR: 'HeroUINative.ProgressCircle.Indicator',
  VALUE_LABEL: 'HeroUINative.ProgressCircle.ValueLabel'
};

/** Default size when the `size` prop is not provided. */
export const DEFAULT_SIZE = 'md';

/** Default color when the `color` prop is not provided. */
export const DEFAULT_COLOR = 'accent';

/** Default minimum value. */
export const DEFAULT_MIN_VALUE = 0;

/** Default maximum value. */
export const DEFAULT_MAX_VALUE = 100;

/** Default format options for the value display. */
export const DEFAULT_FORMAT_OPTIONS = {
  style: 'percent'
};

/** Stroke width of the track and fill circles. */
export const STROKE_WIDTH = 4;

/** Center coordinate of the SVG viewBox. */
export const CENTER = 18;

/** Radius of the circles (center minus half stroke width). */
export const RADIUS = CENTER - STROKE_WIDTH / 2;

/** Full circumference of the circle. */
export const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Maps a preset {@link ProgressCircleSize} (`"sm" | "md" | "lg"`) to its
 * rendered dimension in pixels. Custom numeric sizes bypass this map.
 */
export const SIZE_MAP = {
  sm: 24,
  md: 36,
  lg: 48
};

/** Default duration for the determinate strokeDashoffset transition. */
export const DEFAULT_FILL_TIMING_DURATION = 300;

/** Default duration for one full indeterminate spin rotation. */
export const DEFAULT_SPIN_DURATION = 1000;

/** Default easing for the indeterminate spin animation. */
export const DEFAULT_SPIN_EASING = Easing.linear;