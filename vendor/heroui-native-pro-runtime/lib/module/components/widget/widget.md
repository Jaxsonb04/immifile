# Widget

A dashboard container that pairs an optional header and footer with an elevated content card for charts, tables, and KPIs.

## Import

```tsx
import { Widget } from 'heroui-native-pro';
```

## Anatomy

```tsx
<Widget>
  <Widget.Header>
    <Widget.Title>...</Widget.Title>
    <Widget.Description>...</Widget.Description>
    <Widget.Legend>
      <Widget.LegendItem>...</Widget.LegendItem>
    </Widget.Legend>
  </Widget.Header>
  <Widget.Content>...</Widget.Content>
  <Widget.Footer>...</Widget.Footer>
</Widget>
```

- **Widget**: Root container. Renders the outer surface (`bg-surface-secondary`, `rounded-2xl`) with internal padding, and cascades `disable-all` to animated descendants. Sub-components are fully optional.
- **Widget.Header**: Horizontal row with `space-between` justification. Pairs `Widget.Title` (and optional `Widget.Description`) with an inline `Widget.Legend`.
- **Widget.Title**: Primary widget label rendered with `accessibilityRole="header"`.
- **Widget.Description**: Secondary muted text. Use under the title as a hint or inside `Widget.Footer` as a summary line.
- **Widget.Content**: Elevated inner card (`bg-surface`, `rounded-xl`, `shadow-surface`) hosting the widget's payload (chart, table, KPI block, etc.).
- **Widget.Footer**: Optional bottom row for muted summary text or action chips.
- **Widget.Legend**: Inline container for one or more `Widget.LegendItem`s, typically placed inside the header next to the title.
- **Widget.LegendItem**: Single colored-dot + label entry. Accepts `colorClassName` (preferred) or `color` (inline color string) to drive the dot.

## Usage

### Basic usage

Compose the widget with a header (title + legend) and an elevated content card.

```tsx
<Widget>
  <Widget.Header>
    <Widget.Title>Tokens Over Time</Widget.Title>
    <Widget.Legend>
      <Widget.LegendItem colorClassName="bg-chart-4">Input</Widget.LegendItem>
      <Widget.LegendItem colorClassName="bg-chart-1">Output</Widget.LegendItem>
    </Widget.Legend>
  </Widget.Header>
  <Widget.Content>...</Widget.Content>
</Widget>
```

### Title and description

Stack a `Widget.Description` beneath the title for a hint line.

```tsx
<Widget>
  <Widget.Header>
    <View>
      <Widget.Title>Requests</Widget.Title>
      <Widget.Description>Last 30 days</Widget.Description>
    </View>
  </Widget.Header>
  <Widget.Content>...</Widget.Content>
</Widget>
```

### With footer

Add a `Widget.Footer` for muted summary text or actions below the content card.

```tsx
<Widget>
  <Widget.Header>
    <Widget.Title>Tokens Over Time</Widget.Title>
  </Widget.Header>
  <Widget.Content>...</Widget.Content>
  <Widget.Footer>
    <Widget.Description>Updated 2 minutes ago</Widget.Description>
  </Widget.Footer>
</Widget>
```

### Legend with theme colors

Use `colorClassName` to pull theme tokens through the standard className pipeline.

```tsx
<Widget.Legend>
  <Widget.LegendItem colorClassName="bg-chart-3">Organic</Widget.LegendItem>
  <Widget.LegendItem colorClassName="bg-chart-1">Paid Ads</Widget.LegendItem>
</Widget.Legend>
```

### Legend with custom colors

Use `color` for one-off color strings (hex, `rgb(...)`, resolved theme value).

```tsx
<Widget.Legend>
  <Widget.LegendItem color="#10b981">Success</Widget.LegendItem>
  <Widget.LegendItem color="#ef4444">Errors</Widget.LegendItem>
</Widget.Legend>
```

## Example

```tsx
import { LineChart, Widget } from 'heroui-native-pro';
import { View } from 'react-native';

const TOKENS_DATA = [
  { date: '09-01', input: 35000, output: 22000 },
  { date: '09-02', input: 80000, output: 35000 },
  { date: '09-03', input: 130000, output: 48000 },
];

const formatCompactNumber = (value: number) =>
  value >= 1000 ? `${(value / 1000).toFixed(0)}k` : `${value}`;

export default function WidgetExample() {
  return (
    <View className="px-5">
      <Widget>
        <Widget.Header>
          <Widget.Title>Tokens Over Time</Widget.Title>
          <Widget.Legend>
            <Widget.LegendItem colorClassName="bg-chart-4">
              Input
            </Widget.LegendItem>
            <Widget.LegendItem colorClassName="bg-chart-1">
              Output
            </Widget.LegendItem>
          </Widget.Legend>
        </Widget.Header>
        <Widget.Content>
          <LineChart
            data={TOKENS_DATA}
            xKey="date"
            yKeys={['input', 'output']}
            yAxis={[{ formatYLabel: formatCompactNumber }]}
            wrapperClassName="h-[200px]"
          >
            {({ points }) => (
              <>
                <LineChart.Line
                  points={points.input}
                  colorClassName="accent-chart-4"
                  curveType="monotoneX"
                />
                <LineChart.Line
                  points={points.output}
                  colorClassName="accent-chart-1"
                  curveType="monotoneX"
                />
              </>
            )}
          </LineChart>
        </Widget.Content>
      </Widget>
    </View>
  );
}
```

