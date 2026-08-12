# WheelPickerGroup

A coordinated row of `WheelPicker` instances that share layout, emit a composite values record, and report when every wheel has come to rest.

## Import

```tsx
import { WheelPicker, WheelPickerGroup } from 'heroui-native-pro';
```

## Anatomy

```tsx
<WheelPickerGroup>
  <WheelPicker name="..." items={[...]} />
  <WheelPicker name="..." items={[...]} />
  <WheelPickerGroup.Indicator />
  <WheelPickerGroup.Mask />
</WheelPickerGroup>
```

- **WheelPickerGroup**: Root container. Owns a shared controllable `values` record keyed by each child wheel's `name`, broadcasts `itemHeight` / `visibleCount` to the group, coordinates cross-wheel scroll syncing, and cascades `animation="disable-all"` to all child wheels. Child wheels nested in the group automatically receive `flex-1` so they distribute the row evenly.
- **WheelPickerGroup.Indicator**: Optional shared selection band spanning every wheel at the center of the group viewport. Replaces the per-wheel indicator when a `WheelPicker` is nested in the group.
- **WheelPickerGroup.Mask**: Optional top / bottom fade overlays spanning the full group viewport.

## Usage

### Basic usage

Compose a row of `WheelPicker` instances inside the group. Each child wheel declares a unique `name` and the group keys the shared values record by that name.

```tsx
const [values, setValues] = useState({ currency: 'USD', amount: 100 });

<WheelPickerGroup values={values} onValuesChange={setValues}>
  <WheelPicker name="currency" items={CURRENCY_ITEMS} />
  <WheelPicker name="amount" items={AMOUNT_ITEMS} />
  <WheelPickerGroup.Indicator />
  <WheelPickerGroup.Mask />
</WheelPickerGroup>;
```

### Uncontrolled

Pass `defaultValues` to seed the initial selections without managing external state.

```tsx
<WheelPickerGroup
  defaultValues={{ currency: 'USD', amount: 100 }}
  onValuesChange={(next) => console.log(next)}
>
  <WheelPicker name="currency" items={CURRENCY_ITEMS} />
  <WheelPicker name="amount" items={AMOUNT_ITEMS} />
  <WheelPickerGroup.Indicator />
  <WheelPickerGroup.Mask />
</WheelPickerGroup>
```

### Item height and visible count

`itemHeight` and `visibleCount` are set on the group and shared across every wheel. `visibleCount` must be odd.

```tsx
<WheelPickerGroup
  defaultValues={{ currency: 'USD', amount: 100 }}
  itemHeight={56}
  visibleCount={5}
>
  <WheelPicker name="currency" items={CURRENCY_ITEMS} />
  <WheelPicker name="amount" items={AMOUNT_ITEMS} />
  <WheelPickerGroup.Indicator />
  <WheelPickerGroup.Mask />
</WheelPickerGroup>
```

### Custom indicator

Style the shared selection band via `classNames` on `WheelPickerGroup.Indicator`, or pass any `children` for decorative content rendered inside the `highlight` slot (patterns, gradients, icons). The indicator spans every wheel column. Pair with `overflow-hidden` on the highlight when the children should be clipped to the rounded corners.

```tsx
<WheelPickerGroup defaultValues={{ currency: 'USD', amount: 100 }}>
  <WheelPicker name="currency" items={CURRENCY_ITEMS} />
  <WheelPicker name="amount" items={AMOUNT_ITEMS} />
  <WheelPickerGroup.Indicator
    classNames={{
      highlight: 'bg-accent-soft border border-accent/15 overflow-hidden',
    }}
  >
    <MyIndicatorPattern />
  </WheelPickerGroup.Indicator>
  <WheelPickerGroup.Mask />
</WheelPickerGroup>
```

### Custom mask color

Override the fade color when the group sits on a non-`background` surface. Combine with `height` (number or percentage) to control how far the fade extends.

```tsx
const overlayColor = useThemeColor('overlay');

<WheelPickerGroup defaultValues={{ currency: 'USD', amount: 100 }}>
  <WheelPicker name="currency" items={CURRENCY_ITEMS} />
  <WheelPicker name="amount" items={AMOUNT_ITEMS} />
  <WheelPickerGroup.Indicator />
  <WheelPickerGroup.Mask color={overlayColor} height="75%" />
</WheelPickerGroup>;
```

### Commit on rest

`onValuesCommit` fires exactly once after every wheel in the group has come to rest. Use it to commit a composite selection without listening to intermediate scroll updates.

