"use strict";

import { Chip } from 'heroui-native/chip';
import { cloneElement, forwardRef, isValidElement, useMemo } from 'react';
import { View } from 'react-native';
import { childrenToString, createContext } from "../../helpers/internal/utils/index.js";
import { DEFAULT_SIZE, DEFAULT_TREND, DEFAULT_VARIANT, DISPLAY_NAME, INDICATOR_SIZE_MAP, TREND_TO_CHIP_COLOR_MAP } from "./trend-chip.constants.js";
import { TrendArrowDownIcon, TrendArrowRightIcon, TrendArrowUpIcon } from "./trend-chip.icons.js";
import { trendChipClassNames, trendChipStyleSheet } from "./trend-chip.styles.js";
import { getIndicatorColorClassName } from "./trend-chip.utils.js";

// --------------------------------------------------
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
const TREND_ARROW_ICON_MAP = {
  up: TrendArrowUpIcon,
  neutral: TrendArrowRightIcon,
  down: TrendArrowDownIcon
};

// --------------------------------------------------

const [TrendChipProvider, useTrendChip] = createContext({
  name: 'TrendChipContext'
});

// --------------------------------------------------

const TrendChipRoot = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    size = DEFAULT_SIZE,
    trend = DEFAULT_TREND,
    variant = DEFAULT_VARIANT,
    ...restProps
  } = props;
  const chipColor = TREND_TO_CHIP_COLOR_MAP[trend];
  const contextValue = useMemo(() => ({
    size,
    trend,
    variant
  }), [size, trend, variant]);
  const stringifiedChildren = childrenToString(children);
  const resolvedChildren = stringifiedChildren !== null ? /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(TrendChipIndicator, {}), /*#__PURE__*/_jsx(TrendChipValue, {
      children: stringifiedChildren
    })]
  }) : children;
  return /*#__PURE__*/_jsx(TrendChipProvider, {
    value: contextValue,
    children: /*#__PURE__*/_jsx(Chip, {
      ref: ref,
      color: chipColor,
      size: size,
      variant: variant,
      ...restProps,
      children: resolvedChildren
    })
  });
});

// --------------------------------------------------

const DefaultTrendArrow = props => {
  const {
    trend,
    ...iconProps
  } = props;
  const Arrow = TREND_ARROW_ICON_MAP[trend];
  return /*#__PURE__*/_jsx(Arrow, {
    ...iconProps
  });
};
const TrendChipIndicator = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    size,
    color,
    colorClassName,
    ...restProps
  } = props;
  const ctx = useTrendChip();
  const indicatorClassName = trendChipClassNames.indicator({
    className
  });
  const resolvedSize = size ?? INDICATOR_SIZE_MAP[ctx.size];
  const resolvedColorClassName = colorClassName ?? getIndicatorColorClassName(ctx.variant, TREND_TO_CHIP_COLOR_MAP[ctx.trend]);
  const iconElement = /*#__PURE__*/isValidElement(children) ? (/*#__PURE__*/cloneElement(children, {
    ...restProps,
    size: children.props.size ?? resolvedSize,
    color: children.props.color ?? color,
    colorClassName: children.props.colorClassName ?? resolvedColorClassName
  })) : /*#__PURE__*/_jsx(DefaultTrendArrow, {
    ...restProps,
    trend: ctx.trend,
    size: resolvedSize,
    color: color,
    colorClassName: resolvedColorClassName
  });
  return /*#__PURE__*/_jsx(View, {
    ref: ref,
    className: indicatorClassName,
    "data-size": ctx.size,
    children: iconElement
  });
});

// --------------------------------------------------

const TrendChipValue = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    style,
    ...restProps
  } = props;
  return /*#__PURE__*/_jsx(Chip.Label, {
    ref: ref,
    style: [trendChipStyleSheet.value, style],
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

const TrendChipPrefix = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    ...restProps
  } = props;
  return /*#__PURE__*/_jsx(Chip.Label, {
    ref: ref,
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

const TrendChipSuffix = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const suffixClassName = trendChipClassNames.suffix({
    className
  });
  return /*#__PURE__*/_jsx(Chip.Label, {
    ref: ref,
    className: suffixClassName,
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

TrendChipRoot.displayName = DISPLAY_NAME.ROOT;
TrendChipIndicator.displayName = DISPLAY_NAME.INDICATOR;
TrendChipValue.displayName = DISPLAY_NAME.VALUE;
TrendChipPrefix.displayName = DISPLAY_NAME.PREFIX;
TrendChipSuffix.displayName = DISPLAY_NAME.SUFFIX;

// --------------------------------------------------

/**
 * Compound `TrendChip` component with sub-components.
 *
 * @component TrendChip - Semantic trend indicator pill built on top of
 * `heroui-native`'s `Chip`. The `trend` prop drives both the default arrow
 * direction and the underlying chip color (`up` -> success, `neutral` ->
 * warning, `down` -> danger). When plain text/number children are provided,
 * they are automatically wrapped in the default indicator + value layout.
 *
 * @component TrendChip.Indicator - Renders the default trend arrow. Pass a
 * custom SVG child to replace the arrow while inheriting sizing and color
 * from the chip context.
 *
 * @component TrendChip.Value - Numeric content of the chip, rendered with
 * tabular figures so values align vertically across chips.
 *
 * @component TrendChip.Prefix - Optional inline text placed before the
 * numeric value (e.g. `$`, `+`).
 *
 * @component TrendChip.Suffix - Optional inline text placed after the numeric
 * value (e.g. `%`, `vs last month`). Rendered with a muted color by default.
 *
 * Props flow from `TrendChip` to its sub-components via context
 * (`size`, `trend`, `variant`).
 *
 */
const TrendChip = Object.assign(TrendChipRoot, {
  /** Default trend arrow — accepts a custom SVG child to override. */
  Indicator: TrendChipIndicator,
  /** Numeric value rendered with tabular figures. */
  Value: TrendChipValue,
  /** Inline text rendered before the numeric value. */
  Prefix: TrendChipPrefix,
  /** Inline text rendered after the numeric value. */
  Suffix: TrendChipSuffix
});
export default TrendChip;
export { useTrendChip };