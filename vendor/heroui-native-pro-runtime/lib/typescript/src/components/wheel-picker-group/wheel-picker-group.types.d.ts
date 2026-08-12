import type { ReactNode } from 'react';
import type { ViewProps, ViewStyle } from 'react-native';
import type { AnimationRootDisableAll, ElementSlots, ViewRef } from '../../helpers/internal/types';
import type { WheelPickerGroupIndicatorSlots, WheelPickerGroupMaskSlots } from './wheel-picker-group.styles';
/**
 * Shared values record exchanged with the group. Each child `WheelPicker`
 * is identified by its `name` prop, and the corresponding entry carries
 * its current value. The value type is `unknown` so the group can
 * accommodate heterogeneous wheels (numbers, strings, custom enums).
 */
export type WheelPickerGroupValues = Readonly<Record<string, unknown>>;
/**
 * Animation configuration for the {@link WheelPickerGroup} root.
 *
 * The group owns no animated styles of its own — this prop only
 * cascades `disable-all` to every child `WheelPicker` (rows snap
 * without fading or scaling, and any animated descendants of a child
 * wheel are also disabled).
 */
export type WheelPickerGroupRootAnimation = AnimationRootDisableAll;
/**
 * Context value shared between {@link WheelPickerGroup} and its child
 * `WheelPicker` instances. Children read their value via `getValue`,
 * write back via `setValue`, and announce scroll start / stop via
 * `notifyScrollState` so the group can suppress cross-wheel programmatic
 * syncs while any wheel is mid-scroll.
 */
export interface WheelPickerGroupContextValue {
    /** Resolved row height shared across the group's wheels. */
    itemHeight: number;
    /** Number of visible rows shared across the group's wheels. */
    visibleCount: number;
    /**
     * Whether the group is disabled. A child `WheelPicker` may also be
     * disabled locally.
     */
    isDisabled: boolean;
    /** Read the current value for the wheel identified by `name`. */
    getValue: (name: string) => unknown;
    /**
     * Write the value for the wheel identified by `name`. Merges into the
     * group's values record and triggers `onValuesChange`.
     */
    setValue: (name: string, value: unknown) => void;
    /**
     * Notify the group that one of its wheels has started or stopped
     * scrolling. Used to suppress programmatic scroll-syncs across sibling
     * wheels while any wheel is mid-scroll.
     */
    notifyScrollState: (isScrolling: boolean) => void;
    /**
     * Returns `true` while at least one wheel in the group is scrolling.
     * Children consult this before honoring an external `values` update.
     */
    isAnyWheelScrolling: () => boolean;
}
/**
 * Props for the {@link WheelPickerGroup} root component.
 */
export interface WheelPickerGroupRootProps extends Omit<ViewProps, 'children'> {
    /**
     * Compound children. Typically a sequence of `<WheelPicker name="…" />`
     * instances, optionally accompanied by `<WheelPickerGroup.Indicator />`
     * and `<WheelPickerGroup.Mask />`.
     */
    children?: ReactNode;
    /**
     * Controlled values record. Keyed by each child wheel's `name`. Mirrors
     * back through `onValuesChange` on every change.
     */
    values?: WheelPickerGroupValues;
    /**
     * Uncontrolled initial values record. Keyed by each child wheel's
     * `name`.
     */
    defaultValues?: WheelPickerGroupValues;
    /**
     * Pixel height of a single row, shared by all child wheels.
     *
     * @default 44
     */
    itemHeight?: number;
    /**
     * Number of visible rows, shared by all child wheels. Must be odd.
     *
     * @default 5
     */
    visibleCount?: number;
    /**
     * Whether the entire group is disabled.
     *
     * @default false
     */
    isDisabled?: boolean;
    /**
     * Additional CSS classes for the root container.
     */
    className?: string;
    /**
     * Fires when any wheel's value changes — during scroll, on tap-to-focus,
     * and on imperative `scrollToIndex` / `scrollToValue` on a child wheel.
     * Receives the full updated values record. Not fired in response to
     * external updates of the controlled `values` prop.
     */
    onValuesChange?: (values: WheelPickerGroupValues) => void;
    /**
     * Fires exactly once after every wheel in the group has come to rest.
     */
    onValuesCommit?: (values: WheelPickerGroupValues) => void;
    /**
     * Animation configuration for the root.
     * - `"disable-all"`: disable all animations including child wheels (cascades to all child components).
     * - `undefined`: use default animations.
     */
    animation?: WheelPickerGroupRootAnimation;
}
/**
 * Ref type for the {@link WheelPickerGroup} root component.
 */
export type WheelPickerGroupRootRef = ViewRef;
/**
 * Props for the {@link WheelPickerGroup.Indicator} sub-component.
 *
 * Renders a horizontal band that spans all child wheels at the center of
 * the group viewport. Replaces the per-wheel indicator inside a group.
 */
export interface WheelPickerGroupIndicatorProps extends ViewProps {
    /**
     * Optional content rendered inside the indicator's `highlight` slot
     * (so it sits on top of the band's background fill and gets clipped
     * by its corner radius when `overflow-hidden` is set). Use this to
     * layer decorative content — patterns, gradients, icons — over the
     * selection band without rebuilding the indicator from scratch.
     */
    children?: ReactNode;
    /**
     * Additional CSS classes for the indicator container.
     */
    className?: string;
    /**
     * Additional CSS classes for the indicator slots.
     */
    classNames?: ElementSlots<WheelPickerGroupIndicatorSlots>;
    /**
     * Styles for the indicator slots.
     */
    styles?: Partial<Record<WheelPickerGroupIndicatorSlots, ViewStyle>>;
}
/**
 * Ref type for the {@link WheelPickerGroup.Indicator} sub-component.
 */
export type WheelPickerGroupIndicatorRef = ViewRef;
/**
 * Props for the {@link WheelPickerGroup.Mask} sub-component.
 *
 * Renders top and bottom fade overlays that span the full group viewport,
 * softening the wheels into the surrounding background.
 */
export interface WheelPickerGroupMaskProps extends Omit<ViewProps, 'children'> {
    /**
     * Solid color the gradient fades from. Used at the outer edge of each
     * mask half; the inner edge fades to the same color with alpha 0 so
     * the interpolation stays in one hue.
     *
     * Accepts any RN color string (hex, rgb, rgba, named, etc.). When
     * omitted, the current theme's `background` color is used and the
     * mask automatically follows light / dark theme switches.
     *
     * @default useThemeColor('background')
     */
    color?: string;
    /**
     * Height of each mask half. Controls how far the fade extends from
     * the group viewport edges toward the selection band.
     *
     * - `number` — raw pixels (e.g. `40`).
     * - `string` ending in `"%"` — percentage of the default fade height
     *   (`((visibleCount - 1) / 4) * itemHeight`). `"100%"` keeps the
     *   default extent; `"200%"` doubles it, `"50%"` halves it.
     *
     * @default "100%"
     */
    height?: number | string;
    /**
     * Additional CSS classes applied to both mask halves.
     */
    className?: string;
    /**
     * Additional CSS classes for the mask slots.
     */
    classNames?: ElementSlots<WheelPickerGroupMaskSlots>;
    /**
     * Styles for the mask slots.
     */
    styles?: Partial<Record<WheelPickerGroupMaskSlots, ViewStyle>>;
}
/**
 * Ref type for the {@link WheelPickerGroup.Mask} sub-component.
 */
export type WheelPickerGroupMaskRef = ViewRef;
//# sourceMappingURL=wheel-picker-group.types.d.ts.map