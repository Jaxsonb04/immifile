"use strict";

import { useAnimationSettings } from 'heroui-native/contexts';
import { useCombinedAnimationDisabledState } from 'heroui-native/hooks';
import { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { getAnimationState, getAnimationValueMergedConfig, getAnimationValueProperty, getIsAnimationDisabledValue, getRootAnimationState } from "../../helpers/internal/utils/index.js";
import { DEFAULT_HANDLE_SCALE_SPRING_CONFIG, DEFAULT_HANDLE_SCALE_VALUE, DEFAULT_SNAP_SPRING_CONFIG } from "./split-view.constants.js";
// --------------------------------------------------

/**
 * Animation hook for the SplitView root.
 * Resolves spring configs and cascaded `disable-all` for `AnimationSettingsProvider`.
 */
export function useSplitViewRootAnimation(options) {
  const {
    animation
  } = options;
  const isAllAnimationsDisabled = useCombinedAnimationDisabledState(animation);
  const {
    animationConfig
  } = getRootAnimationState(animation);
  const snapSpringConfig = getAnimationValueMergedConfig({
    animationValue: animationConfig,
    property: 'snapSpringConfig',
    defaultValue: DEFAULT_SNAP_SPRING_CONFIG
  });
  return {
    isAllAnimationsDisabled,
    snapSpringConfig
  };
}

// --------------------------------------------------

/**
 * Animated height for the top pane (driven by root `topSectionHeight` shared value).
 */
export function useSplitViewTopSectionAnimation(options) {
  const {
    topSectionHeight
  } = options;
  const rTopStyle = useAnimatedStyle(() => ({
    height: topSectionHeight.value
  }));
  return {
    rTopStyle
  };
}

// --------------------------------------------------

/**
 * Scale feedback on the drag handle while dragging.
 */
export function useSplitViewDragHandleAnimation(options) {
  const {
    animation,
    isDragging,
    isAllAnimationsDisabled
  } = options;
  const {
    isAllAnimationsDisabled: cascadedAll
  } = useAnimationSettings();
  const {
    animationConfig,
    isAnimationDisabled
  } = getAnimationState(animation);
  const scaleConfig = animationConfig?.scale;
  const isAnimationDisabledValue = getIsAnimationDisabledValue({
    isAnimationDisabled,
    isAllAnimationsDisabled: cascadedAll
  });
  const springConfig = getAnimationValueMergedConfig({
    animationValue: scaleConfig,
    property: 'springConfig',
    defaultValue: DEFAULT_HANDLE_SCALE_SPRING_CONFIG
  });
  const handleScaleValue = getAnimationValueProperty({
    animationValue: scaleConfig,
    property: 'value',
    defaultValue: DEFAULT_HANDLE_SCALE_VALUE
  });
  const rHandleStyle = useAnimatedStyle(() => {
    const [idleScale, dragScale] = handleScaleValue;
    if (isAllAnimationsDisabled || isAnimationDisabledValue) {
      return {
        transform: [{
          scale: idleScale
        }]
      };
    }
    const target = isDragging.value ? dragScale : idleScale;
    return {
      transform: [{
        scale: withSpring(target, springConfig)
      }]
    };
  }, [isAllAnimationsDisabled, isAnimationDisabledValue, handleScaleValue, springConfig]);
  return {
    rHandleStyle
  };
}