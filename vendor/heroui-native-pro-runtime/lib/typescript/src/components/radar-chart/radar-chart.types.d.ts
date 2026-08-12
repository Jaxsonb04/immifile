import type { Color, SkFont, SkPoint } from '@shopify/react-native-skia';
import type { ComponentProps, ReactNode } from 'react';
import type { AnimationRoot } from '../../helpers/internal/types';
/**
 * Mirror of victory-native's internal `InputFieldType` — valid `labelKey` axis values
 * (string or number). Re-declared locally because the upstream alias is not re-exported from the
 * package.
 */
type InputFieldType = number | string;
/**
 * Mirror of victory-native's internal `MaybeNumber` — `dataKey` fields may hold nullable
 * numbers.
 */
type MaybeNumber = number | null | undefined;
/**
 * Keys of `T` whose values are valid `labelKey` field types (`number` or `string`).
 * Mirrors victory-native `InputFields` (not re-exported from the package).
 */
export type RadarChartInputFields<T> = {
    [K in keyof T as T[K] extends InputFieldType ? K : never]: T[K] extends InputFieldType ? T[K] : never;
};
/**
 * Keys of `T` whose values are numeric (or nullable) `dataKey` fields — each series plotted by a
 * {@link RadarChartRadarProps} child reads one of these keys per row.
 * Mirrors victory-native `NumericalFields` (not re-exported from the package).
 */
export type RadarChartNumericalFields<T> = {
    [K in keyof T as T[K] extends MaybeNumber ? K : never]: T[K];
};
/**
 * Keys of `T` whose values satisfy Skia's `Color` (string, number, `Float32Array`, or `number[]`).
 *
 * Mirrors victory-native's internal `ColorFields` helper so the `RadarChart` root can constrain
 * `LabelKey` to satisfy `BasePolarChart`'s required `ColorKey` parameter — labels are forwarded
 * as the polar chart's color key internally since string / number values already extend `Color`.
 */
export type RadarChartColorFields<T> = {
    [K in keyof T as T[K] extends string | number | Float32Array | number[] ? K : never]: T[K];
};
/**
 * Serializable data row type for radar series — mirrors victory-native's expectation that each
 * datum is a record with known keys for `labelKey` and each plotted numeric `dataKey`.
 */
export type RadarChartDatum = Record<string, unknown>;
/**
 * Concentric grid shape — concentric polygons (one vertex per category) or perfect circles.
 *
 * - `"polygon"`: each ring is a closed polygon whose vertex count matches `data.length` (matches
 *   Recharts' default behaviour and visually emphasises the categorical axes).
 * - `"circle"`: each ring is a true circle, useful when the chart is read as a continuous radial
 *   gauge rather than a categorical comparison.
 */
export type RadarChartGridShape = 'polygon' | 'circle';
/**
 * Animation configuration for the `RadarChart` root.
 *
 * Owns no animated styles — passing `"disable-all"` cascades `isAllAnimationsDisabled` to
 * compound parts that animate (e.g. {@link RadarChartRadarProps.animate}).
 */
export type RadarChartRootAnimation = AnimationRoot;
/**
 * Props for the `RadarChart` root wrapper.
 *
 * Themed container around victory-native's `PolarChart`. Compound subcomponents
 * (`RadarChart.Grid`, `RadarChart.AngleAxis`, `RadarChart.RadiusAxis`, `RadarChart.Radar`)
 * consume `data` / `labelKey` / `dataKey` / `maxValue` through an internal layout context.
 *
 * @example
 * ```tsx
 * <RadarChart
 *   data={DATA}
 *   labelKey="subject"
 *   dataKey="score"
 *   wrapperClassName="h-[260px] w-full"
 * >
 *   <RadarChart.Grid />
 *   <RadarChart.AngleAxis />
 *   <RadarChart.Radar />
 * </RadarChart>
 * ```
 */
export type RadarChartRootProps<RawData extends Record<string, unknown>, LabelKey extends Extract<keyof RadarChartInputFields<RawData>, string>, DataKey extends Extract<keyof RadarChartNumericalFields<RawData>, string>> = {
    /**
     * Compound subcomponents rendered inside the Skia canvas. Typically a combination of
     * `RadarChart.Grid`, `RadarChart.AngleAxis`, `RadarChart.RadiusAxis`, and one or more
     * `RadarChart.Radar` children.
     */
    children: ReactNode;
    /**
     * Categorical-axis data rows. Each row contributes one spoke (axis) to the radar; the spoke's
     * label is sourced from `row[labelKey]` and each radar series reads `row[dataKey]` (or a
     * per-series `dataKey` override on `RadarChart.Radar`).
     */
    data: RawData[];
    /**
     * Key on each row whose value is the axis label rendered by `RadarChart.AngleAxis`.
     */
    labelKey: LabelKey;
    /**
     * Default numeric key plotted by `RadarChart.Radar` when no per-series `dataKey` override is
     * provided. Also drives radius scaling — combined with `maxValue` (or the auto-computed max
     * across all rows / series) to map each value onto `[0, outerRadius]`.
     */
    dataKey: DataKey;
    /**
     * Upper bound of the radial scale. Defaults to the maximum value across all rows for the
     * default `dataKey`. Pass an explicit value when comparing charts side-by-side or when the
     * domain is fixed (e.g. percentages capped at 100).
     *
     * @default `Math.max(...data.map((row) => Number(row[dataKey])))`
     */
    maxValue?: number;
    /**
     * Additional Tailwind classes for the outer `View` that wraps the chart. Required for chart
     * height (e.g. `h-[260px]`).
     */
    wrapperClassName?: string;
    /**
     * Animation configuration for the chart root. Cascades `"disable-all"` via
     * `AnimationSettingsProvider` to compound parts that use victory-native's `animate` prop
     * (e.g. `RadarChart.Radar`).
     */
    animation?: RadarChartRootAnimation;
};
/**
 * Props for {@link RadarChartGridProps} — the concentric grid drawn behind the radar.
 *
 * Renders `numTicks` rings (concentric polygons by default) plus one spoke per category.
 */
