"use strict";

import { AnimationSettingsProvider } from 'heroui-native/contexts';
import { forwardRef, useCallback, useMemo } from 'react';
import Animated, { LayoutAnimationConfig } from 'react-native-reanimated';
import { HeroText } from "../../helpers/internal/components/index.js";
import * as NumberStepperPrimitives from "../../primitives/number-stepper/index.js";
import { useNumberStepperButtonAnimation, useNumberStepperRootAnimation, useNumberStepperValueAnimation } from "./number-stepper.animation.js";
import { DISPLAY_NAME } from "./number-stepper.constants.js";
import { MinusIcon, PlusIcon } from "./number-stepper.icons.js";
import { numberStepperClassNames, numberStepperStyleSheet } from "./number-stepper.styles.js";
import { jsx as _jsx } from "react/jsx-runtime";
const AnimatedText = Animated.createAnimatedComponent(HeroText);
const AnimatedDecrementButton = Animated.createAnimatedComponent(NumberStepperPrimitives.DecrementButton);
const AnimatedIncrementButton = Animated.createAnimatedComponent(NumberStepperPrimitives.IncrementButton);
const useNumberStepper = NumberStepperPrimitives.useRootContext;

// --------------------------------------------------

const NumberStepperRoot = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    className,
    animation,
    isDisabled = false,
    ...restProps
  } = props;
  const rootClassName = numberStepperClassNames.root({
    isDisabled,
    className
  });
  const {
    isAllAnimationsDisabled
  } = useNumberStepperRootAnimation({
    animation
  });
  const animationSettingsContextValue = useMemo(() => ({
    isAllAnimationsDisabled
  }), [isAllAnimationsDisabled]);
  return /*#__PURE__*/_jsx(AnimationSettingsProvider, {
    value: animationSettingsContextValue,
    children: /*#__PURE__*/_jsx(NumberStepperPrimitives.Root, {
      ref: ref,
      className: rootClassName,
      isDisabled: isDisabled,
      ...restProps
    })
  });
});

// --------------------------------------------------

const NumberStepperDecrementButton = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    style,
    iconProps,
    animation,
    isAnimatedStyleActive = true,
    keepActiveAtBoundary,
    onPressIn,
    onPressOut,
    ...restProps
  } = props;
  const {
    isDisabled: rootDisabled,
    isAtMin
  } = useNumberStepper();
  const {
    rButtonStyle,
    animationOnPressIn,
    animationOnPressOut
  } = useNumberStepperButtonAnimation({
    animation
  });
  const showDisabledStyle = !rootDisabled && !keepActiveAtBoundary && isAtMin;
  const buttonClassName = numberStepperClassNames.button({
    isDisabled: showDisabledStyle,
    className
  });
  const handlePressIn = useCallback(e => {
    animationOnPressIn();
    onPressIn?.(e);
  }, [animationOnPressIn, onPressIn]);
  const handlePressOut = useCallback(e => {
    animationOnPressOut();
    onPressOut?.(e);
  }, [animationOnPressOut, onPressOut]);
  const buttonStyle = isAnimatedStyleActive ? typeof style === 'function' ? style : [numberStepperStyleSheet.button, rButtonStyle, style] : typeof style === 'function' ? style : [numberStepperStyleSheet.button, style];
  return /*#__PURE__*/_jsx(AnimatedDecrementButton, {
    ref: ref,
    className: buttonClassName,
    style: buttonStyle,
    keepActiveAtBoundary: keepActiveAtBoundary,
    onPressIn: handlePressIn,
    onPressOut: handlePressOut,
    ...restProps,
    children: children ?? /*#__PURE__*/_jsx(MinusIcon, {
      ...iconProps
    })
  });
});

// --------------------------------------------------

