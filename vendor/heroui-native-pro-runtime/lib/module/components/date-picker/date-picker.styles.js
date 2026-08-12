"use strict";

import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";
const root = tv({
  base: 'gap-1.5'
});

/**
 * Trigger border: fixed 1.5px width so layout does not shift between valid and invalid.
 * Invalid state uses semantic danger border (pairs with `FormField` / `isInvalid` on `DatePicker.Trigger`).
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
export const datePickerClassNames = combineStyles({
  root,
  trigger,
  overlay
});