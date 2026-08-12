# NumberField

A numeric input with increment and decrement buttons for precise value entry.

## Import

```tsx
import { NumberField } from 'heroui-native-pro';
```

## Anatomy

```tsx
<NumberField>
  <Label>...</Label>
  <NumberField.Group>
    <NumberField.DecrementButton />
    <NumberField.Input />
    <NumberField.IncrementButton />
  </NumberField.Group>
  <Description>...</Description>
</NumberField>
```

- **NumberField**: Root container that manages numeric state, provides form field context (for Label, Description, FieldError), and cascades animation settings to children. Supports controlled and uncontrolled modes with min/max/step constraints and Intl number formatting.
- **NumberField.Group**: Plain View wrapper that contains the decrement button, input, and increment button. Accepts a render function for accessing group state.
- **NumberField.Input**: Pass-through to the Input component. Displays the formatted numeric value and automatically adds horizontal padding to avoid overlapping with the buttons. Commits the value on blur.
- **NumberField.DecrementButton**: Absolutely positioned button anchored to the left side of the input. Decrements the value by one step. Auto-disabled when the value reaches minValue. Supports long-press repeat.
- **NumberField.IncrementButton**: Absolutely positioned button anchored to the right side of the input. Increments the value by one step. Auto-disabled when the value reaches maxValue. Supports long-press repeat.

## Usage

### Basic Usage

The NumberField component uses compound parts to create a numeric input with number stepper buttons.

```tsx
<NumberField defaultValue={1024} minValue={0}>
  <Label>Width</Label>
  <NumberField.Group>
    <NumberField.DecrementButton />
    <NumberField.Input />
    <NumberField.IncrementButton />
  </NumberField.Group>
</NumberField>
```

### With Description

Add context below the input with a Description component.

```tsx
<NumberField defaultValue={1024} minValue={0}>
  <Label>Width</Label>
  <NumberField.Group>
    <NumberField.DecrementButton />
    <NumberField.Input />
    <NumberField.IncrementButton />
  </NumberField.Group>
  <Description>Enter the width in pixels</Description>
</NumberField>
```

### Controlled Value

Use `value` and `onChange` to control the numeric state externally.

```tsx
const [value, setValue] = useState(1024);

<NumberField minValue={0} value={value} onChange={setValue}>
  <Label>Width</Label>
  <NumberField.Group>
    <NumberField.DecrementButton />
    <NumberField.Input />
    <NumberField.IncrementButton />
  </NumberField.Group>
</NumberField>
```

### Step Values

Configure the step size for increment and decrement operations.

```tsx
<NumberField defaultValue={0} minValue={0} maxValue={100} step={10}>
  <Label>Quantity</Label>
  <NumberField.Group>
    <NumberField.DecrementButton />
    <NumberField.Input />
    <NumberField.IncrementButton />
  </NumberField.Group>
</NumberField>
```

### Format Options

Use `Intl.NumberFormatOptions` to format the displayed value as currency, percent, unit, or decimal.

```tsx
<NumberField
  defaultValue={99.99}
  minValue={0}
  formatOptions={{ style: "currency", currency: "USD" }}
>
  <Label>Price</Label>
  <NumberField.Group>
    <NumberField.DecrementButton />
    <NumberField.Input />
    <NumberField.IncrementButton />
  </NumberField.Group>
</NumberField>
```

### Percentage Format

Format the value as a percentage where `0.5` displays as `50%`.

```tsx
<NumberField
  defaultValue={0.5}
  minValue={0}
  maxValue={1}
  step={0.01}
  formatOptions={{ style: "percent" }}
>
  <Label>Percentage</Label>
  <NumberField.Group>
    <NumberField.DecrementButton />
    <NumberField.Input />
    <NumberField.IncrementButton />
  </NumberField.Group>
</NumberField>
```

### Disabled State

Disable the entire number field and its children.

```tsx
<NumberField isDisabled defaultValue={1024} minValue={0}>
  <Label>Width</Label>
  <NumberField.Group>
    <NumberField.DecrementButton />
    <NumberField.Input />
    <NumberField.IncrementButton />
  </NumberField.Group>
</NumberField>
```

### Invalid State with FieldError

Combine `isInvalid` with FieldError to display validation messages.

```tsx
<NumberField isRequired isInvalid={value > 100} minValue={0} value={value} onChange={setValue}>
  <Label>Quantity</Label>
  <NumberField.Group>
    <NumberField.DecrementButton />
    <NumberField.Input />
    <NumberField.IncrementButton />
  </NumberField.Group>
  <Description hideOnInvalid>Enter a value between 0 and 100</Description>
  <FieldError>Quantity must be 100 or less</FieldError>
</NumberField>
```

