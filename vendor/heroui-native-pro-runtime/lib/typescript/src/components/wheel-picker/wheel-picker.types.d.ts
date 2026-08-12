import type { ReactNode, RefObject } from 'react';
import type { PressableProps, TextProps, TextStyle, ViewProps, ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import type { ClassValue } from 'tailwind-variants';
import type { AnimationRoot, AnimationValue, ElementSlots, PressableRef, TextRef, ViewRef } from '../../helpers/internal/types';
import type { WheelPickerIndicatorSlots, WheelPickerMaskSlots, WheelPickerRootSlots } from './wheel-picker.styles';
/**
 * Single picker entry rendered as a row in the wheel. `value` drives
 * `value` / `onValueChange` comparisons and `scrollToValue` lookups;
 * `label` is the text shown by the default item renderer.
 *
 * @template T - The value type stored on each option.
 */
export interface WheelPickerOption<T = unknown> {
    /**
     * The unique value associated with the option. Used for `value` /
     * `onValueChange` comparison and `scrollToValue` lookup.
     */
    value: T;
    /**
     * Display label rendered by the default item renderer.
     */
    label: string;
}
/**
 * Information passed to a custom `renderItem` function on the wheel root.
 *
 * @template T - The value type stored on each option.
 */
export interface WheelPickerRenderItemInfo<T = unknown> {
    /** The option being rendered. */
    item: WheelPickerOption<T>;
    /** Zero-based index of the option in the `items` array. */
    index: number;
    /** Whether the option matches the current value (i.e. sits on the center band). */
    isSelected: boolean;
    /** Shared scroll offset (UI thread) used to drive per-item animations. */
    scrollY: SharedValue<number>;
    /** Resolved row height used by the layout and animation math. */
    itemHeight: number;
    /**
     * Per-row absolute distance from the wheel's center, expressed in row
     * units (`0` = centered, `0.5` = at the selection boundary, `1+` = one
     * or more full rows away). Drive your own `interpolate` /
     * `interpolateColor` inside `useAnimatedStyle` / `useAnimatedProps` for
     * custom row animations. The same shared value is also exposed via
     * `useWheelPickerItem()` for components rendered inside the row.
     */
    absDistance: SharedValue<number>;
}
/**
 * Render function for a single wheel row.
 *
 * @template T - The value type stored on each item.
 */
export type WheelPickerRenderItem<T = unknown> = (info: WheelPickerRenderItemInfo<T>) => ReactNode;
/**
 * Animation configuration for the {@link WheelPicker} root.
 *
 * Controls the per-item opacity / scale interpolation against the scroll
 * offset. Set `animation="disable-all"` to cascade animation disabling to
 * the whole picker (items snap without fading or scaling).
 */
export type WheelPickerRootAnimation = AnimationRoot<{
    /**
     * Opacity configuration applied to each row.
     * `value[0]` is the opacity at the farthest visible offset, `value[1]` is
     * the opacity at the center (selected) position.
     *
     * @default { value: [0.5, 1] }
     */
    opacity?: AnimationValue<{
        /**
         * `[edge, center]` opacity values.
         *
         * @default [0.5, 1]
         */
        value?: [number, number];
    }>;
    /**
     * Scale configuration applied to each row.
     * `value[0]` is the scale at the farthest visible offset, `value[1]` is
     * the scale at the center (selected) position.
     *
     * @default { value: [0.85, 1] }
     */
    scale?: AnimationValue<{
        /**
         * `[edge, center]` scale values.
         *
         * @default [0.85, 1]
         */
        value?: [number, number];
    }>;
    /**
     * Text color configuration applied to each row's label. `value[0]` is
     * the color at the farthest visible offset, `value[1]` is the color at
     * the center (selected) position. Interpolated via `interpolateColor`
     * inside the half-row selection band, so any row farther than half a
     * row from the center resolves to exactly `value[0]`.
     *
     * Accepts any RN color string (hex, rgb, rgba, named, etc.).
     *
     * @default Theme `[foreground, accent-soft-foreground]`
     */
    labelColor?: AnimationValue<{
        /**
         * `[edge, center]` color values.
         *
         * @default Theme `[foreground, accent-soft-foreground]`
         */
        value?: [string, string];
    }>;
}>;
/**
 * Resolved animation values consumed by the per-item animated style hook.
 * All three properties are always defined — disabled state still ships
 * defaults so the worklet branches cleanly. `labelColor` falls back to
 * the theme `[foreground, accent-soft-foreground]` pair when the user
 * did not provide one in the root `animation` prop.
 */
export interface WheelPickerResolvedAnimationConfig {
    /** `[edge, center]` opacity. */
    opacity: [number, number];
    /** `[edge, center]` scale. */
    scale: [number, number];
    /** `[edge, center]` color tuple. Defaults to theme `[foreground, accent-soft-foreground]`. */
    labelColor: [string, string];
}
/**
 * Imperative actions exposed via the root ref.
 */
export interface WheelPickerImperativeMethods {
    /**
     * Scroll the wheel so that the given index becomes the selected row.
     */
    scrollToIndex: (params: {
        /** Zero-based index to focus. */
        index: number;
        /** Whether to animate the scroll. Defaults to `true`. */
        animated?: boolean;
    }) => void;
    /**
     * Scroll the wheel so that the row matching `value` becomes the selected
     * row. No-op when the value is not in the current `items` array.
     *
     * The lookup uses `Object.is` equality on the item `value`.
     */
    scrollToValue: (value: unknown, options?: {
        /** Whether to animate the scroll. Defaults to `true`. */
        animated?: boolean;
    }) => void;
}
/**
 * Ref type for the {@link WheelPicker} root component. Combines the
 * outer-view ref with imperative scroll helpers.
 */
export type WheelPickerRootRef = ViewRef & WheelPickerImperativeMethods;
/**
 * Props for the {@link WheelPicker} root component.
 *
 * @template T - The value type stored on each item.
 */
export interface WheelPickerRootProps<T = unknown> extends Omit<ViewProps, 'children'> {
    /**
     * Compound children. When omitted, the root renders a default
     * `WheelPicker.Indicator` (skipped inside a `WheelPickerGroup`, where the
     * group renders its shared indicator). Pass `WheelPicker.Indicator`
     * and/or `WheelPicker.Mask` to customize overlays.
     */
    children?: ReactNode;
    /**
     * The set of rows to render. Each entry needs a unique `value` (used for
     * selection comparison) and a `label` (used by the default item renderer).
     */
    items: ReadonlyArray<WheelPickerOption<T>>;
    /**
     * Pixel height of a single row. Used for snapping, layout, and the
     * per-item animation math.
     *
     * @note Ignored when the wheel is nested in a `WheelPickerGroup`. The
     * wheel inherits `itemHeight` from the group so every wheel shares the
     * same row height and the group's indicator / mask stay aligned.
     *
     * @default 44
     */
    itemHeight?: number;
    /**
     * Number of rows visible inside the viewport. Must be odd so that one row
     * sits centered on the selection indicator.
     *
     * @note Ignored when the wheel is nested in a `WheelPickerGroup`. The
     * wheel inherits `visibleCount` from the group.
     *
     * @default 5
     */
    visibleCount?: number;
    /**
     * Controlled value. The row whose `item.value` matches becomes the
     * selected row. When omitted, the wheel is uncontrolled.
     */
    value?: T;
    /**
     * Initial value used when the wheel is uncontrolled.
     */
    defaultValue?: T;
    /**
     * Optional name used to identify this wheel inside a
     * `WheelPickerGroup`. When set and a group context exists, the wheel
     * reads its value from the group, writes back through it, and hides its
     * own default indicator so the group can render a shared one.
     */
    name?: string;
    /**
     * Disables interaction. The wheel still renders the current selection
     * but is non-scrollable and dimmed.
     *
     * @default false
     */
    isDisabled?: boolean;
    /**
     * Additional CSS classes for the root container.
     */
    className?: string;
    /**
     * Additional CSS classes for individual root slots.
     *
     * @note The following animated style properties cannot be set via `className`:
     * - `item.opacity` - Distance-based fade
     * - `item.transform` (scale) - Distance-based scale
     * - `itemLabel.color` - Interpolated between `animation.labelColor`'s
     *   `[edge, center]` values (defaults to theme
     *   `[foreground, accent-soft-foreground]`). `text-*` color classes
     *   here are overridden by the animated value.
     *
     * To customize, pass an `animation` object on the root. To disable
     * animated styles entirely, set `animation="disabled"` on the root.
     */
    classNames?: ElementSlots<WheelPickerRootSlots>;
    /**
     * Styles for individual root slots. Slot styles type as `ViewStyle` or
     * `TextStyle` to match the rendered element.
     */
    styles?: {
        container?: ViewStyle;
        contentContainer?: ViewStyle;
        item?: ViewStyle;
        itemLabel?: TextStyle;
    };
    /**
     * Custom row renderer. When omitted, the default renderer shows
     * `item.label` inside a `WheelPicker.ItemLabel`. The function receives a
     * {@link WheelPickerRenderItemInfo} object on every row.
     */
    renderItem?: WheelPickerRenderItem<T>;
    /**
     * Key extractor for the underlying `FlatList`. Defaults to
     * `` `${item.value}:${index}` `` when the value is a primitive
     * (`string` / `number` / `boolean`), and `String(index)` otherwise.
     */
    keyExtractor?: (item: WheelPickerOption<T>, index: number) => string;
    /**
     * Fires when the selected row changes — during a scroll (throttled on
     * fast flings, plus a guaranteed emit at scroll end), on tap-to-focus,
     * and on imperative `scrollToIndex` / `scrollToValue`. Not fired in
     * response to external updates of the controlled `value` prop.
     */
    onValueChange?: (value: T) => void;
    /**
     * Animation configuration for the root component.
     * - `"disable-all"`: disable all animations including children (cascades to all child components).
     * - `"disabled"` or `false`: disable the per-item opacity, scale, and label color animations.
     * - `object`: provide custom `opacity`, `scale`, and `labelColor` ranges.
     * - `undefined`: use default animations.
     */
    animation?: WheelPickerRootAnimation;
}
/**
 * Props for the {@link WheelPicker.Indicator} sub-component.
 *
 * Renders a horizontal band positioned absolutely at the center of the
 * wheel. It is purely visual — the actual selection logic lives on the
 * root component.
 */
export interface WheelPickerIndicatorProps extends ViewProps {
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
    classNames?: ElementSlots<WheelPickerIndicatorSlots>;
    /**
     * Styles for the indicator slots.
     */
    styles?: Partial<Record<WheelPickerIndicatorSlots, ViewStyle>>;
}
/**
 * Ref type for the {@link WheelPicker.Indicator} sub-component.
 */
export type WheelPickerIndicatorRef = ViewRef;
/**
 * Props for the {@link WheelPicker.Mask} sub-component.
 *
 * Renders top and bottom fade overlays so the visible wheel softens into
 * the surrounding background.
 */
export interface WheelPickerMaskProps extends Omit<ViewProps, 'children'> {
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
     * the wheel viewport edges toward the selection band.
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
     * Additional CSS classes for individual mask slots.
     */
    classNames?: ElementSlots<WheelPickerMaskSlots>;
    /**
     * Styles for individual mask slots.
     */
    styles?: Partial<Record<WheelPickerMaskSlots, ViewStyle>>;
}
/**
 * Ref type for the {@link WheelPicker.Mask} sub-component.
 */
export type WheelPickerMaskRef = ViewRef;
/**
 * Props for the {@link WheelPicker.Item} sub-component.
 *
 * `WheelPicker.Item` is the animated row container. The wheel root
 * renders it for every option by default; passing a custom `renderItem`
 * on the root lets you compose your own content inside it. When no
 * `children` are provided, `WheelPicker.Item` renders the row's
 * `label` via {@link WheelPicker.ItemLabel} so the simplest usage stays
 * a one-liner.
 *
 * Tapping a row scrolls the wheel to focus on it. The press is wired
 * via the underlying `Pressable`, so consumers can pass any
 * `PressableProps` (`onPressIn`, `hitSlop`, `disabled`, …). When the
 * consumer supplies their own `onPress`, it runs first and the wheel
 * still scrolls to the tapped row afterwards.
 */
export interface WheelPickerItemProps extends Omit<PressableProps, 'children' | 'style'> {
    /**
     * Custom content for the row. When omitted, the row renders
     * `<WheelPicker.ItemLabel>{item.label}</WheelPicker.ItemLabel>`
     * automatically.
     */
    children?: ReactNode;
    /**
     * Additional CSS classes for the row container.
     *
     * @note The following style properties are occupied by animations and
     * cannot be set via `className`:
     * - `opacity` - Animated for distance-based fade
     * - `transform` (scale) - Animated for distance-based scale
     *
     * To customize the ranges, use the `animation` prop on `WheelPicker`.
     * To disable animated styles, set `animation="disabled"` on the root.
     */
    className?: string;
    /**
     * Inline style for the row container. Merged after the root cascade
     * (`styles.item`) and the animated transform style.
     */
    style?: ViewStyle;
}
/**
 * Ref type for the {@link WheelPicker.Item} sub-component. Forwarded to
 * the underlying `Pressable` so consumers can call its imperative
 * methods (e.g. `measure`).
 */
export type WheelPickerItemRef = PressableRef;
/**
 * Per-row data exposed by the wheel root so {@link WheelPicker.Item}
 * (and any nested children) can read which option they belong to. Also
 * used as the value type of the underlying item context — consumed via
 * {@link useWheelPickerItem}.
 *
 * The context erases the generic to `unknown` to keep the provider
 * non-generic; consumers cast at the call site (`as
 * WheelPickerItemRenderProps<MyType>`) if they need strict typing on
 * `item.value`.
 *
 * @template T - The value type stored on each option.
 */
export interface WheelPickerItemRenderProps<T = unknown> {
    /** The option being rendered. */
    item: WheelPickerOption<T>;
    /** Zero-based index of the option in the `items` array. */
    index: number;
    /** Whether the option matches the current value. */
    isSelected: boolean;
    /**
     * Per-row absolute distance from the wheel's center, in row units
     * (`0` = centered, `0.5` = selection boundary, `1+` = one full row or
     * more away). Use as input to `interpolate` / `interpolateColor`
     * inside `useAnimatedStyle` / `useAnimatedProps` to build custom row
     * or row-content animations (icons, badges, indicators, etc.).
     */
    absDistance: SharedValue<number>;
}
/**
 * Props for the {@link WheelPicker.ItemLabel} sub-component.
 *
 * Exposed so consumers can reuse the default label styling inside a
 * custom `renderItem`.
 */
export interface WheelPickerItemLabelProps extends TextProps {
    /**
     * Additional CSS classes applied to the label text.
     *
     * @note The label's `color` is driven by the root
     * `animation.labelColor` interpolation (defaults to theme
     * `[foreground, accent-soft-foreground]`), so `text-*` color classes
     * here are overridden by the animated value. To customize, pass a
     * `labelColor` value on the root `animation`; to disable, set
     * `animation="disabled"` on the root.
     */
    className?: string;
}
/**
 * Ref type for the {@link WheelPicker.ItemLabel} sub-component.
 */
export type WheelPickerItemLabelRef = TextRef;
/**
 * Context value propagated from the root to its compound parts. Generic
 * value typing is intentionally erased to `unknown` so the context can be
 * consumed by sub-components without leaking type parameters.
 */
export interface WheelPickerContextValue {
    /** Resolved row height in pixels. */
    itemHeight: number;
    /** Number of visible rows (always odd). */
    visibleCount: number;
    /** Whether the wheel is disabled. */
    isDisabled: boolean;
    /** Shared scroll offset (UI thread). */
    scrollY: SharedValue<number>;
    /** Whether a `WheelPickerGroup` parent provided the value (hides default indicator). */
    isInsideGroup: boolean;
    /** Resolved animation values used by item animation hooks. */
    resolvedAnimation: WheelPickerResolvedAnimationConfig;
    /** Whether item animation is disabled (including cascade). */
    isItemAnimationDisabled: boolean;
    /** Root-level `classNames.item` cascade applied to every `WheelPicker.Item`. */
    rootItemClassName: Exclude<ClassValue, 0n> | undefined;
    /** Root-level `styles.item` cascade applied to every `WheelPicker.Item`. */
    rootItemStyle: ViewStyle | undefined;
    /** Root-level `classNames.itemLabel` cascade applied to every default label. */
    rootItemLabelClassName: Exclude<ClassValue, 0n> | undefined;
    /** Root-level `styles.itemLabel` cascade applied to every default label. */
    rootItemLabelStyle: TextStyle | undefined;
    /**
     * Ref mirroring whether a scroll is currently in progress on this
     * wheel — covers both user-initiated drags and animated programmatic
     * scrolls triggered by tap-to-focus or imperative `scrollToIndex` /
     * `scrollToValue`. `WheelPicker.Item` reads `isScrollingRef.current`
     * inside its press handler to block taps while a previous scroll
     * animation is still settling, so rapid taps don't cancel each other
     * mid-flight.
     *
     * Intentionally a ref rather than a boolean: the scroll lifecycle
     * toggles this value frequently, and routing it through context state
     * would re-render every visible row on each toggle. As a ref it has a
     * stable identity, so only rows whose selection changes ever re-render.
     */
    isScrollingRef: RefObject<boolean>;
    /**
     * Imperative helper passed down from the root so `WheelPicker.Item`
     * can focus itself on tap. Equivalent to calling `scrollToIndex` on
     * the root ref.
     */
    scrollToIndex: (params: {
        index: number;
        animated?: boolean;
    }) => void;
}
//# sourceMappingURL=wheel-picker.types.d.ts.map