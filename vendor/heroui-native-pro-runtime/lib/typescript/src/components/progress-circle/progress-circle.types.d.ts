import type { ReactNode } from 'react';
import type { TextProps, ViewProps } from 'react-native';
import type { WithTimingConfig } from 'react-native-reanimated';
import type { Animation, AnimationRootDisableAll, AnimationValue, TextRef, ViewRef } from '../../helpers/internal/types';
/**
 * Size variants supported by {@link ProgressCircle}.
 * Can be a preset name or a custom pixel value.
 */
export type ProgressCircleSize = 'sm' | 'md' | 'lg' | number;
/**
 * Color variants supported by {@link ProgressCircle}.
 */
export type ProgressCircleColor = 'default' | 'accent' | 'success' | 'warning' | 'danger';
/**
 * Context value shared between ProgressCircle compound parts.
 * Provides progress state, formatting, and variant info to all children.
 */
export interface ProgressCircleContextValue {
    /** Computed percentage (0–100) of current progress */
    percentage: number;
    /** Formatted value text (e.g. "60%") */
    valueText: string;
    /** Whether progress is indeterminate */
    isIndeterminate: boolean;
    /** Whether the component is disabled */
    isDisabled: boolean;
    /** Current size variant */
    size: ProgressCircleSize;
    /** Current color variant */
    color: ProgressCircleColor;
}
/**
 * Render props exposed via children-as-function on the root.
 */
export interface ProgressCircleRenderProps {
    /** Computed percentage (0–100) */
    percentage: number;
    /** Formatted value text */
    valueText: string;
    /** Whether progress is indeterminate */
    isIndeterminate: boolean;
}
/**
 * Props for the ProgressCircle root component.
 * Manages progress state, formatting, and variant configuration.
 */
export interface ProgressCircleRootProps extends Omit<ViewProps, 'children'> {
    /**
     * Children elements or render function with access to progress state.
     */
    children?: ReactNode | ((props: ProgressCircleRenderProps) => ReactNode);
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
     * Size of the circle.
     *
     * @default "md"
     */
    size?: ProgressCircleSize;
    /**
     * Color of the progress arc.
     *
     * @default "accent"
     */
    color?: ProgressCircleColor;
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
    animation?: ProgressCircleRootAnimation;
}
/**
 * Ref type for the ProgressCircle root component.
 */
export type ProgressCircleRootRef = ViewRef;
/**
 * Animation configuration for the ProgressCircle root.
 * Only supports cascading the disable-all flag to children.
 */
export type ProgressCircleRootAnimation = AnimationRootDisableAll;
/**
 * Props for the ProgressCircle.Indicator component.
 * Renders the SVG with track and fill circles.
 */
export interface ProgressCircleIndicatorProps extends ViewProps {
    /**
     * Stroke width of the circles.
     *
     * @default 4
     */
    strokeWidth?: number;
    /**
     * Override color for the track circle stroke.
     * Defaults to the theme's `default` color.
     */
    trackColor?: string;
    /**
     * Override color for the fill circle stroke.
     * Defaults to the resolved color from the `color` prop.
     */
    fillColor?: string;
    /**
     * Additional CSS classes for the indicator container.
     */
    className?: string;
    /**
     * Animation configuration for the indicator.
     * Controls timing of both determinate (fill) and indeterminate (spin) animations.
     */
    animation?: ProgressCircleIndicatorAnimation;
}
/**
 * Ref type for the ProgressCircle.Indicator component.
 */
export type ProgressCircleIndicatorRef = ViewRef;
/**
 * Animation configuration for the ProgressCircle.Indicator.
 * Supports timing configs for both the determinate fill (strokeDashoffset)
 * and the indeterminate spin rotation.
 */
export type ProgressCircleIndicatorAnimation = Animation<{
    /**
     * Timing configuration for the determinate strokeDashoffset transition.
     *
     * @default { duration: 300 }
     */
    fillTimingConfig?: AnimationValue<WithTimingConfig>;
    /**
     * Timing configuration for the indeterminate spin rotation.
     *
     * @default { duration: 1000, easing: Easing.linear }
     */
    spinTimingConfig?: AnimationValue<WithTimingConfig>;
}>;
/**
 * Props for the ProgressCircle.ValueLabel component.
 * Displays the formatted progress value centered on the circle.
 */
export interface ProgressCircleValueLabelProps extends TextProps {
    /**
     * Custom content to override the formatted value text.
     */
    children?: ReactNode;
    /**
     * Additional CSS classes for the value label text.
     */
    className?: string;
}
/**
 * Ref type for the ProgressCircle.ValueLabel component.
 */
export type ProgressCircleValueLabelRef = TextRef;
//# sourceMappingURL=progress-circle.types.d.ts.map