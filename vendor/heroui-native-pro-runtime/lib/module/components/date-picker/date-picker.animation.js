"use strict";

import { useCombinedAnimationDisabledState } from 'heroui-native/hooks';
export function useDatePickerRootAnimation(options) {
  const {
    animation
  } = options;
  const isAllAnimationsDisabled = useCombinedAnimationDisabledState(animation);
  return {
    isAllAnimationsDisabled
  };
}