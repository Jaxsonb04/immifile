# ComposedChart

A composed chart that combines Bar, Line, and Area series in a single cartesian chart for multi-metric dashboards.

> `ComposedChart` is built on top of [victory-native](https://nearform.com/open-source/victory-native/docs/), wrapping its `CartesianChart` with HeroUI Native theming and animation cascading. Its series parts reuse the themed Skia implementations from `BarChart`, `LineChart`, and `AreaChart`. For full context on chart props, gestures, scales, and rendering internals, read the [victory-native docs](https://nearform.com/open-source/victory-native/docs/) alongside this page.

## Import

```tsx
import { ComposedChart } from 'heroui-native-pro';
```

## Anatomy

```tsx
<ComposedChart data={...} xKey="..." yKeys={[...]}>
  {({ points, chartBounds }) => (
    <>
      <ComposedChart.Bar points={...} chartBounds={chartBounds} />
      <ComposedChart.BarGroup chartBounds={chartBounds}>
        <ComposedChart.BarGroupItem points={...} />
      </ComposedChart.BarGroup>
      <ComposedChart.StackedBar points={[...]} chartBounds={chartBounds} />
      <ComposedChart.Line points={...} />
      <ComposedChart.AnimatedLine points={...} />
      <ComposedChart.Area points={...} y0={chartBounds.bottom} />
      <ComposedChart.StackedArea points={[...]} y0={chartBounds.bottom} />
      <ComposedChart.AreaRange upperPoints={...} lowerPoints={...} />
    </>
  )}
</ComposedChart>
```

- **ComposedChart**: Root container that wraps `victory-native` `CartesianChart` in a themed outer `View`. Applies a bar-friendly default `domainPadding` and accepts an `animation` prop for cascading `"disable-all"` to animated compound parts through `AnimationSettingsProvider`. Forwards `ref` to the underlying chart.
- **ComposedChart.Bar**: Themed Skia bar series for a single `yKey` (from `BarChart.Bar`). Fill is driven by `colorClassName`; defaults `roundedCorners` to small top radii.
- **ComposedChart.BarGroup**: Clustered (side-by-side) bars for multiple series per category (from `BarChart.BarGroup`). Reads child `ComposedChart.BarGroupItem` props to compute per-series paths.
- **ComposedChart.BarGroupItem**: One series inside a `ComposedChart.BarGroup` (from `BarChart.BarGroupItem`). Same `colorClassName` and `animate` cascade as `ComposedChart.Bar`.
- **ComposedChart.StackedBar**: Stacked columns built from an ordered array of `PointsArray` entries (from `BarChart.StackedBar`). Index `0` is the bottom of the stack.
- **ComposedChart.Line**: Themed Skia line series (from `LineChart.Line`). Stroke color is driven by `colorClassName`.
- **ComposedChart.AnimatedLine**: Replayable draw-on line with a `resetKey` trigger (from `LineChart.AnimatedLine`).
- **ComposedChart.Area**: Themed Skia area series (from `AreaChart.Area`). Fill color is driven by `colorClassName`.
- **ComposedChart.StackedArea**: Stacked area layers from an ordered `points` array (from `AreaChart.StackedArea`).
- **ComposedChart.AreaRange**: Shaded band between an upper and a lower series (from `AreaChart.AreaRange`).

## Usage

### Bar and line on dual Y-axes

Assign each metric to a `yAxis` entry via `yKeys`, and set `axisSide: 'right'` plus a per-axis `domain` on the secondary axis when scales differ.

```tsx
<ComposedChart
  data={DATA}
  xKey="month"
  yKeys={['revenue', 'orders']}
  yAxis={[
    { yKeys: ['revenue'], formatYLabel: (v) => `$${(v / 1000).toFixed(0)}k` },
    { yKeys: ['orders'], axisSide: 'right' },
  ]}
  wrapperClassName="h-52"
>
  {({ points, chartBounds }) => (
    <>
      <ComposedChart.Bar
        points={points.revenue}
        chartBounds={chartBounds}
        colorClassName="accent-chart-3"
        barWidth={16}
      />
      <ComposedChart.Line
        points={points.orders}
        colorClassName="accent-chart-1"
        curveType="monotoneX"
      />
    </>
  )}
</ComposedChart>
```

### Stacked bar with overlaid line

Stack multiple bar series with `ComposedChart.StackedBar` and overlay a line on a separate right axis. Give each axis its own `domain` so the stacks and the line read on their own scales.

```tsx
<ComposedChart
  data={DATA}
  xKey="day"
  yKeys={['ide', 'cli', 'cloudAgent', 'other', 'aiPct']}
  yAxis={[
    {
      yKeys: ['ide', 'cli', 'cloudAgent', 'other'],
      domain: [0, maxStackTotal],
    },
    { yKeys: ['aiPct'], axisSide: 'right', domain: [0, 100] },
  ]}
  wrapperClassName="h-64"
>
  {({ points, chartBounds }) => (
    <>
      <ComposedChart.StackedBar
        chartBounds={chartBounds}
        points={[points.ide, points.cli, points.cloudAgent, points.other]}
        colors={stackedColors}
        barWidth={28}
      />
      <ComposedChart.Line points={points.aiPct} curveType="monotoneX" />
    </>
  )}
</ComposedChart>
```

### Area with a dashed reference line

Fill an area to the baseline with `y0={chartBounds.bottom}` and draw a comparison line on top. Nest a Skia `LinearGradient` inside `ComposedChart.Area` for a gradient fill and a `DashPathEffect` inside `ComposedChart.Line` for a dashed stroke.

```tsx
<ComposedChart
  data={DATA}
  xKey="month"
  yKeys={['sessions', 'target']}
  wrapperClassName="h-52"
>
  {({ points, chartBounds }) => (
    <>
      <ComposedChart.Area
        points={points.sessions}
        y0={chartBounds.bottom}
        curveType="monotoneX"
      >
        <LinearGradient
          colors={[topColor, bottomColor]}
          start={vec(0, chartBounds.top)}
          end={vec(0, chartBounds.bottom)}
        />
      </ComposedChart.Area>
      <ComposedChart.Line
        points={points.target}
        colorClassName="accent-chart-1"
        curveType="monotoneX"
      >
        <DashPathEffect intervals={[6, 3]} />
      </ComposedChart.Line>
    </>
  )}
</ComposedChart>
```

### Press interaction

Wire `chartPressState` from `useChartPressState` on the root, then render `ChartCrosshair` and `ChartIndicator` inside the render callback. Wrap the chart and the `ChartCrosshair.Value` overlay in `ChartCrosshair.Anchor`.

```tsx
<ChartCrosshair.Anchor
  chartBounds={chartBounds}
  isActive={state.isActive}
  x={state.x.position}
>
  <ComposedChart
    data={DATA}
    xKey="month"
    yKeys={['revenue', 'orders']}
    chartPressState={state}
    onChartBoundsChange={setChartBounds}
    wrapperClassName="h-52"
  >
    {({ points, chartBounds: bounds }) => (
      <>
        <ComposedChart.Bar points={points.revenue} chartBounds={bounds} />
        <ComposedChart.Line points={points.orders} />
        {isActive ? (
          <>
            <ChartCrosshair
              x={state.x.position}
              top={bounds.top}
              bottom={bounds.bottom}
            />
            <ChartIndicator x={state.x.position} y={state.y.orders.position} />
          </>
        ) : null}
      </>
    )}
  </ComposedChart>
  <ChartCrosshair.Value value={tooltipLabel} />
</ChartCrosshair.Anchor>
```

## Example

```tsx
import { Card } from 'heroui-native';
import { ComposedChart } from 'heroui-native-pro';
import { View } from 'react-native';

const REVENUE_ORDERS_DATA = [
  { month: 'Jan', orders: 320, revenue: 4200 },
  { month: 'Feb', orders: 450, revenue: 5800 },
  { month: 'Mar', orders: 380, revenue: 4900 },
  { month: 'Apr', orders: 520, revenue: 7200 },
  { month: 'May', orders: 480, revenue: 6100 },
  { month: 'Jun', orders: 600, revenue: 8400 },
];

const categoryAxisTickValues = (count: number): number[] =>
  Array.from({ length: count }, (_, index) => index);

export default function RevenueOrdersChart() {
  return (
    <View className="flex-1 w-full px-5 justify-center">
      <Card>
        <Card.Header className="mb-3">
          <Card.Title className="text-sm">Revenue & Orders</Card.Title>
        </Card.Header>
        <Card.Body>
          <ComposedChart
            data={REVENUE_ORDERS_DATA}
            xKey="month"
            yKeys={['revenue', 'orders']}
            xAxis={{
              tickValues: categoryAxisTickValues(REVENUE_ORDERS_DATA.length),
            }}
            yAxis={[
              {
                yKeys: ['revenue'],
                formatYLabel: (value: number) =>
                  `$${(value / 1000).toFixed(0)}k`,
              },
              { yKeys: ['orders'], axisSide: 'right' },
            ]}
            wrapperClassName="h-[220px]"
          >
            {({ points, chartBounds }) => (
              <>
                <ComposedChart.Bar
                  points={points.revenue}
                  chartBounds={chartBounds}
                  colorClassName="accent-chart-3"
                  barWidth={16}
                  roundedCorners={{ topLeft: 4, topRight: 4 }}
                />
                <ComposedChart.Line
                  points={points.orders}
                  colorClassName="accent-chart-1"
                  curveType="monotoneX"
                  strokeWidth={2}
                />
              </>
            )}
          </ComposedChart>
        </Card.Body>
      </Card>
    </View>
  );
}
```

## API Reference

### ComposedChart

| prop               | type                         | default                                      | description                                                                                                                      |
| ------------------ | ---------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `wrapperClassName` | `string`                     | -                                            | Additional Tailwind classes for the outer `View` that wraps the chart. Required for chart height (e.g. `h-52`)                   |
| `domainPadding`    | `SidedNumber`                | `{ top: 8, bottom: 8, left: 12, right: 12 }` | Padding (in pixels) added inside the chart bounds. A caller-supplied value replaces the default object in full                   |
| `animation`        | `ComposedChartRootAnimation` | -                                            | Animation configuration for the chart root. Accepts `"disable-all"` to cascade animation skipping to all animated compound parts |

Extends [victory-native `CartesianChart`](https://nearform.com/open-source/victory-native/docs/cartesian/cartesian-chart) — all `CartesianChart` props (`data`, `xKey`, `yKeys`, `children`, `xAxis`, `yAxis`, `domain`, `chartPressState`, `axisOptions`, `ref`, etc.) are supported in addition to the ComposedChart-specific props above. Per-axis `yKeys` and `domain` on `yAxis` entries drive independent dual-axis scaling.

#### ComposedChartRootAnimation

Animation configuration for the root component. Can be:

- `false` or `"disabled"`: Disable only root animations
- `"disable-all"`: Disable all animations including animated compound parts
- `true` or `undefined`: Use default animations
- `object`: Custom animation configuration with a `state` field for the same disabling semantics

The root does not drive any of its own animated styles; its sole animation responsibility is cascading `isAllAnimationsDisabled` to compound parts that do animate.

### ComposedChart.Bar

| prop             | type                  | default                       | description                                                                                                                    |
| ---------------- | --------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `colorClassName` | `string`              | `'accent-chart-3'`            | Uniwind `accent-*` class for the bar fill. Resolves to the Skia `color` prop; pass `color` directly to bypass Uniwind          |
| `roundedCorners` | `RoundedCorners`      | `{ topLeft: 4, topRight: 4 }` | Per-corner radii for the bar path                                                                                              |
| `animate`        | `PathAnimationConfig` | -                             | victory-native path-interpolation config applied when `points` change. Dropped when cascaded `isAllAnimationsDisabled` is true |
| `className`      | `string`              | -                             | Uniwind class forwarded to the underlying Skia `Bar`                                                                           |

Reuses `BarChart.Bar`. Extends [victory-native `Bar`](https://nearform.com/open-source/victory-native/docs/cartesian/bar/) — refer to the upstream docs for `points`, `chartBounds`, `barWidth`, `innerPadding`, and Skia paint props.

### ComposedChart.BarGroup

| prop                  | type        | default | description                                                       |
| --------------------- | ----------- | ------- | ----------------------------------------------------------------- |
| `children`            | `ReactNode` | -       | One or more `ComposedChart.BarGroupItem` children, one per series |
| `betweenGroupPadding` | `number`    | `0.25`  | Fractional padding between adjacent groups (`0`–`1`)              |
| `withinGroupPadding`  | `number`    | `0.25`  | Fractional padding between bars inside a group (`0`–`1`)          |

Reuses `BarChart.BarGroup`. Mirrors the layout contract of [victory-native `BarGroup`](https://nearform.com/open-source/victory-native/docs/cartesian/bar/bar-group) using `useBarGroupPaths` under the hood. Refer to the upstream docs for `chartBounds`, `barWidth`, `barCount`, `roundedCorners`, and `onBarSizeChange`.

### ComposedChart.BarGroupItem

| prop             | type                  | default            | description                                                                                                                    |
| ---------------- | --------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `colorClassName` | `string`              | `'accent-chart-3'` | Uniwind `accent-*` class for the bar fill. Resolves to the Skia `color` prop; pass `color` directly to bypass Uniwind          |
| `animate`        | `PathAnimationConfig` | -                  | victory-native path-interpolation config applied when `points` change. Dropped when cascaded `isAllAnimationsDisabled` is true |
| `className`      | `string`              | -                  | Uniwind class forwarded to the underlying Skia `Bar`                                                                           |

Reuses `BarChart.BarGroupItem`. The `chartBounds`, `barWidth`, and `roundedCorners` props are computed by the parent `ComposedChart.BarGroup` and should not be supplied directly on the item.

### ComposedChart.StackedBar

| prop      | type                  | default | description                                                                                                                    |
| --------- | --------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `animate` | `PathAnimationConfig` | -       | victory-native path-interpolation config applied when `points` change. Dropped when cascaded `isAllAnimationsDisabled` is true |

Reuses `BarChart.StackedBar`. Extends [victory-native `StackedBar`](https://nearform.com/open-source/victory-native/docs/cartesian/bar/stacked-bar) — refer to the upstream docs for `points`, `chartBounds`, `colors`, `barWidth`, `innerPadding`, and `barOptions`. For correct stacking, set a `domain` on the owning `yAxis` entry when auto-domain is insufficient.

### ComposedChart.Line

| prop             | type                  | default            | description                                                                                                                    |
| ---------------- | --------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `colorClassName` | `string`              | `'accent-chart-3'` | Uniwind `accent-*` class for the stroke color                                                                                  |
| `strokeWidth`    | `number`              | `2`                | Stroke width in logical pixels                                                                                                 |
| `animate`        | `PathAnimationConfig` | -                  | victory-native path-interpolation config applied when `points` change. Dropped when cascaded `isAllAnimationsDisabled` is true |
| `className`      | `string`              | -                  | Uniwind class forwarded to the underlying Skia `Line`                                                                          |

Reuses `LineChart.Line`. Extends [victory-native `Line`](https://nearform.com/open-source/victory-native/docs/cartesian/line/) — `points`, `curveType`, `connectMissingData`, `children`, and all Skia paint props flow through. Pass `color` directly to bypass Uniwind and supply a raw Skia color.

### ComposedChart.AnimatedLine

| prop                 | type                                                                       | default                             | description                                                                                                                  |
| -------------------- | -------------------------------------------------------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `points`             | `PointsArray`                                                              | -                                   | Points for a single series, sourced from `CartesianChart`'s render callback                                                  |
| `curveType`          | `CurveType`                                                                | `'linear'`                          | d3-shape curve factory name                                                                                                  |
| `connectMissingData` | `boolean`                                                                  | `false`                             | Whether to visually connect across `null` / missing y values                                                                 |
| `color`              | `Color`                                                                    | theme `chart-3`                     | Skia stroke color. Falls back to the `--color-chart-3` CSS variable when omitted                                             |
| `strokeWidth`        | `number`                                                                   | `2`                                 | Stroke width in logical pixels                                                                                               |
| `animation`          | `LineChartAnimatedLineAnimation`                                           | `{ type: 'timing', duration: 700 }` | Reanimated config for the draw-on animation. Captured via a ref so inline objects on every render do not re-trigger replay   |
| `resetKey`           | `number \| string \| boolean \| null`                                      | -                                   | Opaque identity value that re-triggers the draw-on animation when changed. Behaves like a React `key` for the animation only |
| `...SkiaPathProps`   | `Omit<ComponentProps<typeof Path>, 'path' \| 'style' \| 'start' \| 'end'>` | -                                   | Remaining Skia `Path` props. `path`, `style`, `start`, and `end` are controlled internally                                   |

Reuses `LineChart.AnimatedLine`.

### ComposedChart.Area

| prop             | type                  | default            | description                                                                                    |
| ---------------- | --------------------- | ------------------ | ---------------------------------------------------------------------------------------------- |
| `colorClassName` | `string`              | `'accent-chart-3'` | Uniwind accent class for the fill                                                              |
| `opacity`        | `number`              | `0.2`              | Default fill opacity                                                                           |
| `animate`        | `PathAnimationConfig` | -                  | Path interpolation when points change; dropped when cascaded `isAllAnimationsDisabled` is true |

Reuses `AreaChart.Area`. Extends [victory-native `Area`](https://nearform.com/open-source/victory-native/docs/cartesian/area/) — `points`, `y0`, `curveType`, `connectMissingData`, `children`, and Skia paint props flow through.

### ComposedChart.StackedArea

Reuses `AreaChart.StackedArea`. Extends [victory-native `StackedArea`](https://nearform.com/open-source/victory-native/docs/cartesian/area/stacked-area/). `animate` is dropped when cascaded `isAllAnimationsDisabled` is true.

### ComposedChart.AreaRange

Reuses `AreaChart.AreaRange`. Extends [victory-native `AreaRange`](https://nearform.com/open-source/victory-native/docs/cartesian/area/area-range/). `animate` respects the same cascade.
