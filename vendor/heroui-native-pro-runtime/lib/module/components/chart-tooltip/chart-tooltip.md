# ChartTooltip

A composable tooltip for chart data points with customizable indicators, labels, and value formatters.

> **Cartesian charts only.** `ChartTooltip` is driven by victory-native's Cartesian press state (`useChartPressState` → `state.x.position`, `state.y[yKey].position`, `state.matchedIndex`, `state.isActive`) and clamps against `chartBounds` from `onChartBoundsChange`. It works with `LineChart`, `BarChart`, `AreaChart`, and `ComposedChart`. It does **not** support polar charts (`PieChart` / `PolarChart`), which expose no press positions, `matchedIndex`, or `chartBounds` — there is no anchor coordinate for the card to follow. For pie/donut selection labels, render your own label inside the `PieChart.Pie` render callback instead.

## Import

```tsx
import { ChartTooltip, useChartTooltipAnchor } from 'heroui-native-pro';
```

## Anatomy

```tsx
<ChartTooltip.Anchor
  chartBounds={...}
  isActive={state.isActive}
  matchedIndex={state.matchedIndex}
  x={state.x.position}
  y={state.y[yKey].position}
>
  <SomeHeroUINative.Chart>...</SomeHeroUINative.Chart>
  <ChartTooltip>
    <ChartTooltip.Header />
    <ChartTooltip.Item>
      <ChartTooltip.Indicator color="..." />
      <ChartTooltip.Label />
      <ChartTooltip.Value />
    </ChartTooltip.Item>
  </ChartTooltip>
</ChartTooltip.Anchor>
```

- **ChartTooltip**: Floating card root. Measures itself, follows the `(x, y)` anchor, clamps inside `chartBounds` on both axes, and fades with press activity when `isVisible="auto"`. Must be a descendant of `ChartTooltip.Anchor`.
- **ChartTooltip.Anchor**: Relatively positioned React Native `View` that wraps the chart and sibling tooltip. Supplies press coordinates, `activeIndex`, and plot bounds via context.
- **ChartTooltip.Header**: Optional title row (typically the X-axis category label).
- **ChartTooltip.Item**: One series row (`flex-row` with indicator, label, and value).
- **ChartTooltip.Indicator**: Color swatch beside a series name.
- **ChartTooltip.Label**: Series name within an item row.
- **ChartTooltip.Value**: Formatted data value within an item row.

## Usage

> When wrapping a chart with `ChartTooltip.Anchor`, the chart's `wrapperClassName` must not contain padding (e.g. `p-*`, `px-*`, `py-*`). The anchor reads `chartBounds` in the same coordinate space as the Skia canvas, so any padding on the wrapper offsets the chart relative to the anchor and breaks positioning / clamping of `ChartTooltip`. Apply spacing on a parent container instead.

### Basic usage

Pass `state.isActive`, `state.matchedIndex`, and press positions to `ChartTooltip.Anchor`. Read the bridged `activeIndex` from `useChartTooltipAnchor()` inside a descendant to map tooltip rows from your data array. Visibility fades automatically with press activity (`isVisible="auto"` is the default).

```tsx
const { state, isActive } = useChartPressState({
  x: '' as string,
  y: { revenue: 0, orders: 0 },
});

const [chartBounds, setChartBounds] = useState<ChartBounds | null>(null);

function OrdersTooltip() {
  const { activeIndex } = useChartTooltipAnchor();
  const activeRow = activeIndex != null ? DATA[activeIndex] : null;

  return (
    <ChartTooltip>
      <ChartTooltip.Header>{activeRow?.month ?? ''}</ChartTooltip.Header>
      <ChartTooltip.Item>
        <ChartTooltip.Indicator color="#6366f1" />
        <ChartTooltip.Label>Revenue</ChartTooltip.Label>
        <ChartTooltip.Value>
          ${activeRow?.revenue.toLocaleString() ?? ''}
        </ChartTooltip.Value>
      </ChartTooltip.Item>
      <ChartTooltip.Item>
        <ChartTooltip.Indicator color="#f97316" variant="line" />
        <ChartTooltip.Label>Orders</ChartTooltip.Label>
        <ChartTooltip.Value>
          {activeRow?.orders.toLocaleString() ?? ''}
        </ChartTooltip.Value>
      </ChartTooltip.Item>
    </ChartTooltip>
  );
}

<ChartTooltip.Anchor
  chartBounds={chartBounds}
  isActive={state.isActive}
  matchedIndex={state.matchedIndex}
  x={state.x.position}
  y={state.y.orders.position}
>
  <ComposedChart
    data={DATA}
    xKey="month"
    yKeys={['revenue', 'orders']}
    chartPressState={state}
    onChartBoundsChange={setChartBounds}
    wrapperClassName="h-[220px]"
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
  <OrdersTooltip />
</ChartTooltip.Anchor>;
```

