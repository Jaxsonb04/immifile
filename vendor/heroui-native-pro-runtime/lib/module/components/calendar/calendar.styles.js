"use strict";

import { cn } from 'heroui-native/utils';
import { StyleSheet } from 'react-native';
import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";

/**
 * Root container for the calendar.
 */
const root = tv({
  base: 'w-full'
});

/**
 * Header row: navigation + title region.
 */
const header = tv({
  base: 'flex-row items-center justify-between gap-2 pb-4 pl-2'
});

/**
 * Month / year title text.
 */
const heading = tv({
  base: 'flex-1 text-sm font-medium text-foreground'
});

/**
 * Previous / next control.
 */
const navButton = tv({
  base: cn('size-9 items-center justify-center rounded-3xl', 'data-[pressed-not-disabled=true]:bg-default-hover/50', 'data-[disabled=true]:opacity-disabled')
});

/**
 * Month grid wrapper.
 */
const grid = tv({
  base: 'data-[readonly=true]:opacity-100'
});

/**
 * Weekday header cell.
 */
const headerCell = tv({
  base: 'flex-1 items-center justify-center pb-2'
});

/**
 * Weekday label text inside `headerCell`.
 */
const headerCellLabel = tv({
  base: 'text-xs font-medium text-muted text-center'
});

/**
 * Day cell.
 */
const cell = tv({
  base: cn('flex-1 m-0.5 aspect-square items-center justify-center', 'data-[unavailable=true]:opacity-disabled', 'data-[disabled=true]:opacity-disabled', 'data-[readonly=true]:pointer-events-none')
});

/**
 * Inner body of a day cell.
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * The following properties are animated and cannot be overridden using Tailwind classes:
 * - `transform` (scale) - Animated for press feedback when the day cell is pressed
 *
 * To customize these properties, use the `animation` prop on `Calendar.CellBody`:
 * ```tsx
 * <Calendar.CellBody
 *   animation={{
 *     scale: {
 *       value: [1, 0.9],
 *       timingConfig: { duration: 120 },
 *     },
 *   }}
 * />
 * ```
 *
 * To completely disable animated styles and apply your own via className or style prop,
 * set `isAnimatedStyleActive={false}` on `Calendar.CellBody`.
 */
const cellBody = tv({
  base: cn('relative size-10 items-center justify-center rounded-4xl', 'data-[today=true]:bg-accent-soft', 'data-[pressed=true]:bg-default-hover/50', 'data-[selected=true]:bg-accent data-[selected=true]:shadow-sm')
});

/**
 * Day label.
 */
const cellLabel = tv({
  base: cn('text-sm font-medium text-center text-foreground', 'data-[today=true]:text-accent-soft-foreground', 'data-[outside-month=true]:text-muted', 'data-[selected=true]:text-accent-foreground')
});

/**
 * Event / dot marker under a day.
 */
const cellIndicator = tv({
  base: cn('absolute bottom-1.5 size-1 rounded-full bg-muted', 'data-[selected=true]:bg-accent-foreground')
});
export const calendarClassNames = combineStyles({
  root,
  header,
  heading,
  navButton,
  grid,
  headerCell,
  cell,
  cellBody,
  cellLabel,
  cellIndicator,
  headerCellLabel
});
export default calendarClassNames;
export const calendarStyleSheet = StyleSheet.create({
  borderCurve: {
    borderCurve: 'continuous'
  }
});