"use strict";

/**
 * Display name constants for the `ComposedChart` compound component parts.
 */
export const DISPLAY_NAME = {
  ROOT: 'HeroUINative.ComposedChart.Root'
};

/**
 * Default `domainPadding` for the {@link ComposedChart} root (applied before `...cartesianProps` so a
 * caller-supplied `domainPadding` replaces this object in full).
 *
 * Bar-friendly horizontal inset prevents the first/last column from clipping at the plot edge when
 * mixing bar series with line or area overlays.
 */
export const DEFAULT_COMPOSED_CHART_DOMAIN_PADDING = {
  bottom: 8,
  left: 12,
  right: 12,
  top: 8
};