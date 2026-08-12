"use strict";

import { StyleSheet } from 'react-native';
import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";
const root = tv({
  base: '',
  variants: {
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col'
    },
    isDetached: {
      true: 'gap-2',
      false: 'rounded-3xl overflow-hidden'
    },
    fullWidth: {
      true: 'w-full',
      false: ''
    },
    isDisabled: {
      true: 'opacity-disabled',
      false: ''
    }
  },
  defaultVariants: {
    orientation: 'horizontal',
    fullWidth: false,
    isDisabled: false
  }
});
export const toggleButtonGroupClassNames = combineStyles({
  root
});
export const toggleButtonGroupStyleSheet = StyleSheet.create({
  root: {
    borderCurve: 'continuous'
  }
});