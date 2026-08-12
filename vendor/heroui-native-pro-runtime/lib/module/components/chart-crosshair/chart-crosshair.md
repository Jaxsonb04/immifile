# ChartCrosshair

A vertical rule and tooltip overlay that highlight the pressed point on a chart.

## Import

```tsx
import { ChartCrosshair } from 'heroui-native-pro';
```

## Anatomy

```tsx
<ChartCrosshair.Anchor chartBounds={...} isActive={...} x={...}>
  <SomeHeroUINative.Chart>
    {({ chartBounds }) => (
      <ChartCrosshair x={...} top={chartBounds.top} bottom={chartBounds.bottom} />
    )}
  </SomeHeroUINative.Chart>
  <ChartCrosshair.Value value={...}>
    <ChartCrosshair.ValueLabel />
  </ChartCrosshair.Value>
</ChartCrosshair.Anchor>
```

- **ChartCrosshair**: Skia vertical rule (`Path`) drawn from `(x, top)` to `(x, bottom)`. Renders dashed by default via `DashPathEffect`; pass `variant="solid"` for an unbroken stroke. Render inside the chart canvas with `useChartPressState`-driven shared values.
- **ChartCrosshair.Anchor**: Relatively positioned React Native `View` that wraps the chart and the sibling RN value overlay. Supplies crosshair context (`x`, `isActive`, `chartBounds`) so descendants can position themselves on the same coordinate system as the Skia rule.
- **ChartCrosshair.Value**: Absolutely positioned animated overlay that hosts the tooltip pill. Measures its own width to center on `x`, clamps to `chartBounds`, and tracks press activity via `isActive` opacity. Must be a descendant of `ChartCrosshair.Anchor`.
- **ChartCrosshair.ValueLabel**: Read-only animated label backed by an internal `ReText` (read-only Reanimated `TextInput`). Reads the `value` shared string from `ChartCrosshair.Value` context, so the label updates on the UI thread without React renders.

## Usage

> When wrapping a chart with `ChartCrosshair.Anchor`, the chart's `wrapperClassName` must not contain padding (e.g. `p-*`, `px-*`, `py-*`). The anchor reads `chartBounds` in the same coordinate space as the Skia canvas, so any padding on the wrapper offsets the chart relative to the anchor and breaks centering / clamping of `ChartCrosshair.Value`. Apply spacing on a parent container instead.

### Basic usage

Render `ChartCrosshair` inside the chart's render callback. Drive `x` from `useChartPressState`, and pass `top` / `bottom` from `chartBounds`. Gate visibility with `isActive` from the same hook.

```tsx
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
  {({ points, chartBounds }) => (
    <>
      <LineChart.Line points={points.revenue} />
      {isActive ? (
        <ChartCrosshair
          x={state.x.position}
          top={chartBounds.top}
          bottom={chartBounds.bottom}
        />
      ) : null}
    </>
  )}
</LineChart>;
```

### Variants

Switch the rule style with the `variant` prop. `dashed` attaches a themed `DashPathEffect`; `solid` renders an unbroken stroke.

```tsx
<ChartCrosshair x={state.x.position} top={chartBounds.top} bottom={chartBounds.bottom} variant="dashed" />
<ChartCrosshair x={state.x.position} top={chartBounds.top} bottom={chartBounds.bottom} variant="solid" />
```

### Custom dash pattern

Override the dashed pattern by nesting your own Skia `DashPathEffect` as a child.

```tsx
import { DashPathEffect } from '@shopify/react-native-skia';

<ChartCrosshair
  x={state.x.position}
  top={chartBounds.top}
  bottom={chartBounds.bottom}
>
  <DashPathEffect intervals={[6, 3]} />
</ChartCrosshair>;
```

### Custom color and stroke width

Pass `color` and `strokeWidth` directly to override the themed defaults.

```tsx
<ChartCrosshair
  x={state.x.position}
  top={chartBounds.top}
  bottom={chartBounds.bottom}
  color="#8b5cf6"
  strokeWidth={2}
/>
```

