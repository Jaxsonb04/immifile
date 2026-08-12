"use strict";

import { useCombinedAnimationDisabledState, useThemeColor } from 'heroui-native/hooks';
import { useMemo } from 'react';
import { Extrapolation, interpolate, interpolateColor, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { getAnimationValueProperty, getIsAnimationDisabledValue, getRootAnimationState } from "../../helpers/internal/utils/index.js";
import { DEFAULT_OPACITY_RANGE, DEFAULT_SCALE_RANGE, FAST_SCROLL_EMIT_THROTTLE_MS, FAST_SCROLL_VELOCITY_THRESHOLD_PX_PER_MS } from "./wheel-picker.constants.js";
import { getIndexFromOffset } from "./wheel-picker.utils.js";

// --------------------------------------------------

/**
 * Root animation hook for {@link WheelPicker}.
 *
 * Owns the shared `scrollY` value driven by the FlatList scroll handler,
 * resolves the per-item opacity / scale interpolation config, and emits
 * JS-side callbacks via `scheduleOnRN` from `react-native-worklets`:
 *
 * - `onIndexChange` fires every time the snapped row index changes during
 *   a scroll session (live SwiftUI-style commit).
 * - `onScrollingChange(true)` fires on drag begin, `(false)` fires on
 *   momentum end (or drag end when no momentum follows).
 *
 * Returns the cascade flag (`isAllAnimationsDisabled`) so the component
 * can pipe it through `AnimationSettingsProvider`, plus the per-item
 * disabled flag (`isItemAnimationDisabled`) and resolved animation config
 * consumed by {@link useWheelPickerItemAnimation}.
 */
export function useWheelPickerRootAnimation(options) {
  const {
    animation,
    itemHeight,
    maxIndex,
    initialIndex,
    onIndexChange,
    onScrollingChange
  } = options;
  const isAllAnimationsDisabled = useCombinedAnimationDisabledState(animation);
  const {
    animationConfig,
    isAnimationDisabled
  } = getRootAnimationState(animation);
  const isItemAnimationDisabled = getIsAnimationDisabledValue({
    isAnimationDisabled,
    isAllAnimationsDisabled
  });

  /**
   * Theme-aware defaults for `labelColor`. Resolved on the JS thread so
   * the hex strings stay in sync with light / dark theme switches and
   * are stable inputs to the worklet via the memoized
   * `resolvedAnimation`.
   */
  const defaultEdgeLabelColor = useThemeColor('foreground');
  const defaultCenterLabelColor = useThemeColor('accent-soft-foreground');
  const resolvedAnimation = useMemo(() => {
    const opacity = getAnimationValueProperty({
      animationValue: animationConfig?.opacity,
      property: 'value',
      defaultValue: [DEFAULT_OPACITY_RANGE[0], DEFAULT_OPACITY_RANGE[1]]
    });
    const scale = getAnimationValueProperty({
      animationValue: animationConfig?.scale,
      property: 'value',
      defaultValue: [DEFAULT_SCALE_RANGE[0], DEFAULT_SCALE_RANGE[1]]
    });
    const labelColor = animationConfig?.labelColor?.value ?? [defaultEdgeLabelColor, defaultCenterLabelColor];
    return {
      opacity,
      scale,
      labelColor
    };
  }, [animationConfig, defaultEdgeLabelColor, defaultCenterLabelColor]);

  /**
   * Seed `scrollY` at the initial selected offset so the very first frame
   * applies item interpolations correctly (no flash of un-styled rows
   * before the FlatList settles its `contentOffset`).
   */
  const initialOffset = initialIndex > 0 ? initialIndex * itemHeight : 0;
  const scrollY = useSharedValue(initialOffset);

  /**
   * Latest committed index. Updated on the UI thread inside `onScroll` so
   * each crossing of a row boundary fires `onIndexChange` exactly once.
   */
  const lastCommittedIndex = useSharedValue(initialIndex);

  /**
   * Velocity-gated throttle state. We compute scroll velocity ourselves
   * from `(currentY - previousY) / dt` so the gate works the same on iOS
   * and Android (native `event.velocity` is platform-dependent).
   * `lastEmitTime` caps the JS commit rate during fast flings.
   */
  const previousScrollY = useSharedValue(initialOffset);
  const previousScrollTime = useSharedValue(0);
  const lastEmitTime = useSharedValue(0);

  /**
   * User-scroll gate. `true` only between `onBeginDrag` and
   * `onMomentumEnd` (or no-velocity `onEndDrag`) — i.e. when the
   * current scroll session was started by a user touch. The scroll
   * handler emits intermediate `onValueChange` commits only while this
   * is `true`.
   *
   * Programmatic scrolls (tap-to-focus, imperative `scrollToIndex` /
   * `scrollToValue`, sync effect after a controlled value change) never
   * touch this flag, so it stays `false` and the worklet stays silent —
   * the target value has already been committed by the caller.
   */
  const isUserScrolling = useSharedValue(false);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const now = Date.now();
      const currentY = event.contentOffset.y;
      const maxOffset = (maxIndex >= 0 ? maxIndex : 0) * itemHeight;

      /**
       * Velocity bookkeeping still runs every frame (including during
       * overscroll) so the gate stays accurate the moment we exit
       * bounce. The early-return below skips the emit / animation work
       * itself.
       */
      const dt = Math.max(1, now - previousScrollTime.get());
      const velocity = Math.abs(currentY - previousScrollY.get()) / dt;
      previousScrollY.set(currentY);
      previousScrollTime.set(now);

      /**
       * Clamp `scrollY` to the valid range. On iOS, `bounces` lets the
       * FlatList scroll past `0` / `maxOffset`. We still let the list
       * visually bounce, but the shared `scrollY` consumed by per-item
       * animations stays pinned at the boundary so row 0 / last row
       * don't fade out during the bounce.
       */
      const clampedY = Math.max(0, Math.min(currentY, maxOffset));
      scrollY.set(clampedY);

      /**
       * Overscrolling — no new index to commit, no velocity throttle
       * to update, no emit. The animations are already pinned via the
       * clamped `scrollY` above, so we just bail.
       */
      if (currentY !== clampedY) {
        return;
      }
      const nextIndex = getIndexFromOffset(currentY, itemHeight, maxIndex);
      if (nextIndex === lastCommittedIndex.get()) {
        return;
      }
      lastCommittedIndex.set(nextIndex);

      /**
       * Only emit during user-initiated scrolls. Programmatic scrolls
       * (tap, imperative ref, controlled-value sync) update UI-thread
       * tracking on every frame but never fire `onValueChange` — the
       * target value was already committed before the scroll started.
       */
      if (!isUserScrolling.get()) {
        return;
      }

      /**
       * Throttle JS commits during fast scrolls. Slow scrolls (below
       * the velocity threshold) keep their per-row instant feedback;
       * fast flings are capped to {@link FAST_SCROLL_EMIT_THROTTLE_MS}.
       * Final value is always re-emitted on scroll end so the throttle
       * never drops the last selection.
       */
      if (velocity > FAST_SCROLL_VELOCITY_THRESHOLD_PX_PER_MS) {
        if (now - lastEmitTime.get() < FAST_SCROLL_EMIT_THROTTLE_MS) {
          return;
        }
      }
      lastEmitTime.set(now);
      scheduleOnRN(onIndexChange, nextIndex);
    },
    onBeginDrag: () => {
      /**
       * The user grabbed the wheel — this is now a user-initiated
       * scroll. Intermediate emits should flow; final commit lands on
       * `onMomentumEnd` (or `onEndDrag` if no momentum follows).
       */
      isUserScrolling.set(true);
      scheduleOnRN(onScrollingChange, true);
    },
    onEndDrag: event => {
      /**
       * On a no-momentum touch release (`|velocity| ≈ 0`) the scroll
       * settles here without firing `onMomentumEnd`. Close the user
       * scroll session and re-emit the index of the actual resting
       * offset (not the cached `lastCommittedIndex`, which a fast fling
       * past the edge can leave contaminated by overscroll bounce-back
       * frames). The clamp keeps the index valid through an iOS bounce.
       */
      const velocityY = event.velocity?.y ?? 0;
      if (Math.abs(velocityY) < 0.05) {
        const maxOffset = (maxIndex >= 0 ? maxIndex : 0) * itemHeight;
        const finalY = Math.max(0, Math.min(event.contentOffset.y, maxOffset));
        const finalIndex = getIndexFromOffset(finalY, itemHeight, maxIndex);
        lastCommittedIndex.set(finalIndex);
        isUserScrolling.set(false);
        scheduleOnRN(onIndexChange, finalIndex);
        scheduleOnRN(onScrollingChange, false);
      }
    },
    onMomentumEnd: event => {
      /**
       * Commit the index of the actual resting offset. Deriving it from
       * the final `contentOffset` (clamped to the valid range) — rather
       * than re-emitting the cached `lastCommittedIndex` — fixes the
       * overscroll bug where a hard fling past the last row leaves the
       * cached index stuck on a bounce-back value, which the sync effect
       * would then animate the wheel backward to. Skip the emit when the
       * session wasn't user initiated (programmatic scrolls) — value is
       * already committed.
       */
      const wasUserScrolling = isUserScrolling.get();
      isUserScrolling.set(false);
      const maxOffset = (maxIndex >= 0 ? maxIndex : 0) * itemHeight;
      const finalY = Math.max(0, Math.min(event.contentOffset.y, maxOffset));
      const finalIndex = getIndexFromOffset(finalY, itemHeight, maxIndex);
      lastCommittedIndex.set(finalIndex);
      if (wasUserScrolling) {
        scheduleOnRN(onIndexChange, finalIndex);
      }
      scheduleOnRN(onScrollingChange, false);
    }
  });
  return {
    isAllAnimationsDisabled,
    isItemAnimationDisabled,
    resolvedAnimation,
    scrollY,
    scrollHandler
  };
}

