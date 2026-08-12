"use strict";

import { colorKit, useThemeColor } from 'heroui-native';
import { AnimationSettingsProvider, useAnimationSettings } from 'heroui-native/contexts';
import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useDerivedValue } from 'react-native-reanimated';
import { useThemeColorPro } from "../../helpers/external/hooks/index.js";
import { BasePolarChart } from "../../helpers/internal/components/index.js";
import { createContext } from "../../helpers/internal/utils/index.js";
import ReactNativeSkiaPackage from "../../optional/react-native-skia.js";
import VictoryNativePackage from "../../optional/victory-native.js";
import { useRadarChartRootAnimation } from "./radar-chart.animation.js";
import { DEFAULT_AXIS_FONT_SIZE, DEFAULT_DOT_RADIUS, DEFAULT_FILL_OPACITY, DEFAULT_FONT_FAMILY, DEFAULT_GRID_STROKE_ALPHA, DEFAULT_GRID_STROKE_WIDTH, DEFAULT_LABEL_RADIUS_OFFSET, DEFAULT_NUM_TICKS, DEFAULT_RADAR_STROKE_WIDTH, DEFAULT_RADIUS_AXIS_ANGLE, DEFAULT_RADIUS_AXIS_INCLUDE_ZERO, DEFAULT_RADIUS_AXIS_ORIENTATION, DEFAULT_RADIUS_PADDING, DISPLAY_NAME } from "./radar-chart.constants.js";
import radarChartClassNames from "./radar-chart.styles.js";
import { buildAxisTicks, buildCirclePath, buildPolygonPath, coerceNumericValue, getAngleLabelAlignment, getCategoryAngles, getMaxValueForKey, polarToCartesian } from "./radar-chart.utils.js";

// --------------------------------------------------
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const {
  Circle,
  Group,
  matchFont,
  Path,
  Skia,
  Text
} = ReactNativeSkiaPackage ?? {};
const {
  useAnimatedPath
} = VictoryNativePackage ?? {};

/**
 * Default Skia font shared by `RadarChart.AngleAxis` and `RadarChart.RadiusAxis`. Built once at
 * module load so subcomponents don't recreate it per render — pass an explicit `font` prop to
 * override per-axis.
 */
const DEFAULT_AXIS_FONT = matchFont?.({
  fontFamily: DEFAULT_FONT_FAMILY,
  fontSize: DEFAULT_AXIS_FONT_SIZE,
  fontStyle: 'normal',
  fontWeight: 'normal'
});

// --------------------------------------------------

const [RadarChartLayoutProvider, useRadarChartLayoutContext] = createContext({
  errorMessage: 'useRadarChartLayoutContext: `context` is undefined. Wrap content in `RadarChart`.',
  name: 'RadarChartLayoutContext',
  strict: false
});

/**
 * Reads the layout context and derives the geometry every subcomponent needs. Returns
 * `hasLayout: false` until the canvas has been measured so consumers skip rendering early.
 */
function useRadarChartLayout() {
  const context = useRadarChartLayoutContext();
  return useMemo(() => {
    if (context === undefined) {
      return {
        angles: [],
        center: {
          x: 0,
          y: 0
        },
        data: [],
        dataKey: '',
        hasLayout: false,
        labelKey: '',
        maxValueOverride: undefined,
        outerRadius: 0
      };
    }
    const {
      canvasSize,
      data,
      dataKey,
      labelKey,
      maxValue
    } = context;
    const {
      width,
      height
    } = canvasSize;
    const hasLayout = width > 0 && height > 0 && data.length > 0;
    const center = {
      x: width / 2,
      y: height / 2
    };
    const outerRadius = hasLayout ? Math.min(width, height) / 2 * DEFAULT_RADIUS_PADDING : 0;
    const angles = getCategoryAngles(data.length);
    return {
      angles,
      center,
      data,
      dataKey,
      hasLayout,
      labelKey,
      maxValueOverride: maxValue,
      outerRadius
    };
  }, [context]);
}

// --------------------------------------------------