### Tooltip overlay

Wrap the chart and the value pill in `ChartCrosshair.Anchor`, then render `ChartCrosshair.Value` as a sibling **outside** the chart. Build the label string on the UI thread with `useDerivedValue` and pass it as `value`. Mirror Skia `chartBounds` from `onChartBoundsChange` so the overlay clamps correctly near the plot edges.

> Keep `wrapperClassName` free of padding on the wrapped chart — the anchor measures positions in the chart's native coordinate space.

```tsx
const { state, isActive } = useChartPressState({
  x: '' as string,
  y: { revenue: 0 },
});

const [chartBounds, setChartBounds] = useState<ChartBounds | null>(null);

const labelText = useDerivedValue(() => `${state.y.revenue.value.get()}`);

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
    wrapperClassName="h-[200px]"
  >
    {({ points, chartBounds: bounds }) => (
      <>
        <LineChart.Line points={points.revenue} />
        {isActive ? (
          <ChartCrosshair
            x={state.x.position}
            top={bounds.top}
            bottom={bounds.bottom}
          />
        ) : null}
      </>
    )}
  </LineChart>
  <ChartCrosshair.Value value={labelText} />
</ChartCrosshair.Anchor>;
```

### Value variants

Switch the pill surface with the `variant` prop on `ChartCrosshair.Value`. `default` renders a filled rounded pill; `ghost` renders a transparent label-only surface.

```tsx
<ChartCrosshair.Value value={labelText} variant="default" />
<ChartCrosshair.Value value={labelText} variant="ghost" />
```

### Value placement

Position the pill above (`top`) or below (`bottom`) the anchor with the `placement` prop.

```tsx
<ChartCrosshair.Value value={labelText} placement="top" />
<ChartCrosshair.Value value={labelText} placement="bottom" />
```

### Value offset

Nudge the overlay without fighting the animated style. `offset` accepts CSS-like additive `top` / `bottom` / `left` / `right` pixels.

> The animated style owns vertical edge (`top` / `bottom`) and horizontal `transform.translateX`, so do not override those via `className` or `styles.container`. Use `offset` instead.

```tsx
<ChartCrosshair.Value
  value={labelText}
  placement="top"
  offset={{ top: 8, left: 4 }}
/>
```

### Custom value content

Compose extra content (e.g. icons, prefixes) by passing children. The default label is replaced by the children — render `ChartCrosshair.ValueLabel` explicitly to keep the animated text alongside your custom nodes.

```tsx
<ChartCrosshair.Value value={labelText}>
  <View className="flex-row items-center gap-1 px-2 py-1">
    <DollarIcon />
    <ChartCrosshair.ValueLabel />
  </View>
</ChartCrosshair.Value>
```

## Example

```tsx
import { Card } from 'heroui-native';
import { ChartCrosshair, ChartIndicator, LineChart } from 'heroui-native-pro';
import { useState } from 'react';
import { View } from 'react-native';
import { useDerivedValue } from 'react-native-reanimated';
import type { ChartBounds } from 'victory-native';
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

export default function CrosshairChartExample() {
  const { state, isActive } = useChartPressState({
    x: '' as string,
    y: { revenue: 0 },
  });

  const [chartBounds, setChartBounds] = useState<ChartBounds | null>(null);

  const tooltipLabel = useDerivedValue(() => `${state.y.revenue.value.get()}`);

  return (
    <View className="flex-1 w-full px-5 justify-center">
      <Card>
        <Card.Header className="mb-10 gap-1">
          <Card.Title className="text-sm">Monthly Revenue</Card.Title>
        </Card.Header>
        <Card.Body>
          <ChartCrosshair.Anchor
            chartBounds={chartBounds ?? undefined}
            isActive={state.isActive}
            x={state.x.position}
          >
            <LineChart
              data={REVENUE_DATA}
              xKey="month"
              yKeys={['revenue']}
              chartPressState={state}
              yAxis={[{ formatYLabel: formatThousandsCurrency }]}
              wrapperClassName="h-[200px]"
              onChartBoundsChange={setChartBounds}
            >
              {({ points, chartBounds: bounds }) => (
                <>
                  <LineChart.Line
                    points={points.revenue}
                    curveType="monotoneX"
                  />
                  {isActive ? (
                    <>
                      <ChartCrosshair
                        bottom={bounds.bottom}
                        top={bounds.top}
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
            </LineChart>
            <ChartCrosshair.Value value={tooltipLabel} />
          </ChartCrosshair.Anchor>
        </Card.Body>
      </Card>
    </View>
  );
}
```

