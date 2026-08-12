# Rating

A star rating input with fractional read-only display, custom icons, sizes, and interactive selection.

## Import

```tsx
import { Rating } from 'heroui-native-pro';
```

## Anatomy

```tsx
<Rating>
  <Rating.Item value={1} />
  <Rating.Item value={2} />
  <Rating.Item value={3} />
  <Rating.Item value={4} />
  <Rating.Item value={5} />
</Rating>
```

- **Rating**: Root container built on `heroui-native`'s `RadioGroup`. Manages the numeric value, auto-renders items from `1` to `maxValue` when children are omitted, and propagates size/icon/read-only state via context.
- **Rating.Item**: Individual rating item. Wraps `RadioGroup.Item` and renders the default icon plus a clipped overlay for partial fills. Supports render-function children for fully custom indicators.

## Usage

### Basic usage

Auto-renders 5 items and calls `onValueChange` with the selected integer value.

```tsx
const [value, setValue] = useState(3);

<Rating value={value} onValueChange={setValue} />;
```

### Uncontrolled

```tsx
<Rating defaultValue={4} />
```

### Sizes

Control item size with the `size` prop.

```tsx
<Rating size="sm" defaultValue={4} />
<Rating size="md" defaultValue={4} />
<Rating size="lg" defaultValue={4} />
```

### Read-only fractional

`isReadOnly` disables interaction and enables fractional fills (e.g. `3.5`, `4.2`). The partial fill is achieved by clipping a second copy of the icon, so any solid-fill icon can be used.

```tsx
<Rating isReadOnly value={4.5} />
<Rating isReadOnly value={3.25} />
```

### Max value

Ratings are not limited to 5 items — set `maxValue` to render any number of items.

```tsx
<Rating maxValue={10} defaultValue={7} size="sm" />
```

### Disabled

```tsx
<Rating isDisabled value={3} />
```

### Custom icon

Pass an `icon` prop with any SVG component. The component is expected to accept `size`, `color`, and `colorClassName` props so `Rating` can drive its dimensions and active / inactive colors. Wrap the SVG with `withUniwind` to enable `colorClassName`:

```tsx
import type { FC } from 'react';
import Svg, { Path, type SvgProps } from 'react-native-svg';
import { withUniwind } from 'uniwind';

interface HeartIconProps extends SvgProps {
  size?: number;
  color?: string;
  colorClassName?: string;
}

const HeartIconBase: FC<HeartIconProps> = ({
  size = 24,
  color = 'currentColor',
  ...rest
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
    <Path d="M12 21s-7-4.35-9.5-9.2..." fill={color} />
  </Svg>
);

const HeartIcon = withUniwind(HeartIconBase, {
  color: { fromClassName: 'colorClassName', styleProperty: 'accentColor' },
});

<Rating icon={<HeartIcon />} defaultValue={3} />;
```

### Customizing icon size and colors

Use `iconProps` on the root to override size and active / inactive colors for every item. When both a raw color (`activeColor` / `inactiveColor`) and a className (`activeColorClassName` / `inactiveColorClassName`) are provided, the className wins for theme-aware styling.

```tsx
<Rating
  icon={<HeartIcon />}
  iconProps={{
    size: 28,
    activeColorClassName: 'accent-danger',
    inactiveColorClassName: 'accent-muted/20',
  }}
  defaultValue={3}
/>
```

### Custom indicator

Pass a render-function child to `Rating.Item` for a fully custom indicator. The function receives `{ isActive, isPartial, partialPercent }`.

```tsx
<Rating>
  {[1, 2, 3, 4, 5].map((itemValue) => (
    <Rating.Item key={itemValue} value={itemValue}>
      {({ isActive, partialPercent }) => (
        <View className="size-9 rounded-full items-center justify-center bg-muted/10">
          <Text className={isActive ? 'text-warning' : 'text-muted'}>
            {partialPercent > 0 && partialPercent < 100
              ? `${(itemValue - 1 + partialPercent / 100).toFixed(1)}`
              : itemValue}
          </Text>
        </View>
      )}
    </Rating.Item>
  ))}
</Rating>
```

## Example

```tsx
import { Rating } from 'heroui-native-pro';
import { Text, View } from 'react-native';
import { useState } from 'react';

export default function RatingExample() {
  const [value, setValue] = useState(4);

  return (
    <View className="items-center gap-2">
      <Rating value={value} onValueChange={setValue} />
      <Text className="text-muted text-sm">Rating: {value}</Text>
    </View>
  );
}
```

## API Reference

### Rating

