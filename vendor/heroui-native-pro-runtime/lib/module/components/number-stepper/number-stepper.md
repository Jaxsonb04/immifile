# NumberStepper

A numeric stepper control for incrementing and decrementing values with animated transitions.

## Import

```tsx
import { NumberStepper } from 'heroui-native-pro';
```

## Anatomy

```tsx
<NumberStepper>
  <NumberStepper.DecrementButton />
  <NumberStepper.Value />
  <NumberStepper.IncrementButton />
</NumberStepper>
```

- **NumberStepper**: Root container that manages numeric value state, and provides context to sub-components. Supports both controlled and uncontrolled modes.
- **NumberStepper.DecrementButton**: Pressable button that decreases the value by one step. Auto-disables at the minimum boundary. Renders a minus icon by default.
- **NumberStepper.Value**: Displays the current numeric value with direction-aware flip animations on change.
- **NumberStepper.IncrementButton**: Pressable button that increases the value by one step. Auto-disables at the maximum boundary. Renders a plus icon by default.

## Usage

### Basic Usage

The NumberStepper component uses compound parts to create a numeric stepper control.

```tsx
<NumberStepper>
  <NumberStepper.DecrementButton />
  <NumberStepper.Value />
  <NumberStepper.IncrementButton />
</NumberStepper>
```

### Custom Step

Configure the increment/decrement amount per press.

```tsx
<NumberStepper defaultValue={0} step={5} minValue={0} maxValue={100}>
  <NumberStepper.DecrementButton />
  <NumberStepper.Value />
  <NumberStepper.IncrementButton />
</NumberStepper>

<NumberStepper defaultValue={0} step={0.5} minValue={0} maxValue={5}>
  <NumberStepper.DecrementButton />
  <NumberStepper.Value />
  <NumberStepper.IncrementButton />
</NumberStepper>
```

### Disabled

Disable the entire number stepper or let boundaries auto-disable individual buttons.

```tsx
<NumberStepper defaultValue={3} isDisabled>
  <NumberStepper.DecrementButton />
  <NumberStepper.Value />
  <NumberStepper.IncrementButton />
</NumberStepper>
```

### Controlled

Control the value externally with `value` and `onValueChange`.

```tsx
const [value, setValue] = useState(5);

<NumberStepper value={value} onValueChange={setValue} minValue={0} maxValue={20}>
  <NumberStepper.DecrementButton />
  <NumberStepper.Value />
  <NumberStepper.IncrementButton />
</NumberStepper>;
```

### Render Function Children

Use a render function to access number stepper state for conditional rendering.

```tsx
<NumberStepper
  value={quantity}
  onValueChange={setQuantity}
  minValue={1}
  maxValue={99}
>
  {({ isAtMin }) => (
    <>
      <NumberStepper.DecrementButton
        keepActiveAtBoundary
        onPress={() => {
          if (isAtMin) {
            Alert.alert('Removed', 'Item removed from cart');
          }
        }}
      >
        {isAtMin ? <TrashIcon size={16} /> : undefined}
      </NumberStepper.DecrementButton>
      <NumberStepper.Value />
      <NumberStepper.IncrementButton />
    </>
  )}
</NumberStepper>
```

## Example

```tsx
import { NumberStepper } from 'heroui-native-pro';
import { useState } from 'react';
import { Alert, View } from 'react-native';

export default function NumberStepperExample() {
  const [quantity, setQuantity] = useState(1);

  return (
    <View className="flex-1 px-5 items-center justify-center">
      <NumberStepper
        value={quantity}
        onValueChange={setQuantity}
        minValue={1}
        maxValue={99}
      >
        {({ isAtMin }) => (
          <>
            <NumberStepper.DecrementButton
              keepActiveAtBoundary
              onPress={() => {
                if (isAtMin) {
                  Alert.alert('Removed', 'Item removed from cart');
                }
              }}
            >
              {isAtMin ? <TrashIcon size={16} /> : undefined}
            </NumberStepper.DecrementButton>
            <NumberStepper.Value />
            <NumberStepper.IncrementButton />
          </>
        )}
      </NumberStepper>
    </View>
  );
}
```

## API Reference

### NumberStepper

