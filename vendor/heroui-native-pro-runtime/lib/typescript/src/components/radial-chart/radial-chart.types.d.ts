import type { Color, SkPoint } from '@shopify/react-native-skia';
import type { ComponentProps, ReactNode } from 'react';
import type { BasePolarChartColorFields, BasePolarChartInputFields, BasePolarChartNumericalFields, BasePolarChartProps } from '../../helpers/internal/components';
import type { AnimationRoot } from '../../helpers/internal/types';
/**
 * Keys whose values are valid `labelKey` field types (`number` or `string`).
 * Aliased to {@link BasePolarChartInputFields} so generics stay in sync with `PolarChart`.
 */
export type RadialChartInputFields<T> = BasePolarChartInputFields<T>;
/**
 * Keys whose values are numeric (or nullable) `valueKey` fields.
 * Aliased to {@link BasePolarChartNumericalFields}.
 */
export type RadialChartNumericalFields<T> = BasePolarChartNumericalFields<T>;
/**
 * Keys whose values are Skia `Color` fields — used by `colorKey` to look up each ring fill.
 * Aliased to {@link BasePolarChartColorFields}.
 */
export type RadialChartColorFields<T> = BasePolarChartColorFields<T>;
/**
 * Serializable data row type for radial series.
 */
export type RadialChartDatum = Record<string, unknown>;
/**
 * Gap between adjacent concentric rings — a pixel value or `"auto"` to distribute bands
 * evenly across the `[innerRadius, outerRadius]` annulus.
 */
export type RadialChartBarGapValue = number | 'auto';
/**
 * Radius value accepted on the root — a pixel number or a percentage string relative to the
 * chart's computed maximum radius.
 */
export type RadialChartRadiusValue = number | `${number}%`;
/**
 * A single bound of the angle-axis domain — a fixed number or `"auto"` to derive from data.
 */
export type RadialChartDomainBound = number | 'auto';
/**
 * Animation configuration for the `RadialChart` root.
 *
 * Owns no animated styles — passing `"disable-all"` cascades `isAllAnimationsDisabled` to
 * {@link RadialChartBarProps.animate} on {@link RadialChart.Bar}.
 */
export type RadialChartRootAnimation = AnimationRoot;
/**
 * Reanimated animation config carried via {@link RadialChartBarProps.animate}.
 *
 * Mirrors victory-native's `PathAnimationConfig` shape — a discriminated union on `type`
 * (`"timing"` or `"spring"`).
 */
export type RadialChartBarAnimateConfig = NonNullable<ComponentProps<typeof import('victory-native').Line>['animate']>;
/**
 * Internal sector descriptor produced by {@link computeRadialBarSectors} for the radial layout.
 */
export type RadialBarSector = {
    index: number;
    value: number;
    innerRadius: number;
    outerRadius: number;
    /** Degrees clockwise from 12 o'clock. */
    startAngle: number;
    /** Degrees clockwise from 12 o'clock. */
    endAngle: number;
    background: {
        innerRadius: number;
        outerRadius: number;
        startAngle: number;
        endAngle: number;
    };
};
/**
 * Props for the `RadialChart` root wrapper.
 *
 * Extends {@link BasePolarChartProps} so `data`, `labelKey`, `valueKey`, and `colorKey` stay
 * aligned with victory-native's `PolarChart`. Radial-specific geometry props (`domain`,
 * angles, radii, bar sizing) live on the root and are **not** forwarded to `BasePolarChart`.
 *
 * @example
 * ```tsx
 * <RadialChart
 *   data={DATA}
 *   labelKey="name"
 *   valueKey="value"
 *   colorKey="color"
 *   wrapperClassName="w-[200px]"
 * >
 *   <RadialChart.Bar />
 * </RadialChart>
 * ```
 */
