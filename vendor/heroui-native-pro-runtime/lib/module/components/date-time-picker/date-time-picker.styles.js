"use strict";

import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";

/**
 * Root field container; spaces the label, trigger, and helper text.
 */
const root = tv({
  base: 'gap-1.5'
});

/**
 * Trigger border: fixed 1.5px width so layout does not shift between valid and invalid.
 * Invalid state uses semantic danger border (pairs with `FormField` / `isInvalid` on `DateTimePicker.Trigger`).
 */
const trigger = tv({
  base: 'border-[1.5px] border-transparent',
  variants: {
    isInvalid: {
      true: 'border-danger',
      false: ''
    }
  },
  defaultVariants: {
    isInvalid: false
  }
});

/**
 * Select overlay backdrop behind portaled content (dialog, bottom sheet, popover).
 */
const overlay = tv({
  base: 'bg-backdrop'
});

/**
 * Wheel sizing inside the overlay surface: full width up to a 320px cap (wider
 * than the time picker to fit the date column), centered within the
 * `Select.Content` padding.
 */
const wheel = tv({
  base: 'w-full max-w-[320px] self-center'
});

/**
 * Combined class names for the `DateTimePicker` parts.
 */
export const dateTimePickerClassNames = combineStyles({
  root,
  trigger,
  overlay,
  wheel
});