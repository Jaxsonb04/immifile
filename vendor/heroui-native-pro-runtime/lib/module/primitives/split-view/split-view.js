"use strict";

import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import { useControllableState } from "../../helpers/internal/hooks/index.js";
import { createContext } from "../../helpers/internal/utils/index.js";
import * as Slot from "../slot/index.js";
import { DEFAULT_MIN_BOTTOM_SECTION_HEIGHT, DEFAULT_MIN_HEIGHT, DEFAULT_SNAP_POINTS, DRAG_AREA_HIT_SLOP, ESTIMATED_DRAG_AREA_HEIGHT, PRIMITIVE_DISPLAY_NAME } from "./split-view.constants.js";
import { useSplitViewDragAreaGesture } from "./split-view.gesture.js";
import { resolveMaxHeight, resolveSnapPoint, resolveSnapPoints } from "./split-view.utils.js";

// --------------------------------------------------
import { jsx as _jsx } from "react/jsx-runtime";
const [SplitViewProvider, useSplitView] = createContext({
  name: 'SplitViewContext',
  errorMessage: 'SplitView compound components must be used within SplitView.Root'
});
const [SplitViewInternalProvider, useSplitViewInternal] = createContext({
  name: 'SplitViewInternalContext',
  errorMessage: 'SplitView internal context must be used within SplitView.Root'
});
export { useSplitView, useSplitViewInternal };

// --------------------------------------------------

/**
 * Root primitive: shared values, snap geometry, and context for split layout.
 */
