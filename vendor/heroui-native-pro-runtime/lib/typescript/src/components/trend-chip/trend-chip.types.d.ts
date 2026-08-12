import type { ChipLabelProps, ChipProps } from 'heroui-native/chip';
import type { ReactElement, ReactNode } from 'react';
import type { SvgProps } from 'react-native-svg';
import type { PressableRef, TextRef, ViewRef } from '../../helpers/internal/types';
/**
 * Size variants supported by {@link TrendChip}.
 */
export type TrendChipSize = 'sm' | 'md' | 'lg';
/**
 * Visual style variants supported by {@link TrendChip}.
 * Mirrors the underlying `Chip` variants that make semantic sense for a trend pill.
 */
export type TrendChipVariant = 'primary' | 'secondary' | 'tertiary' | 'soft';
/**
 * Trend direction encoded by the component.
 * Drives both the default indicator icon and the underlying `Chip` color.
 */
export type TrendDirection = 'up' | 'down' | 'neutral';
/**
 * Props for the built-in `TrendChip` arrow icons and any custom SVG provided
 * through {@link TrendChipIndicator}.
 */
export interface TrendArrowIconProps extends SvgProps {
    /**
     * Size of the icon in pixels.
     *
     * @default 12
     */
    size?: number;
    /**
     * Color of the icon (stroke).
     *
     * @default "currentColor"
     */
    color?: string;
    /**
     * ClassName prop for color (mapped to `accentColor` via `withUniwind`).
     */
    colorClassName?: string;
}
/**
 * Props for the {@link TrendChip} root component.
 *
 * Renders a semantic trend indicator built on top of `heroui-native`'s `Chip`.
 * The underlying `Chip` color is derived from the `trend` prop so consumers
 * only think about the trend direction.
 */
export interface TrendChipRootProps extends Omit<ChipProps, 'children' | 'color' | 'size' | 'variant'> {
    /**
     * Children of the chip. When plain text/numbers are passed, the component
     * wraps them in the default indicator + {@link TrendChipValue} layout.
     * For custom compositions, pass any combination of
     * {@link TrendChipIndicator}, {@link TrendChipPrefix},
     * {@link TrendChipValue}, and {@link TrendChipSuffix} directly.
     */
    children?: ReactNode;
    /**
     * Size of the chip.
     *
     * @default 'sm'
     */
    size?: TrendChipSize;
    /**
     * Trend direction. Controls both the default arrow icon and the semantic
     * `Chip` color (`up` -> success, `neutral` -> warning, `down` -> danger).
     *
     * @default 'up'
     */
    trend?: TrendDirection;
    /**
     * Visual variant of the chip.
     *
     * @default 'soft'
     */
    variant?: TrendChipVariant;
    /**
     * Additional CSS classes applied to the chip root.
     */
    className?: string;
}
/**
 * Imperative ref type for the {@link TrendChip} root.
 */
export type TrendChipRootRef = PressableRef;
/**
 * Props for the {@link TrendChipIndicator} compound part.
 *
 * Without children, renders the default trend arrow derived from the chip's
 * `trend`. When a valid React element is passed as `children`, that element
 * is cloned and receives `size` / `color` / `colorClassName` sourced from
 * the chip context so a custom icon matches the surrounding chip.
 */
export interface TrendChipIndicatorProps extends TrendArrowIconProps {
    /**
     * Custom icon element to render in place of the default trend arrow.
     * Expected to accept `size` and `color` (or `colorClassName`) props.
     */
    children?: ReactElement<TrendArrowIconProps>;
    /**
     * Additional CSS classes for the indicator wrapper.
     */
    className?: string;
}
/**
 * Imperative ref type for the {@link TrendChipIndicator} wrapper.
 */
export type TrendChipIndicatorRef = ViewRef;
export interface TrendChipValueProps extends ChipLabelProps {
}
export type TrendChipValueRef = TextRef;
export interface TrendChipPrefixProps extends ChipLabelProps {
}
export type TrendChipPrefixRef = TextRef;
export interface TrendChipSuffixProps extends ChipLabelProps {
}
export type TrendChipSuffixRef = TextRef;
/**
 * Value shared between the {@link TrendChip} root and its compound parts
 * through context.
 */
export interface TrendChipContextValue {
    /** Current size of the chip. */
    size: TrendChipSize;
    /** Current trend direction. */
    trend: TrendDirection;
    /** Current visual variant. */
    variant: TrendChipVariant;
}
//# sourceMappingURL=trend-chip.types.d.ts.map