"use strict";

import { StyleSheet } from 'react-native';
import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";
const root = tv({
  base: 'flex-1'
});

/**
 * Top pane: fixed animated height; content should scroll internally if needed.
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * - `height` - Driven by `topSectionHeight` shared value
 */
const topSection = tv({
  base: 'overflow-hidden'
});

/**
 * Bottom pane fills remaining space below the drag area.
 */
const bottomSection = tv({
  base: 'flex-1 overflow-hidden'
});

/**
 * Drag hit target: wide touch area above/below the visible handle.
 */
const dragArea = tv({
  base: 'w-full flex-row items-center justify-center py-3'
});

/**
 * Default pill indicator.
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * - `transform` (`scale`) - Driven by drag state
 */
const dragHandle = tv({
  base: 'h-1 w-10 rounded-full bg-separator'
});
export const splitViewClassNames = combineStyles({
  root,
  topSection,
  bottomSection,
  dragArea,
  dragHandle
});
export const splitViewStyleSheet = StyleSheet.create({
  root: {
    borderCurve: 'continuous'
  },
  dragHandle: {
    borderCurve: 'continuous'
  }
});