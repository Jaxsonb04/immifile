/**
 * Display name for the {@link ChartIndicator} Skia overlay.
 */
export declare const DISPLAY_NAME: {
    readonly ROOT: "HeroUINative.ChartIndicator";
};
/**
 * Fixed radius in logical pixels for the outer (halo) circle behind the inner dot — matches
 * `bg-background` so the marker reads clearly on top of chart ink.
 */
export declare const INDICATOR_OUTER_RADIUS = 7;
/**
 * Default radius for the inner (front) circle in logical pixels.
 *
 * Picked to read as a crisp marker over typical 2px line strokes without overwhelming the data
 * at small chart sizes. Callers override via `innerRadius` when they want a larger hit target or
 * a thinner hairline indicator.
 *
 * @default 5
 */
export declare const DEFAULT_INDICATOR_RADIUS = 5;
//# sourceMappingURL=chart-indicator.constants.d.ts.map