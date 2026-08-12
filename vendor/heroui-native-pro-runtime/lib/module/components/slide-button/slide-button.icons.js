"use strict";

import { useThemeColor } from 'heroui-native/hooks';
import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const DEFAULT_ICON_COLOR = '#000000';

/**
 * Default chevron-right icon for the SlideButton thumb.
 * Uses white by default for contrast against the variant background.
 */
export const ChevronRightIcon = ({
  size = 20,
  color
}) => {
  const themeColorPlaceholder = useThemeColor('field-placeholder');
  const fillColor = color ?? themeColorPlaceholder ?? DEFAULT_ICON_COLOR;
  return /*#__PURE__*/_jsxs(Svg, {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    children: [/*#__PURE__*/_jsx(Rect, {
      width: 16,
      height: 16,
      fill: "none"
    }), /*#__PURE__*/_jsx(Path, {
      fill: fillColor,
      fillRule: "evenodd",
      d: "M5.47 13.03a.75.75 0 0 1 0-1.06L9.44 8L5.47 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0",
      clipRule: "evenodd"
    })]
  });
};