"use strict";

import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";
const root = tv({
  base: '',
  variants: {
    isDisabled: {
      true: 'opacity-disabled pointer-events-none',
      false: ''
    }
  },
  defaultVariants: {
    isDisabled: false
  }
});
const group = tv({
  base: '',
  variants: {
    size: {
      sm: 'p-[2px] rounded-3xl',
      md: 'p-[3px] rounded-3xl',
      lg: 'p-[4px] rounded-4xl'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});
const scrollView = tv({
  base: '',
  variants: {
    size: {
      sm: '-my-[2px] rounded-2xl',
      md: '-my-[3px] rounded-3xl',
      lg: '-my-[4px] rounded-4xl'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});
const scrollViewContentContainer = tv({
  base: '',
  variants: {
    size: {
      sm: 'py-[2px] px-px',
      md: 'py-[3px] px-px',
      lg: 'py-[4px] px-px'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});
const item = tv({
  base: 'flex-row items-center justify-center gap-1.5',
  variants: {
    size: {
      sm: 'rounded-xl px-2.5 py-1',
      md: 'rounded-3xl px-3 py-1.5',
      lg: 'rounded-[22px] px-3.5 py-2'
    },
    isDisabled: {
      true: 'disabled:opacity-disabled disabled:pointer-events-none',
      false: ''
    }
  },
  defaultVariants: {
    size: 'md',
    isDisabled: false
  }
});
const label = tv({
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

/**
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * - `width` - Animated for indicator width transitions when switching segments
 * - `height` - Animated for indicator height transitions when switching segments
 * - `translateX` - Animated for indicator position transitions when switching segments (uses translateX for GPU-accelerated performance)
 * - `opacity` - Animated for indicator visibility transitions (0 when no active segment, 1 when active segment is selected)
 *
 * To customize these properties, use the `animation` prop on `Segment.Indicator`:
 * ```tsx
 * <Segment.Indicator
 *   animation={{
 *     width: { type: "spring", config: { stiffness: 1200, damping: 120 } },
 *     height: { type: "spring", config: { stiffness: 1200, damping: 120 } },
 *     translateX: { type: "timing", config: { duration: 200 } },
 *   }}
 * />
 * ```
 *
 * To disable animated styles and supply your own via `className`/`style`, set
 * `isAnimatedStyleActive={false}` on `Segment.Indicator`.
 */
const indicator = tv({
  base: '',
  variants: {
    size: {
      sm: 'rounded-3xl',
      md: 'rounded-3xl',
      lg: 'rounded-4xl'
    },
    isScrollView: {
      true: '',
      false: ''
    }
  },
  compoundVariants: [{
    size: 'sm',
    isScrollView: true,
    className: 'top-[2px]'
  }, {
    size: 'md',
    isScrollView: true,
    className: 'top-[3px]'
  }, {
    size: 'lg',
    isScrollView: true,
    className: 'top-[4px]'
  }],
  defaultVariants: {
    size: 'md',
    isScrollView: false
  }
});
export const segmentClassNames = combineStyles({
  root,
  group,
  scrollView,
  scrollViewContentContainer,
  item,
  label,
  indicator
});