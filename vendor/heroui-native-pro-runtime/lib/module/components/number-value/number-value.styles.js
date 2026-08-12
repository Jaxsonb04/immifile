"use strict";

import { StyleSheet } from 'react-native';
import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";

/**
 * Root style definition with two slots:
 *
 * - `container`: the outer `View` that lays out the prefix, value, and
 *   suffix inline.
 * - `value`: the `Text` rendering the formatted numeric string. Provides a
 *   default text color so the value is legible without extra styling.
 */
const root = tv({
  slots: {
    container: 'flex-row items-baseline',
    value: 'text-foreground'
  }
});

/**
 * Standalone alias for the root's `value` slot. Re-exporting the slot
 * callable through `combineStyles` keeps `NumberValueValue` decoupled from
 * the root's slot invocation while sharing the exact same base styles.
 */
const {
  value: rootValueSlot
} = root();
const prefix = tv({
  base: ''
});
const suffix = tv({
  base: ''
});

/**
 * `NumberValue` class-name slots.
 *
 * Exposes the per-part `tv` instances so consumers can reuse them to build
 * variations that visually align with the default `NumberValue` styling.
 *
 * @example
 * ```tsx
 * import { numberValueClassNames } from 'heroui-native-pro';
 *
 * const { container, value } = numberValueClassNames.root();
 * ```
 */
export const numberValueClassNames = combineStyles({
  root,
  value: rootValueSlot,
  prefix,
  suffix
});

/** Slot names available on the `root` tv instance. */

/**
 * StyleSheet for native-only style properties that cannot be expressed via
 * Tailwind classes. The `value` entry applies `fontVariant: tabular-nums`
 * so digits render in fixed-width cells and columns of numbers line up
 * vertically — mirroring the web component's `font-variant-numeric:
 * tabular-nums` rule.
 */
export const numberValueStyleSheet = StyleSheet.create({
  value: {
    fontVariant: ['tabular-nums']
  }
});