"use strict";

import { forwardRef, useMemo } from 'react';
import { TextInput } from 'react-native';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import { jsx as _jsx } from "react/jsx-runtime";
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

/**
 * Props for {@link ReText}.
 *
 * `text` holds the string driven on the UI thread via `useAnimatedProps`.
 */

/**
 * Read-only `TextInput` surface whose visible characters are updated from a
 * {@link SharedValue<string>} on the UI thread using `useAnimatedProps`.
 *
 * @param props - {@link ReTextProps}
 */
const ReText = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    className,
    style,
    text,
    ...rest
  } = props;
  const initialValue = useMemo(() => text.get(), [text]);
  const animatedProps = useAnimatedProps(() => {
    return {
      text: text.get()
    };
  });
  return /*#__PURE__*/_jsx(AnimatedTextInput, {
    ref: ref,
    editable: false,
    underlineColorAndroid: "transparent",
    ...rest,
    className: className,
    style: style,
    value: initialValue
    // @ts-expect-error Reanimated allows animating `text` on TextInput after addWhitelistedNativeProps; `animatedProps` typings omit `text`.
    ,
    animatedProps: animatedProps
  });
});
ReText.displayName = 'HeroUINative.Internal.ReText';
export default ReText;