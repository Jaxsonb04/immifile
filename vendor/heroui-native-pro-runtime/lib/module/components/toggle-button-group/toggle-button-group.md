# ToggleButtonGroup

Groups multiple `ToggleButton`s into a unified control with single or multiple selection.

## Import

```tsx
import { ToggleButtonGroup } from 'heroui-native-pro';
```

## Usage

### Basic usage

Wrap `ToggleButton`s and assign each a unique `id`. The group manages selection, size, and disabled state via context.

```tsx
<ToggleButtonGroup>
  <ToggleButton id="bold">...</ToggleButton>
  <ToggleButton id="italic">...</ToggleButton>
  <ToggleButton id="underline">...</ToggleButton>
</ToggleButtonGroup>
```

### Selection mode

Use `selectionMode="single"` to pick one option at a time, or `selectionMode="multiple"` to allow several. Pre-select with `defaultSelectedKeys`.

```tsx
<ToggleButtonGroup selectionMode="single" defaultSelectedKeys={['center']}>
  <ToggleButton id="left">...</ToggleButton>
  <ToggleButton id="center">...</ToggleButton>
  <ToggleButton id="right">...</ToggleButton>
</ToggleButtonGroup>

<ToggleButtonGroup selectionMode="multiple" defaultSelectedKeys={['bold', 'underline']}>
  <ToggleButton id="bold">...</ToggleButton>
  <ToggleButton id="italic">...</ToggleButton>
  <ToggleButton id="underline">...</ToggleButton>
</ToggleButtonGroup>
```

### Controlled

Use `selectedKeys` and `onSelectionChange` for controlled state. Selection is exposed as a `Set<string>`.

```tsx
const [selectedKeys, setSelectedKeys] = useState(new Set(['bold']));

<ToggleButtonGroup
  selectionMode="multiple"
  selectedKeys={selectedKeys}
  onSelectionChange={setSelectedKeys}
>
  <ToggleButton id="bold">...</ToggleButton>
  <ToggleButton id="italic">...</ToggleButton>
  <ToggleButton id="underline">...</ToggleButton>
</ToggleButtonGroup>;
```

### Sizes

Use the `size` prop to propagate a size to every child `ToggleButton`.

```tsx
<ToggleButtonGroup size="sm">...</ToggleButtonGroup>
<ToggleButtonGroup size="md">...</ToggleButtonGroup>
<ToggleButtonGroup size="lg">...</ToggleButtonGroup>
```

### Orientation

Switch between `horizontal` and `vertical` layouts with the `orientation` prop.

```tsx
<ToggleButtonGroup orientation="horizontal">...</ToggleButtonGroup>
<ToggleButtonGroup orientation="vertical">...</ToggleButtonGroup>
```

### Detached

Set `isDetached` to render each toggle as a separate rounded button with gaps instead of a single attached segment.

```tsx
<ToggleButtonGroup isDetached>
  <ToggleButton id="bold">...</ToggleButton>
  <ToggleButton id="italic">...</ToggleButton>
  <ToggleButton id="underline">...</ToggleButton>
</ToggleButtonGroup>
```

### Full width

Set `fullWidth` to make the group fill the available width and stretch each toggle equally.

```tsx
<ToggleButtonGroup fullWidth>...</ToggleButtonGroup>
```

### Disallow empty selection

Set `disallowEmptySelection` to prevent users from clearing the last selected toggle.

```tsx
<ToggleButtonGroup
  selectionMode="single"
  defaultSelectedKeys={['center']}
  disallowEmptySelection
>
  <ToggleButton id="left">...</ToggleButton>
  <ToggleButton id="center">...</ToggleButton>
  <ToggleButton id="right">...</ToggleButton>
</ToggleButtonGroup>
```

### Disabled

Set `isDisabled` on the group to dim and block presses on all child toggles.

```tsx
<ToggleButtonGroup isDisabled>...</ToggleButtonGroup>
```

## Example