### Render Function Group

Use a render function on `NumberField.Group` to access group state.

```tsx
<NumberField defaultValue={50} minValue={0} maxValue={100}>
  <Label>Value</Label>
  <NumberField.Group>
    {({ canDecrement, canIncrement }) => (
      <>
        {canDecrement && <NumberField.DecrementButton />}
        <NumberField.Input />
        {canIncrement && <NumberField.IncrementButton />}
      </>
    )}
  </NumberField.Group>
</NumberField>
```

## Example

```tsx
import { Description, FieldError, Label, NumberField, Surface } from 'heroui-native-pro';
import { useState } from 'react';
import { View } from 'react-native';

export default function NumberFieldExample() {
  const [value, setValue] = useState(150);
  const isInvalid = value > 100;

  return (
    <View className="flex-1 justify-center px-5">
      <Surface className="rounded-3xl p-6 gap-6">
        <NumberField defaultValue={1024} minValue={0}>
          <Label>Width</Label>
          <NumberField.Group>
            <NumberField.DecrementButton />
            <NumberField.Input />
            <NumberField.IncrementButton />
          </NumberField.Group>
          <Description>Enter the width in pixels</Description>
        </NumberField>

        <NumberField
          isRequired
          isInvalid={isInvalid}
          minValue={0}
          value={value}
          onChange={setValue}
        >
          <Label>Quantity</Label>
          <NumberField.Group>
            <NumberField.DecrementButton />
            <NumberField.Input />
            <NumberField.IncrementButton />
          </NumberField.Group>
          <Description hideOnInvalid>Enter a value between 0 and 100</Description>
          <FieldError>Quantity must be 100 or less</FieldError>
        </NumberField>
      </Surface>
    </View>
  );
}
```

## API Reference

### NumberField

| prop           | type                       | default | description                                                            |
| -------------- | -------------------------- | ------- | ---------------------------------------------------------------------- |
| `children`     | `React.ReactNode`          | -       | Children elements (Label, NumberField.Group, Description, FieldError)  |
| `value`        | `number`                   | -       | Controlled numeric value                                               |
| `defaultValue` | `number`                   | -       | Default value for uncontrolled usage                                   |
| `minValue`     | `number`                   | -       | Minimum allowed value; disables decrement button at limit              |
| `maxValue`     | `number`                   | -       | Maximum allowed value; disables increment button at limit              |
| `step`         | `number`                   | `1`     | Step value for increment and decrement operations                      |
| `formatOptions`| `Intl.NumberFormatOptions`  | -       | Intl.NumberFormat options for formatting (currency, percent, unit, etc) |
| `isDisabled`   | `boolean`                  | `false` | Whether the entire number field and its children are disabled          |
| `isInvalid`    | `boolean`                  | `false` | Whether the number field is in an invalid state                        |
| `isRequired`   | `boolean`                  | `false` | Whether the number field is required                                   |
| `className`    | `string`                   | -       | Additional CSS classes                                                 |
| `animation`    | `AnimationRootDisableAll`  | -       | Animation configuration for number field                               |
| `onChange`     | `(value: number) => void`  | -       | Handler called when the numeric value changes                          |
| `...ViewProps` | `ViewProps`                | -       | All standard React Native View props are supported                     |

#### AnimationRootDisableAll

Animation configuration for the NumberField root component. Can be:

- `"disable-all"`: Disable all animations including children (cascades down)
- `undefined`: Use default animations

### NumberField.Group

| prop           | type                                                                              | default | description                                                    |
| -------------- | --------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------- |
| `children`     | `React.ReactNode \| ((props: NumberFieldGroupRenderProps) => React.ReactNode)`    | -       | Children elements, or a render function receiving group state  |
| `className`    | `string`                                                                          | -       | Additional CSS classes                                         |
| `...ViewProps` | `ViewProps`                                                                       | -       | All standard React Native View props are supported             |

#### NumberFieldGroupRenderProps

| property               | type      | description                                          |
| ---------------------- | --------- | ---------------------------------------------------- |
| `numberValue`          | `number`  | Current numeric value (NaN when empty)               |
| `displayValue`         | `string`  | Display string shown in the input                    |
| `canIncrement`         | `boolean` | Whether the value can be incremented (not at max)    |
| `canDecrement`         | `boolean` | Whether the value can be decremented (not at min)    |
| `isDisabled`           | `boolean` | Whether the number field is disabled                 |
| `isInvalid`            | `boolean` | Whether the number field is in an invalid state      |
| `isRequired`           | `boolean` | Whether the number field is required                 |
| `decrementButtonWidth` | `number`  | Measured width of the decrement button (0 if absent) |
| `incrementButtonWidth` | `number`  | Measured width of the increment button (0 if absent) |

