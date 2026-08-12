# ToggleButton

Groups multiple ToggleButtons into a unified control, allowing users to select one or multiple options.

## Import

```tsx
import { ToggleButton } from 'heroui-native-pro';
```

## Anatomy

```tsx
<ToggleButton>
  <ToggleButton.Label>...</ToggleButton.Label>
</ToggleButton>
```

- **ToggleButton**: Root pressable wrapping HeroUI Native `Button`. Owns the controllable selection state, applies selected/unselected background styling, and integrates with `ToggleButtonGroup` via context (selection, size, disabled state). Exposes its state to descendants through `useToggleButton`.
- **ToggleButton.Label**: Text label inside the toggle. Wraps `Button.Label` and automatically applies selected/unselected text colors based on the parent toggle state.

## Usage

### Basic usage

Pass a string as children to render a label.

```tsx
<ToggleButton>Like</ToggleButton>
```

### Compound label

Use `ToggleButton.Label` for explicit control over the label element.

```tsx
<ToggleButton>
  <ToggleButton.Label>Like</ToggleButton.Label>
</ToggleButton>
```

### With icon

Compose icons alongside the label inside the toggle.

```tsx
<ToggleButton>
  <HeartIcon />
  <ToggleButton.Label>Like</ToggleButton.Label>
</ToggleButton>
```

### Variants

Switch the resting background style with the `variant` prop. Both variants share the same selected appearance.

```tsx
<ToggleButton variant="default">...</ToggleButton>
<ToggleButton variant="ghost">...</ToggleButton>
```

### Sizes

Control the button dimensions with the `size` prop.

```tsx
<ToggleButton size="sm">...</ToggleButton>
<ToggleButton size="md">...</ToggleButton>
<ToggleButton size="lg">...</ToggleButton>
```

### Icon only

Set `isIconOnly` to render a square button with no horizontal padding.

```tsx
<ToggleButton isIconOnly accessibilityLabel="Like">
  <HeartIcon />
</ToggleButton>
```

### Controlled

Use `isSelected` and `onChange` for controlled state, or `defaultSelected` for uncontrolled.

```tsx
<ToggleButton isSelected={isSelected} onChange={setIsSelected}>
  ...
</ToggleButton>
```

### Custom colors

Override the resting and selected background colors with `unselectedColor` and `selectedColor`. Pass resolved color strings (e.g. from `useThemeColor`).

```tsx
<ToggleButton selectedColor={dangerSoftColor}>...</ToggleButton>
```

### Disabled

Set `isDisabled` to dim the button and block presses.

```tsx
<ToggleButton isDisabled>...</ToggleButton>
<ToggleButton isDisabled defaultSelected>...</ToggleButton>
```

### Inside a group

Place toggles inside a `ToggleButtonGroup` and assign each an `id`. The group manages selection, size, and disabled state.

```tsx
<ToggleButtonGroup selectionMode="multiple">
  <ToggleButton id="bold" isIconOnly>...</ToggleButton>
  <ToggleButton id="italic" isIconOnly>...</ToggleButton>
  <ToggleButton id="underline" isIconOnly>...</ToggleButton>
</ToggleButtonGroup>
```

### Reading state from descendants

Call `useToggleButton` from a descendant to react to the toggle state without prop drilling.

```tsx
const HeartToggle = () => {
  const { isSelected } = useToggleButton();
  return <HeartIcon filled={isSelected} />;
};

<ToggleButton>
  <HeartToggle />
  <ToggleButton.Label>Like</ToggleButton.Label>
</ToggleButton>;
```

## Example

