# EmptyState

A placeholder for empty views with icon, title, description, and call-to-action to guide users.

## Import

```tsx
import { EmptyState } from 'heroui-native-pro';
```

## Anatomy

```tsx
<EmptyState>
  <EmptyState.Header>
    <EmptyState.Media>...</EmptyState.Media>
    <EmptyState.Title>...</EmptyState.Title>
    <EmptyState.Description>...</EmptyState.Description>
  </EmptyState.Header>
  <EmptyState.Content>...</EmptyState.Content>
</EmptyState>
```

- **EmptyState**: Root container. Centers compound parts vertically with consistent spacing and padding, and cascades `disable-all` to animated descendants. Sub-components are fully optional.
- **EmptyState.Header**: Groups `Media`, `Title`, and `Description` in a centered column.
- **EmptyState.Media**: Optional container for an icon, avatar, or custom media block. Supports `variant="default"` (render as-is) and `variant="icon"` (circular muted surface).
- **EmptyState.Title**: Primary heading text rendered with `accessibilityRole="header"`.
- **EmptyState.Description**: Secondary muted text below the title.
- **EmptyState.Content**: Optional action area below the header for buttons, inputs, or other controls.

## Usage

### Basic usage

Compose a header with title and description for a minimal empty state.

```tsx
<EmptyState>
  <EmptyState.Header>
    <EmptyState.Title>Inbox zero</EmptyState.Title>
    <EmptyState.Description>...</EmptyState.Description>
  </EmptyState.Header>
</EmptyState>
```

### With icon media

Use `variant="icon"` to wrap the media in a circular muted surface.

```tsx
<EmptyState>
  <EmptyState.Header>
    <EmptyState.Media variant="icon">
      <BellIcon size={20} />
    </EmptyState.Media>
    <EmptyState.Title>No notifications yet</EmptyState.Title>
    <EmptyState.Description>...</EmptyState.Description>
  </EmptyState.Header>
</EmptyState>
```

### With actions

Add an action area below the header with `EmptyState.Content`.

```tsx
<EmptyState>
  <EmptyState.Header>
    <EmptyState.Title>No matches found</EmptyState.Title>
    <EmptyState.Description>...</EmptyState.Description>
  </EmptyState.Header>
  <EmptyState.Content>
    <Button variant="outline">Clear search</Button>
  </EmptyState.Content>
</EmptyState>
```

### With custom media

Use `variant="default"` (the default) to render media content as-is, such as an avatar or stacked avatars.

```tsx
<EmptyState>
  <EmptyState.Header>
    <EmptyState.Media>
      <Avatar>...</Avatar>
    </EmptyState.Media>
    <EmptyState.Title>User is offline</EmptyState.Title>
    <EmptyState.Description>...</EmptyState.Description>
  </EmptyState.Header>
  <EmptyState.Content>
    <Button variant="secondary">Leave message</Button>
  </EmptyState.Content>
</EmptyState>
```

### Bordered container

Apply a dashed border on the root to render an outlined empty state.

```tsx
<EmptyState className="rounded-2xl border border-dashed border-border">
  <EmptyState.Header>
    <EmptyState.Media variant="icon">
      <RocketIcon size={20} />
    </EmptyState.Media>
    <EmptyState.Title>Start your first automation</EmptyState.Title>
    <EmptyState.Description>...</EmptyState.Description>
  </EmptyState.Header>
  <EmptyState.Content>
    <Button size="sm" variant="outline">
      Get started
    </Button>
  </EmptyState.Content>
</EmptyState>
```

## Example

```tsx
import { Button } from 'heroui-native';
import { EmptyState } from 'heroui-native-pro';
import { View } from 'react-native';
import { BellIcon } from './icons/bell';

export default function EmptyStateExample() {
  return (
    <View className="flex-1 items-center justify-center px-5">
      <EmptyState>
        <EmptyState.Header>
          <EmptyState.Media variant="icon">
            <BellIcon size={20} colorClassName="accent-default-foreground" />
          </EmptyState.Media>
          <EmptyState.Title>No notifications yet</EmptyState.Title>
          <EmptyState.Description>
            Stay in the loop by enabling push alerts for account activity and
            reminders.
          </EmptyState.Description>
        </EmptyState.Header>
        <EmptyState.Content className="w-full gap-2.5">
          <Button className="w-full max-w-xs">Enable notifications</Button>
          <Button className="w-full max-w-xs" variant="outline">
            Settings
          </Button>
        </EmptyState.Content>
      </EmptyState>
    </View>
  );
}
```

## API Reference

### EmptyState

| prop           | type                     | default | description                                                                    |
| -------------- | ------------------------ | ------- | ------------------------------------------------------------------------------ |
| `children`     | `React.ReactNode`        | -       | Compound parts rendered inside the empty state container                       |
| `className`    | `string`                 | -       | Additional CSS classes for the root container                                  |
| `animation`    | `EmptyStateRootAnimation` | -      | Animation configuration for the empty state root (cascades to animated descendants) |
| `...ViewProps` | `ViewProps`              | -       | All standard React Native View props are supported                             |

#### EmptyStateRootAnimation

Animation configuration for the EmptyState root. Can be:

- `"disable-all"`: Disable all animations including children (cascades down through `AnimationSettingsProvider`)
- `undefined`: Use default animations

### EmptyState.Header

| prop           | type              | default | description                                        |
| -------------- | ----------------- | ------- | -------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Header content (media, title, description)        |
| `className`    | `string`          | -       | Additional CSS classes for the header wrapper      |
| `...ViewProps` | `ViewProps`       | -       | All standard React Native View props are supported |

### EmptyState.Media

| prop           | type                     | default     | description                                                |
| -------------- | ------------------------ | ----------- | ---------------------------------------------------------- |
| `children`     | `React.ReactNode`        | -           | Media content to render (icon, avatar, etc.)               |
| `variant`      | `EmptyStateMediaVariant` | `'default'` | Media visual treatment                                     |
| `className`    | `string`                 | -           | Additional CSS classes for the media container             |
| `...ViewProps` | `ViewProps`              | -           | All standard React Native View props are supported         |

#### EmptyStateMediaVariant

| type                   | description                                                              |
| ---------------------- | ------------------------------------------------------------------------ |
| `'default' \| 'icon'` | `default` renders media as-is. `icon` wraps it in a circular muted surface |

### EmptyState.Title

| prop           | type              | default | description                                        |
| -------------- | ----------------- | ------- | -------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Title text content                                 |
| `className`    | `string`          | -       | Additional CSS classes for the title text          |
| `...TextProps` | `TextProps`       | -       | All standard React Native Text props are supported |

### EmptyState.Description

| prop           | type              | default | description                                        |
| -------------- | ----------------- | ------- | -------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Description text content                           |
| `className`    | `string`          | -       | Additional CSS classes for the description text    |
| `...TextProps` | `TextProps`       | -       | All standard React Native Text props are supported |

### EmptyState.Content

| prop           | type              | default | description                                          |
| -------------- | ----------------- | ------- | ---------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Action content rendered below the header             |
| `className`    | `string`          | -       | Additional CSS classes for the action container      |
| `...ViewProps` | `ViewProps`       | -       | All standard React Native View props are supported   |
