"use strict";

import Svg, { Path } from 'react-native-svg';
import { withUniwind } from 'uniwind';
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Fallback size (in pixels) when neither `size` nor a parent
 * {@link TrendChipIndicator} supplies one. The icons render as strokes so
 * they stay crisp at small sizes.
 */
const DEFAULT_ICON_SIZE = 12;

/** Arrow pointing up — used for an `up` trend. */
const TrendArrowUpBase = ({
  size = DEFAULT_ICON_SIZE,
  color = 'currentColor',
  ...restProps
}) => {
  return /*#__PURE__*/_jsx(Svg, {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    ...restProps,
    children: /*#__PURE__*/_jsx(Path, {
      d: "M12 19V5m-5 5 5-5 5 5",
      stroke: color,
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    })
  });
};

/** Arrow pointing right — used for a `neutral` trend. */
const TrendArrowRightBase = ({
  size = DEFAULT_ICON_SIZE,
  color = 'currentColor',
  ...restProps
}) => {
  return /*#__PURE__*/_jsx(Svg, {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    ...restProps,
    children: /*#__PURE__*/_jsx(Path, {
      d: "M5 12h14m-4-4 4 4-4 4",
      stroke: color,
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    })
  });
};

/** Arrow pointing down — used for a `down` trend. */
const TrendArrowDownBase = ({
  size = DEFAULT_ICON_SIZE,
  color = 'currentColor',
  ...restProps
}) => {
  return /*#__PURE__*/_jsx(Svg, {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    ...restProps,
    children: /*#__PURE__*/_jsx(Path, {
      d: "M12 5v14m5-5-5 5-5-5",
      stroke: color,
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    })
  });
};

/**
 * Arrow up icon wrapped with `withUniwind` to enable `colorClassName` props.
 *
 * @example
 * ```tsx
 * <TrendArrowUpIcon size={14} colorClassName="accent-success" />
 * ```
 */
export const TrendArrowUpIcon = withUniwind(TrendArrowUpBase, {
  color: {
    fromClassName: 'colorClassName',
    styleProperty: 'accentColor'
  }
});

/**
 * Arrow right icon wrapped with `withUniwind` to enable `colorClassName` props.
 */
export const TrendArrowRightIcon = withUniwind(TrendArrowRightBase, {
  color: {
    fromClassName: 'colorClassName',
    styleProperty: 'accentColor'
  }
});

/**
 * Arrow down icon wrapped with `withUniwind` to enable `colorClassName` props.
 */
export const TrendArrowDownIcon = withUniwind(TrendArrowDownBase, {
  color: {
    fromClassName: 'colorClassName',
    styleProperty: 'accentColor'
  }
});