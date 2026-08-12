"use strict";

import { useCombinedAnimationDisabledState } from 'heroui-native/hooks';
// --------------------------------------------------

/**
 * Animation hook for the {@link Badge} root component.
 *
 * Combines the global, parent, and own `disable-all` animation states so the
 * root can cascade `isAllAnimationsDisabled` to children via
 * `AnimationSettingsProvider`.
 *
 * Priority: Global > Parent > Own.
 */
export function useBadgeRootAnimation(options) {
  const {
    animation
  } = options;
  const isAllAnimationsDisabled = useCombinedAnimationDisabledState(animation);
  return {
    isAllAnimationsDisabled
  };
}