### Visibility

Control tooltip visibility with `isVisible` on `ChartTooltip`:

- `'auto'` (default) — fades with press activity from the anchor.
- `true` — always visible.
- `false` — not rendered.

```tsx
<ChartTooltip isVisible="auto">...</ChartTooltip>
<ChartTooltip isVisible={false}>...</ChartTooltip>
```

### Indicator variants

Set the swatch shape on each `ChartTooltip.Indicator` with `variant`. `'dot'` renders a circular marker; `'line'` renders a narrow vertical pill suited to line-series tooltips.

```tsx
<ChartTooltip.Item>
  <ChartTooltip.Indicator color="#6366f1" variant="dot" />
  <ChartTooltip.Label>Revenue</ChartTooltip.Label>
  <ChartTooltip.Value>$4,200</ChartTooltip.Value>
</ChartTooltip.Item>
```

### Placement

Position the tooltip above (`top`) or below (`bottom`) the `(x, y)` anchor with the `placement` prop on `ChartTooltip`.

```tsx
<ChartTooltip placement="top">...</ChartTooltip>
<ChartTooltip placement="bottom">...</ChartTooltip>
```

### Offset and clamping

Nudge the overlay without fighting the animated style. `offset` accepts CSS-like additive `top` / `bottom` / `left` / `right` pixels. When `chartBounds` is supplied on `ChartTooltip.Anchor`, `ChartTooltip` clamps its position so the card stays inside the plot box on both axes.

> The animated style owns `transform` and `opacity`, so do not override those via `className`. Use `offset` instead.

```tsx
<ChartTooltip placement="top" gap={12} offset={{ top: 8, left: 4 }}>
  ...
</ChartTooltip>
```

### Motion animation

The card springs to follow the press indicator by default (`withSpring`, no config). Control the motion type and config with the `animation` prop on `ChartTooltip`. Pass `false` / `"disabled"` to snap instantly.

```tsx
<ChartTooltip animation={{ type: 'spring', damping: 18, stiffness: 160 }}>...</ChartTooltip>
<ChartTooltip animation={{ type: 'timing', duration: 200 }}>...</ChartTooltip>
<ChartTooltip animation={false}>...</ChartTooltip>
```

Disable all tooltip animations (including descendants) by cascading from the anchor:

```tsx
<ChartTooltip.Anchor animation="disable-all" ...>
  ...
</ChartTooltip.Anchor>
```

## Accessibility

Sensible accessibility defaults are applied; every default is overridable via the matching prop.

- **ChartTooltip** is a polite live region (`accessibilityRole="summary"`, `accessibilityLiveRegion="polite"`) so screen readers announce the active values as the press selection changes.
- **ChartTooltip.Item** is an accessible group (`accessible`, `accessibilityRole="text"`) so its label and value are read together as one node (e.g. "Revenue, $4,200").
- **ChartTooltip.Indicator** is decorative and hidden from screen readers (`accessible={false}`, `aria-hidden`, `accessibilityElementsHidden`, `importantForAccessibility="no-hide-descendants"`).
- **ChartTooltip.Header** uses `accessibilityRole="header"`; **ChartTooltip.Label** / **ChartTooltip.Value** use `accessibilityRole="text"`.

```tsx
<ChartTooltip accessibilityLabel="Revenue and orders for the selected month">
  <ChartTooltip.Header>Mar</ChartTooltip.Header>
  <ChartTooltip.Item accessibilityLabel="Revenue 4,200 dollars">
    <ChartTooltip.Indicator color="#6366f1" />
    <ChartTooltip.Label>Revenue</ChartTooltip.Label>
    <ChartTooltip.Value>$4,200</ChartTooltip.Value>
  </ChartTooltip.Item>
</ChartTooltip>
```

## Example

