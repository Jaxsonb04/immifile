"use strict";

import { useCombinedAnimationDisabledState } from 'heroui-native/hooks';
/**
 * Resolves whether animations are disabled for the `DateRangePicker` root based on `animation` props.
 */
export function useDateRangePickerRootAnimation(options) {
  const {
    animation
  } = options;
  const isAllAnimationsDisabled = useCombinedAnimationDisabledState(animation);
  return {
    isAllAnimationsDisabled
  };
}