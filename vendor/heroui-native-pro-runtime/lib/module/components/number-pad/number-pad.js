"use strict";

import { AnimationSettingsProvider } from 'heroui-native/contexts';
import { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { HeroText } from "../../helpers/internal/components/index.js";
import { useControllableState } from "../../helpers/internal/hooks/index.js";
import { createContext } from "../../helpers/internal/utils/index.js";
import { useNumberPadKeyAnimation, useNumberPadRootAnimation } from "./number-pad.animation.js";
import { DEFAULT_ROWS, DISPLAY_NAME, KEY_HIT_SLOP } from "./number-pad.constants.js";
import { BackspaceIcon } from "./number-pad.icons.js";
import { numberPadClassNames, numberPadStyleSheet } from "./number-pad.styles.js";
import { appendToValue, deleteFromValue } from "./number-pad.utils.js";
import { jsx as _jsx } from "react/jsx-runtime";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const [NumberPadProvider, useNumberPad] = createContext({
  name: 'NumberPadContext'
});
const [NumberPadKeyProvider, useNumberPadKey] = createContext({
  name: 'NumberPadKeyContext'
});

// --------------------------------------------------

const NumberPadRoot = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    value: valueProp,
    defaultValue = '',
    onValueChange,
    maxLength,
    onKeyPress,
    onBackspacePress,
    onSpacerPress,
    onClear,
    onComplete,
    isDisabled = false,
    className,
    animation,
    ...restProps
  } = props;
  const [value = '', setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange
  });
  const valueRef = useRef(value);
  valueRef.current = value;
  const rootClassName = numberPadClassNames.root({
    isDisabled,
    className
  });
  const {
    isAllAnimationsDisabled
  } = useNumberPadRootAnimation({
    animation
  });
  const appendKey = useCallback(key => {
    const currentValue = valueRef.current ?? '';
    const result = appendToValue(currentValue, key, maxLength);
    onKeyPress?.(key, result.value);
    if (result.isBlocked) {
      return;
    }
    valueRef.current = result.value;
    setValue(result.value);
    if (result.isComplete) {
      onComplete?.(result.value);
    }
  }, [maxLength, onComplete, onKeyPress, setValue]);
  const deleteKey = useCallback(() => {
    const currentValue = valueRef.current ?? '';
    const nextValue = deleteFromValue(currentValue);
    onBackspacePress?.(nextValue);
    valueRef.current = nextValue;
    setValue(nextValue);
  }, [onBackspacePress, setValue]);
  const clear = useCallback(() => {
    onClear?.();
    valueRef.current = '';
    setValue('');
  }, [onClear, setValue]);
  const contextValue = useMemo(() => ({
    appendKey,
    clear,
    deleteKey,
    isDisabled,
    value,
    onSpacerPress
  }), [appendKey, clear, deleteKey, isDisabled, value, onSpacerPress]);
  const animationSettingsContextValue = useMemo(() => ({
    isAllAnimationsDisabled
  }), [isAllAnimationsDisabled]);
  const defaultContent = useMemo(() => {
    return DEFAULT_ROWS.map((rowItems, rowIndex) => /*#__PURE__*/_jsx(NumberPadRow, {
      children: rowItems.map((item, index) => {
        if (item.type === 'spacer') {
          return /*#__PURE__*/_jsx(NumberPadSpacer, {}, `spacer-${index}`);
        }
        if (item.type === 'backspace') {
          return /*#__PURE__*/_jsx(NumberPadBackspace, {}, `backspace-${index}`);
        }
        return /*#__PURE__*/_jsx(NumberPadKey, {
          value: item.value
        }, `key-${item.value}-${index}`);
      })
    }, `row-${rowIndex}`));
  }, []);
  const content = children ?? defaultContent;
  return /*#__PURE__*/_jsx(AnimationSettingsProvider, {
    value: animationSettingsContextValue,
    children: /*#__PURE__*/_jsx(NumberPadProvider, {
      value: contextValue,
      children: /*#__PURE__*/_jsx(View, {
        ref: ref,
        accessibilityRole: "none",
        className: rootClassName,
        ...restProps,
        children: content
      })
    })
  });
});

// --------------------------------------------------

const NumberPadRow = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const containerClassName = numberPadClassNames.row({
    className
  });
  return /*#__PURE__*/_jsx(View, {
    ref: ref,
    className: containerClassName,
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

const NumberPadKey = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    value,
    children,
    className,
    animation,
    isAnimatedStyleActive = true,
    isDisabled: isDisabledProp = false,
    onPress,
    onPressIn,
    onPressOut,
    ...restProps
  } = props;
  const {
    appendKey,
    isDisabled: rootDisabled
  } = useNumberPad();
  const isDisabled = rootDisabled || isDisabledProp;
  const [isPressed, setIsPressed] = useState(false);
  const {
    animationOnPressIn,
    animationOnPressOut,
    rContainerStyle
  } = useNumberPadKeyAnimation({
    animation
  });
  const containerClassName = numberPadClassNames.key({
    className
  });
  const handlePress = useCallback(event => {
    if (isDisabled) {
      return;
    }
    if (onPress) {
      onPress(event);
      return;
    }
    appendKey(value);
  }, [appendKey, isDisabled, onPress, value]);
  const handlePressIn = useCallback(event => {
    setIsPressed(true);
    animationOnPressIn();
    onPressIn?.(event);
  }, [animationOnPressIn, onPressIn]);
  const handlePressOut = useCallback(event => {
    setIsPressed(false);
    animationOnPressOut();
    onPressOut?.(event);
  }, [animationOnPressOut, onPressOut]);
  const containerStyle = isAnimatedStyleActive ? [numberPadStyleSheet.keyContainer, rContainerStyle] : numberPadStyleSheet.keyContainer;
  const keyContextValue = useMemo(() => ({
    value,
    isPressed,
    isDisabled
  }), [value, isPressed, isDisabled]);
  const content = typeof children === 'function' ? children({
    value,
    isPressed,
    isDisabled
  }) : children ?? /*#__PURE__*/_jsx(NumberPadKeyLabel, {});
  return /*#__PURE__*/_jsx(NumberPadKeyProvider, {
    value: keyContextValue,
    children: /*#__PURE__*/_jsx(AnimatedPressable, {
      ref: ref,
      accessibilityLabel: value,
      accessibilityRole: "button",
      accessibilityState: {
        disabled: isDisabled
      },
      className: containerClassName,
      "data-disabled": isDisabled || undefined,
      "data-pressed": isPressed || undefined,
      disabled: isDisabled,
      hitSlop: KEY_HIT_SLOP,
      onPress: handlePress,
      onPressIn: handlePressIn,
      onPressOut: handlePressOut,
      style: containerStyle,
      ...restProps,
      children: content
    })
  });
});