## API Reference

### ChartCrosshair

| prop               | type                          | default    | description                                                                                  |
| ------------------ | ----------------------------- | ---------- | -------------------------------------------------------------------------------------------- |
| `x`                | `SharedValue<number>`         | -          | Horizontal position of the rule, typically `state.x.position` from `useChartPressState`      |
| `top`              | `number`                      | -          | Top y-coordinate (Skia canvas pixels) where the rule starts. Typically `chartBounds.top`     |
| `bottom`           | `number`                      | -          | Bottom y-coordinate (Skia canvas pixels) where the rule ends. Typically `chartBounds.bottom` |
| `variant`          | `ChartCrosshairVariant`       | `'dashed'` | Visual style of the rule. `'dashed'` attaches a themed `DashPathEffect`                      |
| `color`            | `Color`                       | -          | Skia stroke color. Falls back to a themed muted color when omitted                           |
| `strokeWidth`      | `number`                      | `1`        | Stroke width in logical pixels                                                               |
| `children`         | `ReactNode`                   | -          | Optional Skia children (e.g. a custom `DashPathEffect`) to nest inside the `Path`            |
| `...SkiaPathProps` | `ComponentProps<typeof Path>` | -          | Remaining Skia `Path` props. `path`, `style`, `start`, and `end` are controlled internally   |

#### ChartCrosshairVariant

| type                  | description                                                        |
| --------------------- | ------------------------------------------------------------------ |
| `'solid' \| 'dashed'` | Visual style of the rule. `'dashed'` attaches a themed dash effect |

### ChartCrosshair.Anchor

| prop           | type                   | default | description                                                                              |
| -------------- | ---------------------- | ------- | ---------------------------------------------------------------------------------------- |
| `children`     | `ReactNode`            | -       | The chart and sibling `ChartCrosshair.Value` overlay                                     |
| `chartBounds`  | `ChartBounds`          | -       | Plot bounds mirrored from the chart's `onChartBoundsChange`. Enables horizontal clamping |
| `isActive`     | `SharedValue<boolean>` | -       | Press activity shared value used to drive overlay opacity                                |
| `x`            | `SharedValue<number>`  | -       | Horizontal crosshair position in chart space (`state.x.position`)                        |
| `...ViewProps` | `ViewProps`            | -       | All standard React Native View props are supported                                       |

### ChartCrosshair.Value

| prop           | type                           | default     | description                                                                                                        |
| -------------- | ------------------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------ |
| `value`        | `SharedValue<string>`          | -           | Shared label string forwarded to `ChartCrosshair.ValueLabel` via context                                           |
| `variant`      | `ChartCrosshairValueVariant`   | `'default'` | Visual variant for the pill container                                                                              |
| `placement`    | `ChartCrosshairValuePlacement` | `'top'`     | Whether the pill sits above (`'top'`) or below (`'bottom'`) the anchor                                             |
| `offset`       | `ChartCrosshairValueOffset`    | -           | Pixel offsets applied on top of the auto-centering animated style. CSS-like additive `top`/`bottom`/`left`/`right` |
| `className`    | `string`                       | -           | Additional classes merged onto the `container` slot                                                                |
| `classNames`   | `ElementSlots<ValueSlots>`     | -           | Additional classes per slot (`container`, `label`)                                                                 |
| `styles`       | `ChartCrosshairValueStyles`    | -           | Inline style overrides per slot                                                                                    |
| `children`     | `ReactNode`                    | -           | Optional content rendered after (or replacing) the default label                                                   |
| `...ViewProps` | `Omit<ViewProps, 'children'>`  | -           | All standard React Native View props are supported except `children` (typed above)                                 |

