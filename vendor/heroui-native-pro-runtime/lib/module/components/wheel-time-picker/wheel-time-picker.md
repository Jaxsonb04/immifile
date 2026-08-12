# WheelTimePicker

A standalone wheel time selector built on `WheelPickerGroup` that exchanges an `@internationalized/date` `Time` value.

## Import

```tsx
import { WheelTimePicker } from 'heroui-native-pro';
```

## Anatomy

```tsx
<WheelTimePicker>
  <WheelTimePicker.Hour />
  <WheelTimePicker.Minute />
  <WheelTimePicker.Period />
  <WheelTimePicker.Indicator />
  <WheelTimePicker.Mask />
</WheelTimePicker>
```

- **WheelTimePicker**: Root container. Owns the `Time` value, builds the column item data from `hourFormat` / `minuteInterval` / `locale`, and drives the underlying `WheelPickerGroup`. When `children` are omitted it renders the full default set (`Hour`, `Minute`, `Period` in 12-hour mode, `Indicator`, `Mask`).
- **WheelTimePicker.Hour**: Hour column. The root owns its `name` and `items` so the stored value stays correct.
- **WheelTimePicker.Minute**: Minute column stepped by the active `minuteInterval`. Root-owned `name` / `items`.
- **WheelTimePicker.Period**: AM/PM period column rendered by default in 12-hour mode. Root-owned `name` / `items`.
- **WheelTimePicker.Indicator**: Shared selection band spanning every column (`WheelPickerGroup.Indicator`).
- **WheelTimePicker.Mask**: Top / bottom fade overlays spanning the full group viewport (`WheelPickerGroup.Mask`).

## Usage

### Basic usage

Bind `value` / `onValueChange` to a `Time`. With no children the picker renders hour, minute, an AM/PM period column (12-hour default), indicator, and mask.

```tsx
import { Time } from '@internationalized/date';

const [time, setTime] = useState(new Time(9, 30));

<WheelTimePicker value={time} onValueChange={setTime} />;
```

### Uncontrolled

Pass `defaultValue` to seed the initial selection without managing external state.

```tsx
import { Time } from '@internationalized/date';

<WheelTimePicker
  defaultValue={new Time(9, 30)}
  onValueChange={(next) => console.log(next)}
/>;
```

### 24-hour mode

Set `hourFormat={24}` for a `0`–`23` hour column with no period column.

```tsx
<WheelTimePicker hourFormat={24} value={time} onValueChange={setTime} />
```

### Minute interval

Step the minute column with `minuteInterval` for appointment-style selection.

```tsx
<WheelTimePicker minuteInterval={15} value={time} onValueChange={setTime} />
```

### Localized period labels

Localize the AM/PM labels via `locale`. The stored value stays the canonical `"AM"` / `"PM"`.

```tsx
<WheelTimePicker locale="zh-CN" value={time} onValueChange={setTime} />
```

### Commit on rest

`onValueCommit` fires exactly once after every column has come to rest.

```tsx
<WheelTimePicker
  value={time}
  onValueChange={setTime}
  onValueCommit={(next) => saveTime(next)}
/>
```

### Custom composition

Pass children to take full ownership of column order, content, and styling. Style each column through its `classNames` and the shared band through `WheelTimePicker.Indicator`.

```tsx
<WheelTimePicker
  hourFormat={24}
  itemHeight={56}
  value={time}
  onValueChange={setTime}
>
  <WheelTimePicker.Hour classNames={{ itemLabel: 'text-3xl font-semibold' }} />
  <WheelTimePicker.Minute
    classNames={{ itemLabel: 'text-3xl font-semibold' }}
  />
  <WheelTimePicker.Indicator
    classNames={{ highlight: 'rounded-full bg-accent-soft' }}
  />
  <WheelTimePicker.Mask />
</WheelTimePicker>
```

### Custom item render

Pass `renderItem` to compose custom row content per column. Use `WheelPicker.Item` as the outer wrapper to preserve sizing and tap-to-focus.

```tsx
<WheelTimePicker hourFormat={24} value={time} onValueChange={setTime}>
  <WheelTimePicker.Hour
    renderItem={({ item }) => (
      <WheelPicker.Item className="gap-1.5">
        <WheelPicker.ItemLabel className="tabular-nums">
          {item.label}
        </WheelPicker.ItemLabel>
        <AppText className="text-sm text-muted">hour</AppText>
      </WheelPicker.Item>
    )}
  />
  <WheelTimePicker.Minute ... />
  <WheelTimePicker.Indicator />
  <WheelTimePicker.Mask />
</WheelTimePicker>
```

### Disabled

Block interaction and dim the picker with `isDisabled`.

```tsx
<WheelTimePicker isDisabled defaultValue={new Time(10, 45)} />
```

## Example

