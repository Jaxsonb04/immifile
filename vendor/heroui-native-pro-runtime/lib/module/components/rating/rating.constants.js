"use strict";

/**
 * Display name constants for the Rating compound component parts.
 */
export const DISPLAY_NAME = {
  ROOT: 'HeroUINative.Rating.Root',
  ITEM: 'HeroUINative.Rating.Item'
};

/** Default size when the `size` prop is not provided. */
export const DEFAULT_SIZE = 'md';

/** Default maximum rating value when `maxValue` is not provided. */
export const DEFAULT_MAX_VALUE = 5;

/**
 * Maps a {@link RatingSize} to the intrinsic icon size (in pixels). The
 * size is forwarded to the icon element so the default star — and any
 * custom icon that honours `size` — scales with the rating variant.
 */
export const ICON_SIZE_MAP = {
  sm: 16,
  md: 24,
  lg: 32
};

/**
 * Hit slop around each item pressable, by size. Keeps small ratings
 * comfortably tappable without visibly enlarging the touch target.
 */
export const HIT_SLOP_MAP = {
  sm: 4,
  md: 2,
  lg: 0
};