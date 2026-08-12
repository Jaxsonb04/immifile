# ChartIndicator

A themed Skia double-dot (outer halo + inner) marker that follows the pressed point on a chart.

## Import

```tsx
import { ChartIndicator } from 'heroui-native-pro';
```

## Usage

### Basic usage

Render `ChartIndicator` inside the chart's render callback. Drive `x` and `y` from `useChartPressState` and gate visibility with `isActive` from the same hook.

```tsx
const { state, isActive } = useChartPressState({
  x: 0,
  y: { value: 0 },
});

<LineChart
  data={DATA}
  xKey="day"
  yKeys={['value']}
  chartPressState={state}
  wrapperClassName="h-48"
>
  {({ points }) => (
    <>
      <LineChart.Line points={points.value} />
      {isActive ? (
        <ChartIndicator x={state.x.position} y={state.y.value.position} />
      ) : null}
    </>
  )}
</LineChart>;
```

### Custom radius

Override the default radii with `innerRadius` (default `5`) and `outerRadius` (default `7`).

```tsx
<ChartIndicator
  x={state.x.position}
  y={state.y.value.position}
  innerRadius={6}
  outerRadius={10}
/>
```

### Custom colors

Override the themed defaults with `innerColor` and `outerColor`. The outer halo defaults to the `--color-background` token; the inner dot defaults to `--color-chart-3`.

```tsx
<ChartIndicator
  x={state.x.position}
  y={state.y.value.position}
  innerColor="#8b5cf6"
  outerColor="#ffffff"
/>
```

### Forwarding Skia props

Any extra Skia `Circle` props are forwarded to the **inner** circle only. Use this to add effects such as a stroke or opacity.

```tsx
<ChartIndicator
  x={state.x.position}
  y={state.y.value.position}
  opacity={0.9}
  style="stroke"
  strokeWidth={2}
/>
```

## Example

```tsx
import { Card } from 'heroui-native';
import { ChartIndicator, LineChart } from 'heroui-native-pro';
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

export default function ChartIndicatorExample() {
  const { state, isActive } = useChartPressState({
    x: '' as string,
    y: { revenue: 0 },
  });

  return (
    <View className="flex-1 w-full px-5 justify-center">
      <Card>
        <Card.Header className="mb-10 gap-1">
          <Card.Title className="text-sm">Monthly Revenue</Card.Title>
        </Card.Header>
        <Card.Body>
          <LineChart
            data={REVENUE_DATA}
            xKey="month"
            yKeys={['revenue']}
            chartPressState={state}
            wrapperClassName="h-48"
          >
            {({ points }) => (
              <>
                <LineChart.Line points={points.revenue} curveType="monotoneX" />
                {isActive ? (
                  <ChartIndicator
                    x={state.x.position}
                    y={state.y.revenue.position}
                  />
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

### ChartIndicator

| prop                 | type                            | default              | description                                                                                                              |
| -------------------- | ------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `x`                  | `SharedValue<number>`           | -                    | Horizontal position of the indicator center, typically `state.x.position`                                                |
| `y`                  | `SharedValue<number>`           | -                    | Vertical position of the indicator center, typically `state.y[yKey].position`                                            |
| `innerRadius`        | `number`                        | `5`                  | Radius of the inner (front) circle in logical pixels                                                                     |
| `outerRadius`        | `number`                        | `7`                  | Radius of the outer (halo) circle in logical pixels                                                                      |
| `outerColor`         | `Color`                         | `--color-background` | Fill color for the outer halo. Falls back to the themed background CSS variable                                          |
| `innerColor`         | `Color`                         | `--color-chart-3`    | Fill color for the inner dot. Falls back to the themed chart-3 CSS variable                                              |
| `...SkiaCircleProps` | `ComponentProps<typeof Circle>` | -                    | Remaining Skia `Circle` props forwarded to the inner circle. `cx`, `cy`, `c`, `r`, and `color` are controlled internally |
