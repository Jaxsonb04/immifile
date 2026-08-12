"use strict";

/**
 * Display names for the {@link ChartCrosshair} compound API (Skia root + RN anchor / value parts).
 */
export const DISPLAY_NAME = {
  ANCHOR: 'HeroUINative.ChartCrosshair.Anchor',
  ROOT: 'HeroUINative.ChartCrosshair',
  VALUE: 'HeroUINative.ChartCrosshair.Value',
  VALUE_LABEL: 'HeroUINative.ChartCrosshair.ValueLabel'
};

/**
 * Default stroke width for {@link ChartCrosshair} vertical rule, in logical pixels.
 *
 * @default 1
 */
export const DEFAULT_CROSSHAIR_STROKE_WIDTH = 1;

/**
 * Default Skia `DashPathEffect` intervals for {@link ChartCrosshair} when `variant="dashed"`.
 *
 * `[dashLength, gapLength]` — a tight 4-on / 4-off pattern reads as a crisp hover guide at
 * typical chart sizes.
 */
export const DEFAULT_CROSSHAIR_DASH_INTERVALS = [4, 4];