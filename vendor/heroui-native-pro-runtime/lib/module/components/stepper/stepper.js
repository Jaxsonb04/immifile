"use strict";

import { AnimationSettingsProvider } from 'heroui-native/contexts';
import { useThemeColor } from 'heroui-native/hooks';
import { Children, cloneElement, forwardRef, Fragment, isValidElement, useMemo } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { AnimatedCheckIcon } from "../../helpers/internal/components/index.js";
import * as StepperPrimitives from "../../primitives/stepper/index.js";
import { StepperAnimationProvider, useStepperAnimation, useStepperRootAnimation, useStepperSeparatorFillAnimation } from "./stepper.animation.js";
import { DISPLAY_NAME } from "./stepper.constants.js";
import { stepperClassNames } from "./stepper.styles.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const useStepper = StepperPrimitives.useRootContext;
const useStepperStep = StepperPrimitives.useStepContext;

// --------------------------------------------------

/**
 * Subtree inside primitive Root: reads `currentStep` from context and provides
 * animation settings plus step progress shared value to descendants.
 */
function StepperRootInner(props) {
  const {
    animation,
    children
  } = props;
  const {
    currentStep
  } = useStepper();
  const {
    progress,
    isAllAnimationsDisabled
  } = useStepperRootAnimation({
    animation,
    currentStep
  });
  const animationSettingsContextValue = useMemo(() => ({
    isAllAnimationsDisabled
  }), [isAllAnimationsDisabled]);
  const stepperAnimationContextValue = useMemo(() => ({
    progress
  }), [progress]);
  return /*#__PURE__*/_jsx(AnimationSettingsProvider, {
    value: animationSettingsContextValue,
    children: /*#__PURE__*/_jsx(StepperAnimationProvider, {
      value: stepperAnimationContextValue,
      children: children
    })
  });
}

// --------------------------------------------------

const StepperRoot = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    animation,
    children,
    className,
    orientation = 'vertical',
    ...restProps
  } = props;
  const enhancedChildren = useMemo(() => {
    const childArray = Children.toArray(children);
    const stepElements = childArray.filter(child => /*#__PURE__*/isValidElement(child) && child.type === StepperStep);
    const totalSteps = stepElements.length;
    let stepCounter = 0;
    return childArray.map(child => {
      if (/*#__PURE__*/isValidElement(child) && child.type === StepperStep) {
        const idx = stepCounter;
        stepCounter += 1;
        return /*#__PURE__*/cloneElement(child, {
          _index: idx,
          _isLast: idx === totalSteps - 1,
          key: child.key ?? `stepper-step-${idx}`
        });
      }
      return child;
    });
  }, [children]);
  const rootClassName = stepperClassNames.root({
    className
  });
  return /*#__PURE__*/_jsx(StepperPrimitives.Root, {
    ref: ref,
    className: rootClassName,
    orientation: orientation,
    skipInjectStepIndices: true,
    ...restProps,
    children: /*#__PURE__*/_jsx(StepperRootInner, {
      animation: animation,
      children: enhancedChildren
    })
  });
});

// --------------------------------------------------

const StepperStep = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const stepClassName = stepperClassNames.step({
    className
  });
  return /*#__PURE__*/_jsx(StepperPrimitives.Step, {
    ref: ref,
    className: stepClassName,
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

const StepperIndicatorCheck = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    className,
    color,
    enterDuration = 200,
    exitDuration = 0,
    size = 16,
    strokeWidth,
    ...restProps
  } = props;
  const {
    status
  } = useStepperStep();
  const themeColorAccentForeground = useThemeColor('accent-foreground');
  const checkClassName = stepperClassNames.indicatorCheck({
    className
  });
  return /*#__PURE__*/_jsx(View, {
    ref: ref,
    className: checkClassName,
    ...restProps,
    children: /*#__PURE__*/_jsx(AnimatedCheckIcon, {
      color: color ?? themeColorAccentForeground,
      enterDuration: enterDuration,
      exitDuration: exitDuration,
      isSelected: status === 'complete',
      size: size,
      strokeWidth: strokeWidth
    })
  });
});

// --------------------------------------------------

const StepperIndicatorNumber = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const {
    index,
    status
  } = useStepperStep();
  const numberClassName = stepperClassNames.indicatorNumber({
    className
  });
  const resolvedChildren = children === undefined ? String(index + 1) : typeof children === 'function' ? children(index) : children;
  return /*#__PURE__*/_jsx(StepperPrimitives.Title, {
    ref: ref,
    className: numberClassName,
    "data-status": status,
    ...restProps,
    children: resolvedChildren
  });
});

// --------------------------------------------------

