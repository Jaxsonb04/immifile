"use strict";

import { Button } from 'heroui-native/button';
import { forwardRef } from 'react';
import { DEFAULT_ICON_SIZE, DEFAULT_VARIANT, DISPLAY_NAME, PROVIDER_CONFIG, VARIANT_ICON_COLOR_CLASS_NAME } from "./social-auth-button.constants.js";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// --------------------------------------------------

const SocialAuthButtonRoot = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    provider,
    iconProps,
    label,
    children,
    variant = DEFAULT_VARIANT,
    ...restProps
  } = props;
  const config = PROVIDER_CONFIG[provider];
  const hasCustomColor = iconProps?.color !== undefined || iconProps?.colorClassName !== undefined;
  const resolvedLabel = label ?? config.label;
  const renderIcon = () => {
    const size = iconProps?.size ?? DEFAULT_ICON_SIZE;
    if (config.ColoredIcon && !hasCustomColor) {
      return /*#__PURE__*/_jsx(config.ColoredIcon, {
        size: size
      });
    }
    const resolvedColorClassName = iconProps?.colorClassName ?? VARIANT_ICON_COLOR_CLASS_NAME[variant];
    return /*#__PURE__*/_jsx(config.Icon, {
      size: size,
      color: iconProps?.color,
      colorClassName: resolvedColorClassName
    });
  };
  return /*#__PURE__*/_jsx(Button, {
    ref: ref,
    variant: variant,
    ...restProps,
    children: children ?? /*#__PURE__*/_jsxs(_Fragment, {
      children: [renderIcon(), /*#__PURE__*/_jsx(Button.Label, {
        children: resolvedLabel
      })]
    })
  });
});

// --------------------------------------------------

SocialAuthButtonRoot.displayName = DISPLAY_NAME.AUTH_BUTTON_ROOT;

/**
 * SocialAuthButton component — a specialised Button that renders a provider-specific
 * monochrome icon alongside a label (e.g. "Continue with Google").
 *
 * Defaults to `variant="outline"` and `size="lg"`.
 * The icon and label are derived from the `provider` prop; both can be
 * overridden via `iconProps` / `label`, or replaced entirely with `children`.
 *
 * @example
 * ```tsx
 * <SocialAuthButton provider="github" />
 * <SocialAuthButton provider="google" label="Sign in with Google" />
 * <SocialAuthButton provider="apple" variant="primary" />
 * ```
 */
const SocialAuthButton = SocialAuthButtonRoot;
export default SocialAuthButton;