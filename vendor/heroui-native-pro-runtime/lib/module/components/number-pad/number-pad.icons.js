"use strict";

import { useThemeColor } from 'heroui-native/hooks';
import Svg, { Path, Rect } from 'react-native-svg';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Default backspace icon for the NumberPad backspace key.
 * Left-pointing arrow on a 16px grid.
 * Uses the foreground theme color when no explicit color is provided.
 */
export const BackspaceIcon = ({
  size = 24,
  color
}) => {
  const themeColorForeground = useThemeColor('foreground');
  return /*#__PURE__*/_jsxs(Svg, {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    children: [/*#__PURE__*/_jsx(Rect, {
      width: 16,
      height: 16,
      fill: "none"
    }), /*#__PURE__*/_jsx(Path, {
      fill: color ?? themeColorForeground,
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M14.75 8a.75.75 0 0 1-.75.75H3.81l2.72 2.72a.75.75 0 1 1-1.06 1.06l-4-4a.75.75 0 0 1 0-1.06l4-4a.75.75 0 0 1 1.06 1.06L3.81 7.25H14a.75.75 0 0 1 .75.75"
    })]
  });
};