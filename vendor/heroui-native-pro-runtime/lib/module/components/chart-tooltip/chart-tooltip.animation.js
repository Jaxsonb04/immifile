"use strict";

import { useAnimationSettings } from 'heroui-native/contexts';
import { useCombinedAnimationDisabledState } from 'heroui-native/hooks';
import { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { getAnimationState, getIsAnimationDisabledValue } from "../../helpers/internal/utils/index.js";
import { DEFAULT_FADE_DURATION_MS, DEFAULT_MOTION_ANIMATION } from "./chart-tooltip.constants.js";
// --------------------------------------------------

/**
 * Clamps `value` to the inclusive range `[min, max]` on the UI thread.
 *
 * Falls back to the range midpoint when `max < min` (e.g. the card is wider than the plot).
 */
const clampWorklet = (value, min, max) => {
  'worklet';

  if (max < min) {
    return (min + max) / 2;
  }
  return Math.min(Math.max(value, min), max);
};

// --------------------------------------------------

/**
 * Animation hook for {@link ChartTooltip.Anchor} (root).
 *
 * Owns no animated styles; resolves the combined Global > Parent > Own disabled state so the
 * anchor can cascade `"disable-all"` to {@link ChartTooltip} via `AnimationSettingsProvider`.
 */
export function useChartTooltipAnchorRootAnimation(options) {
  const {
    animation
  } = options;
  const isAllAnimationsDisabled = useCombinedAnimationDisabledState(animation);
  return {
    isAllAnimationsDisabled
  };
}

// --------------------------------------------------

/**
 * Animation hook for the {@link ChartTooltip} card.
 *
 * Produces the floating card's animated style: a `withTiming` opacity fade tied to press
 * activity (when `isVisible="auto"`) plus configurable motion (`withSpring` by default,
 * `withTiming` when `type: 'timing'`) that tracks the press indicator and clamps inside
 * `chartBounds` on both axes. Honors the cascaded `disable-all` state from the anchor.
 */
export function useChartTooltipRootAnimation(options) {
  const {
    animation,
    anchor,
    measuredWidth,
    measuredHeight,
    gap,
    offset,
    placement,
    isVisible
  } = options;
  const {
    isAllAnimationsDisabled
  } = useAnimationSettings();
  const {
    animationConfig,
    isAnimationDisabled
  } = getAnimationState(animation);
  const isAnimationDisabledValue = getIsAnimationDisabledValue({
    isAnimationDisabled,
    isAllAnimationsDisabled
  });
  const motionConfig = animationConfig ?? DEFAULT_MOTION_ANIMATION;

  /**
   * Snapshot for clamping: same coordinate space as Skia press positions. Not a `SharedValue`,
   * so it is listed in `useAnimatedStyle` deps so clamping updates when bounds change.
   */
  const tooltipChartBounds = anchor.chartBounds;
  const rContainerStyle = useAnimatedStyle(() => {
    const xValue = anchor.x?.get() ?? 0;
    const yValue = anchor.y?.get() ?? 0;
    const overlayWidth = measuredWidth.get();
    const overlayHeight = measuredHeight.get();
    let activeOpacity = 1;
    if (isVisible === 'auto') {
      activeOpacity = anchor.isActive == null ? 1 : anchor.isActive.get() ? 1 : 0;
    }
    const offsetTop = offset?.top ?? 0;
    const offsetBottom = offset?.bottom ?? 0;
    const offsetLeft = offset?.left ?? 0;
    const offsetRight = offset?.right ?? 0;
    let translateX = xValue - overlayWidth / 2 + offsetLeft - offsetRight;
    let translateY = placement === 'bottom' ? yValue + gap + offsetTop - offsetBottom : yValue - overlayHeight - gap + offsetTop - offsetBottom;
    const bounds = tooltipChartBounds;
    if (bounds != null && Number.isFinite(bounds.left) && Number.isFinite(bounds.right) && Number.isFinite(bounds.top) && Number.isFinite(bounds.bottom)) {
      translateX = clampWorklet(translateX, bounds.left, Math.max(bounds.left, bounds.right - overlayWidth));
      translateY = clampWorklet(translateY, bounds.top, Math.max(bounds.top, bounds.bottom - overlayHeight));
    }
    const animateMotion = value => {
      'worklet';

      if (isAnimationDisabledValue) {
        return value;
      }
      if (motionConfig.type === 'timing') {
        return withTiming(value, motionConfig);
      }
      return withSpring(value, motionConfig);
    };
    return {
      opacity: withTiming(activeOpacity, {
        duration: DEFAULT_FADE_DURATION_MS
      }),
      transform: [{
        translateX: animateMotion(translateX)
      }, {
        translateY: animateMotion(translateY)
      }]
    };
  }, [anchor, gap, isAnimationDisabledValue, isVisible, measuredHeight, measuredWidth, motionConfig, offset, placement, tooltipChartBounds]);
  return {
    rContainerStyle
  };
}