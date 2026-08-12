import type { Path } from '@shopify/react-native-skia';
import type { ComponentProps, ComponentRef, ReactNode } from 'react';
import type { TextInput, TextInputProps, TextStyle, ViewProps, ViewStyle } from 'react-native';
import type { AnimatedProps, default as Reanimated, SharedValue } from 'react-native-reanimated';
import type { ChartBounds } from 'victory-native';
import type { ElementSlots, ViewRef } from '../../helpers/internal/types';
import type { ValueSlots } from './chart-crosshair.styles';
/**
 * Visual style for {@link ChartCrosshair}.
 *
 * - `'solid'` — no `DashPathEffect` is attached; the rule renders as an unbroken stroke.
 * - `'dashed'` — the component attaches a themed `DashPathEffect` for the classic web-style
 *   dashed crosshair. Override the dash pattern by nesting your own
 *   `<DashPathEffect intervals={[...]} />` as a child.
 */
export type ChartCrosshairVariant = 'solid' | 'dashed';
/**
 * Props for {@link ChartCrosshair} — a vertical rule that tracks the pressed x-coordinate.
 *
 * Paired with victory-native's `useChartPressState` on any cartesian chart: pass
 * `state.x.position` as `x`, and `chartBounds.top` / `chartBounds.bottom` as the vertical extent.
 * The `isActive` visibility gate stays with the caller.
 *
 * Extends the Skia `Path` component's props. `path` / `style` / `start` / `end` are excluded — the
 * component owns the geometry (vertical segment from `(x, top)` to `(x, bottom)`), forces
 * `style="stroke"`, and leaves `start`/`end` at their defaults.
 *
 * When `variant="dashed"` the component attaches a themed `DashPathEffect` with
 * {@link DEFAULT_CROSSHAIR_DASH_INTERVALS}.
 *
 * @example
 * ```tsx
 * const { state, isActive } = useChartPressState({ x: 0, y: { value: 0 } });
 *
 * <AreaChart data={DATA} xKey="day" yKeys={["value"]} chartPressState={state}>
 *   {({ points, chartBounds }) => (
 *     <>
 *       <AreaChart.Area points={points.value} y0={chartBounds.bottom} />
 *       {isActive ? (
 *         <ChartCrosshair
 *           variant="dashed"
 *           x={state.x.position}
 *           top={chartBounds.top}
 *           bottom={chartBounds.bottom}
 *         />
 *       ) : null}
 *     </>
 *   )}
 * </AreaChart>
 * ```
 */
export type ChartCrosshairProps = Omit<ComponentProps<typeof Path>, 'path' | 'style' | 'start' | 'end'> & {
    /**
     * Horizontal position of the crosshair rule, typically `state.x.position` from
     * `useChartPressState`.
     */
    x: SharedValue<number>;
    /**
     * Top y-coordinate (Skia canvas pixels) where the vertical rule starts. Typically
     * `chartBounds.top`.
     */
    top: number;
    /**
     * Bottom y-coordinate (Skia canvas pixels) where the vertical rule ends. Typically
     * `chartBounds.bottom`.
     */
    bottom: number;
    /**
     * Visual style of the rule. `"solid"` renders an unbroken stroke; `"dashed"` attaches a themed
     * `DashPathEffect` with {@link DEFAULT_CROSSHAIR_DASH_INTERVALS}.
     *
     * @default 'dashed'
     */
    variant?: ChartCrosshairVariant;
};
/**
 * Vertical placement of {@link ChartCrosshair.Value} relative to {@link ChartCrosshair.Anchor}.
 *
 * - `'top'` — overlay sits above the anchor (animated `bottom: -measuredHeight` anchors the pill upward).
 * - `'bottom'` — overlay sits below the chart (`top: 100%` of the anchor; same coordinate space as Uniwind wrappers).
 */
export type ChartCrosshairValuePlacement = 'top' | 'bottom';
/**
 * Visual variants for {@link ChartCrosshair.Value} (pill surface).
 */
