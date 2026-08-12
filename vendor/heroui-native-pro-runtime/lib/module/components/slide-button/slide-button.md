# SlideButton

A slide-to-action button that requires a deliberate swipe gesture to confirm an action.

## Import

```tsx
import { SlideButton } from 'heroui-native-pro';
```

## Anatomy

```tsx
<SlideButton>
  <SlideButton.UnderlayContent>
    <SlideButton.Label>...</SlideButton.Label>
  </SlideButton.UnderlayContent>
  <SlideButton.OverlayContent>
    <SlideButton.Label>...</SlideButton.Label>
  </SlideButton.OverlayContent>
  <SlideButton.Thumb />
</SlideButton>
```

- **SlideButton**: Root container that manages gesture state, progress tracking, and completion detection. Supports controlled and uncontrolled completion state with optional auto-reset.
- **SlideButton.UnderlayContent**: Static content layer beneath the overlay. Right-anchored clip wrapper that reveals content to the right of the thumb as it slides.
- **SlideButton.OverlayContent**: Progress fill layer that clips from left to right as the thumb slides. Uses an overflow-hidden wrapper with animated width tied to thumb position.
- **SlideButton.Thumb**: Draggable handle driven by a pan gesture. Renders a chevron-right icon by default; accepts custom children.
- **SlideButton.Label**: Styled text element that automatically inherits the variant color from context. Use inside UnderlayContent or OverlayContent.

## Usage

### Basic usage

The SlideButton uses compound parts to build a slide-to-confirm interaction.

```tsx
<SlideButton onComplete={handleComplete}>
  <SlideButton.UnderlayContent>
    <SlideButton.Label>Slide to confirm</SlideButton.Label>
  </SlideButton.UnderlayContent>
  <SlideButton.OverlayContent />
  <SlideButton.Thumb />
</SlideButton>
```

### Variants

Apply different color schemes with the `variant` prop.

```tsx
<SlideButton variant="accent">
  <SlideButton.UnderlayContent>
    <SlideButton.Label>Slide to unlock</SlideButton.Label>
  </SlideButton.UnderlayContent>
  <SlideButton.OverlayContent>
    <SlideButton.Label>Unlocked!</SlideButton.Label>
  </SlideButton.OverlayContent>
  <SlideButton.Thumb />
</SlideButton>

<SlideButton variant="success">
  <SlideButton.UnderlayContent>
    <SlideButton.Label>Slide to approve</SlideButton.Label>
  </SlideButton.UnderlayContent>
  <SlideButton.OverlayContent>
    <SlideButton.Label>Approved!</SlideButton.Label>
  </SlideButton.OverlayContent>
  <SlideButton.Thumb />
</SlideButton>

<SlideButton variant="danger">
  <SlideButton.UnderlayContent>
    <SlideButton.Label>Slide to delete</SlideButton.Label>
  </SlideButton.UnderlayContent>
  <SlideButton.OverlayContent>
    <SlideButton.Label>Deleted!</SlideButton.Label>
  </SlideButton.OverlayContent>
  <SlideButton.Thumb />
</SlideButton>
```

### Auto reset

Automatically reset the slider after completion with `autoReset` and an optional `autoResetDelay`.

```tsx
<SlideButton autoReset autoResetDelay={2000} onComplete={handleComplete}>
  <SlideButton.UnderlayContent>
    <SlideButton.Label>Slide to confirm</SlideButton.Label>
  </SlideButton.UnderlayContent>
  <SlideButton.OverlayContent>
    <SlideButton.Label>Confirmed!</SlideButton.Label>
  </SlideButton.OverlayContent>
  <SlideButton.Thumb />
</SlideButton>
```

### Disabled

Disable the entire slide interaction with `isDisabled`.

```tsx
<SlideButton isDisabled>
  <SlideButton.UnderlayContent>
    <SlideButton.Label>Slide is disabled</SlideButton.Label>
  </SlideButton.UnderlayContent>
  <SlideButton.OverlayContent />
  <SlideButton.Thumb />
</SlideButton>
```

### Controlled

Control the completion state externally with `isCompleted` and `onCompleteChange`.

