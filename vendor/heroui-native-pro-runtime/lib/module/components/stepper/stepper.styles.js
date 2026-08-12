"use strict";

import { cn } from 'heroui-native/utils';
import { StyleSheet } from 'react-native';
import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";
const root = tv({
  base: 'data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col'
});
const step = tv({
  base: cn('gap-3', 'data-[orientation=vertical]:flex-row data-[orientation=vertical]:items-start data-[orientation=vertical]:py-3', 'data-[orientation=horizontal]:flex-1 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:items-center')
});
const indicator = tv({
  base: cn('size-7 items-center justify-center rounded-3xl border-2 border-accent', 'data-[status=complete]:bg-accent', 'data-[status=inactive]:border-border')
});

/** Wrapper for the animated check icon inside the indicator */
const indicatorCheck = tv({
  base: 'items-center justify-center'
});

/** 1-based step index label inside the indicator */
const indicatorNumber = tv({
  base: cn('text-sm font-semibold text-accent', 'data-[status=inactive]:text-muted')
});
const separator = tv({
  base: cn('bg-accent', 'data-[orientation=horizontal]:h-0.5 data-[orientation=vertical]:w-0.5', 'data-[status=inactive]:bg-border')
});

/** Static track (`bg-border`) inside the primitive separator bounds */
const separatorTrack = tv({
  base: 'absolute inset-0 bg-border'
});

/**
 * Separator fill style definition — animated accent fill (`bg-accent`) layered on the track
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * The following properties are animated and cannot be overridden using Tailwind classes:
 * - `transform` (scaleY for vertical, scaleX for horizontal) — Animated for step fill
 *   progress transitions, driven by the root `progress` shared value
 * - `transformOrigin` — Set based on orientation (top-center for vertical, left-center
 *   for horizontal)
 *
 * To disable the fill animation on a single separator, use the `animation` prop:
 * ```tsx
 * <Stepper.SeparatorFill animation="disabled" />
 * ```
 *
 * To disable all stepper animations (including fill), use the root `animation` prop:
 * ```tsx
 * <Stepper animation="disable-all" />
 * ```
 *
 * To completely disable animated styles and apply your own via className or style prop,
 * set `isAnimatedStyleActive={false}` on `Stepper.SeparatorFill`.
 */
const separatorFill = tv({
  base: 'absolute inset-0 bg-accent'
});
const content = tv({
  base: 'data-[orientation=horizontal]:items-center'
});
const title = tv({
  base: cn('text-base font-medium text-foreground', 'data-[orientation=horizontal]:text-center', 'data-[status=inactive]:opacity-50')
});
const description = tv({
  base: cn('text-sm text-muted', 'data-[orientation=horizontal]:text-center', 'data-[status=inactive]:opacity-50')
});
export const stepperClassNames = combineStyles({
  root,
  step,
  indicator,
  indicatorCheck,
  indicatorNumber,
  separator,
  separatorTrack,
  separatorFill,
  content,
  title,
  description
});
export const stepperStyleSheet = StyleSheet.create({
  separatorFillHorizontal: {
    height: '100%'
  },
  separatorFillVertical: {
    width: '100%'
  }
});