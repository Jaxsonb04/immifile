"use strict";

import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";

/**
 * Outer `View` wrapper around `BasePolarChart`. `w-full aspect-square` fills the parent's
 * width as a square; override sizing via `wrapperClassName` (e.g. `w-[200px]`).
 */
const root = tv({
  base: 'w-full aspect-square'
});

/**
 * Combined Tailwind Variant entries for `RadialChart`. Only the outer wrapper is styled with
 * tv; ring strokes come from each data row's `colorKey` field.
 */
export const radialChartClassNames = combineStyles({
  root
});
export default radialChartClassNames;