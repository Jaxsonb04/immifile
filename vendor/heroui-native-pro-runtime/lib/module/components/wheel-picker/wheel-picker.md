# WheelPicker

A vertical wheel picker with snap-to-row selection, distance-based fade and scale, and optional fade overlays.

## Import

```tsx
import { WheelPicker } from 'heroui-native-pro';
```

## Anatomy

```tsx
<WheelPicker items={[...]}>
  <WheelPicker.Indicator />
  <WheelPicker.Mask />
</WheelPicker>
```

- **WheelPicker**: Root container. Manages controllable selection through `value` / `defaultValue` / `onValueChange`, owns the shared scroll offset, and renders a data-driven scrolling list of rows. Cascades animation settings to children and auto-renders a default indicator when no compound children are passed.
- **WheelPicker.Item**: Animated row container. Auto-rendered for every option, or used as the outer element inside a custom `renderItem`. When no children are provided, renders `WheelPicker.ItemLabel` with the option's label. Tapping a row scrolls the wheel to focus it.
- **WheelPicker.ItemLabel**: Default label primitive. Used by the auto-fallback inside `WheelPicker.Item`; reuse inside a custom `renderItem` to keep the default label styling.
- **WheelPicker.Indicator**: Optional selection band rendered absolutely at the center of the viewport. Purely visual — selection logic lives on the root.
- **WheelPicker.Mask**: Optional top / bottom fade overlays that soften the wheel into the surrounding background.

## Usage

### Basic usage

Pass a list of `{ value, label }` items and bind `value` / `onValueChange`. The root renders a default indicator when no compound children are present.

```tsx
const [year, setYear] = useState(1995);

<WheelPicker value={year} onValueChange={setYear} items={YEAR_ITEMS} />;
```

### With mask

Add a `WheelPicker.Mask` for top / bottom fade overlays. Explicit children replace the auto-rendered indicator, so include `WheelPicker.Indicator` too.

```tsx
<WheelPicker value={year} onValueChange={setYear} items={YEAR_ITEMS}>
  <WheelPicker.Indicator />
  <WheelPicker.Mask />
</WheelPicker>
```

### Uncontrolled

Use `defaultValue` to seed the initial selection without managing external state.

```tsx
<WheelPicker defaultValue={1995} items={YEAR_ITEMS} onValueChange={...} />
```

### Item height and visible count

Customize row height and the number of visible rows. `visibleCount` must be odd so a single row sits centered on the indicator.

```tsx
<WheelPicker
  items={SLOT_ITEMS}
  defaultValue="13:30"
  itemHeight={56}
  visibleCount={5}
/>
```

### Custom item render

Pass `renderItem` to compose custom content per row. Use `WheelPicker.Item` as the outer wrapper to preserve sizing and tap-to-focus behavior.

```tsx
<WheelPicker
  value={reminder}
  onValueChange={setReminder}
  items={REMINDER_TYPE_ITEMS}
  renderItem={({ item, isSelected }) => (
    <WheelPicker.Item className="flex-row items-center justify-center gap-3">
      <ReminderIcon
        value={item.value}
        colorClassName={isSelected ? 'accent-accent' : 'accent-muted'}
      />
      <WheelPicker.ItemLabel className="font-medium">
        {item.label}
      </WheelPicker.ItemLabel>
    </WheelPicker.Item>
  )}
>
  <WheelPicker.Indicator />
  <WheelPicker.Mask />
</WheelPicker>
```

### Custom indicator

Style the selection band via `classNames` on `WheelPicker.Indicator`, or pass any `children` for decorative content rendered inside the `highlight` slot (patterns, gradients, icons). Pair with `overflow-hidden` on the highlight when the children should be clipped to the rounded corners.

```tsx
<WheelPicker items={DURATION_ITEMS} defaultValue={25}>
  <WheelPicker.Indicator
    classNames={{
      wrapper: 'px-2',
      highlight: 'bg-accent-soft border border-accent/15 overflow-hidden',
    }}
  >
    <MyIndicatorPattern />
  </WheelPicker.Indicator>
  <WheelPicker.Mask />
</WheelPicker>
```

### Custom mask color

