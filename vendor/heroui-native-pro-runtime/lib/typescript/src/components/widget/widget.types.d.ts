import type { ReactNode } from 'react';
import type { TextProps, TextStyle, ViewProps, ViewStyle } from 'react-native';
import type { AnimationRootDisableAll, ElementSlots, TextRef, ViewRef } from '../../helpers/internal/types';
import type { LegendItemSlots } from './widget.styles';
/**
 * Animation configuration for the {@link Widget} root component.
 *
 * `Widget` owns no animated styles of its own; the root prop only exists
 * so consumers can cascade `disable-all` to animated descendants placed
 * inside the widget (charts, progress indicators, etc.).
 *
 * - `"disable-all"`: disable all animations including children (cascades
 *   to all descendants via `AnimationSettingsProvider`).
 * - `undefined`: use default animations.
 */
export type WidgetRootAnimation = AnimationRootDisableAll;
/**
 * Per-slot inline style overrides for {@link WidgetLegendItem}.
 *
 * Defined as an explicit object (rather than `Partial<Record<...>>`)
 * because the slots mix `View` (`wrapper`, `dot`) and `Text` (`label`),
 * each requiring its own RN style type.
 */
export interface WidgetLegendItemStyles {
    /** Outer flex row wrapper. */
    wrapper?: ViewStyle;
    /** Color indicator dot. */
    dot?: ViewStyle;
    /** Legend entry label text. */
    label?: TextStyle;
}
/**
 * Props for the {@link Widget} root component.
 *
 * Renders a dashboard container surface (`bg-surface-secondary`,
 * `rounded-2xl`) holding an optional header row, an elevated content area,
 * and an optional footer row. Sub-components are fully optional — consumers
 * compose them as needed.
 */
export interface WidgetRootProps extends ViewProps {
    /**
     * Compound parts to render inside the widget shell. Typical composition is
     * `Widget.Header` + `Widget.Content` + (optional) `Widget.Footer`.
     */
    children?: ReactNode;
    /**
     * Additional CSS classes for the outer shell.
     */
    className?: string;
    /**
     * Animation configuration for the widget root.
     * - `"disable-all"`: disable all animations including children
     *   (cascades down to all child components placed inside the widget).
     * - `undefined`: use default animations.
     */
    animation?: WidgetRootAnimation;
}
/**
 * Imperative ref type for the {@link Widget} root element.
 */
export type WidgetRootRef = ViewRef;
/**
 * Props for the {@link WidgetHeader} compound part.
 *
 * Horizontal row that typically holds a {@link WidgetTitle} and an inline
 * {@link WidgetLegend}. Uses `space-between` justification so the title
 * sits flush to the left and the legend to the right.
 */
export interface WidgetHeaderProps extends ViewProps {
    /** Header content (title, description, legend, etc.). */
    children?: ReactNode;
    /** Additional CSS classes for the header row. */
    className?: string;
}
/**
 * Imperative ref type for the {@link WidgetHeader} element.
 */
export type WidgetHeaderRef = ViewRef;
/**
 * Props for the {@link WidgetTitle} compound part.
 *
 * Primary label for the widget. Rendered with `font-medium` and the
 * standard `text-foreground` token.
 */
export interface WidgetTitleProps extends TextProps {
    /** Title text content. */
    children?: ReactNode;
    /** Additional CSS classes for the title text. */
    className?: string;
}
/**
 * Imperative ref type for the {@link WidgetTitle} element.
 */
export type WidgetTitleRef = TextRef;
/**
 * Props for the {@link WidgetDescription} compound part.
 *
 * Secondary text intended to sit underneath the title or inline as a hint.
 * Rendered with `text-muted` and a smaller font size.
 */
export interface WidgetDescriptionProps extends TextProps {
    /** Description text content. */
    children?: ReactNode;
    /** Additional CSS classes for the description text. */
    className?: string;
}
/**
 * Imperative ref type for the {@link WidgetDescription} element.
 */
