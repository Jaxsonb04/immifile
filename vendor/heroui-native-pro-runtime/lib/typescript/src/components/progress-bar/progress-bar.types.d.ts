import type { ReactNode } from 'react';
import type { TextProps, ViewProps } from 'react-native';
import type { WithTimingConfig } from 'react-native-reanimated';
import type { Animation, AnimationRootDisableAll, AnimationValue, TextRef, ViewRef } from '../../helpers/internal/types';
/**
 * Size variants supported by {@link ProgressBar}.
 */
export type ProgressBarSize = 'sm' | 'md' | 'lg';
/**
 * Color variants supported by {@link ProgressBar}.
 */
export type ProgressBarColor = 'default' | 'accent' | 'success' | 'warning' | 'danger';
/**
 * Context value shared between ProgressBar compound parts.
 * Provides progress state, formatting, and variant info to all children.
 */
export interface ProgressBarContextValue {
    /** Computed percentage (0–100) of current progress */
    percentage: number;
    /** Formatted value text (e.g. "60%") */
    valueText: string;
    /** Whether progress is indeterminate */
    isIndeterminate: boolean;
    /** Whether the component is disabled */
    isDisabled: boolean;
    /** Current size variant */
    size: ProgressBarSize;
    /** Current color variant */
    color: ProgressBarColor;
    /** Measured track width in pixels (set by Track, read by IndeterminateFill) */
    trackWidth: number;
    /** Callback for Track to report its measured width */
    onTrackLayout: (width: number) => void;
}
/**
 * Render props exposed via children-as-function on the root.
 */
export interface ProgressBarRenderProps {
    /** Computed percentage (0–100) */
    percentage: number;
    /** Formatted value text */
    valueText: string;
    /** Whether progress is indeterminate */
    isIndeterminate: boolean;
}
/**
 * Props for the ProgressBar root component.
 * Manages progress state, formatting, and variant configuration.
 */
export interface ProgressBarRootProps extends Omit<ViewProps, 'children'> {
    /**
     * Children elements or render function with access to progress state.
     */
    children?: ReactNode | ((props: ProgressBarRenderProps) => ReactNode);
    /**
     * The current progress value.
     *
     * @default 0
     */
    value?: number;
    /**
     * The minimum value of the progress range.
     *
     * @default 0
     */
    minValue?: number;
    /**
     * The maximum value of the progress range.
     *
     * @default 100
     */
    maxValue?: number;
    /**
     * Whether progress is indeterminate (unknown duration).
     *
     * @default false
     */
    isIndeterminate?: boolean;
    /**
     * Whether the component is disabled.
     *
     * @default false
     */
    isDisabled?: boolean;
    /**
     * Size of the progress track.
     *
     * @default "md"
     */
    size?: ProgressBarSize;
    /**
     * Color of the fill bar.
     *
     * @default "accent"
     */
    color?: ProgressBarColor;
    /**
     * Number format options for the value display.
     *
     * @default { style: 'percent' }
     */
    formatOptions?: Intl.NumberFormatOptions;
    /**
     * Additional CSS classes for the root container.
     */
    className?: string;
    /**
     * Animation configuration for the root component.
     * - `"disable-all"`: Disable all animations including children
     *   (cascades down to all child components)
     * - `undefined`: Use default animations
     */
    animation?: ProgressBarRootAnimation;
}
/**
 * Ref type for the ProgressBar root component.
 */
export type ProgressBarRootRef = ViewRef;
/**
 * Animation configuration for the ProgressBar root.
 * Only supports cascading the disable-all flag to children.
 */
export type ProgressBarRootAnimation = AnimationRootDisableAll;
/**
 * Props for the ProgressBar.Track component.
 * Container that holds the Fill element.
 */
export interface ProgressBarTrackProps extends ViewProps {
    /**
     * Content to display inside the track (typically ProgressBar.Fill).
     */
    children?: ReactNode;
    /**
     * Additional CSS classes for the track container.
     */
    className?: string;
}
/**
 * Ref type for the ProgressBar.Track component.
 */
export type ProgressBarTrackRef = ViewRef;
/**
 * Props for the ProgressBar.Fill component.
 * Animated element that represents the filled portion.
 *
 * @note The following style properties are occupied by animations and cannot be set via className:
 * - `width` - Animated for determinate fill progress
 * - `transform` (translateX) - Animated for indeterminate sweep
 *
 * To completely disable animated styles and apply your own via className or
 * style prop, set `isAnimatedStyleActive={false}`.
 */
export interface ProgressBarFillProps extends ViewProps {
    /**
     * Additional CSS classes for the fill element.
     */
    className?: string;
    /**
     * Animation configuration for the fill element.
     * Controls timing of both determinate and indeterminate animations.
     */
    animation?: ProgressBarFillAnimation;
    /**
     * When `false`, animated styles (width / translateX) are not applied,
     * allowing consumers to fully control the fill via `className` or `style`.
     *
     * @default true
     */
    isAnimatedStyleActive?: boolean;
}
/**
 * Ref type for the ProgressBar.Fill component.
 */
export type ProgressBarFillRef = ViewRef;
/**
 * Animation configuration for the ProgressBar.Fill.
 * Supports timing configs for both determinate and indeterminate animations.
 */
export type ProgressBarFillAnimation = Animation<{
    /**
     * Timing configuration for the determinate fill width transition.
     *
     * @default { duration: 300 }
     */
    fillTimingConfig?: AnimationValue<WithTimingConfig>;
    /**
     * Timing configuration for the indeterminate sweep animation.
     *
     * @default { duration: 1500 }
     */
    indeterminateFillTimingConfig?: AnimationValue<WithTimingConfig>;
}>;
/**
 * Props for the ProgressBar.Label component.
 * Text label describing the progress operation.
 */
export interface ProgressBarLabelProps extends TextProps {
    /**
     * Text content for the label.
     */
    children?: ReactNode;
    /**
     * Additional CSS classes for the label text.
     */
    className?: string;
}
/**
 * Ref type for the ProgressBar.Label component.
 */
export type ProgressBarLabelRef = TextRef;
/**
 * Props for the ProgressBar.ValueLabel component.
 * Displays the formatted progress value text.
 */
export interface ProgressBarValueLabelProps extends TextProps {
    /**
     * Custom content to override the formatted value text.
     * If not provided, the formatted value is displayed.
     */
    children?: ReactNode;
    /**
     * Additional CSS classes for the value label text.
     */
    className?: string;
}
/**
 * Ref type for the ProgressBar.ValueLabel component.
 */
export type ProgressBarValueLabelRef = TextRef;
//# sourceMappingURL=progress-bar.types.d.ts.map