# SplitView

A vertical split layout with a draggable divider between a top and bottom section.

## Import

```tsx
import { SplitView } from 'heroui-native-pro';
```

## Anatomy

```tsx
<SplitView>
  <SplitView.TopSection>...</SplitView.TopSection>
  <SplitView.DragArea>
    <SplitView.DragHandle />
  </SplitView.DragArea>
  <SplitView.BottomSection>...</SplitView.BottomSection>
</SplitView>
```

- **SplitView**: Root container that manages snap points, drag state, and layout. Exposes layout state and snap controls via `useSplitView` and render props.
- **SplitView.TopSection**: Top pane with animated height driven by drag and snap state. Content should scroll internally when it exceeds the current height.
- **SplitView.DragArea**: Pan gesture hit region with an extended touch target. Typically wraps `SplitView.DragHandle`.
- **SplitView.DragHandle**: Visual pill handle. Scales slightly while dragging when animations are enabled.
- **SplitView.BottomSection**: Bottom pane that fills remaining space below the drag area.

## Usage

### Basic usage

The SplitView uses compound parts to build a vertical split layout with a draggable divider.

```tsx
<SplitView>
  <SplitView.TopSection>...</SplitView.TopSection>
  <SplitView.DragArea>
    <SplitView.DragHandle />
  </SplitView.DragArea>
  <SplitView.BottomSection>...</SplitView.BottomSection>
</SplitView>
```

### Custom snap points

Pass `snapPoints` as ratios of container height (`0`..`1`) or absolute px (`> 1`). Combine with `defaultSnapIndex` and `minHeight` for uncontrolled layouts.

```tsx
<SplitView snapPoints={[150, 0.5, 0.75]} defaultSnapIndex={1} minHeight={50}>
  <SplitView.TopSection>...</SplitView.TopSection>
  <SplitView.DragArea>
    <SplitView.DragHandle />
  </SplitView.DragArea>
  <SplitView.BottomSection>...</SplitView.BottomSection>
</SplitView>
```

### Skip initial animation

By default (`skipInitialAnimation` is `true`) the divider appears already positioned at its starting snap point instead of animating into place on mount or screen focus. Subsequent snaps and drags still animate. Set `skipInitialAnimation={false}` to animate the divider into place on first render.

```tsx
<SplitView skipInitialAnimation={false}>
  <SplitView.TopSection>...</SplitView.TopSection>
  <SplitView.DragArea>
    <SplitView.DragHandle />
  </SplitView.DragArea>
  <SplitView.BottomSection>...</SplitView.BottomSection>
</SplitView>
```

### Controlled snap index

Control the active snap index externally with `snapIndex` and `onSnapIndexChange`.

```tsx
const [snapIndex, setSnapIndex] = useState(1);

<SplitView snapIndex={snapIndex} onSnapIndexChange={setSnapIndex}>
  <SplitView.TopSection>...</SplitView.TopSection>
  <SplitView.DragArea>
    <SplitView.DragHandle />
  </SplitView.DragArea>
  <SplitView.BottomSection>...</SplitView.BottomSection>
</SplitView>;
```

### Render function children

Use a render function to read layout state and drive animations inside children.

```tsx
<SplitView>
  {({ topSectionHeight, minPx, maxPx }) => (
    <>
      <SplitView.TopSection>...</SplitView.TopSection>
      <SplitView.DragArea>
        <SplitView.DragHandle />
      </SplitView.DragArea>
      <SplitView.BottomSection>...</SplitView.BottomSection>
    </>
  )}
</SplitView>
```

### Accessing context from children

Use the `useSplitView` hook inside any descendant to read animated layout values and trigger snap transitions.

```tsx
const { topSectionHeight, minPx, snapTo } = useSplitView();
```

### Disabled animation

Disable all animations for the subtree with `animation="disable-all"`.