export type WidgetDescriptionRef = TextRef;
/**
 * Props for the {@link WidgetContent} compound part.
 *
 * Elevated inner card (`bg-surface`, `rounded-xl`, `shadow-surface`) hosting
 * the widget's payload (chart, table, KPI block, etc.). The visual inset
 * around the card is provided by the root's padding, so the card stays
 * centered inside the shell regardless of header/footer presence.
 */
export interface WidgetContentProps extends ViewProps {
    /** Content rendered inside the elevated card (chart, table, etc.). */
    children?: ReactNode;
    /** Additional CSS classes for the content card. */
    className?: string;
}
/**
 * Imperative ref type for the {@link WidgetContent} element.
 */
export type WidgetContentRef = ViewRef;
/**
 * Props for the {@link WidgetFooter} compound part.
 *
 * Optional bottom row, typically used for action chips, "view more" links,
 * or muted summary text.
 */
export interface WidgetFooterProps extends ViewProps {
    /** Footer content. */
    children?: ReactNode;
    /** Additional CSS classes for the footer row. */
    className?: string;
}
/**
 * Imperative ref type for the {@link WidgetFooter} element.
 */
export type WidgetFooterRef = ViewRef;
/**
 * Props for the {@link WidgetLegend} compound part.
 *
 * Inline container for one or more {@link WidgetLegendItem}s. Typically
 * placed inside the header next to the title.
 */
export interface WidgetLegendProps extends ViewProps {
    /** Legend entries. */
    children?: ReactNode;
    /** Additional CSS classes for the legend wrapper. */
    className?: string;
}
/**
 * Imperative ref type for the {@link WidgetLegend} element.
 */
export type WidgetLegendRef = ViewRef;
/**
 * Props for the {@link WidgetLegendItem} compound part.
 *
 * A single legend entry made of a colored dot followed by a muted label.
 * Either `color` (inline color string) or `colorClassName` (Tailwind
 * background class such as `"bg-chart-3"`) drives the dot — prefer
 * `colorClassName` so theme values resolve through the standard token
 * system instead of imperatively via `useThemeColorPro`.
 *
 * `LegendItem` renders three internal elements (`wrapper > dot + label`),
 * so it owns the slotted style instance and exposes per-slot `classNames`
 * and `styles` overrides scoped to its own slot keys.
 */
export interface WidgetLegendItemProps extends ViewProps {
    /**
     * Label text rendered to the right of the dot. Plain string/number
     * children are wrapped in a `Text` automatically; ReactNodes are
     * rendered as-is.
     */
    children?: ReactNode;
    /**
     * Color applied to the indicator dot via inline `backgroundColor`. Pass
     * any platform-valid color string (hex, `rgb(...)`, or theme value
     * resolved with `useThemeColorPro` / `useThemeColor`).
     *
     * @note If both `color` and `colorClassName` are provided, `color` wins
     * because inline styles override `className` in React Native.
     */
    color?: string;
    /**
     * Tailwind background class applied to the indicator dot
     * (e.g. `"bg-chart-3"`, `"bg-success"`). Prefer this over `color` for
     * theme-aware colors so values resolve via the standard token system.
     */
    colorClassName?: string;
    /** Additional CSS classes for the wrapper slot. */
    className?: string;
    /**
     * Additional CSS classes for individual slots of the legend item.
     */
    classNames?: ElementSlots<LegendItemSlots>;
    /**
     * Inline style overrides for individual slots of the legend item.
     */
    styles?: WidgetLegendItemStyles;
    /**
     * Additional props forwarded to the inner label `Text` element. Use to
     * set `numberOfLines`, `accessibilityLabel`, `selectable`, etc. on the
     * legend label without having to wrap children in a custom `Text`.
     */
    textProps?: TextProps;
}
/**
 * Imperative ref type for the {@link WidgetLegendItem} element.
 */
export type WidgetLegendItemRef = ViewRef;
//# sourceMappingURL=widget.types.d.ts.map