const Root = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    snapPoints: snapPointsProp = [...DEFAULT_SNAP_POINTS],
    minHeight: minHeightProp = DEFAULT_MIN_HEIGHT,
    maxHeight: maxHeightProp,
    defaultSnapIndex = 1,
    snapIndex: snapIndexProp,
    onSnapIndexChange,
    onSnap,
    snapSpringConfig,
    isAllAnimationsDisabled,
    skipInitialAnimation = Platform.select({
      default: true,
      android: false
    }),
    asChild,
    children,
    onLayout: onLayoutFromProps,
    ...restProps
  } = props;
  const topSectionHeight = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const containerHeight = useSharedValue(0);
  const [resolvedSnapPoints, setResolvedSnapPoints] = useState([]);
  const [minPx, setMinPx] = useState(0);
  const [maxPx, setMaxPx] = useState(0);
  const [measuredDragAreaHeight, setMeasuredDragAreaHeight] = useState(null);
  const isDraggingJsRef = useRef(false);
  const containerLayoutHeightRef = useRef(0);
  const hasInitialSnapAppliedRef = useRef(false);
  const [snapIndexState, setSnapIndexState] = useControllableState({
    prop: snapIndexProp,
    defaultProp: defaultSnapIndex,
    onChange: onSnapIndexChange
  });
  const snapIndex = snapIndexState ?? defaultSnapIndex;
  const setDragging = useCallback(next => {
    isDraggingJsRef.current = next;
  }, []);
  const applySnapHeight = useCallback((height, _index, useSpringAnim) => {
    if (useSpringAnim && !isAllAnimationsDisabled) {
      topSectionHeight.set(withSpring(height, snapSpringConfig));
    } else {
      topSectionHeight.set(height);
    }
  }, [isAllAnimationsDisabled, snapSpringConfig, topSectionHeight]);
  const setSnapIndex = useCallback(nextIndex => {
    setSnapIndexState(nextIndex);
  }, [setSnapIndexState]);
  const reportDragAreaHeight = useCallback(height => {
    if (height === null || height <= 0) {
      setMeasuredDragAreaHeight(null);
    } else {
      setMeasuredDragAreaHeight(height);
    }
  }, []);
  const snapTo = useCallback((index, options) => {
    const points = resolvedSnapPoints;
    if (points.length === 0) {
      return;
    }
    const clamped = Math.max(0, Math.min(index, points.length - 1));
    const targetHeight = points[clamped];
    if (targetHeight === undefined) {
      return;
    }
    setSnapIndex(clamped);
    const useSpringAnim = !options?.disableAnimation && !isAllAnimationsDisabled;
    applySnapHeight(targetHeight, clamped, useSpringAnim);
    onSnap?.(clamped, targetHeight);
  }, [applySnapHeight, isAllAnimationsDisabled, onSnap, resolvedSnapPoints, setSnapIndex]);

  // Applies a layout/snap-driven height to the top section. The very first
  // application after mount is set instantly when `skipInitialAnimation` is
  // enabled, so the divider does not animate into place on screen focus.
  const commitSnapHeight = useCallback(target => {
    const shouldSkipInitial = skipInitialAnimation && !hasInitialSnapAppliedRef.current;
    hasInitialSnapAppliedRef.current = true;
    if (isAllAnimationsDisabled || shouldSkipInitial) {
      topSectionHeight.set(target);
    } else {
      topSectionHeight.set(withSpring(target, snapSpringConfig));
    }
  }, [isAllAnimationsDisabled, skipInitialAnimation, snapSpringConfig, topSectionHeight]);
  const applySnapLayout = useCallback(h => {
    if (h <= 0) {
      return;
    }
    const dragStripPx = measuredDragAreaHeight !== null && measuredDragAreaHeight > 0 ? measuredDragAreaHeight : ESTIMATED_DRAG_AREA_HEIGHT;
    const minResolved = Math.max(0, resolveSnapPoint(minHeightProp, h));
    const maxTopCeiling = Math.max(0, h - dragStripPx);
    const defaultMax = h - dragStripPx - DEFAULT_MIN_BOTTOM_SECTION_HEIGHT;
    const maxResolvedRaw = maxHeightProp !== undefined ? resolveMaxHeight(maxHeightProp, h, maxTopCeiling) : defaultMax;
    const maxResolved = Math.min(maxResolvedRaw, maxTopCeiling);
    const nextMinPx = Math.min(minResolved, maxResolved);
    const nextMaxPx = Math.max(minResolved, maxResolved);
    const points = resolveSnapPoints(snapPointsProp, h, nextMinPx, nextMaxPx);
    setResolvedSnapPoints(points);
    setMinPx(nextMinPx);
    setMaxPx(nextMaxPx);
    const safeIndex = Math.max(0, Math.min(snapIndex, points.length - 1));
    if (safeIndex !== snapIndex) {
      setSnapIndex(safeIndex);
    }
    const targetHeight = points[safeIndex] ?? nextMinPx;
    if (!isDraggingJsRef.current) {
      commitSnapHeight(targetHeight);
    }
  }, [commitSnapHeight, maxHeightProp, measuredDragAreaHeight, minHeightProp, setSnapIndex, snapIndex, snapPointsProp]);
  const handleLayout = useCallback(event => {
    const h = event.nativeEvent.layout.height;
    containerHeight.set(h);
    containerLayoutHeightRef.current = h;
    if (h <= 0) {
      onLayoutFromProps?.(event);
      return;
    }
    applySnapLayout(h);
    onLayoutFromProps?.(event);
  }, [applySnapLayout, containerHeight, onLayoutFromProps]);
  const applySnapLayoutRef = useRef(applySnapLayout);
  applySnapLayoutRef.current = applySnapLayout;

  // Stable, value-based key for `snapPoints` so an inline array literal does
  // not retrigger the effect on every render (only when its contents change).
  const snapPointsKey = useMemo(() => snapPointsProp.join(','), [snapPointsProp]);

  // Recompute resolved constraints whenever the drag strip is measured or the
  // constraint props change, keeping `minPx` / `maxPx` / `resolvedSnapPoints`
  // reactive without requiring a container relayout.
  useEffect(() => {
    const h = containerLayoutHeightRef.current;
    if (h > 0) {
      applySnapLayoutRef.current(h);
    }
  }, [measuredDragAreaHeight, minHeightProp, maxHeightProp, snapPointsKey]);
  useEffect(() => {
    if (isDraggingJsRef.current) {
      return;
    }
    const points = resolvedSnapPoints;
    if (points.length === 0) {
      return;
    }
    const safeIndex = Math.max(0, Math.min(snapIndex, points.length - 1));
    const targetHeight = points[safeIndex];
    if (targetHeight === undefined) {
      return;
    }
    commitSnapHeight(targetHeight);
  }, [commitSnapHeight, resolvedSnapPoints, snapIndex]);
  const publicContextValue = useMemo(() => ({
    topSectionHeight,
    isDragging,
    containerHeight,
    snapIndex,
    resolvedSnapPoints,
    minPx,
    maxPx,
    setSnapIndex,
    snapTo,
    snapPoints: snapPointsProp
  }), [containerHeight, isDragging, maxPx, minPx, resolvedSnapPoints, setSnapIndex, snapIndex, snapPointsProp, snapTo, topSectionHeight]);
  const internalContextValue = useMemo(() => ({
    snapSpringConfig,
    isAllAnimationsDisabled,
    applySnapHeight,
    setDragging,
    onSnap,
    reportDragAreaHeight
  }), [applySnapHeight, isAllAnimationsDisabled, onSnap, reportDragAreaHeight, setDragging, snapSpringConfig]);
  const renderProps = useMemo(() => ({
    topSectionHeight,
    isDragging,
    containerHeight,
    snapIndex,
    resolvedSnapPoints,
    minPx,
    maxPx
  }), [containerHeight, isDragging, maxPx, minPx, resolvedSnapPoints, snapIndex, topSectionHeight]);
  const resolvedChildren = typeof children === 'function' ? children(renderProps) : children;
  const Host = asChild ? Slot.View : View;
  return /*#__PURE__*/_jsx(SplitViewInternalProvider, {
    value: internalContextValue,
    children: /*#__PURE__*/_jsx(SplitViewProvider, {
      value: publicContextValue,
      children: /*#__PURE__*/_jsx(Host, {
        ref: ref,
        onLayout: handleLayout,
        ...restProps,
        children: resolvedChildren
      })
    })
  });
});
Root.displayName = PRIMITIVE_DISPLAY_NAME.ROOT;

