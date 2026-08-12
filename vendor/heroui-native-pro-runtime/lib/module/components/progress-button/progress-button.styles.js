"use strict";

import { StyleSheet } from 'react-native';
import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";

/**
 * Root style definition.
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * - `transform` (scale) - Animated for press feedback
 *
 * To customize scale behavior, use the `animation` prop on `ProgressButton`:
 * ```tsx
 * <ProgressButton
 *   animation={{
 *     scale: { value: 0.97, timingConfig: { duration: 200 } },
 *   }}
 * />
 * ```
 */
const root = tv({
  base: 'h-[56px] px-12 rounded-full items-center justify-center overflow-hidden bg-default',
  variants: {
    variant: {
      default: 'border-default-foreground',
      accent: 'border-accent',
      success: 'border-success',
      danger: 'border-danger'
    },
    isDisabled: {
      true: 'opacity-disabled',
      false: ''
    }
  },
  defaultVariants: {
    variant: 'default',
    isDisabled: false
  }
});

/**
 * Overlay style definition.
 * Sweeps from left to right via translateX with a variant-colored background.
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * - `transform` (translateX) - Animated for the left-to-right fill sweep
 */
const overlay = tv({
  base: 'absolute h-full flex-row items-center overflow-hidden',
  variants: {
    variant: {
      default: 'bg-default-foreground/5',
      accent: 'bg-accent',
      success: 'bg-success',
      danger: 'bg-danger'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

/**
 * Label style definition.
 * Base text layer always visible beneath the overlay.
 * Color matches the variant border for consistency.
 */
const label = tv({
  base: 'text-base font-medium',
  variants: {
    variant: {
      default: 'text-default-foreground',
      accent: 'text-accent-soft-foreground',
      success: 'text-success-soft-foreground',
      danger: 'text-danger-soft-foreground'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

/**
 * MaskLabel style definition.
 * Inverted-color text inside the overlay for the color-wipe effect.
 * Colors contrast with the overlay background.
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * - `transform` (translateX) - Animated for counter-translation alignment with base Label
 */
const maskLabel = tv({
  base: 'text-base font-medium',
  variants: {
    variant: {
      default: 'text-default-foreground',
      accent: 'text-accent-foreground',
      success: 'text-success-foreground',
      danger: 'text-danger-foreground'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});
export const progressButtonClassNames = combineStyles({
  root,
  overlay,
  label,
  maskLabel
});
export const progressButtonStyleSheet = StyleSheet.create({
  root: {
    borderCurve: 'continuous'
  }
});