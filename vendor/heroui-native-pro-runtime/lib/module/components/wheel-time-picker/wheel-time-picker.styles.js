"use strict";

import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";

/**
 * Root style definition for {@link WheelTimePicker} — the group container.
 * The indicator, mask, and period column own their own styling via the
 * corresponding subcomponents / underlying primitives.
 */
const root = tv({
  base: ''
});

/**
 * Hour column style. The `itemLabel` slot keeps the numerals tabular so digits
 * occupy a constant width while scrolling.
 */
const hour = tv({
  slots: {
    itemLabel: 'tabular-nums'
  }
});

/**
 * Minute column style. The `itemLabel` slot keeps the numerals tabular so
 * digits occupy a constant width while scrolling.
 */
const minute = tv({
  slots: {
    itemLabel: 'tabular-nums'
  }
});

/**
 * Combined class name definitions for every {@link WheelTimePicker} part.
 */
export const wheelTimePickerClassNames = combineStyles({
  root,
  hour,
  minute
});

/** Slot type for the {@link WheelTimePicker.Hour} style definition. */

/** Slot type for the {@link WheelTimePicker.Minute} style definition. */