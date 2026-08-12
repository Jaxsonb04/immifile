# RadarChart

A radar chart for comparing multivariate data across axes with fill, dot, and multi-series variants.

> `RadarChart` is built on top of [victory-native](https://nearform.com/open-source/victory-native/docs/), reusing its `PolarChart` for canvas + measurement and `useAnimatedPath` for polygon interpolation. victory-native does not ship a radar primitive — every visual part (grid rings, spokes, axis labels, radar polygon, vertex dots) is rendered with `@shopify/react-native-skia` `Path`, `Circle`, and `Text`. For full context on chart props and rendering internals, read the [victory-native docs](https://nearform.com/open-source/victory-native/docs/) alongside this page.

## Import

```tsx
import { RadarChart } from 'heroui-native-pro';
```

## Anatomy

```tsx
<RadarChart data={...} labelKey="..." dataKey="...">
  <RadarChart.Grid />
  <RadarChart.AngleAxis />
  <RadarChart.RadiusAxis />
  <RadarChart.Radar />
</RadarChart>
```

- **RadarChart**: Root container that wraps `victory-native` `PolarChart` in a themed outer `View`. Publishes `data`, `labelKey`, `dataKey`, `maxValue`, and the measured canvas size to compound subcomponents through an internal layout context that crosses the Skia reconciler via `useContextBridge`.
- **RadarChart.Grid**: Concentric rings (polygons by default) plus one radial spoke per category. Renders nothing until the canvas has been measured.
- **RadarChart.AngleAxis**: Category labels rendered around the chart perimeter, one per row, using `data[i][labelKey]`. Skia text via the default system font (`matchFont`).
- **RadarChart.RadiusAxis**: Numeric tick labels rendered along a single spoke (defaults to 12 o'clock). One label per grid ring, optionally including a `0` label at the chart center. Each tick rotates with the spoke so labels always read along its direction.
- **RadarChart.Radar**: Filled, stroked polygon for a single series. Render multiple siblings (each with its own `dataKey`) for a multi-series radar. Supports victory-native's `animate` config for smooth path interpolation when the underlying data changes.

## Usage

### Basic usage

Provide `data`, `labelKey`, and `dataKey`. The default `RadarChart.Radar` reads the root's `dataKey` and uses the theme `chart-3` color. Height is supplied through `wrapperClassName`.

```tsx
<RadarChart
  data={DATA}
  labelKey="category"
  dataKey="score"
  wrapperClassName="h-[280px]"
>
  <RadarChart.Grid />
  <RadarChart.AngleAxis />
  <RadarChart.Radar />
</RadarChart>
```

### Multi-series

Render multiple `RadarChart.Radar` siblings with distinct `dataKey` overrides to overlay several numeric fields on the same set of categories.

```tsx
<RadarChart
  data={DATA}
  labelKey="category"
  dataKey="teamA"
  wrapperClassName="h-[300px]"
>
  <RadarChart.Grid />
  <RadarChart.AngleAxis />
  <RadarChart.Radar dataKey="teamA" color="#8b5cf6" />
  <RadarChart.Radar dataKey="teamB" color="#6366f1" />
</RadarChart>
```

### Dots only

Set `fillOpacity={0}` and `showDots` to emphasize each vertex as a discrete marker rather than reading the chart as filled areas.

```tsx
<RadarChart
  data={DATA}
  labelKey="category"
  dataKey="score"
  wrapperClassName="h-[280px]"
>
  <RadarChart.Grid />
  <RadarChart.AngleAxis />
  <RadarChart.Radar
    color="#8b5cf6"
    fillOpacity={0}
    strokeWidth={2}
    showDots
    dotRadius={4}
  />
</RadarChart>
```

### Circle grid

Pass `shape="circle"` to `RadarChart.Grid` to draw perfectly round rings instead of regular polygons — useful when the chart reads as a continuous radial gauge rather than a categorical comparison.

```tsx
<RadarChart
  data={DATA}
  labelKey="category"
  dataKey="score"
  wrapperClassName="h-[280px]"
>
  <RadarChart.Grid shape="circle" />
  <RadarChart.AngleAxis />
  <RadarChart.Radar />
</RadarChart>
```

### With radius axis

Render `RadarChart.RadiusAxis` to label each ring with a numeric tick. Pass `tickFormatter` to format values (units, rounding) and `includeZero` to render the origin tick at the chart center.

```tsx
<RadarChart
  data={DATA}
  labelKey="category"
  dataKey="score"
  maxValue={100}
  wrapperClassName="h-[300px]"
>
  <RadarChart.Grid />
  <RadarChart.AngleAxis />
  <RadarChart.RadiusAxis
    includeZero
    tickFormatter={(value) => `${Math.round(value)}%`}
  />
  <RadarChart.Radar />
</RadarChart>
```

### Fixed scale

Pass `maxValue` on the root to fix the radial scale across all series. This keeps multi-series radars on a shared scale and the chart stable when underlying values change. Without it each series re-normalizes to the local data max.

```tsx
<RadarChart
  data={DATA}
  labelKey="category"
  dataKey="score"
  maxValue={100}
  wrapperClassName="h-[280px]"
>
  <RadarChart.Grid />
  <RadarChart.AngleAxis />
  <RadarChart.Radar />
</RadarChart>
```

### Custom radius-axis spoke

Move `RadarChart.RadiusAxis` to a different spoke with `angle` (degrees, clockwise from 12 o'clock) and pick a horizontal alignment relative to that spoke with `orientation`. Labels rotate with the spoke so they always read along its direction.

```tsx
<RadarChart
  data={DATA}
  labelKey="category"
  dataKey="score"
  maxValue={100}
  wrapperClassName="h-[300px]"
>
  <RadarChart.Grid />
  <RadarChart.AngleAxis />
  <RadarChart.RadiusAxis angle={90} orientation="middle" />
  <RadarChart.Radar />
</RadarChart>
```

### Custom axis font

Pass an `SkFont` built with `useFont` to either axis to override the default `matchFont` system font.

```tsx
import { useFont } from '@shopify/react-native-skia';
import InterMedium from './assets/fonts/Inter-Medium.ttf';

function MyChart() {
  const font = useFont(InterMedium, 12);

  return (
    <RadarChart
      data={DATA}
      labelKey="category"
      dataKey="score"
      wrapperClassName="h-[280px]"
    >
      <RadarChart.Grid />
      <RadarChart.AngleAxis font={font} />
      <RadarChart.Radar />
    </RadarChart>
  );
}
```

### Animate data transitions

Pass an `animate` config to `RadarChart.Radar` to interpolate the Skia polygon path when the underlying `data` (or `dataKey`) changes. Useful for filter swaps, timeframe toggles, or preset switchers.

> Skia can only interpolate paths with the same number of points. If the number of categories changes between renders, the path snaps instead of animating. Keep each dataset's category count consistent when driving `animate` from variable-length data.

```tsx
<RadarChart
  data={DATA}
  labelKey="category"
  dataKey="score"
  maxValue={100}
  wrapperClassName="h-[280px]"
>
  <RadarChart.Grid />
  <RadarChart.AngleAxis />
  <RadarChart.Radar animate={{ type: 'spring' }} />
</RadarChart>
```

## Example

```tsx
import { Card } from 'heroui-native';
import { RadarChart } from 'heroui-native-pro';
import { View } from 'react-native';

type SkillRow = {
  category: string;
  score: number;
};

const SKILLS_DATA: SkillRow[] = [
  { category: 'Design', score: 86 },
  { category: 'Frontend', score: 92 },
  { category: 'Backend', score: 74 },
  { category: 'DevOps', score: 65 },
  { category: 'Testing', score: 78 },
  { category: 'Leadership', score: 70 },
];

export default function SkillAssessmentChart() {
  return (
    <View className="flex-1 w-full px-5 justify-center">
      <Card>
        <Card.Header className="mb-3">
          <Card.Title className="text-base">Skill Assessment</Card.Title>
        </Card.Header>
        <Card.Body className="items-center">
          <RadarChart
            data={SKILLS_DATA}
            labelKey="category"
            dataKey="score"
            maxValue={100}
            wrapperClassName="h-[280px]"
          >
            <RadarChart.Grid />
            <RadarChart.AngleAxis />
            <RadarChart.Radar
              color="#8b5cf6"
              fillOpacity={0.18}
              strokeWidth={2}
              showDots
              dotRadius={3}
              animate={{ type: 'spring', damping: 14, stiffness: 100 }}
            />
          </RadarChart>
        </Card.Body>
      </Card>
    </View>
  );
}
```

## API Reference

### RadarChart

| prop               | type                      | default                      | description                                                                                                                       |
| ------------------ | ------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `children`         | `ReactNode`               | -                            | Compound subcomponents rendered inside the chart canvas (`Grid`, `AngleAxis`, `RadiusAxis`, one or more `Radar`)                  |
| `data`             | `RawData[]`               | -                            | Categorical-axis data rows. Each row contributes one spoke; the label comes from `row[labelKey]` and series values from `dataKey` |
| `labelKey`         | `keyof RawData`           | -                            | Key on each row whose value is the axis label rendered by `RadarChart.AngleAxis`                                                  |
| `dataKey`          | `keyof RawData`           | -                            | Default numeric key plotted by `RadarChart.Radar` when no per-series override is provided                                         |
| `maxValue`         | `number`                  | `Math.max(...data[dataKey])` | Upper bound of the radial scale. Pass an explicit value when comparing charts or when the domain is fixed                         |
| `wrapperClassName` | `string`                  | -                            | Additional Tailwind classes for the outer `View`. Required for chart height (e.g. `h-[280px]`)                                    |
| `animation`        | `RadarChartRootAnimation` | -                            | Animation configuration for the chart root. Accepts `"disable-all"` to cascade animation skipping to every animated compound part |

#### RadarChartRootAnimation

Animation configuration for the root component. Can be:

- `false` or `"disabled"`: Disable only root animations
- `"disable-all"`: Disable all animations including animated compound parts
- `true` or `undefined`: Use default animations
- `object`: Custom animation configuration with a `state` field for the same disabling semantics

The root does not drive any of its own animated styles; its sole animation responsibility is cascading `isAllAnimationsDisabled` to compound parts that do animate (`RadarChart.Radar`).

### RadarChart.Grid

| prop          | type                  | default                    | description                                                                                    |
| ------------- | --------------------- | -------------------------- | ---------------------------------------------------------------------------------------------- |
| `numTicks`    | `number`              | `5`                        | Number of concentric rings (excluding the center). Matches `RadarChart.RadiusAxis.numTicks`    |
| `shape`       | `RadarChartGridShape` | `"polygon"`                | Shape of each concentric ring. `"polygon"` matches `data.length` vertices, `"circle"` is round |
| `showSpokes`  | `boolean`             | `true`                     | Whether to render the radial spokes (one per category) in addition to the rings                |
| `strokeColor` | `Color`               | theme `muted` at 30% alpha | Stroke color for both the rings and the spokes                                                 |
| `strokeWidth` | `number`              | `1`                        | Stroke width for both the rings and the spokes                                                 |

#### RadarChartGridShape

Concentric grid shape.

| value       | description                                                                               |
| ----------- | ----------------------------------------------------------------------------------------- |
| `"polygon"` | Each ring is a closed polygon whose vertex count matches `data.length` (Recharts default) |
| `"circle"`  | Each ring is a true circle, useful for continuous radial gauges                           |

### RadarChart.AngleAxis

| prop           | type             | default            | description                                                                                                             |
| -------------- | ---------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `font`         | `SkFont \| null` | system `matchFont` | Skia font used to render the labels. Build a custom font with `useFont` from `@shopify/react-native-skia`               |
| `color`        | `Color`          | theme `muted`      | Text color for the labels                                                                                               |
| `radiusOffset` | `number`         | `1.05`             | Fractional position of each label along the spoke. `1` sits on the outer ring; `> 1` pushes the labels outside the ring |

### RadarChart.RadiusAxis

| prop            | type                              | default                     | description                                                                                                                                  |
| --------------- | --------------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `angle`         | `number`                          | `0`                         | Spoke angle in **degrees, clockwise from 12 o'clock**. Labels rotate with the spoke so they always read along its direction                  |
| `orientation`   | `RadarChartRadiusAxisOrientation` | `"right"`                   | Horizontal alignment of the tick labels relative to the spoke                                                                                |
| `numTicks`      | `number`                          | `5`                         | Number of tick values to render. Defaults to match `RadarChart.Grid.numTicks` so labels line up with rings                                   |
| `includeZero`   | `boolean`                         | `false`                     | Whether to render an additional `0` label at the chart center. Opt in to match Recharts' default behaviour                                   |
| `dataKey`       | `string`                          | root `dataKey`              | Numeric key used to auto-derive the radial scale when `maxValue` is omitted on the root. Override to align ticks with a specific `Radar` key |
| `font`          | `SkFont \| null`                  | system `matchFont`          | Skia font used to render the tick values                                                                                                     |
| `color`         | `Color`                           | theme `muted`               | Text color for the tick values                                                                                                               |
| `tickFormatter` | `(value: number) => string`       | `String(Math.round(value))` | Formatter applied to each tick value before rendering. Use to add unit suffixes (`"%"`, `"k"`) or round fractional ticks                     |

> When the chart has multiple `RadarChart.Radar` siblings on different keys (or a single `Radar` whose `dataKey` differs from the root's), set `maxValue` on the root so the axis ticks remain truthful across every polygon. Auto-derived scales can only follow one key at a time — `RadarChart.RadiusAxis` defaults to the root's `dataKey` and accepts a `dataKey` override to point at a different series.

#### RadarChartRadiusAxisOrientation

Horizontal alignment of tick labels **relative to the spoke** they sit on.

| value      | description                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------------- |
| `"left"`   | Labels sit to the left of the spoke (text's right edge anchored at the spoke)                   |
| `"middle"` | Labels are centered on the spoke (text's center anchored at the spoke)                          |
| `"right"`  | Labels sit to the right of the spoke (text's left edge anchored at the spoke). Recharts default |

### RadarChart.Radar

| prop          | type                           | default         | description                                                                                                                   |
| ------------- | ------------------------------ | --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `dataKey`     | `string`                       | root `dataKey`  | Numeric key on each row plotted by this series. Override for multi-series radars                                              |
| `color`       | `Color`                        | theme `chart-3` | Stroke + fill color of the polygon                                                                                            |
| `fillOpacity` | `number`                       | `0.3`           | Alpha applied to the polygon fill (the stroke stays fully opaque)                                                             |
| `showStroke`  | `boolean`                      | `true`          | Whether to draw a stroked outline around the polygon                                                                          |
| `strokeWidth` | `number`                       | `2`             | Stroke width applied when `showStroke` is `true`                                                                              |
| `showDots`    | `boolean`                      | `false`         | Whether to render a small filled circle at each polygon vertex (one per category)                                             |
| `dotRadius`   | `number`                       | `3`             | Radius of each vertex dot when `showDots` is `true`                                                                           |
| `animate`     | `RadarChartRadarAnimateConfig` | -               | victory-native path-interpolation config applied when `data` changes. Dropped when cascaded `isAllAnimationsDisabled` is true |

#### RadarChartRadarAnimateConfig

Reanimated config carried via the `animate` prop. Mirrors victory-native's `PathAnimationConfig` — a discriminated union on `type`.

| field  | type                                   | description                                               |
| ------ | -------------------------------------- | --------------------------------------------------------- |
| `type` | `"timing" \| "spring"`                 | Animation kind                                            |
| `...`  | `WithTimingConfig \| WithSpringConfig` | Remaining fields from the corresponding Reanimated config |

When the polygon's `data` changes, the new Skia path is interpolated from the previous frame's path according to this config. Dropped when the root cascade sets `animation="disable-all"`.
