"use strict";

import { cn } from 'heroui-native/utils';
import { StyleSheet } from 'react-native';
import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";

/**
 * Pressable trigger (month + year + chevron).
 */
const trigger = tv({
  base: 'flex-row flex-1 items-center gap-1'
});

/**
 * Month + year label inside the trigger.
 */
const triggerHeading = tv({
  base: 'text-sm font-medium text-foreground'
});

/**
 * Chevron wrapper (animated rotation).
 */
const triggerIndicator = tv({
  base: 'items-center justify-center'
});

/**
 * Absolutely positioned overlay over the month grid.
 */
const yearGrid = tv({
  base: 'absolute left-0 right-0 z-10 overflow-hidden rounded-2xl bg-overlay border border-border'
});

/**
 * Scroll content wrapper for the year `FlatList` (`contentContainerClassName`).
 */
const yearGridBodyContent = tv({
  base: 'p-2'
});

/**
 * Single year cell (pressable).
 */
/**
 * Single year cell. Vertical margins are intentionally omitted: the row
 * stride rendered by `FlatList` must equal the `cellHeight` reported from
 * `getItemLayout` for `scrollToOffset` math to land on the correct row.
 * Any vertical margin here would silently inflate the rendered row height
 * and shift the scroll target by `marginY * rowIndex` pixels.
 */
const yearCell = tv({
  base: cn('mx-0.5 flex-1 items-center justify-center rounded-3xl', 'data-[pressed=true]:bg-default-hover/50', 'data-[selected=true]:bg-accent data-[selected=true]:shadow-sm', 'data-[current-year=true]:border data-[current-year=true]:border-border')
});

/**
 * Year label text.
 */
const yearCellLabel = tv({
  base: cn('text-sm font-medium text-center text-foreground', 'data-[selected=true]:text-accent-foreground')
});
export const calendarYearPickerClassNames = combineStyles({
  trigger,
  triggerHeading,
  triggerIndicator,
  yearGrid,
  yearGridBodyContent,
  yearCell,
  yearCellLabel
});
export default calendarYearPickerClassNames;
export const calendarYearPickerStyleSheet = StyleSheet.create({
  borderCurve: {
    borderCurve: 'continuous'
  },
  flatListColumnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});