"use strict";

import { createContext, forwardRef, useCallback, useContext, useId, useMemo, useState } from 'react';
import { Pressable, Text as RNText, View } from 'react-native';
import { useControllableState, useLongPressRepeat } from "../../helpers/internal/hooks/index.js";
import * as Slot from "../slot/index.js";
import { jsx as _jsx } from "react/jsx-runtime";
const NumberStepperContext = /*#__PURE__*/createContext(null);

/**
 * Hook to access number stepper root context.
 * Throws when used outside NumberStepper.Root.
 */
function useRootContext() {
  const context = useContext(NumberStepperContext);
  if (!context) {
    throw new Error('NumberStepper compound components cannot be rendered outside the NumberStepper component');
  }
  return context;
}

// --------------------------------------------------

const Root = /*#__PURE__*/forwardRef(({
  asChild,
  id,
  children,
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  minValue = -Infinity,
  maxValue = Infinity,
  step = 1,
  isDisabled = false,
  ...viewProps
}, ref) => {
  const generatedId = useId();
  const nativeID = id != null ? String(id) : generatedId;
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange
  });
  const [direction, setDirection] = useState('increase');
  const currentValue = value ?? defaultValue;
  const isAtMin = currentValue <= minValue;
  const isAtMax = currentValue >= maxValue;
  const decrement = useCallback(() => {
    setValue(prev => {
      const current = prev ?? defaultValue;
      return Math.max(minValue, current - step);
    });
  }, [setValue, defaultValue, minValue, step]);
  const increment = useCallback(() => {
    setValue(prev => {
      const current = prev ?? defaultValue;
      return Math.min(maxValue, current + step);
    });
  }, [setValue, defaultValue, maxValue, step]);
  const Component = asChild ? Slot.View : View;
  const contextValue = useMemo(() => ({
    nativeID,
    value: currentValue,
    step,
    minValue,
    maxValue,
    isDisabled,
    isAtMin,
    isAtMax,
    direction,
    setDirection,
    decrement,
    increment
  }), [nativeID, currentValue, step, minValue, maxValue, isDisabled, isAtMin, isAtMax, direction, decrement, increment]);
  const renderProps = useMemo(() => ({
    value: currentValue,
    isAtMin,
    isAtMax,
    isDisabled,
    step,
    minValue,
    maxValue
  }), [currentValue, isAtMin, isAtMax, isDisabled, step, minValue, maxValue]);
  const resolvedChildren = typeof children === 'function' ? children(renderProps) : children;
  return /*#__PURE__*/_jsx(NumberStepperContext.Provider, {
    value: contextValue,
    children: /*#__PURE__*/_jsx(Component, {
      ref: ref,
      role: "group",
      accessibilityLabel: "Number Stepper",
      nativeID: nativeID,
      ...viewProps,
      children: resolvedChildren
    })
  });
});
Root.displayName = 'HeroUINative.Primitive.NumberStepper.Root';

// --------------------------------------------------

const DecrementButton = /*#__PURE__*/forwardRef(({
  asChild,
  isDisabled: isDisabledProp,
  keepActiveAtBoundary,
  onPress,
  onPressIn,
  onPressOut,
  ...pressableProps
}, ref) => {
  const {
    isDisabled: contextDisabled,
    isAtMin,
    setDirection,
    decrement
  } = useRootContext();
  const isEffectivelyDisabled = isDisabledProp !== undefined ? isDisabledProp : contextDisabled || !keepActiveAtBoundary && isAtMin;
  const decrementAction = useCallback(() => {
    setDirection('decrease');
    if (!(keepActiveAtBoundary && isAtMin)) {
      decrement();
    }
  }, [setDirection, keepActiveAtBoundary, isAtMin, decrement]);
  const {
    onPressIn: repeatPressIn,
    onPressOut: repeatPressOut
  } = useLongPressRepeat({
    action: decrementAction,
    isDisabled: isEffectivelyDisabled
  });
  const handlePressIn = useCallback(e => {
    repeatPressIn();
    onPressIn?.(e);
  }, [repeatPressIn, onPressIn]);
  const handlePressOut = useCallback(e => {
    repeatPressOut();
    onPressOut?.(e);
  }, [repeatPressOut, onPressOut]);
  const handlePress = useCallback(e => {
    onPress?.(e);
  }, [onPress]);
  const Component = asChild ? Slot.Pressable : Pressable;
  return /*#__PURE__*/_jsx(Component, {
    ref: ref,
    role: "button",
    accessibilityLabel: "Decrease value",
    accessibilityState: {
      disabled: isEffectivelyDisabled
    },
    disabled: isEffectivelyDisabled,
    onPressIn: handlePressIn,
    onPressOut: handlePressOut,
    onPress: handlePress,
    ...pressableProps
  });
});
DecrementButton.displayName = 'HeroUINative.Primitive.NumberStepper.DecrementButton';

// --------------------------------------------------

const IncrementButton = /*#__PURE__*/forwardRef(({
  asChild,
  isDisabled: isDisabledProp,
  keepActiveAtBoundary,
  onPress,
  onPressIn,
  onPressOut,
  ...pressableProps
}, ref) => {
  const {
    isDisabled: contextDisabled,
    isAtMax,
    setDirection,
    increment
  } = useRootContext();
  const isEffectivelyDisabled = isDisabledProp !== undefined ? isDisabledProp : contextDisabled || !keepActiveAtBoundary && isAtMax;
  const incrementAction = useCallback(() => {
    setDirection('increase');
    if (!(keepActiveAtBoundary && isAtMax)) {
      increment();
    }
  }, [setDirection, keepActiveAtBoundary, isAtMax, increment]);
  const {
    onPressIn: repeatPressIn,
    onPressOut: repeatPressOut
  } = useLongPressRepeat({
    action: incrementAction,
    isDisabled: isEffectivelyDisabled
  });
  const handlePressIn = useCallback(e => {
    repeatPressIn();
    onPressIn?.(e);
  }, [repeatPressIn, onPressIn]);
  const handlePressOut = useCallback(e => {
    repeatPressOut();
    onPressOut?.(e);
  }, [repeatPressOut, onPressOut]);
  const handlePress = useCallback(e => {
    onPress?.(e);
  }, [onPress]);
  const Component = asChild ? Slot.Pressable : Pressable;
  return /*#__PURE__*/_jsx(Component, {
    ref: ref,
    role: "button",
    accessibilityLabel: "Increase value",
    accessibilityState: {
      disabled: isEffectivelyDisabled
    },
    disabled: isEffectivelyDisabled,
    onPressIn: handlePressIn,
    onPressOut: handlePressOut,
    onPress: handlePress,
    ...pressableProps
  });
});
IncrementButton.displayName = 'HeroUINative.Primitive.NumberStepper.IncrementButton';

// --------------------------------------------------

const Value = /*#__PURE__*/forwardRef(({
  asChild,
  children,
  ...textProps
}, ref) => {
  const {
    value,
    nativeID
  } = useRootContext();
  const Component = asChild ? Slot.Text : RNText;
  return /*#__PURE__*/_jsx(Component, {
    ref: ref,
    "aria-live": "polite",
    nativeID: `${nativeID}_value`,
    ...textProps,
    children: children ?? String(value)
  });
});
Value.displayName = 'HeroUINative.Primitive.NumberStepper.Value';

// --------------------------------------------------

export { DecrementButton, IncrementButton, Root, useRootContext, Value };