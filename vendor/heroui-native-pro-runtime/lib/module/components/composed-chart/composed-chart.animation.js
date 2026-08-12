"use strict";

import { useCombinedAnimationDisabledState } from 'heroui-native/hooks';
// --------------------------------------------------

/**
 * Resolves root-level animation disable state for {@link ComposedChart}.
 *
 * Cascades `"disable-all"` through {@link AnimationSettingsProvider} so reused
 * `BarChart` / `LineChart` / `AreaChart` series parts drop their `animate` props when disabled.
 */
export function useComposedChartRootAnimation(options) {
  const {
    animation
  } = options;
  const isAllAnimationsDisabled = useCombinedAnimationDisabledState(animation);
  return {
    isAllAnimationsDisabled
  };
}