export type ChartCrosshairValueVariant = 'default' | 'ghost';
/**
 * Context supplied by {@link ChartCrosshair.Value}; only the animated label string is shared. Read via
 * {@link useChartCrosshairValue}.
 */
export interface ChartCrosshairValueContextValue {
    /**
     * Shared label string from the root `value` prop (UI thread) for {@link ChartCrosshair.ValueLabel} /
     * internal `ReText`.
     */
    value?: SharedValue<string>;
}
/**
 * Crosshair data exposed by {@link ChartCrosshair.Anchor} to descendant {@link ChartCrosshair.Value}.
 * All optional fields can be omitted; {@link ChartCrosshair.Value} applies defaults (`x` treated as `0`
 * when absent, missing `isActive` → visible, missing `chartBounds` → no horizontal clamping).
 */
export interface ChartCrosshairAnchorContextValue {
    /**
     * Latest Skia plot bounds from the chart, when available (typically mirrored from
     * `onChartBoundsChange`).
     *
     * @note When present, {@link ChartCrosshair.Value} clamps its animated `translateX` so the overlay’s
     * horizontal extent stays within `[left, right]`, reducing edge clipping. Ensure this matches the
     * same coordinate system as `x` (victory-native press / crosshair position).
     */
    chartBounds?: ChartBounds | null;
    /**
     * When set, overlay opacity tracks press activity; when omitted, the overlay stays visible.
     */
    isActive?: SharedValue<boolean>;
    /**
     * Horizontal crosshair position in chart space (same as `state.x.position` from
     * `useChartPressState`).
     */
    x?: SharedValue<number>;
}
/**
 * Inline styles for {@link ChartCrosshair.Value} slots.
 *
 * `container` maps to the animated overlay `Animated.View`; `label` maps to the underlying
 * read-only `TextInput` used by {@link ChartCrosshair.ValueLabel}.
 */
export interface ChartCrosshairValueStyles {
    /**
     * Style for the animated overlay `Animated.View` (the `container` slot).
     */
    container?: ViewStyle;
    /**
     * Style for the read-only animated `TextInput` label surface.
     */
    label?: TextStyle;
}
/**
 * Pixel offsets applied to the animated overlay positioning of {@link ChartCrosshair.Value}.
 *
 * Values are added on top of the auto-centering math inside the root's `useAnimatedStyle`,
 * following a CSS-like convention:
 * - `top` pushes the overlay **down**, `bottom` pushes it **up**. With `placement="top"` these adjust
 *   animated `bottom` (`-measuredHeight` baseline); with `placement="bottom"` they adjust vertical
 *   `translateY` under `top: 100%`.
 * - `left` pushes the overlay **right**, `right` pushes it **left** (both adjust `translateX`).
 *
 * All fields are optional and default to `0`. Use this prop instead of overriding `top` or
 * `transform` via `className`/`styles`, since those properties are owned by the animated style.
 */
export interface ChartCrosshairValueOffset {
    /**
     * Vertical inset term (positive increases `offset.top - offset.bottom`). Affects animated `bottom` when
     * `placement="top"`, else `translateY` when `placement="bottom"`.
     *
     * @default 0
     */
    top?: number;
    /**
     * Vertical inset term (subtracted in `offset.top - offset.bottom` alongside the `top` field).
     *
     * @default 0
     */
    bottom?: number;
    /**
     * Horizontal pixel offset added to the animated `translateX`. Positive values push right.
     *
     * @default 0
     */
    left?: number;
    /**
     * Horizontal pixel offset subtracted from the animated `translateX`. Positive values push left.
     *
     * @default 0
     */
    right?: number;
}
/**
 * Props for {@link ChartCrosshair.Anchor}.
 *
 * Renders a relatively positioned wrapper around the chart **and** the sibling RN value overlay.
 * Provides {@link ChartCrosshairAnchorContextValue} to descendants. {@link ChartCrosshair.Value}
 * **must** appear under this provider.
 */