function RadarChartRoot(props) {
  const {
    animation,
    children,
    data,
    dataKey,
    labelKey,
    maxValue,
    wrapperClassName
  } = props;
  const [canvasSize, setCanvasSize] = useState({
    width: 0,
    height: 0
  });
  const rootClassName = radarChartClassNames.root({
    className: wrapperClassName
  });
  const {
    isAllAnimationsDisabled
  } = useRadarChartRootAnimation({
    animation
  });
  const onLayout = useCallback(event => {
    const {
      width,
      height
    } = event.nativeEvent.layout;
    setCanvasSize(prev => prev.width === width && prev.height === height ? prev : {
      width,
      height
    });
  }, []);

  /**
   * Cascade value published via {@link AnimationSettingsProvider}. `<Bridge>` inside
   * `PolarChart` tunnels it into the Skia reconciler so {@link RadarChartRadar} can read it
   * with `useAnimationSettings()` and drop `animate` when the cascade fires.
   */
  const animationSettingsContextValue = useMemo(() => ({
    isAllAnimationsDisabled
  }), [isAllAnimationsDisabled]);

  /**
   * Layout context carrying static keys + measured canvas size. `String(...)` narrows the
   * generic key types back to plain `string` to match the context shape — both values are
   * always strings at runtime, so the coercion is a pure type fix.
   */
  const layoutContextValue = useMemo(() => ({
    canvasSize,
    data,
    dataKey: String(dataKey),
    labelKey: String(labelKey),
    maxValue
  }), [canvasSize, data, dataKey, labelKey, maxValue]);
  return /*#__PURE__*/_jsx(AnimationSettingsProvider, {
    value: animationSettingsContextValue,
    children: /*#__PURE__*/_jsx(RadarChartLayoutProvider, {
      value: layoutContextValue,
      children: /*#__PURE__*/_jsx(View, {
        className: rootClassName,
        onLayout: onLayout,
        children: /*#__PURE__*/_jsx(BasePolarChart, {
          data: data,
          labelKey: labelKey,
          valueKey: dataKey,
          colorKey: labelKey,
          children: children
        })
      })
    })
  });
}

// --------------------------------------------------

function RadarChartGrid(props) {
  const {
    numTicks = DEFAULT_NUM_TICKS,
    shape = 'polygon',
    showSpokes = true,
    strokeColor,
    strokeWidth = DEFAULT_GRID_STROKE_WIDTH
  } = props;
  const mutedColor = useThemeColor('muted');
  const resolvedStrokeColor = strokeColor ?? colorKit.setAlpha(mutedColor, DEFAULT_GRID_STROKE_ALPHA).hex();
  const layout = useRadarChartLayout();
  const {
    angles,
    center,
    hasLayout,
    outerRadius
  } = layout;
  const ringPaths = useMemo(() => {
    if (!hasLayout || numTicks <= 0) {
      return [];
    }
    const ringRadii = Array.from({
      length: numTicks
    }, (_, index) => (index + 1) / numTicks * outerRadius);
    return ringRadii.map(radius => {
      if (shape === 'circle') {
        return buildCirclePath(Skia, center, radius);
      }
      const vertices = angles.map(angle => polarToCartesian(center, radius, angle));
      return buildPolygonPath(Skia, vertices);
    }).filter(path => path !== null);
  }, [angles, center, hasLayout, numTicks, outerRadius, shape]);
  const spokePaths = useMemo(() => {
    if (!hasLayout || !showSpokes || Skia === undefined) {
      return [];
    }
    return angles.map(angle => {
      const endpoint = polarToCartesian(center, outerRadius, angle);
      const path = Skia.Path.Make();
      path.moveTo(center.x, center.y);
      path.lineTo(endpoint.x, endpoint.y);
      return path;
    }).filter(path => path !== null);
  }, [angles, center, hasLayout, outerRadius, showSpokes]);
  if (!hasLayout) {
    return null;
  }
  return /*#__PURE__*/_jsxs(Group, {
    children: [ringPaths.map((path, index) => /*#__PURE__*/_jsx(Path, {
      path: path,
      color: resolvedStrokeColor,
      strokeWidth: strokeWidth,
      style: "stroke"
    }, `radar-grid-ring-${index}`)), spokePaths.map((path, index) => /*#__PURE__*/_jsx(Path, {
      path: path,
      color: resolvedStrokeColor,
      strokeWidth: strokeWidth,
      style: "stroke"
    }, `radar-grid-spoke-${index}`))]
  });
}

// --------------------------------------------------

