"use strict";

import { View } from 'react-native';
import { withUniwind } from 'uniwind';
import { AnimationSettingsProvider, useAnimationSettings } from 'heroui-native/contexts';
import { useMemo } from 'react';
import { BaseCartesianChart } from "../../helpers/internal/components/index.js";
import VictoryNativePackage from "../../optional/victory-native.js";
import { useAreaChartRootAnimation } from "./area-chart.animation.js";
import { DEFAULT_AREA_COLOR_CLASSNAME, DEFAULT_AREA_OPACITY, DISPLAY_NAME } from "./area-chart.constants.js";
import areaChartClassNames from "./area-chart.styles.js";
import { jsx as _jsx } from "react/jsx-runtime";
// --------------------------------------------------

const {
  Area,
  AreaRange,
  StackedArea
} = VictoryNativePackage ?? {};
const StyledArea = withUniwind(Area);

// --------------------------------------------------

function AreaChartRoot(props) {
  const {
    ref,
    wrapperClassName,
    animation,
    children,
    ...cartesianProps
  } = props;
  const {
    isAllAnimationsDisabled
  } = useAreaChartRootAnimation({
    animation
  });
  const rootClassName = areaChartClassNames.root({
    className: wrapperClassName
  });
  const animationSettingsContextValue = useMemo(() => ({
    isAllAnimationsDisabled
  }), [isAllAnimationsDisabled]);
  return /*#__PURE__*/_jsx(View, {
    className: rootClassName,
    children: /*#__PURE__*/_jsx(BaseCartesianChart, {
      ref: ref,
      ...cartesianProps,
      children: args => /*#__PURE__*/_jsx(AnimationSettingsProvider, {
        value: animationSettingsContextValue,
        children: children(args)
      })
    })
  });
}

// --------------------------------------------------

function AreaChartArea(props) {
  const {
    colorClassName = DEFAULT_AREA_COLOR_CLASSNAME,
    opacity = DEFAULT_AREA_OPACITY,
    animate,
    ...restProps
  } = props;
  const {
    isAllAnimationsDisabled
  } = useAnimationSettings();
  return /*#__PURE__*/_jsx(StyledArea, {
    colorClassName: colorClassName,
    opacity: opacity,
    animate: isAllAnimationsDisabled ? undefined : animate,
    ...restProps
  });
}

// --------------------------------------------------

function AreaChartStackedArea(props) {
  const {
    animate,
    ...restProps
  } = props;
  const {
    isAllAnimationsDisabled
  } = useAnimationSettings();
  return /*#__PURE__*/_jsx(StackedArea, {
    animate: isAllAnimationsDisabled ? undefined : animate,
    ...restProps
  });
}

// --------------------------------------------------

function AreaChartAreaRange(props) {
  const {
    animate,
    ...restProps
  } = props;
  const {
    isAllAnimationsDisabled
  } = useAnimationSettings();
  return /*#__PURE__*/_jsx(AreaRange, {
    animate: isAllAnimationsDisabled ? undefined : animate,
    ...restProps
  });
}

// --------------------------------------------------

AreaChartRoot.displayName = DISPLAY_NAME.ROOT;
AreaChartArea.displayName = DISPLAY_NAME.AREA;
AreaChartStackedArea.displayName = DISPLAY_NAME.STACKED_AREA;
AreaChartAreaRange.displayName = DISPLAY_NAME.AREA_RANGE;

// --------------------------------------------------

/**
 * Compound `AreaChart` wrapping victory-native `CartesianChart` with a themed outer `View`.
 *
 * Provides Uniwind-styled area fills, stacked areas, and range bands — all rendered through Skia,
 * bridged into the chart's Canvas reconciler via {@link AnimationSettingsProvider} so parts
 * rendered inside the render callback still see cascaded `isAllAnimationsDisabled` state.
 *
 * For press-driven overlays (indicator dot, vertical crosshair), use `ChartIndicator` and
 * `ChartCrosshair` from `heroui-native-pro` with `useChartPressState` — they are Skia
 * primitives in the same canvas as `AreaChart` children. Pair with `LineChart.Line` to draw
 * solid outline strokes on top of an area or stacked layer using its matching color.
 *
 * @component AreaChart — Renders `CartesianChart` inside a full-width `View`. Pass chart
 * dimensions on `wrapperClassName` (for example `h-72`). Forward `ref` to access the Skia canvas
 * and press actions through `CartesianChartRef`. Accepts an `animation` prop typed as
 * {@link AreaChartRootAnimation} for cascading `"disable-all"` to animated compound parts.
 *
 * @component AreaChart.Area — Themed Skia area series. Defaults `colorClassName` to `accent-chart-3`
 * and `opacity` to `0.2`. Respects cascaded `isAllAnimationsDisabled`: when disabled at the root,
 * the `animate` prop is dropped so data-change path interpolation is skipped.
 *
 * @component AreaChart.StackedArea — victory-native stacked area layers from an ordered `points`
 * array (bottom-most series first). Pass a parallel `colors` array in the same stack order, and
 * an `areaOptions` callback to customize each layer — typically by attaching a per-layer Skia
 * `LinearGradient` as `children` (the callback receives `{ rowIndex, lowestY, highestY }` to
 * size the gradient against the layer's stacked extent). Respects cascaded
 * `isAllAnimationsDisabled`: `animate` is dropped when the root cascade disables animations.
 *
 * @component AreaChart.AreaRange — Shaded band between an upper and lower series. Supply
 * either `upperPoints` + `lowerPoints` (sourced from the chart's render callback) or a single
 * `points` array typed as `AreaRangePointsArray` (`y` is the upper bound, `y0` the lower).
 * Useful for confidence intervals or min/max ranges around a central line — pair with
 * `LineChart.Line` rendered after the band to draw the central tendency on top. Respects
 * cascaded `isAllAnimationsDisabled`.
 */
const AreaChart = Object.assign(AreaChartRoot, {
  /** Theme-styled area series; uses Uniwind `colorClassName` for fill color. */
  Area: AreaChartArea,
  /** Stacked area layers from an ordered `points` array (bottom to top). */
  StackedArea: AreaChartStackedArea,
  /** Range band between an upper and a lower series; supports `upperPoints`/`lowerPoints` or a packed `AreaRangePointsArray`. */
  AreaRange: AreaChartAreaRange
});
export default AreaChart;