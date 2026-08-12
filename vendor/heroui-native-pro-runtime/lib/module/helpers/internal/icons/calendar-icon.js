"use strict";

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Calendar glyph used by `DatePicker.TriggerIndicator` (and available for custom layouts).
 */
export const CalendarIcon = ({
  size = 16,
  color = 'currentColor'
}) => {
  const height = size * 14 / 13;
  return /*#__PURE__*/_jsx(Svg, {
    width: size,
    height: height,
    viewBox: "0 0 13 14",
    fill: "none",
    children: /*#__PURE__*/_jsx(Path, {
      clipRule: "evenodd",
      d: "M3.75 4.5A.75.75 0 0 1 3 3.75v-.748a1.5 1.5 0 0 0-1.5 1.5v1h10v-1a1.5 1.5 0 0 0-1.5-1.5v.75a.75.75 0 1 1-1.5 0v-.75h-4v.747a.75.75 0 0 1-.75.75ZM8.5 1.501h-4V.75a.75.75 0 0 0-1.5 0v.752a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3v-.75a.75.75 0 0 0-1.5 0v.75Zm-7 5.5v3.5a1.5 1.5 0 0 0 1.5 1.5h7a1.5 1.5 0 0 0 1.5-1.5v-3.5h-10Z",
      fill: color,
      fillRule: "evenodd"
    })
  });
};
CalendarIcon.displayName = 'HeroUINative.CalendarIcon';