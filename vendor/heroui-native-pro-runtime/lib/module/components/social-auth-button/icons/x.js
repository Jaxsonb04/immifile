"use strict";

import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { withUniwind } from 'uniwind';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * X (formerly Twitter) logo icon - monochrome React Native SVG implementation.
 * Wrapped with withUniwind to enable className-based styling.
 */
const XIconComponent = ({
  size = 20,
  color = 'currentColor'
}) => {
  return /*#__PURE__*/_jsxs(Svg, {
    width: size,
    height: size,
    viewBox: "0 0 448 512",
    children: [/*#__PURE__*/_jsx(Rect, {
      width: 448,
      height: 512,
      fill: "none"
    }), /*#__PURE__*/_jsx(Path, {
      fill: color,
      d: "M64 32C28.7 32 0 60.7 0 96v320c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64zm297.1 84L257.3 234.6L379.4 396h-95.6L209 298.1L123.3 396H75.8l111-126.9L69.7 116h98l67.7 89.5l78.2-89.5zm-37.8 251.6L153.4 142.9h-28.3l171.8 224.7h26.3z"
    })]
  });
};

/**
 * Monochrome X icon wrapped with withUniwind for className-based styling
 *
 * @example
 * ```tsx
 * <XIcon colorClassName="accent-foreground" />
 * <XIcon size={24} color="#000" />
 * ```
 */
export const XIcon = withUniwind(XIconComponent, {
  color: {
    fromClassName: 'colorClassName',
    styleProperty: 'accentColor'
  }
});