```tsx
<SplitView animation="disable-all">
  <SplitView.TopSection>...</SplitView.TopSection>
  <SplitView.DragArea>
    <SplitView.DragHandle />
  </SplitView.DragArea>
  <SplitView.BottomSection>...</SplitView.BottomSection>
</SplitView>
```

## Example

```tsx
import { SplitView } from 'heroui-native-pro';
import { Text, View } from 'react-native';

export default function SplitViewExample() {
  return (
    <View className="flex-1 px-5 justify-center">
      <View
        className="h-3/5 w-full p-2 rounded-4xl overflow-hidden bg-surface-secondary"
        style={{ borderCurve: 'continuous' }}
      >
        <SplitView minHeight={50} maxHeight={1}>
          <SplitView.TopSection>
            <View
              className="flex-1 items-center justify-center p-4 bg-surface rounded-3xl"
              style={{ borderCurve: 'continuous' }}
            >
              <Text className="text-foreground">
                Top section — drag the handle to resize.
              </Text>
            </View>
          </SplitView.TopSection>
          <SplitView.DragArea className="h-5">
            <SplitView.DragHandle />
          </SplitView.DragArea>
          <SplitView.BottomSection>
            <View
              className="flex-1 items-center justify-center p-4 bg-surface rounded-3xl"
              style={{ borderCurve: 'continuous' }}
            >
              <Text className="text-foreground">
                Bottom section fills remaining space.
              </Text>
            </View>
          </SplitView.BottomSection>
        </SplitView>
      </View>
    </View>
  );
}
```

## API Reference

### SplitView

| prop                | type                                                                    | default           | description                                                                   |
| ------------------- | ----------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------- |
| `children`          | `React.ReactNode \| ((props: SplitViewRenderProps) => React.ReactNode)` | -                 | Child elements or render function receiving layout state                      |
| `snapPoints`        | `readonly number[]`                                                     | `[0.2, 0.5, 0.8]` | Snap points as ratios (`0`..`1`) of container height or absolute px (`> 1`)   |
| `minHeight`         | `number`                                                                | `100`             | Minimum height of the top section as px or ratio (`0`..`1`)                   |
| `maxHeight`         | `number`                                                                | -                 | Maximum height of the top section as px, ratio (`0`..`1`), or negative offset |
| `defaultSnapIndex`  | `number`                                                                | `1`               | Default snap index for uncontrolled usage                                     |
| `skipInitialAnimation` | `boolean`                                                            | `true`            | Skip the spring on the first snap so the divider starts already in place      |
| `snapIndex`         | `number`                                                                | -                 | Controlled snap index                                                         |
| `className`         | `string`                                                                | -                 | Additional CSS classes for the root container                                 |
| `onSnapIndexChange` | `(index: number) => void`                                               | -                 | Callback fired when the snap index changes                                    |
| `onSnap`            | `(snapIndex: number, topHeightPx: number) => void`                      | -                 | Callback fired after a snap completes with the resolved index and top height  |
| `animation`         | `SplitViewRootAnimation`                                                | -                 | Root animation configuration                                                  |
| `asChild`           | `boolean`                                                               | `false`           | Merge props onto the child element instead of rendering a wrapper             |
| `...ViewProps`      | `ViewProps`                                                             | -                 | All standard React Native View props are supported                            |

#### SplitViewSnapPoint

| type     | description                                                        |
| -------- | ------------------------------------------------------------------ |
| `number` | Ratio of container height when in `[0, 1]`; absolute px when `> 1` |

#### SplitViewRenderProps

| prop                 | type                   | description                                        |
| -------------------- | ---------------------- | -------------------------------------------------- |
| `topSectionHeight`   | `SharedValue<number>`  | Animated height of the top section in px           |
| `isDragging`         | `SharedValue<boolean>` | Whether the user is currently dragging the divider |
| `containerHeight`    | `SharedValue<number>`  | Measured container height in px                    |
| `snapIndex`          | `number`               | Current snap index into `resolvedSnapPoints`       |
| `resolvedSnapPoints` | `readonly number[]`    | Snap heights in px, clamped and sorted             |
| `minPx`              | `number`               | Minimum allowed top section height in px           |
| `maxPx`              | `number`               | Maximum allowed top section height in px           |