| prop            | type                                                                                    | default     | description                                                            |
| --------------- | --------------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| `children`      | `React.ReactNode \| ((props: NumberStepperRootRenderProps) => React.ReactNode)` | -           | Children elements or render function receiving number stepper state |
| `value`         | `number`                                                                                | -           | Controlled numeric value                                               |
| `defaultValue`  | `number`                                                                                | `0`         | Default value for uncontrolled mode                                    |
| `minValue`      | `number`                                                                                | `-Infinity` | Minimum allowed value                                                  |
| `maxValue`      | `number`                                                                                | `Infinity`  | Maximum allowed value                                                  |
| `step`          | `number`                                                                                | `1`         | Step amount for increment/decrement operations                         |
| `isDisabled`    | `boolean`                                                                               | `false`     | Whether the number stepper is disabled                                 |
| `className`     | `string`                                                                                | -           | Additional CSS classes for the root container                          |
| `onValueChange` | `(value: number) => void`                                                               | -           | Callback fired when the value changes                                  |
| `animation`     | `AnimationRootDisableAll`                                                               | -           | Animation configuration for the root component                         |
| `...ViewProps`  | `ViewProps`                                                                             | -           | All standard React Native View props are supported                     |

#### NumberStepperRootRenderProps

| prop         | type      | description                                          |
| ------------ | --------- | ---------------------------------------------------- |
| `value`      | `number`  | Current numeric value of the number stepper           |
| `isAtMin`    | `boolean` | Whether the current value is at or below the minimum |
| `isAtMax`    | `boolean` | Whether the current value is at or above the maximum |
| `isDisabled` | `boolean` | Whether the entire number stepper is disabled         |
| `step`       | `number`  | Step increment/decrement amount                      |
| `minValue`   | `number`  | Minimum allowed value                                |
| `maxValue`   | `number`  | Maximum allowed value                                |

#### AnimationRootDisableAll

Animation configuration for the number stepper root component. Can be:

- `false` or `"disabled"`: Disable only root animations
- `"disable-all"`: Disable all animations including children
- `true` or `undefined`: Use default animations

### NumberStepper.DecrementButton

| prop                    | type                           | default | description                                                                               |
| ----------------------- | ------------------------------ | ------- | ----------------------------------------------------------------------------------------- |
| `children`              | `React.ReactNode`              | -       | Custom content for the button. Defaults to a minus icon                                   |
| `isDisabled`            | `boolean`                      | -       | Whether this button is individually disabled. Overrides context and boundary auto-disable |
| `keepActiveAtBoundary`  | `boolean`                      | `false` | When true, the button stays interactive at the min boundary instead of auto-disabling     |
| `className`             | `string`                       | -       | Additional CSS classes                                                                    |
| `iconProps`             | `NumberStepperButtonIconProps`  | -       | Props forwarded to the default minus icon. Ignored when `children` is provided            |
| `animation`             | `NumberStepperButtonAnimation`  | -       | Animation configuration for the button press scale effect                                 |
| `isAnimatedStyleActive` | `boolean`                      | `true`  | Whether animated styles (react-native-reanimated) are active                              |
| `...PressableProps`     | `PressableProps`               | -       | All standard React Native Pressable props are supported                                   |

### NumberStepper.Value

| prop                    | type                          | default | description                                                 |
| ----------------------- | ----------------------------- | ------- | ----------------------------------------------------------- |
| `children`              | `React.ReactNode`             | -       | Custom content to display instead of the default value text |
| `className`             | `string`                      | -       | Additional CSS classes for the value text                   |
| `animation`             | `NumberStepperValueAnimation`  | -       | Animation configuration for the value display               |
| `...Animated.TextProps` | `Animated.TextProps`          | -       | All Reanimated Animated.Text props are supported            |

#### NumberStepperValueAnimation

Animation configuration for the value component. Can be:

- `false` or `"disabled"`: Disable all animations
- `true` or `undefined`: Use default animations
- `object`: Custom animation configuration

