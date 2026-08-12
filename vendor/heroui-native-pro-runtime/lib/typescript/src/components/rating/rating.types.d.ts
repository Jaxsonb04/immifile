import type { RadioGroupItemProps, RadioGroupProps } from 'heroui-native';
import type { ReactNode } from 'react';
import type { WithTimingConfig } from 'react-native-reanimated';
import type { Animation, AnimationValue, PressableRef, ViewRef } from '../../helpers/internal/types';
/**
 * Size variants supported by {@link Rating}.
 */
export type RatingSize = 'sm' | 'md' | 'lg';
/**
 * Animation configuration for {@link RatingItem} press feedback.
 * Controls the subtle scale applied while the item is pressed in.
 *
 * - `false` or `"disabled"`: Disable item press animation
 * - `undefined`: Use default animation
 * - `object`: Custom animation configuration
 */
export type RatingItemAnimation = Animation<{
    scale?: AnimationValue<{
        /**
         * Scale values `[unpressed, pressed]`.
         *
         * @default [1, 0.9]
         */
        value?: [number, number];
        /**
         * Animation timing configuration.
         *
         * @default { duration: 150 }
         */
        timingConfig?: WithTimingConfig;
    }>;
}>;
/**
 * Render props passed to a `Rating.Item` render-function `children`.
 *
 * Consumers can use these to render a fully custom indicator while still
 * reflecting the current rating state (active, partial, and partial fill
 * percentage in the 0-100 range).
 */
export interface RatingItemRenderProps {
    /** Whether the item is considered active (filled or partially filled). */
    isActive: boolean;
    /** Whether the item is partially filled (only possible when the root is read-only). */
    isPartial: boolean;
    /** Partial fill percentage in the 0-100 range. `0` when the item is not partial. */
    partialPercent: number;
}
/**
 * Shared icon styling options for the {@link Rating} root. Applied to both
 * the default star icon and any custom icon passed via the `icon` prop (as
 * long as the custom icon honours `size` and `color` / `colorClassName`).
 *
 * When both `activeColor` / `inactiveColor` and their `*ColorClassName`
 * counterparts are provided, the className wins for theme-aware styling —
 * the raw color values are used as a fallback when a className cannot be
 * resolved.
 */
export interface RatingIconProps {
    /**
     * Icon size in pixels. Falls back to the size derived from the root
     * `size` variant when omitted.
     */
    size?: number;
    /**
     * Raw fill color applied to inactive items (items whose value is above
     * the current rating).
     */
    inactiveColor?: string;
    /**
     * Raw fill color applied to active / partially active items.
     */
    activeColor?: string;
    /**
     * Uniwind `colorClassName` applied to inactive items.
     *
     * @default 'accent-surface-tertiary'
     */
    inactiveColorClassName?: string;
    /**
     * Uniwind `colorClassName` applied to active / partially active items.
     *
     * @default 'accent-warning'
     */
    activeColorClassName?: string;
}
/**
 * Props for the `Rating` root component.
 *
 * Extends HeroUI Native `RadioGroup` props while overriding value-related
 * props to work with numeric ratings instead of string values. The group is
 * always laid out horizontally via the rating styles — `orientation` is not
 * exposed because it does not match the semantics of a star rating.
 */
