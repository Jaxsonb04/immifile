import type { ProgressBarColor, ProgressBarSize } from './progress-bar.types';
/**
 * Display name constants for the ProgressBar compound component parts.
 */
export declare const DISPLAY_NAME: {
    readonly ROOT: "HeroUINative.ProgressBar.Root";
    readonly TRACK: "HeroUINative.ProgressBar.Track";
    readonly FILL: "HeroUINative.ProgressBar.Fill";
    readonly LABEL: "HeroUINative.ProgressBar.Label";
    readonly VALUE_LABEL: "HeroUINative.ProgressBar.ValueLabel";
};
/** Default size when the `size` prop is not provided. */
export declare const DEFAULT_SIZE: ProgressBarSize;
/** Default color when the `color` prop is not provided. */
export declare const DEFAULT_COLOR: ProgressBarColor;
/** Default minimum value. */
export declare const DEFAULT_MIN_VALUE = 0;
/** Default maximum value. */
export declare const DEFAULT_MAX_VALUE = 100;
/** Default format options for the value display. */
export declare const DEFAULT_FORMAT_OPTIONS: Intl.NumberFormatOptions;
/** Default duration for the determinate fill width transition. */
export declare const DEFAULT_FILL_TIMING_DURATION = 300;
/** Default duration for the indeterminate sweep animation. */
export declare const DEFAULT_INDETERMINATE_TIMING_DURATION = 1500;
/** Default easing for the indeterminate sweep animation. */
export declare const DEFAULT_INDETERMINATE_EASING: import("react-native-reanimated").EasingFunctionFactory;
/** Width ratio of the indeterminate fill relative to the track. */
export declare const INDETERMINATE_FILL_WIDTH_RATIO = 0.4;
//# sourceMappingURL=progress-bar.constants.d.ts.map