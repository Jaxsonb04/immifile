"use strict";

import { useAnimationSettings } from 'heroui-native/contexts';
import { useCombinedAnimationDisabledState } from 'heroui-native/hooks';
import { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { getAnimationState, getAnimationValueMergedConfig, getAnimationValueProperty, getIsAnimationDisabledValue } from "../../helpers/internal/utils/index.js";
// --------------------------------------------------

/**
 * Animation hook for the NumberField root.
 * Handles cascading `isAllAnimationsDisabled` to children
 * via `AnimationSettingsProvider`.
 */
export function useNumberFieldRootAnimation(options) {
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
 * Animation hook for NumberField increment/decrement buttons.
 * Produces a subtle scale animation on press.
 *
 * @param options.animation - Button animation configuration
 * @param options.isPressed - Whether the button is currently pressed
 * @returns `rContentContainerStyle` animated style
 */
export function useNumberFieldButtonAnimation(options) {
  const {
    animation,
    isPressed
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
    defaultValue: [1, 0.9]
  });
  const scaleTimingConfig = getAnimationValueMergedConfig({
    animationValue: animationConfig?.scale,
    property: 'timingConfig',
    defaultValue: {
      duration: 150
    }
  });
  const rContentContainerStyle = useAnimatedStyle(() => {
    if (isAnimationDisabledValue) {
      return {
        transform: [{
          scale: 1
        }]
      };
    }
    return {
      transform: [{
        scale: withTiming(isPressed ? scaleValue[1] : scaleValue[0], scaleTimingConfig)
      }]
    };
  });
  return {
    rContentContainerStyle
  };
}