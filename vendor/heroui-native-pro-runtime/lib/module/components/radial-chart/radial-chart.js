"use strict";

import { useThemeColor } from 'heroui-native';
import { AnimationSettingsProvider, useAnimationSettings } from 'heroui-native/contexts';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useDerivedValue, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { BasePolarChart } from "../../helpers/internal/components/index.js";
import { createContext } from "../../helpers/internal/utils/index.js";
import ReactNativeSkiaPackage from "../../optional/react-native-skia.js";
import { useRadialChartRootAnimation } from "./radial-chart.animation.js";
import { DEFAULT_BAR_GAP, DEFAULT_BAR_SIZE, DEFAULT_CORNER_RADIUS, DEFAULT_DOMAIN, DEFAULT_END_ANGLE, DEFAULT_INNER_RADIUS, DEFAULT_OUTER_RADIUS, DEFAULT_RADIUS_PADDING, DEFAULT_START_ANGLE, DISPLAY_NAME } from "./radial-chart.constants.js";
import radialChartClassNames from "./radial-chart.styles.js";
import { buildArcPath, computeRadialBarSectors, getDomainSweepDegrees, isSkiaColor, polarAngleToSkiaDegrees, resolvePixelRadius, resolveRadialChartDomain } from "./radial-chart.utils.js";

// --------------------------------------------------
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const {
  Group,
  Path,
  Skia
} = ReactNativeSkiaPackage ?? {};

/** Empty path reused when sweep is zero — created once when Skia is available. */
const EMPTY_SK_PATH = Skia !== undefined ? Skia.Path.Make() : undefined;

// --------------------------------------------------

const [RadialChartLayoutProvider, useRadialChartLayoutContext] = createContext({
  errorMessage: 'useRadialChartLayoutContext: `context` is undefined. Wrap content in `RadialChart`.',
  name: 'RadialChartLayoutContext',
  strict: false
});

/**
 * Reads the layout context and derives the geometry {@link RadialChart.Bar} needs.
 */
