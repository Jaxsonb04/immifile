"use strict";

const PRIMARY_INDICATOR_COLOR_CLASS_NAME = {
  accent: 'accent-accent-foreground',
  default: 'accent-default-foreground',
  success: 'accent-success-foreground',
  warning: 'accent-warning-foreground',
  danger: 'accent-danger-foreground'
};
const SOFT_INDICATOR_COLOR_CLASS_NAME = {
  accent: 'accent-accent-soft-foreground',
  default: 'accent-default-soft-foreground',
  success: 'accent-success-soft-foreground',
  warning: 'accent-warning-soft-foreground',
  danger: 'accent-danger-soft-foreground'
};
export const getIndicatorColorClassName = (variant, color) => {
  if (variant === 'primary') {
    return PRIMARY_INDICATOR_COLOR_CLASS_NAME[color];
  }
  return SOFT_INDICATOR_COLOR_CLASS_NAME[color];
};