function RadarChartAngleAxis(props) {
  const {
    color,
    font,
    radiusOffset = DEFAULT_LABEL_RADIUS_OFFSET
  } = props;
  const mutedColor = useThemeColor('muted');
  const resolvedColor = color ?? mutedColor;
  const resolvedFont = font ?? DEFAULT_AXIS_FONT ?? null;
  const layout = useRadarChartLayout();
  const {
    angles,
    center,
    data,
    hasLayout,
    labelKey,
    outerRadius
  } = layout;

  // Metrics are font-only — read once per render, not per label. See `AngleLabelAlignment`.
  const fontMetrics = useMemo(() => resolvedFont !== null ? resolvedFont.getMetrics() : null, [resolvedFont]);
  if (!hasLayout || resolvedFont === null || fontMetrics === null) {
    return null;
  }
  const {
    ascent,
    descent
  } = fontMetrics;
  return /*#__PURE__*/_jsx(Group, {
    children: data.map((row, index) => {
      const angle = angles[index];
      if (angle === undefined) {
        return null;
      }
      const label = String(row[labelKey] ?? '');
      if (label === '') {
        return null;
      }
      const labelRadius = outerRadius * radiusOffset;
      const position = polarToCartesian(center, labelRadius, angle);
      const {
        offsetX,
        offsetY
      } = getAngleLabelAlignment(angle);
      const measuredWidth = resolvedFont.measureText(label).width;
      const textX = position.x + offsetX(measuredWidth);
      const textY = position.y + offsetY(ascent, descent);
      return /*#__PURE__*/_jsx(Text, {
        font: resolvedFont,
        text: label,
        x: textX,
        y: textY,
        color: resolvedColor
      }, `radar-angle-axis-${index}`);
    })
  });
}

// --------------------------------------------------

function RadarChartRadiusAxis(props) {
  const {
    angle = DEFAULT_RADIUS_AXIS_ANGLE,
    color,
    dataKey: dataKeyOverride,
    font,
    includeZero = DEFAULT_RADIUS_AXIS_INCLUDE_ZERO,
    numTicks = DEFAULT_NUM_TICKS,
    orientation = DEFAULT_RADIUS_AXIS_ORIENTATION,
    tickFormatter
  } = props;
  const mutedColor = useThemeColor('muted');
  const resolvedColor = color ?? mutedColor;
  const resolvedFont = font ?? DEFAULT_AXIS_FONT ?? null;
  const layout = useRadarChartLayout();
  const {
    center,
    data,
    dataKey,
    hasLayout,
    maxValueOverride,
    outerRadius
  } = layout;

  /**
   * Per-axis `dataKey` override mirrors `RadarChart.Radar`'s. Without it the auto-derived max
   * always reads the root's `dataKey`, which silently drifts from the polygon's scale when a
   * sibling `RadarChart.Radar` plots a different key. Multi-series setups should still pin
   * the scale with `maxValue` on the root — no single auto-derived key can satisfy every
   * polygon in that case.
   */
  const resolvedDataKey = dataKeyOverride ?? dataKey;

  /**
   * Effective scale upper bound — mirrors `RadarChart.Radar` so axis ticks and the radar
   * polygon always agree on what `1.0` means.
   */
  const maxValue = useMemo(() => maxValueOverride ?? getMaxValueForKey(data, resolvedDataKey), [maxValueOverride, data, resolvedDataKey]);

  /**
   * `{ value, radius }` descriptors for each tick. Outer ticks map 1-to-1 with grid rings
   * (`((i + 1) / numTicks) * outerRadius`). With `includeZero` we prepend a synthetic center
   * tick so the render flow stays a single `.map`.
   */
  const renderedTicks = useMemo(() => {
    const outer = buildAxisTicks(maxValue, numTicks).map((value, index) => ({
      value,
      radius: (index + 1) / numTicks * outerRadius
    }));
    if (!includeZero) {
      return outer;
    }
    return [{
      value: 0,
      radius: 0
    }, ...outer];
  }, [maxValue, numTicks, outerRadius, includeZero]);

  // Read once per render — same rationale as AngleAxis.
  const fontMetrics = useMemo(() => resolvedFont !== null ? resolvedFont.getMetrics() : null, [resolvedFont]);
  if (!hasLayout || resolvedFont === null || fontMetrics === null || renderedTicks.length === 0) {
    return null;
  }

  // User-facing degrees CW from north → radians (the convention shared by all polar helpers).
  const angleRad = angle * Math.PI / 180;
  const {
    ascent,
    descent
  } = fontMetrics;
  // Vertically center the label on its endpoint. Same baseline math as `AngleLabelAlignment`.
  const baselineOffset = -(ascent + descent) / 2;
  return /*#__PURE__*/_jsx(Group, {
    children: renderedTicks.map(({
      value: tickValue,
      radius: tickRadius
    }, index) => {
      const position = polarToCartesian(center, tickRadius, angleRad);
      const labelText = tickFormatter ? tickFormatter(tickValue) : String(Math.round(tickValue));
      const measuredWidth = resolvedFont.measureText(labelText).width;

      // Horizontal anchor — see `RadarChartRadiusAxisOrientation` for the three options.
      let horizontalOffset;
      if (orientation === 'left') {
        horizontalOffset = -measuredWidth;
      } else if (orientation === 'middle') {
        horizontalOffset = -measuredWidth / 2;
      } else {
        horizontalOffset = 0;
      }

      /**
       * Rotate each tick around its position by `angleRad`. In our CW-from-north convention
       * this matches Recharts' `rotate(90 - angle, cx, cy)` so labels always read along the
       * spoke direction (at `angle=90` east, labels run top-to-bottom).
       */
      return /*#__PURE__*/_jsx(Group, {
        transform: [{
          rotate: angleRad
        }],
        origin: position,
        children: /*#__PURE__*/_jsx(Text, {
          font: resolvedFont,
          text: labelText,
          x: position.x + horizontalOffset,
          y: position.y + baselineOffset,
          color: resolvedColor
        })
      }, `radar-radius-axis-${index}`);
    })
  });
}

