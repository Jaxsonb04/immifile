"use strict";

import { StyleSheet } from 'react-native';
import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";
const indicator = tv({
  base: ['items-center justify-center', 'data-[size=sm]:size-3.5', 'data-[size=md]:size-4', 'data-[size=lg]:size-5']
});
const suffix = tv({
  base: 'text-muted'
});
export const trendChipClassNames = combineStyles({
  indicator,
  suffix
});

/**
 * StyleSheet for native-only style properties that cannot be expressed via
 * Tailwind classes. The `value` entry applies `fontVariant: tabular-nums` so
 * digits render in fixed-width cells and columns of chips line up visually.
 */
export const trendChipStyleSheet = StyleSheet.create({
  value: {
    fontVariant: ['tabular-nums']
  }
});