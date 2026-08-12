"use strict";

import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { withUniwind } from 'uniwind';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ---------------------------------------------------------------------------
// Monochrome variant
// ---------------------------------------------------------------------------

/**
 * Google "G" icon - monochrome React Native SVG implementation.
 * Wrapped with withUniwind to enable className-based styling.
 */
const GoogleIconComponent = ({
  size = 20,
  color = 'currentColor'
}) => {
  return /*#__PURE__*/_jsxs(Svg, {
    width: size,
    height: size,
    viewBox: "0 0 56 56",
    children: [/*#__PURE__*/_jsx(Rect, {
      width: 56,
      height: 56,
      fill: "none"
    }), /*#__PURE__*/_jsx(Path, {
      fill: color,
      fillRule: "evenodd",
      d: "M28.458 5c6.167 0 11.346 2.2 15.368 5.804l.323.295l-6.62 6.464c-1.695-1.59-4.666-3.493-9.07-3.493c-6.204 0-11.47 4.093-13.372 9.749c-.47 1.46-.756 3.023-.756 4.64c0 1.615.287 3.18.782 4.639c1.877 5.656 7.142 9.748 13.345 9.748c3.347 0 5.928-.886 7.881-2.176l.251-.17l.307-.222c2.813-2.108 4.144-5.084 4.46-7.169l.03-.22h-12.93v-8.705h22.025c.339 1.46.495 2.867.495 4.795c0 7.142-2.554 13.163-6.985 17.255c-3.884 3.597-9.201 5.682-15.535 5.682c-9.031 0-16.85-5.102-20.772-12.57l-.184-.358l-.222-.457A23.45 23.45 0 0 1 5 28.458c0-3.6.827-7.01 2.28-10.073l.222-.457l.184-.357C11.608 10.1 19.426 5 28.458 5"
    })]
  });
};

/**
 * Monochrome Google icon wrapped with withUniwind for className-based styling.
 *
 * @example
 * ```tsx
 * <GoogleIcon colorClassName="accent-foreground" />
 * <GoogleIcon size={24} color="#000" />
 * ```
 */
export const GoogleIcon = withUniwind(GoogleIconComponent, {
  color: {
    fromClassName: 'colorClassName',
    styleProperty: 'accentColor'
  }
});

// ---------------------------------------------------------------------------
// Colored variant (original Google brand colours)
// ---------------------------------------------------------------------------

/**
 * Google "G" icon with original brand colours (blue, red, yellow, green).
 * Does not accept a color prop — always renders in brand colours.
 */
const GoogleColoredIconComponent = ({
  size = 20
}) => {
  return /*#__PURE__*/_jsxs(Svg, {
    width: size,
    height: size,
    viewBox: "0 0 48 48",
    children: [/*#__PURE__*/_jsx(Path, {
      fill: "#EA4335",
      d: "M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    }), /*#__PURE__*/_jsx(Path, {
      fill: "#4285F4",
      d: "M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    }), /*#__PURE__*/_jsx(Path, {
      fill: "#FBBC05",
      d: "M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.006 24.006 0 0 0 0 21.56l7.98-6.19z"
    }), /*#__PURE__*/_jsx(Path, {
      fill: "#34A853",
      d: "M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    })]
  });
};

/**
 * Colored Google icon (original brand colours).
 * Used by SocialAuthButton when no custom colour override is provided.
 *
 * @example
 * ```tsx
 * <GoogleColoredIcon size={24} />
 * ```
 */
export const GoogleColoredIcon = GoogleColoredIconComponent;