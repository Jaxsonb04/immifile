"use strict";

import { useCombinedAnimationDisabledState } from 'heroui-native/hooks';
// --------------------------------------------------

export function usePieChartRootAnimation(options) {
  const {
    animation
  } = options;
  const isAllAnimationsDisabled = useCombinedAnimationDisabledState(animation);
  return {
    isAllAnimationsDisabled
  };
}