#### ChartCrosshairValueVariant

| type                   | description                                                |
| ---------------------- | ---------------------------------------------------------- |
| `'default' \| 'ghost'` | Pill surface variant. `'ghost'` removes background and pad |

#### ChartCrosshairValuePlacement

| type                | description                                          |
| ------------------- | ---------------------------------------------------- |
| `'top' \| 'bottom'` | Vertical placement of the overlay relative to anchor |

#### ChartCrosshairValueOffset

Pixel offsets applied to the animated overlay on top of auto-centering. Values are CSS-like additive — use this prop instead of overriding `top` / `bottom` / `transform` via `className` or `styles`, since those properties are owned by the animated style and will be overwritten on every frame.

| prop     | type     | default | description                                                                     |
| -------- | -------- | ------- | ------------------------------------------------------------------------------- |
| `top`    | `number` | `0`     | Vertical inset that pushes the overlay down (positive)                          |
| `bottom` | `number` | `0`     | Vertical inset that pushes the overlay up (positive)                            |
| `left`   | `number` | `0`     | Horizontal pixel offset added to `translateX`. Positive values push right       |
| `right`  | `number` | `0`     | Horizontal pixel offset subtracted from `translateX`. Positive values push left |

#### ElementSlots\<ValueSlots\>

| slot        | description                                                                  |
| ----------- | ---------------------------------------------------------------------------- |
| `container` | Outer animated `Animated.View` that hosts the pill                           |
| `label`     | Default label slot classes merged onto the inner `ChartCrosshair.ValueLabel` |

#### styles

| slot        | type        | description                                        |
| ----------- | ----------- | -------------------------------------------------- |
| `container` | `ViewStyle` | Style for the animated overlay `Animated.View`     |
| `label`     | `TextStyle` | Style for the read-only animated `TextInput` label |

### ChartCrosshair.ValueLabel

Reads the animated string from `ChartCrosshair.Value` context — the `value` is **never** a prop. Extra props forward to the underlying `ReText` / `TextInput`.

| prop                | type                                                                       | default | description                                                 |
| ------------------- | -------------------------------------------------------------------------- | ------- | ----------------------------------------------------------- |
| `className`         | `string`                                                                   | -       | Additional classes merged with the default label typography |
| `style`             | `AnimatedProps<TextInputProps>['style']`                                   | -       | Animated style for the `TextInput` / `ReText` surface       |
| `...TextInputProps` | `Omit<TextInputProps, 'children' \| 'defaultValue' \| 'style' \| 'value'>` | -       | All standard `TextInput` props except the excluded ones     |

## Hooks

### useChartCrosshairAnchor

Hook to access the `ChartCrosshair.Anchor` context. Must be used within a `ChartCrosshair.Anchor` subtree.

```tsx
import { useChartCrosshairAnchor } from 'heroui-native-pro';

const { x, isActive, chartBounds } = useChartCrosshairAnchor();
```

#### Returns: ChartCrosshairAnchorContextValue

| property      | type                   | description                                               |
| ------------- | ---------------------- | --------------------------------------------------------- |
| `x`           | `SharedValue<number>`  | Horizontal crosshair position in chart space              |
| `isActive`    | `SharedValue<boolean>` | Press activity shared value (overlay opacity tracks this) |
| `chartBounds` | `ChartBounds`          | Latest Skia plot bounds, when available                   |

### useChartCrosshairValue

Hook to access the `ChartCrosshair.Value` context. Must be used within a `ChartCrosshair.Value` subtree.

```tsx
import { useChartCrosshairValue } from 'heroui-native-pro';

const { value } = useChartCrosshairValue();
```

#### Returns: ChartCrosshairValueContextValue

| property | type                  | description                                      |
| -------- | --------------------- | ------------------------------------------------ |
| `value`  | `SharedValue<string>` | Animated label string from the root `value` prop |
