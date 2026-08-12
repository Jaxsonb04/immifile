"use strict";

import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";
const label = tv({
  base: 'text-foreground text-[10px] font-normal min-w-10 text-center'
});

/**
 * RN value overlay: `container` hosts animated layout; `label` styles the default label slot classes.
 *
 * {@link ChartCrosshair.Value} must be rendered under {@link ChartCrosshair.Anchor}; the container is
 * always absolutely positioned.
 *
 * @note ANIMATED PROPERTIES (cannot be set via `className` / container slot):
 * The `container` slot receives animated styles from `ChartCrosshair.Value` for:
 * - `opacity` — driven by `isActive` from anchor context
 * - Vertical edge — `placement="top"` uses animated `bottom: -measuredHeight` (+ `offset`) so the pill sits
 *   above the anchor; `placement="bottom"` uses `top: '100%'` plus `translateY` from `offset`.
 * - `transform` — `translateX` from crosshair `x`, horizontal `offset`, and optional `chartBounds`
 *   clamp (see {@link ChartCrosshairValueProps}); with `placement="bottom"`, `translateY` from vertical `offset`.
 *
 * To nudge vertical or horizontal placement without fighting the animated style, use the `offset` prop on
 * `ChartCrosshair.Value` (`{ top, bottom, left, right }`, CSS-like additive). Avoid overriding `top` /
 * `bottom` or `transform` via `classNames.container` / `styles.container` — those are owned by the
 * animated style and will be overwritten on every frame.
 */
const value = tv({
  slots: {
    container: 'absolute left-0 min-w-14 flex-row items-center justify-center',
    label: 'text-foreground text-[10px] font-normal min-w-10 text-center'
  },
  variants: {
    variant: {
      default: {
        container: 'bg-default rounded-2xl px-2 py-1'
      },
      ghost: {
        container: 'bg-transparent p-1'
      }
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});
export const chartCrosshairClassNames = combineStyles({
  value,
  label
});