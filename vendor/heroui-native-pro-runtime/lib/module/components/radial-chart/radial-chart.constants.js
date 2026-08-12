"use strict";

/**
 * Display name constants for the `RadialChart` compound component parts.
 */
export const DISPLAY_NAME = {
  ROOT: 'HeroUINative.RadialChart.Root',
  BAR: 'HeroUINative.RadialChart.Bar'
};

/**
 * Default angle-axis domain — `"auto"` resolves the upper bound from the data.
 */
export const DEFAULT_DOMAIN = [0, 'auto'];

/**
 * Default start angle in degrees (clockwise from 12 o'clock).
 * Matches the web `RadialChart` default of `90`.
 */
export const DEFAULT_START_ANGLE = 90;

/**
 * Default end angle in degrees (clockwise from 12 o'clock). With `startAngle=90`, a sweep of
 * `360°` clockwise produces a full ring track.
 */
export const DEFAULT_END_ANGLE = -270;

/**
 * Default inner radius of the bar area as a percentage of the chart's outer radius.
 */
export const DEFAULT_INNER_RADIUS = '40%';

/**
 * Default outer radius of the bar area as a percentage of the chart's outer radius.
 */
export const DEFAULT_OUTER_RADIUS = '100%';

/**
 * Default bar thickness in pixels (stroke width of each concentric ring).
 */
export const DEFAULT_BAR_SIZE = 10;

/**
 * Default gap in pixels between adjacent concentric rings.
 */
export const DEFAULT_BAR_GAP = 4;

/**
 * Default corner radius for rounded bar caps. Values `> 0` enable round stroke caps.
 */
export const DEFAULT_CORNER_RADIUS = 12;

/**
 * Fraction of `min(canvasWidth, canvasHeight) / 2` used as the chart's maximum radius
 * before applying `innerRadius` / `outerRadius` percentage offsets.
 */
export const DEFAULT_RADIUS_PADDING = 1;