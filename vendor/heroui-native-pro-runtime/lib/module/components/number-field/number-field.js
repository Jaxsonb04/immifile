"use strict";

import { Input } from 'heroui-native';
import { AnimationSettingsProvider, FormFieldProvider } from 'heroui-native/contexts';
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useControllableState, useLongPressRepeat } from "../../helpers/internal/hooks/index.js";
import { createContext } from "../../helpers/internal/utils/index.js";
import { useNumberFieldButtonAnimation, useNumberFieldRootAnimation } from "./number-field.animation.js";
import { DISPLAY_NAME } from "./number-field.constants.js";
import { MinusIcon, PlusIcon } from "./number-field.icons.js";
import { numberFieldClassNames, numberFieldStyleSheet } from "./number-field.styles.js";
import { clampValue, formatNumber, parseNumber, snapToStep } from "./number-field.utils.js";
import { jsx as _jsx } from "react/jsx-runtime";
const [NumberFieldProvider, useNumberField] = createContext({
  name: 'NumberFieldContext',
  strict: false
});

// --------------------------------------------------

const NumberFieldRoot = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    value: valueProp,
    defaultValue,
    onChange,
    minValue,
    maxValue,
    step = 1,
    formatOptions,
    isDisabled = false,
    isInvalid = false,
    isRequired = false,
    animation,
    ...restProps
  } = props;
  const [numberValue = NaN, setNumberValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange
  });
  const [displayValue, setDisplayValue] = useState(() => formatNumber(numberValue, formatOptions));

  // Keep displayValue in sync when the external value changes
  const prevNumberValueRef = useRef(numberValue);
  useEffect(() => {
    if (prevNumberValueRef.current !== numberValue) {
      setDisplayValue(formatNumber(numberValue, formatOptions));
      prevNumberValueRef.current = numberValue;
    }
  }, [numberValue, formatOptions]);

  // Button width measurements (for auto-padding the Input)
  const [decrementButtonWidth, setDecrementButtonWidth] = useState(0);
  const [incrementButtonWidth, setIncrementButtonWidth] = useState(0);
  const canIncrement = !isDisabled && (maxValue === undefined || !Number.isNaN(numberValue) && numberValue < maxValue);
  const canDecrement = !isDisabled && (minValue === undefined || !Number.isNaN(numberValue) && numberValue > minValue);
  const increment = useCallback(() => {
    const current = Number.isNaN(numberValue) ? 0 : numberValue;
    const snapped = snapToStep(current, step, 'up', minValue);
    const next = clampValue(snapped, minValue, maxValue);
    setNumberValue(next);
    setDisplayValue(formatNumber(next, formatOptions));
    prevNumberValueRef.current = next;
  }, [numberValue, step, minValue, maxValue, setNumberValue, formatOptions]);
  const decrement = useCallback(() => {
    const current = Number.isNaN(numberValue) ? 0 : numberValue;
    const snapped = snapToStep(current, step, 'down', minValue);
    const next = clampValue(snapped, minValue, maxValue);
    setNumberValue(next);
    setDisplayValue(formatNumber(next, formatOptions));
    prevNumberValueRef.current = next;
  }, [numberValue, step, minValue, maxValue, setNumberValue, formatOptions]);
  const commit = useCallback(() => {
    const parsed = parseNumber(displayValue, formatOptions);
    if (Number.isNaN(parsed)) {
      // Revert to last valid formatted value
      setDisplayValue(formatNumber(numberValue, formatOptions));
      return;
    }
    const clamped = clampValue(parsed, minValue, maxValue);
    setNumberValue(clamped);
    setDisplayValue(formatNumber(clamped, formatOptions));
    prevNumberValueRef.current = clamped;
  }, [displayValue, formatOptions, numberValue, minValue, maxValue, setNumberValue]);
  const {
    isAllAnimationsDisabled
  } = useNumberFieldRootAnimation({
    animation
  });
  const rootClassName = numberFieldClassNames.root({
    className
  });
  const formFieldContextValue = useMemo(() => ({
    isDisabled,
    isInvalid,
    isRequired,
    hasFieldPadding: true
  }), [isDisabled, isInvalid, isRequired]);
  const animationSettingsContextValue = useMemo(() => ({
    isAllAnimationsDisabled
  }), [isAllAnimationsDisabled]);
  const numberFieldContextValue = useMemo(() => ({
    numberValue,
    displayValue,
    isDisabled,
    isInvalid,
    isRequired,
    canIncrement,
    canDecrement,
    increment,
    decrement,
    setDisplayValue,
    commit,
    decrementButtonWidth,
    incrementButtonWidth,
    setDecrementButtonWidth,
    setIncrementButtonWidth
  }), [numberValue, displayValue, isDisabled, isInvalid, isRequired, canIncrement, canDecrement, increment, decrement, commit, decrementButtonWidth, incrementButtonWidth]);
  return /*#__PURE__*/_jsx(AnimationSettingsProvider, {
    value: animationSettingsContextValue,
    children: /*#__PURE__*/_jsx(FormFieldProvider, {
      value: formFieldContextValue,
      children: /*#__PURE__*/_jsx(NumberFieldProvider, {
        value: numberFieldContextValue,
        children: /*#__PURE__*/_jsx(View, {
          ref: ref,
          className: rootClassName,
          ...restProps,
          children: children
        })
      })
    })
  });
});

