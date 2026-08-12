"use strict";

import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Clock glyph used by `TimePicker.TriggerIndicator` (and available for custom layouts).
 */
export const ClockIcon = ({
  size = 16,
  color = 'currentColor'
}) => {
  return /*#__PURE__*/_jsxs(Svg, {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    children: [/*#__PURE__*/_jsx(Circle, {
      cx: 12,
      cy: 12,
      r: 9,
      stroke: color,
      strokeWidth: 2
    }), /*#__PURE__*/_jsx(Path, {
      d: "M12 7v5l3 2",
      stroke: color,
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    })]
  });
};
ClockIcon.displayName = 'HeroUINative.ClockIcon';