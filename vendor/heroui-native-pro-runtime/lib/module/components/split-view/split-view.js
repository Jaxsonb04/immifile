"use strict";

import { AnimationSettingsProvider } from 'heroui-native/contexts';
import { forwardRef, useMemo } from 'react';
import Animated from 'react-native-reanimated';
import * as SplitViewPrimitives from "../../primitives/split-view/index.js";
import { useSplitViewDragHandleAnimation, useSplitViewRootAnimation, useSplitViewTopSectionAnimation } from "./split-view.animation.js";
import { DEFAULT_SNAP_SPRING_CONFIG, DISPLAY_NAME } from "./split-view.constants.js";
import { splitViewClassNames, splitViewStyleSheet } from "./split-view.styles.js";
import { jsx as _jsx } from "react/jsx-runtime";
const AnimatedSplitViewTopSection = Animated.createAnimatedComponent(SplitViewPrimitives.TopSection);
const AnimatedSplitViewDragHandle = Animated.createAnimatedComponent(SplitViewPrimitives.DragHandle);

// --------------------------------------------------

const SplitViewRoot = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    style,
    animation,
    ...restProps
  } = props;
  const {
    isAllAnimationsDisabled,
    snapSpringConfig
  } = useSplitViewRootAnimation({
    animation
  });
  const animationSettingsContextValue = useMemo(() => ({
    isAllAnimationsDisabled
  }), [isAllAnimationsDisabled]);
  const rootClassName = splitViewClassNames.root({
    className
  });
  const primitiveProps = {
    ...restProps,
    children,
    snapSpringConfig: snapSpringConfig ?? DEFAULT_SNAP_SPRING_CONFIG,
    isAllAnimationsDisabled,
    className: rootClassName,
    style: [splitViewStyleSheet.root, style]
  };
  return /*#__PURE__*/_jsx(AnimationSettingsProvider, {
    value: animationSettingsContextValue,
    children: /*#__PURE__*/_jsx(SplitViewPrimitives.Root, {
      ref: ref,
      ...primitiveProps
    })
  });
});

// --------------------------------------------------

const SplitViewTopSection = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    style,
    ...restProps
  } = props;
  const ctx = SplitViewPrimitives.useSplitView();
  const {
    rTopStyle
  } = useSplitViewTopSectionAnimation({
    topSectionHeight: ctx.topSectionHeight
  });
  const topSectionClassName = splitViewClassNames.topSection({
    className
  });
  return /*#__PURE__*/_jsx(AnimatedSplitViewTopSection, {
    ref: ref,
    className: topSectionClassName,
    style: [rTopStyle, style],
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

const SplitViewBottomSection = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const bottomSectionClassName = splitViewClassNames.bottomSection({
    className
  });
  return /*#__PURE__*/_jsx(SplitViewPrimitives.BottomSection, {
    ref: ref,
    className: bottomSectionClassName,
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

const SplitViewDragArea = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const dragAreaClassName = splitViewClassNames.dragArea({
    className
  });
  return /*#__PURE__*/_jsx(SplitViewPrimitives.DragArea, {
    ref: ref,
    className: dragAreaClassName,
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

const SplitViewDragHandle = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    style,
    animation,
    isAnimatedStyleActive = true,
    ...restProps
  } = props;
  const ctx = SplitViewPrimitives.useSplitView();
  const internal = SplitViewPrimitives.useSplitViewInternal();
  const {
    rHandleStyle
  } = useSplitViewDragHandleAnimation({
    animation,
    isDragging: ctx.isDragging,
    isAllAnimationsDisabled: internal.isAllAnimationsDisabled
  });
  const dragHandleClassName = splitViewClassNames.dragHandle({
    className
  });
  const handleStyle = isAnimatedStyleActive ? [rHandleStyle, style] : [style];
  return /*#__PURE__*/_jsx(AnimatedSplitViewDragHandle, {
    ref: ref,
    className: dragHandleClassName,
    style: [splitViewStyleSheet.dragHandle, handleStyle],
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

SplitViewRoot.displayName = DISPLAY_NAME.ROOT;
SplitViewTopSection.displayName = DISPLAY_NAME.TOP_SECTION;
SplitViewDragArea.displayName = DISPLAY_NAME.DRAG_AREA;
SplitViewDragHandle.displayName = DISPLAY_NAME.DRAG_HANDLE;
SplitViewBottomSection.displayName = DISPLAY_NAME.BOTTOM_SECTION;

/**
 * Compound SplitView component with sub-components
 *
 * @component SplitView - Vertical split layout with a draggable divider between a top and bottom section.
 * Snap points may be ratios (`0`..`1`) or px. Uses `react-native-reanimated` and gesture handler.
 *
 * @component SplitView.TopSection - Top pane; height is animated from drag and snap state.
 *
 * @component SplitView.DragArea - Pan gesture region; use `SplitView.DragHandle` inside for the default pill.
 *
 * @component SplitView.DragHandle - Visual handle; scales slightly while dragging when animations are enabled.
 *
 * @component SplitView.BottomSection - Bottom pane; fills remaining space below the drag area.
 *
 * Props flow via context (`useSplitView`) for `topSectionHeight`, `snapIndex`, `resolvedSnapPoints`, and more.
 */
const SplitView = Object.assign(SplitViewRoot, {
  TopSection: SplitViewTopSection,
  DragArea: SplitViewDragArea,
  DragHandle: SplitViewDragHandle,
  BottomSection: SplitViewBottomSection
});
export default SplitView;
export { useSplitView } from "../../primitives/split-view/index.js";