```tsx
import { Time } from '@internationalized/date';
import { WheelTimePicker } from 'heroui-native-pro';
import { useState } from 'react';
import { Text, View } from 'react-native';

export default function MeetingTimePicker() {
  const [time, setTime] = useState(new Time(9, 30));

  return (
    <View className="flex-1 items-center justify-center px-5">
      <View className="items-center gap-4">
        <Text className="text-3xl font-bold text-accent tabular-nums">
          {String(time.hour).padStart(2, '0')}:
          {String(time.minute).padStart(2, '0')}
        </Text>
        <View className="w-[260px]">
          <WheelTimePicker value={time} onValueChange={setTime} />
        </View>
      </View>
    </View>
  );
}
```

## API Reference

### WheelTimePicker

| prop             | type                           | default | description                                                                                                                              |
| ---------------- | ------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `children`       | `React.ReactNode`              | -       | Compound children. When omitted, the root renders the full default set (`Hour`, `Minute`, `Period` in 12-hour mode, `Indicator`, `Mask`) |
| `itemHeight`     | `number`                       | `44`    | Pixel height of a single row, shared by all columns                                                                                      |
| `visibleCount`   | `number`                       | `5`     | Number of visible rows, shared by all columns. Must be odd                                                                               |
| `hourFormat`     | `WheelTimePickerHourFormat`    | `12`    | Hour display mode. Determines the hour column range and whether an AM/PM period column is rendered by default                            |
| `minuteInterval` | `number`                       | `1`     | Step between consecutive minute options. Should be a positive integer that divides evenly into 60                                        |
| `locale`         | `string`                       | `en-US` | BCP 47 locale used to localize the AM/PM period labels. The stored period value remains the canonical `"AM"` / `"PM"`                    |
| `value`          | `Time`                         | -       | Controlled selected time                                                                                                                 |
| `defaultValue`   | `Time`                         | -       | Uncontrolled initial selected time                                                                                                       |
| `isDisabled`     | `boolean`                      | `false` | Disables interaction for every column                                                                                                    |
| `className`      | `string`                       | -       | Additional CSS classes for the group container                                                                                           |
| `onValueChange`  | `(value: Time) => void`        | -       | Fires whenever the selection changes — during scroll, on tap-to-focus, and on imperative column scrolls                                  |
| `onValueCommit`  | `(value: Time) => void`        | -       | Fires exactly once after every column has come to rest                                                                                   |
| `animation`      | `WheelTimePickerRootAnimation` | -       | Animation configuration. Cascades `disable-all` to the underlying group and its wheels                                                   |
| `ref`            | `WheelTimePickerRootRef`       | -       | Forwarded to the underlying group root `View`                                                                                            |
| `...ViewProps`   | `Omit<ViewProps, 'children'>`  | -       | All standard React Native View props are supported (minus the value-record props the root manages internally)                            |

#### WheelTimePickerHourFormat

Hour display mode.

- `12`: twelve-hour clock with an AM/PM period column.
- `24`: twenty-four-hour clock without a period column.

#### WheelTimePickerPeriod

Canonical day-period value stored on the period column. Always `"AM"` or `"PM"` regardless of the localized label shown to the user.

#### WheelTimePickerRootAnimation

Animation configuration for the root, aliased from `WheelPickerGroupRootAnimation`. The root owns no animated styles of its own — this prop only cascades the `disable-all` state to the underlying group and its wheels.

- `"disable-all"`: Disable all animations including the columns (rows snap without fading or scaling).
- `undefined`: Use default animations.

#### WheelTimePickerValues

Decomposed wheel selection used to bridge between a `Time` value and the group values record.

| prop     | type                    | description                                                    |
| -------- | ----------------------- | -------------------------------------------------------------- |
| `hour`   | `number`                | Hour value. `1`–`12` in 12-hour mode, `0`–`23` in 24-hour mode |
| `minute` | `number`                | Minute value, snapped to the active `minuteInterval`           |
| `period` | `WheelTimePickerPeriod` | Day period. Present only in 12-hour mode                       |

### WheelTimePicker.Hour

Hour column. The root owns `name` and `items`; the value and `onValueChange` are managed by the root via the group. Use the props below to customize row content and appearance. Extends `WheelPicker` props (minus `name` / `items`).

| prop           | type                                                         | default                 | description                                                                                                 |
| -------------- | ------------------------------------------------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------- |
| `children`     | `React.ReactNode`                                            | -                       | Compound parts (e.g. a custom `WheelPicker.Mask`). The shared indicator is rendered by the root             |
| `isDisabled`   | `boolean`                                                    | `false`                 | Disables interaction for this column independently of the root                                              |
| `className`    | `string`                                                     | -                       | Additional CSS classes for the column container                                                             |
| `classNames`   | `ElementSlots<WheelPickerRootSlots>`                         | -                       | Additional CSS classes for individual column slots. The `itemLabel` slot keeps numerals tabular by default  |
| `styles`       | `WheelPickerRootStyles`                                      | -                       | Inline styles for individual column slots                                                                   |
| `renderItem`   | `WheelPickerRenderItem<number>`                              | -                       | Custom row renderer. When omitted, the default renderer shows `item.label` inside a `WheelPicker.ItemLabel` |
| `keyExtractor` | `(item: WheelPickerOption<number>, index: number) => string` | Primitive-aware default | Key extractor for the underlying `FlatList`                                                                 |
| `animation`    | `WheelPickerRootAnimation`                                   | -                       | Animation configuration for the per-item opacity / scale interpolation                                      |
| `ref`          | `WheelTimePickerHourRef`                                     | -                       | Imperative ref exposing `scrollToIndex` and `scrollToValue` in addition to the underlying view              |
| `...ViewProps` | `Omit<ViewProps, 'children'>`                                | -                       | All standard React Native View props are supported                                                          |

