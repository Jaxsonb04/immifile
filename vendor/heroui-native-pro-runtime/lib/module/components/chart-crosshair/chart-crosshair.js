"use strict";

import { colorKit, useThemeColor } from 'heroui-native';
import { forwardRef, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { ReText } from "../../helpers/internal/components/index.js";
import { createContext } from "../../helpers/internal/utils/index.js";
import ReactNativeSkiaPackage from "../../optional/react-native-skia.js";
import { DEFAULT_CROSSHAIR_DASH_INTERVALS, DEFAULT_CROSSHAIR_STROKE_WIDTH, DISPLAY_NAME } from "./chart-crosshair.constants.js";
import { chartCrosshairClassNames } from "./chart-crosshair.styles.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// --------------------------------------------------

const {
  DashPathEffect,
  Path,
  Skia
} = ReactNativeSkiaPackage ?? {};

/**
 * Crosshair layout context: supplied only by {@link ChartCrosshair.Anchor}. {@link ChartCrosshair.Value}
 * consumes it via {@link useChartCrosshairAnchor} (strict).
 */
const [ChartCrosshairAnchorProvider, useChartCrosshairAnchor] = createContext({
  errorMessage: 'useChartCrosshairAnchor: `context` is undefined. Wrap content in `ChartCrosshair.Anchor`.',
  name: 'ChartCrosshairAnchorContext',
  strict: true
});

// --------------------------------------------------

const [ChartCrosshairValueProvider, useChartCrosshairValue] = createContext({
  errorMessage: 'useChartCrosshairValue: `context` is undefined. Wrap content in `ChartCrosshair.Value`.',
  name: 'ChartCrosshairValueContext'
});

// --------------------------------------------------

/**
 * Themed Skia vertical rule at a chart-press x-coordinate (dashed by default).
 *
 * Render inside any cartesian chart's Skia children together with {@link ChartIndicator} when
 * using `useChartPressState`.
 */
function ChartCrosshairSkia(props) {
  const {
    x,
    top,
    bottom,
    color,
    strokeWidth = DEFAULT_CROSSHAIR_STROKE_WIDTH,
    variant = 'dashed',
    children,
    ...restPathProps
  } = props;
  const mutedColor = useThemeColor('muted');
  const pathColor = colorKit.setAlpha(mutedColor, 0.4).hex();
  const crosshairPath = useDerivedValue(() => {
    const path = Skia.Path.Make();
    path.moveTo(x.get(), top);
    path.lineTo(x.get(), bottom);
    return path;
  });
  return /*#__PURE__*/_jsxs(Path, {
    ...restPathProps,
    color: color ?? pathColor,
    strokeWidth: strokeWidth,
    path: crosshairPath,
    style: "stroke",
    children: [variant === 'dashed' ? /*#__PURE__*/_jsx(DashPathEffect, {
      intervals: DEFAULT_CROSSHAIR_DASH_INTERVALS
    }) : null, children]
  });
}
ChartCrosshairSkia.displayName = DISPLAY_NAME.ROOT;

// --------------------------------------------------

const ChartCrosshairValueRoot = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    classNames,
    offset,
    style,
    styles: stylesProp,
    placement = 'top',
    value,
    variant = 'default',
    ...restViewProps
  } = props;
  const anchor = useChartCrosshairAnchor();
  /**
   * Snapshot for horizontal clamping: same coordinate space as `anchor.x` (victory-native plot).
   * Not a `SharedValue`, so it is listed in `useAnimatedStyle` deps so clamping updates on layout.
   */
  const crosshairChartBounds = anchor.chartBounds;
  const chartCrosshairValueContextValue = useMemo(() => ({
    value
  }), [value]);
  const measuredWidth = useSharedValue(0);
  const measuredHeight = useSharedValue(0);
  const rContainerStyle = useAnimatedStyle(() => {
    const xValue = anchor.x?.get() ?? 0;
    const activeOpacity = anchor.isActive == null ? 1 : anchor.isActive.get() ? 1 : 0;
    const offsetTop = offset?.top ?? 0;
    const offsetBottom = offset?.bottom ?? 0;
    const offsetLeft = offset?.left ?? 0;
    const offsetRight = offset?.right ?? 0;
    const overlayWidth = measuredWidth.get();

    /** Uncentered horizontal position: overlay is `absolute left-0`; `translateX` is left edge X. */
    let translateLeft = xValue - overlayWidth / 2 + offsetLeft - offsetRight;
    const bounds = crosshairChartBounds;

    /**
     * When `chartBounds` is supplied (typically from `ChartCrosshair.Anchor`),
     * clamp so the overlay stays horizontally inside `[left, right]` and is not clipped
     * near the edges. If the overlay is wider than the plot, center it across the bounds.
     */
    if (bounds != null && Number.isFinite(bounds.left) && Number.isFinite(bounds.right)) {
      const innerLeft = bounds.left;
      const innerRight = bounds.right;
      const minTranslateLeft = innerLeft;
      const maxTranslateLeft = innerRight - overlayWidth;
      translateLeft = maxTranslateLeft >= minTranslateLeft ? Math.min(Math.max(translateLeft, minTranslateLeft), maxTranslateLeft) : (innerLeft + innerRight) / 2 - overlayWidth / 2;
    }
    const verticalInset = offsetTop - offsetBottom;
    if (placement === 'bottom') {
      return {
        opacity: activeOpacity,
        bottom: -verticalInset,
        transform: [{
          translateX: translateLeft
        }]
      };
    }
    return {
      opacity: activeOpacity,
      top: -measuredHeight.get() + verticalInset,
      transform: [{
        translateX: translateLeft
      }]
    };
  }, [anchor, crosshairChartBounds, offset, placement]);
  const onLayout = useCallback(event => {
    measuredWidth.set(event.nativeEvent.layout.width);
    measuredHeight.set(event.nativeEvent.layout.height);
  }, [measuredWidth, measuredHeight]);
  const {
    container,
    label
  } = chartCrosshairClassNames.value({
    variant
  });
  const containerClassName = container({
    className: [className, classNames?.container]
  });
  const labelSlotClassName = label({
    className: classNames?.label
  });
  return /*#__PURE__*/_jsx(ChartCrosshairValueProvider, {
    value: chartCrosshairValueContextValue,
    children: /*#__PURE__*/_jsx(Animated.View, {
      ref: ref,
      className: containerClassName,
      style: [rContainerStyle, stylesProp?.container, style],
      onLayout: onLayout,
      ...restViewProps,
      children: children ?? /*#__PURE__*/_jsx(ChartCrosshairValueLabel, {
        className: labelSlotClassName,
        style: stylesProp?.label
      })
    })
  });
});
ChartCrosshairValueRoot.displayName = DISPLAY_NAME.VALUE;

