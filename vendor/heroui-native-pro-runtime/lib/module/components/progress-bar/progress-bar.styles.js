"use strict";

import { StyleSheet } from 'react-native';
import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";

/**
 * Root style definition.
 * Wraps the label row and track in a vertical layout.
 */
const root = tv({
  base: 'w-full gap-2',
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
 * Label row style definition.
 * Horizontal container for the label and value label.
 */
const labelRow = tv({
  base: 'flex-row items-center justify-between'
});

/**
 * Track style definition.
 * Background container that holds the fill element.
 */
const track = tv({
  base: 'w-full rounded-md bg-default overflow-hidden',
  variants: {
    size: {
      sm: 'h-1',
      md: 'h-1.5',
      lg: 'h-2.5'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

/**
 * Fill style definition.
 * Represents the filled portion of the track.
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * - `width` - Animated for determinate fill progress
 * - `transform` (translateX) - Animated for indeterminate sweep
 *
 * To customize these properties, use the `animation` prop on `ProgressBar.Fill`.
 *
 * To completely disable animated styles and apply your own via `className` or
 * `style` prop, set `isAnimatedStyleActive={false}` on `ProgressBar.Fill`.
 */
const fill = tv({
  base: 'h-full rounded-md',
  variants: {
    color: {
      default: 'bg-default-foreground',
      accent: 'bg-accent',
      success: 'bg-success',
      warning: 'bg-warning',
      danger: 'bg-danger'
    }
  },
  defaultVariants: {
    color: 'accent'
  }
});

/**
 * Label style definition.
 * Text describing the progress operation.
 */
const label = tv({
  base: 'text-sm font-medium text-foreground'
});

/**
 * ValueLabel style definition.
 * Displays the formatted progress value.
 */
const valueLabel = tv({
  base: 'text-sm font-medium text-muted'
});
export const progressBarClassNames = combineStyles({
  root,
  labelRow,
  track,
  fill,
  label,
  valueLabel
});

/**
 * StyleSheet for native-only properties that cannot be expressed via Tailwind.
 */
export const progressBarStyleSheet = StyleSheet.create({
  track: {
    borderCurve: 'continuous'
  },
  valueLabel: {
    fontVariant: ['tabular-nums']
  }
});