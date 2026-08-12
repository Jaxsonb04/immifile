"use strict";

import { useCombinedAnimationDisabledState } from 'heroui-native/hooks';
import { useCallback, useEffect, useRef } from 'react';
import { interpolate, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { getAnimationValueMergedConfig, getAnimationValueProperty, getRootAnimationState } from "../../helpers/internal/utils/index.js";
import { DEFAULT_PRESS_SCALE, DEFAULT_PROGRESS_SPRING_CONFIG, DEFAULT_SCALE_DURATION } from "./progress-button.constants.js";
// --------------------------------------------------

/**
 * Animation hook for the ProgressButton root component.
 * Manages shared values (progress, pressScale, layout measurements),
 * press handlers with animation, controlled sync with external state,
 * and the container press-scale style.
 *
 * Consumer-provided `onPressIn`, `onPressOut`, and `onLayout` callbacks
 * are forwarded after the internal animation logic runs.
 */
export function useProgressButtonRootAnimation(options) {
  const {
    animation,
    isCompleted,
    holdDuration,
    isInternalChangeRef,
    onPressIn,
    onPressOut,
    onLayout
  } = options;
  const isAllAnimationsDisabled = useCombinedAnimationDisabledState(animation);
  const {
    animationConfig
  } = getRootAnimationState(animation);
  const progressSpringConfig = getAnimationValueMergedConfig({
    animationValue: animationConfig,
    property: 'progressSpringConfig',
    defaultValue: DEFAULT_PROGRESS_SPRING_CONFIG
  });
  const scaleValue = getAnimationValueProperty({
    animationValue: animationConfig?.scale,
    property: 'value',
    defaultValue: DEFAULT_PRESS_SCALE
  });
  const scaleConfig = getAnimationValueMergedConfig({
    animationValue: animationConfig?.scale,
    property: 'timingConfig',
    defaultValue: {
      duration: DEFAULT_SCALE_DURATION
    }
  });
  const progress = useSharedValue(isCompleted ? 1 : 0);
  const pressScale = useSharedValue(1);
  const trackWidth = useSharedValue(0);
  const textX = useSharedValue(0);
  const textWidth = useSharedValue(0);

  /** Collapses continuous 0-1 progress into a discrete boolean flag */
  const isProgressCompleted = useDerivedValue(() => progress.get() === 1);

  /** Spring-based reset to 0 (or instant when animations are disabled) */
  const resetProgress = useCallback(() => {
    if (isAllAnimationsDisabled) {
      progress.set(0);
    } else {
      progress.set(withSpring(0, progressSpringConfig));
    }
  }, [isAllAnimationsDisabled, progress, progressSpringConfig]);

  /**
   * Sync progress with external controlled state changes.
   * Skips when the change was triggered internally (gesture, auto-reset, reset).
   */
  const prevIsCompletedRef = useRef(isCompleted);
  useEffect(() => {
    const prev = prevIsCompletedRef.current;
    prevIsCompletedRef.current = isCompleted;
    if (prev === isCompleted) return;
    if (isInternalChangeRef.current) {
      isInternalChangeRef.current = false;
      return;
    }
    if (isCompleted) {
      if (isAllAnimationsDisabled) {
        progress.set(1);
      } else {
        progress.set(withSpring(1, progressSpringConfig));
      }
    } else {
      resetProgress();
    }
  }, [isCompleted, isAllAnimationsDisabled, isInternalChangeRef, progress, progressSpringConfig, resetProgress]);

  /** Start fill animation + scale on press, then forward consumer callback */
  const handlePressIn = useCallback(event => {
    progress.set(withTiming(1, {
      duration: holdDuration
    }));
    if (isAllAnimationsDisabled) {
      pressScale.set(scaleValue);
    } else {
      pressScale.set(withTiming(scaleValue, scaleConfig));
    }
    onPressIn?.(event);
  }, [isAllAnimationsDisabled, progress, pressScale, holdDuration, scaleValue, scaleConfig, onPressIn]);

  /** Cancel fill if incomplete, scale back, then forward consumer callback */
  const handlePressOut = useCallback(event => {
    if (progress.get() < 1) {
      resetProgress();
    }
    if (isAllAnimationsDisabled) {
      pressScale.set(1);
    } else {
      pressScale.set(withTiming(1, scaleConfig));
    }
    onPressOut?.(event);
  }, [isAllAnimationsDisabled, progress, pressScale, scaleConfig, resetProgress, onPressOut]);

  /** Measure root width for overlay sweep, then forward consumer callback */
  const handleLayout = useCallback(event => {
    trackWidth.set(event.nativeEvent.layout.width);
    onLayout?.(event);
  }, [trackWidth, onLayout]);

  /** Press feedback: scale down on hold, snap back on release */
  const rContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        scale: pressScale.get()
      }]
    };
  });
  return {
    isAllAnimationsDisabled,
    progress,
    isProgressCompleted,
    trackWidth,
    textX,
    textWidth,
    rContainerStyle,
    handlePressIn,
    handlePressOut,
    handleLayout,
    resetProgress
  };
}

// --------------------------------------------------

/**
 * Animation hook for the ProgressButton overlay.
 * Produces a translateX style that sweeps the overlay from left to right
 * as progress goes from 0 to 1. At 0 the overlay is entirely off-screen
 * to the left; at 1 it fully covers the root.
 * Also produces a width style that keeps the overlay at track width.
 */
export function useProgressButtonOverlayAnimation(options) {
  const {
    progress,
    trackWidth
  } = options;
  const rOverlayStyle = useAnimatedStyle(() => {
    const translateX = interpolate(progress.get(), [0, 1], [-trackWidth.get(), 0]);
    return {
      transform: [{
        translateX
      }]
    };
  });

  /** Keeps overlay at measured track width */
  const rWidthStyle = useAnimatedStyle(() => {
    return {
      width: trackWidth.get()
    };
  });
  return {
    rOverlayStyle,
    rWidthStyle
  };
}

// --------------------------------------------------

/**
 * Animation hook for the ProgressButton mask label.
 * Counter-translates the MaskLabel so it stays visually aligned with
 * the base Label as the overlay sweeps across. Uses textX and textWidth
 * to compute the progress window where counter-translation occurs.
 */
export function useProgressButtonMaskLabelAnimation(options) {
  const {
    progress,
    trackWidth,
    textX,
    textWidth
  } = options;

  /** Progress (0-1) at which the overlay left edge reaches the text start */
  const textStartProgress = useDerivedValue(() => {
    const bw = trackWidth.get();
    const tx = textX.get();
    return bw > 0 ? Math.min(1, Math.max(0, tx / bw)) : 0;
  });

  /** Progress (0-1) at which the overlay fully covers the text */
  const textEndProgress = useDerivedValue(() => {
    const bw = trackWidth.get();
    const tx = textX.get();
    const tw = textWidth.get();
    return bw > 0 ? Math.min(1, Math.max(0, (tx + tw) / bw)) : 0;
  });
  const rMaskLabelStyle = useAnimatedStyle(() => {
    const p = progress.get();
    const start = textStartProgress.get();
    const end = Math.max(textEndProgress.get(), start);
    const tw = textWidth.get();
    const translateX = p < start ? 0 : interpolate(p, [start, end], [0, -tw]);
    return {
      transform: [{
        translateX
      }]
    };
  });
  return {
    rMaskLabelStyle
  };
}