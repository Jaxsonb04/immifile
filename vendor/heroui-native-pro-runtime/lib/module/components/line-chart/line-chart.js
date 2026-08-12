"use strict";

import { View } from 'react-native';
import { useCSSVariable, withUniwind } from 'uniwind';
import { AnimationSettingsProvider, useAnimationSettings } from 'heroui-native/contexts';
import { useMemo } from 'react';
import { BaseCartesianChart } from "../../helpers/internal/components/index.js";
import ReactNativeSkiaPackage from "../../optional/react-native-skia.js";
import VictoryNativePackage from "../../optional/victory-native.js";
import { useLineChartAnimatedLineAnimation, useLineChartRootAnimation } from "./line-chart.animation.js";
import { DEFAULT_LINE_COLOR_CLASSNAME, DEFAULT_LINE_STROKE_WIDTH, DISPLAY_NAME } from "./line-chart.constants.js";
import lineChartClassNames from "./line-chart.styles.js";
import { jsx as _jsx } from "react/jsx-runtime";
// --------------------------------------------------

const {
  Path
} = ReactNativeSkiaPackage ?? {};
const {
  Line,
  useLinePath
} = VictoryNativePackage ?? {};
const StyledLine = withUniwind(Line);

// --------------------------------------------------

function LineChartRoot(props) {
  const {
    ref,
    wrapperClassName,
    animation,
    children,
    ...cartesianProps
  } = props;
  const {
    isAllAnimationsDisabled
  } = useLineChartRootAnimation({
    animation
  });
  const rootClassName = lineChartClassNames.root({
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

function LineChartLine(props) {
  const {
    colorClassName = DEFAULT_LINE_COLOR_CLASSNAME,
    strokeWidth = DEFAULT_LINE_STROKE_WIDTH,
    animate,
    ...restProps
  } = props;
  const {
    isAllAnimationsDisabled
  } = useAnimationSettings();
  return /*#__PURE__*/_jsx(StyledLine, {
    colorClassName: colorClassName,
    strokeWidth: strokeWidth,
    animate: isAllAnimationsDisabled ? undefined : animate,
    ...restProps
  });
}

// --------------------------------------------------

function LineChartAnimatedLine(props) {
  const {
    points,
    curveType,
    connectMissingData,
    animation,
    resetKey,
    color,
    strokeWidth = DEFAULT_LINE_STROKE_WIDTH,
    ...restPathProps
  } = props;
  const chart3Color = useCSSVariable('--color-chart-3');
  const {
    path
  } = useLinePath(points, {
    curveType,
    connectMissingData
  });
  const {
    progress
  } = useLineChartAnimatedLineAnimation({
    animation,
    resetKey
  });
  return /*#__PURE__*/_jsx(Path, {
    ...restPathProps,
    color: color ?? chart3Color,
    strokeWidth: strokeWidth,
    path: path,
    style: "stroke",
    start: 0,
    end: progress
  });
}

// --------------------------------------------------

LineChartRoot.displayName = DISPLAY_NAME.ROOT;
LineChartLine.displayName = DISPLAY_NAME.LINE;
LineChartAnimatedLine.displayName = DISPLAY_NAME.ANIMATED_LINE;

// --------------------------------------------------

/**
 * Compound `LineChart` wrapping victory-native `CartesianChart` with a themed outer `View`.
 *
 * Provides Uniwind-styled line series and replayable draw-on animations — all rendered through
 * Skia, bridged into the chart's Canvas reconciler via {@link AnimationSettingsProvider} so
 * parts rendered inside the render callback still see cascaded `isAllAnimationsDisabled` state.
 *
 * For press-driven overlays (indicator dot, vertical crosshair), use `ChartIndicator` and
 * `ChartCrosshair` from `heroui-native-pro` with `useChartPressState` — they are Skia
 * primitives in the same canvas as `LineChart` children.
 *
 * @component LineChart — Renders `CartesianChart` inside a full-width `View`. Pass chart
 * dimensions on `wrapperClassName` (for example `h-72`). Forward `ref` to access the Skia canvas
 * and press actions through `CartesianChartRef`. Accepts an `animation` prop typed as
 * {@link LineChartRootAnimation} for cascading `"disable-all"` to animated compound parts.
 *
 * @component LineChart.Line — Themed Skia line series. Defaults to `strokeWidth` 2 and
 * `colorClassName` `accent-chart-3`; override `colorClassName` with any other `accent-*`
 * utility (e.g. `accent-chart-1`, `accent-danger`). Respects cascaded `isAllAnimationsDisabled`:
 * when disabled at the root, the `animate` prop is dropped so data-change path interpolation
 * is skipped.
 *
 * @component LineChart.AnimatedLine — Replayable draw-on line. Accepts a `resetKey` prop whose
 * identity change (plus the initial mount) sweeps the Skia `Path.end` trim from
 * `animation.progress[0]` to `animation.progress[1]` (default `[0, 1]`) using the provided
 * `animation` config. Useful when a chart is revealed after a filter/tab change or when the
 * consumer wants an on-demand "replay animation" affordance.
 */
const LineChart = Object.assign(LineChartRoot, {
  /** Theme-styled line series; uses Uniwind `colorClassName` for stroke color. */
  Line: LineChartLine,
  /** Replayable draw-on line with a `resetKey` trigger to re-play the entrance animation. */
  AnimatedLine: LineChartAnimatedLine
});
export default LineChart;