# AreaChart

An area chart for visualizing trends, stacked contributions, and confidence bands with Skia-accelerated rendering.

> `AreaChart` is built on top of [victory-native](https://nearform.com/open-source/victory-native/docs/), wrapping its `CartesianChart` and area primitives (`Area`, `StackedArea`, `AreaRange`) with HeroUI Native theming, optional path `animate` from victory-native. See the [victory-native area docs](https://nearform.com/open-source/victory-native/docs/cartesian/area/) for curve types, `connectMissingData`, and path animation behavior.

## Import

```tsx
import { AreaChart, useAreaPath, useStackedAreaPaths } from 'heroui-native-pro';
```

## Anatomy

```tsx
<AreaChart data={...} xKey="..." yKeys={[...]}>
  {({ points, chartBounds }) => (
    <>
      <AreaChart.Area points={...} y0={chartBounds.bottom} />
      <AreaChart.StackedArea points={[...]} y0={chartBounds.bottom} colors={[...]} />
      <AreaChart.AreaRange upperPoints={...} lowerPoints={...} />
    </>
  )}
</AreaChart>
```

- **AreaChart**: Root container wrapping `victory-native` `CartesianChart` in a themed outer `View`. Accepts `animation` for cascading `"disable-all"` through `AnimationSettingsProvider`. Forwards `ref` to the underlying chart.
- **AreaChart.Area**: Themed filled area. Uniwind `colorClassName` drives fill color; default `opacity` is `0.2`. Respects cascaded `isAllAnimationsDisabled` for the `animate` prop.
- **AreaChart.StackedArea**: Multiple stacked layers; pass `points` as an array of `PointsArray` in stack order (typically bottom → top) plus matching `colors` and optional `areaOptions` for per-layer gradients.
- **AreaChart.AreaRange**: Band between upper and lower series or mapped `points` with `y` / `y0` bounds.

## Usage

### Basic usage

Provide `data`, `xKey`, `yKeys`, `chartBounds.bottom` as `y0`, then render `AreaChart.Area`.

```tsx
<AreaChart data={DATA} xKey="month" yKeys={['revenue']} wrapperClassName="h-48">
  {({ points, chartBounds }) => (
    <AreaChart.Area points={points.revenue} y0={chartBounds.bottom} />
  )}
</AreaChart>
```

### Gradient fill

Nest Skia `LinearGradient` as a child of `AreaChart.Area` for web-style gradient fills.

```tsx
import { LinearGradient, vec } from '@shopify/react-native-skia';

<AreaChart.Area points={points.revenue} y0={chartBounds.bottom}>
  <LinearGradient
    start={vec(0, chartBounds.top)}
    end={vec(0, chartBounds.bottom)}
    colors={['rgba(100,100,255,0.35)', 'rgba(100,100,255,0.05)']}
  />
</AreaChart.Area>;
```

### Curve type

Use `curveType` on `Area`, `StackedArea`, or `AreaRange`. `monotoneX` matches common web `type="monotone"` charts.

```tsx
<AreaChart.Area
  points={points.revenue}
  y0={chartBounds.bottom}
  curveType="monotoneX"
/>
```

### Animate data transitions

Pass an `animate` config to `AreaChart.Area` (or `StackedArea` / `AreaRange`) so victory-native's `useAnimatedPath` interpolates the old path into the new one when `points` change — useful for timeframe toggles, filter swaps, or live-updating series.

> Skia can only interpolate (and hence animate) paths with the same number of points. If the number of samples changes between renders, the path snaps instead of animating. Keep each dataset's point count consistent when driving `Area.animate` from variable-length data.

```tsx
const [timeframe, setTimeframe] = useState<'month' | 'year'>('month');

<AreaChart
  data={DATA[timeframe]}
  xKey="index"
  yKeys={['value']}
  wrapperClassName="h-48"
>
  {({ points, chartBounds }) => (
    <AreaChart.Area
      points={points.value}
      y0={chartBounds.bottom}
      curveType="natural"
      animate={{ type: 'timing', duration: 250 }}
    />
  )}
</AreaChart>;
```

### Stacked areas

Use `AreaChart.StackedArea` with `points={[points.a, points.b, ...]}` (bottom-most series first) and parallel `colors` in the same stack order. The `areaOptions` callback receives `{ rowIndex, lowestY, highestY }` for per-layer Skia children — typically a `LinearGradient` sized against the layer's stacked extent (use a shallow `highestY - 25` rise on the thick bottom band and a deeper `highestY - 100` rise on thinner upper bands so each layer still shows a clear color falloff). See [StackedArea](https://nearform.com/open-source/victory-native/docs/cartesian/area/stacked-area/) for the upstream reference.

```tsx
import {
  DashPathEffect,
  LinearGradient,
  vec,
} from '@shopify/react-native-skia';

<AreaChart
  data={STACKED_DATA}
  xKey="month"
  yKeys={['low', 'med', 'high']}
  domain={{ y: [0, 150] }}
  domainPadding={{ top: 0 }}
  xAxis={{ labelOffset: 4, lineWidth: 0 }}
  yAxis={[
    {
      labelOffset: 8,
      linePathEffect: <DashPathEffect intervals={[4, 4]} />,
    },
  ]}
  wrapperClassName="h-56"
>
  {({ points, chartBounds }) => (
    <AreaChart.StackedArea
      points={[points.low, points.med, points.high]}
      y0={chartBounds.bottom}
      colors={['#f7ce64', '#22dacd', '#56aefb']}
      curveType="natural"
      animate={{ type: 'spring' }}
      areaOptions={({ rowIndex, lowestY, highestY }) => {
        switch (rowIndex) {
          case 0:
            return {
              children: (
                <LinearGradient
                  start={vec(0, highestY - 25)}
                  end={vec(0, lowestY)}
                  colors={['#f7ce64', '#f7ce6420']}
                />
              ),
            };
          case 1:
            return {
              children: (
                <LinearGradient
                  start={vec(0, highestY - 100)}
                  end={vec(0, lowestY)}
                  colors={['#22dacd', '#22dacd20']}
                />
              ),
            };
          case 2:
            return {
              children: (
                <LinearGradient
                  start={vec(0, highestY - 100)}
                  end={vec(0, lowestY)}
                  colors={['#56aefb', '#56aefb20']}
                />
              ),
            };
          default:
            return {};
        }
      }}
    />
  )}
</AreaChart>;
```

> Stacked layers render cumulatively, but `CartesianChart`'s auto y-domain only considers each `yKey`'s individual maximum. Pass an explicit `domain={{ y: [0, maxStackTotal] }}` (rounded up to a clean tick to leave headroom for `natural`-curve overshoot) so the upper layers stay inside `chartBounds.top`. Pair with `domainPadding={{ top: 0 }}` if you'd rather rely entirely on the explicit domain for top spacing instead of victory-native's default top padding.

### Area range (confidence band)

Use `AreaChart.AreaRange` with `upperPoints` / `lowerPoints` (sourced from the chart's render callback) or a single `points` array typed as `AreaRangePointsArray` (`y` upper, `y0` lower). Pair with `LineChart.Line` rendered after the band to draw a central-tendency line on top. See [AreaRange](https://nearform.com/open-source/victory-native/docs/cartesian/area/area-range/).

```tsx
import { LineChart } from 'heroui-native-pro';

<AreaChart
  data={TEMPERATURE_DATA}
  xKey="month"
  yKeys={['low', 'avg', 'high']}
  wrapperClassName="h-56"
>
  {({ points }) => (
    <>
      <AreaChart.AreaRange
        upperPoints={points.high}
        lowerPoints={points.low}
        color="rgba(99, 102, 241, 0.18)"
        curveType="natural"
      />
      <LineChart.Line
        points={points.avg}
        colorClassName="accent-chart-3"
        curveType="natural"
        strokeWidth={2}
      />
    </>
  )}
</AreaChart>;
```

### Outline strokes on top of areas

Pair `AreaChart.Area` (or each band of `AreaChart.StackedArea`) with `LineChart.Line` to render a solid outline along the area's top edge in its matching color. For a `StackedArea`, build the cumulative top-edge polyline of each layer (since `points.<yKey>` are scaled per series, not pre-stacked) and feed each into a `LineChart.Line`.

### Chart press overlays

Compose `ChartIndicator` and `ChartCrosshair` from `heroui-native-pro` with `useChartPressState` — they are Skia primitives in the same canvas as `AreaChart` children.

## Example

```tsx
import { Card } from 'heroui-native';
import { AreaChart, ChartCrosshair, ChartIndicator } from 'heroui-native-pro';
import { View } from 'react-native';
import { useChartPressState } from 'victory-native';

const REVENUE_DATA = [
  { month: 'Jan', revenue: 4200 },
  { month: 'Feb', revenue: 5800 },
  // ...
];

export default function MonthlyRevenueArea() {
  const { state, isActive } = useChartPressState({
    x: '' as string,
    y: { revenue: 0 },
  });

  return (
    <View className="flex-1 w-full px-5 justify-center">
      <Card>
        <Card.Header className="mb-4">
          <Card.Title className="text-sm">Monthly Revenue</Card.Title>
        </Card.Header>
        <Card.Body>
          <AreaChart
            data={REVENUE_DATA}
            xKey="month"
            yKeys={['revenue']}
            chartPressState={state}
            wrapperClassName="h-[200px]"
          >
            {({ points, chartBounds }) => (
              <>
                <AreaChart.Area
                  points={points.revenue}
                  y0={chartBounds.bottom}
                  curveType="monotoneX"
                />
                {isActive ? (
                  <>
                    <ChartCrosshair
                      bottom={chartBounds.bottom}
                      top={chartBounds.top}
                      x={state.x.position}
                    />
                    <ChartIndicator
                      x={state.x.position}
                      y={state.y.revenue.position}
                    />
                  </>
                ) : null}
              </>
            )}
          </AreaChart>
        </Card.Body>
      </Card>
    </View>
  );
}
```

## API Reference

### AreaChart

| prop               | type                     | default | description                                                                    |
| ------------------ | ------------------------ | ------- | ------------------------------------------------------------------------------ |
| `wrapperClassName` | `string`                 | -       | Tailwind classes for the outer `View` (supply height, e.g. `h-48`)             |
| `animation`        | `AreaChartRootAnimation` | -       | Root animation config; `"disable-all"` cascades to all animated compound parts |

Extends [victory-native `CartesianChart`](https://nearform.com/open-source/victory-native/docs/cartesian/cartesian-chart/) — all chart props (`data`, `xKey`, `yKeys`, `xAxis`, `yAxis`, `chartPressState`, `ref`, …) are supported.

### AreaChart.Area

| prop             | type                  | default            | description                                                                                    |
| ---------------- | --------------------- | ------------------ | ---------------------------------------------------------------------------------------------- |
| `colorClassName` | `string`              | `'accent-chart-3'` | Uniwind accent class for fill                                                                  |
| `opacity`        | `number`              | `0.2`              | Default fill opacity                                                                           |
| `animate`        | `PathAnimationConfig` | -                  | Path interpolation when points change; dropped when cascaded `isAllAnimationsDisabled` is true |

Extends [victory-native `Area`](https://nearform.com/open-source/victory-native/docs/cartesian/area/) — `points`, `y0`, `curveType`, `connectMissingData`, `children`, and Skia paint props flow through.

### AreaChart.StackedArea

Extends [victory-native `StackedArea`](https://nearform.com/open-source/victory-native/docs/cartesian/area/stacked-area/). `animate` is dropped when cascaded `isAllAnimationsDisabled` is true.

### AreaChart.AreaRange

Extends [victory-native `AreaRange`](https://nearform.com/open-source/victory-native/docs/cartesian/area/area-range/). `animate` respects the same cascade.

## Hooks

### useAreaPath

Returns a Skia `SkPath` for a single filled area — see [useAreaPath](https://nearform.com/open-source/victory-native/docs/cartesian/area/use-area-path/).

### useStackedAreaPaths

Returns per-layer path objects for custom stacked rendering — see [useStackedAreaPaths](https://nearform.com/open-source/victory-native/docs/cartesian/area/use-stacked-area-paths/).
