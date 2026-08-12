# ProgressCircle

A circular progress indicator that shows determinate or indeterminate progress of an operation over time.

## Import

```tsx
import { ProgressCircle } from 'heroui-native-pro';
```

## Anatomy

```tsx
<ProgressCircle>
  <ProgressCircle.Indicator />
  <ProgressCircle.ValueLabel />
</ProgressCircle>
```

- **ProgressCircle**: Root container that manages progress state, formatting, and variant configuration. Computes percentage and formatted value text from `value`, `minValue`, `maxValue`, and `formatOptions`.
- **ProgressCircle.Indicator**: SVG rendering of the track and fill circles. Automatically switches between determinate (animated `strokeDashoffset`) and indeterminate (continuous rotation) modes based on the root's `isIndeterminate` prop. Accepts `strokeWidth`, `trackColor`, and `fillColor` overrides.
- **ProgressCircle.ValueLabel**: Text centered on the circle displaying the formatted progress value. Renders with tabular figures for consistent digit alignment. Hidden when indeterminate.

## Usage

### Basic usage

Render the indicator inside the root.

```tsx
<ProgressCircle value={60} accessibilityLabel="Loading">
  <ProgressCircle.Indicator />
</ProgressCircle>
```

### Sizes

Switch the circle size with the `size` prop using a preset name.

```tsx
<ProgressCircle value={40} size="sm">...</ProgressCircle>
<ProgressCircle value={60} size="md">...</ProgressCircle>
<ProgressCircle value={80} size="lg">...</ProgressCircle>
```

### Custom size

Pass a number to `size` for a custom pixel dimension.

```tsx
<ProgressCircle value={72} size={120}>
  <ProgressCircle.Indicator strokeWidth={6} />
  <ProgressCircle.ValueLabel />
</ProgressCircle>
```

### Colors

Switch the fill arc color with the `color` prop.

```tsx
<ProgressCircle value={60} color="default">...</ProgressCircle>
<ProgressCircle value={60} color="accent">...</ProgressCircle>
<ProgressCircle value={60} color="success">...</ProgressCircle>
<ProgressCircle value={60} color="warning">...</ProgressCircle>
<ProgressCircle value={60} color="danger">...</ProgressCircle>
```

### Indeterminate

Set `isIndeterminate` to render a looping spin animation when progress is unknown. The value label is hidden in this mode.

```tsx
<ProgressCircle isIndeterminate accessibilityLabel="Loading">
  <ProgressCircle.Indicator />
</ProgressCircle>
```

### With value label

Add `ProgressCircle.ValueLabel` to display the formatted value centered on the circle.

```tsx
<ProgressCircle value={75} color="success" size="lg">
  <ProgressCircle.Indicator />
  <ProgressCircle.ValueLabel />
</ProgressCircle>
```

### Custom value label content

Pass children to `ProgressCircle.ValueLabel` to render custom content instead of the formatted value.

```tsx
<ProgressCircle value={48} color="success" size={120}>
  <ProgressCircle.Indicator strokeWidth={6} />
  <ProgressCircle.ValueLabel>
    <View className="items-center">
      <Text>1119</Text>
      <Text>Remaining</Text>
    </View>
  </ProgressCircle.ValueLabel>
</ProgressCircle>
```

### Custom stroke width

Pass `strokeWidth` to `ProgressCircle.Indicator` to control the thickness of the track and fill arcs.

```tsx
<ProgressCircle value={60} size="lg">
  <ProgressCircle.Indicator strokeWidth={2} />
</ProgressCircle>

<ProgressCircle value={60} size="lg">
  <ProgressCircle.Indicator strokeWidth={6} />
</ProgressCircle>
```

### Custom colors

Override the resolved theme colors with the `trackColor` and `fillColor` props on the indicator.

```tsx
<ProgressCircle value={60}>
  <ProgressCircle.Indicator trackColor="#e5e7eb" fillColor="#8b5cf6" />
</ProgressCircle>
```

### Disabled

Set `isDisabled` to lower the opacity and mark the component as disabled for accessibility.

```tsx
<ProgressCircle value={60} isDisabled>
  <ProgressCircle.Indicator />
</ProgressCircle>
```

### Custom value range

Set `minValue` and `maxValue` to use a custom progress range.

```tsx
<ProgressCircle value={3} minValue={0} maxValue={5}>
  <ProgressCircle.Indicator />
  <ProgressCircle.ValueLabel />
</ProgressCircle>
```

### Custom value format

Pass `formatOptions` to format the displayed value with `Intl.NumberFormat` options.

```tsx
<ProgressCircle
  value={60}
  formatOptions={{ style: 'currency', currency: 'USD' }}
>
  <ProgressCircle.Indicator />
  <ProgressCircle.ValueLabel />
</ProgressCircle>
```

### Render function children

Use a render function to access progress state for custom layouts.

```tsx
<ProgressCircle value={60}>
  {({ percentage, valueText, isIndeterminate }) => <ProgressCircle.Indicator />}
</ProgressCircle>
```

## Example

```tsx
import { ProgressCircle } from 'heroui-native-pro';
import { View } from 'react-native';

export default function ProgressCircleExample() {
  return (
    <View className="flex-1 px-5 items-center justify-center">
      <ProgressCircle value={75} color="success" size="lg">
        <ProgressCircle.Indicator />
        <ProgressCircle.ValueLabel />
      </ProgressCircle>
    </View>
  );
}
```

