/**
 * Display name constants for the `ComposedChart` compound component parts.
 */
export declare const DISPLAY_NAME: {
    readonly ROOT: "HeroUINative.ComposedChart.Root";
};
/**
 * Default `domainPadding` for the {@link ComposedChart} root (applied before `...cartesianProps` so a
 * caller-supplied `domainPadding` replaces this object in full).
 *
 * Bar-friendly horizontal inset prevents the first/last column from clipping at the plot edge when
 * mixing bar series with line or area overlays.
 */
export declare const DEFAULT_COMPOSED_CHART_DOMAIN_PADDING: {
    readonly bottom: 8;
    readonly left: 12;
    readonly right: 12;
    readonly top: 8;
};
//# sourceMappingURL=composed-chart.constants.d.ts.map