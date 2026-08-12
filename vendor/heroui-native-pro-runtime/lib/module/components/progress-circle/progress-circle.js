"use strict";

import { AnimationSettingsProvider } from 'heroui-native/contexts';
import { useThemeColor } from 'heroui-native/hooks';
import { forwardRef, useMemo } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { HeroText } from "../../helpers/internal/components/index.js";
import { createContext } from "../../helpers/internal/utils/index.js";
import { useProgressCircleFillAnimation, useProgressCircleIndicatorRootAnimation, useProgressCircleRootAnimation, useProgressCircleSpinAnimation } from "./progress-circle.animation.js";
import { CENTER, DEFAULT_COLOR, DEFAULT_FORMAT_OPTIONS, DEFAULT_MAX_VALUE, DEFAULT_MIN_VALUE, DEFAULT_SIZE, DISPLAY_NAME, SIZE_MAP, STROKE_WIDTH } from "./progress-circle.constants.js";
import { progressCircleClassNames, progressCircleStyleSheet } from "./progress-circle.styles.js";
import { clampPercentage, formatProgressValue } from "./progress-circle.utils.js";

// --------------------------------------------------
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// --------------------------------------------------

const [ProgressCircleProvider, useProgressCircle] = createContext({
  name: 'ProgressCircleContext'
});

// --------------------------------------------------

const ProgressCircleRoot = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    value = 0,
    minValue = DEFAULT_MIN_VALUE,
    maxValue = DEFAULT_MAX_VALUE,
    isIndeterminate = false,
    isDisabled = false,
    size = DEFAULT_SIZE,
    color = DEFAULT_COLOR,
    formatOptions = DEFAULT_FORMAT_OPTIONS,
    className,
    animation,
    ...restProps
  } = props;
  const percentage = isIndeterminate ? 0 : clampPercentage(value, minValue, maxValue);
  const valueText = isIndeterminate ? '' : formatProgressValue(value, minValue, maxValue, formatOptions);
  const {
    isAllAnimationsDisabled
  } = useProgressCircleRootAnimation({
    animation
  });
  const rootClassName = progressCircleClassNames.root({
    isDisabled,
    className
  });
  const animationSettingsContextValue = useMemo(() => ({
    isAllAnimationsDisabled
  }), [isAllAnimationsDisabled]);
  const contextValue = useMemo(() => ({
    percentage,
    valueText,
    isIndeterminate,
    isDisabled,
    size,
    color
  }), [percentage, valueText, isIndeterminate, isDisabled, size, color]);
  const renderProps = {
    percentage,
    valueText,
    isIndeterminate
  };
  const resolvedChildren = typeof children === 'function' ? children(renderProps) : children;
  return /*#__PURE__*/_jsx(AnimationSettingsProvider, {
    value: animationSettingsContextValue,
    children: /*#__PURE__*/_jsx(ProgressCircleProvider, {
      value: contextValue,
      children: /*#__PURE__*/_jsx(View, {
        ref: ref,
        className: rootClassName,
        accessibilityRole: "progressbar",
        accessibilityValue: {
          min: minValue,
          max: maxValue,
          now: isIndeterminate ? undefined : value,
          text: isIndeterminate ? undefined : valueText
        },
        accessibilityState: {
          disabled: isDisabled
        },
        ...restProps,
        children: resolvedChildren
      })
    })
  });
});

// --------------------------------------------------

const ProgressCircleIndicator = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    strokeWidth = STROKE_WIDTH,
    trackColor,
    fillColor,
    animation,
    ...restProps
  } = props;
  const ctx = useProgressCircle();
  const {
    fillTimingConfig,
    spinTimingConfig,
    isAnimationDisabled
  } = useProgressCircleIndicatorRootAnimation({
    animation
  });
  const themeDefaultColor = useThemeColor('default');
  const themeDefaultForeground = useThemeColor('default-foreground');
  const themeAccent = useThemeColor('accent');
  const themeSuccess = useThemeColor('success');
  const themeWarning = useThemeColor('warning');
  const themeDanger = useThemeColor('danger');
  const fillColorMap = {
    default: themeDefaultForeground,
    accent: themeAccent,
    success: themeSuccess,
    warning: themeWarning,
    danger: themeDanger
  };
  const resolvedTrackColor = trackColor ?? themeDefaultColor;
  const resolvedFillColor = fillColor ?? fillColorMap[ctx.color] ?? themeAccent;
  const circleSize = typeof ctx.size === 'number' ? ctx.size : SIZE_MAP[ctx.size];
  const radius = CENTER - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  if (ctx.isIndeterminate) {
    return /*#__PURE__*/_jsx(IndeterminateIndicator, {
      ref: ref,
      circleSize: circleSize,
      strokeWidth: strokeWidth,
      radius: radius,
      circumference: circumference,
      trackColor: resolvedTrackColor,
      fillColor: resolvedFillColor,
      isAnimationDisabled: isAnimationDisabled,
      spinTimingConfig: spinTimingConfig,
      ...restProps
    });
  }
  return /*#__PURE__*/_jsx(DeterminateIndicator, {
    ref: ref,
    circleSize: circleSize,
    strokeWidth: strokeWidth,
    radius: radius,
    circumference: circumference,
    percentage: ctx.percentage,
    trackColor: resolvedTrackColor,
    fillColor: resolvedFillColor,
    isAnimationDisabled: isAnimationDisabled,
    fillTimingConfig: fillTimingConfig,
    ...restProps
  });
});

