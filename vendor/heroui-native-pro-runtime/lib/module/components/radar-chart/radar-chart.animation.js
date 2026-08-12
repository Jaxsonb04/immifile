"use strict";

import { useCombinedAnimationDisabledState } from 'heroui-native/hooks';
// --------------------------------------------------

/**
 * Root cascade hook for `RadarChart`. Owns no animated styles — combines global + parent + own
 * disable-all state into `isAllAnimationsDisabled` so the root can publish it via
 * `AnimationSettingsProvider` and animated compound parts (e.g. `RadarChart.Radar`) can drop
 * their `animate` config when the cascade fires.
 *
 * @param options.animation Root's `animation` prop value.
 * @returns `{ isAllAnimationsDisabled }` — `true` when the cascaded `"disable-all"` is active.
 */
export function useRadarChartRootAnimation(options) {
  const {
    animation
  } = options;
  const isAllAnimationsDisabled = useCombinedAnimationDisabledState(animation);
  return {
    isAllAnimationsDisabled
  };
}