// --------------------------------------------------

function RadarChartRadar(props) {
  const layout = useRadarChartLayout();
  const {
    angles,
    center,
    data,
    dataKey,
    hasLayout,
    maxValueOverride,
    outerRadius
  } = layout;
  const {
    dataKey: dataKeyOverride
  } = props;
  const resolvedDataKey = dataKeyOverride ?? dataKey;

  /**
   * Effective scale upper bound. Root `maxValue` wins when supplied (keeps multi-series radars
   * on a shared, stable scale); otherwise falls back to the data-derived max for this series.
   */
  const maxValue = useMemo(() => maxValueOverride ?? getMaxValueForKey(data, resolvedDataKey), [maxValueOverride, data, resolvedDataKey]);
  const vertices = useMemo(() => {
    if (!hasLayout || maxValue <= 0) {
      return [];
    }
    return data.map((row, index) => {
      const angle = angles[index] ?? 0;
      const rawValue = coerceNumericValue(row[resolvedDataKey]);
      /**
       * Clamp to `[0, 1]` so values outside the radial domain stay visually sane: negatives
       * collapse to the center instead of flipping to the opposite spoke (`polarToCartesian`
       * with a negative radius rotates the vertex by 180°), and values above an explicit
       * `maxValue` cap at the outer ring instead of painting beyond the grid.
       */
      const ratio = Math.max(0, Math.min(1, rawValue / maxValue));
      const radius = outerRadius * ratio;
      return polarToCartesian(center, radius, angle);
    });
  }, [angles, center, data, hasLayout, maxValue, outerRadius, resolvedDataKey]);
  const polygonPath = useMemo(() => buildPolygonPath(Skia, vertices), [vertices]);
  if (polygonPath === null) {
    return null;
  }
  return /*#__PURE__*/_jsx(RadarChartRadarPath, {
    ...props,
    path: polygonPath,
    vertices: vertices
  });
}

/**
 * Inner Skia renderer for a single radar series. Split from {@link RadarChartRadar} so the
 * parent can early-return when polygon geometry is unavailable without violating Rules of
 * Hooks (`useAnimatedPath` requires a non-null `SkPath`).
 */
function RadarChartRadarPath(props) {
  const {
    animate,
    color,
    dotRadius = DEFAULT_DOT_RADIUS,
    fillOpacity = DEFAULT_FILL_OPACITY,
    path,
    showDots = false,
    showStroke = true,
    strokeWidth = DEFAULT_RADAR_STROKE_WIDTH,
    vertices
  } = props;
  const {
    isAllAnimationsDisabled
  } = useAnimationSettings();
  const chart3Color = useThemeColorPro('chart-3');
  const resolvedColor = color ?? chart3Color;

  /**
   * Spring / timing path interpolation. Passing `undefined` for the config when cascaded off
   * keeps the hook running (Rules of Hooks) but snaps to the latest path instead of animating.
   */
  const animatedPath = useAnimatedPath(path, isAllAnimationsDisabled ? undefined : animate);
  return /*#__PURE__*/_jsxs(Group, {
    children: [/*#__PURE__*/_jsx(Path, {
      path: animatedPath,
      color: resolvedColor,
      style: "fill",
      opacity: fillOpacity
    }), showStroke ? /*#__PURE__*/_jsx(Path, {
      path: animatedPath,
      color: resolvedColor,
      style: "stroke",
      strokeWidth: strokeWidth,
      strokeJoin: "round"
    }) : null, showDots ? vertices.map((vertex, index) => /*#__PURE__*/_jsx(RadarChartRadarDot, {
      animatedPath: animatedPath,
      color: resolvedColor,
      fallback: vertex,
      index: index,
      radius: dotRadius
    }, `radar-dot-${index}`)) : null]
  });
}

