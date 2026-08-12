"use strict";

import { StyleSheet } from 'react-native';
import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";
const root = tv({
  base: 'items-center justify-center rounded-2xl outline outline-background',
  variants: {
    size: {
      sm: 'min-h-3.5 min-w-3.5 px-1',
      md: 'min-h-4.5 min-w-4.5 px-1',
      lg: 'min-h-5.5 min-w-5.5 px-1.5'
    },
    color: {
      default: '',
      accent: '',
      success: '',
      warning: '',
      danger: ''
    },
    variant: {
      primary: '',
      secondary: 'bg-default',
      soft: ''
    },
    placement: {
      'top-right': 'absolute top-0 right-0 translate-x-1/6 -translate-y-1/6',
      'top-left': 'absolute top-0 left-0 -translate-x-1/6 -translate-y-1/6',
      'bottom-right': 'absolute bottom-0 right-0 translate-x-1/6 translate-y-1/6',
      'bottom-left': 'absolute bottom-0 left-0 -translate-x-1/6 translate-y-1/6'
    },
    isDot: {
      true: 'px-0',
      false: ''
    }
  },
  compoundVariants: [
  // Primary + color
  {
    variant: 'primary',
    color: 'default',
    className: 'bg-default'
  }, {
    variant: 'primary',
    color: 'accent',
    className: 'bg-accent'
  }, {
    variant: 'primary',
    color: 'success',
    className: 'bg-success'
  }, {
    variant: 'primary',
    color: 'warning',
    className: 'bg-warning'
  }, {
    variant: 'primary',
    color: 'danger',
    className: 'bg-danger'
  },
  // Soft + color
  {
    variant: 'soft',
    color: 'default',
    className: 'bg-default'
  }, {
    variant: 'soft',
    color: 'accent',
    className: 'bg-accent-soft'
  }, {
    variant: 'soft',
    color: 'success',
    className: 'bg-success-soft'
  }, {
    variant: 'soft',
    color: 'warning',
    className: 'bg-warning-soft'
  }, {
    variant: 'soft',
    color: 'danger',
    className: 'bg-danger-soft'
  }],
  defaultVariants: {
    size: 'md',
    color: 'default',
    variant: 'primary',
    placement: 'top-right',
    isDot: false
  }
});
const label = tv({
  base: 'font-medium',
  variants: {
    size: {
      sm: 'text-[10px]',
      md: 'text-xs',
      lg: 'text-sm'
    },
    color: {
      default: '',
      accent: '',
      success: '',
      warning: '',
      danger: ''
    },
    variant: {
      primary: '',
      secondary: '',
      soft: ''
    }
  },
  compoundVariants: [
  // Primary + color -> foreground text
  {
    variant: 'primary',
    color: 'default',
    className: 'text-default-foreground'
  }, {
    variant: 'primary',
    color: 'accent',
    className: 'text-accent-foreground'
  }, {
    variant: 'primary',
    color: 'success',
    className: 'text-success-foreground'
  }, {
    variant: 'primary',
    color: 'warning',
    className: 'text-warning-foreground'
  }, {
    variant: 'primary',
    color: 'danger',
    className: 'text-danger-foreground'
  },
  // Secondary + color -> colored text on default bg
  {
    variant: 'secondary',
    color: 'default',
    className: 'text-default-foreground'
  }, {
    variant: 'secondary',
    color: 'accent',
    className: 'text-accent-soft-foreground'
  }, {
    variant: 'secondary',
    color: 'success',
    className: 'text-success-soft-foreground'
  }, {
    variant: 'secondary',
    color: 'warning',
    className: 'text-warning-soft-foreground'
  }, {
    variant: 'secondary',
    color: 'danger',
    className: 'text-danger-soft-foreground'
  },
  // Soft + color -> colored text on soft bg
  {
    variant: 'soft',
    color: 'default',
    className: 'text-default-foreground'
  }, {
    variant: 'soft',
    color: 'accent',
    className: 'text-accent-soft-foreground'
  }, {
    variant: 'soft',
    color: 'success',
    className: 'text-success-soft-foreground'
  }, {
    variant: 'soft',
    color: 'warning',
    className: 'text-warning-soft-foreground'
  }, {
    variant: 'soft',
    color: 'danger',
    className: 'text-danger-soft-foreground'
  }],
  defaultVariants: {
    size: 'md',
    color: 'default',
    variant: 'primary'
  }
});
export const badgeClassNames = combineStyles({
  root,
  label
});
export const badgeStyleSheet = StyleSheet.create({
  root: {
    borderCurve: 'continuous'
  }
});