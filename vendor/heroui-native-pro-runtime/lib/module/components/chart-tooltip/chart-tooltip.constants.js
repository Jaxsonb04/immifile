"use strict";

/**
 * Display name constants for the {@link ChartTooltip} compound component parts.
 */
export const DISPLAY_NAME = {
  ANCHOR: 'HeroUINative.ChartTooltip.Anchor',
  ROOT: 'HeroUINative.ChartTooltip',
  HEADER: 'HeroUINative.ChartTooltip.Header',
  ITEM: 'HeroUINative.ChartTooltip.Item',
  INDICATOR: 'HeroUINative.ChartTooltip.Indicator',
  LABEL: 'HeroUINative.ChartTooltip.Label',
  VALUE: 'HeroUINative.ChartTooltip.Value'
};

/**
 * Default gap in logical pixels between the press indicator and {@link ChartTooltip}.
 */
export const DEFAULT_TOOLTIP_GAP = 12;

/**
 * Default vertical placement for {@link ChartTooltip}.
 */
export const DEFAULT_PLACEMENT = 'top';

/**
 * Default indicator variant for {@link ChartTooltip.Indicator}.
 */
export const DEFAULT_INDICATOR_VARIANT = 'dot';

/**
 * Default visibility mode for {@link ChartTooltip}.
 *
 * `'auto'` fades with press activity from {@link ChartTooltip.Anchor}.
 */
export const DEFAULT_IS_VISIBLE = 'auto';

/**
 * Default fade duration (ms) when {@link ChartTooltip} tracks press activity.
 */
export const DEFAULT_FADE_DURATION_MS = 150;

/**
 * Default motion animation for {@link ChartTooltip} position tracking.
 *
 * `withSpring` with no config (Reanimated defaults). Callers override the `type`
 * and config fields via the `animation` prop on {@link ChartTooltip}.
 */
export const DEFAULT_MOTION_ANIMATION = {
  type: 'spring'
};