export interface RatingRootProps extends Omit<RadioGroupProps, 'value' | 'defaultValue' | 'onValueChange' | 'children'> {
    /**
     * Rating content. When omitted, the component auto-renders
     * {@link RatingItem} instances from `1` to `maxValue`. Pass explicit items
     * (or a mix of items and other elements) for full control of the layout.
     */
    children?: ReactNode;
    /**
     * Controlled rating value. Integer in interactive mode; supports fractional
     * values (e.g. `3.5`) when {@link RatingRootProps.isReadOnly} is `true`.
     */
    value?: number;
    /**
     * Default rating value (uncontrolled). Integer in interactive mode; supports
     * fractional values (e.g. `3.5`) when read-only.
     */
    defaultValue?: number;
    /**
     * Callback fired when the selected rating changes. Always receives an
     * integer value — fractional values are only supported in read-only mode
     * which does not emit changes.
     */
    onValueChange?: (value: number) => void;
    /**
     * Maximum rating value. Controls the number of items auto-rendered when
     * `children` is omitted.
     *
     * @default 5
     */
    maxValue?: number;
    /**
     * Size of the rating items.
     *
     * @default 'md'
     */
    size?: RatingSize;
    /**
     * When `true`, the rating is displayed but not interactive and supports
     * fractional `value` for partial fills.
     *
     * @default false
     */
    isReadOnly?: boolean;
    /**
     * Custom icon rendered by every {@link RatingItem} unless the item
     * overrides it via its own `icon` prop or render-function children. Two
     * copies of the same element are rendered per item (one inactive, one
     * clipped active overlay).
     *
     * The icon component is expected to accept `size`, `color`, and
     * `colorClassName` props so the rating can drive its dimensions and
     * active / inactive colors — wrap the SVG with `withUniwind` to enable
     * `colorClassName`. Schematically:
     *
     * ```tsx
     * interface CustomIconProps {
     *   size?: number;
     *   color?: string;
     *   colorClassName?: string;
     * }
     *
     * const CustomIconBase: FC<CustomIconProps> = ({ size, color, ...rest }) => (
     *   <Svg width={size} height={size} viewBox="0 0 16 16" {...rest}>
     *     <Path d="..." fill={color} />
     *   </Svg>
     * );
     *
     * const CustomIcon = withUniwind(CustomIconBase, {
     *   color: { fromClassName: 'colorClassName', styleProperty: 'accentColor' },
     * });
     * ```
     */
    icon?: ReactNode;
    /**
     * Shared icon styling applied to every {@link RatingItem}. Controls the
     * size and the active / inactive colors used for both the default star
     * and any custom `icon`.
     */
    iconProps?: RatingIconProps;
    /**
     * Additional CSS classes applied to the root.
     */
    className?: string;
}
/**
 * Imperative ref type for the {@link Rating} root component.
 */
export type RatingRootRef = ViewRef;
/**
 * Props for the {@link RatingItem} compound part.
 *
 * Extends HeroUI Native `RadioGroup.Item` props. The underlying radio
 * receives `String(value)` so the integer part of the rating can be
 * controlled through the standard `RadioGroup` selection flow.
 */
export interface RatingItemProps extends Omit<RadioGroupItemProps, 'value' | 'children'> {
    /**
     * Numeric value represented by this item (1-based).
     */
    value: number;
    /**
     * Custom icon for this specific item. Overrides the root-level `icon`.
     * Two copies are rendered per item (inactive + clipped active overlay).
     */
    icon?: ReactNode;
    /**
     * Rating item content. When a function is provided, it receives
     * {@link RatingItemRenderProps} and is fully responsible for rendering the
     * indicator. When omitted or a non-function node, the default inactive
     * icon + partial overlay layout is used.
     */
    children?: ReactNode | ((props: RatingItemRenderProps) => ReactNode);
    /**
     * Animation configuration for the subtle press-scale feedback.
     *
     * @note The `transform` (scale) style property is animated and cannot be
     * overridden via `className` or `style`. Use this prop to customize the
     * scale values / timing, or set `isAnimatedStyleActive={false}` to disable
     * animated styles entirely.
     */
    animation?: RatingItemAnimation;
    /**
     * Whether the animated press-scale style is applied to the item. Set to
     * `false` to completely disable animated styles and apply your own via
     * `className` or `style`.
     *
     * @default true
     */
    isAnimatedStyleActive?: boolean;
    /**
     * Additional CSS classes applied to the item pressable.
     */
    className?: string;
}
/**
 * Imperative ref type for the {@link RatingItem} compound part.
 * `RadioGroup.Item` renders as a Pressable.
 */
export type RatingItemRef = PressableRef;
/**
 * Value shared between the {@link Rating} root and its compound parts
 * through context.
 */
export interface RatingContextValue {
    /** Current rating value. May be fractional when `isReadOnly` is `true`. */
    value: number;
    /** Current maximum rating value. */
    maxValue: number;
    /** Current size of the rating items. */
    size: RatingSize;
    /** Whether the rating is read-only (fractional values allowed). */
    isReadOnly: boolean;
    /** Whether the rating is disabled. */
    isDisabled: boolean;
    /** Shared default icon for all items (may be overridden per-item). */
    icon?: ReactNode;
    /** Shared icon styling (size + active / inactive colors) for all items. */
    iconProps?: RatingIconProps;
}
//# sourceMappingURL=rating.types.d.ts.map