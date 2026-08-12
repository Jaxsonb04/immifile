/**
 * Display names for the {@link ChartCrosshair} compound API (Skia root + RN anchor / value parts).
 */
export declare const DISPLAY_NAME: {
    readonly ANCHOR: "HeroUINative.ChartCrosshair.Anchor";
    readonly ROOT: "HeroUINative.ChartCrosshair";
    readonly VALUE: "HeroUINative.ChartCrosshair.Value";
    readonly VALUE_LABEL: "HeroUINative.ChartCrosshair.ValueLabel";
};
/**
 * Default stroke width for {@link ChartCrosshair} vertical rule, in logical pixels.
 *
 * @default 1
 */
export declare const DEFAULT_CROSSHAIR_STROKE_WIDTH = 1;
/**
 * Default Skia `DashPathEffect` intervals for {@link ChartCrosshair} when `variant="dashed"`.
 *
 * `[dashLength, gapLength]` — a tight 4-on / 4-off pattern reads as a crisp hover guide at
 * typical chart sizes.
 */
export declare const DEFAULT_CROSSHAIR_DASH_INTERVALS: number[];
//# sourceMappingURL=chart-crosshair.constants.d.ts.map