// --------------------------------------------------

const ChartCrosshairValueLabel = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    className,
    style,
    ...restProps
  } = props;
  const ctx = useChartCrosshairValue();
  if (ctx.value === undefined) {
    return null;
  }
  const labelClassName = chartCrosshairClassNames.label({
    className
  });
  return /*#__PURE__*/_jsx(ReText, {
    ref: ref,
    className: labelClassName,
    style: style,
    text: ctx.value,
    ...restProps
  });
});
ChartCrosshairValueLabel.displayName = DISPLAY_NAME.VALUE_LABEL;

// --------------------------------------------------

const ChartCrosshairAnchorRoot = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    chartBounds,
    children,
    isActive,
    x,
    ...restViewProps
  } = props;
  const anchorContextValue = useMemo(() => ({
    chartBounds,
    isActive,
    x
  }), [chartBounds, isActive, x]);
  return /*#__PURE__*/_jsx(ChartCrosshairAnchorProvider, {
    value: anchorContextValue,
    children: /*#__PURE__*/_jsx(View, {
      ref: ref,
      ...restViewProps,
      children: children
    })
  });
});
ChartCrosshairAnchorRoot.displayName = DISPLAY_NAME.ANCHOR;

// --------------------------------------------------

/**
 * Compound chart crosshair API:
 *
 * @component ChartCrosshair — Skia vertical rule (`Path`); render **inside** the chart canvas with
 *   `useChartPressState`-driven shared values.
 * @component ChartCrosshair.Anchor — React Native wrapper around chart + RN value overlay;
 *   supplies horizontal position, bounds, and press activity via context.
 * @component ChartCrosshair.Value — Absolutely positioned Animated overlay hosting the tooltip value;
 *   **requires** {@link ChartCrosshair.Anchor}.
 * @component ChartCrosshair.ValueLabel — Read-only animated label driven by {@link ChartCrosshair.Value}
 *   `value` prop / {@link ChartCrosshairValueContextValue}.
 */
const ChartCrosshair = Object.assign(ChartCrosshairSkia, {
  Anchor: ChartCrosshairAnchorRoot,
  Value: ChartCrosshairValueRoot,
  ValueLabel: ChartCrosshairValueLabel
});
export default ChartCrosshair;
export { useChartCrosshairAnchor, useChartCrosshairValue };