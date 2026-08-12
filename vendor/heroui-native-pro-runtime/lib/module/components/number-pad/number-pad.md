# NumberPad

A numeric keypad for entering PINs, codes, and amounts with subtle press animations.

## Import

```tsx
import { NumberPad } from 'heroui-native-pro';
```

## Anatomy

```tsx
<NumberPad>
  <NumberPad.Row>
    <NumberPad.Key value="1" />
    <NumberPad.Key value="2" />
    <NumberPad.Key value="3" />
  </NumberPad.Row>
  <NumberPad.Row>
    <NumberPad.Spacer />
    <NumberPad.Key value="0" />
    <NumberPad.Backspace />
  </NumberPad.Row>
</NumberPad>
```

- **NumberPad**: Root column container that manages the value state and provides context to sub-components. Auto-renders the default 3×4 digit layout when no children are provided. Supports both controlled and uncontrolled modes.
- **NumberPad.Row**: Horizontal container that lays out a row of cells with equal widths. Required when composing keys manually.
- **NumberPad.Key**: Pressable digit key with a subtle press animation. Appends its `value` to the pad value by default. Renders a default `NumberPad.KeyLabel` showing its value when no children are provided.
- **NumberPad.KeyLabel**: Text label rendered inside a key. Defaults to the parent key's value.
- **NumberPad.Backspace**: Delete key. Press removes one character; long-press clears the entire value. Renders a backspace icon by default.
- **NumberPad.Spacer**: Grid cell that preserves alignment. Renders an inert empty cell by default; behaves like a `NumberPad.Key` when given children.

## Usage

### Basic Usage

Render the default 3×4 keypad by omitting children.

```tsx
const [value, setValue] = useState('');

<NumberPad value={value} onValueChange={setValue} />;
```

### Manual Composition

Compose the keypad explicitly with rows and keys.

```tsx
<NumberPad value={value} onValueChange={setValue}>
  <NumberPad.Row>
    <NumberPad.Key value="1" />
    <NumberPad.Key value="2" />
    <NumberPad.Key value="3" />
  </NumberPad.Row>
  ...
  <NumberPad.Row>
    <NumberPad.Spacer />
    <NumberPad.Key value="0" />
    <NumberPad.Backspace />
  </NumberPad.Row>
</NumberPad>
```

### Max Length

Cap the input length and react when it fills up.

```tsx
<NumberPad
  value={value}
  onValueChange={setValue}
  maxLength={4}
  onComplete={(code) => verify(code)}
/>
```

### Custom Key Content

Use a render function to access key state and style the label.

```tsx
<NumberPad value={value} onValueChange={setValue}>
  <NumberPad.Row>
    <NumberPad.Key value="1">
      {({ isPressed }) => (
        <NumberPad.KeyLabel
          className={isPressed ? 'text-accent-foreground' : 'text-foreground'}
        >
          1
        </NumberPad.KeyLabel>
      )}
    </NumberPad.Key>
    ...
  </NumberPad.Row>
  ...
</NumberPad>
```

### Spacer Action

Give the spacer cell children to turn it into an action key.

```tsx
<NumberPad value={value} onValueChange={setValue} onSpacerPress={authenticate}>
  ...
  <NumberPad.Row>
    <NumberPad.Spacer>
      <FingerprintIcon />
    </NumberPad.Spacer>
    <NumberPad.Key value="0" />
    <NumberPad.Backspace />
  </NumberPad.Row>
</NumberPad>
```

### Disabled

Disable the entire keypad.

```tsx
<NumberPad defaultValue="1234" isDisabled />
```

## Example

```tsx
import { NumberPad } from 'heroui-native-pro';
import { useState } from 'react';
import { Text, View } from 'react-native';

export default function NumberPadExample() {
  const [value, setValue] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  return (
    <View className="flex-1 px-5 items-center justify-center">
      <View className="w-full gap-6">
        <Text className="text-center text-2xl font-semibold tracking-[0.4em] text-foreground">
          {value.padEnd(4, '•')}
        </Text>
        <NumberPad
          value={value}
          maxLength={4}
          onValueChange={(next) => {
            setValue(next);
            setIsComplete(false);
          }}
          onComplete={() => setIsComplete(true)}
        />
      </View>
    </View>
  );
}
```

## API Reference

### NumberPad

| prop               | type                                       | default | description                                                                    |
| ------------------ | ------------------------------------------ | ------- | ------------------------------------------------------------------------------ |
| `children`         | `React.ReactNode`                          | -       | Pad content. When omitted, the default digit grid is rendered automatically    |
| `value`            | `string`                                   | -       | Controlled value string                                                        |
| `defaultValue`     | `string`                                   | `""`    | Default value for uncontrolled mode                                            |
| `maxLength`        | `number`                                   | -       | Maximum number of characters. Extra key presses are ignored once reached       |
| `isDisabled`       | `boolean`                                  | `false` | Whether the entire pad is disabled                                             |
| `className`        | `string`                                   | -       | Additional CSS classes for the root grid container                             |
| `onValueChange`    | `(value: string) => void`                  | -       | Callback fired when the value changes                                          |
| `onKeyPress`       | `(key: string, nextValue: string) => void` | -       | Callback fired when a digit key is pressed                                     |
| `onBackspacePress` | `(value: string) => void`                  | -       | Callback fired when backspace is pressed, with the value after deletion        |
| `onSpacerPress`    | `() => void`                               | -       | Default press handler for a spacer rendered as a key without its own `onPress` |
| `onClear`          | `() => void`                               | -       | Callback fired when the value is cleared via backspace long-press              |
| `onComplete`       | `(value: string) => void`                  | -       | Callback fired when the value reaches `maxLength`                              |
| `animation`        | `NumberPadRootAnimation`                   | -       | Animation configuration for the root component                                 |
| `...ViewProps`     | `ViewProps`                                | -       | All standard React Native View props are supported                             |

