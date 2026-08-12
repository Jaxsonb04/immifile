"use strict";

import React from 'react';
import Svg, { G, Path } from 'react-native-svg';
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Chevron left icon component.
 * Same path as {@link ChevronRightIcon}, mirrored horizontally about the center of the 24×24 viewBox.
 */
export const ChevronLeftIcon = ({
  size = 16,
  color = 'currentColor'
}) => {
  return /*#__PURE__*/_jsx(Svg, {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: color,
    children: /*#__PURE__*/_jsx(G, {
      transform: "translate(12, 0) scale(-1, 1) translate(-12, 0)",
      children: /*#__PURE__*/_jsx(Path, {
        fillRule: "evenodd",
        d: "M8.205 19.545a1.125 1.125 0 0 1 0-1.59L14.16 12l-5.955-5.955a1.125 1.125 0 1 1 1.59-1.59l6.75 6.75a1.125 1.125 0 0 1 0 1.59l-6.75 6.75a1.125 1.125 0 0 1-1.59 0",
        clipRule: "evenodd"
      })
    })
  });
};
ChevronLeftIcon.displayName = 'HeroUINative.ChevronLeftIcon';