import type { RoundedCorners } from 'victory-native';
/**
 * Display name constants for the `BarChart` compound component parts.
 */
export declare const DISPLAY_NAME: {
    readonly ROOT: "HeroUINative.BarChart.Root";
    readonly BAR: "HeroUINative.BarChart.Bar";
    readonly BAR_GROUP: "HeroUINative.BarChart.BarGroup";
    readonly BAR_GROUP_ITEM: "HeroUINative.BarChart.BarGroupItem";
    readonly STACKED_BAR: "HeroUINative.BarChart.StackedBar";
};
/**
 * Default Uniwind `colorClassName` for single-series and grouped bar fills.
 */
export declare const DEFAULT_BAR_COLOR_CLASSNAME = "accent-chart-3";
/**
 * Default `domainPadding` for the {@link BarChart} root (applied before `...cartesianProps` so a
 * caller-supplied `domainPadding` replaces this object in full).
 */
export declare const DEFAULT_BAR_CHART_DOMAIN_PADDING: {
    readonly bottom: 8;
    readonly left: 12;
    readonly right: 12;
    readonly top: 8;
};
/**
 * Default rounded top corners for {@link BarChart.Bar} when the caller omits `roundedCorners`.
 */
export declare const DEFAULT_BAR_ROUNDED_CORNERS: RoundedCorners;
//# sourceMappingURL=bar-chart.constants.d.ts.map