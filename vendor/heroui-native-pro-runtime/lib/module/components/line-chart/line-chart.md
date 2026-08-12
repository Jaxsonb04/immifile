# LineChart

A line chart for visualizing trends over time with multi-series, sparkline, and press-driven overlays.

> `LineChart` is built on top of [victory-native](https://nearform.com/open-source/victory-native/docs/), wrapping its `CartesianChart` and `Line` primitives with HeroUI Native theming and draw-on animations. For press overlays (indicator dot, vertical crosshair), import `ChartIndicator` and `ChartCrosshair` from `heroui-native-pro` — they are Skia primitives in the same canvas as `LineChart` children. For a **React Native** value label centered on the crosshair x-coordinate, wrap the chart and the label in `ChartCrosshair.Anchor` and render `ChartCrosshair.Value` as a sibling **outside** the chart (see below) — do not rely on `renderOutside` for RN labels (`Text` / `TextInput`), since that hook still renders inside the Skia canvas. For full context on chart props, gestures, scales, and rendering internals, read the [victory-native docs](https://nearform.com/open-source/victory-native/docs/) alongside this page.

## Import

```tsx
import { ChartCrosshair, ChartIndicator, LineChart } from 'heroui-native-pro';
```

## Anatomy

```tsx
<LineChart data={...} xKey="..." yKeys={[...]}>
  {({ points, chartBounds }) => (
    <>
      <LineChart.Line points={...} />
      <LineChart.AnimatedLine points={...} />
      {/* Optional: useChartPressState + ChartIndicator / ChartCrosshair; RN labels via ChartCrosshair.Value */}
    </>
  )}
</LineChart>
```

- **LineChart**: Root container that wraps `victory-native` `CartesianChart` in a themed outer `View`. Accepts an `animation` prop for cascading `"disable-all"` to animated compound parts through `AnimationSettingsProvider`. Forwards `ref` to the underlying chart for access to the Skia canvas and press-actions handle.
- **LineChart.Line**: Themed static line series. Renders a Uniwind-wrapped Skia line path whose stroke color is driven by `colorClassName`. Respects cascaded `isAllAnimationsDisabled`: when disabled, the `animate` prop is dropped so data-change path interpolation is skipped.
- **LineChart.AnimatedLine**: Replayable draw-on line. Sweeps the Skia `Path.end` trim from `animation.progress[0]` to `animation.progress[1]` (default `[0, 1]`) on mount and whenever `resetKey` identity changes, using the provided timing or spring config.
- **ChartIndicator** / **ChartCrosshair** (separate exports): Themed Skia press overlays. Use with `useChartPressState` and `chartPressState` on the chart root; see [Chart gestures](https://nearform.com/open-source/victory-native/docs/cartesian/chart-gestures) in the victory-native docs.
- **ChartCrosshair.Anchor** / **ChartCrosshair.Value** / **ChartCrosshair.ValueLabel**: read-only Reanimated `TextInput` overlay whose string is driven by `SharedValue<string>` (`value` on `ChartCrosshair.Value`), plus a **relative** wrapper (`ChartCrosshair.Anchor`) that supplies crosshair context (`x`, `isActive`, `chartBounds`). **`ChartCrosshair.Value` requires `ChartCrosshair.Anchor`.** The value root measures its own width and centers on `x`; use `onChartBoundsChange` to mirror Skia `chartBounds` — not `renderOutside` for the label.

## Usage

### Basic usage

Provide `data`, `xKey`, and `yKeys`, then render a `LineChart.Line` for each series in the children render function.

```tsx
<LineChart data={DATA} xKey="month" yKeys={['revenue']} wrapperClassName="h-48">
  {({ points }) => <LineChart.Line points={points.revenue} />}
</LineChart>
```

### Multiple series

Render a separate `LineChart.Line` per key. Pass a distinct `colorClassName` to each so the curves are visually separable.

```tsx
<LineChart
  data={DATA}
  xKey="month"
  yKeys={['organic', 'paid']}
  wrapperClassName="h-48"
>
  {({ points }) => (
    <>
      <LineChart.Line points={points.organic} colorClassName="accent-chart-3" />
      <LineChart.Line points={points.paid} colorClassName="accent-chart-1" />
    </>
  )}
</LineChart>
```

### Curve type

Switch the line interpolation with `curveType`. `natural` produces a smoother cubic spline, `linear` draws straight segments.

```tsx
<LineChart.Line points={points.revenue} curveType="natural" />
<LineChart.Line points={points.revenue} curveType="linear" />
```

### Dashed line

Nest a Skia `DashPathEffect` as a child of `LineChart.Line` for dashed strokes.

```tsx
import { DashPathEffect } from '@shopify/react-native-skia';

<LineChart.Line points={points.target} colorClassName="accent-chart-1">
  <DashPathEffect intervals={[5, 5]} />
</LineChart.Line>;
```

### Custom axis font

Axis tick labels default to platform-native sans-serifs — **Helvetica** on iOS and **sans-serif** on Android, both at `fontSize: 11`. Override with any Skia `SkFont` via the `xAxis.font` / `yAxis[i].font` props.

Build the font from a bundled `.ttf` asset with `useFont`:

```tsx
import { useFont } from '@shopify/react-native-skia';
import InterMedium from './assets/fonts/Inter-Medium.ttf';

function MyChart() {
  const font = useFont(InterMedium, 12);

  return (
    <LineChart
      data={DATA}
      xKey="month"
      yKeys={['revenue']}
      xAxis={{ font }}
      yAxis={[{ font }]}
      wrapperClassName="h-48"
    >
      {({ points }) => <LineChart.Line points={points.revenue} />}
    </LineChart>
  );
}
```

### Draw-on animation

Use `LineChart.AnimatedLine` with an `animation` config to play a draw-on reveal.

```tsx
<LineChart data={DATA} xKey="month" yKeys={['revenue']} wrapperClassName="h-48">
  {({ points }) => (
    <LineChart.AnimatedLine
      points={points.revenue}
      curveType="natural"
      animation={{ type: 'timing', duration: 1200 }}
    />
  )}
</LineChart>
```

### Animate data transitions

Pass an `animate` config to `LineChart.Line` to morph between datasets when the underlying `points` change. Each time `data` updates, victory-native's `useAnimatedPath` interpolates the old path into the new one using the provided Reanimated config — useful for timeframe toggles, filter swaps, or live-updating series.

> Skia can only interpolate (and hence animate) paths with the same number of points. If the number of samples changes between renders (e.g. swapping datasets of different lengths), the path snaps instead of animating. Keep each dataset's point count consistent when driving `Line.animate` from variable-length data.

```tsx
const [timeframe, setTimeframe] = useState<'month' | 'year'>('month');

<LineChart
  data={DATA[timeframe]}
  xKey="index"
  yKeys={['value']}
  wrapperClassName="h-48"
>
  {({ points }) => (
    <LineChart.Line
      points={points.value}
      curveType="natural"
      animate={{ type: 'timing', duration: 250 }}
    />
  )}
</LineChart>;
```

### Replay animation on demand

Bump `resetKey` with any fresh value (typically a counter) to replay the draw-on animation.

```tsx
const [replayCount, setReplayCount] = useState(0);

<LineChart data={DATA} xKey="month" yKeys={['revenue']} wrapperClassName="h-48">
  {({ points }) => (
    <LineChart.AnimatedLine
      points={points.revenue}
      animation={{ type: 'spring', damping: 18, stiffness: 120 }}
      resetKey={replayCount}
    />
  )}
</LineChart>

<Button onPress={() => setReplayCount((n) => n + 1)}>Replay</Button>;
```

### Custom sweep range

Use `animation.progress` to customize the `[from, to]` range bound to the `Path.end` trim. `[1, 0]` reverses the sweep for a fade-out.

```tsx
<LineChart.AnimatedLine
  points={points.revenue}
  animation={{ type: 'timing', duration: 800, progress: [0, 1] }}
/>

<LineChart.AnimatedLine
  points={points.revenue}
  animation={{ type: 'timing', duration: 500, progress: [1, 0] }}
/>
```

### Chart-press tooltip

Wire `useChartPressState` to the chart via `chartPressState` and render `ChartIndicator` gated by `isActive`.

```tsx
import { ChartIndicator, LineChart } from 'heroui-native-pro';

const { state, isActive } = useChartPressState({
  x: '' as string,
  y: { revenue: 0 },
});

<LineChart
  data={DATA}
  xKey="month"
  yKeys={['revenue']}
  chartPressState={state}
  wrapperClassName="h-48"
>
  {({ points }) => (
    <>
      <LineChart.Line points={points.revenue} />
      {isActive ? (
        <ChartIndicator x={state.x.position} y={state.y.revenue.position} />
      ) : null}
    </>
  )}
</LineChart>;
```

### Chart-press crosshair

Pair with `ChartCrosshair` for the classic hover-guide look. `top` and `bottom` come from `chartBounds`. The `variant` prop defaults to `"dashed"`; pass `"solid"` for an unbroken rule.

```tsx
import { ChartCrosshair } from 'heroui-native-pro';

{
  isActive ? (
    <>
      <ChartCrosshair
        x={state.x.position}
        top={chartBounds.top}
        bottom={chartBounds.bottom}
      />
      <ChartCrosshair
        variant="solid"
        x={state.x.position}
        top={chartBounds.top}
        bottom={chartBounds.bottom}
      />
    </>
  ) : null;
}
```

### ChartCrosshair.Value (RN overlay label)

Skia cannot host React Native text views for this use case. `ChartCrosshair.Value` uses a **read-only** `TextInput` (via internal `ReText`) so the label string can update on the UI thread via `useAnimatedProps`. Wrap the chart **and** the label in `ChartCrosshair.Anchor` (relative positioning + crosshair context); **`ChartCrosshair.Value` must be a descendant.** Pass `chartBounds` from `onChartBoundsChange`, and the same `state.x.position` and `state.isActive` shared values you use for the Skia `ChartCrosshair` rule / `ChartIndicator`. The value root measures its width (`onLayout`) to center on the crosshair; apply minimum width with Uniwind classes (e.g. `min-w-20 px-2`).

Build the string on the UI thread with `useDerivedValue` and pass it to **`value`** on `ChartCrosshair.Value`.

```tsx
import { ChartCrosshair, ChartIndicator, LineChart } from 'heroui-native-pro';
import { useState } from 'react';
import { View } from 'react-native';
import { useDerivedValue } from 'react-native-reanimated';
import type { ChartBounds } from 'victory-native';
import { useChartPressState } from 'victory-native';

const { state, isActive } = useChartPressState({
  x: '' as string,
  y: { revenue: 0 },
});

const [chartBounds, setChartBounds] = useState<ChartBounds | null>(null);

const labelText = useDerivedValue(
  () => `$${(state.y.revenue.value.get() / 1000).toFixed(1)}k`
);

return (
  <View className="relative w-full" style={{ height: 200 }}>
    <ChartCrosshair.Anchor
      chartBounds={chartBounds ?? undefined}
      isActive={state.isActive}
      x={state.x.position}
    >
      <LineChart
        data={DATA}
        xKey="month"
        yKeys={['revenue']}
        chartPressState={state}
        onChartBoundsChange={setChartBounds}
        wrapperClassName="h-full"
      >
        {({ points, chartBounds: b }) => (
          <>
            <LineChart.Line points={points.revenue} />
            {isActive ? (
              <>
                <ChartIndicator
                  x={state.x.position}
                  y={state.y.revenue.position}
                />
                <ChartCrosshair
                  x={state.x.position}
                  top={b.top}
                  bottom={b.bottom}
                />
              </>
            ) : null}
          </>
        )}
      </LineChart>
      <ChartCrosshair.Value className="min-w-20 px-2" value={labelText} />
    </ChartCrosshair.Anchor>
  </View>
);
```

## Example

```tsx
import { Card } from 'heroui-native';
import { ChartCrosshair, ChartIndicator, LineChart } from 'heroui-native-pro';
import { View } from 'react-native';
import { useChartPressState } from 'victory-native';

const REVENUE_DATA = [
  { month: 'Jan', revenue: 4200 },
  { month: 'Feb', revenue: 5800 },
  { month: 'Mar', revenue: 4900 },
  { month: 'Apr', revenue: 7200 },
  { month: 'May', revenue: 6100 },
  { month: 'Jun', revenue: 8400 },
  { month: 'Jul', revenue: 7800 },
  { month: 'Aug', revenue: 9200 },
  { month: 'Sep', revenue: 8600 },
  { month: 'Oct', revenue: 10200 },
  { month: 'Nov', revenue: 9800 },
  { month: 'Dec', revenue: 11500 },
];

const formatThousandsCurrency = (value: number): string =>
  `$${(value / 1000).toFixed(0)}k`;

export default function MonthlyRevenueChart() {
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
          <LineChart
            data={REVENUE_DATA}
            xKey="month"
            yKeys={['revenue']}
            chartPressState={state}
            yAxis={[{ formatYLabel: formatThousandsCurrency }]}
            wrapperClassName="h-[200px]"
          >
            {({ points, chartBounds }) => (
              <>
                <LineChart.Line points={points.revenue} curveType="monotoneX" />
                {isActive ? (
                  <>
                    <ChartIndicator
                      x={state.x.position}
                      y={state.y.revenue.position}
                    />
                    <ChartCrosshair
                      bottom={chartBounds.bottom}
                      top={chartBounds.top}
                      x={state.x.position}
                    />
                  </>
                ) : null}
              </>
            )}
          </LineChart>
        </Card.Body>
      </Card>
    </View>
  );
}
```

## API Reference

### LineChart

| prop               | type                     | default | description                                                                                                                      |
| ------------------ | ------------------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `wrapperClassName` | `string`                 | -       | Additional Tailwind classes for the outer `View` that wraps the chart. Required for chart height (e.g. `h-48`)                   |
| `animation`        | `LineChartRootAnimation` | -       | Animation configuration for the chart root. Accepts `"disable-all"` to cascade animation skipping to all animated compound parts |

Extends [victory-native `CartesianChart`](https://nearform.com/open-source/victory-native/docs/cartesian/cartesian-chart) — all `CartesianChart` props (`data`, `xKey`, `yKeys`, `children`, `xAxis`, `yAxis`, `domainPadding`, `chartPressState`, `axisOptions`, `ref`, etc.) are supported in addition to the LineChart-specific props above.

#### LineChartRootAnimation

Animation configuration for the root component. Can be:

- `false` or `"disabled"`: Disable only root animations
- `"disable-all"`: Disable all animations including animated compound parts
- `true` or `undefined`: Use default animations
- `object`: Custom animation configuration with a `state` field for the same disabling semantics

The root does not drive any of its own animated styles; its sole animation responsibility is cascading `isAllAnimationsDisabled` to compound parts that do animate.

### LineChart.Line

| prop             | type                  | default            | description                                                                                                                    |
| ---------------- | --------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `colorClassName` | `string`              | `'accent-chart-3'` | Uniwind `accent-*` class for the stroke color                                                                                  |
| `strokeWidth`    | `number`              | `2`                | Stroke width in logical pixels                                                                                                 |
| `animate`        | `PathAnimationConfig` | -                  | victory-native path-interpolation config applied when `points` change. Dropped when cascaded `isAllAnimationsDisabled` is true |
| `className`      | `string`              | -                  | Uniwind class forwarded to the underlying Skia `Line`                                                                          |

Extends [victory-native `Line`](https://nearform.com/open-source/victory-native/docs/cartesian/line/) — `points`, `curveType`, `connectMissingData`, `children`, and all Skia paint props (`color`, `opacity`, `blendMode`, `strokeJoin`, `strokeCap`, `strokeMiter`, `antiAlias`, `start`, `end`) flow through. `colorClassName` is added by Uniwind's `withUniwind` wrapper and resolves to the Skia `color` prop automatically; pass `color` directly to bypass Uniwind and supply a raw Skia color.

### LineChart.AnimatedLine

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

#### LineChartAnimatedLineAnimation

Animation configuration for the draw-on animation. Can be:

- `false` or `"disabled"`: Skip the animation; jump straight to `progress[1]`
- `true` or `undefined`: Use default animation (`{ type: 'timing', duration: 700 }`)
- `{ state: 'disabled', ... }`: Disable the animation while customizing other fields
- `object`: Discriminated animation configuration on the `type` property

`decay` is intentionally excluded since a velocity-based decay has no natural stopping point at the sweep's `to`.

| prop        | type                   | default  | description                                                                                             |
| ----------- | ---------------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `type`      | `'timing' \| 'spring'` | -        | Animation type. Discriminator that narrows the other fields to `WithTimingConfig` or `WithSpringConfig` |
| `progress`  | `[number, number]`     | `[0, 1]` | `[from, to]` range bound to the Skia `Path.end` sweep. `[1, 0]` inverts the sweep for a fade-out        |
| `...timing` | `WithTimingConfig`     | -        | Reanimated timing fields (`duration`, `easing`) when `type: 'timing'`                                   |
| `...spring` | `WithSpringConfig`     | -        | Reanimated spring fields (`damping`, `stiffness`, `mass`, ...) when `type: 'spring'`                    |

## Hooks

### useLinePath

Re-exported from `victory-native` so consumers can build custom Skia `<Path />` renderings on the same `PointsArray` the compound parts consume — useful for layering fills, gradients, or secondary strokes on top of the standard `LineChart.Line`.

```tsx
import { useLinePath } from 'heroui-native-pro';
import { Path } from '@shopify/react-native-skia';

function CustomLine({ points }: { points: PointsArray }) {
  const { path } = useLinePath(points, { curveType: 'natural' });

  return <Path path={path} style="stroke" strokeWidth={3} color="red" />;
}
```

See the full reference, including all supported `curveType` values and the `connectMissingData` option, in the [victory-native `useLinePath` docs](https://nearform.com/open-source/victory-native/docs/cartesian/line/use-line-path).
