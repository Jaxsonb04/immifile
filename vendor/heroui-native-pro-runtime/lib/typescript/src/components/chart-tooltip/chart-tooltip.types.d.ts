import type { ComponentRef, ReactNode } from 'react';
import type { TextProps, ViewProps } from 'react-native';
import type { default as Reanimated, SharedValue, WithSpringConfig, WithTimingConfig } from 'react-native-reanimated';
import type { ChartBounds } from 'victory-native';
import type { Animation, AnimationRoot, ViewRef } from '../../helpers/internal/types';
/**
 * Color marker shape for {@link ChartTooltip.Item} rows.
 *
 * - `'dot'` — circular swatch (default).
 * - `'line'` — narrow vertical pill, suited to line-series tooltips.
 */
export type ChartTooltipIndicatorVariant = 'dot' | 'line';
/**
 * Vertical placement of {@link ChartTooltip} relative to the press indicator.
 *
 * - `'top'` — tooltip sits above the `(x, y)` anchor point.
 * - `'bottom'` — tooltip sits below the anchor point.
 */
export type ChartTooltipPlacement = 'top' | 'bottom';
/**
 * Controls whether {@link ChartTooltip} is shown.
 *
 * - `'auto'` — fades with press activity from {@link ChartTooltip.Anchor} (default).
 * - `true` — always visible.
 * - `false` — not rendered.
 */
export type ChartTooltipVisibility = 'auto' | boolean;
/**
 * Root-level animation config for {@link ChartTooltip.Anchor}.
 *
 * The anchor owns no animated styles of its own; this prop exists solely to cascade
 * `"disable-all"` down to {@link ChartTooltip} (and any animated descendants) via
 * `AnimationSettingsProvider`.
 */
export type ChartTooltipAnchorRootAnimation = AnimationRoot;
/**
 * Reanimated motion config for {@link ChartTooltip} position tracking.
 *
 * Discriminated on `type`:
 * - `type: 'spring'` exposes `WithSpringConfig` fields (`damping`, `stiffness`, `mass`, ...)
 *   for physically-based motion. **Default** (no config required).
 * - `type: 'timing'` exposes `WithTimingConfig` fields (`duration`, `easing`, ...) for a
 *   deterministic, duration-based slide.
 */
export type ChartTooltipRootAnimationConfig = ({
    type: 'spring';
} & WithSpringConfig) | ({
    type: 'timing';
} & WithTimingConfig);
/**
 * Animation prop for {@link ChartTooltip}.
 *
 * Wrapped by the generic `Animation<>` helper so callers can also pass:
 * - `true` / `undefined` — default spring motion
 * - `false` / `"disabled"` — skip motion; snap instantly to position
 * - `{ state: 'disabled', ... }` — disable motion while still customizing fields
 *
 * @example
 * ```tsx
 * <ChartTooltip animation={{ type: 'timing', duration: 200 }} />
 * <ChartTooltip animation={{ type: 'spring', damping: 18, stiffness: 160 }} />
 * ```
 */
export type ChartTooltipRootAnimation = Animation<ChartTooltipRootAnimationConfig>;
/**
 * Context supplied by {@link ChartTooltip.Anchor} to {@link ChartTooltip}.
 */
export interface ChartTooltipAnchorContextValue {
    /**
     * JS-bridged active datum index from `matchedIndex` when press is active; `null` otherwise.
     */
    activeIndex: number | null;
    /**
     * Skia plot bounds from `onChartBoundsChange`, used to clamp the floating tooltip inside
     * the chart box.
     */
    chartBounds?: ChartBounds | null;
    /**
     * Press activity shared value from `useChartPressState` (`state.isActive`).
     */
    isActive?: SharedValue<boolean>;
    /**
     * Horizontal press position in chart space (`state.x.position`).
     */
    x?: SharedValue<number>;
    /**
     * Vertical press position in chart space (`state.y[yKey].position`).
     */
    y?: SharedValue<number>;
}
/**
 * Pixel offsets applied on top of {@link ChartTooltip} auto-positioning.
 *
 * Values follow a CSS-like convention:
 * - `top` / `bottom` adjust vertical placement.
 * - `left` / `right` adjust horizontal placement.
 */
export interface ChartTooltipOffset {
    /**
     * Vertical inset (positive pushes down).
     *
     * @default 0
     */
    top?: number;
    /**
     * Vertical inset subtracted from placement math.
     *
     * @default 0
     */
    bottom?: number;
    /**
     * Horizontal inset (positive pushes right).
     *
     * @default 0
     */
    left?: number;
    /**
     * Horizontal inset subtracted from placement math.
     *
     * @default 0
     */
    right?: number;
}
/**
 * Props for {@link ChartTooltip.Anchor}.
 *
 * Renders a wrapper around the chart and sibling {@link ChartTooltip}. Provides press
 * coordinates, active index, and plot bounds via context.
 */
