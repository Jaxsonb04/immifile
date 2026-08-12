"use strict";

import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";

/**
 * Outer `View` wrapper around `BasePolarChart`. Height must be supplied by the consumer via
 * `wrapperClassName` (e.g. `h-[260px]`).
 */
const root = tv({
  base: 'w-full'
});

/**
 * Combined Tailwind Variant entries for `RadarChart`. Only the outer wrapper is styled with tv;
 * radar fills, grid strokes, and label colors come from the Skia subcomponents.
 */
export const radarChartClassNames = combineStyles({
  root
});
export default radarChartClassNames;