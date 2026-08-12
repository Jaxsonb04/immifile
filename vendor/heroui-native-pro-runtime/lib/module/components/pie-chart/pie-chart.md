# PieChart

A polar chart for visualizing categorical proportions with pie, donut, and segmented donut layouts.

> `PieChart` is built on top of [victory-native](https://nearform.com/open-source/victory-native/docs/), wrapping its `PolarChart` and `Pie.Chart` primitives with HeroUI Native theming and animation cascading. Slice fills come from each data row's `colorKey` field (a Skia `Color`). For full context on chart props, scales, and rendering internals, read the [victory-native docs](https://nearform.com/open-source/victory-native/docs/) alongside this page.

## Import

```tsx
import { PieChart } from 'heroui-native-pro';
```

## Anatomy

```tsx
<PieChart data={...} labelKey="..." valueKey="..." colorKey="...">
  <PieChart.Pie>
    {({ slice }) => (
      <>
        <PieChart.Slice>
          <PieChart.Label />
        </PieChart.Slice>
        <PieChart.SliceAngularInset angularInset={...} />
      </>
    )}
  </PieChart.Pie>
</PieChart>
```

- **PieChart**: Root container that wraps `victory-native` `PolarChart` in a themed outer `View`. Accepts an `animation` prop for cascading `"disable-all"` to animated compound parts through a private context plus `AnimationSettingsProvider`. Expects a single `PieChart.Pie` child.
- **PieChart.Pie**: Wraps `victory-native` `Pie.Chart`. Owns the layout props (`innerRadius`, `circleSweepDegrees`, `startAngle`, `size`) and the per-slice render callback. Bridges the root's animation cascade into the Skia canvas via `AnimationSettingsProvider`.
- **PieChart.Slice**: A single pie/donut slice. The fill is sourced from `data[colorKey]` and the path is computed from slice geometry, so neither is settable directly; pass other Skia paint props (`opacity`, `blendMode`, etc.) or nest a Skia shader child. Respects cascaded `isAllAnimationsDisabled`: when disabled, the `animate` prop is dropped.
- **PieChart.SliceAngularInset**: Stroke painted between adjacent slices for a "segmented" donut look. Configured via `angularInset={{ angularStrokeWidth, angularStrokeColor }}`. Respects cascaded `isAllAnimationsDisabled`.
- **PieChart.Label**: Text label rendered inside a slice. Place as a child of `PieChart.Slice`. Accepts a Skia `font`, `radiusOffset`, `color`, an explicit `text` override (defaults to `slice.label`), and a render-function `children` for fully custom content.

## Usage

### Basic usage

Provide `data`, `labelKey`, `valueKey`, and `colorKey`, then render a `PieChart.Slice` for each slice in the children render function. Height is supplied through `wrapperClassName`.

```tsx
<PieChart
  data={DATA}
  labelKey="name"
  valueKey="value"
  colorKey="color"
  wrapperClassName="h-[220px]"
>
  <PieChart.Pie>{() => <PieChart.Slice />}</PieChart.Pie>
</PieChart>
```

### Donut

Set `innerRadius` (number of pixels or percentage string) on `PieChart.Pie` to cut out the center.

```tsx
<PieChart
  data={DATA}
  labelKey="name"
  valueKey="value"
  colorKey="color"
  wrapperClassName="h-[220px]"
>
  <PieChart.Pie innerRadius="68%">{() => <PieChart.Slice />}</PieChart.Pie>
</PieChart>
```

### Segmented donut

Render `PieChart.SliceAngularInset` alongside `PieChart.Slice` and paint the inset stroke in your chart background color for a "segmented" donut look.

```tsx
<PieChart
  data={DATA}
  labelKey="name"
  valueKey="value"
  colorKey="color"
  wrapperClassName="h-[220px]"
>
  <PieChart.Pie innerRadius="68%">
    {() => (
      <>
        <PieChart.Slice />
        <PieChart.SliceAngularInset
          angularInset={{ angularStrokeWidth: 4, angularStrokeColor: '#fff' }}
        />
      </>
    )}
  </PieChart.Pie>
</PieChart>
```

### Partial arc

Combine `startAngle` and `circleSweepDegrees` on `PieChart.Pie` to render a partial-arc gauge. Angles are degrees measured clockwise from 12 o'clock (per victory-native).

```tsx
<PieChart
  data={DATA}
  labelKey="name"
  valueKey="value"
  colorKey="color"
  wrapperClassName="h-[220px]"
>
  <PieChart.Pie innerRadius="55%" startAngle={-90} circleSweepDegrees={180}>
    {() => <PieChart.Slice />}
  </PieChart.Pie>
</PieChart>
```

### Slice labels

Nest `PieChart.Label` as a child of `PieChart.Slice` and supply a Skia `SkFont` via `useFont`. The label text defaults to `slice.label`; pass `text` to override.

```tsx
import { useFont } from '@shopify/react-native-skia';
import InterMedium from './assets/fonts/Inter-Medium.ttf';

function MyChart() {
  const font = useFont(InterMedium, 12);

  return (
    <PieChart
      data={DATA}
      labelKey="name"
      valueKey="value"
      colorKey="color"
      wrapperClassName="h-[220px]"
    >
      <PieChart.Pie innerRadius="55%">
        {() => (
          <PieChart.Slice>
            <PieChart.Label font={font} color="white" radiusOffset={0.6} />
          </PieChart.Slice>
        )}
      </PieChart.Pie>
    </PieChart>
  );
}
```

### Custom label content

Use the render-function `children` on `PieChart.Label` to render any Skia content at the resolved label position. Receives `{ x, y, midAngle }`.

```tsx
<PieChart.Slice>
  <PieChart.Label>
    {({ x, y }) => <Circle cx={x} cy={y} r={6} color="white" />}
  </PieChart.Label>
</PieChart.Slice>
```

### Gradient slice fill

Nest a Skia shader as a child of `PieChart.Slice` to overlay a gradient on top of the data-driven fill. The slice path's bounds are used as the shader's coordinate space.

```tsx
import { RadialGradient, vec } from '@shopify/react-native-skia';

<PieChart.Slice>
  <RadialGradient
    c={vec(0, 0)}
    r={120}
    colors={['rgba(255,255,255,0.6)', 'rgba(255,255,255,0)']}
  />
</PieChart.Slice>;
```

### Animate data transitions

Pass an `animate` config to `PieChart.Slice` (or `PieChart.SliceAngularInset`) to interpolate the Skia slice paths when the underlying `data` changes. Useful for filter swaps, timeframe toggles, or live-updating values.

> Skia can only interpolate paths with the same number of points. If the number of slices changes between renders, the path snaps instead of animating. Keep each dataset's slice count consistent when driving `animate` from variable-length data.

```tsx
<PieChart.Pie innerRadius="55%">
  {() => <PieChart.Slice animate={{ type: 'timing', duration: 500 }} />}
</PieChart.Pie>
```

## Example

```tsx
import type { Color } from '@shopify/react-native-skia';
import { Card } from 'heroui-native';
import { PieChart } from 'heroui-native-pro';
import { View } from 'react-native';

type BrowserDatum = {
  name: string;
  value: number;
  color: Color;
};

const BROWSER_DATA: BrowserDatum[] = [
  { name: 'Chrome', value: 62, color: '#6366f1' },
  { name: 'Safari', value: 19, color: '#7c3aed' },
  { name: 'Firefox', value: 10, color: '#8b5cf6' },
  { name: 'Edge', value: 9, color: '#a78bfa' },
];

export default function BrowserUsageChart() {
  return (
    <View className="flex-1 w-full px-5 justify-center">
      <Card>
        <Card.Header className="mb-3">
          <Card.Title className="text-base">Browser Usage</Card.Title>
        </Card.Header>
        <Card.Body className="gap-4 items-center">
          <PieChart
            data={BROWSER_DATA}
            labelKey="name"
            valueKey="value"
            colorKey="color"
            wrapperClassName="h-[220px]"
          >
            <PieChart.Pie innerRadius="60%">
              {() => (
                <>
                  <PieChart.Slice animate={{ type: 'timing', duration: 500 }} />
                  <PieChart.SliceAngularInset
                    angularInset={{
                      angularStrokeWidth: 4,
                      angularStrokeColor: '#ffffff',
                    }}
                  />
                </>
              )}
            </PieChart.Pie>
          </PieChart>
          <View className="flex-row flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
            {BROWSER_DATA.map((entry) => (
              <View key={entry.name} className="flex-row items-center gap-1.5">
                <View
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: entry.color as string }}
                />
                <Card.Description className="text-xs">
                  {entry.name}
                </Card.Description>
              </View>
            ))}
          </View>
        </Card.Body>
      </Card>
    </View>
  );
}
```

## API Reference

### PieChart

| prop               | type                    | default | description                                                                                                                      |
| ------------------ | ----------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `children`         | `ReactNode`             | -       | Compound subcomponents rendered inside the chart canvas. Expected to be a single `PieChart.Pie` element                          |
| `wrapperClassName` | `string`                | -       | Additional Tailwind classes for the outer `View` that wraps `PolarChart`. Required for chart height (e.g. `h-[220px]`)           |
| `animation`        | `PieChartRootAnimation` | -       | Animation configuration for the chart root. Accepts `"disable-all"` to cascade animation skipping to all animated compound parts |

Extends [victory-native `PolarChart`](https://nearform.com/open-source/victory-native/docs/polar/polar-chart) — all `PolarChart` props (`data`, `labelKey`, `valueKey`, `colorKey`, `canvasStyle`, etc.) are supported in addition to the PieChart-specific props above.

#### PieChartRootAnimation

Animation configuration for the root component. Can be:

- `false` or `"disabled"`: Disable only root animations
- `"disable-all"`: Disable all animations including animated compound parts
- `true` or `undefined`: Use default animations
- `object`: Custom animation configuration with a `state` field for the same disabling semantics

The root does not drive any of its own animated styles; its sole animation responsibility is cascading `isAllAnimationsDisabled` to compound parts that do animate.

### PieChart.Pie

| prop                 | type                                      | default | description                                                                                                                                   |
| -------------------- | ----------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`           | `(args: { slice: PieSliceData }) => Node` | -       | Render function invoked once per slice. Compose `PieChart.Slice`, `PieChart.SliceAngularInset`, and `PieChart.Label` inside the returned tree |
| `innerRadius`        | `number \| string`                        | `0`     | Radius of the inner cutout. Numbers are pixels; strings are percentages of the outer radius (e.g. `"60%"`)                                    |
| `circleSweepDegrees` | `number`                                  | `360`   | Total sweep of the pie in degrees                                                                                                             |
| `startAngle`         | `number`                                  | `0`     | Starting angle in degrees, measured clockwise from 12 o'clock                                                                                 |
| `size`               | `number`                                  | -       | Explicit outer diameter in pixels. Defaults to the chart canvas size                                                                          |

Mirrors [victory-native `Pie.Chart`](https://nearform.com/open-source/victory-native/docs/polar/pie/pie-charts) — only props affected by the HeroUI Native wrapper are listed above. The `animation` prop lives on the `PieChart` root and is bridged into this subcomponent via a private context, so there is no `animation` prop here.

#### PieSliceData

Slice argument passed to `PieChart.Pie`'s children render function. Re-exported from `victory-native`.

| field                 | type      | description                                               |
| --------------------- | --------- | --------------------------------------------------------- |
| `center`              | `SkPoint` | Center point of the chart canvas (`{ x, y }`)             |
| `color`               | `Color`   | Resolved Skia color for the slice (from `data[colorKey]`) |
| `startAngle`          | `number`  | Slice start angle in degrees                              |
| `endAngle`            | `number`  | Slice end angle in degrees                                |
| `sweepAngle`          | `number`  | Slice sweep (`endAngle − startAngle`)                     |
| `innerRadius`         | `number`  | Resolved inner radius in pixels                           |
| `radius`              | `number`  | Resolved outer radius in pixels                           |
| `label`               | `string`  | Slice label sourced from `data[labelKey]`                 |
| `value`               | `number`  | Slice value sourced from `data[valueKey]`                 |
| `sliceIsEntireCircle` | `boolean` | `true` when the slice is the only slice (full 360° sweep) |

### PieChart.Slice

| prop               | type                                          | default | description                                                                                                                      |
| ------------------ | --------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `children`         | `ReactNode`                                   | -       | Optional `PieChart.Label` child plus Skia shader/effect children (`LinearGradient`, `RadialGradient`, etc.) painted on the slice |
| `label`            | `PieLabelProps`                               | -       | Alternative to a `PieChart.Label` child — pass label props directly                                                              |
| `animate`          | `PathAnimationConfig`                         | -       | victory-native path-interpolation config applied when `data` changes. Dropped when cascaded `isAllAnimationsDisabled` is true    |
| `...SkiaPathProps` | `Partial<Omit<PathProps, 'color' \| 'path'>>` | -       | Remaining Skia `Path` props (`opacity`, `blendMode`, `strokeJoin`, etc.). `color` and `path` are controlled internally           |

Extends [victory-native `Pie.Slice`](https://nearform.com/open-source/victory-native/docs/polar/pie/pie-slice). The fill color is sourced from `data[colorKey]` and the slice path is computed from slice geometry, so both are removed from the prop surface; pass other Skia paint props directly.

### PieChart.SliceAngularInset

| prop               | type                                                        | default | description                                                                                                                   |
| ------------------ | ----------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `angularInset`     | `{ angularStrokeWidth: number; angularStrokeColor: Color }` | -       | Stroke configuration drawn between adjacent slices. Use the chart background color for a "segmented" donut look               |
| `animate`          | `PathAnimationConfig`                                       | -       | victory-native path-interpolation config applied when `data` changes. Dropped when cascaded `isAllAnimationsDisabled` is true |
| `...SkiaPathProps` | `Partial<Omit<PathProps, 'color' \| 'path'>>`               | -       | Remaining Skia `Path` props. `color` and `path` are controlled internally                                                     |

Extends [victory-native `Pie.SliceAngularInset`](https://nearform.com/open-source/victory-native/docs/polar/pie/pie-slice-angular-inset).

### PieChart.Label

| prop           | type                                     | default       | description                                                                                    |
| -------------- | ---------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------- |
| `children`     | `(position: LabelPosition) => ReactNode` | -             | Render function for fully custom label content. Receives the resolved `{ x, y, midAngle }`     |
| `radiusOffset` | `number`                                 | `0.5`         | Fractional position along the slice radius (`0` = inner edge, `1` = outer edge)                |
| `text`         | `string`                                 | `slice.label` | Explicit label text. Defaults to the slice's `labelKey` value                                  |
| `color`        | `Color`                                  | `"white"`     | Skia text color                                                                                |
| `font`         | `SkFont \| null`                         | -             | Skia font used to render the label. Build one with `useFont` from `@shopify/react-native-skia` |

#### LabelPosition

Position argument passed to the `PieChart.Label` children render function.

| field      | type     | description                                                  |
| ---------- | -------- | ------------------------------------------------------------ |
| `x`        | `number` | Resolved x coordinate inside the slice                       |
| `y`        | `number` | Resolved y coordinate inside the slice                       |
| `midAngle` | `number` | Mid angle of the slice in degrees (useful for rotating text) |

## Hooks

### useSlicePath

Re-exported from `victory-native` so consumers can build custom Skia `<Path />` renderings on the same `PieSliceData` the compound parts consume — useful for layering fills, gradients, or secondary strokes on top of the standard `PieChart.Slice`.

```tsx
import { Path } from '@shopify/react-native-skia';
import { useSlicePath } from 'heroui-native-pro';

function CustomSlice({ slice }: { slice: PieSliceData }) {
  const path = useSlicePath({ slice });

  return <Path path={path} style="fill" color={slice.color} />;
}
```

See the full reference in the [victory-native `useSlicePath` docs](https://nearform.com/open-source/victory-native/docs/polar/pie/use-slice-path).

### useSliceAngularInsetPath

Re-exported from `victory-native` so consumers can compute the angular-inset stroke path outside of `PieChart.SliceAngularInset` — useful when rendering a custom Skia primitive for the inter-slice gap.

```tsx
import { Path } from '@shopify/react-native-skia';
import { useSliceAngularInsetPath } from 'heroui-native-pro';

const path = useSliceAngularInsetPath({
  slice,
  angularInset: { angularStrokeWidth: 4, angularStrokeColor: '#ffffff' },
});
```

See the full reference in the [victory-native `useSliceAngularInsetPath` docs](https://nearform.com/open-source/victory-native/docs/polar/pie/use-slice-angular-inset-path).
