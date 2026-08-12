"use strict";

import { StyleSheet } from 'react-native';
import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";

/**
 * Root style definition. Outer viewport that lays out wheel columns
 * horizontally and clips the absolute overlays (indicator / mask) to its
 * bounds.
 */
const root = tv({
  base: 'flex-row overflow-hidden',
  variants: {
    isDisabled: {
      true: 'opacity-disabled pointer-events-none',
      false: ''
    }
  },
  defaultVariants: {
    isDisabled: false
  }
});

/**
 * Indicator style definition.
 *
 * Slots:
 * - `wrapper` — absolutely-positioned band centered on the group viewport.
 * - `highlight` — filled rectangle rendered inside the wrapper.
 */
const indicator = tv({
  slots: {
    wrapper: 'absolute left-0 right-0 justify-center -z-1',
    highlight: 'flex-1 rounded-2xl bg-default'
  }
});

/**
 * Mask style definition.
 *
 * Slots:
 * - `top` — top fade overlay.
 * - `bottom` — bottom fade overlay.
 */
const mask = tv({
  slots: {
    top: 'absolute left-0 right-0 top-0',
    bottom: 'absolute left-0 right-0 bottom-0'
  }
});

/**
 * Combined `tailwind-variants` slots for the wheel picker group root,
 * indicator, and mask.
 */
export const wheelPickerGroupClassNames = combineStyles({
  root,
  indicator,
  mask
});
export const styleSheet = StyleSheet.create({
  indicatorHighlight: {
    borderCurve: 'continuous'
  }
});

/** Slot type for the indicator style definition. */

/** Slot type for the mask style definition. */