```tsx
<WheelPickerGroup
  defaultValues={{ currency: 'USD', amount: 100 }}
  onValuesCommit={(next) => submitOrder(next)}
>
  <WheelPicker name="currency" items={CURRENCY_ITEMS} />
  <WheelPicker name="amount" items={AMOUNT_ITEMS} />
  <WheelPickerGroup.Indicator />
  <WheelPickerGroup.Mask />
</WheelPickerGroup>
```

### Disable animations

Pass `animation="disable-all"` on the group to cascade the disabled state to every child wheel (rows snap without fading or scaling, and any animated descendants of a child wheel are also disabled).

```tsx
<WheelPickerGroup
  defaultValues={{ currency: 'USD', amount: 100 }}
  animation="disable-all"
>
  <WheelPicker name="currency" items={CURRENCY_ITEMS} />
  <WheelPicker name="amount" items={AMOUNT_ITEMS} />
  <WheelPickerGroup.Indicator />
  <WheelPickerGroup.Mask />
</WheelPickerGroup>
```

### Disabled

Block interaction and dim the group with `isDisabled`. Each child wheel can still set its own `isDisabled` independently.

```tsx
<WheelPickerGroup
  defaultValues={{ currency: 'USD', amount: 100 }}
  isDisabled
>
  <WheelPicker name="currency" items={CURRENCY_ITEMS} />
  <WheelPicker name="amount" items={AMOUNT_ITEMS} />
  <WheelPickerGroup.Indicator />
  <WheelPickerGroup.Mask />
</WheelPickerGroup>
```

## Example

```tsx
import { WheelPicker, WheelPickerGroup } from 'heroui-native-pro';
import { useState } from 'react';
import { Text, View } from 'react-native';

const CURRENCY_ITEMS = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  { value: 'JPY', label: 'JPY' },
  { value: 'CAD', label: 'CAD' },
];

const AMOUNT_ITEMS = [50, 100, 200, 500, 1000, 2500, 5000].map((amount) => ({
  value: amount,
  label: String(amount),
}));

export default function TransferAmountPicker() {
  const [values, setValues] = useState<Record<string, unknown>>({
    currency: 'USD',
    amount: 500,
  });

  return (
    <View className="flex-1 items-center justify-center px-5">
      <View className="items-center gap-6">
        <View className="items-center gap-1">
          <Text className="text-xs text-muted uppercase tracking-wider">
            Send
          </Text>
          <Text className="text-3xl font-bold text-foreground tabular-nums">
            {String(values.currency)} {String(values.amount)}
          </Text>
        </View>
        <View className="w-[280px]">
          <WheelPickerGroup values={values} onValuesChange={setValues}>
            <WheelPicker name="currency" items={CURRENCY_ITEMS} />
            <WheelPicker name="amount" items={AMOUNT_ITEMS} />
            <WheelPickerGroup.Indicator />
            <WheelPickerGroup.Mask />
          </WheelPickerGroup>
        </View>
      </View>
    </View>
  );
}
```

## API Reference

### WheelPickerGroup

| prop             | type                                            | default | description                                                                                                                              |
| ---------------- | ----------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `children`       | `React.ReactNode`                               | -       | Compound children. Typically a sequence of `WheelPicker` instances, optionally accompanied by `WheelPickerGroup.Indicator` and `Mask`    |
| `values`         | `WheelPickerGroupValues`                        | -       | Controlled values record. Keyed by each child wheel's `name`                                                                             |
| `defaultValues`  | `WheelPickerGroupValues`                        | -       | Uncontrolled initial values record. Keyed by each child wheel's `name`                                                                   |
| `itemHeight`     | `number`                                        | `44`    | Pixel height of a single row, shared by all child wheels                                                                                 |
| `visibleCount`   | `number`                                        | `5`     | Number of visible rows, shared by all child wheels. Must be odd                                                                          |
| `isDisabled`     | `boolean`                                       | `false` | Disables interaction for the whole group. Each child wheel may also be disabled locally                                                  |
| `className`      | `string`                                        | -       | Additional CSS classes for the root container                                                                                            |
| `onValuesChange` | `(values: WheelPickerGroupValues) => void`      | -       | Fires when any wheel's value changes — during scroll, on tap-to-focus, and on imperative scrolls. Not fired on external `values` updates |
| `onValuesCommit` | `(values: WheelPickerGroupValues) => void`      | -       | Fires exactly once after every wheel in the group has come to rest                                                                       |
| `animation`      | `WheelPickerGroupRootAnimation`                 | -       | Animation configuration. Cascades `disable-all` to every child wheel                                                                     |
| `ref`            | `WheelPickerGroupRootRef`                       | -       | Forwarded to the underlying root `View`                                                                                                  |
| `...ViewProps`   | `Omit<ViewProps, 'children'>`                   | -       | All standard React Native View props are supported                                                                                       |

