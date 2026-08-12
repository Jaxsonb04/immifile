"use strict";

import { useCallback, useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { FLICK_RATIO_THRESHOLD, VELOCITY_THRESHOLD } from "./split-view.constants.js";
import { findNearestSnapIndex, pickFlickSnapIndex } from "./split-view.utils.js";
export function useSplitViewDragAreaGesture(options) {
  const {
    topSectionHeight,
    isDragging,
    minPx,
    maxPx,
    isAllAnimationsDisabled,
    resolvedSnapPoints,
    setSnapIndex,
    onSnap,
    applySnapHeight,
    setDraggingJs
  } = options;
  const startHeight = useSharedValue(0);
  const snapEndStore = useMemo(() => ({
    run: _payload => {}
  }), []);
  snapEndStore.run = payload => {
    const {
      height,
      velocityY
    } = payload;
    const points = resolvedSnapPoints;
    if (points.length === 0) {
      isDragging.set(false);
      setDraggingJs(false);
      return;
    }
    const nearestIdx = findNearestSnapIndex(height, points);
    let targetIndex = nearestIdx;
    if (Math.abs(velocityY) > VELOCITY_THRESHOLD) {
      targetIndex = pickFlickSnapIndex(nearestIdx, velocityY, points.length, FLICK_RATIO_THRESHOLD);
    }
    const clampedIndex = Math.max(0, Math.min(targetIndex, points.length - 1));
    const targetHeight = points[clampedIndex] ?? height;
    setSnapIndex(clampedIndex);
    applySnapHeight(targetHeight, clampedIndex, !isAllAnimationsDisabled);
    onSnap?.(clampedIndex, targetHeight);
    isDragging.set(false);
    setDraggingJs(false);
  };
  const runSnapEndOnJS = useCallback(payload => {
    snapEndStore.run(payload);
  }, [snapEndStore]);
  const panGesture = useMemo(() => Gesture.Pan().onBegin(() => {
    startHeight.set(topSectionHeight.value);
    isDragging.set(true);
    scheduleOnRN(setDraggingJs, true);
  }).onUpdate(event => {
    const next = Math.max(minPx, Math.min(startHeight.value + event.translationY, maxPx));
    topSectionHeight.set(next);
  }).onEnd(event => {
    const height = topSectionHeight.get();
    scheduleOnRN(runSnapEndOnJS, {
      height,
      velocityY: event.velocityY
    });
  }), [isDragging, maxPx, minPx, runSnapEndOnJS, setDraggingJs, startHeight, topSectionHeight]);
  return {
    panGesture
  };
}