function useRadialChartLayout() {
  const context = useRadialChartLayoutContext();
  return useMemo(() => {
    if (context === undefined) {
      return {
        barGap: DEFAULT_BAR_GAP,
        barSize: DEFAULT_BAR_SIZE,
        center: {
          x: 0,
          y: 0
        },
        colorKey: '',
        data: [],
        hasLayout: false,
        innerRadiusPx: 0,
        labelKey: '',
        maxRadius: 0,
        outerRadiusPx: 0,
        resolvedDomain: [0, 0],
        rootEndAngle: DEFAULT_END_ANGLE,
        rootStartAngle: DEFAULT_START_ANGLE,
        valueKey: ''
      };
    }
    const {
      barGap,
      barSize,
      canvasSize,
      colorKey,
      data,
      domain,
      endAngle,
      innerRadius,
      labelKey,
      outerRadius,
      startAngle,
      valueKey
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
    const maxRadius = hasLayout ? Math.min(width, height) / 2 * DEFAULT_RADIUS_PADDING : 0;
    const innerRadiusPx = resolvePixelRadius(innerRadius, maxRadius);
    const outerRadiusPx = resolvePixelRadius(outerRadius, maxRadius);
    const resolvedDomain = resolveRadialChartDomain(domain, data, String(valueKey));
    return {
      barGap,
      barSize,
      center,
      colorKey: String(colorKey),
      data,
      hasLayout,
      innerRadiusPx,
      labelKey: String(labelKey),
      maxRadius,
      outerRadiusPx,
      resolvedDomain,
      rootEndAngle: endAngle,
      rootStartAngle: startAngle,
      valueKey: String(valueKey)
    };
  }, [context]);
}

// --------------------------------------------------

function RadialChartRoot(props) {
  const {
    animation,
    barGap = DEFAULT_BAR_GAP,
    barSize = DEFAULT_BAR_SIZE,
    children,
    domain = DEFAULT_DOMAIN,
    endAngle = DEFAULT_END_ANGLE,
    innerRadius = DEFAULT_INNER_RADIUS,
    outerRadius = DEFAULT_OUTER_RADIUS,
    startAngle = DEFAULT_START_ANGLE,
    wrapperClassName,
    ...polarProps
  } = props;
  const [canvasSize, setCanvasSize] = useState({
    width: 0,
    height: 0
  });
  const rootClassName = radialChartClassNames.root({
    className: wrapperClassName
  });
  const {
    isAllAnimationsDisabled
  } = useRadialChartRootAnimation({
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
  const animationSettingsContextValue = useMemo(() => ({
    isAllAnimationsDisabled
  }), [isAllAnimationsDisabled]);
  const layoutContextValue = useMemo(() => ({
    barGap,
    barSize,
    canvasSize,
    colorKey: String(polarProps.colorKey),
    data: polarProps.data,
    domain,
    endAngle,
    innerRadius,
    labelKey: String(polarProps.labelKey),
    outerRadius,
    startAngle,
    valueKey: String(polarProps.valueKey)
  }), [barGap, barSize, canvasSize, domain, endAngle, innerRadius, outerRadius, polarProps.colorKey, polarProps.data, polarProps.labelKey, polarProps.valueKey, startAngle]);
  return /*#__PURE__*/_jsx(AnimationSettingsProvider, {
    value: animationSettingsContextValue,
    children: /*#__PURE__*/_jsx(RadialChartLayoutProvider, {
      value: layoutContextValue,
      children: /*#__PURE__*/_jsx(View, {
        className: rootClassName,
        onLayout: onLayout,
        children: /*#__PURE__*/_jsx(BasePolarChart, {
          ...polarProps,
          children: children
        })
      })
    })
  });
}

// --------------------------------------------------

/**
 * Single concentric ring with sweep-fill animation driven by an interpolated end angle.
 */
function RadialChartBarRing(props) {
  if (EMPTY_SK_PATH === undefined || Skia === undefined) {
    return null;
  }
  return /*#__PURE__*/_jsx(RadialChartBarRingImpl, {
    ...props,
    emptyPath: EMPTY_SK_PATH
  });
}
function RadialChartBarRingImpl(props) {
  const {
    animate,
    center,
    centerlineRadius,
    color,
    cornerRadius,
    emptyPath,
    endAngle,
    startAngle,
    strokeWidth
  } = props;
  const {
    isAllAnimationsDisabled
  } = useAnimationSettings();
  const animatedEndAngle = useSharedValue(startAngle);
  useEffect(() => {
    if (isAllAnimationsDisabled) {
      animatedEndAngle.set(endAngle);
      return;
    }
    if (animate?.type === 'spring') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- strip discriminant for Reanimated
      const {
        type,
        ...springConfig
      } = animate;
      animatedEndAngle.set(withSpring(endAngle, springConfig));
      return;
    }
    if (animate?.type === 'timing') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- strip discriminant for Reanimated
      const {
        type,
        ...timingConfig
      } = animate;
      animatedEndAngle.set(withTiming(endAngle, timingConfig));
      return;
    }
    animatedEndAngle.set(withSpring(endAngle));
  }, [animate, animatedEndAngle, endAngle, isAllAnimationsDisabled]);
  const animatedPath = useRadialChartAnimatedArcPath({
    animatedEndAngle,
    center,
    centerlineRadius,
    emptyPath,
    startAngle
  });
  const strokeCap = cornerRadius > 0 ? 'round' : undefined;
  return /*#__PURE__*/_jsx(Path, {
    path: animatedPath,
    color: color,
    style: "stroke",
    strokeWidth: strokeWidth,
    strokeCap: strokeCap,
    strokeJoin: strokeCap ?? 'miter'
  });
}
/**
 * Full-domain background track for a single ring.
 */
function RadialChartBarTrack(props) {
  const {
    center,
    centerlineRadius,
    cornerRadius,
    endAngle,
    startAngle,
    strokeWidth,
    trackColor
  } = props;
  const trackPath = useMemo(() => {
    const sweepDeg = getDomainSweepDegrees(startAngle, endAngle);
    const skiaStartAngleDeg = polarAngleToSkiaDegrees(startAngle);
    return buildArcPath(Skia, center, centerlineRadius, skiaStartAngleDeg, sweepDeg);
  }, [center, centerlineRadius, endAngle, startAngle]);
  const strokeCap = cornerRadius > 0 ? 'round' : undefined;
  if (trackPath === null) {
    return null;
  }
  return /*#__PURE__*/_jsx(Path, {
    path: trackPath,
    color: trackColor,
    style: "stroke",
    strokeWidth: strokeWidth,
    strokeCap: strokeCap,
    strokeJoin: strokeCap ?? 'miter'
  });
}

/**
 * Builds a UI-thread `SkPath` from an animated end angle shared value.
 */
function useRadialChartAnimatedArcPath(options) {
  const {
    animatedEndAngle,
    center,
    centerlineRadius,
    emptyPath,
    startAngle
  } = options;
  return useDerivedValue(() => {
    'worklet';

    const rawSweep = startAngle - animatedEndAngle.value;
    const sweepDeg = Math.max(-360, Math.min(rawSweep, 360));
    if (Skia === undefined || sweepDeg === 0) {
      return emptyPath;
    }
    const skiaStartAngleDeg = polarAngleToSkiaDegrees(startAngle);
    const path = Skia.Path.Make();
    const oval = {
      height: centerlineRadius * 2,
      width: centerlineRadius * 2,
      x: center.x - centerlineRadius,
      y: center.y - centerlineRadius
    };
    path.addArc(oval, skiaStartAngleDeg, sweepDeg);
    return path;
  });
}

// --------------------------------------------------

function RadialChartBar(props) {
  const {
    animate,
    background = true,
    barSize: barSizeOverride,
    cornerRadius = DEFAULT_CORNER_RADIUS,
    trackColor
  } = props;
  const mutedColor = useThemeColor('muted');
  const defaultColor = useThemeColor('default');
  const resolvedTrackColor = trackColor ?? defaultColor;
  const layout = useRadialChartLayout();
  const {
    barGap,
    barSize: rootBarSize,
    center,
    colorKey,
    data,
    hasLayout,
    innerRadiusPx,
    outerRadiusPx,
    resolvedDomain,
    rootEndAngle,
    rootStartAngle,
    valueKey
  } = layout;
  const resolvedBarSize = barSizeOverride ?? rootBarSize;
  const sectors = useMemo(() => computeRadialBarSectors({
    barGap,
    barSize: resolvedBarSize,
    data,
    domain: resolvedDomain,
    innerRadiusPx,
    outerRadiusPx,
    rootEndAngle,
    rootStartAngle,
    valueKey
  }), [barGap, data, innerRadiusPx, outerRadiusPx, resolvedBarSize, resolvedDomain, rootEndAngle, rootStartAngle, valueKey]);
  if (!hasLayout || sectors.length === 0 || Skia === undefined) {
    return null;
  }
  return /*#__PURE__*/_jsx(Group, {
    children: sectors.map(sector => /*#__PURE__*/_jsx(RadialChartBarSectorGroup, {
      animate: animate,
      background: background,
      center: center,
      colorKey: colorKey,
      cornerRadius: cornerRadius,
      data: data,
      labelKey: layout.labelKey,
      mutedColor: mutedColor,
      resolvedTrackColor: resolvedTrackColor,
      sector: sector
    }, `radial-chart-sector-${sector.index}`))
  });
}
function RadialChartBarSectorGroup(props) {
  const {
    animate,
    background,
    center,
    colorKey,
    cornerRadius,
    data,
    labelKey,
    mutedColor,
    resolvedTrackColor,
    sector
  } = props;
  const row = data[sector.index];
  if (row === undefined) {
    return null;
  }
  const rawColor = row[colorKey];
  const color = isSkiaColor(rawColor) ? rawColor : mutedColor;
  const centerlineRadius = (sector.innerRadius + sector.outerRadius) / 2;
  const strokeWidth = sector.outerRadius - sector.innerRadius;
  const ringKey = String(row[labelKey] ?? sector.index);
  return /*#__PURE__*/_jsxs(Group, {
    children: [background ? /*#__PURE__*/_jsx(RadialChartBarTrack, {
      center: center,
      centerlineRadius: centerlineRadius,
      cornerRadius: cornerRadius,
      endAngle: sector.background.endAngle,
      startAngle: sector.background.startAngle,
      strokeWidth: strokeWidth,
      trackColor: resolvedTrackColor
    }) : null, /*#__PURE__*/_jsx(RadialChartBarRing, {
      animate: animate,
      center: center,
      centerlineRadius: centerlineRadius,
      color: color,
      cornerRadius: cornerRadius,
      endAngle: sector.endAngle,
      startAngle: sector.startAngle,
      strokeWidth: strokeWidth
    })]
  }, `radial-chart-ring-${ringKey}`);
}

// --------------------------------------------------

RadialChartRoot.displayName = DISPLAY_NAME.ROOT;
RadialChartBar.displayName = DISPLAY_NAME.BAR;

// --------------------------------------------------

/**
 * Compound `RadialChart` — themed `BasePolarChart` wrapper with Skia-rendered concentric
 * rounded arc rings.
 *
 * @component RadialChart — Themed `PolarChart` wrapper. Constrain chart sizing on
 *   `wrapperClassName` (e.g. `w-[200px]`). Accepts an `animation` prop that cascades
 *   `"disable-all"` to {@link RadialChart.Bar}.
 * @component RadialChart.Bar — Renders all concentric rings with optional background tracks and
 *   sweep-fill animation. Row `0` is the innermost ring.
 */
const RadialChart = Object.assign(RadialChartRoot, {
  /** Concentric rounded arc rings for every data row. */
  Bar: RadialChartBar
});
export default RadialChart;