"use strict";

import { AnimationSettingsProvider } from 'heroui-native/contexts';
import { forwardRef, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedReaction, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { HeroText } from "../../helpers/internal/components/index.js";
import { createContext } from "../../helpers/internal/utils/index.js";
import { useChartTooltipAnchorRootAnimation, useChartTooltipRootAnimation } from "./chart-tooltip.animation.js";
import { DEFAULT_INDICATOR_VARIANT, DEFAULT_IS_VISIBLE, DEFAULT_PLACEMENT, DEFAULT_TOOLTIP_GAP, DISPLAY_NAME } from "./chart-tooltip.constants.js";
import chartTooltipClassNames from "./chart-tooltip.styles.js";
import { jsx as _jsx } from "react/jsx-runtime";
// --------------------------------------------------

const [ChartTooltipAnchorProvider, useChartTooltipAnchor] = createContext({
  errorMessage: 'useChartTooltipAnchor: `context` is undefined. Wrap content in `ChartTooltip.Anchor`.',
  name: 'ChartTooltipAnchorContext',
  strict: true
});

// --------------------------------------------------

const ChartTooltipAnchorRoot = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    animation,
    chartBounds,
    children,
    isActive,
    matchedIndex,
    x,
    y,
    ...restViewProps
  } = props;
  const {
    isAllAnimationsDisabled
  } = useChartTooltipAnchorRootAnimation({
    animation
  });
  const [activeIndex, setActiveIndex] = useState(null);
  useAnimatedReaction(() => {
    if (isActive == null || matchedIndex == null) {
      return null;
    }
    return {
      active: isActive.value,
      index: matchedIndex.value
    };
  }, current => {
    if (current == null) {
      scheduleOnRN(setActiveIndex, null);
      return;
    }
    const nextIndex = current.active ? Math.round(current.index) : null;
    scheduleOnRN(setActiveIndex, nextIndex);
  }, [isActive, matchedIndex]);
  const anchorContextValue = useMemo(() => ({
    activeIndex,
    chartBounds,
    isActive,
    x,
    y
  }), [activeIndex, chartBounds, isActive, x, y]);
  const animationSettingsContextValue = useMemo(() => ({
    isAllAnimationsDisabled
  }), [isAllAnimationsDisabled]);
  return /*#__PURE__*/_jsx(AnimationSettingsProvider, {
    value: animationSettingsContextValue,
    children: /*#__PURE__*/_jsx(ChartTooltipAnchorProvider, {
      value: anchorContextValue,
      children: /*#__PURE__*/_jsx(View, {
        ref: ref,
        ...restViewProps,
        children: children
      })
    })
  });
});
ChartTooltipAnchorRoot.displayName = DISPLAY_NAME.ANCHOR;

// --------------------------------------------------

const ChartTooltipRoot = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    animation,
    children,
    className,
    gap = DEFAULT_TOOLTIP_GAP,
    isVisible = DEFAULT_IS_VISIBLE,
    offset,
    placement = DEFAULT_PLACEMENT,
    style,
    ...restViewProps
  } = props;
  const anchor = useChartTooltipAnchor();
  const measuredWidth = useSharedValue(0);
  const measuredHeight = useSharedValue(0);
  const {
    rContainerStyle
  } = useChartTooltipRootAnimation({
    anchor,
    animation,
    gap,
    isVisible,
    measuredHeight,
    measuredWidth,
    offset,
    placement
  });
  const onLayout = useCallback(event => {
    measuredWidth.set(event.nativeEvent.layout.width);
    measuredHeight.set(event.nativeEvent.layout.height);
  }, [measuredHeight, measuredWidth]);
  if (isVisible === false) {
    return null;
  }
  const rootClassName = chartTooltipClassNames.root({
    className
  });
  return /*#__PURE__*/_jsx(Animated.View, {
    ref: ref,
    accessibilityLiveRegion: "polite",
    accessibilityRole: "summary",
    className: rootClassName,
    pointerEvents: "none",
    style: [rContainerStyle, style],
    onLayout: onLayout,
    ...restViewProps,
    children: children
  });
});
ChartTooltipRoot.displayName = DISPLAY_NAME.ROOT;

// --------------------------------------------------

const ChartTooltipHeader = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const headerClassName = chartTooltipClassNames.header({
    className
  });
  return /*#__PURE__*/_jsx(HeroText, {
    ref: ref,
    accessibilityRole: "header",
    className: headerClassName,
    ...restProps,
    children: children
  });
});
ChartTooltipHeader.displayName = DISPLAY_NAME.HEADER;

// --------------------------------------------------

const ChartTooltipItem = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const itemClassName = chartTooltipClassNames.item({
    className
  });
  return /*#__PURE__*/_jsx(View, {
    ref: ref,
    accessible: true,
    accessibilityRole: "text",
    className: itemClassName,
    ...restProps,
    children: children
  });
});
ChartTooltipItem.displayName = DISPLAY_NAME.ITEM;

// --------------------------------------------------

const ChartTooltipIndicator = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    className,
    color,
    style,
    variant = DEFAULT_INDICATOR_VARIANT,
    ...restProps
  } = props;
  const indicatorClassName = chartTooltipClassNames.indicator({
    className,
    variant
  });
  const indicatorStyle = color != null && color !== '' ? [{
    backgroundColor: color
  }, style] : style;
  return /*#__PURE__*/_jsx(View, {
    ref: ref,
    accessibilityElementsHidden: true,
    accessible: false,
    "aria-hidden": true,
    className: indicatorClassName,
    importantForAccessibility: "no-hide-descendants",
    style: indicatorStyle,
    ...restProps
  });
});
ChartTooltipIndicator.displayName = DISPLAY_NAME.INDICATOR;

// --------------------------------------------------

const ChartTooltipLabel = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const labelClassName = chartTooltipClassNames.label({
    className
  });
  return /*#__PURE__*/_jsx(HeroText, {
    ref: ref,
    accessibilityRole: "text",
    className: labelClassName,
    ...restProps,
    children: children
  });
});
ChartTooltipLabel.displayName = DISPLAY_NAME.LABEL;

// --------------------------------------------------

const ChartTooltipValue = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const valueClassName = chartTooltipClassNames.value({
    className
  });
  return /*#__PURE__*/_jsx(HeroText, {
    ref: ref,
    accessibilityRole: "text",
    className: valueClassName,
    ...restProps,
    children: children
  });
});
ChartTooltipValue.displayName = DISPLAY_NAME.VALUE;

// --------------------------------------------------

/**
 * Compound chart tooltip API:
 *
 * @component ChartTooltip — Floating card for multi-series press labels; **requires**
 *   {@link ChartTooltip.Anchor}.
 * @component ChartTooltip.Anchor — Relative wrapper supplying press coordinates, active index,
 *   and plot bounds.
 * @component ChartTooltip.Header — Optional title row (typically the X-axis category).
 * @component ChartTooltip.Item — One series row (indicator + label + value).
 * @component ChartTooltip.Indicator — Color swatch beside a series name.
 * @component ChartTooltip.Label — Series name within an item row.
 * @component ChartTooltip.Value — Formatted value within an item row.
 */
const ChartTooltip = Object.assign(ChartTooltipRoot, {
  Anchor: ChartTooltipAnchorRoot,
  Header: ChartTooltipHeader,
  Indicator: ChartTooltipIndicator,
  Item: ChartTooltipItem,
  Label: ChartTooltipLabel,
  Value: ChartTooltipValue
});
export default ChartTooltip;
export { useChartTooltipAnchor };