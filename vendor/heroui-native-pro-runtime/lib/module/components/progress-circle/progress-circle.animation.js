"use strict";

import { useAnimationSettings } from 'heroui-native';
import { useCombinedAnimationDisabledState } from 'heroui-native/hooks';
import { useEffect } from 'react';
import { useAnimatedProps, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { getAnimationState, getAnimationValueMergedConfig, getIsAnimationDisabledValue } from "../../helpers/internal/utils/index.js";
import { CIRCUMFERENCE, DEFAULT_FILL_TIMING_DURATION, DEFAULT_SPIN_DURATION, DEFAULT_SPIN_EASING } from "./progress-circle.constants.js";
import { computeStrokeDashoffset } from "./progress-circle.utils.js";

// --------------------------------------------------

/**
 * Animation hook for the {@link ProgressCircle} root component.
 *
 * Combines the global, parent, and own `disable-all` animation states so the
 * root can cascade `isAllAnimationsDisabled` to children via
 * `AnimationSettingsProvider`.
 *
 * Priority: Global > Parent > Own.
 */
export function useProgressCircleRootAnimation(options) {
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
 * Animation hook for the {@link ProgressCircle}.Indicator component.
 * Resolves the timing configurations for both determinate fill and
 * indeterminate spin animations from the `animation` prop, merging with
 * defaults.
 */
export function useProgressCircleIndicatorRootAnimation(options) {
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
  const spinTimingConfig = getAnimationValueMergedConfig({
    animationValue: animationConfig,
    property: 'spinTimingConfig',
    defaultValue: {
      duration: DEFAULT_SPIN_DURATION,
      easing: DEFAULT_SPIN_EASING
    }
  });
  return {
    fillTimingConfig,
    spinTimingConfig,
    isAnimationDisabled: isAnimationDisabledValue
  };
}

// --------------------------------------------------

/**
 * Animation hook for the determinate ProgressCircle fill arc.
 * Animates `strokeDashoffset` via `useAnimatedProps` to smoothly
 * transition between percentage values.
 */
export function useProgressCircleFillAnimation(options) {
  const {
    percentage,
    isAnimationDisabled,
    fillTimingConfig
  } = options;
  const targetOffset = computeStrokeDashoffset(percentage, CIRCUMFERENCE);
  const animatedOffset = useSharedValue(targetOffset);
  useEffect(() => {
    animatedOffset.set(targetOffset);
  }, [targetOffset, animatedOffset]);
  const animatedFillProps = useAnimatedProps(() => {
    if (isAnimationDisabled) {
      return {
        strokeDashoffset: targetOffset
      };
    }
    return {
      strokeDashoffset: withTiming(animatedOffset.get(), fillTimingConfig)
    };
  });
  return {
    animatedFillProps
  };
}

// --------------------------------------------------

/**
 * Animation hook for the indeterminate ProgressCircle spin.
 * Produces a continuous rotation style using `withRepeat`.
 */
export function useProgressCircleSpinAnimation(options) {
  const {
    isAnimationDisabled,
    spinTimingConfig
  } = options;
  const rotation = useSharedValue(0);
  useEffect(() => {
    if (isAnimationDisabled) {
      rotation.set(0);
      return;
    }
    rotation.set(0);
    rotation.set(withRepeat(withTiming(360, spinTimingConfig), -1, false));
  }, [isAnimationDisabled, rotation, spinTimingConfig]);
  const rSpinStyle = useAnimatedStyle(() => ({
    transform: [{
      rotate: `${rotation.get()}deg`
    }]
  }));
  return {
    rSpinStyle
  };
}