```tsx
const [isCompleted, setIsCompleted] = useState(false);

<SlideButton
  isCompleted={isCompleted}
  onCompleteChange={setIsCompleted}
  autoReset
  autoResetDelay={1500}
>
  <SlideButton.UnderlayContent>
    <SlideButton.Label>Slide to verify</SlideButton.Label>
  </SlideButton.UnderlayContent>
  <SlideButton.OverlayContent>
    <SlideButton.Label>Verified!</SlideButton.Label>
  </SlideButton.OverlayContent>
  <SlideButton.Thumb />
</SlideButton>;
```

### Render function children

Use a render function to access slide state for progress-driven custom content.

```tsx
<SlideButton variant="success" autoReset>
  {({ progress }) => (
    <>
      <SlideButton.UnderlayContent>
        <SlideButton.Label>Slide to buy · $49.99</SlideButton.Label>
      </SlideButton.UnderlayContent>
      <SlideButton.OverlayContent>
        <SlideButton.Label>Purchased!</SlideButton.Label>
      </SlideButton.OverlayContent>
      <SlideButton.Thumb />
    </>
  )}
</SlideButton>
```

## Example

```tsx
import { Spinner } from 'heroui-native';
import { SlideButton, useSlideButton } from 'heroui-native-pro';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

const PurchaseOverlayLabel = () => {
  const { progress } = useSlideButton();

  const rLabelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.get(), [0.5, 1], [0, 1]),
  }));

  return (
    <Animated.View style={rLabelStyle}>
      <SlideButton.Label>Purchased!</SlideButton.Label>
    </Animated.View>
  );
};

export default function PurchaseSlideButton() {
  const [purchased, setPurchased] = useState(false);

  const handleReset = useCallback(() => {
    setPurchased(false);
  }, []);

  return (
    <View className="flex-1 px-5 items-center justify-center">
      <View className="w-full max-w-sm gap-4">
        <SlideButton
          variant="success"
          onCompleteChange={setPurchased}
          autoReset
          autoResetDelay={2500}
          onReset={handleReset}
        >
          <SlideButton.UnderlayContent>
            <SlideButton.Label>Slide to buy · $49.99</SlideButton.Label>
          </SlideButton.UnderlayContent>
          <SlideButton.OverlayContent>
            <PurchaseOverlayLabel />
          </SlideButton.OverlayContent>
          <SlideButton.Thumb>
            {purchased ? <Spinner size="sm" color="success" /> : null}
          </SlideButton.Thumb>
        </SlideButton>
      </View>
    </View>
  );
}
```

## API Reference

### SlideButton

| prop                  | type                                                                      | default     | description                                                 |
| --------------------- | ------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------- |
| `children`            | `React.ReactNode \| ((props: SlideButtonRenderProps) => React.ReactNode)` | -           | Children elements or render function receiving slide state  |
| `variant`             | `'default' \| 'accent' \| 'success' \| 'danger'`                          | `"default"` | Visual variant controlling color scheme                     |
| `isCompleted`         | `boolean`                                                                 | -           | Whether the slide action has completed (controlled mode)    |
| `isDefaultCompleted`  | `boolean`                                                                 | `false`     | Default completed state for uncontrolled mode               |
| `isDisabled`          | `boolean`                                                                 | `false`     | Whether the component is disabled                           |
| `completionThreshold` | `number`                                                                  | `0.85`      | Progress threshold (0–1) at which the slide action triggers |
| `autoReset`           | `boolean`                                                                 | `false`     | Whether the slider automatically resets after completion    |
| `autoResetDelay`      | `number`                                                                  | `1000`      | Delay in milliseconds before auto-reset occurs              |
| `className`           | `string`                                                                  | -           | Additional CSS classes for the root container               |
| `classNames`          | `ElementSlots<SlideButtonRootSlots>`                                      | -           | Additional CSS classes for individual slots                 |
| `styles`              | `Partial<Record<SlideButtonRootSlots, ViewStyle>>`                        | -           | Styles for individual slots                                 |
| `onCompleteChange`    | `(isCompleted: boolean) => void`                                          | -           | Callback fired when the completed state changes             |
| `onComplete`          | `() => void`                                                              | -           | Callback fired when the slide action completes              |
| `onReset`             | `() => void`                                                              | -           | Callback fired when the slider resets to start              |
| `animation`           | `SlideButtonRootAnimation`                                                | -           | Animation configuration for the root component              |
| `...ViewProps`        | `ViewProps`                                                               | -           | All standard React Native View props are supported          |