// --------------------------------------------------

/**
 * Per-item animation hook for {@link WheelPicker}.
 *
 * Reads the per-row `absDistance` derived value (exposed via
 * `useWheelPickerItem`) and interpolates opacity + scale against it.
 * When `isItemAnimationDisabled` is `true`, returns an identity style.
 */
export function useWheelPickerItemAnimation(options) {
  const {
    absDistance,
    resolvedAnimation,
    isItemAnimationDisabled
  } = options;
  const rItemStyle = useAnimatedStyle(() => {
    if (isItemAnimationDisabled) {
      return {
        opacity: 1,
        transform: [{
          scale: 1
        }]
      };
    }
    const distance = absDistance.get();
    const opacity = interpolate(distance, [0, 2], [resolvedAnimation.opacity[1], resolvedAnimation.opacity[0]], Extrapolation.CLAMP);
    const scale = interpolate(distance, [0, 2], [resolvedAnimation.scale[1], resolvedAnimation.scale[0]], Extrapolation.CLAMP);
    return {
      opacity,
      transform: [{
        scale
      }]
    };
  });
  return {
    rItemStyle
  };
}

// --------------------------------------------------

/**
 * Per-item label animation hook for {@link WheelPicker}.
 *
 * Interpolates the label's text color between
 * `resolvedAnimation.labelColor[0]` (edge) and
 * `resolvedAnimation.labelColor[1]` (center) using `interpolateColor`
 * driven by the per-row `absDistance` derived value.
 *
 * When `isItemAnimationDisabled` is `true`, returns an empty style so
 * the label keeps its own `className` / `style` color.
 */
export function useWheelPickerItemLabelAnimation(options) {
  const {
    absDistance,
    resolvedAnimation,
    isItemAnimationDisabled
  } = options;
  const rLabelStyle = useAnimatedStyle(() => {
    if (isItemAnimationDisabled) {
      return {};
    }
    const {
      labelColor
    } = resolvedAnimation;
    const color = interpolateColor(absDistance.get(), [0, 1], [labelColor[1], labelColor[0]]);
    return {
      color
    };
  });
  return {
    rLabelStyle
  };
}