"use strict";

import { useAnimationSettings } from 'heroui-native/contexts';
import { useCombinedAnimationDisabledState } from 'heroui-native/hooks';
import { useCallback } from 'react';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { getAnimationState, getAnimationValueMergedConfig, getAnimationValueProperty, getIsAnimationDisabledValue } from "../../helpers/internal/utils/index.js";
import { DEFAULT_KEY_ANIMATION_DURATION, DEFAULT_KEY_SCALE } from "./number-pad.constants.js";
/**
 * Animation hook for NumberPad root component.
 * Handles root-level animation configuration and provides cascading disable state.
 */
export function useNumberPadRootAnimation(options) {
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
 * Animation hook for NumberPad.Key and NumberPad.Backspace components.
 * Provides subtle scale feedback on press via onPressIn/onPressOut callbacks.
 */
export function useNumberPadKeyAnimation(options) {
  const {
    animation
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
  const scaleValue = getAnimationValueProperty({
    animationValue: animationConfig?.scale,
    property: 'value',
    defaultValue: DEFAULT_KEY_SCALE
  });
  const timingConfig = getAnimationValueMergedConfig({
    animationValue: animationConfig?.scale,
    property: 'timingConfig',
    defaultValue: {
      duration: DEFAULT_KEY_ANIMATION_DURATION
    }
  });
  const isPressed = useSharedValue(false);
  const animationOnPressIn = useCallback(() => {
    isPressed.set(true);
  }, [isPressed]);
  const animationOnPressOut = useCallback(() => {
    isPressed.set(false);
  }, [isPressed]);
  const rContainerStyle = useAnimatedStyle(() => {
    if (isAnimationDisabledValue) {
      return {
        transform: [{
          scale: 1
        }]
      };
    }
    return {
      transform: [{
        scale: withTiming(isPressed.get() ? scaleValue : 1, timingConfig)
      }]
    };
  });
  return {
    animationOnPressIn,
    animationOnPressOut,
    rContainerStyle
  };
}