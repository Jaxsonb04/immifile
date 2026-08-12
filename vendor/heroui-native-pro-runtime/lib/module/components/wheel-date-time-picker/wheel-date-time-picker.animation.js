"use strict";

import { useCombinedAnimationDisabledState } from 'heroui-native/hooks';
// --------------------------------------------------

/**
 * Root animation hook for {@link WheelDateTimePicker}. The picker owns no
 * animated styles of its own — the underlying `WheelPickerGroup` runs the
 * per-item animations. This hook only resolves `isAllAnimationsDisabled` so
 * the root can cascade `disable-all` to the group (and its wheels) via
 * `AnimationSettingsProvider`.
 */
export function useWheelDateTimePickerRootAnimation(options) {
  const {
    animation
  } = options;
  const isAllAnimationsDisabled = useCombinedAnimationDisabledState(animation);
  return {
    isAllAnimationsDisabled
  };
}