"use strict";

/**
 * Display name constants for the `LineChart` compound component parts.
 */
export const DISPLAY_NAME = {
  ROOT: 'HeroUINative.LineChart.Root',
  LINE: 'HeroUINative.LineChart.Line',
  ANIMATED_LINE: 'HeroUINative.LineChart.AnimatedLine'
};

/**
 * Default stroke width for {@link LineChart.Line} in logical pixels.
 */
export const DEFAULT_LINE_STROKE_WIDTH = 2;

/**
 * Default Uniwind `colorClassName` resolved to the theme accent color for line strokes.
 */
export const DEFAULT_LINE_COLOR_CLASSNAME = 'accent-chart-3';

/**
 * Default draw-on animation config for {@link LineChart.AnimatedLine}.
 *
 * A 700ms timing sweep (Reanimated's default easing) reads as a crisp stroke-drawing reveal;
 * callers override via the `animation` prop when they want a slower, springy, or custom-eased
 * variant.
 */
export const DEFAULT_ANIMATED_LINE_DRAW_ANIMATION = {
  type: 'timing',
  duration: 700
};

/**
 * Default `[from, to]` sweep range for {@link LineChart.AnimatedLine}.
 *
 * `0 → 1` maps the Skia `Path.end` trim from "nothing drawn" to "fully drawn", producing the
 * classic stroke-on entrance. Callers override via `animation.progress` for partial reveals or
 * inverted fade-outs (e.g. `[1, 0]`).
 */
export const DEFAULT_ANIMATED_LINE_PROGRESS = [0, 1];