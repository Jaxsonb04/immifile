import type { Path } from '@shopify/react-native-skia';
import type { ComponentProps } from 'react';
import type { WithSpringConfig, WithTimingConfig } from 'react-native-reanimated';
import type { ApplyUniwind } from 'uniwind';
import type { CartesianChart, CurveType, PointsArray } from 'victory-native';
import type { Animation, AnimationRoot } from '../../helpers/internal/types';
type CartesianLineComponent = typeof import('victory-native').Line;
/**
 * Mirror of victory-native's internal `InputFieldType` — the set of value types valid as
 * `xKey` axis values (string categories or numeric positions). Re-declared locally because the
 * upstream alias is not re-exported from the package.
 */
type InputFieldType = number | string;
/**
 * Mirror of victory-native's internal `MaybeNumber` — the value type each `yKeys` field may
 * hold, permitting `null` / `undefined` gaps when the line should break at missing samples
 * (`connectMissingData` off).
 */
type MaybeNumber = number | null | undefined;
/**
 * Keys whose values are valid X-axis field types (`number` or `string`).
 * Mirrors victory-native `InputFields` (not re-exported from the package).
 */
export type LineChartInputFields<T> = {
    [K in keyof T as T[K] extends InputFieldType ? K : never]: T[K] extends InputFieldType ? T[K] : never;
};
/**
 * Keys whose values are numeric (or nullable) Y-axis fields.
 * Mirrors victory-native `NumericalFields` (not re-exported from the package).
 */
export type LineChartNumericalFields<T> = {
    [K in keyof T as T[K] extends MaybeNumber ? K : never]: T[K];
};
/**
 * Serializable data row type for chart series — mirrors victory-native's expectation that each
 * point is a record with known keys for `xKey` and each `yKeys` entry.
 */
export type LineChartDatum = Record<string, unknown>;
/**
 * Props for the `LineChart` root wrapper.
 *
 * Generic parameters mirror `CartesianChart` so `xKey`, `yKeys`, and `points` stay correctly typed
 * in the render callback. Adds `wrapperClassName` for the outer React Native `View`.
 *
 * **Ref as prop**: `CartesianChart` accepts `ref` as a regular prop (React 19). The root forwards
 * that `ref` to the underlying chart so callers can access the Skia canvas and press actions handle.
 *
 * @example
 * ```tsx
 * <LineChart
 *   data={DATA}
 *   xKey="day"
 *   yKeys={["highTmp"]}
 *   wrapperClassName="h-72 w-full bg-surface"
 * >
 *   {({ points }) => (
 *     <LineChart.Line points={points.highTmp} colorClassName="accent-chart-1" />
 *   )}
 * </LineChart>
 * ```
 */
export type LineChartRootProps<RawData extends Record<string, unknown>, XK extends keyof LineChartInputFields<RawData>, YK extends keyof LineChartNumericalFields<RawData>> = Parameters<typeof CartesianChart<RawData, XK, YK>>[0] & {
    /**
     * Additional Tailwind classes for the outer `View` that wraps `CartesianChart`.
     */
    wrapperClassName?: string;
    /**
     * Animation configuration for the chart root.
     *
     * The root does not currently animate any of its own styles, but accepting an `AnimationRoot`
     * here lets callers cascade `"disable-all"` through `AnimationSettingsProvider` to compound
     * parts that do animate (e.g. `LineChart.AnimatedLine`). Pass `"disable-all"` to force every
     * animated descendant to skip its animation; pass `false` / `"disabled"` to only disable the
     * root itself; or omit the prop entirely for default behavior.
     */
    animation?: LineChartRootAnimation;
};
/**
 * Animation configuration for the `LineChart` root.
 *
 * Currently exposes no custom config — the root is a passthrough whose sole animation-related
 * responsibility is cascading `isAllAnimationsDisabled` (via `"disable-all"`) to compound parts.
 * Follows the `AnimationRoot` convention so global + parent + own disable-all states can be
 * combined through `useCombinedAnimationDisabledState`.
 */
export type LineChartRootAnimation = AnimationRoot;
/**
 * Props for the themed line path rendered inside `CartesianChart`'s children render function.
 *
 * Built from `victory-native` `Line` wrapped with `withUniwind(Line)`. Uniwind adds a `colorClassName`
 * prop mapped to the Skia `color` prop automatically (`ApplyUniwind`).
 *
 * @example
 * ```tsx
 * <LineChart.Line points={points.sales} colorClassName="accent-chart-1" strokeWidth={3} />
 * ```
 */
