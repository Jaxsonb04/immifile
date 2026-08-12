"use strict";

import { AnimationSettingsProvider } from 'heroui-native/contexts';
import { forwardRef, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { HeroText } from "../../helpers/internal/components/index.js";
import { childrenToString, createContext } from "../../helpers/internal/utils/index.js";
import { useProgressBarFillAnimation, useProgressBarFillRootAnimation, useProgressBarIndeterminateAnimation, useProgressBarRootAnimation } from "./progress-bar.animation.js";
import { DEFAULT_COLOR, DEFAULT_FORMAT_OPTIONS, DEFAULT_MAX_VALUE, DEFAULT_MIN_VALUE, DEFAULT_SIZE, DISPLAY_NAME } from "./progress-bar.constants.js";
import { progressBarClassNames, progressBarStyleSheet } from "./progress-bar.styles.js";
import { clampPercentage, formatProgressValue } from "./progress-bar.utils.js";

// --------------------------------------------------
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const [ProgressBarProvider, useProgressBar] = createContext({
  name: 'ProgressBarContext'
});

// --------------------------------------------------

const ProgressBarRoot = /*#__PURE__*/forwardRef((props, ref) => {
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
  const [trackWidth, setTrackWidth] = useState(0);
  const percentage = isIndeterminate ? 0 : clampPercentage(value, minValue, maxValue);
  const valueText = isIndeterminate ? '' : formatProgressValue(value, minValue, maxValue, formatOptions);
  const {
    isAllAnimationsDisabled
  } = useProgressBarRootAnimation({
    animation
  });
  const onTrackLayout = useCallback(width => {
    setTrackWidth(width);
  }, []);
  const rootClassName = progressBarClassNames.root({
    isDisabled,
    className
  });
  const labelRowClassName = progressBarClassNames.labelRow();
  const animationSettingsContextValue = useMemo(() => ({
    isAllAnimationsDisabled
  }), [isAllAnimationsDisabled]);
  const contextValue = useMemo(() => ({
    percentage,
    valueText,
    isIndeterminate,
    isDisabled,
    size,
    color,
    trackWidth,
    onTrackLayout
  }), [percentage, valueText, isIndeterminate, isDisabled, size, color, trackWidth, onTrackLayout]);
  const renderProps = {
    percentage,
    valueText,
    isIndeterminate
  };
  const stringifiedChildren = typeof children !== 'function' ? childrenToString(children) : null;
  const resolvedChildren = typeof children === 'function' ? children(renderProps) : stringifiedChildren ? /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsxs(View, {
      className: labelRowClassName,
      children: [/*#__PURE__*/_jsx(ProgressBarLabel, {
        children: stringifiedChildren
      }), /*#__PURE__*/_jsx(ProgressBarValueLabel, {})]
    }), /*#__PURE__*/_jsx(ProgressBarTrack, {
      children: /*#__PURE__*/_jsx(ProgressBarFill, {})
    })]
  }) : children;
  return /*#__PURE__*/_jsx(AnimationSettingsProvider, {
    value: animationSettingsContextValue,
    children: /*#__PURE__*/_jsx(ProgressBarProvider, {
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

const ProgressBarTrack = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    style,
    onLayout,
    ...restProps
  } = props;
  const ctx = useProgressBar();
  const trackClassName = progressBarClassNames.track({
    size: ctx.size,
    className
  });
  const {
    onTrackLayout
  } = ctx;
  const handleLayout = useCallback(event => {
    onTrackLayout(event.nativeEvent.layout.width);
    onLayout?.(event);
  }, [onTrackLayout, onLayout]);
  return /*#__PURE__*/_jsx(View, {
    ref: ref,
    accessible: false,
    accessibilityRole: "none",
    importantForAccessibility: "no",
    className: trackClassName,
    style: [progressBarStyleSheet.track, style],
    onLayout: handleLayout,
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

const ProgressBarFill = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    className,
    animation,
    isAnimatedStyleActive = true,
    ...restProps
  } = props;
  const ctx = useProgressBar();
  const {
    fillTimingConfig,
    indeterminateFillTimingConfig,
    isAnimationDisabled
  } = useProgressBarFillRootAnimation({
    animation
  });
  const fillClassName = progressBarClassNames.fill({
    color: ctx.color,
    className
  });
  if (ctx.isIndeterminate) {
    return /*#__PURE__*/_jsx(ProgressBarIndeterminateFill, {
      ref: ref,
      className: fillClassName,
      trackWidth: ctx.trackWidth,
      indeterminateFillTimingConfig: indeterminateFillTimingConfig,
      isAnimationDisabled: isAnimationDisabled,
      isAnimatedStyleActive: isAnimatedStyleActive,
      ...restProps
    });
  }
  return /*#__PURE__*/_jsx(ProgressBarDeterminateFill, {
    ref: ref,
    className: fillClassName,
    percentage: ctx.percentage,
    fillTimingConfig: fillTimingConfig,
    isAnimationDisabled: isAnimationDisabled,
    isAnimatedStyleActive: isAnimatedStyleActive,
    ...restProps
  });
});

// --------------------------------------------------

const ProgressBarDeterminateFill = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    className,
    style,
    percentage,
    fillTimingConfig,
    isAnimationDisabled,
    isAnimatedStyleActive = true,
    ...restProps
  } = props;
  const {
    rFillStyle
  } = useProgressBarFillAnimation({
    percentage,
    isAnimationDisabled,
    fillTimingConfig
  });
  const fillStyle = isAnimatedStyleActive ? [rFillStyle, style] : style;
  return /*#__PURE__*/_jsx(Animated.View, {
    ref: ref,
    accessible: false,
    accessibilityRole: "none",
    importantForAccessibility: "no",
    className: className,
    style: fillStyle,
    ...restProps
  });
});

