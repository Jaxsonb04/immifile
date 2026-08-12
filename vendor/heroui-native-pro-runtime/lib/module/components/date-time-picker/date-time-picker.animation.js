"use strict";

import { useCombinedAnimationDisabledState } from 'heroui-native/hooks';
/**
 * Resolves the root `animation` prop into `isAllAnimationsDisabled` so the root
 * can cascade `"disable-all"` to animated descendants via `AnimationSettingsProvider`.
 * Owns no animated styles of its own.
 */
export function useDateTimePickerRootAnimation(options) {
  const {
    animation
  } = options;
  const isAllAnimationsDisabled = useCombinedAnimationDisabledState(animation);
  return {
    isAllAnimationsDisabled
  };
}