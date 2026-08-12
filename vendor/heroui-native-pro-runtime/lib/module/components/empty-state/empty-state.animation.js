"use strict";

import { useCombinedAnimationDisabledState } from 'heroui-native/hooks';
// --------------------------------------------------

/**
 * Animation hook for the {@link EmptyState} root component.
 *
 * EmptyState does not animate its own styles, but it still owns the
 * `disable-all` cascade for animated descendants rendered inside it.
 */
export function useEmptyStateRootAnimation(options) {
  const {
    animation
  } = options;
  const isAllAnimationsDisabled = useCombinedAnimationDisabledState(animation);
  return {
    isAllAnimationsDisabled
  };
}