export type RadarChartGridProps = {
    /**
     * Number of concentric rings (excluding the center point). Matches the number of radius-axis
     * ticks rendered by {@link RadarChartRadiusAxisProps}.
     *
     * @default 5
     */
    numTicks?: number;
    /**
     * Stroke color for both the rings and the spokes. Defaults to the theme `muted` color at 30%
     * alpha so the grid stays subtle behind the radar fill.
     */
    strokeColor?: Color;
    /**
     * Stroke width for both the rings and the spokes.
     *
     * @default 1
     */
    strokeWidth?: number;
    /**
     * Shape of each concentric ring. See {@link RadarChartGridShape} for semantics.
     *
     * @default "polygon"
     */
    shape?: RadarChartGridShape;
    /**
     * Whether to render the radial spokes (one per category) in addition to the rings.
     *
     * @default true
     */
    showSpokes?: boolean;
};
/**
 * Props for {@link RadarChartAngleAxisProps} — Skia text labels rendered around the chart
 * perimeter (one per category, sourced from `data[i][labelKey]`).
 */
export type RadarChartAngleAxisProps = {
    /**
     * Skia font used to render the labels. Defaults to a platform-aware system font built with
     * `matchFont` so the component renders out of the box. Build a custom font with `useFont` from
     * `@shopify/react-native-skia` and pass it here to use a specific typeface.
     */
    font?: SkFont | null;
    /**
     * Text color for the labels.
     *
     * @default theme `muted`
     */
    color?: Color;
    /**
     * Fractional position of each label along the spoke (`1` = outer ring, values `> 1` push the
     * labels outside the ring). Useful to leave breathing room between the grid and the text.
     *
     * @default 1.05
     */
    radiusOffset?: number;
};
/**
 * Horizontal alignment of `RadarChart.RadiusAxis` tick labels **relative to the spoke** they
 * sit on. Mirrors Recharts' `PolarRadiusAxis.orientation`.
 *
 * - `"left"` — labels sit to the left of the spoke (text's right edge anchored at the spoke).
 * - `"middle"` — labels are centered on the spoke (text's center anchored at the spoke).
 * - `"right"` — labels sit to the right of the spoke (text's left edge anchored at the spoke).
 *   This is Recharts' default and reads most naturally when the spoke is the default
 *   `angle=0` (12 o'clock).
 */
export type RadarChartRadiusAxisOrientation = 'left' | 'middle' | 'right';
/**
 * Props for {@link RadarChartRadiusAxisProps} — numeric tick labels rendered along a single
 * radial spoke (one label per ring).
 *
 * Mirrors Recharts' `PolarRadiusAxis`: spoke direction is controlled by `angle`, and labels are
 * rotated alongside the spoke so they always read along its direction. Skip this component
 * entirely to render the chart without explicit value annotations.
 */