## API Reference

### Widget

| prop           | type                      | default | description                                                                                  |
| -------------- | ------------------------- | ------- | -------------------------------------------------------------------------------------------- |
| `children`     | `React.ReactNode`         | -       | Compound parts to render inside the widget shell                                             |
| `className`    | `string`                  | -       | Additional CSS classes for the outer shell                                                   |
| `animation`    | `WidgetRootAnimation`     | -       | Animation configuration for the widget root (cascades to animated descendants)               |
| `...ViewProps` | `ViewProps`               | -       | All standard React Native View props are supported                                           |

#### WidgetRootAnimation

Animation configuration for the Widget root. Can be:

- `"disable-all"`: Disable all animations including children (cascades down through `AnimationSettingsProvider`)
- `undefined`: Use default animations

### Widget.Header

| prop           | type              | default | description                                        |
| -------------- | ----------------- | ------- | -------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Header content (title, description, legend, etc.)  |
| `className`    | `string`          | -       | Additional CSS classes for the header row          |
| `...ViewProps` | `ViewProps`       | -       | All standard React Native View props are supported |

### Widget.Title

| prop           | type              | default | description                                        |
| -------------- | ----------------- | ------- | -------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Title text content                                 |
| `className`    | `string`          | -       | Additional CSS classes for the title text          |
| `...TextProps` | `TextProps`       | -       | All standard React Native Text props are supported |

### Widget.Description

| prop           | type              | default | description                                        |
| -------------- | ----------------- | ------- | -------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Description text content                           |
| `className`    | `string`          | -       | Additional CSS classes for the description text    |
| `...TextProps` | `TextProps`       | -       | All standard React Native Text props are supported |

### Widget.Content

| prop           | type              | default | description                                                |
| -------------- | ----------------- | ------- | ---------------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Content rendered inside the elevated card                  |
| `className`    | `string`          | -       | Additional CSS classes for the content card                |
| `...ViewProps` | `ViewProps`       | -       | All standard React Native View props are supported         |

### Widget.Footer

| prop           | type              | default | description                                        |
| -------------- | ----------------- | ------- | -------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Footer content                                     |
| `className`    | `string`          | -       | Additional CSS classes for the footer row          |
| `...ViewProps` | `ViewProps`       | -       | All standard React Native View props are supported |

### Widget.Legend

| prop           | type              | default | description                                        |
| -------------- | ----------------- | ------- | -------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Legend entries                                     |
| `className`    | `string`          | -       | Additional CSS classes for the legend wrapper      |
| `...ViewProps` | `ViewProps`       | -       | All standard React Native View props are supported |

### Widget.LegendItem

| prop             | type                                | default | description                                                                                          |
| ---------------- | ----------------------------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| `children`       | `React.ReactNode`                   | -       | Label text. String/number children are wrapped in a `Text` automatically                             |
| `color`          | `string`                            | -       | Color applied to the dot via inline `backgroundColor`. Wins over `colorClassName` when both are set  |
| `colorClassName` | `string`                            | -       | Tailwind background class for the dot (e.g. `"bg-chart-3"`). Preferred over `color` for theme tokens |
| `className`      | `string`                            | -       | Additional CSS classes for the wrapper slot                                                          |
| `classNames`     | `ElementSlots<WidgetLegendItemSlots>` | -     | Additional CSS classes for individual slots                                                          |
| `styles`         | `WidgetLegendItemStyles`            | -       | Inline style overrides for individual slots                                                          |
| `textProps`      | `TextProps`                         | -       | Additional props forwarded to the inner label `Text` element                                         |
| `...ViewProps`   | `ViewProps`                         | -       | All standard React Native View props are supported                                                   |

#### ElementSlots\<WidgetLegendItemSlots\>

| slot      | description                              |
| --------- | ---------------------------------------- |
| `wrapper` | Outer flex row holding the dot and label |
| `dot`     | Color indicator dot                      |
| `label`   | Legend entry label text                  |

#### styles

| slot      | type        | description                              |
| --------- | ----------- | ---------------------------------------- |
| `wrapper` | `ViewStyle` | Style for the outer flex row wrapper     |
| `dot`     | `ViewStyle` | Style for the color indicator dot        |
| `label`   | `TextStyle` | Style for the legend entry label text    |
