import type { Circle } from '@shopify/react-native-skia';
import type { ComponentProps } from 'react';
import type { SharedValue } from 'react-native-reanimated';
/**
 * Props for {@link ChartIndicator} — a themed Skia double-dot (outer halo + inner) at a
 * chart-press coordinate.
 *
 * Paired with victory-native's `useChartPressState` on any cartesian chart (`LineChart`,
 * `AreaChart`, `BarChart`, etc.): the caller passes `state.x.position` and
 * `state.y[yKey].position` as `x` / `y`. The indicator only draws the circles — the `isActive`
 * visibility gate (e.g. `{isActive && <ChartIndicator ... />}`) stays with the caller so the
 * same press state can drive multiple overlays independently.
 *
 * The outer circle uses {@link outerRadius} (default {@link INDICATOR_OUTER_RADIUS}) and
 * `outerColor`; the inner uses {@link innerRadius} (default {@link DEFAULT_INDICATOR_RADIUS})
 * and `innerColor`. Skia `Circle` props other than
 * `color`, `cx`, `cy`, `c`, and `r` are forwarded to the **inner** circle only.
 *
 * @example
 * ```tsx
 * const { state, isActive } = useChartPressState({ x: 0, y: { value: 0 } });
 *
 * <LineChart data={DATA} xKey="day" yKeys={["value"]} chartPressState={state}>
 *   {({ points }) => (
 *     <>
 *       <LineChart.Line points={points.value} />
 *       {isActive ? (
 *         <ChartIndicator x={state.x.position} y={state.y.value.position} />
 *       ) : null}
 *     </>
 *   )}
 * </LineChart>
 * ```
 */
export type ChartIndicatorProps = Omit<ComponentProps<typeof Circle>, 'cx' | 'cy' | 'c' | 'r' | 'color'> & {
    /**
     * Horizontal position of the indicator center, typically `state.x.position` from
     * `useChartPressState`.
     */
    x: SharedValue<number>;
    /**
     * Vertical position of the indicator center, typically `state.y[yKey].position` from
     * `useChartPressState`.
     */
    y: SharedValue<number>;
    /**
     * Radius of the inner (front) circle in logical pixels.
     *
     * @default {@link DEFAULT_INDICATOR_RADIUS}
     */
    innerRadius?: number;
    /**
     * Radius of the outer (halo) circle in logical pixels.
     *
     * @default {@link INDICATOR_OUTER_RADIUS}
     */
    outerRadius?: number;
    /**
     * Fill color for the outer circle (radius `outerRadius`, default {@link INDICATOR_OUTER_RADIUS}).
     * Defaults to the `--color-background` CSS variable (Uniwind `bg-background`).
     */
    outerColor?: ComponentProps<typeof Circle>['color'];
    /**
     * Fill color for the inner (front) circle. Defaults to the `--color-chart-3` CSS variable.
     */
    innerColor?: ComponentProps<typeof Circle>['color'];
};
//# sourceMappingURL=chart-indicator.types.d.ts.map