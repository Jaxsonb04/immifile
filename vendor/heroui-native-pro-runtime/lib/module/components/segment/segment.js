"use strict";

import { Tabs, tabsClassNames, useTabsMeasurements, useTabsTrigger } from 'heroui-native/tabs';
import { forwardRef, useCallback, useMemo } from 'react';
import { useControllableState } from "../../helpers/internal/hooks/index.js";
import { createContext } from "../../helpers/internal/utils/index.js";
import { DEFAULT_SIZE, DISPLAY_NAME, TABS_SCROLL_VIEW_DISPLAY_NAME_FOR_LIST_LAYOUT } from "./segment.constants.js";
import { segmentClassNames } from "./segment.styles.js";
import { jsx as _jsx } from "react/jsx-runtime";
// --------------------------------------------------

const [SegmentProvider, useSegment] = createContext({
  errorMessage: 'Segment compound parts must render inside Segment',
  name: 'SegmentContext'
});
export { useSegment };

// --------------------------------------------------

const SegmentRoot = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    defaultValue,
    isDisabled = false,
    onValueChange,
    size = DEFAULT_SIZE,
    value,
    ...restTabsProps
  } = props;
  const [internalValue, setInternalValue] = useControllableState({
    defaultProp: defaultValue,
    onChange: onValueChange,
    prop: value
  });
  const resolvedSelectedValue = typeof internalValue === 'string' && internalValue.length > 0 ? internalValue : '';
  const handleValueChange = useCallback(next => {
    setInternalValue(next);
  }, [setInternalValue]);
  const rootClassName = segmentClassNames.root({
    className,
    isDisabled
  });
  const contextValue = useMemo(() => ({
    isDisabled,
    onValueChange: handleValueChange,
    size,
    value: resolvedSelectedValue
  }), [handleValueChange, isDisabled, resolvedSelectedValue, size]);
  return /*#__PURE__*/_jsx(SegmentProvider, {
    value: contextValue,
    children: /*#__PURE__*/_jsx(Tabs, {
      ...restTabsProps,
      ref: ref,
      className: rootClassName,
      value: resolvedSelectedValue,
      variant: "primary",
      onValueChange: handleValueChange,
      children: children
    })
  });
});

// --------------------------------------------------

const SegmentGroup = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const {
    size
  } = useSegment();
  const segmentGroupClassName = segmentClassNames.group({
    size
  });
  const listClassName = tabsClassNames.list({
    className: [segmentGroupClassName, className],
    variant: 'primary'
  });
  return /*#__PURE__*/_jsx(Tabs.List, {
    ref: ref,
    className: listClassName,
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

const SegmentScrollView = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    contentContainerClassName,
    ...restProps
  } = props;
  const {
    size
  } = useSegment();
  const scrollClassName = tabsClassNames.scrollView({
    className: [segmentClassNames.scrollView({
      size
    }), className],
    variant: 'primary'
  });
  const contentClassName = tabsClassNames.scrollViewContentContainer({
    className: [segmentClassNames.scrollViewContentContainer({
      size
    }), contentContainerClassName],
    variant: 'primary'
  });
  return /*#__PURE__*/_jsx(Tabs.ScrollView, {
    ref: ref,
    className: scrollClassName,
    contentContainerClassName: contentClassName,
    ...restProps,
    children: children
  });
});
SegmentScrollView.displayName = TABS_SCROLL_VIEW_DISPLAY_NAME_FOR_LIST_LAYOUT;

// --------------------------------------------------

const SegmentIndicator = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const {
    size
  } = useSegment();
  const {
    isScrollView,
    variant
  } = useTabsMeasurements();
  const segmentIndicatorClassName = segmentClassNames.indicator({
    isScrollView,
    size
  });
  const indicatorClassName = tabsClassNames.indicator({
    className: [segmentIndicatorClassName, className],
    isScrollView,
    variant
  });
  return /*#__PURE__*/_jsx(Tabs.Indicator, {
    ref: ref,
    className: indicatorClassName,
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

const SegmentItem = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    isDisabled = false,
    value: segmentValue,
    ...restTriggerProps
  } = props;
  const {
    isDisabled: rootDisabled,
    size
  } = useSegment();
  const resolvedDisabled = rootDisabled === true ? true : isDisabled;
  const triggerClassName = tabsClassNames.trigger({
    className: [segmentClassNames.item({
      size,
      isDisabled: resolvedDisabled
    }), className],
    isDisabled: resolvedDisabled
  });
  return /*#__PURE__*/_jsx(Tabs.Trigger, {
    ref: ref,
    className: triggerClassName,
    isDisabled: resolvedDisabled,
    value: segmentValue,
    ...restTriggerProps,
    children: children
  });
});

// --------------------------------------------------

const SegmentLabel = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const {
    isSelected
  } = useTabsTrigger();
  const {
    size
  } = useSegment();
  const labelClassName = tabsClassNames.label({
    className: segmentClassNames.label({
      className,
      size
    }),
    isSelected
  });
  return /*#__PURE__*/_jsx(Tabs.Label, {
    ref: ref,
    className: labelClassName,
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

const SegmentSeparator = /*#__PURE__*/forwardRef((props, ref) => {
  return /*#__PURE__*/_jsx(Tabs.Separator, {
    ref: ref,
    ...props
  });
});

// --------------------------------------------------

SegmentRoot.displayName = DISPLAY_NAME.ROOT;
SegmentGroup.displayName = DISPLAY_NAME.GROUP;
SegmentIndicator.displayName = DISPLAY_NAME.INDICATOR;
SegmentItem.displayName = DISPLAY_NAME.ITEM;
SegmentLabel.displayName = DISPLAY_NAME.LABEL;
SegmentSeparator.displayName = DISPLAY_NAME.SEPARATOR;

/**
 * Compound `Segment` segmented control built on top of HeroUI Native `Tabs`
 * (`variant="primary"` only).
 *
 * @component Segment - Bridges controlled / uncontrolled value via optional
 * `value`, `defaultValue`, and `onValueChange`; cascades optional root
 * `isDisabled`; applies `sm` | `md` | `lg` sizing everywhere.
 *
 * @component Segment.Group — Row container for triggers (alias of `Tabs.List`).
 *
 * @component Segment.ScrollView — Optional horizontally scrollable row alias
 * of `Tabs.ScrollView`. Display name preserves Tabs list scroll detection.
 *
 * @component Segment.Indicator — Animated pill indicator (`Tabs.Indicator`).
 *
 * @component Segment.Item — Selectable chip (`Tabs.Trigger`); merges root
 * `isDisabled`.
 *
 * @component Segment.Label — Text label styling (`Tabs.Label`).
 *
 * @component Segment.Separator — Divider with `betweenValues` visibility logic
 * (`Tabs.Separator`).
 *
 * Selection state mirrors `Tabs` (`value`, `defaultValue`, `onValueChange`).
 * Use `animation`/`isAnimatedStyleActive` on Indicator & Separator identical to Tabs.
 *
 * Props flow via `Tabs` internals for selection measurements and via
 * `SegmentContext` for shared sizing/disable flags.
 *
 */
const Segment = Object.assign(SegmentRoot, {
  Group: SegmentGroup,
  Indicator: SegmentIndicator,
  Item: SegmentItem,
  Label: SegmentLabel,
  ScrollView: SegmentScrollView,
  Separator: SegmentSeparator
});
export default Segment;