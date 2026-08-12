"use strict";

import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { withUniwind } from 'uniwind';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * LinkedIn "in" logo icon - monochrome React Native SVG implementation.
 * Wrapped with withUniwind to enable className-based styling.
 */
const LinkedInIconComponent = ({
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
      d: "M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"
    })]
  });
};

/**
 * Monochrome LinkedIn icon wrapped with withUniwind for className-based styling
 *
 * @example
 * ```tsx
 * <LinkedInIcon colorClassName="accent-foreground" />
 * <LinkedInIcon size={24} color="#000" />
 * ```
 */
export const LinkedInIcon = withUniwind(LinkedInIconComponent, {
  color: {
    fromClassName: 'colorClassName',
    styleProperty: 'accentColor'
  }
});