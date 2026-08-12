"use strict";

import { AnimationSettingsProvider } from 'heroui-native/contexts';
import { forwardRef, useMemo } from 'react';
import { View } from 'react-native';
import { HeroText } from "../../helpers/internal/components/index.js";
import { createContext } from "../../helpers/internal/utils/index.js";
import InternationalizedNumberPackage from "../../optional/internationalized-number.js";
import { useNumberValueRootAnimation } from "./number-value.animation.js";
import { DISPLAY_NAME } from "./number-value.constants.js";
import { numberValueClassNames, numberValueStyleSheet } from "./number-value.styles.js";
import { jsx as _jsx } from "react/jsx-runtime";
// --------------------------------------------------

const [NumberValueProvider, useNumberValue] = createContext({
  name: 'NumberValueContext'
});

// --------------------------------------------------

const NumberValueRoot = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    value,
    formatOptions,
    locale,
    numberStyle,
    currency,
    unit,
    notation,
    signDisplay,
    minimumFractionDigits,
    maximumFractionDigits,
    className,
    classNames,
    style,
    styles,
    animation,
    ...restProps
  } = props;
  const {
    isAllAnimationsDisabled
  } = useNumberValueRootAnimation({
    animation
  });
  const animationSettingsContextValue = useMemo(() => ({
    isAllAnimationsDisabled
  }), [isAllAnimationsDisabled]);
  const options = useMemo(() => formatOptions ?? {
    ...(numberStyle != null && {
      style: numberStyle
    }),
    ...(currency != null && {
      currency
    }),
    ...(unit != null && {
      unit
    }),
    ...(notation != null && {
      notation
    }),
    ...(signDisplay != null && {
      signDisplay
    }),
    ...(minimumFractionDigits != null && {
      minimumFractionDigits
    }),
    ...(maximumFractionDigits != null && {
      maximumFractionDigits
    })
  }, [formatOptions, numberStyle, currency, unit, notation, signDisplay, minimumFractionDigits, maximumFractionDigits]);
  const formatted = useMemo(() => {
    if (!InternationalizedNumberPackage) {
      throw new Error('@internationalized/number is required to use NumberValue. Install it with `yarn add @internationalized/number`.');
    }
    const resolvedLocale = locale ?? new Intl.NumberFormat().resolvedOptions().locale;
    const formatter = new InternationalizedNumberPackage.NumberFormatter(resolvedLocale, options);
    return formatter.format(value);
  }, [locale, options, value]);
  const {
    container
  } = numberValueClassNames.root();
  const containerClassName = container({
    className: [className, classNames?.container]
  });
  const contextValue = useMemo(() => ({
    formatted,
    valueClassName: classNames?.value,
    valueStyle: styles?.value
  }), [formatted, classNames?.value, styles?.value]);
  if (typeof children === 'function') {
    return /*#__PURE__*/_jsx(AnimationSettingsProvider, {
      value: animationSettingsContextValue,
      children: /*#__PURE__*/_jsx(NumberValueProvider, {
        value: contextValue,
        children: children(formatted)
      })
    });
  }
  return /*#__PURE__*/_jsx(AnimationSettingsProvider, {
    value: animationSettingsContextValue,
    children: /*#__PURE__*/_jsx(NumberValueProvider, {
      value: contextValue,
      children: /*#__PURE__*/_jsx(View, {
        ref: ref,
        className: containerClassName,
        style: [styles?.container, style],
        ...restProps,
        children: children ?? /*#__PURE__*/_jsx(NumberValueValue, {})
      })
    })
  });
});

// --------------------------------------------------

const NumberValueValue = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    className,
    children,
    style,
    ...restProps
  } = props;
  const ctx = useNumberValue();
  const valueClassName = numberValueClassNames.value({
    className: [ctx.valueClassName, className]
  });
  return /*#__PURE__*/_jsx(HeroText, {
    ref: ref,
    className: valueClassName,
    style: [numberValueStyleSheet.value, ctx.valueStyle, style],
    ...restProps,
    children: children ?? ctx.formatted
  });
});

// --------------------------------------------------

const NumberValuePrefix = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const prefixClassName = numberValueClassNames.prefix({
    className
  });
  return /*#__PURE__*/_jsx(HeroText, {
    ref: ref,
    className: prefixClassName,
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

const NumberValueSuffix = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const suffixClassName = numberValueClassNames.suffix({
    className
  });
  return /*#__PURE__*/_jsx(HeroText, {
    ref: ref,
    className: suffixClassName,
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

NumberValueRoot.displayName = DISPLAY_NAME.ROOT;
NumberValueValue.displayName = DISPLAY_NAME.VALUE;
NumberValuePrefix.displayName = DISPLAY_NAME.PREFIX;
NumberValueSuffix.displayName = DISPLAY_NAME.SUFFIX;

// --------------------------------------------------

/**
 * Compound `NumberValue` component with sub-components.
 *
 * @component NumberValue - Locale-aware formatted number built on top of
 * `@internationalized/number`. Renders as a row-laid `View` with two
 * slots: `container` (the outer `View`) and `value` (the inner `Text`
 * rendering the formatted string). Accepts convenience props
 * (`numberStyle`, `currency`, `notation`, `signDisplay`,
 * `minimumFractionDigits`, `maximumFractionDigits`, `unit`) or a raw
 * `formatOptions` object. Without children, the root auto-renders the
 * formatted value using the `value` slot styling. With children, the
 * consumer composes the layout using `Value`, `Prefix`, and `Suffix`.
 * Digits are rendered with tabular figures so columns of numbers align
 * vertically.
 *
 * @component NumberValue.Value - Renders the formatted numeric string
 * read from the nearest `NumberValue` context. Use this part to control
 * the placement of the value when composing a custom layout — for example
 * between a `Prefix` and a `Suffix`.
 *
 * @component NumberValue.Prefix - Inline text placed before the value
 * (e.g. a leading label or a unit symbol).
 *
 * @component NumberValue.Suffix - Inline text placed after the value
 * (e.g. a trailing label or a unit symbol).
 *
 * `NumberValue` also supports a render-function `children` that receives
 * the formatted string and is fully responsible for the resulting output
 * (no wrapping container is rendered in that case).
 *
 */
const NumberValue = Object.assign(NumberValueRoot, {
  /** @optional Formatted numeric string read from the root context. */
  Value: NumberValueValue,
  /** @optional Inline text rendered before the value. */
  Prefix: NumberValuePrefix,
  /** @optional Inline text rendered after the value. */
  Suffix: NumberValueSuffix
});
export default NumberValue;
export { useNumberValue };