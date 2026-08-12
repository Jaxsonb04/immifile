import type { ProgressCircleColor, ProgressCircleSize } from './progress-circle.types';
/**
 * Display name constants for the ProgressCircle compound component parts.
 */
export declare const DISPLAY_NAME: {
    readonly ROOT: "HeroUINative.ProgressCircle.Root";
    readonly INDICATOR: "HeroUINative.ProgressCircle.Indicator";
    readonly VALUE_LABEL: "HeroUINative.ProgressCircle.ValueLabel";
};
/** Default size when the `size` prop is not provided. */
export declare const DEFAULT_SIZE: ProgressCircleSize;
/** Default color when the `color` prop is not provided. */
export declare const DEFAULT_COLOR: ProgressCircleColor;
/** Default minimum value. */
export declare const DEFAULT_MIN_VALUE = 0;
/** Default maximum value. */
export declare const DEFAULT_MAX_VALUE = 100;
/** Default format options for the value display. */
export declare const DEFAULT_FORMAT_OPTIONS: Intl.NumberFormatOptions;
/** Stroke width of the track and fill circles. */
export declare const STROKE_WIDTH = 4;
/** Center coordinate of the SVG viewBox. */
export declare const CENTER = 18;
/** Radius of the circles (center minus half stroke width). */
export declare const RADIUS: number;
/** Full circumference of the circle. */
export declare const CIRCUMFERENCE: number;
/**
 * Maps a preset {@link ProgressCircleSize} (`"sm" | "md" | "lg"`) to its
 * rendered dimension in pixels. Custom numeric sizes bypass this map.
 */
export declare const SIZE_MAP: Record<'sm' | 'md' | 'lg', number>;
/** Default duration for the determinate strokeDashoffset transition. */
export declare const DEFAULT_FILL_TIMING_DURATION = 300;
/** Default duration for one full indeterminate spin rotation. */
export declare const DEFAULT_SPIN_DURATION = 1000;
/** Default easing for the indeterminate spin animation. */
export declare const DEFAULT_SPIN_EASING: (t: number) => number;
//# sourceMappingURL=progress-circle.constants.d.ts.map