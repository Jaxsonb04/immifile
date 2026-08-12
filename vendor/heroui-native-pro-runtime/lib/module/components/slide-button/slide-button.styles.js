"use strict";

import { StyleSheet } from 'react-native';
import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";

/**
 * Root style definition (with slots for container and inner wrapper).
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * - `opacity` - Animated for disabled state transitions (applied to container)
 */
const root = tv({
  slots: {
    container: 'h-[56px] p-1.5 rounded-4xl bg-default overflow-hidden',
    contentContainer: 'flex-1'
  },
  variants: {
    isDisabled: {
      true: {
        container: 'opacity-disabled'
      },
      false: {}
    }
  },
  defaultVariants: {
    isDisabled: false
  }
});

/**
 * UnderlayContent style definition.
 * Right-anchored clip wrapper that hides content to the left of the thumb.
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * - `width` - Animated to clip content at the thumb's leading edge (applied to container and content container)
 */
const underlayContent = tv({
  slots: {
    container: 'absolute right-0 top-0 bottom-0 overflow-hidden rounded-4xl',
    contentContainer: 'absolute right-0 top-0 bottom-0 items-center justify-center'
  }
});

/**
 * OverlayContent style definition.
 * Uses overflow-hidden clip wrapper to reveal content from left to right.
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * - `width` - Animated to clip content at the thumb's trailing edge (applied to container and content container)
 */
const overlayContent = tv({
  slots: {
    container: 'absolute inset-0 overflow-hidden rounded-4xl',
    contentContainer: 'flex-1 items-center justify-center'
  },
  variants: {
    variant: {
      default: {
        contentContainer: 'bg-default-foreground/5'
      },
      accent: {
        contentContainer: 'bg-accent-soft'
      },
      success: {
        contentContainer: 'bg-success-soft'
      },
      danger: {
        contentContainer: 'bg-danger-soft'
      }
    }
  },
  defaultVariants: {
    variant: 'accent'
  }
});

/**
 * Thumb style definition.
 * The draggable handle positioned absolutely within the root.
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * - `transform` (translateX) - Animated for gesture tracking
 *
 * To customize spring behavior, use the `animation` prop on `SlideButton.Thumb`:
 * ```tsx
 * <SlideButton.Thumb
 *   animation={{
 *     springConfig: { damping: 25, stiffness: 400 },
 *   }}
 * />
 * ``
 *
 * To completely disable animated styles and apply your own via className or style prop,
 * set `isAnimatedStyleActive={false}` on `SlideButton.Thumb`.
 */
const thumb = tv({
  base: 'absolute h-full aspect-video rounded-4xl items-center justify-center bg-surface shadow-sm z-10'
});

/**
 * Label style definition.
 * Text label used within underlay or overlay content parts.
 */
const label = tv({
  base: 'text-sm font-medium',
  variants: {
    variant: {
      default: 'text-default-soft-foreground',
      accent: 'text-accent-soft-foreground',
      success: 'text-success-soft-foreground',
      danger: 'text-danger-soft-foreground'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});
export const slideButtonClassNames = combineStyles({
  root,
  underlayContent,
  overlayContent,
  thumb,
  label
});
export const slideButtonStyleSheet = StyleSheet.create({
  root: {
    borderCurve: 'continuous'
  }
});

/** Slot type for the root style definition. */

/** Slot type for the underlay content style definition. */

/** Slot type for the overlay content style definition. */