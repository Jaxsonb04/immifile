"use strict";

/**
 * Display name constants for the SlideButton compound component parts.
 */
export const DISPLAY_NAME = {
  ROOT: 'HeroUINative.SlideButton.Root',
  UNDERLAY_CONTENT: 'HeroUINative.SlideButton.UnderlayContent',
  OVERLAY_CONTENT: 'HeroUINative.SlideButton.OverlayContent',
  THUMB: 'HeroUINative.SlideButton.Thumb',
  LABEL: 'HeroUINative.SlideButton.Label'
};

/** Default progress threshold at which slide completion triggers. */
export const DEFAULT_COMPLETION_THRESHOLD = 0.85;

/** Default delay before auto-reset in milliseconds. */
export const DEFAULT_AUTO_RESET_DELAY = 1000;

/** Default spring configuration for the reset animation. */
export const DEFAULT_RESET_SPRING_CONFIG = {
  damping: 120,
  stiffness: 900,
  mass: 4
};