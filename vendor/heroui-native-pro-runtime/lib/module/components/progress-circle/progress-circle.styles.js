"use strict";

import { StyleSheet } from 'react-native';
import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";

/**
 * Root style definition.
 * Centers the indicator and optional value label.
 */
const root = tv({
  base: 'items-center justify-center',
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
 * ValueLabel style definition.
 * Absolutely centered text on top of the circle indicator.
 */
const valueLabel = tv({
  base: 'absolute text-foreground font-medium',
  variants: {
    size: {
      sm: 'text-[6px]',
      md: 'text-[8px]',
      lg: 'text-[10px]'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});
export const progressCircleClassNames = combineStyles({
  root,
  valueLabel
});
export const progressCircleStyleSheet = StyleSheet.create({
  valueLabel: {
    fontVariant: ['tabular-nums']
  }
});