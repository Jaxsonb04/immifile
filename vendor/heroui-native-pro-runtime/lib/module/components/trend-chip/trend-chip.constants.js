"use strict";

/**
 * Display name constants for the TrendChip compound component parts.
 */
export const DISPLAY_NAME = {
  ROOT: 'HeroUINative.TrendChip.Root',
  INDICATOR: 'HeroUINative.TrendChip.Indicator',
  VALUE: 'HeroUINative.TrendChip.Value',
  PREFIX: 'HeroUINative.TrendChip.Prefix',
  SUFFIX: 'HeroUINative.TrendChip.Suffix'
};

/** Default trend direction when the `trend` prop is not provided. */
export const DEFAULT_TREND = 'up';

/** Default visual variant when the `variant` prop is not provided. */
export const DEFAULT_VARIANT = 'soft';

/** Default size when the `size` prop is not provided. */
export const DEFAULT_SIZE = 'sm';

/**
 * Maps a {@link TrendDirection} to the semantic `Chip` color that visually
 * communicates the trend (up -> success, neutral -> warning, down -> danger).
 */
export const TREND_TO_CHIP_COLOR_MAP = {
  up: 'success',
  neutral: 'warning',
  down: 'danger'
};

/**
 * Maps a {@link TrendChipSize} to the indicator icon size (in pixels).
 * Matches the `data-[size=*]` width/height classes defined on the indicator
 * wrapper in `trend-chip.styles.ts` so the SVG renders inside its wrapper
 * without overflow or inner whitespace.
 */
export const INDICATOR_SIZE_MAP = {
  sm: 14,
  md: 16,
  lg: 20
};