"use strict";

import { AnimationSettingsProvider } from 'heroui-native/contexts';
import { forwardRef, useMemo } from 'react';
import { View } from 'react-native';
import { HeroText } from "../../helpers/internal/components/index.js";
import { useEmptyStateRootAnimation } from "./empty-state.animation.js";
import { DISPLAY_NAME } from "./empty-state.constants.js";
import { emptyStateClassNames } from "./empty-state.styles.js";
import { jsx as _jsx } from "react/jsx-runtime";
// --------------------------------------------------

const EmptyStateRoot = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    animation,
    ...restProps
  } = props;
  const rootClassName = emptyStateClassNames.root({
    className
  });
  const {
    isAllAnimationsDisabled
  } = useEmptyStateRootAnimation({
    animation
  });
  const animationSettingsContextValue = useMemo(() => ({
    isAllAnimationsDisabled
  }), [isAllAnimationsDisabled]);
  return /*#__PURE__*/_jsx(AnimationSettingsProvider, {
    value: animationSettingsContextValue,
    children: /*#__PURE__*/_jsx(View, {
      ref: ref,
      className: rootClassName,
      ...restProps,
      children: children
    })
  });
});

// --------------------------------------------------

const EmptyStateHeader = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const headerClassName = emptyStateClassNames.header({
    className
  });
  return /*#__PURE__*/_jsx(View, {
    ref: ref,
    className: headerClassName,
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

const EmptyStateMedia = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    variant = 'default',
    className,
    ...restProps
  } = props;
  const mediaClassName = emptyStateClassNames.media({
    variant,
    className
  });
  return /*#__PURE__*/_jsx(View, {
    ref: ref,
    className: mediaClassName,
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

const EmptyStateTitle = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const titleClassName = emptyStateClassNames.title({
    className
  });
  return /*#__PURE__*/_jsx(HeroText, {
    ref: ref,
    className: titleClassName,
    accessibilityRole: "header",
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

const EmptyStateDescription = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const descriptionClassName = emptyStateClassNames.description({
    className
  });
  return /*#__PURE__*/_jsx(HeroText, {
    ref: ref,
    className: descriptionClassName,
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

const EmptyStateContent = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const contentClassName = emptyStateClassNames.content({
    className
  });
  return /*#__PURE__*/_jsx(View, {
    ref: ref,
    className: contentClassName,
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

EmptyStateRoot.displayName = DISPLAY_NAME.ROOT;
EmptyStateHeader.displayName = DISPLAY_NAME.HEADER;
EmptyStateMedia.displayName = DISPLAY_NAME.MEDIA;
EmptyStateTitle.displayName = DISPLAY_NAME.TITLE;
EmptyStateDescription.displayName = DISPLAY_NAME.DESCRIPTION;
EmptyStateContent.displayName = DISPLAY_NAME.CONTENT;

// --------------------------------------------------

/**
 * Compound `EmptyState` component with optional media and actions.
 *
 * @component EmptyState - Root container for empty-state messaging and actions.
 * @component EmptyState.Header - Groups media, title, and description.
 * @component EmptyState.Media - Optional icon/avatar container.
 * @component EmptyState.Title - Primary heading text.
 * @component EmptyState.Description - Secondary supporting copy.
 * @component EmptyState.Content - Optional action area.
 *
 */
const EmptyState = Object.assign(EmptyStateRoot, {
  /** @optional Header grouping block. */
  Header: EmptyStateHeader,
  /** @optional Media container for icon or avatar content. */
  Media: EmptyStateMedia,
  /** @optional Primary heading text. */
  Title: EmptyStateTitle,
  /** @optional Secondary description text. */
  Description: EmptyStateDescription,
  /** @optional Action area below the header. */
  Content: EmptyStateContent
});
export default EmptyState;