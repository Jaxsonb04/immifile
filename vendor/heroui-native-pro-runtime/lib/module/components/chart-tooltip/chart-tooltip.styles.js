"use strict";

import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";

/**
 * Card root and floating host — `absolute left-0 top-0` positions the tooltip in chart
 * space; `transform` and `opacity` are owned by the component's animated style.
 */
const root = tv({
  base: 'absolute left-0 top-0 bg-overlay border border-border rounded-2xl px-3 py-2 gap-1.5 min-w-[140px] shadow-md'
});
const header = tv({
  base: 'text-muted text-xs font-medium'
});
const item = tv({
  base: 'flex-row items-center gap-2'
});
const indicator = tv({
  base: 'shrink-0',
  defaultVariants: {
    variant: 'dot'
  },
  variants: {
    variant: {
      dot: 'size-2 rounded-full',
      line: 'h-3 w-1 rounded-full'
    }
  }
});
const label = tv({
  base: 'flex-1 text-muted text-xs'
});
const value = tv({
  base: 'text-foreground text-xs font-semibold'
});
export const chartTooltipClassNames = combineStyles({
  header,
  indicator,
  item,
  label,
  root,
  value
});
export default chartTooltipClassNames;