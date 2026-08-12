# Badge

Displays a small indicator positioned relative to another element, commonly used for notification counts, status dots, and labels

## Import

```tsx
import { Badge } from 'heroui-native-pro';
```

## Anatomy

```tsx
<Badge.Anchor>
  ...
  <Badge>
    <Badge.Label>...</Badge.Label>
  </Badge>
</Badge.Anchor>
```

- **Badge**: Root container. Renders as a dot when no children are passed, or as a pill with content otherwise. Supports `color`, `variant`, `size`, and `placement` props. When used inside `Badge.Anchor`, it is absolutely positioned at the specified corner.
- **Badge.Anchor**: Relative wrapper that positions the `Badge` over another element (e.g. `Avatar`, `Icon`).
- **Badge.Label**: Text content inside the badge. Automatically used when string or number children are passed to `Badge`.

## Usage

### Basic usage

Wrap the anchored element and the badge in `Badge.Anchor`. Pass a string or number as children to render a pill.

```tsx
<Badge.Anchor>
  <Avatar>...</Avatar>
  <Badge color="danger" size="sm">
    5
  </Badge>
</Badge.Anchor>
```

### Dot badge

Omit children to render a dot indicator.

```tsx
<Badge.Anchor>
  <Avatar>...</Avatar>
  <Badge color="success" />
</Badge.Anchor>
```

### Colors

Switch the badge color with the `color` prop.

```tsx
<Badge color="default">5</Badge>
<Badge color="accent">5</Badge>
<Badge color="success">5</Badge>
<Badge color="warning">5</Badge>
<Badge color="danger">5</Badge>
```

### Variants

Change the visual style with the `variant` prop.

```tsx
<Badge variant="primary" color="accent">5</Badge>
<Badge variant="secondary" color="accent">5</Badge>
<Badge variant="soft" color="accent">5</Badge>
```

### Sizes

Control the badge size with the `size` prop.

```tsx
<Badge size="sm">5</Badge>
<Badge size="md">5</Badge>
<Badge size="lg">5</Badge>
```

### Placements

Position the badge at any corner of its anchor with the `placement` prop. Only takes effect when used inside `Badge.Anchor`.

```tsx
<Badge.Anchor>
  <Avatar>...</Avatar>
  <Badge placement="top-right" />
</Badge.Anchor>

<Badge.Anchor>
  <Avatar>...</Avatar>
  <Badge placement="top-left" />
</Badge.Anchor>

<Badge.Anchor>
  <Avatar>...</Avatar>
  <Badge placement="bottom-right" />
</Badge.Anchor>

<Badge.Anchor>
  <Avatar>...</Avatar>
  <Badge placement="bottom-left" />
</Badge.Anchor>
```

### Custom label

Compose the badge content explicitly with `Badge.Label` for full control over the text element.

```tsx
<Badge color="danger" size="sm">
  <Badge.Label>99+</Badge.Label>
</Badge>
```

## Example

```tsx
import { Avatar } from 'heroui-native';
import { Badge } from 'heroui-native-pro';
import { View } from 'react-native';

export default function BadgeExample() {
  return (
    <View className="flex-row items-center gap-6">
      <Badge.Anchor>
        <Avatar alt="Avatar">
          <Avatar.Image source={{ uri: 'https://i.pravatar.cc/100?u=1' }} />
          <Avatar.Fallback>JD</Avatar.Fallback>
        </Avatar>
        <Badge color="danger" size="sm">
          5
        </Badge>
      </Badge.Anchor>

      <Badge.Anchor>
        <Avatar alt="Avatar">
          <Avatar.Image source={{ uri: 'https://i.pravatar.cc/100?u=2' }} />
          <Avatar.Fallback>AB</Avatar.Fallback>
        </Avatar>
        <Badge color="accent" size="sm">
          New
        </Badge>
      </Badge.Anchor>

      <Badge.Anchor>
        <Avatar alt="Avatar">
          <Avatar.Image source={{ uri: 'https://i.pravatar.cc/100?u=3' }} />
          <Avatar.Fallback>CD</Avatar.Fallback>
        </Avatar>
        <Badge color="success" placement="bottom-right" size="sm" />
      </Badge.Anchor>
    </View>
  );
}
```

## API Reference

### Badge

| prop           | type                      | default       | description                                                                                       |
| -------------- | ------------------------- | ------------- | ------------------------------------------------------------------------------------------------- |
| `children`     | `React.ReactNode`         | -             | Content to display inside the badge (text, number, or icon). When omitted, renders as a dot       |
| `size`         | `BadgeSize`               | `'md'`        | Size of the badge                                                                                 |
| `color`        | `BadgeColor`              | `'default'`   | Color variant of the badge                                                                        |
| `variant`      | `BadgeVariant`            | `'primary'`   | Visual style variant                                                                              |
| `placement`    | `BadgePlacement`          | `'top-right'` | Position of the badge relative to its anchor. Only takes effect when used inside a `Badge.Anchor` |
| `className`    | `string`                  | -             | Additional CSS classes for the badge container                                                    |
| `animation`    | `AnimationRootDisableAll` | -             | Animation configuration for the badge subtree                                                     |
| `...ViewProps` | `ViewProps`               | -             | All standard React Native View props are supported                                                |

#### BadgeSize

| type                   | description                |
| ---------------------- | -------------------------- |
| `'sm' \| 'md' \| 'lg'` | Size variants of the badge |

#### BadgeColor

| type                                                          | description                 |
| ------------------------------------------------------------- | --------------------------- |
| `'default' \| 'accent' \| 'success' \| 'warning' \| 'danger'` | Color variants of the badge |

#### BadgeVariant

| type                                 | description                        |
| ------------------------------------ | ---------------------------------- |
| `'primary' \| 'secondary' \| 'soft'` | Visual style variants of the badge |

#### BadgePlacement

| type                                                           | description                                   |
| -------------------------------------------------------------- | --------------------------------------------- |
| `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | Placement of the badge relative to its anchor |

#### AnimationRootDisableAll

Animation configuration for the Badge root. Can be:

- `"disable-all"`: Disable all animations including children (cascades down)
- `undefined`: Use default animations

### Badge.Anchor

| prop           | type              | default | description                                                 |
| -------------- | ----------------- | ------- | ----------------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | The element to anchor the badge to, plus the `Badge` itself |
| `className`    | `string`          | -       | Additional CSS classes for the anchor wrapper               |
| `...ViewProps` | `ViewProps`       | -       | All standard React Native View props are supported          |

### Badge.Label

| prop           | type              | default | description                                        |
| -------------- | ----------------- | ------- | -------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Label text content                                 |
| `className`    | `string`          | -       | Additional CSS classes for the label text          |
| `...TextProps` | `TextProps`       | -       | All standard React Native Text props are supported |

## Hooks

### useBadge

Hook to access the Badge context. Must be used within a `Badge` component.

```tsx
import { useBadge } from 'heroui-native-pro';

const { size, color, variant, isDot } = useBadge();
```

#### Returns: BadgeContextValue

| property  | type           | description                                     |
| --------- | -------------- | ----------------------------------------------- |
| `size`    | `BadgeSize`    | Current size variant                            |
| `color`   | `BadgeColor`   | Current color variant                           |
| `variant` | `BadgeVariant` | Current visual variant                          |
| `isDot`   | `boolean`      | Whether the badge renders as a dot (no content) |