export type LineChartLineProps = ApplyUniwind<ComponentProps<CartesianLineComponent>>;
/**
 * Reanimated animation config for {@link LineChart.AnimatedLine}'s draw-on animation.
 *
 * Discriminated on the `type` property:
 * - `type: 'timing'` exposes `WithTimingConfig` fields (`duration`, `easing`, ...) for a
 *   deterministic duration-based sweep.
 * - `type: 'spring'` exposes `WithSpringConfig` fields (`damping`, `stiffness`, `mass`, ...)
 *   for a physically-based, bouncy reveal.
 *
 * Both branches accept a `progress?: [from, to]` tuple that sets the sweep range bound to the
 * underlying Skia `Path`'s `end` trim (default `[0, 1]`, meaning the path draws from empty to
 * fully rendered). Ranges like `[0.2, 1]` are useful when composing with a separate fade-in on
 * the same line, and `[1, 0]` inverts the sweep to produce a fade-out.
 *
 * `decay` is intentionally excluded — a velocity-based decay animation has no natural stopping
 * point at `to` and therefore doesn't compose cleanly with a bounded sweep.
 *
 * Wrapped by the generic `Animation<>` helper so callers can also pass:
 * - `true` / `undefined` — default animation
 * - `false` / `"disabled"` — skip animation; jump straight to `progress[1]`
 * - `{ state: 'disabled', ... }` — disable animation while still customizing other fields
 *
 * @example
 * ```tsx
 * // Slow eased sweep
 * <LineChart.AnimatedLine
 *   animation={{ type: 'timing', duration: 1200, easing: Easing.out(Easing.cubic) }}
 *   points={points.value}
 * />
 *
 * // Spring reveal with custom range
 * <LineChart.AnimatedLine
 *   animation={{ type: 'spring', damping: 18, stiffness: 120, progress: [0.1, 1] }}
 *   points={points.value}
 * />
 * ```
 */
export type LineChartAnimatedLineAnimationConfig = ({
    type: 'timing';
    /**
     * Range `[from, to]` for the Skia `Path.end` sweep. Defaults to `[0, 1]`.
     */
    progress?: [number, number];
} & WithTimingConfig) | ({
    type: 'spring';
    /**
     * Range `[from, to]` for the Skia `Path.end` sweep. Defaults to `[0, 1]`.
     */
    progress?: [number, number];
} & WithSpringConfig);
export type LineChartAnimatedLineAnimation = Animation<LineChartAnimatedLineAnimationConfig>;
/**
 * Props for {@link LineChart.AnimatedLine} — a draw-on line that can be re-played via `resetKey`.
 *
 * Unlike {@link LineChart.Line} (whose `animate` prop drives victory-native's
 * `useAnimatedPath`-based path interpolation when `points` change), `AnimatedLine` animates a
 * shared-value `progress` 0 → 1 that is bound to the underlying Skia `Path`'s `end` trim,
 * producing a classic stroke-drawing reveal. Replays on mount and whenever `resetKey` changes
 * identity.
 *
 * Extends the Skia `Path` component's props (`SkiaDefaultProps<PathProps, "start" | "end">`),
 * so `color`, `strokeWidth`, `opacity`, `blendMode`, `strokeJoin`, `strokeCap`, `antiAlias`,
 * `stroke`, `fillType`, and the rest of the Skia paint surface can be passed directly. The four
 * props the component controls internally — `path`, `style`, `start`, `end` — are excluded so
 * callers cannot override the path geometry, the stroke/fill mode, or the animated trim range.
 */
export type LineChartAnimatedLineProps = Omit<ComponentProps<typeof Path>, 'path' | 'style' | 'start' | 'end'> & {
    /**
     * Points for a single series, sourced from `CartesianChart`'s render callback
     * (e.g. `points.value`).
     */
    points: PointsArray;
    /**
     * d3-shape curve factory name. Defaults to victory-native's `linear` when omitted.
     */
    curveType?: CurveType;
    /**
     * Whether to visually connect across `null` / missing Y values rather than breaking the path
     * into disjoint segments.
     */
    connectMissingData?: boolean;
    /**
     * Reanimated config for the draw-on animation. Defaults to a 700ms timing sweep. Captured via a
     * ref internally so inline objects passed on every render do not inadvertently re-trigger the
     * animation — only `resetKey` does.
     */
    animation?: LineChartAnimatedLineAnimation;
    /**
     * Opaque value whose identity change triggers a replay of the draw-on animation. Treat this
     * like a React `key`: any fresh primitive (counter, timestamp, string) will re-play. Leave
     * undefined / stable to play only once on mount.
     */
    resetKey?: number | string | boolean | null;
};
export {};
//# sourceMappingURL=line-chart.types.d.ts.map