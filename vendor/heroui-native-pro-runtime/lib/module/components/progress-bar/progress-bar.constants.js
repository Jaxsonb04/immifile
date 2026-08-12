"use strict";

import { Easing } from 'react-native-reanimated';
/**
 * Display name constants for the ProgressBar compound component parts.
 */
export const DISPLAY_NAME = {
  ROOT: 'HeroUINative.ProgressBar.Root',
  TRACK: 'HeroUINative.ProgressBar.Track',
  FILL: 'HeroUINative.ProgressBar.Fill',
  LABEL: 'HeroUINative.ProgressBar.Label',
  VALUE_LABEL: 'HeroUINative.ProgressBar.ValueLabel'
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

/** Default duration for the determinate fill width transition. */
export const DEFAULT_FILL_TIMING_DURATION = 300;

/** Default duration for the indeterminate sweep animation. */
export const DEFAULT_INDETERMINATE_TIMING_DURATION = 1500;

/** Default easing for the indeterminate sweep animation. */
export const DEFAULT_INDETERMINATE_EASING = Easing.bezier(0.65, 0, 0.35, 1);

/** Width ratio of the indeterminate fill relative to the track. */
export const INDETERMINATE_FILL_WIDTH_RATIO = 0.4;