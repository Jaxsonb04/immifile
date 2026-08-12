# BarChart

A bar chart for visualizing categorical data with single, grouped, and stacked column layouts.

> `BarChart` is built on top of [victory-native](https://nearform.com/open-source/victory-native/docs/), wrapping its `CartesianChart`, `Bar`, `BarGroup`, and `StackedBar` primitives with HeroUI Native theming and animation cascading. For full context on chart props, gestures, scales, and rendering internals, read the [victory-native docs](https://nearform.com/open-source/victory-native/docs/) alongside this page.

## Import

```tsx
import { BarChart } from 'heroui-native-pro';
```

## Anatomy

```tsx
<BarChart data={...} xKey="..." yKeys={[...]}>
  {({ points, chartBounds }) => (
    <>
      <BarChart.Bar points={...} chartBounds={chartBounds} />
      <BarChart.BarGroup chartBounds={chartBounds}>
        <BarChart.BarGroupItem points={...} />
      </BarChart.BarGroup>
      <BarChart.StackedBar points={[...]} chartBounds={chartBounds} />
    </>
  )}
</BarChart>
```

- **BarChart**: Root container that wraps `victory-native` `CartesianChart` in a themed outer `View`. Applies a default `domainPadding` and accepts an `animation` prop for cascading `"disable-all"` to animated compound parts through `AnimationSettingsProvider`. Forwards `ref` to the underlying chart.
- **BarChart.Bar**: Themed Skia bar series for a single `yKey`. Uniwind-wrapped Skia primitive whose fill is driven by `colorClassName`. Defaults `roundedCorners` to small top radii and respects cascaded `isAllAnimationsDisabled`: when disabled, the `animate` prop is dropped.
- **BarChart.BarGroup**: Clustered (side-by-side) bars for multiple series per category. Reads child `BarChart.BarGroupItem` props, computes per-series Skia paths with `useBarGroupPaths`, and renders themed bars while reporting the resolved `barWidth`, `groupWidth`, and `gapWidth` through `onBarSizeChange`.
- **BarChart.BarGroupItem**: One series inside a `BarChart.BarGroup`. Same Uniwind `colorClassName` and `animate` cascade as `BarChart.Bar`.
- **BarChart.StackedBar**: Stacked columns built from an ordered array of `PointsArray` entries (bottom of the stack first). Gates `animate` through the same animation cascade.

## Usage

### Basic usage

Provide `data`, `xKey`, and `yKeys`, then render a `BarChart.Bar` for the series in the children render function. Pass `chartBounds` from the render args so victory-native can size the columns.

```tsx
<BarChart data={DATA} xKey="month" yKeys={['sales']} wrapperClassName="h-52">
  {({ points, chartBounds }) => (
    <BarChart.Bar points={points.sales} chartBounds={chartBounds} />
  )}
</BarChart>
```

### Custom bar width and rounded corners

Tune column thickness with `barWidth` and round individual corners through `roundedCorners`.

```tsx
<BarChart.Bar
  points={points.sales}
  chartBounds={chartBounds}
  barWidth={12}
  roundedCorners={{
    topLeft: 12,
    topRight: 12,
    bottomLeft: 12,
    bottomRight: 12,
  }}
/>
```

### Grouped bars

Render `BarChart.BarGroup` with one `BarChart.BarGroupItem` per series. Pass distinct `colorClassName` values so the clustered columns are visually separable.

```tsx
<BarChart
  data={DATA}
  xKey="month"
  yKeys={['online', 'retail', 'direct']}
  wrapperClassName="h-52"
>
  {({ points, chartBounds }) => (
    <BarChart.BarGroup chartBounds={chartBounds} barWidth={10}>
      <BarChart.BarGroupItem
        points={points.online}
        colorClassName="accent-chart-3"
      />
      <BarChart.BarGroupItem
        points={points.retail}
        colorClassName="accent-chart-2"
      />
      <BarChart.BarGroupItem
        points={points.direct}
        colorClassName="accent-chart-1"
      />
    </BarChart.BarGroup>
  )}
</BarChart>
```

### Stacked bars

Compute the per-row stack maximum and pass it as the `y` domain so each stack matches the data scale. `points` for `BarChart.StackedBar` is an ordered array — index `0` is the bottom of the stack.

```tsx
<BarChart
  data={DATA}
  xKey="quarter"
  yKeys={['starter', 'pro', 'enterprise']}
  domain={{ y: [0, maxStackTotal] }}
  wrapperClassName="h-52"
>
  {({ points, chartBounds }) => (
    <BarChart.StackedBar
      chartBounds={chartBounds}
      points={[points.starter, points.pro, points.enterprise]}
      colors={[starterColor, proColor, enterpriseColor]}
      barWidth={32}
    />
  )}
</BarChart>
```

### Round only the top of a stack

Use `barOptions` to receive each segment's position in the stack. Apply `roundedCorners` only when `isTop` is true so the cap of the column is rounded while inner segments stay square.

```tsx
<BarChart.StackedBar
  chartBounds={chartBounds}
  points={[points.starter, points.pro, points.enterprise]}
  colors={[starterColor, proColor, enterpriseColor]}
  barOptions={({ isTop }) => ({
    roundedCorners: isTop
      ? { topLeft: 10, topRight: 10, bottomLeft: 0, bottomRight: 0 }
      : undefined,
  })}
/>
```

### Animate data transitions

Pass an `animate` config to `BarChart.Bar` (or `BarChart.BarGroupItem` / `BarChart.StackedBar`) to interpolate the Skia bar paths when the underlying `points` change. Useful for timeframe toggles, filter swaps, or live-updating series.

> Skia can only interpolate paths with the same number of points. If the number of bars changes between renders, the path snaps instead of animating. Keep each dataset's row count consistent when driving `animate` from variable-length data.

> To get an enter animation on first paint, render the chart with placeholder values close to `0` (same row count as the real data) and swap to the actual values once you're ready — for example on screen focus, after a fetch resolves, or behind a loading flag. Because the bar count stays the same, each column animates from the near-zero baseline up to its real height.

```tsx
<BarChart.Bar
  points={points.sales}
  chartBounds={chartBounds}
  animate={{ type: 'timing', duration: 500 }}
/>
```

### Categorical X-axis tick values

When the X field is a `string`, victory-native's default tick generator can return fractional positions and render the literal `"undefined"` for labels at those ticks. Generate integer indices for `xAxis.tickValues` to keep labels aligned.

```tsx
const tickValues = Array.from({ length: DATA.length }, (_, index) => index);

<BarChart
  data={DATA}
  xKey="month"
  yKeys={['sales']}
  xAxis={{ tickValues }}
  wrapperClassName="h-52"
>
  {({ points, chartBounds }) => (
    <BarChart.Bar points={points.sales} chartBounds={chartBounds} />
  )}
</BarChart>;
```

### Gradient fill with useBarPath

`BarChart.Bar` does not pass children through to its Skia `Path`. To paint a shader on a column, build the bar path with `useBarPath` and render a Skia `<Path>` directly with a `<LinearGradient>` child.

```tsx
import { LinearGradient, Path, vec } from '@shopify/react-native-skia';
import { useBarPath } from 'heroui-native-pro';

function GradientBars({ points, chartBounds }) {
  const { path } = useBarPath(
    points,
    chartBounds,
    0.25,
    { topLeft: 8, topRight: 8, bottomLeft: 0, bottomRight: 0 },
    16
  );

  const cx = (chartBounds.left + chartBounds.right) / 2;

  return (
    <Path path={path} style="fill">
      <LinearGradient
        colors={[bottomColor, midColor, topColor]}
        start={vec(cx, chartBounds.bottom)}
        end={vec(cx, chartBounds.top)}
      />
    </Path>
  );
}
```

## Example

```tsx
import { Card } from 'heroui-native';
import { BarChart } from 'heroui-native-pro';
import { View } from 'react-native';

const SALES_DATA = [
  { month: 'Jan', sales: 18 },
  { month: 'Feb', sales: 32 },
  { month: 'Mar', sales: 28 },
  { month: 'Apr', sales: 45 },
  { month: 'May', sales: 38 },
  { month: 'Jun', sales: 52 },
  { month: 'Jul', sales: 42 },
  { month: 'Aug', sales: 55 },
  { month: 'Sep', sales: 48 },
  { month: 'Oct', sales: 60 },
  { month: 'Nov', sales: 53 },
  { month: 'Dec', sales: 58 },
];

const categoryAxisTickValues = (count: number): number[] =>
  Array.from({ length: count }, (_, index) => index);

export default function DailySalesChart() {
  return (
    <View className="flex-1 w-full px-5 justify-center">
      <Card>
        <Card.Header className="mb-3">
          <Card.Title className="text-sm">Daily sales</Card.Title>
          <Card.Description className="text-muted text-xs">
            Units sold per month
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <BarChart
            data={SALES_DATA}
            xKey="month"
            yKeys={['sales']}
            domain={{ y: [0, 60] }}
            xAxis={{ tickValues: categoryAxisTickValues(SALES_DATA.length) }}
            yAxis={[
              { formatYLabel: (value: number) => `${Math.round(value)}` },
            ]}
            wrapperClassName="h-[220px]"
          >
            {({ points, chartBounds }) => (
              <BarChart.Bar
                points={points.sales}
                chartBounds={chartBounds}
                barWidth={12}
                colorClassName="accent-chart-3"
                roundedCorners={{
                  topLeft: 12,
                  topRight: 12,
                  bottomLeft: 12,
                  bottomRight: 12,
                }}
                animate={{ type: 'timing', duration: 1000 }}
              />
            )}
          </BarChart>
        </Card.Body>
      </Card>
    </View>
  );
}
```

## API Reference

### BarChart

| prop               | type                    | default                                      | description                                                                                                                      |
| ------------------ | ----------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `wrapperClassName` | `string`                | -                                            | Additional Tailwind classes for the outer `View` that wraps the chart. Required for chart height (e.g. `h-52`)                   |
| `domainPadding`    | `SidedNumber`           | `{ top: 8, bottom: 8, left: 12, right: 12 }` | Padding (in pixels) added inside the chart bounds. A caller-supplied value replaces the default object in full                   |
| `animation`        | `BarChartRootAnimation` | -                                            | Animation configuration for the chart root. Accepts `"disable-all"` to cascade animation skipping to all animated compound parts |

Extends [victory-native `CartesianChart`](https://nearform.com/open-source/victory-native/docs/cartesian/cartesian-chart) — all `CartesianChart` props (`data`, `xKey`, `yKeys`, `children`, `xAxis`, `yAxis`, `domain`, `chartPressState`, `axisOptions`, `ref`, etc.) are supported in addition to the BarChart-specific props above.

#### BarChartRootAnimation

Animation configuration for the root component. Can be:

- `false` or `"disabled"`: Disable only root animations
- `"disable-all"`: Disable all animations including animated compound parts
- `true` or `undefined`: Use default animations
- `object`: Custom animation configuration with a `state` field for the same disabling semantics

The root does not drive any of its own animated styles; its sole animation responsibility is cascading `isAllAnimationsDisabled` to compound parts that do animate.

### BarChart.Bar

| prop             | type                  | default                       | description                                                                                                                    |
| ---------------- | --------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `colorClassName` | `string`              | `'accent-chart-3'`            | Uniwind `accent-*` class for the bar fill. Resolves to the Skia `color` prop; pass `color` directly to bypass Uniwind          |
| `roundedCorners` | `RoundedCorners`      | `{ topLeft: 4, topRight: 4 }` | Per-corner radii for the bar path                                                                                              |
| `animate`        | `PathAnimationConfig` | -                             | victory-native path-interpolation config applied when `points` change. Dropped when cascaded `isAllAnimationsDisabled` is true |
| `className`      | `string`              | -                             | Uniwind class forwarded to the underlying Skia `Bar`                                                                           |

Extends [victory-native `Bar`](https://nearform.com/open-source/victory-native/docs/cartesian/bar/) — only props affected by the HeroUI Native wrapper are listed above; refer to the upstream docs for `points`, `chartBounds`, `barWidth`, `innerPadding`, and Skia paint props.

### BarChart.BarGroup

| prop                  | type        | default | description                                                  |
| --------------------- | ----------- | ------- | ------------------------------------------------------------ |
| `children`            | `ReactNode` | -       | One or more `BarChart.BarGroupItem` children, one per series |
| `betweenGroupPadding` | `number`    | `0.25`  | Fractional padding between adjacent groups (`0`–`1`)         |
| `withinGroupPadding`  | `number`    | `0.25`  | Fractional padding between bars inside a group (`0`–`1`)     |

Mirrors the layout contract of [victory-native `BarGroup`](https://nearform.com/open-source/victory-native/docs/cartesian/bar/bar-group) using `useBarGroupPaths` under the hood. The bar paths and themed fills come from rendering one styled `BarGroup.Bar` per child, which is why children must be `BarChart.BarGroupItem` elements. Refer to the upstream docs for `chartBounds`, `barWidth`, `barCount`, `roundedCorners`, and `onBarSizeChange`.

### BarChart.BarGroupItem

| prop             | type                  | default            | description                                                                                                                    |
| ---------------- | --------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `colorClassName` | `string`              | `'accent-chart-3'` | Uniwind `accent-*` class for the bar fill. Resolves to the Skia `color` prop; pass `color` directly to bypass Uniwind          |
| `animate`        | `PathAnimationConfig` | -                  | victory-native path-interpolation config applied when `points` change. Dropped when cascaded `isAllAnimationsDisabled` is true |
| `className`      | `string`              | -                  | Uniwind class forwarded to the underlying Skia `Bar`                                                                           |

Extends victory-native `BarGroup.Bar` — only props affected by the HeroUI Native wrapper are listed above. The `chartBounds`, `barWidth`, and `roundedCorners` props are computed by the parent `BarChart.BarGroup` and should not be supplied directly on the item; refer to the upstream `BarGroup.Bar` docs for any other passthrough props.

### BarChart.StackedBar

| prop      | type                  | default | description                                                                                                                    |
| --------- | --------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `animate` | `PathAnimationConfig` | -       | victory-native path-interpolation config applied when `points` change. Dropped when cascaded `isAllAnimationsDisabled` is true |

Extends [victory-native `StackedBar`](https://nearform.com/open-source/victory-native/docs/cartesian/bar/stacked-bar) — only props affected by the HeroUI Native wrapper are listed above; refer to the upstream docs for `points`, `chartBounds`, `colors`, `barWidth`, `innerPadding`, and `barOptions`. For correct stacking, callers typically set `domain={{ y: [0, maxStackSum] }}` on the root when auto-domain is insufficient.

## Hooks

### useBarPath

Re-exported from `victory-native` so consumers can build custom Skia `<Path />` renderings on the same `PointsArray` `BarChart.Bar` consumes — useful for layering shaders, gradients, or custom strokes on top of standard bars.

```tsx
import { Path } from '@shopify/react-native-skia';
import { useBarPath } from 'heroui-native-pro';

function CustomBar({ points, chartBounds }) {
  const { path } = useBarPath(points, chartBounds, 0.2, {
    topLeft: 4,
    topRight: 4,
  });

  return <Path path={path} style="fill" color="red" />;
}
```

See the full reference in the [victory-native `useBarPath` docs](https://nearform.com/open-source/victory-native/docs/cartesian/bar/use-bar-path).

### useBarGroupPaths

Re-exported from `victory-native` so consumers can compute clustered-group bar paths outside of `BarChart.BarGroup` — useful when rendering custom Skia primitives per series while keeping the same layout the themed group uses internally.

```tsx
import { useBarGroupPaths } from 'heroui-native-pro';

const { paths, barWidth, groupWidth, gapWidth } = useBarGroupPaths(
  [points.online, points.retail, points.direct],
  chartBounds,
  0.25,
  0.25
);
```

See the full reference in the [victory-native `useBarGroupPaths` docs](https://nearform.com/open-source/victory-native/docs/cartesian/bar/use-bar-group-paths).

### useStackedBarPaths

Re-exported from `victory-native` so consumers can compute stacked-segment paths outside of `BarChart.StackedBar` — useful when each segment needs its own shader or post-processing while staying aligned with the standard stack layout.

```tsx
import { useStackedBarPaths } from 'heroui-native-pro';

const { paths } = useStackedBarPaths(
  [points.starter, points.pro, points.enterprise],
  chartBounds,
  0.2
);
```

See the full reference in the [victory-native `useStackedBarPaths` docs](https://nearform.com/open-source/victory-native/docs/cartesian/bar/use-stacked-bar-paths).