// --------------------------------------------------

const ProgressBarIndeterminateFill = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    className,
    style,
    trackWidth,
    indeterminateFillTimingConfig,
    isAnimationDisabled,
    isAnimatedStyleActive = true,
    ...restProps
  } = props;
  const {
    rIndeterminateFillStyle
  } = useProgressBarIndeterminateAnimation({
    trackWidth,
    isAnimationDisabled,
    indeterminateFillTimingConfig
  });
  const fillStyle = isAnimatedStyleActive ? [rIndeterminateFillStyle, style] : style;
  return /*#__PURE__*/_jsx(Animated.View, {
    ref: ref,
    accessible: false,
    accessibilityRole: "none",
    importantForAccessibility: "no",
    className: className,
    style: fillStyle,
    ...restProps
  });
});

// --------------------------------------------------

const ProgressBarLabel = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const labelClassName = progressBarClassNames.label({
    className
  });
  return /*#__PURE__*/_jsx(HeroText, {
    ref: ref,
    accessible: false,
    accessibilityRole: "text",
    importantForAccessibility: "no",
    className: labelClassName,
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

const ProgressBarValueLabel = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    style,
    ...restProps
  } = props;
  const ctx = useProgressBar();
  if (ctx.isIndeterminate) return null;
  const valueLabelClassName = progressBarClassNames.valueLabel({
    className
  });
  const displayContent = children ?? ctx.valueText;
  return /*#__PURE__*/_jsx(HeroText, {
    ref: ref,
    accessible: false,
    accessibilityRole: "text",
    importantForAccessibility: "no",
    className: valueLabelClassName,
    style: [progressBarStyleSheet.valueLabel, style],
    ...restProps,
    children: displayContent
  });
});

// --------------------------------------------------

ProgressBarRoot.displayName = DISPLAY_NAME.ROOT;
ProgressBarTrack.displayName = DISPLAY_NAME.TRACK;
ProgressBarFill.displayName = DISPLAY_NAME.FILL;
ProgressBarLabel.displayName = DISPLAY_NAME.LABEL;
ProgressBarValueLabel.displayName = DISPLAY_NAME.VALUE_LABEL;

/**
 * Compound ProgressBar component with sub-components
 *
 * @component ProgressBar - Root container managing progress state and variant
 * configuration. Computes percentage and formatted value text from `value`,
 * `minValue`, `maxValue`, and `formatOptions`. When plain string children are
 * provided, they auto-expand into Label + ValueLabel + Track(Fill).
 *
 * @component ProgressBar.Track - Background container for the fill element.
 * Applies rounded corners, overflow hidden, and size-based height.
 *
 * @component ProgressBar.Fill - Animated element representing filled progress.
 * Automatically switches between determinate (width animation) and
 * indeterminate (translateX sweep) based on the root's `isIndeterminate` prop.
 *
 * @component ProgressBar.Label - Text describing the progress operation.
 *
 * @component ProgressBar.ValueLabel - Displays the formatted progress value.
 * Renders with tabular figures for consistent digit alignment. Hidden when
 * indeterminate.
 *
 * Props flow from ProgressBar to sub-components via context
 * (percentage, valueText, isIndeterminate, isDisabled, size, color).
 *
 */
const ProgressBar = Object.assign(ProgressBarRoot, {
  /** Background container for the fill element */
  Track: ProgressBarTrack,
  /** Animated fill representing progress */
  Fill: ProgressBarFill,
  /** Text label describing the operation */
  Label: ProgressBarLabel,
  /** Formatted progress value text */
  ValueLabel: ProgressBarValueLabel
});
export default ProgressBar;
export { useProgressBar };