import { View } from 'react-native';
import type { WidgetContentProps, WidgetDescriptionProps, WidgetFooterProps, WidgetHeaderProps, WidgetLegendItemProps, WidgetLegendProps, WidgetRootProps, WidgetTitleProps } from './widget.types';
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
declare const Widget: import("react").ForwardRefExoticComponent<WidgetRootProps & import("react").RefAttributes<View>> & {
    /** @optional Header row container with title + legend layout. */
    Header: import("react").ForwardRefExoticComponent<WidgetHeaderProps & import("react").RefAttributes<View>>;
    /** @optional Primary widget label. */
    Title: import("react").ForwardRefExoticComponent<WidgetTitleProps & import("react").RefAttributes<import("react-native").Text>>;
    /** @optional Secondary muted text. */
    Description: import("react").ForwardRefExoticComponent<WidgetDescriptionProps & import("react").RefAttributes<import("react-native").Text>>;
    /** @optional Elevated inner card hosting the widget payload. */
    Content: import("react").ForwardRefExoticComponent<WidgetContentProps & import("react").RefAttributes<View>>;
    /** @optional Bottom row container. */
    Footer: import("react").ForwardRefExoticComponent<WidgetFooterProps & import("react").RefAttributes<View>>;
    /** @optional Inline legend container. */
    Legend: import("react").ForwardRefExoticComponent<WidgetLegendProps & import("react").RefAttributes<View>>;
    /** @optional Single legend entry (dot + label). */
    LegendItem: import("react").ForwardRefExoticComponent<WidgetLegendItemProps & import("react").RefAttributes<View>>;
};
export default Widget;
//# sourceMappingURL=widget.d.ts.map