```tsx
import { Card } from 'heroui-native';
import {
  ChartCrosshair,
  ChartIndicator,
  ChartTooltip,
  ComposedChart,
  useChartTooltipAnchor,
} from 'heroui-native-pro';
import { useState } from 'react';
import { View } from 'react-native';
import type { ChartBounds } from 'victory-native';
import { useChartPressState } from 'victory-native';

const DATA = [
  { month: 'Jan', revenue: 4200, orders: 320 },
  { month: 'Feb', revenue: 5800, orders: 450 },
];

function TooltipBody() {
  const { activeIndex } = useChartTooltipAnchor();
  const activeRow = activeIndex != null ? DATA[activeIndex] : null;

  return (
    <ChartTooltip>
      <ChartTooltip.Header>{activeRow?.month ?? ''}</ChartTooltip.Header>
      <ChartTooltip.Item>
        <ChartTooltip.Indicator color="#6366f1" />
        <ChartTooltip.Label>Revenue</ChartTooltip.Label>
        <ChartTooltip.Value>
          ${activeRow?.revenue.toLocaleString() ?? ''}
        </ChartTooltip.Value>
      </ChartTooltip.Item>
      <ChartTooltip.Item>
        <ChartTooltip.Indicator color="#f97316" variant="line" />
        <ChartTooltip.Label>Orders</ChartTooltip.Label>
        <ChartTooltip.Value>
          {activeRow?.orders.toLocaleString() ?? ''}
        </ChartTooltip.Value>
      </ChartTooltip.Item>
    </ChartTooltip>
  );
}

export default function TooltipChartExample() {
  const [chartBounds, setChartBounds] = useState<ChartBounds | null>(null);

  const { state, isActive } = useChartPressState({
    x: '' as string,
    y: { revenue: 0, orders: 0 },
  });

  return (
    <View className="flex-1 px-5 justify-center">
      <Card className="w-full">
        <Card.Body>
          <ChartTooltip.Anchor
            chartBounds={chartBounds}
            isActive={state.isActive}
            matchedIndex={state.matchedIndex}
            x={state.x.position}
            y={state.y.orders.position}
          >
            <ComposedChart
              data={DATA}
              xKey="month"
              yKeys={['revenue', 'orders']}
              chartPressState={state}
              wrapperClassName="h-[200px]"
              onChartBoundsChange={setChartBounds}
            >
              {({ points, chartBounds: bounds }) => (
                <>
                  <ComposedChart.Bar
                    points={points.revenue}
                    chartBounds={bounds}
                  />
                  <ComposedChart.Line points={points.orders} />
                  {isActive ? (
                    <>
                      <ChartCrosshair
                        x={state.x.position}
                        top={bounds.top}
                        bottom={bounds.bottom}
                      />
                      <ChartIndicator
                        x={state.x.position}
                        y={state.y.orders.position}
                      />
                    </>
                  ) : null}
                </>
              )}
            </ComposedChart>
            <TooltipBody />
          </ChartTooltip.Anchor>
        </Card.Body>
      </Card>
    </View>
  );
}
```

## API Reference

### ChartTooltip

| prop           | type                          | default  | description                                                                                       |
| -------------- | ----------------------------- | -------- | ------------------------------------------------------------------------------------------------- |
| `children`     | `ReactNode`                   | -        | Card content: `Header` and `Item` rows                                                            |
| `animation`    | `ChartTooltipRootAnimation`   | spring   | Motion animation while tracking the press indicator. `withSpring` (no config) by default          |
| `isVisible`    | `ChartTooltipVisibility`      | `'auto'` | `'auto'` fades with press activity; `true` always visible; `false` unmounts                       |
| `placement`    | `ChartTooltipPlacement`       | `'top'`  | Whether the tooltip sits above or below the `(x, y)` anchor                                       |
| `gap`          | `number`                      | `12`     | Gap in logical pixels between the anchor and the tooltip edge                                     |
| `offset`       | `ChartTooltipOffset`          | -        | Pixel offsets applied on top of auto-positioning. CSS-like additive `top`/`bottom`/`left`/`right` |
| `className`    | `string`                      | -        | Additional classes merged onto the animated card container                                        |
| `...ViewProps` | `Omit<ViewProps, 'children'>` | -        | All standard React Native View props are supported except `children` (typed above)                |

#### ChartTooltipVisibility

| type                | description                                         |
| ------------------- | --------------------------------------------------- |
| `'auto' \| boolean` | `'auto'` fades with anchor press activity (default) |

#### ChartTooltipPlacement

| type                | description                                          |
| ------------------- | ---------------------------------------------------- |
| `'top' \| 'bottom'` | Vertical placement of the overlay relative to anchor |

#### ChartTooltipRootAnimationConfig

Discriminated on `type`. Both branches accept the matching Reanimated config fields.

| type                                    | description                                           |
| --------------------------------------- | ----------------------------------------------------- |
| `{ type: 'spring' } & WithSpringConfig` | Physically-based motion (default; no config required) |
| `{ type: 'timing' } & WithTimingConfig` | Duration-based slide                                  |

#### ChartTooltipOffset