// --------------------------------------------------

const NumberFieldGroup = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    ...restProps
  } = props;
  const context = useNumberField();
  const renderProps = useMemo(() => ({
    numberValue: context?.numberValue ?? NaN,
    displayValue: context?.displayValue ?? '',
    canIncrement: context?.canIncrement ?? false,
    canDecrement: context?.canDecrement ?? false,
    isDisabled: context?.isDisabled ?? false,
    isInvalid: context?.isInvalid ?? false,
    isRequired: context?.isRequired ?? false,
    decrementButtonWidth: context?.decrementButtonWidth ?? 0,
    incrementButtonWidth: context?.incrementButtonWidth ?? 0
  }), [context]);
  const content = typeof children === 'function' ? children(renderProps) : children;
  return /*#__PURE__*/_jsx(View, {
    ref: ref,
    ...restProps,
    children: content
  });
});

// --------------------------------------------------

const NumberFieldInput = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    style,
    isDisabled: localIsDisabled,
    isAutoPaddingActive = true,
    autoPaddingAddon = 12,
    ...restProps
  } = props;
  const context = useNumberField();
  const isDisabled = localIsDisabled ?? context?.isDisabled ?? undefined;
  const autoPaddingStyle = useMemo(() => {
    if (!isAutoPaddingActive) {
      return undefined;
    }
    const paddingLeft = context?.decrementButtonWidth && context.decrementButtonWidth > 0 ? context.decrementButtonWidth + autoPaddingAddon : undefined;
    const paddingRight = context?.incrementButtonWidth && context.incrementButtonWidth > 0 ? context.incrementButtonWidth + autoPaddingAddon : undefined;
    if (paddingLeft === undefined && paddingRight === undefined) {
      return undefined;
    }
    return {
      paddingLeft,
      paddingRight
    };
  }, [isAutoPaddingActive, autoPaddingAddon, context?.decrementButtonWidth, context?.incrementButtonWidth]);
  const handleChangeText = useCallback(text => {
    context?.setDisplayValue(text);
  }, [context]);
  const handleBlur = useCallback(() => {
    context?.commit();
  }, [context]);
  return /*#__PURE__*/_jsx(Input, {
    ref: ref,
    value: context?.displayValue ?? '',
    onChangeText: handleChangeText,
    onBlur: handleBlur,
    keyboardType: "numeric",
    style: [style, autoPaddingStyle],
    isDisabled: isDisabled,
    accessibilityRole: "adjustable",
    accessibilityLabel: "Number input",
    accessibilityValue: {
      text: context?.displayValue
    },
    ...restProps
  });
});

// --------------------------------------------------

const NumberFieldDecrementButton = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    classNames,
    styles,
    style,
    animation,
    isAnimatedStyleActive = true,
    iconProps,
    onLayout: onLayoutProp,
    onPressIn: onPressInProp,
    onPressOut: onPressOutProp,
    ...restProps
  } = props;
  const [isPressed, setIsPressed] = useState(false);
  const context = useNumberField();
  const isDisabled = !context?.canDecrement;
  const {
    rContentContainerStyle
  } = useNumberFieldButtonAnimation({
    animation,
    isPressed
  });
  const {
    container,
    contentContainer
  } = numberFieldClassNames.decrementButton({
    isDisabled
  });
  const containerClassName = container({
    className: [className, classNames?.container]
  });
  const contentContainerClassName = contentContainer({
    className: classNames?.contentContainer
  });
  const contentContainerStyle = isAnimatedStyleActive ? [rContentContainerStyle, styles?.contentContainer] : styles?.contentContainer;
  const onLayout = useCallback(event => {
    context?.setDecrementButtonWidth(event.nativeEvent.layout.width);
    onLayoutProp?.(event);
  }, [context, onLayoutProp]);
  const {
    onPressIn: internalPressIn,
    onPressOut: internalPressOut
  } = useLongPressRepeat({
    action: () => context?.decrement(),
    isDisabled
  });
  const onPressIn = useCallback(event => {
    setIsPressed(true);
    internalPressIn();
    onPressInProp?.(event);
  }, [internalPressIn, onPressInProp]);
  const onPressOut = useCallback(event => {
    setIsPressed(false);
    internalPressOut();
    onPressOutProp?.(event);
  }, [internalPressOut, onPressOutProp]);
  return /*#__PURE__*/_jsx(Pressable, {
    ref: ref,
    "data-pressed": isPressed,
    className: containerClassName,
    style: [numberFieldStyleSheet.buttonBorderCurve, style, styles?.container],
    onLayout: onLayout,
    onPressIn: onPressIn,
    onPressOut: onPressOut,
    disabled: isDisabled,
    accessibilityRole: "button",
    accessibilityLabel: "Decrement",
    accessibilityState: {
      disabled: isDisabled
    },
    ...restProps,
    children: /*#__PURE__*/_jsx(Animated.View, {
      className: contentContainerClassName,
      style: contentContainerStyle,
      children: children ?? /*#__PURE__*/_jsx(MinusIcon, {
        size: iconProps?.size,
        color: iconProps?.color
      })
    })
  });
});

