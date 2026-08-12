"use strict";

import { useAnimationSettings } from 'heroui-native/contexts';
import { useEffect } from 'react';
import { Easing, interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { getAnimationState, getAnimationValueMergedConfig, getAnimationValueProperty, getIsAnimationDisabledValue } from "../../helpers/internal/utils/index.js";
import { INDICATOR_SPRING_CONFIG } from "./calendar-year-picker.constants.js";
// --------------------------------------------------

/**
 * Opacity animation for the year picker overlay container.
 */
export function useYearPickerGridAnimation(options) {
  const {
    animation,
    isOpen
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
  const opacityTimingConfig = getAnimationValueMergedConfig({
    animationValue: animationConfig?.opacity,
    property: 'timingConfig',
    defaultValue: {
      duration: 150,
      easing: Easing.out(Easing.ease)
    }
  });
  const [opacityClosed, opacityOpen] = getAnimationValueProperty({
    animationValue: animationConfig?.opacity,
    property: 'value',
    defaultValue: [0, 1]
  });

  /**
   * Always start at the closed value so the first mount (deferred to the first time the picker
   * opens — see {@link YearPickerGrid}) still plays the opening transition. Before, the shared
   * value was initialized from `isOpen`, which meant mounting while already open skipped the
   * animation entirely; that mattered less when the wrapper mounted eagerly alongside the
   * calendar, but it became visible once we deferred the mount.
   */
  const opacity = useSharedValue(opacityClosed);
  useEffect(() => {
    const target = isOpen ? opacityOpen : opacityClosed;
    if (isAnimationDisabledValue) {
      opacity.set(target);
    } else {
      opacity.set(withTiming(target, opacityTimingConfig));
    }
  }, [isAnimationDisabledValue, isOpen, opacity, opacityClosed, opacityOpen, opacityTimingConfig]);
  const rOverlayStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.get()
    };
  });
  return {
    rOverlayStyle
  };
}

// --------------------------------------------------

/**
 * Chevron rotation on the year picker trigger (accordion-style spring).
 */
export function useYearPickerIndicatorAnimation(options) {
  const {
    animation,
    isOpen
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
  const rotationValue = getAnimationValueProperty({
    animationValue: animationConfig?.rotation,
    property: 'value',
    defaultValue: [0, 90]
  });
  const rotationSpringConfig = getAnimationValueMergedConfig({
    animationValue: animationConfig?.rotation,
    property: 'springConfig',
    defaultValue: INDICATOR_SPRING_CONFIG
  });
  const rotation = useSharedValue(0);
  useEffect(() => {
    if (isAnimationDisabledValue) {
      rotation.set(isOpen ? 1 : 0);
    } else {
      rotation.set(withSpring(isOpen ? 1 : 0, rotationSpringConfig));
    }
  }, [isAnimationDisabledValue, isOpen, rotation, rotationSpringConfig]);
  const rContainerStyle = useAnimatedStyle(() => {
    const deg = interpolate(rotation.get(), [0, 1], [rotationValue[0], rotationValue[1]]);
    return {
      transform: [{
        rotate: `${deg}deg`
      }]
    };
  });
  return {
    rContainerStyle
  };
}