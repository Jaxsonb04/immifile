"use strict";

/**
 * Display name constants for the `BarChart` compound component parts.
 */
export const DISPLAY_NAME = {
  ROOT: 'HeroUINative.BarChart.Root',
  BAR: 'HeroUINative.BarChart.Bar',
  BAR_GROUP: 'HeroUINative.BarChart.BarGroup',
  BAR_GROUP_ITEM: 'HeroUINative.BarChart.BarGroupItem',
  STACKED_BAR: 'HeroUINative.BarChart.StackedBar'
};

/**
 * Default Uniwind `colorClassName` for single-series and grouped bar fills.
 */
export const DEFAULT_BAR_COLOR_CLASSNAME = 'accent-chart-3';

/**
 * Default `domainPadding` for the {@link BarChart} root (applied before `...cartesianProps` so a
 * caller-supplied `domainPadding` replaces this object in full).
 */
export const DEFAULT_BAR_CHART_DOMAIN_PADDING = {
  bottom: 8,
  left: 12,
  right: 12,
  top: 8
};

/**
 * Default rounded top corners for {@link BarChart.Bar} when the caller omits `roundedCorners`.
 */
export const DEFAULT_BAR_ROUNDED_CORNERS = {
  topLeft: 4,
  topRight: 4
};