/**
 * Vertex dot that tracks the animating polygon's interpolated geometry frame-by-frame.
 *
 * `useAnimatedPath` returns a `DerivedValue<SkPath>` whose vertices interpolate between the
 * previous and target paths. Reading `getPoint(index)` from that derived value via two
 * `useDerivedValue`s keeps the dot's `cx` / `cy` synchronized with the polygon's animating
 * fill + stroke (each `<RadarChart.Radar>` series gets its own dot instances, so hooks are
 * called from a component — never inside a `.map` callback — to satisfy Rules of Hooks).
 *
 * `fallback` is the target vertex computed on the JS thread. It's only used during the brief
 * window when paths can't be interpolated (e.g. category count changes mid-render), where
 * `useAnimatedPath` snaps between `from` / `to` and the inactive side may not yet expose
 * `getPoint(index)`. In steady state the path always has `vertices.length` points so the
 * fallback never fires.
 */
function RadarChartRadarDot(props) {
  const {
    animatedPath,
    color,
    fallback,
    index,
    radius
  } = props;
  const cx = useDerivedValue(() => {
    const currentPath = animatedPath.value;
    if (index >= currentPath.countPoints()) {
      return fallback.x;
    }
    return currentPath.getPoint(index).x;
  });
  const cy = useDerivedValue(() => {
    const currentPath = animatedPath.value;
    if (index >= currentPath.countPoints()) {
      return fallback.y;
    }
    return currentPath.getPoint(index).y;
  });
  return /*#__PURE__*/_jsx(Circle, {
    cx: cx,
    cy: cy,
    r: radius,
    color: color
  });
}

// --------------------------------------------------

RadarChartRoot.displayName = DISPLAY_NAME.ROOT;
RadarChartGrid.displayName = DISPLAY_NAME.GRID;
RadarChartAngleAxis.displayName = DISPLAY_NAME.ANGLE_AXIS;
RadarChartRadiusAxis.displayName = DISPLAY_NAME.RADIUS_AXIS;
RadarChartRadar.displayName = DISPLAY_NAME.RADAR;

// --------------------------------------------------

/**
 * Compound `RadarChart` — themed `BasePolarChart` wrapper with a Skia-rendered radar geometry.
 *
 * @component RadarChart — Themed `PolarChart` wrapper. Pass chart dimensions on
 *   `wrapperClassName` (e.g. `h-[260px]`). Accepts an `animation` prop typed as
 *   {@link RadarChartRootAnimation} that cascades `"disable-all"` to animated compound parts.
 * @component RadarChart.Grid — Concentric rings (polygons by default) plus radial spokes.
 *   Renders nothing until the canvas has been measured.
 * @component RadarChart.AngleAxis — Skia text labels around the perimeter (one per row, from
 *   `labelKey`).
 * @component RadarChart.RadiusAxis — Numeric tick labels along the spoke at `angle` (defaults
 *   to 12 o'clock). Tick count defaults to `RadarChart.Grid`'s `numTicks`. Skip to render
 *   without explicit value annotations.
 * @component RadarChart.Radar — Filled + stroked polygon for one series. Pass `dataKey` to
 *   plot a numeric field other than the root's default; render multiple siblings for
 *   multi-series. Respects cascaded `isAllAnimationsDisabled` (drops `animate` when on).
 */
const RadarChart = Object.assign(RadarChartRoot, {
  /** @optional Concentric rings + radial spokes drawn behind the radar polygon. */
  Grid: RadarChartGrid,
  /** @optional Category labels rendered around the chart perimeter. */
  AngleAxis: RadarChartAngleAxis,
  /** @optional Numeric tick labels rendered along the 12 o'clock spoke. */
  RadiusAxis: RadarChartRadiusAxis,
  /** One filled + stroked polygon series. */
  Radar: RadarChartRadar
});
export default RadarChart;