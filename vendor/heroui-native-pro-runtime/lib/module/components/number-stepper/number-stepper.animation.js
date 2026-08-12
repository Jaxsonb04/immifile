"use strict";

import { useAnimationSettings } from 'heroui-native/contexts';
import { useCombinedAnimationDisabledState } from 'heroui-native/hooks';
import { useCallback } from 'react';
import { Easing, Keyframe, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { getAnimationState, getAnimationValueMergedConfig, getAnimationValueProperty, getIsAnimationDisabledValue } from "../../helpers/internal/utils/index.js";
const SPRING_EASING = Easing.bezier(0.175, 0.885, 0.32, 1.275).factory();
const DURATION = 400;
const DEFAULT_TRANSLATE_Y_DISTANCE = 16;
const DEFAULT_SCALE_VALUE = 0.7;

/** Directional keyframe set for value enter/exit transitions. */

/**
 * Creates a full set of directional Keyframe animations for the number stepper value.
 * Each direction (increase / decrease) gets its own entering and exiting pair
 * that mirrors the translateY sign accordingly.
 */
function createDirectionalKeyframes(translateY, scale) {
  return {
    enteringIncrease: new Keyframe({
      0: {
        opacity: 0,
        transform: [{
          translateY
        }, {
          scale
        }]
      },
      100: {
        opacity: 1,
        transform: [{
          translateY: 0
        }, {
          scale: 1
        }],
        easing: SPRING_EASING
      }
    }).duration(DURATION),
    exitingIncrease: new Keyframe({
      0: {
        opacity: 1,
        transform: [{
          translateY: 0
        }, {
          scale: 1
        }]
      },
      100: {
        opacity: 0,
        transform: [{
          translateY: -translateY
        }, {
          scale
        }],
        easing: SPRING_EASING
      }
    }).duration(DURATION),
    enteringDecrease: new Keyframe({
      0: {
        opacity: 0,
        transform: [{
          translateY: -translateY
        }, {
          scale
        }]
      },
      100: {
        opacity: 1,
        transform: [{
          translateY: 0
        }, {
          scale: 1
        }],
        easing: SPRING_EASING
      }
    }).duration(DURATION),
    exitingDecrease: new Keyframe({
      0: {
        opacity: 1,
        transform: [{
          translateY: 0
        }, {
          scale: 1
        }]
      },
      100: {
        opacity: 0,
        transform: [{
          translateY
        }, {
          scale
        }],
        easing: SPRING_EASING
      }
    }).duration(DURATION)
  };
}

/** Pre-built keyframes for the default config (fast path, no per-render allocation). */
const defaultKeyframes = createDirectionalKeyframes(DEFAULT_TRANSLATE_Y_DISTANCE, DEFAULT_SCALE_VALUE);

/**
 * Resolves a NumberStepperDirectionalAnimation value to a concrete animation
 * for the given direction.
 *
 * - Plain EntryOrExitLayoutType: returned as-is for both directions
 * - Object with increase/decrease keys: picks the matching direction
 * - undefined: returns the direction-matched default
 */
function resolveDirectionalAnimation(value, direction, defaults) {
  if (value === undefined) {
    return defaults[direction];
  }
  if (typeof value === 'object' && value !== null && ('increase' in value || 'decrease' in value)) {
    const directional = value;
    return directional[direction] ?? defaults[direction];
  }
  return value;
}

/**
 * Animation hook for NumberStepper root component.
 * Handles root-level animation configuration and provides cascading disable state.
 */
export function useNumberStepperRootAnimation(options) {
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
 * Animation hook for NumberStepper.Value component.
 * Provides direction-aware Keyframe-based entering/exiting animations
 * with spring-like easing. Automatically mirrors translateY based on
 * whether the value is increasing or decreasing.
 */
export function useNumberStepperValueAnimation(options) {
  const {
    animation,
    direction
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
  const translateY = getAnimationValueProperty({
    animationValue: animationConfig,
    property: 'translateYDistance',
    defaultValue: DEFAULT_TRANSLATE_Y_DISTANCE
  });
  const scale = getAnimationValueProperty({
    animationValue: animationConfig,
    property: 'scaleValue',
    defaultValue: DEFAULT_SCALE_VALUE
  });
  const isCustomConfig = translateY !== DEFAULT_TRANSLATE_Y_DISTANCE || scale !== DEFAULT_SCALE_VALUE;
  const keyframes = isCustomConfig ? createDirectionalKeyframes(translateY, scale) : defaultKeyframes;
  const entering = resolveDirectionalAnimation(animationConfig?.entering, direction, {
    increase: keyframes.enteringIncrease,
    decrease: keyframes.enteringDecrease
  });
  const exiting = resolveDirectionalAnimation(animationConfig?.exiting, direction, {
    increase: keyframes.exitingIncrease,
    decrease: keyframes.exitingDecrease
  });
  return {
    entering: isAnimationDisabledValue ? undefined : entering,
    exiting: isAnimationDisabledValue ? undefined : exiting
  };
}

// --------------------------------------------------

const DEFAULT_BUTTON_SCALE = 0.95;
const DEFAULT_BUTTON_TIMING = {
  duration: 150
};

/**
 * Animation hook for NumberStepper increment/decrement buttons.
 * Provides a subtle scale-on-press feedback driven by a SharedValue toggled
 * via onPressIn/onPressOut callbacks.
 */
export function useNumberStepperButtonAnimation(options) {
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
    animationValue: animationConfig,
    property: 'value',
    defaultValue: DEFAULT_BUTTON_SCALE
  });
  const timingConfig = getAnimationValueMergedConfig({
    animationValue: animationConfig,
    property: 'timingConfig',
    defaultValue: DEFAULT_BUTTON_TIMING
  });
  const isPressed = useSharedValue(false);
  const animationOnPressIn = useCallback(() => {
    isPressed.set(true);
  }, [isPressed]);
  const animationOnPressOut = useCallback(() => {
    isPressed.set(false);
  }, [isPressed]);
  const rButtonStyle = useAnimatedStyle(() => {
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
    rButtonStyle,
    animationOnPressIn,
    animationOnPressOut
  };
}