"use strict";

import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { withUniwind } from 'uniwind';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ---------------------------------------------------------------------------
// Monochrome variant
// ---------------------------------------------------------------------------

/**
 * Facebook circular "f" logo icon — monochrome React Native SVG implementation.
 * Wrapped with withUniwind to enable className-based styling.
 */
const FacebookIconComponent = ({
  size = 20,
  color = 'currentColor'
}) => {
  return /*#__PURE__*/_jsx(Svg, {
    width: size,
    height: size,
    viewBox: "0 0 512 512",
    children: /*#__PURE__*/_jsx(Path, {
      fillRule: "evenodd",
      clipRule: "evenodd",
      fill: color,
      d: "M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256c0 120 82.7 220.8 194.2 248.5V334.2h-56.6V256h56.6v-59.5c0-55.8 33.3-86.7 84.3-86.7c24.4 0 49.9 4.4 49.9 4.4v54.8h-28.1c-27.7 0-36.4 17.2-36.4 34.8V256h61.8l-9.9 78.2h-51.9v170.3C429.3 476.8 512 376 512 256Z"
    })
  });
};

/**
 * Monochrome Facebook icon wrapped with withUniwind for className-based styling.
 *
 * @example
 * ```tsx
 * <FacebookIcon colorClassName="accent-foreground" />
 * <FacebookIcon size={24} color="#000" />
 * ```
 */
export const FacebookIcon = withUniwind(FacebookIconComponent, {
  color: {
    fromClassName: 'colorClassName',
    styleProperty: 'accentColor'
  }
});

// ---------------------------------------------------------------------------
// Colored variant (original Facebook brand colour)
// ---------------------------------------------------------------------------

/**
 * Facebook circular "f" logo with the original brand blue (#1877F2) circle
 * and white "f". Does not accept a color prop — always renders in brand colours.
 */
const FacebookColoredIconComponent = ({
  size = 20
}) => {
  return /*#__PURE__*/_jsxs(Svg, {
    width: size,
    height: size,
    viewBox: "0 0 512 512",
    children: [/*#__PURE__*/_jsx(Circle, {
      cx: 256,
      cy: 256,
      r: 256,
      fill: "#1877F2"
    }), /*#__PURE__*/_jsx(Path, {
      fill: "#FFFFFF",
      d: "M355.6 330l11.4-74h-71v-48c0-20.2 9.9-40 41.7-40H370v-63s-29.3-5-57.3-5c-58.5 0-96.7 35.4-96.7 99.6V256h-65v74h65v178.9c13 2.1 26.4 3.1 40 3.1s27-1.1 40-3.1V330h54.6z"
    })]
  });
};

/**
 * Colored Facebook icon (original brand colour).
 * Used by SocialAuthButton when no custom colour override is provided.
 *
 * @example
 * ```tsx
 * <FacebookColoredIcon size={24} />
 * ```
 */
export const FacebookColoredIcon = FacebookColoredIconComponent;