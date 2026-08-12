"use strict";

import { AnimationSettingsProvider } from 'heroui-native/contexts';
import { forwardRef, useMemo } from 'react';
import { View } from 'react-native';
import { HeroText } from "../../helpers/internal/components/index.js";
import { childrenToString, createContext } from "../../helpers/internal/utils/index.js";
import { useBadgeRootAnimation } from "./badge.animation.js";
import { DEFAULT_COLOR, DEFAULT_PLACEMENT, DEFAULT_SIZE, DEFAULT_VARIANT, DISPLAY_NAME } from "./badge.constants.js";
import { badgeClassNames, badgeStyleSheet } from "./badge.styles.js";
import { jsx as _jsx } from "react/jsx-runtime";
// --------------------------------------------------

const [BadgeProvider, useBadge] = createContext({
  name: 'BadgeContext'
});

// --------------------------------------------------

const BadgeAnchor = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    ...restProps
  } = props;
  return /*#__PURE__*/_jsx(View, {
    ref: ref,
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

const BadgeRoot = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    color = DEFAULT_COLOR,
    variant = DEFAULT_VARIANT,
    size = DEFAULT_SIZE,
    placement = DEFAULT_PLACEMENT,
    className,
    style,
    animation,
    ...restProps
  } = props;
  const isDot = children == null;
  const rootClassName = badgeClassNames.root({
    size,
    color,
    variant,
    placement,
    isDot,
    className
  });
  const {
    isAllAnimationsDisabled
  } = useBadgeRootAnimation({
    animation
  });
  const animationSettingsContextValue = useMemo(() => ({
    isAllAnimationsDisabled
  }), [isAllAnimationsDisabled]);
  const contextValue = useMemo(() => ({
    size,
    color,
    variant,
    isDot
  }), [size, color, variant, isDot]);
  const stringifiedChildren = childrenToString(children);
  const resolvedChildren = stringifiedChildren !== null ? /*#__PURE__*/_jsx(BadgeLabel, {
    children: stringifiedChildren
  }) : children;
  return /*#__PURE__*/_jsx(AnimationSettingsProvider, {
    value: animationSettingsContextValue,
    children: /*#__PURE__*/_jsx(BadgeProvider, {
      value: contextValue,
      children: /*#__PURE__*/_jsx(View, {
        ref: ref,
        className: rootClassName,
        style: [badgeStyleSheet.root, style],
        accessibilityRole: "text",
        ...restProps,
        children: resolvedChildren
      })
    })
  });
});

// --------------------------------------------------

const BadgeLabel = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const ctx = useBadge();
  const labelClassName = badgeClassNames.label({
    size: ctx.size,
    color: ctx.color,
    variant: ctx.variant,
    className
  });
  return /*#__PURE__*/_jsx(HeroText, {
    ref: ref,
    className: labelClassName,
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

BadgeAnchor.displayName = DISPLAY_NAME.ANCHOR;
BadgeRoot.displayName = DISPLAY_NAME.ROOT;
BadgeLabel.displayName = DISPLAY_NAME.LABEL;

/**
 * Compound Badge component with sub-components
 *
 * @component Badge - The badge indicator itself. Renders as a dot when
 * no children are provided, or as a pill with content. Supports color,
 * variant, size, and placement props. When used inside Badge.Anchor,
 * it is absolutely positioned at the specified corner.
 *
 * @component Badge.Anchor - Relative wrapper that positions the Badge
 * over another element (e.g. Avatar, Icon).
 *
 * @component Badge.Label - Text content inside the badge. Automatically
 * used when string/number children are passed to Badge.
 *
 * Props flow from Badge to sub-components via context
 * (size, color, variant, isDot).
 *
 */
const Badge = Object.assign(BadgeRoot, {
  /** Relative wrapper for positioning the badge over another element */
  Anchor: BadgeAnchor,
  /** Text content inside the badge */
  Label: BadgeLabel
});
export default Badge;
export { useBadge };