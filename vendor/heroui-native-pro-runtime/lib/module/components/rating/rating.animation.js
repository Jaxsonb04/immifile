"use strict";

import { useAnimationSettings } from 'heroui-native/contexts';
import { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { getAnimationState, getAnimationValueMergedConfig, getAnimationValueProperty, getIsAnimationDisabledValue } from "../../helpers/internal/utils/index.js";
// --------------------------------------------------

/**
 * Animation hook for {@link RatingItem}.
 * Produces a subtle scale animation on press.
 *
 * Respects both the local `animation` prop (`false` / `'disabled'` to
 * disable) and the cascaded `isAllAnimationsDisabled` state from any
 * ancestor `AnimationSettingsProvider`.
 *
 * @param options.animation - Item animation configuration
 * @param options.isPressed - Whether the item is currently pressed
 * @returns `rContainerStyle` animated style to apply on the pressable
 */
export function useRatingItemAnimation(options) {
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
        scale: withTiming(isPressed ? scaleValue[1] : scaleValue[0], scaleTimingConfig)
      }]
    };
  });
  return {
    rContainerStyle
  };
}