#### NumberPadRootAnimation

Animation configuration for the number pad root component. Can be:

- `"disable-all"`: Disable all animations including children
- `undefined`: Use default animations

### NumberPad.Row

| prop           | type              | default | description                                         |
| -------------- | ----------------- | ------- | --------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Row content, typically `Key`, `Backspace`, `Spacer` |
| `className`    | `string`          | -       | Additional CSS classes for the row container        |
| `...ViewProps` | `ViewProps`       | -       | All standard React Native View props are supported  |

### NumberPad.Key

| prop                    | type                                                                       | default | description                                                  |
| ----------------------- | -------------------------------------------------------------------------- | ------- | ------------------------------------------------------------ |
| `value`                 | `string`                                                                   | -       | Digit or character value appended to the pad value           |
| `children`              | `React.ReactNode \| ((props: NumberPadKeyRenderProps) => React.ReactNode)` | -       | Custom content or render function. Defaults to a `KeyLabel`  |
| `isDisabled`            | `boolean`                                                                  | `false` | Whether this key is disabled independently of the root pad   |
| `className`             | `string`                                                                   | -       | Additional CSS classes for the key container                 |
| `animation`             | `NumberPadKeyAnimation`                                                    | -       | Animation configuration for the key press feedback           |
| `isAnimatedStyleActive` | `boolean`                                                                  | `true`  | Whether animated styles (react-native-reanimated) are active |
| `...PressableProps`     | `PressableProps`                                                           | -       | All standard React Native Pressable props are supported      |

#### NumberPadKeyRenderProps

| prop         | type      | description                          |
| ------------ | --------- | ------------------------------------ |
| `value`      | `string`  | The key's value                      |
| `isPressed`  | `boolean` | Whether the key is currently pressed |
| `isDisabled` | `boolean` | Whether the key is disabled          |

#### NumberPadKeyAnimation

Animation configuration for the key press scale effect. Can be:

- `false` or `"disabled"`: Disable all animations
- `true` or `undefined`: Use default animations
- `object`: Custom animation configuration

| prop    | type                                                  | default | description                                     |
| ------- | ----------------------------------------------------- | ------- | ----------------------------------------------- |
| `state` | `'disabled' \| boolean`                               | -       | Disable animations while customizing properties |
| `scale` | `{ value?: number; timingConfig?: WithTimingConfig }` | -       | Scale press feedback configuration              |

| `scale` prop   | type               | default             | description                                   |
| -------------- | ------------------ | ------------------- | --------------------------------------------- |
| `value`        | `number`           | `0.97`              | Scale value applied when the key is pressed   |
| `timingConfig` | `WithTimingConfig` | `{ duration: 150 }` | Timing configuration for the scale transition |

### NumberPad.KeyLabel

| prop           | type              | default | description                                              |
| -------------- | ----------------- | ------- | -------------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Custom label content. Defaults to the parent key's value |
| `className`    | `string`          | -       | Additional CSS classes for the label text                |
| `...TextProps` | `TextProps`       | -       | All standard React Native Text props are supported       |

### NumberPad.Backspace

| prop                    | type                          | default | description                                                                        |
| ----------------------- | ----------------------------- | ------- | ---------------------------------------------------------------------------------- |
| `children`              | `React.ReactNode`             | -       | Custom content for the backspace key. Defaults to an icon                          |
| `isDisabled`            | `boolean`                     | `false` | Whether this key is disabled independently of the root pad                         |
| `className`             | `string`                      | -       | Additional CSS classes for the key container                                       |
| `iconProps`             | `NumberPadBackspaceIconProps` | -       | Props forwarded to the default backspace icon. Ignored when `children` is provided |
| `animation`             | `NumberPadKeyAnimation`       | -       | Animation configuration for the key press feedback                                 |
| `isAnimatedStyleActive` | `boolean`                     | `true`  | Whether animated styles (react-native-reanimated) are active                       |
| `...PressableProps`     | `PressableProps`              | -       | All standard React Native Pressable props are supported                            |

#### NumberPadBackspaceIconProps

| prop    | type     | default      | description                |
| ------- | -------- | ------------ | -------------------------- |
| `size`  | `number` | `24`         | Size of the icon in pixels |
| `color` | `string` | `foreground` | Color of the icon          |

### NumberPad.Spacer

| prop                    | type                    | default | description                                                    |
| ----------------------- | ----------------------- | ------- | -------------------------------------------------------------- |
| `children`              | `React.ReactNode`       | -       | Optional content. When provided, the spacer behaves like a key |
| `isDisabled`            | `boolean`               | `false` | Whether this cell is disabled independently of the root pad    |
| `className`             | `string`                | -       | Additional CSS classes for the cell container                  |
| `animation`             | `NumberPadKeyAnimation` | -       | Animation configuration for the press feedback (with children) |
| `isAnimatedStyleActive` | `boolean`               | `true`  | Whether animated styles (react-native-reanimated) are active   |
| `...PressableProps`     | `PressableProps`        | -       | All standard React Native Pressable props are supported        |