#### WheelPickerGroupValues

Shared values record exchanged with the group through `values`, `defaultValues`, and `onValuesChange` / `onValuesCommit`.

| key        | type      | description                                                                                              |
| ---------- | --------- | -------------------------------------------------------------------------------------------------------- |
| `[name]`   | `unknown` | One entry per child wheel, keyed by the wheel's `name` prop. The value type is `unknown` to allow heterogeneous wheels |

#### WheelPickerGroupRootAnimation

Animation configuration for the group root. The group has no animated styles of its own — this prop only controls the `disable-all` cascade to every child wheel.

- `"disable-all"`: Disable all animations including children (cascades to every child `WheelPicker`)
- `undefined`: Use default animations

### WheelPickerGroup.Indicator

| prop           | type                                                         | default | description                                                                                                                                                                                                |
| -------------- | ------------------------------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`     | `React.ReactNode`                                            | -       | Optional content rendered inside the indicator's `highlight` slot (patterns, gradients, icons). Pair with `overflow-hidden` on the highlight so the content is clipped to the rounded corners              |
| `className`    | `string`                                                     | -       | Additional CSS classes for the indicator container                                                                                                                                                         |
| `classNames`   | `ElementSlots<WheelPickerGroupIndicatorSlots>`               | -       | Additional CSS classes for individual indicator slots                                                                                                                                                      |
| `styles`       | `Partial<Record<WheelPickerGroupIndicatorSlots, ViewStyle>>` | -       | Inline styles for individual indicator slots                                                                                                                                                               |
| `...ViewProps` | `ViewProps`                                                  | -       | All standard React Native View props are supported                                                                                                                                                         |

#### ElementSlots\<WheelPickerGroupIndicatorSlots\>

| slot        | description                                                |
| ----------- | ---------------------------------------------------------- |
| `wrapper`   | Absolutely-positioned band centered on the group viewport  |
| `highlight` | Filled rectangle rendered inside the wrapper               |

#### styles

| slot        | type        | description                              |
| ----------- | ----------- | ---------------------------------------- |
| `wrapper`   | `ViewStyle` | Inline style for the indicator wrapper   |
| `highlight` | `ViewStyle` | Inline style for the indicator highlight |

### WheelPickerGroup.Mask

| prop           | type                                                    | default                       | description                                                                                                                          |
| -------------- | ------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `color`        | `string`                                                | `useThemeColor('background')` | Solid color the gradient fades from. Accepts any RN color string. Falls back to the theme `background` color when omitted            |
| `height`       | `number \| string`                                      | `"100%"`                      | Height of each mask half. `number` = raw pixels; percentage scales the default fade height (`((visibleCount - 1) / 4) * itemHeight`) |
| `className`    | `string`                                                | -                             | Additional CSS classes applied to both mask halves                                                                                   |
| `classNames`   | `ElementSlots<WheelPickerGroupMaskSlots>`               | -                             | Additional CSS classes for individual mask slots                                                                                     |
| `styles`       | `Partial<Record<WheelPickerGroupMaskSlots, ViewStyle>>` | -                             | Inline styles for individual mask slots                                                                                              |
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

## Hooks

### useWheelPickerGroup

Hook to access the WheelPickerGroup context. Must be used within a `WheelPickerGroup` component.

```tsx
import { useWheelPickerGroup } from 'heroui-native-pro';

const { itemHeight, visibleCount, getValue, setValue } = useWheelPickerGroup();
```

#### Returns: WheelPickerGroupContextValue

| property              | type                                       | description                                                                                                  |
| --------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `itemHeight`          | `number`                                   | Resolved row height shared across the group's wheels                                                         |
| `visibleCount`        | `number`                                   | Number of visible rows shared across the group's wheels                                                      |
| `isDisabled`          | `boolean`                                  | Whether the group as a whole is disabled                                                                     |
| `getValue`            | `(name: string) => unknown`                | Read the current value for the wheel identified by `name`                                                    |
| `setValue`            | `(name: string, value: unknown) => void`   | Write the value for the wheel identified by `name`. Merges into the group's values record                    |
| `notifyScrollState`   | `(isScrolling: boolean) => void`           | Notify the group that one of its wheels has started or stopped scrolling. Used internally by child wheels    |
| `isAnyWheelScrolling` | `() => boolean`                            | Returns `true` while at least one wheel in the group is scrolling                                            |