export interface ChartTooltipAnchorProps extends ViewProps {
    /**
     * Chart component plus {@link ChartTooltip} sibling(s).
     */
    children: ReactNode;
    /**
     * Root-level animation control. Pass `"disable-all"` to cascade-disable animations on
     * {@link ChartTooltip} and animated descendants.
     */
    animation?: ChartTooltipAnchorRootAnimation;
    /**
     * Latest plot bounds from the chart's `onChartBoundsChange`.
     */
    chartBounds?: ChartBounds | null;
    /**
     * Press activity shared value (`state.isActive`).
     */
    isActive?: SharedValue<boolean>;
    /**
     * Matched datum index shared value (`state.matchedIndex`). Bridged to JS as
     * {@link ChartTooltipAnchorContextValue.activeIndex} for tooltip row content.
     */
    matchedIndex?: SharedValue<number>;
    /**
     * Horizontal press position (`state.x.position`).
     */
    x?: SharedValue<number>;
    /**
     * Vertical press position for the tracked series (`state.y[yKey].position`).
     */
    y?: SharedValue<number>;
}
/**
 * Props for the {@link ChartTooltip} root.
 *
 * Must be rendered inside {@link ChartTooltip.Anchor}. Positions and clamps the tooltip
 * card near the press indicator in 2D chart space.
 */
export interface ChartTooltipRootProps extends Omit<ViewProps, 'children'> {
    /**
     * Card content: {@link ChartTooltip.Header} and {@link ChartTooltip.Item} rows.
     */
    children: ReactNode;
    /**
     * Motion animation used while the card tracks the press indicator. Defaults to spring.
     */
    animation?: ChartTooltipRootAnimation;
    /**
     * Controls tooltip visibility. `'auto'` fades with press activity from the anchor;
     * `true` keeps the card visible; `false` unmounts it.
     *
     * @default {@link DEFAULT_IS_VISIBLE}
     */
    isVisible?: ChartTooltipVisibility;
    /**
     * Gap in logical pixels between the indicator and the tooltip edge.
     *
     * @default {@link DEFAULT_TOOLTIP_GAP}
     */
    gap?: number;
    /**
     * Whether the tooltip sits above or below the `(x, y)` anchor.
     *
     * @default {@link DEFAULT_PLACEMENT}
     */
    placement?: ChartTooltipPlacement;
    /**
     * Additional pixel offsets on top of auto-positioning.
     */
    offset?: ChartTooltipOffset;
    /**
     * Additional classes merged onto the animated card container.
     */
    className?: string;
}
/**
 * Props for {@link ChartTooltip.Header} — optional title row (e.g. X-axis label).
 */
export interface ChartTooltipHeaderProps extends TextProps {
    children: ReactNode;
    /**
     * Additional classes merged onto the header.
     */
    className?: string;
}
/**
 * Props for {@link ChartTooltip.Item} — one series entry row.
 */
export interface ChartTooltipItemProps extends ViewProps {
    children: ReactNode;
    /**
     * Additional classes merged onto the item row.
     */
    className?: string;
}
/**
 * Props for {@link ChartTooltip.Indicator} — color marker beside a series name.
 */
export interface ChartTooltipIndicatorProps extends ViewProps {
    /**
     * Fill color for the indicator swatch. Accepts any CSS / Skia color string.
     */
    color?: string;
    /**
     * Swatch shape.
     *
     * @default {@link DEFAULT_INDICATOR_VARIANT}
     */
    variant?: ChartTooltipIndicatorVariant;
    /**
     * Additional classes merged onto the indicator.
     */
    className?: string;
}
/**
 * Props for {@link ChartTooltip.Label} — series name within an item row.
 */
export interface ChartTooltipLabelProps extends TextProps {
    children: ReactNode;
    /**
     * Additional classes merged onto the label.
     */
    className?: string;
}
/**
 * Props for {@link ChartTooltip.Value} — formatted data value within an item row.
 */
export interface ChartTooltipValueProps extends TextProps {
    children: ReactNode;
    /**
     * Additional classes merged onto the value.
     */
    className?: string;
}
/**
 * Ref to {@link ChartTooltip.Anchor}'s outer `View`.
 */
export type ChartTooltipAnchorRef = ViewRef;
/**
 * Ref to the {@link ChartTooltip} animated card root.
 */
export type ChartTooltipRootRef = ComponentRef<typeof Reanimated.View>;
/**
 * Ref to {@link ChartTooltip.Header} / {@link ChartTooltip.Label} / {@link ChartTooltip.Value}.
 */
export type ChartTooltipTextRef = ComponentRef<typeof import('react-native').Text>;
/**
 * Ref to {@link ChartTooltip.Item} / {@link ChartTooltip.Indicator}.
 */
export type ChartTooltipViewRef = ViewRef;
//# sourceMappingURL=chart-tooltip.types.d.ts.map