#### SplitViewRootAnimation

Animation configuration for the root component. Can be:

- `false` or `"disabled"`: Disable only root animations
- `"disable-all"`: Disable all animations including children
- `true` or `undefined`: Use default animations
- `object`: Custom animation configuration

| prop               | type               | default                                                                                                                           | description                                                              |
| ------------------ | ------------------ | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `snapSpringConfig` | `WithSpringConfig` | `{ damping: 25, stiffness: 300, mass: 0.8, overshootClamping: false, restDisplacementThreshold: 0.01, restSpeedThreshold: 0.01 }` | Spring used when snapping the top section after drag release or `snapTo` |

### SplitView.TopSection

| prop           | type              | default | description                                                                 |
| -------------- | ----------------- | ------- | --------------------------------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Content rendered inside the top pane                                        |
| `className`    | `string`          | -       | Additional CSS classes for the top section (the `height` style is reserved) |
| `asChild`      | `boolean`         | `false` | Merge props onto the child element instead of rendering a wrapper           |
| `...ViewProps` | `ViewProps`       | -       | All standard React Native View props are supported                          |

### SplitView.DragArea

| prop           | type              | default | description                                                       |
| -------------- | ----------------- | ------- | ----------------------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Content rendered inside the drag hit region                       |
| `className`    | `string`          | -       | Additional CSS classes for the drag area                          |
| `asChild`      | `boolean`         | `false` | Merge props onto the child element instead of rendering a wrapper |
| `...ViewProps` | `ViewProps`       | -       | All standard React Native View props are supported                |

### SplitView.DragHandle

| prop                    | type                           | default | description                                                               |
| ----------------------- | ------------------------------ | ------- | ------------------------------------------------------------------------- |
| `children`              | `React.ReactNode`              | -       | Custom handle content. Defaults to a pill indicator                       |
| `className`             | `string`                       | -       | Additional CSS classes for the handle (the `transform` style is reserved) |
| `isAnimatedStyleActive` | `boolean`                      | `true`  | When `false`, animated scale styles are not applied                       |
| `animation`             | `SplitViewDragHandleAnimation` | -       | Animation configuration for the handle scale                              |
| `asChild`               | `boolean`                      | `false` | Merge props onto the child element instead of rendering a wrapper         |
| `...ViewProps`          | `ViewProps`                    | -       | All standard React Native View props are supported                        |

#### SplitViewDragHandleAnimation

Animation configuration for the drag handle. Can be:

- `false` or `"disabled"`: Disable all handle animations
- `true` or `undefined`: Use default animations
- `object`: Custom animation configuration

| prop    | type                                | description                                      |
| ------- | ----------------------------------- | ------------------------------------------------ |
| `scale` | `SplitViewDragHandleScaleAnimation` | Scale animation between idle and dragging states |

#### SplitViewDragHandleScaleAnimation

| prop           | type               | default                                      | description                                                    |
| -------------- | ------------------ | -------------------------------------------- | -------------------------------------------------------------- |
| `value`        | `[number, number]` | `[1, 1.15]`                                  | Scale values `[idle, dragging]`                                |
| `springConfig` | `WithSpringConfig` | `{ damping: 18, stiffness: 300, mass: 0.8 }` | Spring used when transitioning between idle and dragging scale |

### SplitView.BottomSection

| prop           | type              | default | description                                                       |
| -------------- | ----------------- | ------- | ----------------------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Content rendered inside the bottom pane                           |
| `className`    | `string`          | -       | Additional CSS classes for the bottom section                     |
| `asChild`      | `boolean`         | `false` | Merge props onto the child element instead of rendering a wrapper |
| `...ViewProps` | `ViewProps`       | -       | All standard React Native View props are supported                |
