"use strict";

import { StyleSheet } from 'react-native';
import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";
const root = tv({
  base: 'bg-surface-secondary rounded-2xl p-1.5'
});
const header = tv({
  base: 'flex-row items-center justify-between gap-3 px-2 pb-1.5 pt-0.5'
});
const title = tv({
  base: 'text-foreground text-sm font-medium'
});
const description = tv({
  base: 'text-muted text-xs'
});
const content = tv({
  base: 'bg-surface overflow-hidden rounded-xl p-4 shadow-surface'
});
const footer = tv({
  base: 'flex-row items-center gap-3 px-2 pt-1.5 pb-0.5'
});
const legend = tv({
  base: 'flex-row items-center gap-3'
});

/**
 * `LegendItem` is the only compound part that renders multiple elements
 * itself (wrapper > dot + label), so it owns a slotted `tv()` instance and
 * its props expose `classNames` / `styles` typed against these slots.
 */
const legendItem = tv({
  slots: {
    wrapper: 'flex-row items-center gap-1.5',
    dot: 'size-2.5 rounded-full',
    label: 'text-muted text-xs'
  }
});
export const widgetClassNames = combineStyles({
  root,
  header,
  title,
  description,
  content,
  footer,
  legend,
  legendItem
});

/** Slot keys for the {@link Widget.LegendItem} part. */

/**
 * Native-only style sheet for properties Tailwind cannot express. The
 * `borderCurve` entries apply iOS continuous (squircle) corner curves to
 * the outer shell and the elevated content card.
 */
export const widgetStyleSheet = StyleSheet.create({
  root: {
    borderCurve: 'continuous'
  },
  content: {
    borderCurve: 'continuous'
  }
});
export default widgetClassNames;