#### ElementSlots\<WheelPickerRootSlots\>

| slot               | description                                                               |
| ------------------ | ------------------------------------------------------------------------- |
| `container`        | Outer viewport wrapping the scroll list and overlays                      |
| `contentContainer` | Scroll content container carrier; receives the vertical centering padding |
| `item`             | Per-row animated container                                                |
| `itemLabel`        | Default label text inside a row (tabular numerals by default)             |

### WheelTimePicker.Minute

Minute column. Same props as `WheelTimePicker.Hour` (`WheelPicker` props minus `name` / `items`, root-owned). The `itemLabel` slot keeps numerals tabular by default.

### WheelTimePicker.Period

AM/PM period column rendered by default in 12-hour mode. Same props as `WheelTimePicker.Hour`, with a `WheelTimePickerPeriod` value type (`renderItem` receives `WheelPickerOption<WheelTimePickerPeriod>`). Root-owned `name` / `items`.

### WheelTimePicker.Indicator

Shared selection band spanning every column. Same props as `WheelPickerGroup.Indicator`.

| prop           | type                                                         | default | description                                                                                                                                                                                   |
| -------------- | ------------------------------------------------------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`     | `React.ReactNode`                                            | -       | Optional content rendered inside the indicator's `highlight` slot (patterns, gradients, icons). Pair with `overflow-hidden` on the highlight so the content is clipped to the rounded corners |
| `className`    | `string`                                                     | -       | Additional CSS classes for the indicator container                                                                                                                                            |
| `classNames`   | `ElementSlots<WheelPickerGroupIndicatorSlots>`               | -       | Additional CSS classes for individual indicator slots                                                                                                                                         |
| `styles`       | `Partial<Record<WheelPickerGroupIndicatorSlots, ViewStyle>>` | -       | Inline styles for individual indicator slots                                                                                                                                                  |
| `ref`          | `WheelTimePickerIndicatorRef`                                | -       | Forwarded to the underlying indicator `View`                                                                                                                                                  |
| `...ViewProps` | `ViewProps`                                                  | -       | All standard React Native View props are supported                                                                                                                                            |

#### ElementSlots\<WheelPickerGroupIndicatorSlots\>

| slot        | description                                               |
| ----------- | --------------------------------------------------------- |
| `wrapper`   | Absolutely-positioned band centered on the group viewport |
| `highlight` | Filled rectangle rendered inside the wrapper              |

#### styles

| slot        | type        | description                              |
| ----------- | ----------- | ---------------------------------------- |
| `wrapper`   | `ViewStyle` | Inline style for the indicator wrapper   |
| `highlight` | `ViewStyle` | Inline style for the indicator highlight |

### WheelTimePicker.Mask

Top / bottom fade overlays spanning the full group viewport. Same props as `WheelPickerGroup.Mask`.

| prop           | type                                                    | default                       | description                                                                                                                          |
| -------------- | ------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `color`        | `string`                                                | `useThemeColor('background')` | Solid color the gradient fades from. Accepts any RN color string. Falls back to the theme `background` color when omitted            |
| `height`       | `number \| string`                                      | `"100%"`                      | Height of each mask half. `number` = raw pixels; percentage scales the default fade height (`((visibleCount - 1) / 4) * itemHeight`) |
| `className`    | `string`                                                | -                             | Additional CSS classes applied to both mask halves                                                                                   |
| `classNames`   | `ElementSlots<WheelPickerGroupMaskSlots>`               | -                             | Additional CSS classes for individual mask slots                                                                                     |
| `styles`       | `Partial<Record<WheelPickerGroupMaskSlots, ViewStyle>>` | -                             | Inline styles for individual mask slots                                                                                              |
| `ref`          | `WheelTimePickerMaskRef`                                | -                             | Forwarded to the underlying mask `View`                                                                                              |
| `...ViewProps` | `Omit<ViewProps, 'children'>`                           | -                             | All standard React Native View props are supported                                                                                   |

#### ElementSlots\<WheelPickerGroupMaskSlots\>

| slot     | description         |
| -------- | ------------------- |
| `top`    | Top fade overlay    |
| `bottom` | Bottom fade overlay |

#### styles

| slot     | type        | description                              |
| -------- | ----------- | ---------------------------------------- |
| `top`    | `ViewStyle` | Inline style for the top fade overlay    |
| `bottom` | `ViewStyle` | Inline style for the bottom fade overlay |
