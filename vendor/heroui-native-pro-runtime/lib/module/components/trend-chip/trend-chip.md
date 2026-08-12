# TrendChip

A compact chip displaying a trend direction with percentage value, icon indicator, and contextual suffix.

## Import

```tsx
import { TrendChip } from 'heroui-native-pro';
```

## Anatomy

```tsx
<TrendChip>
  <TrendChip.Indicator>...</TrendChip.Indicator>
  <TrendChip.Prefix>...</TrendChip.Prefix>
  <TrendChip.Value>...</TrendChip.Value>
  <TrendChip.Suffix>...</TrendChip.Suffix>
</TrendChip>
```

- **TrendChip**: Root container built on top of `heroui-native`'s `Chip`. Derives the chip color from the `trend` prop (`up` -> success, `neutral` -> warning, `down` -> danger).
- **TrendChip.Indicator**: Renders the default trend arrow. Pass a custom SVG child to replace it; the child inherits size and color from the chip context.
- **TrendChip.Value**: Numeric content rendered as a `Chip.Label` with tabular figures so digits align vertically across chips.
- **TrendChip.Prefix**: Optional inline label rendered before the value (e.g. `$`, `+`).
- **TrendChip.Suffix**: Optional inline label rendered after the value, muted by default (e.g. `%`, `vs last month`).

## Usage

### Basic usage

Pass a string or number as children and the default indicator + value layout is applied automatically.

```tsx
<TrendChip trend="up">+12.4%</TrendChip>
```

### Trend direction

Choose the trend direction with the `trend` prop. This sets both the arrow icon and the chip color.

```tsx
<TrendChip trend="up">+12.4%</TrendChip>
<TrendChip trend="neutral">0.0%</TrendChip>
<TrendChip trend="down">-3.2%</TrendChip>
```

### Variants

Switch visual styles with the `variant` prop.

```tsx
<TrendChip variant="primary" trend="up">+12.4%</TrendChip>
<TrendChip variant="secondary" trend="up">+12.4%</TrendChip>
<TrendChip variant="tertiary" trend="up">+12.4%</TrendChip>
<TrendChip variant="soft" trend="up">+12.4%</TrendChip>
```

### Sizes

Control the chip size with the `size` prop.

```tsx
<TrendChip size="sm" trend="up">+4.1%</TrendChip>
<TrendChip size="md" trend="up">+4.1%</TrendChip>
<TrendChip size="lg" trend="up">+4.1%</TrendChip>
```

### Custom indicator

Pass a custom SVG child to `TrendChip.Indicator` to replace the default arrow. Size and color are inherited from the chip context.

```tsx
<TrendChip trend="up">
  <TrendChip.Indicator>
    <SparkleIcon />
  </TrendChip.Indicator>
  <TrendChip.Value>+42.0%</TrendChip.Value>
</TrendChip>
```

### Prefix and suffix

Compose the chip content with `TrendChip.Prefix`, `TrendChip.Value`, and `TrendChip.Suffix`. Use `TrendChip.Indicator` without children to keep the default arrow.

```tsx
<TrendChip trend="up">
  <TrendChip.Indicator />
  <TrendChip.Prefix>+</TrendChip.Prefix>
  <TrendChip.Value>$1,248</TrendChip.Value>
</TrendChip>

<TrendChip trend="down">
  <TrendChip.Indicator />
  <TrendChip.Value>-5.9</TrendChip.Value>
  <TrendChip.Suffix>vs last month</TrendChip.Suffix>
</TrendChip>
```

## Example