| prop            | type                      | default | description                                                                                                              |
| --------------- | ------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------ |
| `value`         | `number`                  | -       | Controlled rating value (integer; fractional only when `isReadOnly`)                                                     |
| `defaultValue`  | `number`                  | -       | Uncontrolled default rating value                                                                                        |
| `onValueChange` | `(value: number) => void` | -       | Callback fired when the selected rating changes. Always receives an integer                                              |
| `maxValue`      | `number`                  | `5`     | Maximum rating value. Controls the number of items auto-rendered when `children` is absent                               |
| `size`          | `'sm' \| 'md' \| 'lg'`    | `'md'`  | Size of the rating items                                                                                                 |
| `isReadOnly`    | `boolean`                 | `false` | Disables interaction and enables fractional `value` for partial fills                                                    |
| `isDisabled`    | `boolean`                 | `false` | Disables the rating entirely (opacity + no interaction)                                                                  |
| `icon`          | `ReactNode`               | -       | Custom icon element used by every item (item-level `icon` wins). Must accept `size`, `color`, and `colorClassName` props |
| `iconProps`     | `RatingIconProps`         | -       | Shared icon styling (size + active / inactive colors) applied to every item                                              |
| `className`     | `string`                  | -       | Additional CSS classes applied to the root                                                                               |

Extends [heroui-native `RadioGroup`](https://heroui.com/docs/native/components/radio-group#api-reference) except for `value`, `defaultValue`, `onValueChange`, and `children` which are overridden to accept numeric ratings.

#### RatingIconProps

Shared icon styling forwarded to the default star or any custom `icon` component. When both a raw color and a className are set, the className wins — the raw color is used as a fallback.

| prop                     | type     | default                     | description                                                  |
| ------------------------ | -------- | --------------------------- | ------------------------------------------------------------ |
| `size`                   | `number` | Derived from root `size`    | Icon size in pixels                                          |
| `activeColor`            | `string` | -                           | Raw fill color for active / partially active items           |
| `inactiveColor`          | `string` | -                           | Raw fill color for inactive items                            |
| `activeColorClassName`   | `string` | `'accent-warning'`          | Uniwind `colorClassName` for active / partially active items |
| `inactiveColorClassName` | `string` | `'accent-surface-tertiary'` | Uniwind `colorClassName` for inactive items                  |

### Rating.Item

The underlying pressable is an animated `RadioGroup.Item` that plays a subtle scale animation on press. Customize or disable it via the `animation` prop (or disable animated styles entirely with `isAnimatedStyleActive={false}`).

| prop                    | type                                                | default | description                                                                                                               |
| ----------------------- | --------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| `value`                 | `number`                                            | -       | 1-based numeric value of this item                                                                                        |
| `icon`                  | `ReactNode`                                         | -       | Custom icon for this specific item (overrides the root-level `icon`)                                                      |
| `children`              | `ReactNode \| ((p: RatingItemRenderProps) => Node)` | -       | Content or render function for a fully custom indicator                                                                   |
| `animation`             | `RatingItemAnimation`                               | -       | Animation configuration for the press-scale feedback. Pass `false` or `'disabled'` to disable                             |
| `isAnimatedStyleActive` | `boolean`                                           | `true`  | Whether the animated press-scale style is applied. Set to `false` to disable animated styles and apply your own           |
| `className`             | `string`                                            | -       | Additional CSS classes applied to the item pressable                                                                      |

Extends [heroui-native `RadioGroup.Item`](https://heroui.com/docs/native/components/radio-group#radiogroupitem) except for `value` and `children` which are overridden.

#### RatingItemRenderProps

| prop             | type      | description                                                        |
| ---------------- | --------- | ------------------------------------------------------------------ |
| `isActive`       | `boolean` | Whether the item is considered active (filled or partially filled) |
| `isPartial`      | `boolean` | Whether the item is partially filled (read-only mode only)         |
| `partialPercent` | `number`  | Partial fill percentage in the 0-100 range                         |

#### RatingItemAnimation

Animation configuration for the item press-scale feedback. Can be:

- `false` or `'disabled'`: Disable the item press animation
- `undefined`: Use default animation
- `object`: Custom animation configuration

| prop                 | type               | default                | description                        |
| -------------------- | ------------------ | ---------------------- | ---------------------------------- |
| `scale.value`        | `[number, number]` | `[1, 0.9]`             | Scale values `[unpressed, pressed]` |
| `scale.timingConfig` | `WithTimingConfig` | `{ duration: 150 }`    | Animation timing configuration     |

## Hooks

### useRating

Hook to access the Rating context. Must be used within a `Rating` component.

```tsx
import { useRating } from 'heroui-native-pro';

const { value, maxValue, size, isReadOnly, isDisabled, iconProps } =
  useRating();
```

#### Returns

| property     | type              | description                                                |
| ------------ | ----------------- | ---------------------------------------------------------- |
| `value`      | `number`          | Current rating value (may be fractional in read-only mode) |
| `maxValue`   | `number`          | Current maximum rating value                               |
| `size`       | `RatingSize`      | Current size                                               |
| `isReadOnly` | `boolean`         | Whether the rating is read-only                            |
| `isDisabled` | `boolean`         | Whether the rating is disabled                             |
| `icon`       | `ReactNode`       | Shared default icon (may be `undefined`)                   |
| `iconProps`  | `RatingIconProps` | Shared icon styling (may be `undefined`)                   |
