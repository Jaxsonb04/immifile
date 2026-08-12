"use strict";

import { useAnimationSettings } from 'heroui-native/contexts';
import { useCombinedAnimationDisabledState } from 'heroui-native/hooks';
import { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { getAnimationState, getAnimationValueMergedConfig, getAnimationValueProperty, getIsAnimationDisabledValue } from "../../helpers/internal/utils/index.js";
// --------------------------------------------------

export function useCalendarRootAnimation(options) {
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
 * Press scale for `Calendar.CellBody` / `RangeCalendar.CellBody`.
 * Pass `isPressed` only when the day cell is pressed and interaction is allowed (not disabled /
 * unavailable).
 */
export function useCalendarCellBodyAnimation(options) {
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
  const scaleTimingConfig = getAnimationValueMergedConfig({
    animationValue: animationConfig?.scale,
    property: 'timingConfig',
    defaultValue: {
      duration: 120
    }
  });
  const [scaleRest, scalePressed] = getAnimationValueProperty({
    animationValue: animationConfig?.scale,
    property: 'value',
    defaultValue: [1, 0.9]
  });
  const rCellBodyStyle = useAnimatedStyle(() => {
    const effectivePressed = isPressed && !isAnimationDisabledValue;
    const target = effectivePressed ? scalePressed : scaleRest;
    if (isAnimationDisabledValue) {
      return {
        transform: [{
          scale: target
        }]
      };
    }
    return {
      transform: [{
        scale: withTiming(target, scaleTimingConfig)
      }]
    };
  }, [isPressed, isAnimationDisabledValue, scalePressed, scaleRest, scaleTimingConfig]);
  return {
    rCellBodyStyle
  };
}