| prop     | type     | default | description                                                                     |
| -------- | -------- | ------- | ------------------------------------------------------------------------------- |
| `top`    | `number` | `0`     | Vertical inset that pushes the overlay down (positive)                          |
| `bottom` | `number` | `0`     | Vertical inset that pushes the overlay up (positive)                            |
| `left`   | `number` | `0`     | Horizontal pixel offset added to `translateX`. Positive values push right       |
| `right`  | `number` | `0`     | Horizontal pixel offset subtracted from `translateX`. Positive values push left |

#### ChartTooltipIndicatorVariant

| type              | description                                                  |
| ----------------- | ------------------------------------------------------------ |
| `'dot' \| 'line'` | Swatch shape. `'dot'` is circular; `'line'` is a narrow pill |

### ChartTooltip.Anchor

| prop           | type                              | default | description                                                                                      |
| -------------- | --------------------------------- | ------- | ------------------------------------------------------------------------------------------------ |
| `children`     | `ReactNode`                       | -       | The chart and sibling `ChartTooltip` overlay                                                     |
| `animation`    | `ChartTooltipAnchorRootAnimation` | -       | Root-level cascade. Pass `"disable-all"` to disable animations on `ChartTooltip` and descendants |
| `chartBounds`  | `ChartBounds \| null`             | -       | Plot bounds from `onChartBoundsChange`. Enables 2D clamping on `ChartTooltip`                    |
| `isActive`     | `SharedValue<boolean>`            | -       | Press activity shared value (`state.isActive`)                                                   |
| `matchedIndex` | `SharedValue<number>`             | -       | Matched datum index (`state.matchedIndex`); bridged to JS as `activeIndex` in context            |
| `x`            | `SharedValue<number>`             | -       | Horizontal press position in chart space (`state.x.position`)                                    |
| `y`            | `SharedValue<number>`             | -       | Vertical press position in chart space (`state.y[yKey].position`)                                |
| `...ViewProps` | `ViewProps`                       | -       | All standard React Native View props are supported                                               |

### ChartTooltip.Header

| prop           | type        | default | description                               |
| -------------- | ----------- | ------- | ----------------------------------------- |
| `children`     | `ReactNode` | -       | Title text (e.g. X-axis category)         |
| `className`    | `string`    | -       | Additional classes merged onto the header |
| `...TextProps` | `TextProps` | -       | All standard React Native Text props      |

### ChartTooltip.Item

| prop           | type        | default | description                                 |
| -------------- | ----------- | ------- | ------------------------------------------- |
| `children`     | `ReactNode` | -       | Indicator, label, and value for one series  |
| `className`    | `string`    | -       | Additional classes merged onto the item row |
| `...ViewProps` | `ViewProps` | -       | All standard React Native View props        |

### ChartTooltip.Indicator

| prop           | type                           | default | description                                        |
| -------------- | ------------------------------ | ------- | -------------------------------------------------- |
| `color`        | `string`                       | -       | Fill color for the swatch                          |
| `variant`      | `ChartTooltipIndicatorVariant` | `'dot'` | Swatch shape (`'dot'` or `'line'`)                 |
| `className`    | `string`                       | -       | Additional classes merged onto the indicator       |
| `...ViewProps` | `ViewProps`                    | -       | All standard React Native View props are supported |

### ChartTooltip.Label

| prop           | type        | default | description                              |
| -------------- | ----------- | ------- | ---------------------------------------- |
| `children`     | `ReactNode` | -       | Series name                              |
| `className`    | `string`    | -       | Additional classes merged onto the label |
| `...TextProps` | `TextProps` | -       | All standard React Native Text props     |

### ChartTooltip.Value

| prop           | type        | default | description                              |
| -------------- | ----------- | ------- | ---------------------------------------- |
| `children`     | `ReactNode` | -       | Formatted data value                     |
| `className`    | `string`    | -       | Additional classes merged onto the value |
| `...TextProps` | `TextProps` | -       | All standard React Native Text props     |

### useChartTooltipAnchor

Returns the anchor context from the nearest `ChartTooltip.Anchor`. Throws when used outside an anchor (strict context).

| field         | type                   | description                                                   |
| ------------- | ---------------------- | ------------------------------------------------------------- |
| `activeIndex` | `number \| null`       | Active datum index when press is active; `null` when inactive |
| `chartBounds` | `ChartBounds \| null`  | Latest plot bounds from the chart                             |
| `isActive`    | `SharedValue<boolean>` | Press activity shared value                                   |
| `x`           | `SharedValue<number>`  | Horizontal press position                                     |
| `y`           | `SharedValue<number>`  | Vertical press position                                       |
