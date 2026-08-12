"use strict";

import { StyleSheet } from 'react-native';
import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";
const root = tv({
  base: 'flex-row items-center gap-2 bg-default rounded-3xl p-0.5',
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

/**
 * To completely disable animated styles and apply your own via className or style prop,
 * set `isAnimatedStyleActive={false}` on `NumberStepper.DecrementButton` / `NumberStepper.IncrementButton`.
 */
const button = tv({
  base: 'items-center justify-center rounded-3xl p-2.5 bg-field shadow-field',
  variants: {
    isDisabled: {
      true: 'disabled:opacity-disabled',
      false: ''
    }
  },
  defaultVariants: {
    isDisabled: false
  }
});
const value = tv({
  base: 'text-foreground font-medium text-base text-center min-w-[24px]'
});
export const numberStepperClassNames = combineStyles({
  root,
  button,
  value
});
export const numberStepperStyleSheet = StyleSheet.create({
  button: {
    borderCurve: 'continuous'
  },
  value: {
    fontVariant: ['tabular-nums']
  }
});