Override the fade color when the wheel sits on a non-`background` surface. Combine with `height` (number or percentage) to control how far the fade extends.

```tsx
const overlayColor = useThemeColor('overlay');

<WheelPicker items={TIME_ITEMS} defaultValue="09:00">
  <WheelPicker.Indicator />
  <WheelPicker.Mask color={overlayColor} height="75%" />
</WheelPicker>;
```

### Custom animation

Tune the per-item `[edge, center]` opacity, scale, and label color ranges. The label color animation is always active (defaulting to theme `[foreground, accent-soft-foreground]`) — `text-*` color classes on `classNames.itemLabel` are overridden by the animated value.

```tsx
<WheelPicker
  items={REMINDER_TYPE_ITEMS}
  defaultValue="notification"
  animation={{
    opacity: { value: [0.4, 1] },
    scale: { value: [0.75, 1] },
    labelColor: { value: ['#888', '#000'] },
  }}
/>
```

### Disabled

Block interaction and dim the wheel with `isDisabled`.

```tsx
<WheelPicker items={YEAR_ITEMS} defaultValue={1995} isDisabled />
```

### Programmatic scroll

Use the ref to drive the selection imperatively. `scrollToValue` finds the matching row via `Object.is` equality and is a no-op when the value is not in `items`.

```tsx
const ref = useRef<WheelPickerRootRef>(null);

<WheelPicker ref={ref} items={YEAR_ITEMS} defaultValue={1995} />;

ref.current?.scrollToValue(2000);
ref.current?.scrollToIndex({ index: 0, animated: false });
```

## Example

```tsx
import { WheelPicker } from 'heroui-native-pro';
import { useState } from 'react';
import { Text, View } from 'react-native';

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_ITEMS = Array.from({ length: 80 }, (_, index) => {
  const year = CURRENT_YEAR - 18 - index;
  return { value: year, label: String(year) };
});

export default function BirthYearPicker() {
  const [year, setYear] = useState(1995);

  return (
    <View className="flex-1 items-center justify-center px-5">
      <View className="items-center gap-6">
        <View className="items-center gap-1">
          <Text className="text-xs text-muted uppercase tracking-wider">
            Date of birth
          </Text>
          <Text className="text-2xl font-semibold text-foreground tabular-nums">
            {year}
          </Text>
        </View>
        <View className="w-[200px]">
          <WheelPicker
            value={year}
            onValueChange={setYear}
            items={YEAR_ITEMS}
            classNames={{ itemLabel: 'tabular-nums' }}
          >
            <WheelPicker.Indicator />
            <WheelPicker.Mask />
          </WheelPicker>
        </View>
      </View>
    </View>
  );
}
```

## API Reference

### WheelPicker