// --------------------------------------------------

const NumberFieldIncrementButton = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    classNames,
    styles,
    style,
    animation,
    isAnimatedStyleActive = true,
    iconProps,
    onLayout: onLayoutProp,
    onPressIn: onPressInProp,
    onPressOut: onPressOutProp,
    ...restProps
  } = props;
  const [isPressed, setIsPressed] = useState(false);
  const context = useNumberField();
  const isDisabled = !context?.canIncrement;
  const {
    rContentContainerStyle
  } = useNumberFieldButtonAnimation({
    animation,
    isPressed
  });
  const {
    container,
    contentContainer
  } = numberFieldClassNames.incrementButton({
    isDisabled
  });
  const containerClassName = container({
    className: [className, classNames?.container]
  });
  const contentContainerClassName = contentContainer({
    className: classNames?.contentContainer
  });
  const contentContainerStyle = isAnimatedStyleActive ? [rContentContainerStyle, styles?.contentContainer] : styles?.contentContainer;
  const onLayout = useCallback(event => {
    context?.setIncrementButtonWidth(event.nativeEvent.layout.width);
    onLayoutProp?.(event);
  }, [context, onLayoutProp]);
  const {
    onPressIn: internalPressIn,
    onPressOut: internalPressOut
  } = useLongPressRepeat({
    action: () => context?.increment(),
    isDisabled
  });
  const onPressIn = useCallback(event => {
    setIsPressed(true);
    internalPressIn();
    onPressInProp?.(event);
  }, [internalPressIn, onPressInProp]);
  const onPressOut = useCallback(event => {
    setIsPressed(false);
    internalPressOut();
    onPressOutProp?.(event);
  }, [internalPressOut, onPressOutProp]);
  return /*#__PURE__*/_jsx(Pressable, {
    ref: ref,
    "data-pressed": isPressed,
    className: containerClassName,
    style: [numberFieldStyleSheet.buttonBorderCurve, style, styles?.container],
    onLayout: onLayout,
    onPressIn: onPressIn,
    onPressOut: onPressOut,
    disabled: isDisabled,
    accessibilityRole: "button",
    accessibilityLabel: "Increment",
    accessibilityState: {
      disabled: isDisabled
    },
    ...restProps,
    children: /*#__PURE__*/_jsx(Animated.View, {
      className: contentContainerClassName,
      style: contentContainerStyle,
      children: children ?? /*#__PURE__*/_jsx(PlusIcon, {
        size: iconProps?.size,
        color: iconProps?.color
      })
    })
  });
});

// --------------------------------------------------

NumberFieldRoot.displayName = DISPLAY_NAME.NUMBER_FIELD;
NumberFieldGroup.displayName = DISPLAY_NAME.NUMBER_FIELD_GROUP;
NumberFieldInput.displayName = DISPLAY_NAME.NUMBER_FIELD_INPUT;
NumberFieldIncrementButton.displayName = DISPLAY_NAME.NUMBER_FIELD_INCREMENT_BUTTON;
NumberFieldDecrementButton.displayName = DISPLAY_NAME.NUMBER_FIELD_DECREMENT_BUTTON;

/**
 * Compound NumberField component with sub-components.
 *
 * @component NumberField - Root form field container that provides
 * FormFieldProvider (for Label, Description, FieldError), number state
 * management (controlled/uncontrolled), and animation settings context.
 * Combines TextField (form field) and InputGroup (group container) patterns
 * with number-specific logic (formatting, min/max/step, increment/decrement).
 *
 * @component NumberField.Group - Plain View wrapper (like InputGroup root)
 * that contains DecrementButton, Input, and IncrementButton.
 *
 * @component NumberField.Input - Pass-through to the Input component.
 * Displays the formatted numeric value and automatically receives
 * paddingLeft/paddingRight from measured button widths. Commits the
 * value on blur.
 *
 * @component NumberField.DecrementButton - Absolutely positioned button
 * anchored to the left side of the Input. Decrements the value by one step.
 * Auto-disabled when the value reaches minValue. Supports long-press repeat.
 *
 * @component NumberField.IncrementButton - Absolutely positioned button
 * anchored to the right side of the Input. Increments the value by one step.
 * Auto-disabled when the value reaches maxValue. Supports long-press repeat.
 *
 */
const CompoundNumberField = Object.assign(NumberFieldRoot, {
  /** Plain View wrapper for DecrementButton, Input, and IncrementButton */
  Group: NumberFieldGroup,
  /** Pass-through to Input — displays formatted number value */
  Input: NumberFieldInput,
  /** Decrements value by one step; absolutely positioned left */
  DecrementButton: NumberFieldDecrementButton,
  /** Increments value by one step; absolutely positioned right */
  IncrementButton: NumberFieldIncrementButton
});
export default CompoundNumberField;