"use strict";

import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";
const root = tv({
  base: '',
  variants: {
    variant: {
      default: '',
      ghost: ''
    },
    isSelected: {
      true: 'bg-accent-soft',
      false: ''
    },
    inAttachedGroup: {
      true: 'rounded-none',
      false: ''
    },
    inGroup: {
      true: '',
      false: ''
    },
    groupFullWidth: {
      true: '',
      false: ''
    }
  },
  compoundVariants: [{
    variant: 'default',
    isSelected: false,
    className: 'bg-default'
  }, {
    variant: 'ghost',
    isSelected: false,
    className: 'bg-transparent'
  }, {
    inGroup: true,
    groupFullWidth: true,
    className: 'flex-1'
  }],
  defaultVariants: {
    variant: 'default',
    isSelected: false,
    inAttachedGroup: false,
    inGroup: false,
    groupFullWidth: false
  }
});
const label = tv({
  base: 'text-sm font-medium',
  variants: {
    isSelected: {
      true: 'text-accent-soft-foreground',
      false: 'text-foreground'
    }
  },
  defaultVariants: {
    isSelected: false
  }
});
export const toggleButtonClassNames = combineStyles({
  root,
  label
});