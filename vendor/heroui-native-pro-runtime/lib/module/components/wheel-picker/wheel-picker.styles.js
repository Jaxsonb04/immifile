"use strict";

import { StyleSheet } from 'react-native';
import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";

/**
 * Root style definition.
 *
 * Slots:
 * - `container` — outer viewport wrapping the FlatList and overlays.
 * - `contentContainer` — FlatList `contentContainerStyle` carrier; receives
 *   the vertical centering padding (computed at runtime from
 *   `itemHeight` and `visibleCount`).
 * - `item` — per-row animated container.
 * - `itemLabel` — default label text inside a row.
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * The `item` slot animates:
 * - `opacity` - Distance-based fade
 * - `transform` (scale) - Distance-based scale
 *
 * The `itemLabel` slot animates `color` via `interpolateColor`. Defaults
 * to theme `[foreground, accent-soft-foreground]`; override with
 * `animation.labelColor` on the root.
 *
 * To customize the animation ranges, use the `animation` prop on `WheelPicker`:
 * ```tsx
 * <WheelPicker
 *   animation={{
 *     opacity: { value: [0.1, 1] },
 *     scale: { value: [0.7, 1] },
 *     labelColor: { value: ['#888', '#000'] },
 *   }}
 * />
 * ```
 *
 * To disable animated styles entirely, set `animation="disabled"` on the root.
 */
const root = tv({
  slots: {
    container: 'overflow-hidden',
    contentContainer: '',
    item: 'flex-row items-center justify-center gap-2',
    itemLabel: 'text-lg text-foreground font-medium'
  },
  variants: {
    isDisabled: {
      true: {
        container: 'opacity-disabled pointer-events-none'
      },
      false: {}
    }
  },
  defaultVariants: {
    isDisabled: false
  }
});

/**
 * Indicator style definition.
 *
 * Slots:
 * - `wrapper` — absolutely-positioned band centered on the wheel viewport.
 * - `highlight` — filled rectangle rendered inside the wrapper.
 */
const indicator = tv({
  slots: {
    wrapper: 'absolute left-0 right-0 justify-center -z-1',
    highlight: 'flex-1 rounded-2xl bg-default'
  }
});

/**
 * Mask style definition.
 *
 * Slots:
 * - `top` — top fade overlay.
 * - `bottom` — bottom fade overlay.
 */
const mask = tv({
  slots: {
    top: 'absolute left-0 right-0 top-0',
    bottom: 'absolute left-0 right-0 bottom-0'
  }
});

/**
 * Combined `tailwind-variants` slots for the wheel picker root, indicator, and mask.
 */
export const wheelPickerClassNames = combineStyles({
  root,
  indicator,
  mask
});
export const styleSheet = StyleSheet.create({
  indicatorHighlight: {
    borderCurve: 'continuous'
  }
});

/** Slot type for the root style definition. */

/** Slot type for the indicator style definition. */

/** Slot type for the mask style definition. */