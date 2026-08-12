# Segment

A segmented control for toggling between a small set of mutually exclusive options.

## Import

```tsx
import { Segment } from 'heroui-native-pro';
```

## Anatomy

```tsx
<Segment>
  <Segment.Group>
    <Segment.ScrollView>
      <Segment.Indicator />
      <Segment.Item value="...">
        <Segment.Label>...</Segment.Label>
      </Segment.Item>
      <Segment.Separator betweenValues={['...', '...']} />
    </Segment.ScrollView>
  </Segment.Group>
</Segment>
```

- **Segment**: Root container. Manages controlled / uncontrolled selection through `value`, `defaultValue`, and `onValueChange`, cascades `size` and `isDisabled` through context, and forwards animation settings to the underlying `Tabs`.
- **Segment.Group**: Row container for items, indicator, and separators. Wraps `Tabs.List` and applies size-aware padding and rounding.
- **Segment.ScrollView**: Optional horizontally scrollable wrapper for items, used when the row exceeds the available width. Wraps `Tabs.ScrollView`.
- **Segment.Indicator**: Animated pill that slides between selected items. Width, height, position, and opacity are driven by `react-native-reanimated`.
- **Segment.Item**: Selectable trigger for a single segment. Wraps `Tabs.Trigger`; merges its own `isDisabled` with the root `isDisabled` flag.
- **Segment.Label**: Text label rendered inside an item. Wraps `Tabs.Label`.
- **Segment.Separator**: Vertical divider between items. Visibility is driven by `betweenValues` relative to the current selection.

## Usage

### Basic usage

Wrap items inside `Segment.Group` with an `Indicator` and per-item `Label`s. Each item declares a unique `value`.

```tsx
<Segment defaultValue="dashboard">
  <Segment.Group>
    <Segment.Indicator />
    <Segment.Item value="dashboard">
      <Segment.Label>Dashboard</Segment.Label>
    </Segment.Item>
    <Segment.Item value="analytics">
      <Segment.Label>Analytics</Segment.Label>
    </Segment.Item>
  </Segment.Group>
</Segment>
```

### With separators

Insert `Segment.Separator`s between items and pass `betweenValues` so the divider hides automatically when one of its neighbors is selected.

```tsx
<Segment defaultValue="dashboard">
  <Segment.Group>
    <Segment.Indicator />
    <Segment.Item value="dashboard">
      <Segment.Label>Dashboard</Segment.Label>
    </Segment.Item>
    <Segment.Separator betweenValues={['dashboard', 'analytics']} />
    <Segment.Item value="analytics">
      <Segment.Label>Analytics</Segment.Label>
    </Segment.Item>
  </Segment.Group>
</Segment>
```

### Sizes

Use the `size` prop to scale padding, indicator radius, and label typography across every compound part.

```tsx
<Segment defaultValue="dashboard" size="sm">...</Segment>
<Segment defaultValue="dashboard" size="md">...</Segment>
<Segment defaultValue="dashboard" size="lg">...</Segment>
```

### Controlled

Drive selection externally with `value` and `onValueChange`.

```tsx
const [selected, setSelected] = useState('dashboard');

<Segment value={selected} onValueChange={setSelected}>
  <Segment.Group>
    <Segment.Indicator />
    <Segment.Item value="dashboard">
      <Segment.Label>Dashboard</Segment.Label>
    </Segment.Item>
    <Segment.Item value="analytics">
      <Segment.Label>Analytics</Segment.Label>
    </Segment.Item>
  </Segment.Group>
</Segment>;
```

### Scrollable

Wrap items in `Segment.ScrollView` to enable horizontal scrolling when the row overflows. The selected item is centered automatically.

```tsx
<Segment defaultValue="dashboard">
  <Segment.Group>
    <Segment.ScrollView>
      <Segment.Indicator />
      <Segment.Item value="dashboard">
        <Segment.Label>Dashboard</Segment.Label>
      </Segment.Item>
      <Segment.Item value="analytics">
        <Segment.Label>Analytics</Segment.Label>
      </Segment.Item>
      <Segment.Item value="reports">
        <Segment.Label>Reports</Segment.Label>
      </Segment.Item>
      <Segment.Item value="settings">
        <Segment.Label>Settings</Segment.Label>
      </Segment.Item>
    </Segment.ScrollView>
  </Segment.Group>
</Segment>
```

### With icons

Items accept arbitrary children, including icon-only or icon-with-label compositions.

```tsx
<Segment defaultValue="system" size="sm">
  <Segment.Group>
    <Segment.Indicator />
    <Segment.Item accessibilityLabel="Light" value="light">
      <SunIcon />
    </Segment.Item>
    <Segment.Separator betweenValues={['light', 'dark']} />
    <Segment.Item accessibilityLabel="Dark" value="dark">
      <MoonIcon />
    </Segment.Item>
    <Segment.Separator betweenValues={['dark', 'system']} />
    <Segment.Item accessibilityLabel="System" value="system">
      <SystemIcon />
    </Segment.Item>
  </Segment.Group>
</Segment>
```

