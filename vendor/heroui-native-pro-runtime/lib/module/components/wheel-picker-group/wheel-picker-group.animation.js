"use strict";

import { useCombinedAnimationDisabledState } from 'heroui-native/hooks';
// --------------------------------------------------

/**
 * Root animation hook for {@link WheelPickerGroup}. The group owns no
 * animated styles of its own — each `WheelPicker` runs its own per-item
 * animation. This hook only resolves `isAllAnimationsDisabled` so the
 * root can cascade `disable-all` to every child wheel via
 * `AnimationSettingsProvider`.
 */
export function useWheelPickerGroupRootAnimation(options) {
  const {
    animation
  } = options;
  const isAllAnimationsDisabled = useCombinedAnimationDisabledState(animation);
  return {
    isAllAnimationsDisabled
  };
}