```tsx
import { useThemeColor } from 'heroui-native';
import { ToggleButton, useToggleButton } from 'heroui-native-pro';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const HeartIcon = ({ color, filled }: { color: string; filled: boolean }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={filled ? color : 'none'}
    />
  </Svg>
);

const HeartToggleContent = () => {
  const { isSelected } = useToggleButton();
  const fg = useThemeColor('foreground') as string;
  const accentFg = useThemeColor('accent-soft-foreground') as string;
  const color = isSelected ? accentFg : fg;
  return (
    <>
      <HeartIcon filled={isSelected} color={color} />
      <ToggleButton.Label>{isSelected ? 'Liked' : 'Like'}</ToggleButton.Label>
    </>
  );
};

export default function ToggleButtonExample() {
  return (
    <View className="flex-row items-center gap-3">
      <ToggleButton>
        <HeartToggleContent />
      </ToggleButton>
      <ToggleButton variant="ghost">
        <HeartToggleContent />
      </ToggleButton>
    </View>
  );
}
```

## API Reference

### ToggleButton

`ToggleButton` extends every prop of HeroUI Native [`Button`](https://heroui.com/docs/native/components/button#api-reference) except `variant` (redefined as `ToggleButtonVariant`) and `feedbackVariant` (owned by `ToggleButton`).

| prop                | type                                     | default     | description                                                                          |
| ------------------- | ---------------------------------------- | ----------- | ------------------------------------------------------------------------------------ |
| `children`          | `React.ReactNode`                        | -           | Content of the toggle button. Plain strings are rendered as a label                  |
| `variant`           | `ToggleButtonVariant`                    | `'default'` | Visual style variant                                                                 |
| `size`              | `ButtonSize`                             | `'md'`      | Size of the button. Inherited from the underlying `Button`                           |
| `isIconOnly`        | `boolean`                                | `false`     | Whether the button displays an icon only (square aspect ratio)                       |
| `id`                | `string`                                 | -           | Unique identifier. Required when used inside `ToggleButtonGroup`                     |
| `isSelected`        | `boolean`                                | -           | Controlled selected state                                                            |
| `defaultSelected`   | `boolean`                                | `false`     | Default selected state (uncontrolled)                                                |
| `isDisabled`        | `boolean`                                | `false`     | Whether the button is disabled                                                       |
| `className`         | `string`                                 | -           | Additional CSS classes for the button container                                      |
| `selectedColor`     | `string`                                 | -           | Override background color for the selected state. Defaults to theme `accent-soft`    |
| `unselectedColor`   | `string`                                 | -           | Override background color for the unselected state. Defaults to theme `default`      |
| `onChange`          | `(isSelected: boolean) => void`          | -           | Handler called when the selection changes                                            |
| `onPress`           | `(event: GestureResponderEvent) => void` | -           | Press handler invoked after the toggle is applied                                    |
| `animation`         | `ButtonAnimation`                        | -           | Animation configuration forwarded to the underlying `Button` (scale press feedback)  |
| `...PressableProps` | `PressableProps`                         | -           | All standard React Native Pressable props are supported                              |

#### ToggleButtonVariant

| type                   | description                              |
| ---------------------- | ---------------------------------------- |
| `'default' \| 'ghost'` | Visual style variants of the toggle. `default` uses an opaque resting background; `ghost` is transparent |

### ToggleButton.Label

| prop           | type              | default | description                                        |
| -------------- | ----------------- | ------- | -------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Label text content                                 |
| `className`    | `string`          | -       | Additional CSS classes for the label text          |
| `...TextProps` | `TextProps`       | -       | All standard React Native Text props are supported |

## Hooks

### useToggleButton

Hook to access the ToggleButton context. Must be used within a `ToggleButton` component.

```tsx
import { useToggleButton } from 'heroui-native-pro';

const { isSelected, isDisabled, size, variant } = useToggleButton();
```

#### Returns: ToggleButtonContextValue

| property     | type                  | description                       |
| ------------ | --------------------- | --------------------------------- |
| `isSelected` | `boolean`             | Whether the toggle is selected    |
| `isDisabled` | `boolean`             | Whether the toggle is disabled    |
| `size`       | `ButtonSize`          | Resolved size variant             |
| `variant`    | `ToggleButtonVariant` | Resolved visual variant           |