const NumberStepperValue = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    style,
    animation,
    ...restProps
  } = props;
  const {
    value,
    direction
  } = useNumberStepper();
  const {
    entering,
    exiting
  } = useNumberStepperValueAnimation({
    animation,
    direction
  });
  const valueClassName = numberStepperClassNames.value({
    className
  });
  const displayContent = children ?? String(value);
  return /*#__PURE__*/_jsx(LayoutAnimationConfig, {
    skipEntering: true,
    skipExiting: true,
    children: /*#__PURE__*/_jsx(AnimatedText, {
      ref: ref,
      entering: entering,
      exiting: exiting,
      className: valueClassName,
      style: [numberStepperStyleSheet.value, style],
      ...restProps,
      children: displayContent
    }, String(value))
  });
});

// --------------------------------------------------

const NumberStepperIncrementButton = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    style,
    iconProps,
    animation,
    isAnimatedStyleActive = true,
    keepActiveAtBoundary,
    onPressIn,
    onPressOut,
    ...restProps
  } = props;
  const {
    isDisabled: rootDisabled,
    isAtMax
  } = useNumberStepper();
  const {
    rButtonStyle,
    animationOnPressIn,
    animationOnPressOut
  } = useNumberStepperButtonAnimation({
    animation
  });
  const showDisabledStyle = !rootDisabled && !keepActiveAtBoundary && isAtMax;
  const buttonClassName = numberStepperClassNames.button({
    isDisabled: showDisabledStyle,
    className
  });
  const handlePressIn = useCallback(e => {
    animationOnPressIn();
    onPressIn?.(e);
  }, [animationOnPressIn, onPressIn]);
  const handlePressOut = useCallback(e => {
    animationOnPressOut();
    onPressOut?.(e);
  }, [animationOnPressOut, onPressOut]);
  const buttonStyle = isAnimatedStyleActive ? typeof style === 'function' ? style : [numberStepperStyleSheet.button, rButtonStyle, style] : typeof style === 'function' ? style : [numberStepperStyleSheet.button, style];
  return /*#__PURE__*/_jsx(AnimatedIncrementButton, {
    ref: ref,
    className: buttonClassName,
    style: buttonStyle,
    keepActiveAtBoundary: keepActiveAtBoundary,
    onPressIn: handlePressIn,
    onPressOut: handlePressOut,
    ...restProps,
    children: children ?? /*#__PURE__*/_jsx(PlusIcon, {
      ...iconProps
    })
  });
});

// --------------------------------------------------

NumberStepperRoot.displayName = DISPLAY_NAME.ROOT;
NumberStepperDecrementButton.displayName = DISPLAY_NAME.DECREMENT_BUTTON;
NumberStepperValue.displayName = DISPLAY_NAME.VALUE;
NumberStepperIncrementButton.displayName = DISPLAY_NAME.INCREMENT_BUTTON;

/**
 * Compound NumberStepper component with sub-components
 *
 * @component NumberStepper - Root container managing numeric value state.
 * Provides disabled context to sub-components.
 * Supports both controlled and uncontrolled value state.
 *
 * @component NumberStepper.DecrementButton - Pressable button that decreases
 * the value by one step. Auto-disabled at minValue. Renders a minus icon
 * by default; accepts custom children for full customization.
 *
 * @component NumberStepper.Value - Displays the current numeric value with
 * flip animations on change (matching InputOTP pattern). Remounts on
 * value change to trigger entering/exiting layout animations.
 *
 * @component NumberStepper.IncrementButton - Pressable button that increases
 * the value by one step. Auto-disabled at maxValue. Renders a plus icon
 * by default; accepts custom children for full customization.
 *
 * Props flow from NumberStepper to sub-components via context (value,
 * isDisabled, isAtMin, isAtMax, increment, decrement).
 *
 */
const NumberStepper = Object.assign(NumberStepperRoot, {
  /** @optional Pressable button to decrease value by one step */
  DecrementButton: NumberStepperDecrementButton,
  /** @optional Display for the current numeric value with animations */
  Value: NumberStepperValue,
  /** @optional Pressable button to increase value by one step */
  IncrementButton: NumberStepperIncrementButton
});
export default NumberStepper;
export { useNumberStepper };