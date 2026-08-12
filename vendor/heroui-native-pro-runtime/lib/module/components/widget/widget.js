"use strict";

import { AnimationSettingsProvider } from 'heroui-native/contexts';
import { forwardRef, useMemo } from 'react';
import { View } from 'react-native';
import { HeroText } from "../../helpers/internal/components/index.js";
import { childrenToString } from "../../helpers/internal/utils/index.js";
import { useWidgetRootAnimation } from "./widget.animation.js";
import { DISPLAY_NAME } from "./widget.constants.js";
import { widgetClassNames, widgetStyleSheet } from "./widget.styles.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// --------------------------------------------------

const WidgetRoot = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    style,
    animation,
    ...restProps
  } = props;
  const rootClassName = widgetClassNames.root({
    className
  });
  const {
    isAllAnimationsDisabled
  } = useWidgetRootAnimation({
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
      style: [widgetStyleSheet.root, style],
      ...restProps,
      children: children
    })
  });
});

// --------------------------------------------------

const WidgetHeader = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const headerClassName = widgetClassNames.header({
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

const WidgetTitle = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const titleClassName = widgetClassNames.title({
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

const WidgetDescription = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const descriptionClassName = widgetClassNames.description({
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

const WidgetContent = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    style,
    ...restProps
  } = props;
  const contentClassName = widgetClassNames.content({
    className
  });
  return /*#__PURE__*/_jsx(View, {
    ref: ref,
    className: contentClassName,
    style: [widgetStyleSheet.content, style],
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

const WidgetFooter = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const footerClassName = widgetClassNames.footer({
    className
  });
  return /*#__PURE__*/_jsx(View, {
    ref: ref,
    className: footerClassName,
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

const WidgetLegend = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const legendClassName = widgetClassNames.legend({
    className
  });
  return /*#__PURE__*/_jsx(View, {
    ref: ref,
    className: legendClassName,
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

const WidgetLegendItem = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    color,
    colorClassName,
    className,
    classNames,
    styles,
    style,
    textProps,
    ...restProps
  } = props;
  const {
    wrapper,
    dot,
    label
  } = widgetClassNames.legendItem();
  const wrapperClassName = wrapper({
    className: [classNames?.wrapper, className]
  });
  const dotClassName = dot({
    className: [colorClassName, classNames?.dot]
  });
  const labelClassName = label({
    className: [classNames?.label, textProps?.className]
  });
  const stringifiedChildren = childrenToString(children);
  return /*#__PURE__*/_jsxs(View, {
    ref: ref,
    className: wrapperClassName,
    style: [styles?.wrapper, style],
    ...restProps,
    children: [/*#__PURE__*/_jsx(View, {
      className: dotClassName,
      style: [color !== undefined ? {
        backgroundColor: color
      } : undefined, styles?.dot]
    }), stringifiedChildren !== null ? /*#__PURE__*/_jsx(HeroText, {
      ...textProps,
      className: labelClassName,
      style: [styles?.label, textProps?.style],
      children: stringifiedChildren
    }) : children]
  });
});

// --------------------------------------------------

WidgetRoot.displayName = DISPLAY_NAME.ROOT;
WidgetHeader.displayName = DISPLAY_NAME.HEADER;
WidgetTitle.displayName = DISPLAY_NAME.TITLE;
WidgetDescription.displayName = DISPLAY_NAME.DESCRIPTION;
WidgetContent.displayName = DISPLAY_NAME.CONTENT;
WidgetFooter.displayName = DISPLAY_NAME.FOOTER;
WidgetLegend.displayName = DISPLAY_NAME.LEGEND;
WidgetLegendItem.displayName = DISPLAY_NAME.LEGEND_ITEM;

// --------------------------------------------------

/**
 * Compound `Widget` component with sub-components.
 *
 * @component Widget - Dashboard container surface (`bg-surface-secondary`,
 * `rounded-2xl`) hosting an optional header row, an elevated content card,
 * and an optional footer row. The root only renders its children — every
 * sub-component is opt-in.
 *
 * @component Widget.Header - Optional header row with `space-between`
 * justification. Typically pairs `Widget.Title` (and optional
 * `Widget.Description`) with an inline `Widget.Legend`.
 *
 * @component Widget.Title - Primary widget label (`text-foreground`,
 * `font-medium`, `text-sm`). Rendered with `accessibilityRole="header"`.
 *
 * @component Widget.Description - Secondary muted text (`text-muted`,
 * `text-xs`). Pair with `Widget.Title` for a stacked label/hint, or render
 * inside `Widget.Footer` for a summary line.
 *
 * @component Widget.Content - Elevated inner card (`bg-surface`,
 * `rounded-xl`, `shadow-surface`) hosting the widget's payload (chart,
 * table, KPI block, etc.).
 *
 * @component Widget.Footer - Optional bottom row.
 *
 * @component Widget.Legend - Inline container for one or more
 * `Widget.LegendItem`s, typically rendered inside the header next to the
 * title.
 *
 * @component Widget.LegendItem - Single colored-dot + label entry. Color
 * the dot via `colorClassName` (preferred — Tailwind class such as
 * `"bg-chart-3"`) or `color` (inline color string). Slot-aware via its own
 * `classNames` / `styles` props, with `textProps` forwarded to the inner
 * label `Text`.
 *
 * Each compound part owns its own style instance; consumers style them
 * directly via the part's `className` (and `classNames` / `styles` for
 * `LegendItem`'s slots).
 *
 */
const Widget = Object.assign(WidgetRoot, {
  /** @optional Header row container with title + legend layout. */
  Header: WidgetHeader,
  /** @optional Primary widget label. */
  Title: WidgetTitle,
  /** @optional Secondary muted text. */
  Description: WidgetDescription,
  /** @optional Elevated inner card hosting the widget payload. */
  Content: WidgetContent,
  /** @optional Bottom row container. */
  Footer: WidgetFooter,
  /** @optional Inline legend container. */
  Legend: WidgetLegend,
  /** @optional Single legend entry (dot + label). */
  LegendItem: WidgetLegendItem
});
export default Widget;