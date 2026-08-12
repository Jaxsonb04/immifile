"use strict";

import { StyleSheet } from 'react-native';
import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";

/** Root grid container — vertical stack of key rows. */
const root = tv({
  base: 'flex-col gap-2 w-full',
  variants: {
    isDisabled: {
      true: 'opacity-disabled',
      false: ''
    }
  },
  defaultVariants: {
    isDisabled: false
  }
});

/** Row container — distributes its cells evenly across the width. */
const row = tv({
  base: 'flex-row items-stretch gap-1.5 w-full min-h-16'
});

/**
 * Pressable key surface.
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * - `transform` (scale) - Animated for press feedback
 *
 * To customize, use the `animation` prop on `NumberPad.Key`.
 * To disable animated styles, set `isAnimatedStyleActive={false}`.
 */
const key = tv({
  base: ['flex-1 items-center justify-center rounded-3xl bg-default', 'data-[pressed=true]:bg-default-hover', 'data-[disabled=true]:opacity-disabled', 'data-[disabled=true]:pointer-events-none']
});

/** Digit label text rendered inside a key. */
const keyLabel = tv({
  base: 'text-foreground font-semibold text-center text-3xl'
});

/** Backspace key surface — transparent background over the key base. */
const backspace = tv({
  base: 'bg-transparent'
});

/** Spacer rendered as a key (has children) — transparent background. */
const spacerActive = tv({
  base: 'bg-transparent'
});

/** Inert spacer cell occupying one grid column. */
const spacerInactive = tv({
  base: 'flex-1'
});

/** Combined Tailwind class definitions for all NumberPad parts. */
export const numberPadClassNames = combineStyles({
  root,
  row,
  key,
  keyLabel,
  backspace,
  spacerActive,
  spacerInactive
});
export const numberPadStyleSheet = StyleSheet.create({
  keyContainer: {
    borderCurve: 'continuous'
  },
  keyLabel: {
    fontVariant: ['tabular-nums']
  }
});