// --------------------------------------------------

const NumberPadKeyLabel = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    style,
    ...restProps
  } = props;
  const {
    value
  } = useNumberPadKey();
  const labelClassName = numberPadClassNames.keyLabel({
    className
  });
  return /*#__PURE__*/_jsx(HeroText, {
    ref: ref,
    className: labelClassName,
    style: [numberPadStyleSheet.keyLabel, style],
    ...restProps,
    children: children ?? value
  });
});

// --------------------------------------------------

const NumberPadBackspace = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    iconProps,
    onPress,
    onLongPress,
    ...restProps
  } = props;
  const {
    clear,
    deleteKey
  } = useNumberPad();
  const backspaceClassName = numberPadClassNames.backspace({
    className
  });
  const handlePress = useCallback(event => {
    if (onPress) {
      onPress(event);
      return;
    }
    deleteKey();
  }, [deleteKey, onPress]);
  const handleLongPress = useCallback(event => {
    if (onLongPress) {
      onLongPress(event);
      return;
    }
    clear();
  }, [clear, onLongPress]);
  return /*#__PURE__*/_jsx(NumberPadKey, {
    ref: ref,
    value: "",
    accessibilityHint: "Long press to clear all",
    accessibilityLabel: "Backspace",
    className: backspaceClassName,
    delayLongPress: 400,
    onLongPress: handleLongPress,
    onPress: handlePress,
    ...restProps,
    children: children ?? /*#__PURE__*/_jsx(BackspaceIcon, {
      ...iconProps
    })
  });
});

// --------------------------------------------------

const NumberPadSpacer = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    onPress,
    ...restProps
  } = props;
  const {
    onSpacerPress
  } = useNumberPad();
  const handlePress = useCallback(event => {
    if (onPress) {
      onPress(event);
      return;
    }
    onSpacerPress?.();
  }, [onPress, onSpacerPress]);
  if (children != null) {
    return /*#__PURE__*/_jsx(NumberPadKey, {
      ref: ref,
      value: "",
      className: numberPadClassNames.spacerActive({
        className
      }),
      onPress: handlePress,
      ...restProps,
      children: children
    });
  }
  const containerClassName = numberPadClassNames.spacerInactive({
    className
  });
  return /*#__PURE__*/_jsx(View, {
    ref: ref,
    accessibilityElementsHidden: true,
    importantForAccessibility: "no-hide-descendants",
    className: containerClassName
  });
});

// --------------------------------------------------

NumberPadRoot.displayName = DISPLAY_NAME.ROOT;
NumberPadRow.displayName = DISPLAY_NAME.ROW;
NumberPadKey.displayName = DISPLAY_NAME.KEY;
NumberPadKeyLabel.displayName = DISPLAY_NAME.KEY_LABEL;
NumberPadBackspace.displayName = DISPLAY_NAME.BACKSPACE;
NumberPadSpacer.displayName = DISPLAY_NAME.SPACER;

/**
 * Compound NumberPad component with sub-components.
 *
 * @component NumberPad - Root column container managing value state.
 * Auto-renders the default 3×4 digit layout when no children are provided.
 *
 * @component NumberPad.Row - Horizontal container that lays out a row of keys
 * with equal widths. Required when composing keys manually.
 *
 * @component NumberPad.Key - Pressable digit key with subtle press animation.
 * Appends its value to the pad value by default. Renders a default
 * NumberPad.KeyLabel showing its value when no children are provided.
 *
 * @component NumberPad.KeyLabel - Text label inside a key. Defaults to the
 * parent key's value when no children are provided.
 *
 * @component NumberPad.Backspace - Delete key. Press removes one character;
 * long-press clears the entire value.
 *
 * @component NumberPad.Spacer - Grid cell preserving alignment. Renders an
 * inert empty cell by default; when given children it behaves like a
 * NumberPad.Key for custom actions such as biometric authentication.
 *
 * Props flow from NumberPad to sub-components via context.
 */
const NumberPad = Object.assign(NumberPadRoot, {
  /** @optional Horizontal row container distributing keys with equal widths */
  Row: NumberPadRow,
  /** @optional Pressable digit key with press animation */
  Key: NumberPadKey,
  /** @optional Text label inside a key, defaults to the key's value */
  KeyLabel: NumberPadKeyLabel,
  /** @optional Backspace key — press to delete, long-press to clear */
  Backspace: NumberPadBackspace,
  /** @optional Grid cell — inert when empty, acts as a key when given children */
  Spacer: NumberPadSpacer
});
export default NumberPad;
export { useNumberPad };