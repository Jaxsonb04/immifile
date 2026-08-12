"use strict";

import Svg, { Path } from 'react-native-svg';
import { withUniwind } from 'uniwind';

/**
 * Props for the built-in {@link RatingStarIcon} and any custom SVG icon a
 * consumer wants to plug into {@link Rating}. Shaped after the icon props
 * used across other compound components so they compose cleanly.
 */
import { jsx as _jsx } from "react/jsx-runtime";
/** Default star icon fallback size (matches {@link ICON_SIZE_MAP.md}). */
const DEFAULT_ICON_SIZE = 24;

/**
 * Filled star shape used by {@link Rating} for both inactive (low opacity)
 * and active (full opacity) renders. The path is a solid fill — the
 * partial-fill effect is achieved by clipping a second copy of this shape
 * with a width-constrained overlay, so any icon with a solid fill can be
 * used in its place.
 */
const RatingStarBase = ({
  size = DEFAULT_ICON_SIZE,
  color = 'currentColor',
  ...restProps
}) => {
  return /*#__PURE__*/_jsx(Svg, {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    fill: "none",
    ...restProps,
    children: /*#__PURE__*/_jsx(Path, {
      d: "M6.886.773C7.29-.231 8.71-.231 9.114.773l1.472 3.667l3.943.268c1.08.073 1.518 1.424.688 2.118L12.185 9.36l.964 3.832c.264 1.05-.886 1.884-1.802 1.31L8 12.4l-3.347 2.101c-.916.575-2.066-.26-1.802-1.309l.964-3.832L.783 6.826c-.83-.694-.391-2.045.688-2.118l3.943-.268z",
      fill: color
    })
  });
};

/**
 * Default star icon for {@link Rating}. Wrapped with `withUniwind` so the
 * fill color can be driven from a Tailwind class (e.g.
 * `colorClassName="accent-warning"`).
 */
export const RatingStarIcon = withUniwind(RatingStarBase, {
  color: {
    fromClassName: 'colorClassName',
    styleProperty: 'accentColor'
  }
});