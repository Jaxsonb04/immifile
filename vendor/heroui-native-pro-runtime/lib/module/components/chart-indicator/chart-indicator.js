"use strict";

import { useCSSVariable } from 'uniwind';
import ReactNativeSkiaPackage from "../../optional/react-native-skia.js";
import { DEFAULT_INDICATOR_RADIUS, DISPLAY_NAME, INDICATOR_OUTER_RADIUS } from "./chart-indicator.constants.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// --------------------------------------------------

const {
  Circle,
  Group
} = ReactNativeSkiaPackage ?? {};

/**
 * Themed Skia double-dot (outer halo + inner) at chart-press coordinates from
 * `useChartPressState`.
 *
 * Render inside any cartesian chart's Skia children (e.g. `LineChart`, `AreaChart`, `BarChart`)
 * after wiring `chartPressState` on the chart root.
 */
function ChartIndicator(props) {
  const {
    x,
    y,
    innerRadius,
    outerRadius,
    outerColor,
    innerColor,
    ...restCircleProps
  } = props;
  const backgroundToken = useCSSVariable('--color-background');
  const chart3Token = useCSSVariable('--color-chart-3');
  const resolvedOuter = outerColor ?? backgroundToken;
  const resolvedInner = innerColor ?? chart3Token;
  const resolvedInnerR = innerRadius ?? DEFAULT_INDICATOR_RADIUS;
  const resolvedOuterR = outerRadius ?? INDICATOR_OUTER_RADIUS;
  return /*#__PURE__*/_jsxs(Group, {
    children: [/*#__PURE__*/_jsx(Circle, {
      color: resolvedOuter,
      cx: x,
      cy: y,
      r: resolvedOuterR,
      style: "fill"
    }), /*#__PURE__*/_jsx(Circle, {
      ...restCircleProps,
      color: resolvedInner,
      cx: x,
      cy: y,
      r: resolvedInnerR
    })]
  });
}
ChartIndicator.displayName = DISPLAY_NAME.ROOT;
export default ChartIndicator;