#### SlideButtonRenderProps

| prop          | type                  | description                                   |
| ------------- | --------------------- | --------------------------------------------- |
| `progress`    | `SharedValue<number>` | Animated progress value (0 = start, 1 = end)  |
| `isCompleted` | `boolean`             | Whether the slide action has been completed   |
| `trackWidth`  | `SharedValue<number>` | Measured width of the root content container  |
| `trackHeight` | `SharedValue<number>` | Measured height of the root content container |
| `thumbWidth`  | `SharedValue<number>` | Measured width of the thumb element           |
| `thumbHeight` | `SharedValue<number>` | Measured height of the thumb element          |
| `isDisabled`  | `boolean`             | Whether the component is disabled             |
| `variant`     | `SlideButtonVariant`  | Visual variant applied to the component       |

#### ElementSlots\<SlideButtonRootSlots\>

| slot               | description                                     |
| ------------------ | ----------------------------------------------- |
| `container`        | Outer root wrapper with padding and background  |
| `contentContainer` | Inner content wrapper that holds compound parts |

#### styles

| slot               | type        | description                         |
| ------------------ | ----------- | ----------------------------------- |
| `container`        | `ViewStyle` | Style for the outer root wrapper    |
| `contentContainer` | `ViewStyle` | Style for the inner content wrapper |

#### SlideButtonRootAnimation

Animation configuration for the root component. Can be:

- `false` or `"disabled"`: Disable only root animations
- `"disable-all"`: Disable all animations including children
- `true` or `undefined`: Use default animations
- `object`: Custom animation configuration

| prop                | type               | default                                     | description                                                 |
| ------------------- | ------------------ | ------------------------------------------- | ----------------------------------------------------------- |
| `resetSpringConfig` | `WithSpringConfig` | `{ damping: 120, stiffness: 900, mass: 4 }` | Spring configuration for the reset and auto-reset animation |

### SlideButton.UnderlayContent

| prop           | type                                                          | default | description                                        |
| -------------- | ------------------------------------------------------------- | ------- | -------------------------------------------------- |
| `children`     | `React.ReactNode`                                             | -       | Content to display in the underlay                 |
| `className`    | `string`                                                      | -       | Additional CSS classes for the container slot      |
| `classNames`   | `ElementSlots<SlideButtonUnderlayContentSlots>`               | -       | Additional CSS classes for individual slots        |
| `styles`       | `Partial<Record<SlideButtonUnderlayContentSlots, ViewStyle>>` | -       | Styles for individual slots                        |
| `...ViewProps` | `ViewProps`                                                   | -       | All standard React Native View props are supported |

#### ElementSlots\<SlideButtonUnderlayContentSlots\>

| slot               | description                                                       |
| ------------------ | ----------------------------------------------------------------- |
| `container`        | Outer clip wrapper anchored to the right, shrinks as thumb slides |
| `contentContainer` | Inner container at full track width for natural content layout    |

#### styles

| slot               | type        | description                                      |
| ------------------ | ----------- | ------------------------------------------------ |
| `container`        | `ViewStyle` | Style for the outer clip wrapper                 |
| `contentContainer` | `ViewStyle` | Style for the inner full-width content container |

### SlideButton.OverlayContent

| prop           | type                                                         | default | description                                        |
| -------------- | ------------------------------------------------------------ | ------- | -------------------------------------------------- |
| `children`     | `React.ReactNode`                                            | -       | Content to display in the overlay                  |
| `className`    | `string`                                                     | -       | Additional CSS classes for the container slot      |
| `classNames`   | `ElementSlots<SlideButtonOverlayContentSlots>`               | -       | Additional CSS classes for individual slots        |
| `styles`       | `Partial<Record<SlideButtonOverlayContentSlots, ViewStyle>>` | -       | Styles for individual slots                        |
| `...ViewProps` | `ViewProps`                                                  | -       | All standard React Native View props are supported |