### Disabled

Set `isDisabled` on the root to dim and block presses on every item.

```tsx
<Segment defaultValue="dashboard" isDisabled>
  <Segment.Group>
    <Segment.Indicator />
    <Segment.Item value="dashboard">
      <Segment.Label>Dashboard</Segment.Label>
    </Segment.Item>
    <Segment.Item value="analytics">
      <Segment.Label>Analytics</Segment.Label>
    </Segment.Item>
  </Segment.Group>
</Segment>
```

### Disabled item

Disable an individual item with its own `isDisabled` while keeping the rest interactive.

```tsx
<Segment defaultValue="dashboard">
  <Segment.Group>
    <Segment.Indicator />
    <Segment.Item value="dashboard">
      <Segment.Label>Dashboard</Segment.Label>
    </Segment.Item>
    <Segment.Item value="analytics" isDisabled>
      <Segment.Label>Analytics</Segment.Label>
    </Segment.Item>
  </Segment.Group>
</Segment>
```

## Example

```tsx
import Feather from '@expo/vector-icons/Feather';
import { Segment } from 'heroui-native-pro';
import { useState } from 'react';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';

const StyledFeather = withUniwind(Feather);

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState('system');

  return (
    <View className="flex-1 items-center justify-center px-5">
      <Segment value={theme} size="sm" onValueChange={setTheme}>
        <Segment.Group>
          <Segment.Indicator />
          <Segment.Item accessibilityLabel="Light" value="light">
            <StyledFeather name="sun" size={16} className="text-muted" />
          </Segment.Item>
          <Segment.Separator betweenValues={['light', 'dark']} />
          <Segment.Item accessibilityLabel="Dark" value="dark">
            <StyledFeather name="moon" size={16} className="text-muted" />
          </Segment.Item>
          <Segment.Separator betweenValues={['dark', 'system']} />
          <Segment.Item accessibilityLabel="System" value="system">
            <StyledFeather name="smartphone" size={16} className="text-muted" />
          </Segment.Item>
        </Segment.Group>
      </Segment>
    </View>
  );
}
```

## API Reference

### Segment

| prop            | type                      | default | description                                                                |
| --------------- | ------------------------- | ------- | -------------------------------------------------------------------------- |
| `value`         | `string`                  | -       | Controlled selected segment value                                          |
| `defaultValue`  | `string`                  | -       | Initial selected segment in uncontrolled mode                              |
| `size`          | `SegmentSize`             | `'md'`  | Visual size affecting padding, typography, and radii across every part     |
| `isDisabled`    | `boolean`                 | `false` | Disables interaction for every item (merged with each item's `isDisabled`) |
| `onValueChange` | `(value: string) => void` | -       | Handler called when the selected segment changes                           |

Inherits remaining props from [`Tabs`](https://heroui.com/docs/native/components/tabs#tabs) except for `value`, `onValueChange`, and `variant` (fixed to `"primary"`).

#### SegmentSize

| value  | description       |
| ------ | ----------------- |
| `'sm'` | Compact size tier |
| `'md'` | Default size tier |
| `'lg'` | Large size tier   |

### Segment.Group

Same API as [`Tabs.List`](https://heroui.com/docs/native/components/tabs#tabslist).

### Segment.ScrollView

Same API as [`Tabs.ScrollView`](https://heroui.com/docs/native/components/tabs#tabsscrollview).

### Segment.Indicator

Same API as [`Tabs.Indicator`](https://heroui.com/docs/native/components/tabs#tabsindicator), including [`TabsIndicatorAnimation`](https://heroui.com/docs/native/components/tabs#tabsindicatoranimation).

### Segment.Item

Same API as [`Tabs.Trigger`](https://heroui.com/docs/native/components/tabs#tabstrigger), including [`TabsTriggerRenderProps`](https://heroui.com/docs/native/components/tabs#tabstriggerrenderprops) for render children.

### Segment.Label

Same API as [`Tabs.Label`](https://heroui.com/docs/native/components/tabs#tabslabel).

### Segment.Separator

Same API as [`Tabs.Separator`](https://heroui.com/docs/native/components/tabs#tabsseparator), including [`TabsSeparatorAnimation`](https://heroui.com/docs/native/components/tabs#tabsseparatoranimation).

## Hooks

### useSegment

Hook to access the segment root context. Must be used within a `Segment` component.

```tsx
import { useSegment } from 'heroui-native-pro';

const { value, onValueChange, size, isDisabled } = useSegment();
```

#### Returns: SegmentContextValue

| property        | type                      | description                                                               |
| --------------- | ------------------------- | ------------------------------------------------------------------------- |
| `value`         | `string`                  | Currently selected segment value (resolves to `""` when no item selected) |
| `onValueChange` | `(value: string) => void` | Updates the selected segment                                              |
| `size`          | `SegmentSize`             | Current size tier propagated from the root                                |
| `isDisabled`    | `boolean`                 | Whether selection is prevented for every item from the root               |