| prop            | type                                                    | default                 | description                                                                                                                                                               |
| --------------- | ------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`      | `React.ReactNode`                                       | -                       | Compound parts. When omitted, a default `WheelPicker.Indicator` is rendered (skipped inside a `WheelPickerGroup`)                                                         |
| `items`         | `ReadonlyArray<WheelPickerOption<T>>`                   | -                       | List of `{ value, label }` rows rendered by the wheel                                                                                                                     |
| `itemHeight`    | `number`                                                | `44`                    | Pixel height of a single row. Drives snapping, layout, and animation math. Ignored when nested in a `WheelPickerGroup` (inherited from the group)                         |
| `visibleCount`  | `number`                                                | `5`                     | Number of rows visible inside the viewport. Must be odd so one row sits centered on the indicator. Ignored when nested in a `WheelPickerGroup` (inherited from the group) |
| `value`         | `T`                                                     | -                       | Controlled selected value. The row whose `item.value` matches becomes the selected row                                                                                    |
| `defaultValue`  | `T`                                                     | -                       | Initial value used when the wheel is uncontrolled                                                                                                                         |
| `name`          | `string`                                                | -                       | Identifies this wheel inside a `WheelPickerGroup`. When set and a group context exists, the wheel reads / writes its value via the group                                  |
| `isDisabled`    | `boolean`                                               | `false`                 | Disables interaction. The wheel still renders the current selection                                                                                                       |
| `className`     | `string`                                                | -                       | Additional CSS classes for the root container                                                                                                                             |
| `classNames`    | `ElementSlots<WheelPickerRootSlots>`                    | -                       | Additional CSS classes for individual root slots                                                                                                                          |
| `styles`        | `WheelPickerRootStyles`                                 | -                       | Inline styles for individual root slots                                                                                                                                   |
| `renderItem`    | `WheelPickerRenderItem<T>`                              | -                       | Custom row renderer. When omitted, the default renderer shows `item.label` inside a `WheelPicker.ItemLabel`                                                               |
| `keyExtractor`  | `(item: WheelPickerOption<T>, index: number) => string` | Primitive-aware default | Key extractor for the underlying `FlatList`. Defaults to `` `${value}:${index}` `` for primitives and `String(index)` otherwise                                           |
| `onValueChange` | `(value: T) => void`                                    | -                       | Fires when the selected row changes during scroll, on tap-to-focus, and on imperative `scrollToIndex` / `scrollToValue`                                                   |
| `animation`     | `WheelPickerRootAnimation`                              | -                       | Animation configuration for the per-item opacity / scale interpolation                                                                                                    |
| `ref`           | `WheelPickerRootRef`                                    | -                       | Imperative ref exposing `scrollToIndex` and `scrollToValue` in addition to the underlying view                                                                            |
| `...ViewProps`  | `Omit<ViewProps, 'children'>`                           | -                       | All standard React Native View props are supported                                                                                                                        |

#### WheelPickerOption

Single picker entry rendered as a row in the wheel.

| prop    | type     | description                                                           |
| ------- | -------- | --------------------------------------------------------------------- |
| `value` | `T`      | Unique value used for selection comparison and `scrollToValue` lookup |
| `label` | `string` | Display label rendered by the default item renderer                   |

#### WheelPickerRenderItemInfo

Argument passed to `renderItem`.

| prop          | type                   | description                                                                                                                                                                                                           |
| ------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `item`        | `WheelPickerOption<T>` | The option being rendered                                                                                                                                                                                             |
| `index`       | `number`               | Zero-based index of the option in `items`                                                                                                                                                                             |
| `isSelected`  | `boolean`              | Whether the option sits on the center selection band                                                                                                                                                                  |
| `scrollY`     | `SharedValue<number>`  | Shared scroll offset (UI thread) used to drive per-item animations                                                                                                                                                    |
| `itemHeight`  | `number`               | Resolved row height used by layout and animation math                                                                                                                                                                 |
| `absDistance` | `SharedValue<number>`  | Per-row absolute distance from center, in row units (`0` = centered, `0.5` = selection boundary, `1+` = one full row or more away). Drive your own `interpolate` / `interpolateColor` on it for custom row animations |

#### ElementSlots\<WheelPickerRootSlots\>

| slot               | description                                                               |
| ------------------ | ------------------------------------------------------------------------- |
| `container`        | Outer viewport wrapping the scroll list and overlays                      |
| `contentContainer` | Scroll content container carrier; receives the vertical centering padding |
| `item`             | Per-row animated container (see animated property notes below)            |
| `itemLabel`        | Default label text inside a row                                           |

The `item` slot animates `opacity` and `transform` (scale) for distance-based fade and scale. These properties cannot be overridden via `className`; use the `animation` prop to customize, or `animation="disabled"` to remove them entirely.

#### styles

| slot               | type        | description                                   |
| ------------------ | ----------- | --------------------------------------------- |
| `container`        | `ViewStyle` | Inline style for the outer viewport           |
| `contentContainer` | `ViewStyle` | Inline style for the scroll content container |
| `item`             | `ViewStyle` | Inline style for the per-row container        |
| `itemLabel`        | `TextStyle` | Inline style for the default label text       |

#### WheelPickerRootAnimation

Animation configuration for the per-item opacity, scale, and (optionally) label color interpolation. Can be:

- `false` or `"disabled"`: Disable per-item fade, scale, and label color (rows snap without interpolation)
- `"disable-all"`: Disable the wheel's animations and cascade `disable-all` to animated descendants
- `true` or `undefined`: Use default animations
- `object`: Custom animation configuration

| prop               | type               | default                                      | description                                                                                                                                                                               |
| ------------------ | ------------------ | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `opacity.value`    | `[number, number]` | `[0.5, 1]`                                   | `[edge, center]` opacity values. `value[0]` is opacity at the farthest visible offset                                                                                                     |
| `scale.value`      | `[number, number]` | `[0.85, 1]`                                  | `[edge, center]` scale values. `value[0]` is scale at the farthest visible offset                                                                                                         |
| `labelColor.value` | `[string, string]` | Theme `[foreground, accent-soft-foreground]` | `[edge, center]` color values for the row label, interpolated via `interpolateColor` strictly inside the half-row selection band — non-selected rows resolve to exactly `value[0]` (edge) |

#### WheelPickerImperativeMethods

Exposed via the root `ref` on top of the underlying `View` ref.

| method          | signature                                                    | description                                                                                                   |
| --------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `scrollToIndex` | `(params: { index: number; animated?: boolean }) => void`    | Scroll the wheel so the given index becomes the selected row                                                  |
| `scrollToValue` | `(value: unknown, options?: { animated?: boolean }) => void` | Scroll the wheel so the row matching `value` becomes the selected row. No-op when the value is not in `items` |

### WheelPicker.Indicator

| prop           | type                                                    | default | description                                                                                                                                                                                   |
| -------------- | ------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`     | `React.ReactNode`                                       | -       | Optional content rendered inside the indicator's `highlight` slot (patterns, gradients, icons). Pair with `overflow-hidden` on the highlight so the content is clipped to the rounded corners |
| `className`    | `string`                                                | -       | Additional CSS classes for the indicator container                                                                                                                                            |
| `classNames`   | `ElementSlots<WheelPickerIndicatorSlots>`               | -       | Additional CSS classes for individual indicator slots                                                                                                                                         |
| `styles`       | `Partial<Record<WheelPickerIndicatorSlots, ViewStyle>>` | -       | Inline styles for individual indicator slots                                                                                                                                                  |
| `...ViewProps` | `ViewProps`                                             | -       | All standard React Native View props are supported                                                                                                                                            |

