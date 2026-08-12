"use strict";

import { useCombinedAnimationDisabledState } from 'heroui-native/hooks';
/**
 * Root animation: respects `animation="disable-all"` like `DatePicker` / `TextField`.
 */
export function useDateFieldRootAnimation(options) {
  const {
    animation
  } = options;
  const isAllAnimationsDisabled = useCombinedAnimationDisabledState(animation);
  return {
    isAllAnimationsDisabled
  };
}