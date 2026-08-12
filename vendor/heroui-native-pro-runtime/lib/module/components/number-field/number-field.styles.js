"use strict";

import { StyleSheet } from 'react-native';
import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";
const root = tv({
  base: 'gap-1.5'
});

/**
 * DecrementButton style definition
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * The following property in the `contentContainer` slot is animated:
 * - `transform` (scale) - Animated for press feedback
 *
 * To customize, use the `animation` prop on `NumberField.DecrementButton`:
 * ```tsx
 * <NumberField.DecrementButton
 *   animation={{
 *     scale: { value: [1, 0.88], timingConfig: { duration: 150 } },
 *   }}
 * />
 * ```
 *
 * To disable, set `animation={false}` on `NumberField.DecrementButton`.
 */
const decrementButton = tv({
  slots: {
    container: 'absolute left-0 top-0 bottom-0 z-10 border-r border-field-placeholder/15 rounded-tl-2xl rounded-bl-2xl data-[pressed=true]:bg-field-placeholder/5',
    contentContainer: 'flex-1 items-center justify-center px-4'
  },
  variants: {
    isDisabled: {
      true: {
        container: 'opacity-disabled'
      }
    }
  },
  defaultVariants: {
    isDisabled: false
  }
});

/**
 * IncrementButton style definition
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * The following property in the `contentContainer` slot is animated:
 * - `transform` (scale) - Animated for press feedback
 *
 * To customize, use the `animation` prop on `NumberField.IncrementButton`:
 * ```tsx
 * <NumberField.IncrementButton
 *   animation={{
 *     scale: { value: [1, 0.88], timingConfig: { duration: 150 } },
 *   }}
 * />
 * ```
 *
 * To disable, set `animation={false}` on `NumberField.IncrementButton`.
 */
const incrementButton = tv({
  slots: {
    container: 'absolute right-0 top-0 bottom-0 z-10 border-l border-field-placeholder/15 rounded-tr-2xl rounded-br-2xl data-[pressed=true]:bg-field-placeholder/5',
    contentContainer: 'flex-1 items-center justify-center px-4'
  },
  variants: {
    isDisabled: {
      true: {
        container: 'opacity-disabled'
      }
    }
  },
  defaultVariants: {
    isDisabled: false
  }
});
export const numberFieldClassNames = combineStyles({
  root,
  decrementButton,
  incrementButton
});
export const numberFieldStyleSheet = StyleSheet.create({
  buttonBorderCurve: {
    borderCurve: 'continuous'
  }
});