#### ElementSlots\<WheelPickerIndicatorSlots\>

| slot        | description                                               |
| ----------- | --------------------------------------------------------- |
| `wrapper`   | Absolutely-positioned band centered on the wheel viewport |
| `highlight` | Filled rectangle rendered inside the wrapper              |

#### styles

| slot        | type        | description                              |
| ----------- | ----------- | ---------------------------------------- |
| `wrapper`   | `ViewStyle` | Inline style for the indicator wrapper   |
| `highlight` | `ViewStyle` | Inline style for the indicator highlight |

### WheelPicker.Mask

| prop           | type                                               | default                       | description                                                                                                                          |
| -------------- | -------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `color`        | `string`                                           | `useThemeColor('background')` | Solid color the gradient fades from. Accepts any RN color string. Falls back to the theme `background` color when omitted            |
| `height`       | `number \| string`                                 | `"100%"`                      | Height of each mask half. `number` = raw pixels; percentage scales the default fade height (`((visibleCount - 1) / 4) * itemHeight`) |
| `className`    | `string`                                           | -                             | Additional CSS classes applied to both mask halves                                                                                   |
| `classNames`   | `ElementSlots<WheelPickerMaskSlots>`               | -                             | Additional CSS classes for individual mask slots                                                                                     |
| `styles`       | `Partial<Record<WheelPickerMaskSlots, ViewStyle>>` | -                             | Inline styles for individual mask slots                                                                                              |
| `...ViewProps` | `Omit<ViewProps, 'children'>`                      | -                             | All standard React Native View props are supported                                                                                   |

#### ElementSlots\<WheelPickerMaskSlots\>

| slot     | description         |
| -------- | ------------------- |
| `top`    | Top fade overlay    |
| `bottom` | Bottom fade overlay |

#### styles

| slot     | type        | description                              |
| -------- | ----------- | ---------------------------------------- |
| `top`    | `ViewStyle` | Inline style for the top fade overlay    |
| `bottom` | `ViewStyle` | Inline style for the bottom fade overlay |