// --------------------------------------------------

const DeterminateIndicator = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    circleSize,
    strokeWidth = STROKE_WIDTH,
    radius,
    circumference,
    percentage,
    trackColor,
    fillColor,
    isAnimationDisabled,
    fillTimingConfig,
    ...restProps
  } = props;
  const {
    animatedFillProps
  } = useProgressCircleFillAnimation({
    percentage,
    isAnimationDisabled,
    fillTimingConfig
  });
  return /*#__PURE__*/_jsx(View, {
    ref: ref,
    accessible: false,
    accessibilityRole: "none",
    importantForAccessibility: "no",
    ...restProps,
    children: /*#__PURE__*/_jsxs(Svg, {
      width: circleSize,
      height: circleSize,
      viewBox: `0 0 ${CENTER * 2} ${CENTER * 2}`,
      fill: "none",
      children: [/*#__PURE__*/_jsx(Circle, {
        cx: CENTER,
        cy: CENTER,
        r: radius,
        stroke: trackColor,
        strokeWidth: strokeWidth
      }), /*#__PURE__*/_jsx(AnimatedCircle, {
        cx: CENTER,
        cy: CENTER,
        r: radius,
        stroke: fillColor,
        strokeWidth: strokeWidth,
        strokeDasharray: circumference,
        strokeLinecap: "round",
        transform: `rotate(-90 ${CENTER} ${CENTER})`,
        animatedProps: animatedFillProps
      })]
    })
  });
});

// --------------------------------------------------

const IndeterminateIndicator = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    circleSize,
    strokeWidth = STROKE_WIDTH,
    radius,
    circumference,
    trackColor,
    fillColor,
    isAnimationDisabled,
    spinTimingConfig,
    ...restProps
  } = props;
  const {
    rSpinStyle
  } = useProgressCircleSpinAnimation({
    isAnimationDisabled,
    spinTimingConfig
  });
  const indeterminateOffset = circumference * 0.75;
  return /*#__PURE__*/_jsx(View, {
    ref: ref,
    accessible: false,
    accessibilityRole: "none",
    importantForAccessibility: "no",
    ...restProps,
    children: /*#__PURE__*/_jsx(Animated.View, {
      style: rSpinStyle,
      children: /*#__PURE__*/_jsxs(Svg, {
        width: circleSize,
        height: circleSize,
        viewBox: `0 0 ${CENTER * 2} ${CENTER * 2}`,
        fill: "none",
        children: [/*#__PURE__*/_jsx(Circle, {
          cx: CENTER,
          cy: CENTER,
          r: radius,
          stroke: trackColor,
          strokeWidth: strokeWidth
        }), /*#__PURE__*/_jsx(Circle, {
          cx: CENTER,
          cy: CENTER,
          r: radius,
          stroke: fillColor,
          strokeWidth: strokeWidth,
          strokeDasharray: circumference,
          strokeDashoffset: indeterminateOffset,
          strokeLinecap: "round",
          transform: `rotate(-90 ${CENTER} ${CENTER})`
        })]
      })
    })
  });
});

// --------------------------------------------------

const ProgressCircleValueLabel = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    style,
    ...restProps
  } = props;
  const ctx = useProgressCircle();
  if (ctx.isIndeterminate) return null;
  const textSize = typeof ctx.size === 'number' ? ctx.size >= 48 ? 'lg' : ctx.size >= 36 ? 'md' : 'sm' : ctx.size;
  const valueLabelClassName = progressCircleClassNames.valueLabel({
    size: textSize,
    className
  });
  const displayContent = children ?? ctx.valueText;
  return /*#__PURE__*/_jsx(HeroText, {
    ref: ref,
    accessible: false,
    accessibilityRole: "text",
    importantForAccessibility: "no",
    className: valueLabelClassName,
    style: [progressCircleStyleSheet.valueLabel, style],
    ...restProps,
    children: displayContent
  });
});

// --------------------------------------------------

ProgressCircleRoot.displayName = DISPLAY_NAME.ROOT;
ProgressCircleIndicator.displayName = DISPLAY_NAME.INDICATOR;
ProgressCircleValueLabel.displayName = DISPLAY_NAME.VALUE_LABEL;

/**
 * Compound ProgressCircle component with sub-components
 *
 * @component ProgressCircle - Root container managing progress state and
 * variant configuration. Computes percentage and formatted value text from
 * `value`, `minValue`, `maxValue`, and `formatOptions`.
 *
 * @component ProgressCircle.Indicator - SVG rendering of the track and fill
 * circles. Automatically switches between determinate (animated
 * `strokeDashoffset`) and indeterminate (continuous rotation) modes based on
 * the root's `isIndeterminate` prop.
 *
 * @component ProgressCircle.ValueLabel - Text centered on the circle
 * displaying the formatted progress value. Renders with tabular figures for
 * consistent digit alignment. Hidden when indeterminate.
 *
 * Props flow from ProgressCircle to sub-components via context
 * (percentage, valueText, isIndeterminate, isDisabled, size, color).
 *
 */
const ProgressCircle = Object.assign(ProgressCircleRoot, {
  /** SVG indicator with track and fill circles */
  Indicator: ProgressCircleIndicator,
  /** Formatted progress value centered on the circle */
  ValueLabel: ProgressCircleValueLabel
});
export default ProgressCircle;
export { useProgressCircle };