"use strict";

import { DEFAULT_ITEM_HEIGHT, DEFAULT_VISIBLE_COUNT } from "../wheel-picker/wheel-picker.constants.js";

/**
 * Display name constants for the WheelPickerGroup compound component parts.
 */
export const DISPLAY_NAME = {
  ROOT: 'HeroUINative.WheelPickerGroup.Root',
  INDICATOR: 'HeroUINative.WheelPickerGroup.Indicator',
  MASK: 'HeroUINative.WheelPickerGroup.Mask'
};

/**
 * Default row height for the group's wheels. Re-exported from
 * `WheelPicker` so both stay in sync.
 */
export const GROUP_DEFAULT_ITEM_HEIGHT = DEFAULT_ITEM_HEIGHT;

/**
 * Default visible row count for the group's wheels. Re-exported from
 * `WheelPicker` so both stay in sync.
 */
export const GROUP_DEFAULT_VISIBLE_COUNT = DEFAULT_VISIBLE_COUNT;