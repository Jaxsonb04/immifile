"use strict";

import { useAnimationSettings } from 'heroui-native/contexts';
import { useCombinedAnimationDisabledState } from 'heroui-native/hooks';
import { useEffect, useRef } from 'react';
import { useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { getAnimationState, getAnimationValueProperty, getIsAnimationDisabledValue } from "../../helpers/internal/utils/index.js";
import { DEFAULT_ANIMATED_LINE_DRAW_ANIMATION, DEFAULT_ANIMATED_LINE_PROGRESS } from "./line-chart.constants.js";
// --------------------------------------------------

export function useLineChartRootAnimation(options) {
  const {
    animation
  } = options;
  const isAllAnimationsDisabled = useCombinedAnimationDisabledState(animation);
  return {
    isAllAnimationsDisabled
  };
}

// --------------------------------------------------

export function useLineChartAnimatedLineAnimation(options) {
  const {
    animation,
    resetKey
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
  const progressRange = getAnimationValueProperty({
    animationValue: animationConfig,
    property: 'progress',
    defaultValue: DEFAULT_ANIMATED_LINE_PROGRESS
  });
  const progress = useSharedValue(progressRange[1]);
  const latestRef = useRef({
    animationConfig,
    progressRange,
    isAnimationDisabledValue
  });
  latestRef.current = {
    animationConfig,
    progressRange,
    isAnimationDisabledValue
  };
  useEffect(() => {
    const {
      animationConfig: config,
      progressRange: [from, to],
      isAnimationDisabledValue: disabled
    } = latestRef.current;
    if (disabled) {
      progress.set(to);
      return;
    }
    progress.set(from);
    const resolved = config ?? DEFAULT_ANIMATED_LINE_DRAW_ANIMATION;
    progress.set(resolved.type === 'spring' ? withSpring(to, resolved) : withTiming(to, resolved));
  }, [resetKey, progress]);
  return {
    progress
  };
}