"use strict";

/**
 * Display name constants for the `AreaChart` compound component parts.
 */
export const DISPLAY_NAME = {
  ROOT: 'HeroUINative.AreaChart.Root',
  AREA: 'HeroUINative.AreaChart.Area',
  STACKED_AREA: 'HeroUINative.AreaChart.StackedArea',
  AREA_RANGE: 'HeroUINative.AreaChart.AreaRange'
};

/**
 * Default Uniwind `colorClassName` resolved to the theme accent color for area fills.
 */
export const DEFAULT_AREA_COLOR_CLASSNAME = 'accent-chart-3';

/**
 * Default fill opacity for {@link AreaChart.Area} when the consumer does not pass `opacity`.
 *
 * @default 0.2
 */
export const DEFAULT_AREA_OPACITY = 0.2;