/**
 * Display name constants for the `RadarChart` compound component parts.
 */
export declare const DISPLAY_NAME: {
    readonly ROOT: "HeroUINative.RadarChart.Root";
    readonly GRID: "HeroUINative.RadarChart.Grid";
    readonly ANGLE_AXIS: "HeroUINative.RadarChart.AngleAxis";
    readonly RADIUS_AXIS: "HeroUINative.RadarChart.RadiusAxis";
    readonly RADAR: "HeroUINative.RadarChart.Radar";
};
/**
 * Default number of concentric rings drawn by `RadarChart.Grid` and matching ticks rendered by
 * `RadarChart.RadiusAxis`.
 */
export declare const DEFAULT_NUM_TICKS = 5;
/**
 * Fraction of `min(canvasWidth, canvasHeight) / 2` actually used as the radar's outer radius.
 * The remaining headroom leaves space for `RadarChart.AngleAxis` labels rendered outside the
 * outermost ring (see {@link DEFAULT_LABEL_RADIUS_OFFSET}).
 */
export declare const DEFAULT_RADIUS_PADDING = 0.78;
/**
 * Fractional position of `RadarChart.AngleAxis` labels along each spoke. `1` sits the labels on
 * the outer ring; values `> 1` push them outside the ring.
 */
export declare const DEFAULT_LABEL_RADIUS_OFFSET = 1.05;
/**
 * Default stroke width applied to both rings and spokes drawn by `RadarChart.Grid`.
 */
export declare const DEFAULT_GRID_STROKE_WIDTH = 1;
/**
 * Alpha applied to the theme `muted` color when computing the default grid stroke.
 */
export declare const DEFAULT_GRID_STROKE_ALPHA = 0.3;
/**
 * Alpha applied to the radar polygon fill (overrides `Color` opacity, not the stroke).
 */
export declare const DEFAULT_FILL_OPACITY = 0.3;
/**
 * Default stroke width applied to the radar polygon outline.
 */
export declare const DEFAULT_RADAR_STROKE_WIDTH = 2;
/**
 * Default radius of each vertex dot rendered by `RadarChart.Radar` when `showDots` is enabled.
 */
export declare const DEFAULT_DOT_RADIUS = 3;
/**
 * Tick font family used by `RadarChart.AngleAxis` / `RadarChart.RadiusAxis` when no font is
 * supplied. Mirrors `BaseCartesianChart` so cartesian and polar charts share the same default
 * typography.
 */
export declare const DEFAULT_FONT_FAMILY: string;
/**
 * Default font size in pixels shared by `RadarChart.AngleAxis` (category labels) and
 * `RadarChart.RadiusAxis` (numeric tick values). A single size keeps the chart's typographic
 * rhythm consistent — supply a custom `font` via the axis prop to override per-axis.
 */
export declare const DEFAULT_AXIS_FONT_SIZE = 11;
/**
 * Default spoke angle for `RadarChart.RadiusAxis`, in **degrees, clockwise from 12 o'clock**.
 * Renders the axis along the top spoke — the most common dashboard layout and the equivalent
 * of Recharts' default `angle={90}` (their CCW-from-east convention).
 */
export declare const DEFAULT_RADIUS_AXIS_ANGLE = 0;
/**
 * Default horizontal alignment of `RadarChart.RadiusAxis` tick labels relative to the spoke.
 * Matches Recharts' default (`'right'`), which anchors the text's left edge at the spoke so
 * the label reads outward from the spoke line.
 */
export declare const DEFAULT_RADIUS_AXIS_ORIENTATION = "right";
/**
 * Whether `RadarChart.RadiusAxis` renders an additional `0` label at the chart center by
 * default. `false` because the center is typically reserved for an overlay (headline number,
 * icon, etc.); opt in with `includeZero` to render the origin tick like Recharts'
 * `PolarRadiusAxis` does by default.
 */
export declare const DEFAULT_RADIUS_AXIS_INCLUDE_ZERO = false;
//# sourceMappingURL=radar-chart.constants.d.ts.map