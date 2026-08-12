# ProgressButton

A press-and-hold button that fills a progress overlay to confirm an action.

## Import

```tsx
import { ProgressButton } from 'heroui-native-pro';
```

## Anatomy

```tsx
<ProgressButton>
  <ProgressButton.Label>...</ProgressButton.Label>
  <ProgressButton.Overlay>
    <ProgressButton.MaskLabel>...</ProgressButton.MaskLabel>
  </ProgressButton.Overlay>
</ProgressButton>
```

- **ProgressButton**: Root container that manages press-and-hold state, fill progress, and completion detection. Supports controlled and uncontrolled completion state with optional auto-reset.
- **ProgressButton.Label**: Base text layer always visible beneath the overlay. Captures its own layout position for the MaskLabel counter-animation.
- **ProgressButton.Overlay**: Absolutely positioned layer that sweeps left-to-right via animated translateX with a variant-colored background. Renders children (typically MaskLabel).
- **ProgressButton.MaskLabel**: Inverted-color text inside the Overlay that counter-translates to stay visually aligned with the base Label, creating a color-wipe effect.

## Usage

### Basic usage

Pass a string as children for the simplest usage. The Label, Overlay, and MaskLabel are rendered automatically.

```tsx
<ProgressButton onComplete={handleComplete}>Hold to confirm</ProgressButton>
```

### Compound parts

Use compound parts for full control over the label and overlay content.

```tsx
<ProgressButton onComplete={handleComplete}>
  <ProgressButton.Label>Hold to confirm</ProgressButton.Label>
  <ProgressButton.Overlay>
    <ProgressButton.MaskLabel>Hold to confirm</ProgressButton.MaskLabel>
  </ProgressButton.Overlay>
</ProgressButton>
```

### Variants

Apply different color schemes with the `variant` prop.

```tsx
<ProgressButton variant="accent">Hold to unlock</ProgressButton>

<ProgressButton variant="success">Hold to approve</ProgressButton>

<ProgressButton variant="danger">Hold to delete</ProgressButton>
```

### Custom hold duration

Control how long the user must hold with the `holdDuration` prop.

```tsx
<ProgressButton holdDuration={1000} autoReset>Quick hold</ProgressButton>

<ProgressButton holdDuration={5000} autoReset>Hold to end run</ProgressButton>
```

### Auto reset

Automatically reset after completion with `autoReset` and an optional `autoResetDelay`.

```tsx
<ProgressButton autoReset autoResetDelay={2000} onComplete={handleComplete}>
  Hold to confirm
</ProgressButton>
```

### Disabled

Disable the entire hold interaction with `isDisabled`.

```tsx
<ProgressButton isDisabled>Hold is disabled</ProgressButton>
```

### Controlled

Control the completion state externally with `isCompleted` and `onCompleteChange`.

```tsx
const [isCompleted, setIsCompleted] = useState(false);

<ProgressButton
  variant="success"
  isCompleted={isCompleted}
  onCompleteChange={setIsCompleted}
  autoReset
  autoResetDelay={2000}
>
  Hold to verify
</ProgressButton>;
```

### Render function children

Use a render function to access progress state for custom animated content.

```tsx
<ProgressButton variant="danger" autoReset>
  {({ progress, isCompleted }) => (
    <>
      <ProgressButton.Label>Hold to end run</ProgressButton.Label>
      <ProgressButton.Overlay>
        <ProgressButton.MaskLabel>Hold to end run</ProgressButton.MaskLabel>
      </ProgressButton.Overlay>
    </>
  )}
</ProgressButton>
```

## Example

```tsx
import { useToast } from 'heroui-native';
import { ProgressButton } from 'heroui-native-pro';
import { useCallback } from 'react';
import { View } from 'react-native';

export default function ConfirmProgressButton() {
  const { toast } = useToast();

  const handleComplete = useCallback(() => {
    toast.show({
      variant: 'success',
      label: 'Completed',
      description: 'Hold action completed!',
      duration: 1000,
    });
  }, [toast]);

  return (
    <View className="flex-1 px-5 items-center justify-center">
      <View className="w-full max-w-sm">
        <ProgressButton onComplete={handleComplete} autoReset>
          <ProgressButton.Label>Hold to confirm</ProgressButton.Label>
          <ProgressButton.Overlay>
            <ProgressButton.MaskLabel>Hold to confirm</ProgressButton.MaskLabel>
          </ProgressButton.Overlay>
        </ProgressButton>
      </View>
    </View>
  );
}
```

## API Reference

### ProgressButton

