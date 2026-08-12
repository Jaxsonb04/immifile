"use strict";

import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";
const root = tv({
  base: 'gap-1.5'
});

/**
 * Calendar trigger icon slot — default surface behind the icon in the suffix.
 */
const triggerIndicator = tv({
  base: 'p-2 rounded-2xl bg-muted/10'
});

/**
 * Select overlay backdrop behind portaled calendar content (dialog, bottom sheet, popover).
 */
const overlay = tv({
  base: 'bg-backdrop'
});
export const dateFieldClassNames = combineStyles({
  root,
  triggerIndicator,
  overlay
});