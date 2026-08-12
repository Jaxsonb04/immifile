import type { ChartTooltipRootAnimationConfig } from './chart-tooltip.types';
/**
 * Display name constants for the {@link ChartTooltip} compound component parts.
 */
export declare const DISPLAY_NAME: {
    readonly ANCHOR: "HeroUINative.ChartTooltip.Anchor";
    readonly ROOT: "HeroUINative.ChartTooltip";
    readonly HEADER: "HeroUINative.ChartTooltip.Header";
    readonly ITEM: "HeroUINative.ChartTooltip.Item";
    readonly INDICATOR: "HeroUINative.ChartTooltip.Indicator";
    readonly LABEL: "HeroUINative.ChartTooltip.Label";
    readonly VALUE: "HeroUINative.ChartTooltip.Value";
};
/**
 * Default gap in logical pixels between the press indicator and {@link ChartTooltip}.
 */
export declare const DEFAULT_TOOLTIP_GAP = 12;
/**
 * Default vertical placement for {@link ChartTooltip}.
 */
export declare const DEFAULT_PLACEMENT: "top";
/**
 * Default indicator variant for {@link ChartTooltip.Indicator}.
 */
export declare const DEFAULT_INDICATOR_VARIANT: "dot";
/**
 * Default visibility mode for {@link ChartTooltip}.
 *
 * `'auto'` fades with press activity from {@link ChartTooltip.Anchor}.
 */
export declare const DEFAULT_IS_VISIBLE: "auto";
/**
 * Default fade duration (ms) when {@link ChartTooltip} tracks press activity.
 */
export declare const DEFAULT_FADE_DURATION_MS = 150;
/**
 * Default motion animation for {@link ChartTooltip} position tracking.
 *
 * `withSpring` with no config (Reanimated defaults). Callers override the `type`
 * and config fields via the `animation` prop on {@link ChartTooltip}.
 */
export declare const DEFAULT_MOTION_ANIMATION: ChartTooltipRootAnimationConfig;
//# sourceMappingURL=chart-tooltip.constants.d.ts.map