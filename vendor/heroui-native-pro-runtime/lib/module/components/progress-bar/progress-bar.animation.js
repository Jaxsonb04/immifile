"use strict";

import { useAnimationSettings } from 'heroui-native';
import { useCombinedAnimationDisabledState } from 'heroui-native/hooks';
import { useEffect } from 'react';
import { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { getAnimationState, getAnimationValueMergedConfig, getIsAnimationDisabledValue } from "../../helpers/internal/utils/index.js";
import { DEFAULT_FILL_TIMING_DURATION, DEFAULT_INDETERMINATE_EASING, DEFAULT_INDETERMINATE_TIMING_DURATION, INDETERMINATE_FILL_WIDTH_RATIO } from "./progress-bar.constants.js";
// --------------------------------------------------

/**
 * Animation hook for the {@link ProgressBar} root component.
 *
 * Combines the global, parent, and own `disable-all` animation states so the
 * root can cascade `isAllAnimationsDisabled` to children via
 * `AnimationSettingsProvider`.
 *
 * Priority: Global > Parent > Own.
 */
export function useProgressBarRootAnimation(options) {
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
 * Animation hook for the {@link ProgressBar}.Fill component.
 * Resolves the timing configurations for both determinate and indeterminate
 * fill animations from the `animation` prop, merging with defaults.
 */
export function useProgressBarFillRootAnimation(options) {
  const {
    animation
  } = options;
  const {
    animationConfig,
    isAnimationDisabled
  } = getAnimationState(animation);
  const {
    isAllAnimationsDisabled
  } = useAnimationSettings();
  const isAnimationDisabledValue = getIsAnimationDisabledValue({
    isAnimationDisabled,
    isAllAnimationsDisabled
  });
  const fillTimingConfig = getAnimationValueMergedConfig({
    animationValue: animationConfig,
    property: 'fillTimingConfig',
    defaultValue: {
      duration: DEFAULT_FILL_TIMING_DURATION
    }
  });
  const indeterminateFillTimingConfig = getAnimationValueMergedConfig({
    animationValue: animationConfig,
    property: 'indeterminateFillTimingConfig',
    defaultValue: {
      duration: DEFAULT_INDETERMINATE_TIMING_DURATION,
      easing: DEFAULT_INDETERMINATE_EASING
    }
  });
  return {
    fillTimingConfig,
    indeterminateFillTimingConfig,
    isAnimationDisabled: isAnimationDisabledValue
  };
}

// --------------------------------------------------

/**
 * Animation hook for the ProgressBar.Fill in determinate mode.
 * Produces an animated width style that transitions smoothly
 * when the percentage changes.
 */
export function useProgressBarFillAnimation(options) {
  const {
    percentage,
    isAnimationDisabled,
    fillTimingConfig
  } = options;
  const animatedPercentage = useSharedValue(percentage);
  useEffect(() => {
    animatedPercentage.set(percentage);
  }, [percentage, animatedPercentage]);
  const rFillStyle = useAnimatedStyle(() => {
    if (isAnimationDisabled) {
      return {
        width: `${percentage}%`
      };
    }
    return {
      width: withTiming(`${animatedPercentage.get()}%`, fillTimingConfig)
    };
  });
  return {
    rFillStyle
  };
}

// --------------------------------------------------

/**
 * Animation hook for the ProgressBar.Fill in indeterminate mode.
 * Produces a looping translateX animation that sweeps the fill
 * from fully off-screen left to fully off-screen right.
 *
 * `trackWidth` must be the measured width of the Track container
 * (not the fill) so the sweep covers the entire visible area.
 */
export function useProgressBarIndeterminateAnimation(options) {
  const {
    trackWidth,
    isAnimationDisabled,
    indeterminateFillTimingConfig
  } = options;
  const translateX = useSharedValue(0);
  useEffect(() => {
    if (isAnimationDisabled || trackWidth === 0) {
      translateX.set(0);
      return;
    }
    const fillWidth = trackWidth * INDETERMINATE_FILL_WIDTH_RATIO;
    translateX.set(-fillWidth);
    translateX.set(withRepeat(withTiming(trackWidth, indeterminateFillTimingConfig), -1, false));
  }, [trackWidth, isAnimationDisabled, translateX, indeterminateFillTimingConfig]);
  const rIndeterminateFillStyle = useAnimatedStyle(() => ({
    width: `${INDETERMINATE_FILL_WIDTH_RATIO * 100}%`,
    transform: [{
      translateX: translateX.get()
    }]
  }));
  return {
    rIndeterminateFillStyle
  };
}