# RadialChart

A radial chart for gauge, progress ring, and circular data visualizations with customizable arcs and labels.

> `RadialChart` is built on top of [victory-native](https://nearform.com/open-source/victory-native/docs/), reusing its `PolarChart` for canvas + measurement. victory-native does not ship a radial-bar primitive — every ring (value arc + optional background track) is rendered with `@shopify/react-native-skia` stroked arc paths. For full context on chart props and rendering internals, read the [victory-native docs](https://nearform.com/open-source/victory-native/docs/) alongside this page.

## Import

```tsx
import { RadialChart } from 'heroui-native-pro';
```

## Anatomy

```tsx
<RadialChart data={...} labelKey="..." valueKey="..." colorKey="...">
  <RadialChart.Bar background />
</RadialChart>
```

- **RadialChart**: Root container that wraps `victory-native` `PolarChart` in a themed outer `View`. Publishes `data`, keys, angles, radii, and measured canvas size to compound subcomponents through an internal layout context.
- **RadialChart.Bar**: Renders all concentric rounded arc rings. Row `0` is the innermost ring. Optional `background` draws a full-domain track behind each ring (theme `default` by default).

Center labels and side legends are composed by consumers with absolute overlays — see the example screen's "Energy Activity" variant.

## Usage

### Basic usage

Provide `data`, `labelKey`, `valueKey`, and `colorKey`. Height and width are supplied through `wrapperClassName`.

By default the angle domain is `[0, "auto"]` — the upper bound resolves to the maximum `valueKey` in `data`, so the largest value fills the full angle span.

```tsx
<RadialChart
  data={DATA}
  labelKey="name"
  valueKey="value"
  colorKey="color"
  wrapperClassName="w-[200px]"
>
  <RadialChart.Bar background />
</RadialChart>
```

### Fixed scale (gauge / progress)

Pass `domain={[0, 100]}` on the root to fix the angle-axis domain so arc sweep maps directly to a percentage.

```tsx
<RadialChart
  data={[{ name: 'Score', value: 78, color: '#8b5cf6' }]}
  labelKey="name"
  valueKey="value"
  colorKey="color"
  domain={[0, 100]}
  innerRadius="72%"
  wrapperClassName="w-[220px]"
>
  <RadialChart.Bar background cornerRadius={14} />
</RadialChart>
```

### Even band distribution

By default `barGap={4}` stacks rings with a fixed pixel gap and `barSize`. Pass `barGap="auto"` to distribute bands evenly from `innerRadius` to `outerRadius`.

```tsx
<RadialChart
  data={DATA}
  labelKey="name"
  valueKey="value"
  colorKey="color"
  barGap="auto"
>
  <RadialChart.Bar background />
</RadialChart>
```

### Progress ring (single row)

A single data row with `innerRadius` tuned for a thick ring reads as a progress indicator.

```tsx
<RadialChart
  data={[{ name: 'Progress', value: 72, color: '#8b5cf6' }]}
  labelKey="name"
  valueKey="value"
  colorKey="color"
  domain={[0, 100]}
  innerRadius="70%"
  wrapperClassName="w-[180px]"
>
  <RadialChart.Bar background cornerRadius={12} />
</RadialChart>
```

### Animated sweep

Pass `animate` to `RadialChart.Bar` so ring fills interpolate when `data` changes.

```tsx
<RadialChart
  data={DATA}
  labelKey="name"
  valueKey="value"
  colorKey="color"
  wrapperClassName="w-[200px]"
>
  <RadialChart.Bar
    background
    animate={{ type: 'spring', damping: 14, stiffness: 100 }}
  />
</RadialChart>
```

### Disable animations

Cascade `"disable-all"` from the root to snap rings to their target sweep instantly.

```tsx
<RadialChart
  data={DATA}
  labelKey="name"
  valueKey="value"
  colorKey="color"
  animation="disable-all"
  wrapperClassName="w-[200px]"
>
  <RadialChart.Bar background animate={{ type: 'timing', duration: 600 }} />
</RadialChart>
```

## Example

```tsx
import { Card } from 'heroui-native';
import { RadialChart } from 'heroui-native-pro';
import { View } from 'react-native';
import { AppText } from './app-text';

const energyData = [
  {
    name: 'Calories',
    value: 200,
    color: '#a78bfa',
    valueText: '1,623/2,000 kcal',
  },
  {
    name: 'Steps',
    value: 350,
    color: '#8b5cf6',
    valueText: '8,328/10,000 steps',
  },
  { name: 'Exercise', value: 250, color: '#7c3aed', valueText: '25/120 min' },
];

export default function EnergyActivityCard() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Energy Activity</Card.Title>
      </Card.Header>
      <Card.Body className="flex-row items-center gap-4">
        <View className="flex-1 flex-col gap-2">
          {energyData.map((item) => (
            <View key={item.name}>
              <AppText className="text-muted text-xs">{item.name}</AppText>
              <AppText className="text-foreground text-sm font-semibold">
                {item.valueText}
              </AppText>
            </View>
          ))}
        </View>
        <View className="relative h-[200px] w-[200px] shrink-0">
          <RadialChart
            data={energyData}
            labelKey="name"
            valueKey="value"
            colorKey="color"
            innerRadius="40%"
            outerRadius="100%"
            wrapperClassName="absolute inset-0 size-[200px]"
          >
            <RadialChart.Bar background />
          </RadialChart>
          <View
            pointerEvents="none"
            className="absolute inset-0 items-center justify-center"
          >
            <AppText className="text-muted text-[10px]">Calories</AppText>
            <AppText className="text-foreground text-sm font-semibold">
              700 kcal
            </AppText>
          </View>
        </View>
      </Card.Body>
    </Card>
  );
}
```

## API Reference

### RadialChart

Extends [victory-native `PolarChart`](https://nearform.com/open-source/victory-native/docs/polar/polar-chart) — all `PolarChart` props (`data`, `labelKey`, `valueKey`, `colorKey`, `canvasStyle`, etc.) are supported in addition to the RadialChart-specific props below.

| prop               | type                                   | default       | description                                                                                                              |
| ------------------ | -------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `children`         | `ReactNode`                            | -             | Compound subcomponents rendered inside the chart canvas (typically `.Bar`)                                               |
| `domain`           | `[number \| "auto", number \| "auto"]` | `[0, "auto"]` | Angle-axis domain; `"auto"` bounds resolve from data                                                                     |
| `startAngle`       | `number`                               | `90`          | Start angle in degrees (clockwise from 12 o'clock)                                                                       |
| `endAngle`         | `number`                               | `-270`        | End angle in degrees — with default `startAngle`, spans a full circle                                                    |
| `innerRadius`      | `number \| \`${number}%\``             | `"40%"`       | Inner bound of the bar area                                                                                              |
| `outerRadius`      | `number \| \`${number}%\``             | `"100%"`      | Outer bound of the bar area                                                                                              |
| `barSize`          | `number`                               | `10`          | Default bar thickness in pixels                                                                                          |
| `barGap`           | `number \| "auto"`                     | `4`           | Gap in pixels between rings, or `"auto"` to distribute evenly across the annulus                                         |
| `wrapperClassName` | `string`                               | -             | Tailwind classes for the outer `View`; constrains sizing on top of the default `w-full aspect-square` (e.g. `w-[200px]`) |
| `animation`        | `RadialChartRootAnimation`             | -             | Root animation config; cascades `"disable-all"` to `RadialChart.Bar`                                                     |

#### RadialChartRootAnimation

Animation configuration for the root component. Can be:

- `false` or `"disabled"`: Disable only root animations
- `"disable-all"`: Disable all animations including `RadialChart.Bar` sweep fills
- `true` or `undefined`: Use default animations
- `object`: Custom animation configuration with a `state` field for the same disabling semantics

### RadialChart.Bar

| prop           | type                          | default         | description                                                                                           |
| -------------- | ----------------------------- | --------------- | ----------------------------------------------------------------------------------------------------- |
| `background`   | `boolean`                     | `true`          | Draw a full-domain background track behind each ring                                                  |
| `barSize`      | `number`                      | root `barSize`  | Bar thickness in pixels                                                                               |
| `cornerRadius` | `number`                      | `12`            | Values `> 0` enable round stroke caps; `0` uses butt caps                                             |
| `trackColor`   | `Color`                       | theme `default` | Stroke color for background tracks when `background` is enabled                                       |
| `animate`      | `RadialChartBarAnimateConfig` | -               | Reanimated timing/spring config for sweep-fill animation; dropped when root `animation="disable-all"` |

#### RadialChartBarAnimateConfig

Reanimated config carried via the `animate` prop. Mirrors victory-native's `PathAnimationConfig` — a discriminated union on `type` (`"timing"` or `"spring"`).

| field  | type                                   | description                                               |
| ------ | -------------------------------------- | --------------------------------------------------------- |
| `type` | `"timing" \| "spring"`                 | Animation kind                                            |
| `...`  | `WithTimingConfig \| WithSpringConfig` | Remaining fields from the corresponding Reanimated config |