```tsx
import { TrendChip } from 'heroui-native-pro';
import { Text, View } from 'react-native';

const ROWS = [
  { label: 'Revenue', value: '+112.4%', trend: 'up' },
  { label: 'Signups', value: '+8.00%', trend: 'up' },
  { label: 'Churn', value: '-3.20%', trend: 'down' },
  { label: 'Traffic', value: '+0.10%', trend: 'neutral' },
] as const;

export default function TrendChipExample() {
  return (
    <View className="gap-2 w-52">
      {ROWS.map((row) => (
        <View
          key={row.label}
          className="flex-row items-center justify-between gap-4"
        >
          <Text className="text-xs text-muted">{row.label}</Text>
          <TrendChip trend={row.trend}>{row.value}</TrendChip>
        </View>
      ))}
    </View>
  );
}
```

## API Reference

### TrendChip

| prop      | type                                               | default  | description                                                             |
| --------- | -------------------------------------------------- | -------- | ----------------------------------------------------------------------- |
| `size`    | `'sm' \| 'md' \| 'lg'`                             | `'sm'`   | Size of the chip                                                        |
| `trend`   | `TrendDirection`                                   | `'up'`   | Trend direction. Drives the default arrow and the underlying chip color |
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'soft'` | `'soft'` | Visual variant of the chip                                              |

Extends [heroui-native `Chip`](https://heroui.com/docs/native/components/chip#api-reference) except for `size`, `color`, and `variant`.

#### TrendDirection

| type                          | description                                                                                    |
| ----------------------------- | ---------------------------------------------------------------------------------------------- |
| `'up' \| 'down' \| 'neutral'` | Trend direction. Maps to `success`, `danger`, `warning` on the underlying `Chip`, respectively |

### TrendChip.Indicator

| prop             | type                                      | default | description                                                                       |
| ---------------- | ----------------------------------------- | ------- | --------------------------------------------------------------------------------- |
| `children`       | `React.ReactElement<TrendArrowIconProps>` | -       | Custom icon element. Cloned with `size` / `color` / `colorClassName` from context |
| `size`           | `number`                                  | -       | Icon size in pixels. Defaults to a size matched to the chip's `size`              |
| `color`          | `string`                                  | -       | Icon stroke color. Overrides the color resolved from the chip context             |
| `colorClassName` | `string`                                  | -       | Uniwind `colorClassName` used to derive the icon color from the theme             |
| `className`      | `string`                                  | -       | Additional CSS classes for the indicator wrapper                                  |
| `...SvgProps`    | `SvgProps`                                | -       | All `react-native-svg` `Svg` props are supported                                  |

#### TrendArrowIconProps

| prop             | type       | default          | description                                                        |
| ---------------- | ---------- | ---------------- | ------------------------------------------------------------------ |
| `size`           | `number`   | `12`             | Icon size in pixels                                                |
| `color`          | `string`   | `"currentColor"` | Icon stroke color                                                  |
| `colorClassName` | `string`   | -                | Uniwind `colorClassName` mapped to `accentColor` via `withUniwind` |
| `...SvgProps`    | `SvgProps` | -                | All `react-native-svg` `Svg` props are supported                   |

### TrendChip.Value

Extends [heroui-native `Chip.Label`](https://heroui.com/docs/native/components/chip#chiplabel). Renders with tabular figures so digits align vertically across chips.

### TrendChip.Prefix

Extends [heroui-native `Chip.Label`](https://heroui.com/docs/native/components/chip#chiplabel). Rendered inline before the value.

### TrendChip.Suffix

Extends [heroui-native `Chip.Label`](https://heroui.com/docs/native/components/chip#chiplabel). Rendered inline after the value with a muted color.

## Hooks

### useTrendChip

Hook to access the TrendChip context. Must be used within a `TrendChip` component.

```tsx
import { useTrendChip } from 'heroui-native-pro';

const { size, trend, variant } = useTrendChip();
```

#### Returns

| property  | type                                               | description              |
| --------- | -------------------------------------------------- | ------------------------ |
| `size`    | `'sm' \| 'md' \| 'lg'`                             | Current size of the chip |
| `trend`   | `'up' \| 'down' \| 'neutral'`                      | Current trend direction  |
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'soft'` | Current visual variant   |