const StepperIndicator = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const {
    status
  } = useStepperStep();
  const indicatorClassName = stepperClassNames.indicator({
    className
  });
  return /*#__PURE__*/_jsx(StepperPrimitives.Indicator, {
    ref: ref,
    className: indicatorClassName,
    ...restProps,
    children: children ?? /*#__PURE__*/_jsxs(View, {
      className: "items-center justify-center",
      children: [/*#__PURE__*/_jsx(StepperIndicatorCheck, {}), status !== 'complete' && /*#__PURE__*/_jsx(View, {
        className: "absolute",
        children: /*#__PURE__*/_jsx(StepperIndicatorNumber, {})
      })]
    })
  });
});

// --------------------------------------------------

const StepperSeparatorTrack = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    className,
    ...restProps
  } = props;
  const trackClassName = stepperClassNames.separatorTrack({
    className
  });
  return /*#__PURE__*/_jsx(View, {
    ref: ref,
    accessibilityElementsHidden: true,
    className: trackClassName,
    importantForAccessibility: "no-hide-descendants",
    ...restProps
  });
});

// --------------------------------------------------

const StepperSeparatorFill = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    animation,
    className,
    isAnimatedStyleActive = true,
    style,
    ...restProps
  } = props;
  const {
    index
  } = useStepperStep();
  const {
    orientation
  } = useStepper();
  const {
    progress
  } = useStepperAnimation();
  const {
    animatedStyle
  } = useStepperSeparatorFillAnimation({
    animation,
    index,
    orientation,
    progress
  });
  const fillClassName = stepperClassNames.separatorFill({
    className
  });
  const styleValue = isAnimatedStyleActive ? [animatedStyle, style] : style;
  return /*#__PURE__*/_jsx(Animated.View, {
    ref: ref,
    accessibilityElementsHidden: true,
    className: fillClassName,
    importantForAccessibility: "no-hide-descendants",
    style: styleValue,
    ...restProps
  });
});

// --------------------------------------------------

const StepperSeparator = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const separatorClassName = stepperClassNames.separator({
    className
  });
  return /*#__PURE__*/_jsx(StepperPrimitives.Separator, {
    ref: ref,
    className: separatorClassName,
    ...restProps,
    children: children ?? /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx(StepperSeparatorTrack, {}), /*#__PURE__*/_jsx(StepperSeparatorFill, {})]
    })
  });
});

// --------------------------------------------------

const StepperRail = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const {
    index
  } = useStepperStep();
  const hasExplicitChildren = Children.count(children) > 0;
  const railChildren = hasExplicitChildren ? children : /*#__PURE__*/_jsxs(Fragment, {
    children: [/*#__PURE__*/_jsx(StepperIndicator, {}), index > 0 ? /*#__PURE__*/_jsx(StepperSeparator, {}) : null]
  });
  return /*#__PURE__*/_jsx(StepperPrimitives.Rail, {
    ref: ref,
    className: className,
    ...restProps,
    children: railChildren
  });
});

// --------------------------------------------------

const StepperContent = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const contentClassName = stepperClassNames.content({
    className
  });
  return /*#__PURE__*/_jsx(StepperPrimitives.Content, {
    ref: ref,
    className: contentClassName,
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

const StepperTitle = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const titleClassName = stepperClassNames.title({
    className
  });
  return /*#__PURE__*/_jsx(StepperPrimitives.Title, {
    ref: ref,
    className: titleClassName,
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

const StepperDescription = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const descriptionClassName = stepperClassNames.description({
    className
  });
  return /*#__PURE__*/_jsx(StepperPrimitives.Description, {
    ref: ref,
    className: descriptionClassName,
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

StepperRoot.displayName = DISPLAY_NAME.ROOT;
StepperStep.displayName = DISPLAY_NAME.STEP;
StepperRail.displayName = DISPLAY_NAME.RAIL;
StepperIndicator.displayName = DISPLAY_NAME.INDICATOR;
StepperIndicatorCheck.displayName = DISPLAY_NAME.INDICATOR_CHECK;
StepperIndicatorNumber.displayName = DISPLAY_NAME.INDICATOR_NUMBER;
StepperSeparator.displayName = DISPLAY_NAME.SEPARATOR;
StepperSeparatorTrack.displayName = DISPLAY_NAME.SEPARATOR_TRACK;
StepperSeparatorFill.displayName = DISPLAY_NAME.SEPARATOR_FILL;
StepperContent.displayName = DISPLAY_NAME.CONTENT;
StepperTitle.displayName = DISPLAY_NAME.TITLE;
StepperDescription.displayName = DISPLAY_NAME.DESCRIPTION;

// --------------------------------------------------

const Stepper = Object.assign(StepperRoot, {
  Step: StepperStep,
  Rail: StepperRail,
  Indicator: StepperIndicator,
  IndicatorCheck: StepperIndicatorCheck,
  IndicatorNumber: StepperIndicatorNumber,
  Separator: StepperSeparator,
  SeparatorTrack: StepperSeparatorTrack,
  SeparatorFill: StepperSeparatorFill,
  Content: StepperContent,
  Title: StepperTitle,
  Description: StepperDescription
});
export default Stepper;
export { useStepper, useStepperAnimation, useStepperStep };