export interface ChartCrosshairAnchorProps extends ViewProps {
    /**
     * Child layout: normally the chart component plus a {@link ChartCrosshair.Value} sibling.
     */
    children: ReactNode;
    /**
     * Optional plot bounds mirrored from the chart’s `onChartBoundsChange`.
     */
    chartBounds?: ChartBounds | null;
    /**
     * Optional press activity shared value (same contract as chart overlays).
     */
    isActive?: SharedValue<boolean>;
    /**
     * Optional horizontal press / crosshair position (`state.x.position`).
     */
    x?: SharedValue<number>;
}
/**
 * Props for {@link ChartCrosshair.Value}.
 *
 * Must be rendered inside {@link ChartCrosshair.Anchor}. Renders an absolutely positioned,
 * non-interactive overlay. The root passes `value` into {@link ChartCrosshairValueContextValue} and
 * renders the label surface once; {@link ChartCrosshair.ValueLabel} reads the string only from that
 * context.
 *
 * Compose extra static content (e.g. icons) via `children` (rendered after the label).
 */
export interface ChartCrosshairValueProps extends Omit<ViewProps, 'children'> {
    /**
     * Shared string for the press label (also exposed as {@link ChartCrosshairValueContextValue.value}).
     */
    value?: SharedValue<string>;
    /**
     * Visual variant for the pill container.
     *
     * @default 'default'
     */
    variant?: ChartCrosshairValueVariant;
    /**
     * Whether the tooltip pill sits above the anchor (`top`) or below it (`bottom`, after the chart).
     *
     * @default 'top'
     */
    placement?: ChartCrosshairValuePlacement;
    /**
     * Additional classes merged onto the `container` slot (outer `Animated.View`).
     */
    className?: string;
    /**
     * Additional classes per {@link ChartCrosshair.Value} slot (`container`, `label`).
     */
    classNames?: ElementSlots<ValueSlots>;
    /**
     * Inline styles per root slot.
     */
    styles?: ChartCrosshairValueStyles;
    /**
     * Pixel offsets applied on top of the overlay's auto-centering inside the root's
     * `useAnimatedStyle`. `top` / `bottom` adjust vertical placement (see {@link ChartCrosshairValueOffset});
     * `left` / `right` adjust the animated `translateX`.
     *
     * @note The animated style owns `bottom` (when `placement` is `'top'`) or `top` (when `'bottom'`),
     * `transform.translateX`, and (when `placement` is `'bottom'`) `transform.translateY`, so those cannot
     * be set via `className` or `styles.container`.
     * Use `offset` to nudge them.
     */
    offset?: ChartCrosshairValueOffset;
    /**
     * Optional children rendered after the auto or explicit label in a horizontal row (e.g. icons).
     */
    children?: ReactNode;
}
/**
 * Props for {@link ChartCrosshair.ValueLabel}. The animated string is **never** a prop — use
 * `const { value } = useChartCrosshairValue()` (set on {@link ChartCrosshair.Value}). Extra props forward
 * to `ReText` / `TextInput`.
 */
export interface ChartCrosshairValueLabelProps extends Omit<TextInputProps, 'children' | 'defaultValue' | 'style' | 'value'> {
    /**
     * Additional classes merged with the default label typography.
     */
    className?: string;
    /**
     * Animated style for the `TextInput` / `ReText` surface.
     */
    style?: AnimatedProps<TextInputProps>['style'];
}
/**
 * Ref to {@link ChartCrosshair.Value} root `Animated.View` overlay host.
 */
export type ChartCrosshairValueRef = ComponentRef<typeof Reanimated.View>;
/**
 * Ref to {@link ChartCrosshair.Anchor}’s outer `View`.
 */
export type ChartCrosshairAnchorRef = ViewRef;
/**
 * Ref to the underlying read-only `TextInput` rendered by {@link ChartCrosshair.ValueLabel} / `ReText`.
 */
export type ChartCrosshairValueLabelRef = ComponentRef<typeof TextInput>;
//# sourceMappingURL=chart-crosshair.types.d.ts.map