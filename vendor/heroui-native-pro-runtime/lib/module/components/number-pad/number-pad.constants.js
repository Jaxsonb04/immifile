"use strict";

/**
 * Display name constants for the NumberPad compound component parts.
 */
export const DISPLAY_NAME = {
  ROOT: 'HeroUINative.NumberPad.Root',
  ROW: 'HeroUINative.NumberPad.Row',
  KEY: 'HeroUINative.NumberPad.Key',
  KEY_LABEL: 'HeroUINative.NumberPad.KeyLabel',
  BACKSPACE: 'HeroUINative.NumberPad.Backspace',
  SPACER: 'HeroUINative.NumberPad.Spacer'
};

/**
 * Default 3×4 phone-style number pad layout, grouped by row.
 * Row 4: spacer | 0 | backspace.
 */
export const DEFAULT_ROWS = [[{
  type: 'key',
  value: '1'
}, {
  type: 'key',
  value: '2'
}, {
  type: 'key',
  value: '3'
}], [{
  type: 'key',
  value: '4'
}, {
  type: 'key',
  value: '5'
}, {
  type: 'key',
  value: '6'
}], [{
  type: 'key',
  value: '7'
}, {
  type: 'key',
  value: '8'
}, {
  type: 'key',
  value: '9'
}], [{
  type: 'spacer'
}, {
  type: 'key',
  value: '0'
}, {
  type: 'backspace'
}]];

/** Default scale applied when a key is pressed. */
export const DEFAULT_KEY_SCALE = 0.97;

/** Default timing duration for key press animation in milliseconds. */
export const DEFAULT_KEY_ANIMATION_DURATION = 150;

/** Hit slop applied to interactive keys for accessible touch targets. */
export const KEY_HIT_SLOP = 6;