| prop                 | type                                | default                                       | description                                                                                  |
| -------------------- | ----------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `state`              | `'disabled' \| boolean`             | -                                             | Disable animations while customizing properties                                              |
| `entering`           | `NumberStepperDirectionalAnimation`  | Direction-aware Keyframe slide + scale, 400ms | Entering animation played when the new value mounts                                          |
| `exiting`            | `NumberStepperDirectionalAnimation`  | Direction-aware Keyframe slide + scale, 400ms | Exiting animation played when the old value unmounts                                         |
| `translateYDistance` | `number`                            | `16`                                          | Vertical slide distance in pixels. Ignored when custom `entering`/`exiting` are provided     |
| `scaleValue`         | `number`                            | `0.7`                                         | Scale at the start/end of transitions. Ignored when custom `entering`/`exiting` are provided |

#### NumberStepperDirectionalAnimation

A single animation or a per-direction pair. Pass a plain value to use the same animation for both directions, or an object with `increase`/`decrease` keys for direction-aware control.

| type                                                                     | description                               |
| ------------------------------------------------------------------------ | ----------------------------------------- |
| `EntryOrExitLayoutType`                                                  | Single animation used for both directions |
| `{ increase?: EntryOrExitLayoutType; decrease?: EntryOrExitLayoutType }` | Per-direction animations                  |

### NumberStepper.IncrementButton

| prop                    | type                           | default | description                                                                               |
| ----------------------- | ------------------------------ | ------- | ----------------------------------------------------------------------------------------- |
| `children`              | `React.ReactNode`              | -       | Custom content for the button. Defaults to a plus icon                                    |
| `isDisabled`            | `boolean`                      | -       | Whether this button is individually disabled. Overrides context and boundary auto-disable |
| `keepActiveAtBoundary`  | `boolean`                      | `false` | When true, the button stays interactive at the max boundary instead of auto-disabling     |
| `className`             | `string`                       | -       | Additional CSS classes                                                                    |
| `iconProps`             | `NumberStepperButtonIconProps`  | -       | Props forwarded to the default plus icon. Ignored when `children` is provided             |
| `animation`             | `NumberStepperButtonAnimation`  | -       | Animation configuration for the button press scale effect                                 |
| `isAnimatedStyleActive` | `boolean`                      | `true`  | Whether animated styles (react-native-reanimated) are active                              |
| `...PressableProps`     | `PressableProps`               | -       | All standard React Native Pressable props are supported                                   |

#### NumberStepperButtonIconProps

| prop    | type     | default      | description                |
| ------- | -------- | ------------ | -------------------------- |
| `size`  | `number` | `18`         | Size of the icon in pixels |
| `color` | `string` | `foreground` | Color of the icon          |

#### NumberStepperButtonAnimation

Animation configuration for button press scale effect. Can be:

- `false` or `"disabled"`: Disable all animations
- `true` or `undefined`: Use default animations
- `object`: Custom animation configuration

| prop           | type                    | default             | description                                     |
| -------------- | ----------------------- | ------------------- | ----------------------------------------------- |
| `state`        | `'disabled' \| boolean` | -                   | Disable animations while customizing properties |
| `value`        | `number`                | `0.95`              | Scale value applied when the button is pressed  |
| `timingConfig` | `WithTimingConfig`      | `{ duration: 150 }` | Timing configuration for the scale transition   |

## Hooks

### useNumberStepper

Hook to access the number stepper root context. Must be used within a `NumberStepper` component.

```tsx
import { useNumberStepper } from 'heroui-native-pro';

const {
  value,
  isAtMin,
  isAtMax,
  isDisabled,
  step,
  minValue,
  maxValue,
  direction,
  decrement,
  increment,
} = useNumberStepper();
```

#### Returns

| property     | type                     | description                                                              |
| ------------ | ------------------------ | ------------------------------------------------------------------------ |
| `value`      | `number`                 | Current numeric value of the number stepper                               |
| `step`       | `number`                 | Step increment/decrement amount                                          |
| `minValue`   | `number`                 | Minimum allowed value                                                    |
| `maxValue`   | `number`                 | Maximum allowed value                                                    |
| `isDisabled` | `boolean`                | Whether the entire number stepper is disabled                             |
| `isAtMin`    | `boolean`                | Whether the current value is at or below the minimum                     |
| `isAtMax`    | `boolean`                | Whether the current value is at or above the maximum                     |
| `direction`  | `NumberStepperDirection`  | Direction of the most recent value change (`'increase'` or `'decrease'`) |
| `decrement`  | `() => void`             | Decrement the value by one step                                          |
| `increment`  | `() => void`             | Increment the value by one step                                          |