### WheelPicker.Item

`WheelPicker.Item` is the per-row animated container. When no `children` are provided, it auto-renders `<WheelPicker.ItemLabel>{item.label}</WheelPicker.ItemLabel>`. Tapping the row scrolls the wheel to focus it; a consumer `onPress` runs first.

| prop                | type                                          | default | description                                                                                                      |
| ------------------- | --------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| `children`          | `React.ReactNode`                             | -       | Custom row content. When omitted, the row renders `WheelPicker.ItemLabel` with the option's label                |
| `className`         | `string`                                      | -       | Additional CSS classes for the row container (see animated property notes below)                                 |
| `style`             | `ViewStyle`                                   | -       | Inline style for the row container. Merged after the root `styles.item` cascade and the animated transform style |
| `...PressableProps` | `Omit<PressableProps, 'children' \| 'style'>` | -       | All standard React Native Pressable props are supported (`onPressIn`, `hitSlop`, `disabled`, etc.)               |

The row container animates `opacity` and `transform` (scale) for distance-based fade and scale. These properties cannot be overridden via `className`; use the `animation` prop on the root to customize, or `animation="disabled"` to remove them entirely.

### WheelPicker.ItemLabel

| prop           | type        | default | description                                        |
| -------------- | ----------- | ------- | -------------------------------------------------- |
| `className`    | `string`    | -       | Additional CSS classes applied to the label text   |
| `...TextProps` | `TextProps` | -       | All standard React Native Text props are supported |

## Hooks

### useWheelPicker

Hook to access the WheelPicker root context. Must be used within a `WheelPicker` component.

```tsx
import { useWheelPicker } from 'heroui-native-pro';

const { itemHeight, visibleCount, scrollY, isDisabled } = useWheelPicker();
```

#### Returns: WheelPickerContextValue

| property                  | type                                                      | description                                                  |
| ------------------------- | --------------------------------------------------------- | ------------------------------------------------------------ |
| `itemHeight`              | `number`                                                  | Resolved row height in pixels                                |
| `visibleCount`            | `number`                                                  | Number of visible rows (always odd)                          |
| `isDisabled`              | `boolean`                                                 | Whether the wheel is disabled                                |
| `scrollY`                 | `SharedValue<number>`                                     | Shared scroll offset (UI thread) driving per-item animations |
| `isInsideGroup`           | `boolean`                                                 | Whether a `WheelPickerGroup` parent provided the value       |
| `resolvedAnimation`       | `WheelPickerResolvedAnimationConfig`                      | Resolved `[edge, center]` opacity and scale ranges           |
| `isItemAnimationDisabled` | `boolean`                                                 | Whether per-item animation is disabled (own + cascade)       |
| `scrollToIndex`           | `(params: { index: number; animated?: boolean }) => void` | Imperative helper to scroll the wheel to a row index         |

### useWheelPickerItem

Hook to access the per-row item context. Must be used within a `WheelPicker.Item`, `WheelPicker.ItemLabel`, or any component rendered inside a custom `renderItem`. The context erases the generic to `unknown`; cast at the call site (`as WheelPickerItemRenderProps<MyType>`) when you need strict typing on `item.value`.

```tsx
import { useWheelPickerItem } from 'heroui-native-pro';

const { item, index, isSelected, absDistance } = useWheelPickerItem();
```

Use `absDistance` together with `useAnimatedStyle` / `useAnimatedProps` to build your own row-content animations (icons, badges, halos, indicators, etc.) without recomputing distance math yourself.

#### Returns: WheelPickerItemRenderProps

| property      | type                         | description                                                                                                                                                             |
| ------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `item`        | `WheelPickerOption<unknown>` | The option being rendered                                                                                                                                               |
| `index`       | `number`                     | Zero-based index of the option in `items`                                                                                                                               |
| `isSelected`  | `boolean`                    | Whether the option matches the current value                                                                                                                            |
| `absDistance` | `SharedValue<number>`        | Per-row absolute distance from center, in row units (`0` = centered, `0.5` = selection boundary, `1+` = one full row or more away). Read with `.get()` inside a worklet |
