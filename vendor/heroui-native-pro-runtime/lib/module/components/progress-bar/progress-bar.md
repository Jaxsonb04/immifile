# ProgressBar

A progress bar shows either determinate or indeterminate progress of an operation over time.

## Import

```tsx
import { ProgressBar } from 'heroui-native-pro';
```

## Anatomy

```tsx
<ProgressBar>
  <ProgressBar.Label>...</ProgressBar.Label>
  <ProgressBar.ValueLabel />
  <ProgressBar.Track>
    <ProgressBar.Fill />
  </ProgressBar.Track>
</ProgressBar>
```

- **ProgressBar**: Root container that manages progress state, formatting, and variant configuration. Computes percentage and formatted value text from `value`, `minValue`, `maxValue`, and `formatOptions`. When plain string children are provided, they auto-expand into Label, ValueLabel, Track, and Fill.
- **ProgressBar.Track**: Background container for the fill element. Applies rounded corners, overflow hidden, and size-based height.
- **ProgressBar.Fill**: Animated element representing filled progress. Automatically switches between determinate (width animation) and indeterminate (translateX sweep) based on the root's `isIndeterminate` prop.
- **ProgressBar.Label**: Text describing the progress operation.
- **ProgressBar.ValueLabel**: Displays the formatted progress value with tabular figures for consistent digit alignment. Hidden when indeterminate.

## Usage

### Basic usage

Compose the label row and the track with fill manually for full control.

```tsx
<ProgressBar value={60}>
  <View className="flex-row items-center justify-between">
    <ProgressBar.Label>Loading</ProgressBar.Label>
    <ProgressBar.ValueLabel />
  </View>
  <ProgressBar.Track>
    <ProgressBar.Fill />
  </ProgressBar.Track>
</ProgressBar>
```

### String children shortcut

Pass a string as children to auto-render the label row, track, and fill.

```tsx
<ProgressBar value={60}>Loading</ProgressBar>
```

### Sizes

Switch the track height with the `size` prop.

```tsx
<ProgressBar value={40} size="sm">...</ProgressBar>
<ProgressBar value={60} size="md">...</ProgressBar>
<ProgressBar value={80} size="lg">...</ProgressBar>
```

### Colors

Switch the fill color with the `color` prop.

```tsx
<ProgressBar value={50} color="default">...</ProgressBar>
<ProgressBar value={50} color="accent">...</ProgressBar>
<ProgressBar value={50} color="success">...</ProgressBar>
<ProgressBar value={50} color="warning">...</ProgressBar>
<ProgressBar value={50} color="danger">...</ProgressBar>
```

### Indeterminate

Set `isIndeterminate` to render a looping sweep animation when progress is unknown. The value label is hidden in this mode.

```tsx
<ProgressBar isIndeterminate>
  <ProgressBar.Label>Loading...</ProgressBar.Label>
  <ProgressBar.Track>
    <ProgressBar.Fill />
  </ProgressBar.Track>
</ProgressBar>
```

### Without label

Omit `ProgressBar.Label` and `ProgressBar.ValueLabel` to render only the track. Provide `accessibilityLabel` for screen readers.

```tsx
<ProgressBar value={45} accessibilityLabel="Loading progress">
  <ProgressBar.Track>
    <ProgressBar.Fill />
  </ProgressBar.Track>
</ProgressBar>
```

### Disabled

Set `isDisabled` to lower the opacity and mark the component as disabled for accessibility.

```tsx
<ProgressBar value={60} isDisabled>
  ...
</ProgressBar>
```

### Custom value range

Set `minValue` and `maxValue` to use a custom progress range.

```tsx
<ProgressBar value={3} minValue={0} maxValue={5}>
  ...
</ProgressBar>
```

### Custom value format

Pass `formatOptions` to format the displayed value with `Intl.NumberFormat` options.

```tsx
<ProgressBar value={60} formatOptions={{ style: 'currency', currency: 'USD' }}>
  ...
</ProgressBar>
```