// --------------------------------------------------

const TopSection = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    asChild,
    accessible = false,
    children,
    ...restProps
  } = props;
  const Host = asChild ? Slot.View : View;
  return /*#__PURE__*/_jsx(Host, {
    ref: ref,
    accessible: accessible,
    ...restProps,
    children: children
  });
});
TopSection.displayName = PRIMITIVE_DISPLAY_NAME.TOP_SECTION;

// --------------------------------------------------

const BottomSection = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    asChild,
    accessible = false,
    children,
    ...restProps
  } = props;
  const Host = asChild ? Slot.View : View;
  return /*#__PURE__*/_jsx(Host, {
    ref: ref,
    accessible: accessible,
    ...restProps,
    children: children
  });
});
BottomSection.displayName = PRIMITIVE_DISPLAY_NAME.BOTTOM_SECTION;

// --------------------------------------------------

const DragArea = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    asChild,
    children,
    accessibilityActions = [{
      name: 'increment',
      label: 'Increase'
    }, {
      name: 'decrement',
      label: 'Decrease'
    }],
    accessibilityLabel = 'Split divider',
    accessibilityRole = 'adjustable',
    onAccessibilityAction,
    onLayout: onLayoutFromProps,
    ...restProps
  } = props;
  const ctx = useSplitView();
  const {
    reportDragAreaHeight,
    isAllAnimationsDisabled: internalAnimationsDisabled,
    onSnap: internalOnSnap,
    applySnapHeight: internalApplySnapHeight,
    setDragging: internalSetDragging
  } = useSplitViewInternal();
  const handleDragAreaLayout = useCallback(event => {
    reportDragAreaHeight(event.nativeEvent.layout.height);
    onLayoutFromProps?.(event);
  }, [onLayoutFromProps, reportDragAreaHeight]);
  useEffect(() => {
    return () => {
      reportDragAreaHeight(null);
    };
  }, [reportDragAreaHeight]);
  const handleAccessibilityAction = useCallback(event => {
    const {
      actionName
    } = event.nativeEvent;
    const points = ctx.resolvedSnapPoints;
    if (points.length > 0) {
      if (actionName === 'increment') {
        const next = Math.min(ctx.snapIndex + 1, points.length - 1);
        ctx.snapTo(next);
      } else if (actionName === 'decrement') {
        const next = Math.max(ctx.snapIndex - 1, 0);
        ctx.snapTo(next);
      }
    }
    onAccessibilityAction?.(event);
  }, [ctx, onAccessibilityAction]);
  const {
    panGesture
  } = useSplitViewDragAreaGesture({
    topSectionHeight: ctx.topSectionHeight,
    isDragging: ctx.isDragging,
    minPx: ctx.minPx,
    maxPx: ctx.maxPx,
    isAllAnimationsDisabled: internalAnimationsDisabled,
    resolvedSnapPoints: ctx.resolvedSnapPoints,
    setSnapIndex: ctx.setSnapIndex,
    onSnap: internalOnSnap,
    applySnapHeight: internalApplySnapHeight,
    setDraggingJs: internalSetDragging
  });
  const Host = asChild ? Slot.View : View;
  return /*#__PURE__*/_jsx(GestureDetector, {
    gesture: panGesture,
    children: /*#__PURE__*/_jsx(Host, {
      ref: ref,
      accessibilityActions: accessibilityActions,
      accessibilityLabel: accessibilityLabel,
      accessibilityRole: accessibilityRole,
      hitSlop: DRAG_AREA_HIT_SLOP,
      onAccessibilityAction: handleAccessibilityAction,
      onLayout: handleDragAreaLayout,
      ...restProps,
      children: children
    })
  });
});
DragArea.displayName = PRIMITIVE_DISPLAY_NAME.DRAG_AREA;

// --------------------------------------------------

const DragHandle = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    asChild,
    accessibilityElementsHidden = true,
    children,
    importantForAccessibility = 'no',
    ...restProps
  } = props;
  const Host = asChild ? Slot.View : View;
  return /*#__PURE__*/_jsx(Host, {
    ref: ref,
    accessibilityElementsHidden: accessibilityElementsHidden,
    importantForAccessibility: importantForAccessibility,
    ...restProps,
    children: children
  });
});
DragHandle.displayName = PRIMITIVE_DISPLAY_NAME.DRAG_HANDLE;

// --------------------------------------------------

export { BottomSection, DragArea, DragHandle, Root, TopSection };