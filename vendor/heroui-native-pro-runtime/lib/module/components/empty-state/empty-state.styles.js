"use strict";

import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";
const root = tv({
  base: 'flex-col items-center gap-8 px-6 py-8'
});
const header = tv({
  base: 'flex-col items-center gap-2'
});
const media = tv({
  base: 'shrink-0 items-center justify-center text-muted',
  variants: {
    variant: {
      default: '',
      icon: 'size-12 rounded-full bg-default text-foreground'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});
const title = tv({
  base: 'text-center text-base font-semibold text-foreground'
});
const description = tv({
  base: 'text-center text-sm text-muted'
});
const content = tv({
  base: 'flex-col items-center gap-2'
});
export const emptyStateClassNames = combineStyles({
  root,
  header,
  media,
  title,
  description,
  content
});
export default emptyStateClassNames;