```tsx
import { ToggleButton, ToggleButtonGroup } from 'heroui-native-pro';
import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const BoldIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6zM6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ItalicIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 4h-9M14 20H5M15 4L9 20"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const UnderlineIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3M4 21h16"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default function TextFormattingToolbar() {
  const [selectedKeys, setSelectedKeys] = useState(new Set(['bold']));

  return (
    <View className="flex-1 items-center justify-center px-5">
      <ToggleButtonGroup
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <ToggleButton id="bold" accessibilityLabel="Bold">
          <BoldIcon />
        </ToggleButton>
        <ToggleButton id="italic" accessibilityLabel="Italic">
          <ItalicIcon />
        </ToggleButton>
        <ToggleButton id="underline" accessibilityLabel="Underline">
          <UnderlineIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </View>
  );
}
```

## API Reference

### ToggleButtonGroup

| prop                     | type                             | default        | description                                                                            |
| ------------------------ | -------------------------------- | -------------- | -------------------------------------------------------------------------------------- |
| `children`               | `React.ReactNode`                | -              | Child `ToggleButton`s. Each must declare a unique `id`                                 |
| `selectionMode`          | `ToggleButtonGroupSelectionMode` | `'single'`     | Whether one or multiple buttons can be selected                                        |
| `orientation`            | `ToggleButtonGroupOrientation`   | `'horizontal'` | Layout direction of the group                                                          |
| `size`                   | `ButtonSize`                     | `'md'`         | Size propagated to every child `ToggleButton`                                          |
| `isDetached`             | `boolean`                        | `false`        | Whether buttons render as separate rounded items with gaps instead of a single segment |
| `fullWidth`              | `boolean`                        | `false`        | Whether the group fills available width and stretches each child to flex equally       |
| `selectedKeys`           | `Iterable<string>`               | -              | Controlled selection state. Resolved internally to a `Set<string>`                     |
| `defaultSelectedKeys`    | `Iterable<string>`               | -              | Default selected keys (uncontrolled)                                                   |
| `disallowEmptySelection` | `boolean`                        | `false`        | Prevents clearing all selections                                                       |
| `isDisabled`             | `boolean`                        | `false`        | Whether the group is disabled. Cascades to every child `ToggleButton`                  |
| `className`              | `string`                         | -              | Additional CSS classes for the group container                                         |
| `onSelectionChange`      | `(keys: Set<string>) => void`    | -              | Handler called when selection changes                                                  |
| `...ViewProps`           | `ViewProps`                      | -              | All standard React Native View props are supported                                     |

#### ToggleButtonGroupSelectionMode

| value        | description                                          |
| ------------ | ---------------------------------------------------- |
| `'single'`   | Only one toggle can be selected at a time            |
| `'multiple'` | Any number of toggles can be selected simultaneously |

#### ToggleButtonGroupOrientation

| value          | description               |
| -------------- | ------------------------- |
| `'horizontal'` | Toggles flow in a row     |
| `'vertical'`   | Toggles stack in a column |

## Hooks

### useToggleGroup

Hook to access the ToggleButtonGroup context. Must be used within a `ToggleButtonGroup` component.

```tsx
import { useToggleGroup } from 'heroui-native-pro';

const {
  selectedKeys,
  onToggle,
  size,
  orientation,
  isDetached,
  fullWidth,
  isDisabled,
} = useToggleGroup();
```

#### Returns: ToggleButtonGroupContextValue

| property       | type                           | description                                                            |
| -------------- | ------------------------------ | ---------------------------------------------------------------------- |
| `selectedKeys` | `Set<string>`                  | Set of currently selected keys                                         |
| `onToggle`     | `(key: string) => void`        | Callback invoked when a child toggle is pressed                        |
| `size`         | `ButtonSize`                   | Size cascaded to children                                              |
| `orientation`  | `ToggleButtonGroupOrientation` | Layout orientation of the group                                        |
| `isDetached`   | `boolean`                      | Whether buttons are visually separated with gaps                       |
| `fullWidth`    | `boolean`                      | Whether the group fills available width (children stretch to `flex-1`) |
| `isDisabled`   | `boolean`                      | Whether the group is disabled                                          |
