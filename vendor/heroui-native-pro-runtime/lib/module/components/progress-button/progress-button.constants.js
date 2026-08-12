"use strict";

/**
 * Display name constants for the ProgressButton compound component parts.
 */
export const DISPLAY_NAME = {
  ROOT: 'HeroUINative.ProgressButton.Root',
  OVERLAY: 'HeroUINative.ProgressButton.Overlay',
  LABEL: 'HeroUINative.ProgressButton.Label',
  MASK_LABEL: 'HeroUINative.ProgressButton.MaskLabel'
};

/** Default duration in milliseconds the user must hold to complete. */
export const DEFAULT_HOLD_DURATION_MS = 2000;

/** Default delay before auto-reset in milliseconds. */
export const DEFAULT_AUTO_RESET_DELAY = 1000;

/** Default scale applied on press for tactile feedback. */
export const DEFAULT_PRESS_SCALE = 0.985;

/** Default duration for scale press-feedback animations. */
export const DEFAULT_SCALE_DURATION = 150;

/** Default spring configuration for progress reset and controlled-sync animations. */
export const DEFAULT_PROGRESS_SPRING_CONFIG = {
  damping: 120,
  stiffness: 900,
  mass: 4
};