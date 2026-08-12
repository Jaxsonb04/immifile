"use strict";

import { cn } from 'heroui-native/utils';
import { StyleSheet } from 'react-native';
import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";

/**
 * Root container for the range calendar (primitive `RangeCalendarRoot` wrapper).
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
 * Day cell (pressable): range highlight strip (`bg-accent-soft`) and row rounding; endpoints use `cellBody`.
 */
const cell = tv({
  base: cn('flex-1 my-0.5 aspect-square items-center justify-center', 'data-[range-start=true]:bg-accent-soft data-[range-start=true]:rounded-l-4xl', 'data-[range-end=true]:bg-accent-soft data-[range-end=true]:rounded-r-4xl', 'data-[range-middle=true]:bg-accent-soft data-[range-middle=true]:rounded-none', 'data-[range-middle-row-start=true]:rounded-l-xl', 'data-[range-middle-row-end=true]:rounded-r-xl', 'data-[unavailable=true]:opacity-disabled', 'data-[disabled=true]:opacity-disabled', 'data-[readonly=true]:pointer-events-none')
});

/**
 * Inner body: selected range endpoints (accent circle + shadow).
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * The following properties are animated and cannot be overridden using Tailwind classes:
 * - `transform` (scale) - Animated for press feedback when the day cell is pressed
 *
 * To customize these properties, use the `animation` prop on `RangeCalendar.CellBody`:
 * ```tsx
 * <RangeCalendar.CellBody
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
 * set `isAnimatedStyleActive={false}` on `RangeCalendar.CellBody`.
 */
const cellBody = tv({
  base: cn('size-full items-center justify-center rounded-4xl', 'data-[today-not-in-range=true]:bg-accent-soft', 'data-[pressed=true]:bg-default-hover/50', 'data-[range-start=true]:bg-accent data-[range-start=true]:shadow-sm', 'data-[range-end=true]:bg-accent data-[range-end=true]:shadow-sm')
});

/**
 * Day label. Uses `data-range-start` / `data-range-end` for range-endpoint foreground color.
 */
const cellLabel = tv({
  base: cn('text-sm font-medium text-center text-foreground', 'data-[today-not-in-range=true]:text-accent-soft-foreground', 'data-[outside-month=true]:text-muted', 'data-[range-start=true]:text-accent-foreground data-[range-start=true]:font-medium', 'data-[range-end=true]:text-accent-foreground data-[range-end=true]:font-medium')
});

/**
 * Event / dot marker under a day.
 */
const cellIndicator = tv({
  base: cn('absolute bottom-2 size-[3px] rounded-full bg-muted', 'data-[selected=true]:bg-accent-foreground')
});
export const rangeCalendarClassNames = combineStyles({
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
export default rangeCalendarClassNames;
export const rangeCalendarStyleSheet = StyleSheet.create({
  borderCurve: {
    borderCurve: 'continuous'
  }
});