## API Reference

### ProgressCircle

| prop              | type                                                             | default                | description                                                        |
| ----------------- | ---------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------ |
| `children`        | `ReactNode \| ((props: ProgressCircleRenderProps) => ReactNode)` | -                      | Children elements or render function with access to progress state |
| `size`            | `ProgressCircleSize`                                             | `"md"`                 | Size of the circle. Accepts a preset name or a custom pixel value  |
| `color`           | `ProgressCircleColor`                                            | `"accent"`             | Color of the progress arc                                          |
| `value`           | `number`                                                         | `0`                    | The current progress value                                         |
| `minValue`        | `number`                                                         | `0`                    | The minimum value of the progress range                            |
| `maxValue`        | `number`                                                         | `100`                  | The maximum value of the progress range                            |
| `isIndeterminate` | `boolean`                                                        | `false`                | Whether progress is indeterminate (unknown duration)               |
| `isDisabled`      | `boolean`                                                        | `false`                | Whether the component is disabled                                  |
| `className`       | `string`                                                         | -                      | Additional CSS classes for the root container                      |
| `formatOptions`   | `Intl.NumberFormatOptions`                                       | `{ style: 'percent' }` | Number format options for the value display                        |
| `animation`       | `ProgressCircleRootAnimation`                                    | -                      | Animation configuration for the root component                     |
| `...ViewProps`    | `ViewProps`                                                      | -                      | All standard React Native View props are supported                 |

#### ProgressCircleSize

| type                             | description                                                    |
| -------------------------------- | -------------------------------------------------------------- |
| `'sm' \| 'md' \| 'lg' \| number` | Preset size name (`24`, `36`, `48` px) or a custom pixel value |

#### ProgressCircleColor

| type                                                          | description                    |
| ------------------------------------------------------------- | ------------------------------ |
| `'default' \| 'accent' \| 'success' \| 'warning' \| 'danger'` | Color variants of the fill arc |

#### ProgressCircleRenderProps

| prop              | type      | description                       |
| ----------------- | --------- | --------------------------------- |
| `percentage`      | `number`  | Computed percentage (0–100)       |
| `valueText`       | `string`  | Formatted value text              |
| `isIndeterminate` | `boolean` | Whether progress is indeterminate |

#### ProgressCircleRootAnimation

Animation configuration for the ProgressCircle root. Can be:

- `"disable-all"`: Disable all animations including children (cascades down)
- `undefined`: Use default animations

### ProgressCircle.Indicator

| prop           | type                               | default | description                                                                      |
| -------------- | ---------------------------------- | ------- | -------------------------------------------------------------------------------- |
| `strokeWidth`  | `number`                           | `4`     | Stroke width of the track and fill arcs                                          |
| `trackColor`   | `string`                           | -       | Override color for the track circle stroke. Defaults to the theme's `default`    |
| `fillColor`    | `string`                           | -       | Override color for the fill circle stroke. Defaults to the resolved `color` prop |
| `className`    | `string`                           | -       | Additional CSS classes for the indicator container                               |
| `animation`    | `ProgressCircleIndicatorAnimation` | -       | Animation configuration for the indicator                                        |
| `...ViewProps` | `ViewProps`                        | -       | All standard React Native View props are supported                               |

#### ProgressCircleIndicatorAnimation

Animation configuration for `ProgressCircle.Indicator`. Can be:

- `false` or `"disabled"`: Disable indicator animations
- `true` or `undefined`: Use default animations
- `object`: Custom animation configuration

| prop               | type                               | default                                     | description                                                          |
| ------------------ | ---------------------------------- | ------------------------------------------- | -------------------------------------------------------------------- |
| `fillTimingConfig` | `AnimationValue<WithTimingConfig>` | `{ duration: 300 }`                         | Timing configuration for the determinate strokeDashoffset transition |
| `spinTimingConfig` | `AnimationValue<WithTimingConfig>` | `{ duration: 1000, easing: Easing.linear }` | Timing configuration for the indeterminate spin rotation             |

### ProgressCircle.ValueLabel

| prop           | type        | default | description                                                                          |
| -------------- | ----------- | ------- | ------------------------------------------------------------------------------------ |
| `children`     | `ReactNode` | -       | Custom content to override the formatted value text. Defaults to the formatted value |
| `className`    | `string`    | -       | Additional CSS classes for the value label text                                      |
| `...TextProps` | `TextProps` | -       | All standard React Native Text props are supported                                   |

## Hooks

### useProgressCircle

Hook to access the ProgressCircle context. Must be used within a `ProgressCircle` component.

```tsx
import { useProgressCircle } from 'heroui-native-pro';

const { percentage, valueText, isIndeterminate, isDisabled, size, color } =
  useProgressCircle();
```

#### Returns: ProgressCircleContextValue

| property          | type                  | description                                     |
| ----------------- | --------------------- | ----------------------------------------------- |
| `percentage`      | `number`              | Computed percentage (0–100) of current progress |
| `valueText`       | `string`              | Formatted value text (e.g. `"60%"`)             |
| `isIndeterminate` | `boolean`             | Whether progress is indeterminate               |
| `isDisabled`      | `boolean`             | Whether the component is disabled               |
| `size`            | `ProgressCircleSize`  | Current size variant                            |
| `color`           | `ProgressCircleColor` | Current color variant                           |