export type RadialChartRootProps<RawData extends Record<string, unknown>, LabelKey extends Extract<keyof RadialChartInputFields<RawData>, string>, ValueKey extends Extract<keyof RadialChartNumericalFields<RawData>, string>, ColorKey extends Extract<keyof RadialChartColorFields<RawData>, string>> = Omit<BasePolarChartProps<RawData, LabelKey, ValueKey, ColorKey>, 'children'> & {
    /**
     * Compound subcomponents rendered inside the chart canvas. Typically
     * {@link RadialChart.Bar}.
     */
    children: ReactNode;
    /**
     * Angle-axis domain. `"auto"` bounds resolve from the data.
     *
     * @default [0, "auto"] — upper bound resolves to the maximum `valueKey` in `data`.
     */
    domain?: [RadialChartDomainBound, RadialChartDomainBound];
    /**
     * Start angle in degrees (clockwise from 12 o'clock).
     *
     * @default 90
     */
    startAngle?: number;
    /**
     * End angle in degrees (clockwise from 12 o'clock). Together with `startAngle`, defines the
     * total angular domain each ring can sweep across.
     *
     * @default -270
     */
    endAngle?: number;
    /**
     * Inner bound of the bar area — pixel number or percentage of the chart radius.
     *
     * @default "40%"
     */
    innerRadius?: RadialChartRadiusValue;
    /**
     * Outer bound of the bar area — pixel number or percentage of the chart radius.
     *
     * @default "100%"
     */
    outerRadius?: RadialChartRadiusValue;
    /**
     * Default bar thickness in pixels applied when {@link RadialChart.Bar} omits `barSize`.
     *
     * @default 10
     */
    barSize?: number;
    /**
     * Gap between adjacent concentric rings in pixels, or `"auto"` to distribute bands evenly
     * from `innerRadius` to `outerRadius`.
     *
     * @default 4
     */
    barGap?: RadialChartBarGapValue;
    /**
     * Additional Tailwind classes for the outer `View`. Constrains chart sizing on top of the
     * default `w-full aspect-square` (e.g. `w-[200px]`).
     */
    wrapperClassName?: string;
    /**
     * Animation configuration for the chart root. Cascades `"disable-all"` to
     * {@link RadialChart.Bar}.
     */
    animation?: RadialChartRootAnimation;
};
/**
 * Props for {@link RadialChart.Bar} — renders all concentric rounded arc rings.
 */
export type RadialChartBarProps = {
    /**
     * When `true`, draws a full-domain background track behind each ring using `trackColor`
     * (or the theme `default` token).
     *
     * @default true
     */
    background?: boolean;
    /**
     * Bar thickness in pixels. Overrides the root's `barSize` when supplied.
     */
    barSize?: number;
    /**
     * Corner radius for rounded bar caps. Values `> 0` enable round stroke caps; `0` uses
     * butt caps.
     *
     * @default 12
     */
    cornerRadius?: number;
    /**
     * Stroke color for background tracks. Defaults to the theme `default` color when
     * `background` is enabled.
     */
    trackColor?: Color;
    /**
     * victory-native / Reanimated animation config for ring sweep fills. Dropped when the
     * root cascade sets `animation="disable-all"`.
     */
    animate?: RadialChartBarAnimateConfig;
};
/**
 * Layout context published by the `RadialChart` root and consumed by {@link RadialChart.Bar}.
 * Internal to the radial-chart module — not re-exported from `index.ts`.
 */
export type RadialChartLayoutContextValue = {
    /** Raw data rows in render order (index `0` = innermost ring). */
    data: ReadonlyArray<Record<string, unknown>>;
    labelKey: string;
    valueKey: string;
    colorKey: string;
    domain: [RadialChartDomainBound, RadialChartDomainBound];
    startAngle: number;
    endAngle: number;
    innerRadius: RadialChartRadiusValue;
    outerRadius: RadialChartRadiusValue;
    barSize: number;
    barGap: RadialChartBarGapValue;
    canvasSize: {
        width: number;
        height: number;
    };
};
/**
 * Geometry derived from {@link RadialChartLayoutContextValue}.
 * Internal to the radial-chart module — not re-exported from `index.ts`.
 */
export type RadialChartLayout = {
    center: SkPoint;
    maxRadius: number;
    innerRadiusPx: number;
    outerRadiusPx: number;
    resolvedDomain: [number, number];
    rootStartAngle: number;
    rootEndAngle: number;
    data: ReadonlyArray<Record<string, unknown>>;
    labelKey: string;
    valueKey: string;
    colorKey: string;
    barSize: number;
    barGap: RadialChartBarGapValue;
    hasLayout: boolean;
};
//# sourceMappingURL=radial-chart.types.d.ts.map