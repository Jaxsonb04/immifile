"use strict";

import { useAnimationSettings } from 'heroui-native/contexts';
import { useCombinedAnimationDisabledState } from 'heroui-native/hooks';
import { useCallback } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { interpolate, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { getAnimationState, getAnimationValueMergedConfig, getIsAnimationDisabledValue, getRootAnimationState } from "../../helpers/internal/utils/index.js";
import { DEFAULT_RESET_SPRING_CONFIG } from "./slide-button.constants.js";
// --------------------------------------------------

/**
 * Animation hook for the SlideButton root component.
 * Handles cascading `isAllAnimationsDisabled` to children
 * via `AnimationSettingsProvider`, and extracts `resetSpringConfig`
 * for the reset/auto-reset animation.
 */
export function useSlideButtonRootAnimation(options) {
  const {
    animation
  } = options;
  const isAllAnimationsDisabled = useCombinedAnimationDisabledState(animation);
  const {
    animationConfig
  } = getRootAnimationState(animation);
  const resetSpringConfig = getAnimationValueMergedConfig({
    animationValue: animationConfig,
    property: 'resetSpringConfig',
    defaultValue: DEFAULT_RESET_SPRING_CONFIG
  });
  return {
    isAllAnimationsDisabled,
    resetSpringConfig
  };
}

// --------------------------------------------------

/**
 * Animation hook for the SlideButton overlay content.
 * Produces an animated clip style (outer wrapper) and an inner style
 * that pins the inner container to the full track width so content
 * lays out naturally and is only visually clipped.
 */
export function useSlideButtonOverlayAnimation(options) {
  const {
    progress,
    trackWidth,
    thumbWidth
  } = options;
  const rClipStyle = useAnimatedStyle(() => {
    const tw = thumbWidth.get();
    const maxWidth = trackWidth.get();
    if (maxWidth === 0) {
      return {
        width: tw
      };
    }
    const width = interpolate(progress.get(), [0, 1], [tw, maxWidth]);
    return {
      width
    };
  });
  const rInnerStyle = useAnimatedStyle(() => {
    return {
      width: trackWidth.get()
    };
  });
  return {
    rClipStyle,
    rInnerStyle
  };
}

// --------------------------------------------------

/**
 * Animation hook for the SlideButton underlay content.
 * Mirrors the overlay clip logic: the outer wrapper is anchored to the right
 * and shrinks as progress increases, revealing only the portion to the right
 * of the thumb. The inner container keeps full track width so text stays
 * naturally laid out and is merely clipped on the left edge.
 */
export function useSlideButtonUnderlayAnimation(options) {
  const {
    progress,
    trackWidth,
    thumbWidth
  } = options;
  const rClipStyle = useAnimatedStyle(() => {
    const tw = trackWidth.get();
    const tW = thumbWidth.get();
    if (tw === 0) {
      return {
        width: tw - tW
      };
    }
    const width = interpolate(progress.get(), [0, 1], [tw - tW, 0]);
    return {
      width
    };
  });
  const rInnerStyle = useAnimatedStyle(() => {
    return {
      width: trackWidth.get()
    };
  });
  return {
    rClipStyle,
    rInnerStyle
  };
}

// --------------------------------------------------

/**
 * Animation hook for the SlideButton thumb.
 * Drives translateX from gesture progress and builds the pan gesture
 * that tracks the user's drag, snaps to completion, or springs back.
 */
export function useSlideButtonThumbAnimation(options) {
  const {
    animation,
    progress,
    isCompleted,
    trackWidth,
    thumbWidth,
    completionThreshold,
    isDisabled,
    complete
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
  const springConfig = getAnimationValueMergedConfig({
    animationValue: animationConfig,
    property: 'springConfig',
    defaultValue: DEFAULT_RESET_SPRING_CONFIG
  });
  const maxTranslateX = useDerivedValue(() => {
    const tw = trackWidth.get();
    const tW = thumbWidth.get();
    if (tw === 0) return 0;
    return tw - tW;
  });
  const rThumbStyle = useAnimatedStyle(() => {
    const translateX = progress.get() * maxTranslateX.get();
    return {
      transform: [{
        translateX
      }]
    };
  });
  const startProgress = useSharedValue(0);
  const triggerComplete = useCallback(() => {
    complete();
  }, [complete]);
  const panGesture = Gesture.Pan().enabled(!isDisabled).onBegin(() => {
    startProgress.set(progress.get());
  }).onUpdate(event => {
    if (isCompleted) return;
    const maxTx = maxTranslateX.get();
    if (maxTx <= 0) return;
    const delta = event.translationX / maxTx;
    const newProgress = Math.min(1, Math.max(0, startProgress.get() + delta));
    progress.set(newProgress);
  }).onEnd(() => {
    if (isCompleted) return;
    if (progress.get() >= completionThreshold) {
      progress.set(isAnimationDisabledValue ? 1 : withSpring(1, springConfig));
      scheduleOnRN(triggerComplete);
    } else {
      progress.set(isAnimationDisabledValue ? 0 : withSpring(0, springConfig));
    }
  });
  return {
    rThumbStyle,
    panGesture
  };
}