### NumberField.Input

| prop                 | type         | default | description                                                            |
| -------------------- | ------------ | ------- | ---------------------------------------------------------------------- |
| `isAutoPaddingActive`| `boolean`    | `true`  | Whether auto padding is added to avoid overlapping with buttons        |
| `autoPaddingAddon`   | `number`     | `12`    | Extra horizontal spacing (in px) between button edge and text content  |
| `...InputProps`      | `InputProps` | -       | All Input component props are supported                                |

### NumberField.DecrementButton

| prop                    | type                                       | default | description                                                          |
| ----------------------- | ------------------------------------------ | ------- | -------------------------------------------------------------------- |
| `children`              | `React.ReactNode`                          | -       | Button content; defaults to MinusIcon when omitted                   |
| `style`                 | `StyleProp<ViewStyle>`                     | -       | Style applied to the outer Pressable container                       |
| `className`             | `string`                                   | -       | Additional CSS classes for the outer container slot                   |
| `classNames`            | `ElementSlots<DecrementButtonSlots>`       | -       | Additional CSS classes for individual slots                          |
| `styles`                | `Partial<Record<DecrementButtonSlots, ViewStyle>>` | -       | Styles for individual slots                                  |
| `animation`             | `NumberFieldButtonAnimation`               | -       | Animation configuration for button press scale feedback              |
| `isAnimatedStyleActive` | `boolean`                                  | `true`  | Whether animated styles are applied to the contentContainer          |
| `iconProps`             | `NumberFieldButtonIconProps`               | -       | Props forwarded to the default icon; ignored with custom children    |
| `...PressableProps`     | `PressableProps`                           | -       | All standard React Native Pressable props are supported              |

#### `ElementSlots<DecrementButtonSlots>`

| prop               | type     | description                                           |
| ------------------ | -------- | ----------------------------------------------------- |
| `container`        | `string` | Custom class name for the outer Pressable container   |
| `contentContainer` | `string` | Custom class name for the inner animated content view |

#### `styles`

| prop               | type        | description                                    |
| ------------------ | ----------- | ---------------------------------------------- |
| `container`        | `ViewStyle` | Styles for the outer Pressable container       |
| `contentContainer` | `ViewStyle` | Styles for the inner animated content view     |

#### NumberFieldButtonIconProps

| prop    | type     | default      | description                                         |
| ------- | -------- | ------------ | --------------------------------------------------- |
| `size`  | `number` | `16`         | Icon size in logical pixels                         |
| `color` | `string` | `foreground` | Icon fill color; defaults to theme foreground color |

#### NumberFieldButtonAnimation

Animation configuration for increment/decrement button press feedback. Can be:

- `false` or `"disabled"`: Disable button press animation
- `undefined`: Use default animation
- `object`: Custom animation configuration

| prop                   | type               | default            | description                          |
| ---------------------- | ------------------ | ------------------ | ------------------------------------ |
| `scale.value`          | `[number, number]` | `[1, 0.9]`        | Scale values [unpressed, pressed]    |
| `scale.timingConfig`   | `WithTimingConfig` | `{ duration: 150 }`| Animation timing configuration       |

### NumberField.IncrementButton

| prop                    | type                                       | default | description                                                          |
| ----------------------- | ------------------------------------------ | ------- | -------------------------------------------------------------------- |
| `children`              | `React.ReactNode`                          | -       | Button content; defaults to PlusIcon when omitted                    |
| `style`                 | `StyleProp<ViewStyle>`                     | -       | Style applied to the outer Pressable container                       |
| `className`             | `string`                                   | -       | Additional CSS classes for the outer container slot                   |
| `classNames`            | `ElementSlots<IncrementButtonSlots>`       | -       | Additional CSS classes for individual slots                          |
| `styles`                | `Partial<Record<IncrementButtonSlots, ViewStyle>>` | -       | Styles for individual slots                                  |
| `animation`             | `NumberFieldButtonAnimation`               | -       | Animation configuration for button press scale feedback              |
| `isAnimatedStyleActive` | `boolean`                                  | `true`  | Whether animated styles are applied to the contentContainer          |
| `iconProps`             | `NumberFieldButtonIconProps`               | -       | Props forwarded to the default icon; ignored with custom children    |
| `...PressableProps`     | `PressableProps`                           | -       | All standard React Native Pressable props are supported              |

The IncrementButton shares the same slot structure as DecrementButton. See `ElementSlots<DecrementButtonSlots>`, `styles`, `NumberFieldButtonIconProps`, and `NumberFieldButtonAnimation` above.