export type RadarChartRadiusAxisProps = {
    /**
     * Skia font used to render the tick values. Defaults to the same `matchFont` font as
     * {@link RadarChartAngleAxisProps}.
     */
    font?: SkFont | null;
    /**
     * Text color for the tick values.
     *
     * @default theme `muted`
     */
    color?: Color;
    /**
     * Number of tick values to render. Defaults to the grid's `numTicks` (5) so axis values line
     * up with the rings drawn by {@link RadarChartGridProps}.
     *
     * @default 5
     */
    numTicks?: number;
    /**
     * Numeric key used to derive the radial scale's upper bound when the root's `maxValue` is
     * not supplied. Defaults to the root's `dataKey`. Override to align axis ticks with a
     * specific {@link RadarChartRadarProps} sibling whose `dataKey` differs from the root —
     * otherwise axis labels will read against the root's data even though the polygon scales
     * to a different series.
     *
     * @remarks Auto-derived scales cannot satisfy every series in a multi-series radar — set
     * `maxValue` on the root for a shared, truthful axis across all polygons.
     */
    dataKey?: string;
    /**
     * Formatter applied to each tick value before rendering. Use to add unit suffixes (`"%"`,
     * `"k"`) or to round noisy fractional ticks.
     */
    tickFormatter?: (value: number) => string;
    /**
     * Angle of the entire radius axis (line, ticks, and labels) in **degrees, clockwise from
     * 12 o'clock** — same convention as `RadarChart.AngleAxis` and the underlying spoke layout.
     * Defaults to `0` so the axis sits on the top spoke (Recharts' default radial-axis angle is
     * also north, just expressed as `90` in their CCW-from-east convention).
     *
     * Labels are rotated alongside the axis so they always read along the spoke direction — at
     * `angle=90` (east) labels run top-to-bottom; at `angle=180` (south) labels are upside-down.
     *
     * @default 0
     */
    angle?: number;
    /**
     * Horizontal alignment of the tick labels relative to the spoke. See
     * {@link RadarChartRadiusAxisOrientation} for the three options.
     *
     * @default "right"
     */
    orientation?: RadarChartRadiusAxisOrientation;
    /**
     * Whether to render an additional `0` label at the chart center.
     *
     * Defaults to `false` because the center of a radar chart is typically reserved for an
     * overlay (centered headline number, icon, etc.) and "0" sits at a single point shared by
     * every spoke, which can read as visual noise. Set to `true` to match Recharts'
     * `PolarRadiusAxis` behaviour where the origin tick is always rendered.
     *
     * @default false
     */
    includeZero?: boolean;
};
/**
 * Reanimated animation config carried via the {@link RadarChartRadarProps.animate} prop.
 *
 * Mirrors victory-native's `PathAnimationConfig` shape — a discriminated union on `type`
 * (`"timing"` or `"spring"`). When supplied, the radar polygon's Skia `Path` interpolates
 * smoothly between frames as the underlying data changes.
 */
export type RadarChartRadarAnimateConfig = NonNullable<ComponentProps<typeof import('victory-native').Line>['animate']>;
/**
 * Props for {@link RadarChartRadarProps} — a single radar polygon series.
 *
 * Multiple `RadarChart.Radar` siblings can be rendered to compare several numeric fields on the
 * same set of categories; each sibling reads its own `dataKey` (or defaults to the root's
 * `dataKey`).
 */
export type RadarChartRadarProps = {
    /**
     * Numeric key on each row plotted by this series. Defaults to the root's `dataKey` so a chart
     * with a single series can omit this prop entirely.
     */
    dataKey?: string;
    /**
     * Stroke + fill color of the polygon. Strings are forwarded to Skia directly (hex, named, or
     * `rgba()`); fall back to the theme `chart-3` color when omitted.
     */
    color?: Color;
    /**
     * Alpha applied to the polygon fill (the stroke stays fully opaque).
     *
     * @default 0.3
     */
    fillOpacity?: number;
    /**
     * Whether to draw a stroked outline around the polygon.
     *
     * @default true
     */
    showStroke?: boolean;
    /**
     * Stroke width applied when `showStroke` is `true`.
     *
     * @default 2
     */
    strokeWidth?: number;
    /**
     * Whether to render a small filled circle at each polygon vertex (one per category).
     *
     * @default false
     */
    showDots?: boolean;
    /**
     * Radius of each vertex dot when `showDots` is `true`.
     *
     * @default 3
     */
    dotRadius?: number;
    /**
     * victory-native path-interpolation config applied when the underlying `data` (or `dataKey`)
     * changes. Dropped when cascaded `isAllAnimationsDisabled` is true.
     */
    animate?: RadarChartRadarAnimateConfig;
};
/**
 * Per-chart layout published by the `RadarChart` root and consumed by every Skia subcomponent.
 * The provider sits outside the Skia canvas; victory-native's internal `useContextBridge`
 * (from `its-fine`) tunnels it into the Skia reconciler.
 *
 * Internal to the radar-chart module — not re-exported from `index.ts`.
 */
export type RadarChartLayoutContextValue = {
    /** Raw category rows in render order. */
    data: ReadonlyArray<Record<string, unknown>>;
    /** Key on each row whose value is the category label rendered by `RadarChart.AngleAxis`. */
    labelKey: string;
    /** Default numeric key plotted by `RadarChart.Radar` when no per-series override is supplied. */
    dataKey: string;
    /**
     * Optional fixed upper bound of the radial scale. When `undefined`, each subcomponent
     * falls back to `getMaxValueForKey(data, dataKey)`.
     */
    maxValue: number | undefined;
    /** Measured canvas size in pixels (`{ width: 0, height: 0 }` before first layout). */
    canvasSize: {
        width: number;
        height: number;
    };
};
/**
 * Geometry derived from {@link RadarChartLayoutContextValue} — shared by every Skia
 * subcomponent so the math doesn't get repeated per part.
 *
 * Internal to the radar-chart module — not re-exported from `index.ts`.
 */
export type RadarChartLayout = {
    center: SkPoint;
    outerRadius: number;
    angles: number[];
    data: ReadonlyArray<Record<string, unknown>>;
    labelKey: string;
    dataKey: string;
    /**
     * Root-supplied `maxValue` override (verbatim from `RadarChartRootProps.maxValue`).
     * Subcomponents prefer it over the data-derived max when set.
     */
    maxValueOverride: number | undefined;
    hasLayout: boolean;
};
export {};
//# sourceMappingURL=radar-chart.types.d.ts.map