| prop                 | type                                                                         | default     | description                                               |
| -------------------- | ---------------------------------------------------------------------------- | ----------- | --------------------------------------------------------- |
| `children`           | `React.ReactNode \| ((props: ProgressButtonRenderProps) => React.ReactNode)` | -           | Children elements or render function receiving hold state |
| `variant`            | `'default' \| 'accent' \| 'success' \| 'danger'`                             | `"default"` | Visual variant controlling color scheme                   |
| `holdDuration`       | `number`                                                                     | `2000`      | Duration in milliseconds the user must hold to complete   |
| `isCompleted`        | `boolean`                                                                    | -           | Whether the hold action has completed (controlled mode)   |
| `isDefaultCompleted` | `boolean`                                                                    | `false`     | Default completed state for uncontrolled mode             |
| `isDisabled`         | `boolean`                                                                    | `false`     | Whether the component is disabled                         |
| `autoReset`          | `boolean`                                                                    | `false`     | Whether the button automatically resets after completion  |
| `autoResetDelay`     | `number`                                                                     | `1000`      | Delay in milliseconds before auto-reset occurs            |
| `className`          | `string`                                                                     | -           | Additional CSS classes for the root container             |
| `onCompleteChange`   | `(isCompleted: boolean) => void`                                             | -           | Callback fired when the completed state changes           |
| `onComplete`         | `() => void`                                                                 | -           | Callback fired when the hold action completes             |
| `onReset`            | `() => void`                                                                 | -           | Callback fired when the button resets to start            |
| `animation`          | `ProgressButtonRootAnimation`                                                | -           | Animation configuration for the root component            |
| `...PressableProps`  | `PressableProps`                                                             | -           | All standard React Native Pressable props are supported   |

#### ProgressButtonRenderProps

| prop          | type                    | description                                                   |
| ------------- | ----------------------- | ------------------------------------------------------------- |
| `progress`    | `SharedValue<number>`   | Animated progress value (0 = start, 1 = complete)             |
| `isCompleted` | `boolean`               | Whether the hold action has been completed                    |
| `trackWidth`  | `SharedValue<number>`   | Measured width of the root container                          |
| `textX`       | `SharedValue<number>`   | Measured x-offset of the Label relative to the root container |
| `textWidth`   | `SharedValue<number>`   | Measured width of the Label text                              |
| `isDisabled`  | `boolean`               | Whether the component is disabled                             |
| `variant`     | `ProgressButtonVariant` | Visual variant applied to the component                       |

#### ProgressButtonRootAnimation

Animation configuration for the root component. Can be:

- `false` or `"disabled"`: Disable only root animations
- `"disable-all"`: Disable all animations including children
- `true` or `undefined`: Use default animations
- `object`: Custom animation configuration

| prop                   | type                                                  | default                                             | description                                                     |
| ---------------------- | ----------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------- |
| `progressSpringConfig` | `WithSpringConfig`                                    | `{ damping: 120, stiffness: 900, mass: 4 }`         | Spring configuration for the progress reset and controlled-sync |
| `scale`                | `{ value?: number; timingConfig?: WithTimingConfig }` | `{ value: 0.985, timingConfig: { duration: 150 } }` | Scale press-feedback configuration                              |

### ProgressButton.Overlay

| prop           | type              | default | description                                             |
| -------------- | ----------------- | ------- | ------------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Content to display in the overlay (typically MaskLabel) |
| `className`    | `string`          | -       | Additional CSS classes for the overlay container        |
| `...ViewProps` | `ViewProps`       | -       | All standard React Native View props are supported      |

### ProgressButton.Label

| prop           | type              | default | description                                        |
| -------------- | ----------------- | ------- | -------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Text content for the label                         |
| `className`    | `string`          | -       | Additional CSS classes for the label text          |
| `...TextProps` | `TextProps`       | -       | All standard React Native Text props are supported |

### ProgressButton.MaskLabel

| prop           | type              | default | description                                               |
| -------------- | ----------------- | ------- | --------------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Text content for the mask label (should match Label text) |
| `className`    | `string`          | -       | Additional CSS classes for the mask label text            |
| `...TextProps` | `TextProps`       | -       | All standard React Native Text props are supported        |

## Hooks

### useProgressButton

Hook to access the progress button context. Must be used within a `ProgressButton` component.

```tsx
import { useProgressButton } from 'heroui-native-pro';

const {
  progress,
  isCompleted,
  trackWidth,
  textX,
  textWidth,
  isDisabled,
  variant,
  reset,
  complete,
} = useProgressButton();
```

#### Returns

| property      | type                    | description                                                   |
| ------------- | ----------------------- | ------------------------------------------------------------- |
| `progress`    | `SharedValue<number>`   | Animated progress value (0 = start, 1 = complete)             |
| `isCompleted` | `boolean`               | Whether the hold action has been completed                    |
| `trackWidth`  | `SharedValue<number>`   | Measured width of the root container                          |
| `textX`       | `SharedValue<number>`   | Measured x-offset of the Label relative to the root container |
| `textWidth`   | `SharedValue<number>`   | Measured width of the Label text                              |
| `isDisabled`  | `boolean`               | Whether the component is disabled                             |
| `variant`     | `ProgressButtonVariant` | Visual variant applied to the component                       |
| `reset`       | `() => void`            | Programmatically reset the progress to 0                      |
| `complete`    | `() => void`            | Programmatically trigger the completion flow                  |