#### ElementSlots\<SlideButtonOverlayContentSlots\>

| slot               | description                                                       |
| ------------------ | ----------------------------------------------------------------- |
| `container`        | Outer clip wrapper that expands from left as the thumb slides     |
| `contentContainer` | Inner container at full track width with variant background color |

#### styles

| slot               | type        | description                                      |
| ------------------ | ----------- | ------------------------------------------------ |
| `container`        | `ViewStyle` | Style for the outer clip wrapper                 |
| `contentContainer` | `ViewStyle` | Style for the inner full-width content container |

### SlideButton.Thumb

| prop                    | type                        | default | description                                                                      |
| ----------------------- | --------------------------- | ------- | -------------------------------------------------------------------------------- |
| `children`              | `React.ReactNode`           | -       | Custom content for the thumb. Defaults to a chevron-right icon                   |
| `className`             | `string`                    | -       | Additional CSS classes for the thumb                                             |
| `isAnimatedStyleActive` | `boolean`                   | `true`  | Whether animated styles (react-native-reanimated) are active                     |
| `iconProps`             | `SlideButtonThumbIconProps` | -       | Props forwarded to the default chevron icon. Ignored when `children` is provided |
| `animation`             | `SlideButtonThumbAnimation` | -       | Animation configuration for the thumb                                            |
| `...ViewProps`          | `ViewProps`                 | -       | All standard React Native View props are supported                               |

#### SlideButtonThumbIconProps

| prop    | type     | default | description                                                      |
| ------- | -------- | ------- | ---------------------------------------------------------------- |
| `size`  | `number` | `20`    | Icon size in logical pixels                                      |
| `color` | `string` | -       | Icon fill color. When omitted, uses the variant foreground color |

#### SlideButtonThumbAnimation

Animation configuration for the thumb component. Can be:

- `false` or `"disabled"`: Disable all animations
- `true` or `undefined`: Use default animations
- `object`: Custom animation configuration

| prop           | type               | default                                     | description                                                  |
| -------------- | ------------------ | ------------------------------------------- | ------------------------------------------------------------ |
| `springConfig` | `WithSpringConfig` | `{ damping: 120, stiffness: 900, mass: 4 }` | Spring configuration for snap-back and snap-to-end animation |

### SlideButton.Label

| prop           | type              | default | description                                        |
| -------------- | ----------------- | ------- | -------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Text content for the label                         |
| `className`    | `string`          | -       | Additional CSS classes for the label text          |
| `...TextProps` | `TextProps`       | -       | All standard React Native Text props are supported |

## Hooks

### useSlideButton

Hook to access the slide button context. Must be used within a `SlideButton` component.

```tsx
import { useSlideButton } from 'heroui-native-pro';

const {
  progress,
  isCompleted,
  trackWidth,
  trackHeight,
  thumbWidth,
  thumbHeight,
  completionThreshold,
  isDisabled,
  variant,
  reset,
} = useSlideButton();
```

#### Returns

| property              | type                  | description                                             |
| --------------------- | --------------------- | ------------------------------------------------------- |
| `progress`            | `SharedValue<number>` | Animated progress value (0 = start, 1 = end)            |
| `isCompleted`         | `boolean`             | Whether the slide action has been completed             |
| `trackWidth`          | `SharedValue<number>` | Measured width of the root content container            |
| `trackHeight`         | `SharedValue<number>` | Measured height of the root content container           |
| `thumbWidth`          | `SharedValue<number>` | Measured width of the thumb element                     |
| `thumbHeight`         | `SharedValue<number>` | Measured height of the thumb element                    |
| `completionThreshold` | `number`              | Progress threshold at which completion triggers         |
| `isDisabled`          | `boolean`             | Whether the component is disabled                       |
| `variant`             | `SlideButtonVariant`  | Visual variant applied to the component                 |
| `reset`               | `() => void`          | Programmatically reset the slider to the start position |