### Custom gradient fill

Apply a gradient background to `ProgressBar.Fill` via the `style` prop.

```tsx
<ProgressBar value={70}>
  <View className="flex-row items-center justify-between">
    <ProgressBar.Label>Sunset</ProgressBar.Label>
    <ProgressBar.ValueLabel />
  </View>
  <ProgressBar.Track>
    <ProgressBar.Fill
      style={{
        experimental_backgroundImage:
          'linear-gradient(to right, #f97316, #ec4899, #8b5cf6)',
      }}
    />
  </ProgressBar.Track>
</ProgressBar>
```

### Render function children

Use a render function to access progress state for custom layouts.

```tsx
<ProgressBar value={60}>
  {({ percentage, valueText, isIndeterminate }) => (
    <>
      <ProgressBar.Track>
        <ProgressBar.Fill />
      </ProgressBar.Track>
    </>
  )}
</ProgressBar>
```

## Example

```tsx
import { ProgressBar } from 'heroui-native-pro';
import { View } from 'react-native';

export default function ProgressBarExample() {
  return (
    <View className="flex-1 px-5 items-center justify-center">
      <View className="w-64">
        <ProgressBar value={60} color="accent" size="md">
          <View className="flex-row items-center justify-between">
            <ProgressBar.Label>Loading</ProgressBar.Label>
            <ProgressBar.ValueLabel />
          </View>
          <ProgressBar.Track>
            <ProgressBar.Fill />
          </ProgressBar.Track>
        </ProgressBar>
      </View>
    </View>
  );
}
```

## API Reference

### ProgressBar

| prop              | type                                                          | default                | description                                                                                               |
| ----------------- | ------------------------------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------- |
| `children`        | `ReactNode \| ((props: ProgressBarRenderProps) => ReactNode)` | -                      | Children elements or render function with access to progress state. String children auto-expand sub-parts |
| `size`            | `ProgressBarSize`                                             | `"md"`                 | Size of the progress track                                                                                |
| `color`           | `ProgressBarColor`                                            | `"accent"`             | Color of the fill bar                                                                                     |
| `value`           | `number`                                                      | `0`                    | The current progress value                                                                                |
| `minValue`        | `number`                                                      | `0`                    | The minimum value of the progress range                                                                   |
| `maxValue`        | `number`                                                      | `100`                  | The maximum value of the progress range                                                                   |
| `isIndeterminate` | `boolean`                                                     | `false`                | Whether progress is indeterminate (unknown duration)                                                      |
| `isDisabled`      | `boolean`                                                     | `false`                | Whether the component is disabled                                                                         |
| `className`       | `string`                                                      | -                      | Additional CSS classes for the root container                                                             |
| `formatOptions`   | `Intl.NumberFormatOptions`                                    | `{ style: 'percent' }` | Number format options for the value display                                                               |
| `animation`       | `ProgressBarRootAnimation`                                    | -                      | Animation configuration for the root component                                                            |
| `...ViewProps`    | `ViewProps`                                                   | -                      | All standard React Native View props are supported                                                        |

#### ProgressBarSize

| type                   | description                         |
| ---------------------- | ----------------------------------- |
| `'sm' \| 'md' \| 'lg'` | Size variants of the progress track |

#### ProgressBarColor

| type                                                          | description                    |
| ------------------------------------------------------------- | ------------------------------ |
| `'default' \| 'accent' \| 'success' \| 'warning' \| 'danger'` | Color variants of the fill bar |

#### ProgressBarRenderProps

| prop              | type      | description                       |
| ----------------- | --------- | --------------------------------- |
| `percentage`      | `number`  | Computed percentage (0–100)       |
| `valueText`       | `string`  | Formatted value text              |
| `isIndeterminate` | `boolean` | Whether progress is indeterminate |

#### ProgressBarRootAnimation

Animation configuration for the ProgressBar root. Can be:

- `"disable-all"`: Disable all animations including children (cascades down)
- `undefined`: Use default animations

### ProgressBar.Track

| prop           | type        | default | description                                                        |
| -------------- | ----------- | ------- | ------------------------------------------------------------------ |
| `children`     | `ReactNode` | -       | Content to display inside the track (typically `ProgressBar.Fill`) |
| `className`    | `string`    | -       | Additional CSS classes for the track container                     |
| `...ViewProps` | `ViewProps` | -       | All standard React Native View props are supported                 |

### ProgressBar.Fill

> Note: `width` and `transform` (translateX) are occupied by animations and cannot be set via `className`. To fully control the fill, set `isAnimatedStyleActive={false}`.

| prop                    | type                       | default | description                                                                                                   |
| ----------------------- | -------------------------- | ------- | ------------------------------------------------------------------------------------------------------------- |
| `isAnimatedStyleActive` | `boolean`                  | `true`  | When `false`, animated styles (width / translateX) are not applied, allowing full control via className/style |
| `className`             | `string`                   | -       | Additional CSS classes for the fill element                                                                   |
| `animation`             | `ProgressBarFillAnimation` | -       | Animation configuration for the fill element                                                                  |
| `...ViewProps`          | `ViewProps`                | -       | All standard React Native View props are supported                                                            |

#### ProgressBarFillAnimation

Animation configuration for `ProgressBar.Fill`. Can be:

- `false` or `"disabled"`: Disable fill animations
- `true` or `undefined`: Use default animations
- `object`: Custom animation configuration

| prop                            | type                               | default                                                    | description                                                    |
| ------------------------------- | ---------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------- |
| `fillTimingConfig`              | `AnimationValue<WithTimingConfig>` | `{ duration: 300 }`                                        | Timing configuration for the determinate fill width transition |
| `indeterminateFillTimingConfig` | `AnimationValue<WithTimingConfig>` | `{ duration: 1500, easing: Easing.bezier(0.65,0,0.35,1) }` | Timing configuration for the indeterminate sweep animation     |

### ProgressBar.Label

| prop           | type        | default | description                                        |
| -------------- | ----------- | ------- | -------------------------------------------------- |
| `children`     | `ReactNode` | -       | Text content for the label                         |
| `className`    | `string`    | -       | Additional CSS classes for the label text          |
| `...TextProps` | `TextProps` | -       | All standard React Native Text props are supported |

### ProgressBar.ValueLabel

| prop           | type        | default | description                                                                          |
| -------------- | ----------- | ------- | ------------------------------------------------------------------------------------ |
| `children`     | `ReactNode` | -       | Custom content to override the formatted value text. Defaults to the formatted value |
| `className`    | `string`    | -       | Additional CSS classes for the value label text                                      |
| `...TextProps` | `TextProps` | -       | All standard React Native Text props are supported                                   |

## Hooks

### useProgressBar

Hook to access the ProgressBar context. Must be used within a `ProgressBar` component.

```tsx
import { useProgressBar } from 'heroui-native-pro';

const {
  percentage,
  valueText,
  isIndeterminate,
  isDisabled,
  size,
  color,
  trackWidth,
  onTrackLayout,
} = useProgressBar();
```

#### Returns: ProgressBarContextValue

| property          | type                      | description                                       |
| ----------------- | ------------------------- | ------------------------------------------------- |
| `percentage`      | `number`                  | Computed percentage (0–100) of current progress   |
| `valueText`       | `string`                  | Formatted value text (e.g. `"60%"`)               |
| `isIndeterminate` | `boolean`                 | Whether progress is indeterminate                 |
| `isDisabled`      | `boolean`                 | Whether the component is disabled                 |
| `size`            | `ProgressBarSize`         | Current size variant                              |
| `color`           | `ProgressBarColor`        | Current color variant                             |
| `trackWidth`      | `number`                  | Measured track width in pixels                    |
| `onTrackLayout`   | `(width: number) => void` | Callback for `Track` to report its measured width |
