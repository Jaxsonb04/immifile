# Stepper

A multi-step progress indicator for guiding users through sequential workflows.

## Import

```tsx
import { Stepper } from 'heroui-native-pro';
```

## Anatomy

```tsx
<Stepper>
  <Stepper.Step>
    <Stepper.Rail>
      <Stepper.Indicator>
        <Stepper.IndicatorCheck />
        <Stepper.IndicatorNumber />
      </Stepper.Indicator>
      <Stepper.Separator>
        <Stepper.SeparatorTrack />
        <Stepper.SeparatorFill />
      </Stepper.Separator>
    </Stepper.Rail>
    <Stepper.Content>
      <Stepper.Title>...</Stepper.Title>
      <Stepper.Description>...</Stepper.Description>
    </Stepper.Content>
  </Stepper.Step>
</Stepper>
```

- **Stepper**: Root container that manages step state, orientation, and animation context. Controls which step is active via controlled or uncontrolled mode.
- **Stepper.Step**: Pressable container for an individual step. Automatically receives its index and status (`inactive`, `active`, `complete`).
- **Stepper.Rail**: Relative wrapper for the indicator and separator. Renders `Indicator` and `Separator` by default when children are omitted; `Separator` is omitted on step index `0`.
- **Stepper.Indicator**: Visual circle for each step. Renders `IndicatorCheck` and `IndicatorNumber` by default when children are omitted.
- **Stepper.IndicatorCheck**: Animated check icon that draws in when the step is complete.
- **Stepper.IndicatorNumber**: 1-based step number label displayed inside the indicator.
- **Stepper.Separator**: Connector line between steps. Renders `SeparatorTrack` and `SeparatorFill` by default when children are omitted.
- **Stepper.SeparatorTrack**: Static background track behind the separator fill.
- **Stepper.SeparatorFill**: Animated accent fill layered on the track, driven by root progress.
- **Stepper.Content**: Container for step title, description, and any additional content.
- **Stepper.Title**: Text label for the step title.
- **Stepper.Description**: Text label for the step description.

## Usage

### Basic Usage

The Stepper component uses compound parts to create a step-by-step indicator. Steps are pressable by default.

```tsx
<Stepper>
  <Stepper.Step>
    <Stepper.Rail />
    <Stepper.Content>
      <Stepper.Title>Account</Stepper.Title>
      <Stepper.Description>Create your account</Stepper.Description>
    </Stepper.Content>
  </Stepper.Step>
  <Stepper.Step>
    <Stepper.Rail />
    <Stepper.Content>
      <Stepper.Title>Profile</Stepper.Title>
      <Stepper.Description>Set up your profile</Stepper.Description>
    </Stepper.Content>
  </Stepper.Step>
</Stepper>
```

### Horizontal Orientation

Display steps in a horizontal layout.

```tsx
<Stepper orientation="horizontal">
  <Stepper.Step>
    <Stepper.Rail />
    <Stepper.Content>
      <Stepper.Title>Cart</Stepper.Title>
    </Stepper.Content>
  </Stepper.Step>
  <Stepper.Step>
    <Stepper.Rail />
    <Stepper.Content>
      <Stepper.Title>Shipping</Stepper.Title>
    </Stepper.Content>
  </Stepper.Step>
  <Stepper.Step>
    <Stepper.Rail />
    <Stepper.Content>
      <Stepper.Title>Payment</Stepper.Title>
    </Stepper.Content>
  </Stepper.Step>
</Stepper>
```

### Controlled Step

Control the active step externally and respond to step changes.

```tsx
const [currentStep, setCurrentStep] = useState(0);

<Stepper currentStep={currentStep} onStepChange={setCurrentStep}>
  <Stepper.Step>
    <Stepper.Rail />
    <Stepper.Content>
      <Stepper.Title>...</Stepper.Title>
    </Stepper.Content>
  </Stepper.Step>
  <Stepper.Step>
    <Stepper.Rail />
    <Stepper.Content>
      <Stepper.Title>...</Stepper.Title>
    </Stepper.Content>
  </Stepper.Step>
</Stepper>
```

### Custom Indicator

Replace the default indicator content with custom icons per step.

```tsx
<Stepper.Step>
  <Stepper.Rail>
    <Stepper.Indicator>
      <CustomIcon />
      <Stepper.IndicatorNumber />
    </Stepper.Indicator>
    <Stepper.Separator />
  </Stepper.Rail>
  <Stepper.Content>
    <Stepper.Title>...</Stepper.Title>
  </Stepper.Content>
</Stepper.Step>
```

### Custom Separator Colors

Override separator and indicator colors using className on each compound part.

```tsx
<Stepper.Step>
  <Stepper.Rail>
    <Stepper.Indicator className="border-success data-[status=complete]:bg-success">
      ...
    </Stepper.Indicator>
    <Stepper.Separator className="bg-success data-[status=inactive]:bg-border">
      <Stepper.SeparatorTrack className="bg-border" />
      <Stepper.SeparatorFill className="bg-success" />
    </Stepper.Separator>
  </Stepper.Rail>
  <Stepper.Content>
    <Stepper.Title>...</Stepper.Title>
  </Stepper.Content>
</Stepper.Step>
```

### Disabled Animation

Disable all stepper animations using the root `animation` prop.

```tsx
<Stepper animation="disable-all" currentStep={1}>
  <Stepper.Step>
    <Stepper.Rail />
    <Stepper.Content>
      <Stepper.Title>...</Stepper.Title>
    </Stepper.Content>
  </Stepper.Step>
</Stepper>
```

## Example

```tsx
import { Button } from 'heroui-native';
import { Stepper } from 'heroui-native-pro';
import { useState } from 'react';
import { Text, View } from 'react-native';

const STEPS = [
  { description: 'Create your account', title: 'Account' },
  { description: 'Set up your profile', title: 'Profile' },
  { description: 'Configure preferences', title: 'Settings' },
  { description: 'Review and confirm', title: 'Review' },
];

export default function StepperExample() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <View className="flex-1 justify-center px-5">
      <Stepper
        orientation="vertical"
        currentStep={currentStep}
        onStepChange={setCurrentStep}
      >
        {STEPS.map((s) => (
          <Stepper.Step key={s.title}>
            <Stepper.Rail />
            <Stepper.Content>
              <Stepper.Title>{s.title}</Stepper.Title>
              <Stepper.Description>{s.description}</Stepper.Description>
            </Stepper.Content>
          </Stepper.Step>
        ))}
      </Stepper>
      <View className="mt-6 flex-row items-center justify-center gap-2">
        <Button
          size="sm"
          variant="outline"
          isDisabled={currentStep <= 0}
          onPress={() => setCurrentStep((n) => Math.max(0, n - 1))}
        >
          Prev
        </Button>
        <Text className="w-10 text-center text-muted text-xs">
          {`${currentStep + 1} / ${STEPS.length}`}
        </Text>
        <Button
          size="sm"
          variant="outline"
          isDisabled={currentStep >= STEPS.length - 1}
          onPress={() => setCurrentStep((n) => Math.min(STEPS.length - 1, n + 1))}
        >
          Next
        </Button>
      </View>
    </View>
  );
}
```

## API Reference

### Stepper

| prop            | type                       | default      | description                                       |
| --------------- | -------------------------- | ------------ | ------------------------------------------------- |
| `children`      | `React.ReactNode`          | -            | Step elements to render inside the stepper        |
| `currentStep`   | `number`                   | -            | Controlled active step index                      |
| `defaultStep`   | `number`                   | `0`          | Initial step index in uncontrolled mode           |
| `orientation`   | `'horizontal' \| 'vertical'` | `'vertical'` | Main axis of the step sequence                 |
| `animation`     | `StepperRootAnimation`     | -            | Root animation configuration                      |
| `className`     | `string`                   | -            | Additional CSS classes for the root container     |
| `onStepChange`  | `(step: number) => void`   | -            | Callback when the active step index changes       |
| `...ViewProps`  | `ViewProps`                | -            | All standard React Native View props are supported |

#### Data Attributes

| attribute          | values                        | description              |
| ------------------ | ----------------------------- | ------------------------ |
| `data-orientation` | `"horizontal" \| "vertical"` | Current layout orientation |

#### StepperRootAnimation

Animation configuration for the stepper root. Can be:

- `false` or `"disabled"`: Disable only root progress animation
- `"disable-all"`: Disable all animations including children
- `true` or `undefined`: Use default animations
- `object`: Custom animation configuration

| prop                       | type                                     | default                                                    | description                                     |
| -------------------------- | ---------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------- |
| `state`                    | `'disabled' \| 'disable-all' \| boolean` | -                                                          | Disable animations while customizing properties |
| `progress.timingConfig`    | `WithTimingConfig`                       | `{ duration: 200, easing: Easing.out(Easing.ease) }`      | Timing configuration for step progress animation |

### Stepper.Step

| prop                | type              | default | description                                             |
| ------------------- | ----------------- | ------- | ------------------------------------------------------- |
| `children`          | `React.ReactNode` | -       | Step content (Rail, Content, etc.)                      |
| `className`         | `string`          | -       | Additional CSS classes for the step container           |
| `...PressableProps` | `PressableProps`  | -       | All standard React Native Pressable props are supported |

#### Data Attributes

| attribute          | values                        | description              |
| ------------------ | ----------------------------- | ------------------------ |
| `data-orientation` | `"horizontal" \| "vertical"` | Current layout orientation |

### Stepper.Rail

| prop           | type              | default | description                                                                              |
| -------------- | ----------------- | ------- | ---------------------------------------------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Custom rail content; when omitted, renders `Indicator` and `Separator` (except on step 0) |
| `className`    | `string`          | -       | Additional CSS classes for the rail container                                            |
| `...ViewProps` | `ViewProps`       | -       | All standard React Native View props are supported                                       |

### Stepper.Indicator

| prop           | type              | default | description                                                                    |
| -------------- | ----------------- | ------- | ------------------------------------------------------------------------------ |
| `children`     | `React.ReactNode` | -       | Custom indicator content; when omitted, renders `IndicatorCheck` and `IndicatorNumber` |
| `className`    | `string`          | -       | Additional CSS classes for the indicator container                              |
| `...ViewProps` | `ViewProps`       | -       | All standard React Native View props are supported                             |

#### Data Attributes

| attribute     | values                                    | description                            |
| ------------- | ----------------------------------------- | -------------------------------------- |
| `data-status` | `"inactive" \| "active" \| "complete"` | Step status relative to the active step |

### Stepper.IndicatorCheck

| prop            | type     | default                | description                       |
| --------------- | -------- | ---------------------- | --------------------------------- |
| `size`          | `number` | `16`                   | Icon size in logical pixels       |
| `strokeWidth`   | `number` | -                      | Stroke width for the check path   |
| `color`         | `string` | `accent-foreground`    | Stroke color of the check icon    |
| `enterDuration` | `number` | `200`                  | Duration (ms) when check draws in |
| `exitDuration`  | `number` | `0`                    | Duration (ms) when check draws out |
| `className`     | `string` | -                      | Additional CSS classes for the wrapper |
| `...ViewProps`  | `ViewProps` | -                   | All standard React Native View props are supported |

### Stepper.IndicatorNumber

| prop           | type                                         | default | description                                                  |
| -------------- | -------------------------------------------- | ------- | ------------------------------------------------------------ |
| `children`     | `React.ReactNode \| ((index: number) => React.ReactNode)` | -       | Custom label; static node or function receiving zero-based index |
| `className`    | `string`                                     | -       | Additional CSS classes for the label text                    |
| `...TextProps` | `TextProps`                                  | -       | All standard React Native Text props are supported           |

#### Data Attributes

| attribute     | values                                    | description                            |
| ------------- | ----------------------------------------- | -------------------------------------- |
| `data-status` | `"inactive" \| "active" \| "complete"` | Step status relative to the active step |

### Stepper.Separator

| prop           | type              | default | description                                                                          |
| -------------- | ----------------- | ------- | ------------------------------------------------------------------------------------ |
| `children`     | `React.ReactNode` | -       | Custom separator content; when omitted, renders `SeparatorTrack` and `SeparatorFill` |
| `force`        | `boolean`         | `false` | Render the separator on the last step                                                |
| `progress`     | `number`          | -       | Explicit fill amount (0–1); when omitted, derived from `currentStep`                 |
| `className`    | `string`          | -       | Additional CSS classes for the separator container                                   |
| `...ViewProps` | `ViewProps`       | -       | All standard React Native View props are supported                                   |

#### Data Attributes

| attribute          | values                                    | description                            |
| ------------------ | ----------------------------------------- | -------------------------------------- |
| `data-orientation` | `"horizontal" \| "vertical"`             | Current layout orientation              |
| `data-status`      | `"inactive" \| "active" \| "complete"` | Step status relative to the active step |

### Stepper.SeparatorTrack

| prop           | type        | default | description                                        |
| -------------- | ----------- | ------- | -------------------------------------------------- |
| `className`    | `string`    | -       | Additional CSS classes for the track view           |
| `...ViewProps` | `ViewProps` | -       | All standard React Native View props are supported  |

### Stepper.SeparatorFill

| prop                   | type                    | default | description                                                 |
| ---------------------- | ----------------------- | ------- | ----------------------------------------------------------- |
| `animation`            | `false \| 'disabled'`   | -       | Disable the fill scale animation for this separator         |
| `isAnimatedStyleActive` | `boolean`              | `true`  | When `false`, animated scale styles are not applied         |
| `className`            | `string`                | -       | Additional CSS classes for the fill view                    |
| `...ViewProps`         | `ViewProps`             | -       | All standard React Native View props are supported          |

### Stepper.Content

| prop           | type              | default | description                                        |
| -------------- | ----------------- | ------- | -------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Content to render (title, description, etc.)       |
| `className`    | `string`          | -       | Additional CSS classes for the content container   |
| `...ViewProps` | `ViewProps`       | -       | All standard React Native View props are supported |

#### Data Attributes

| attribute          | values                        | description              |
| ------------------ | ----------------------------- | ------------------------ |
| `data-orientation` | `"horizontal" \| "vertical"` | Current layout orientation |

### Stepper.Title

| prop           | type              | default | description                                        |
| -------------- | ----------------- | ------- | -------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Title text for the step                            |
| `className`    | `string`          | -       | Additional CSS classes for the title text          |
| `...TextProps` | `TextProps`       | -       | All standard React Native Text props are supported |

#### Data Attributes

| attribute          | values                                    | description                            |
| ------------------ | ----------------------------------------- | -------------------------------------- |
| `data-orientation` | `"horizontal" \| "vertical"`             | Current layout orientation              |
| `data-status`      | `"inactive" \| "active" \| "complete"` | Step status relative to the active step |

### Stepper.Description

| prop           | type              | default | description                                        |
| -------------- | ----------------- | ------- | -------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Description text for the step                      |
| `className`    | `string`          | -       | Additional CSS classes for the description text    |
| `...TextProps` | `TextProps`       | -       | All standard React Native Text props are supported |

#### Data Attributes

| attribute          | values                                    | description                            |
| ------------------ | ----------------------------------------- | -------------------------------------- |
| `data-orientation` | `"horizontal" \| "vertical"`             | Current layout orientation              |
| `data-status`      | `"inactive" \| "active" \| "complete"` | Step status relative to the active step |

## Hooks

### useStepper

Hook to access the stepper root context. Must be used within a `Stepper` component.

```tsx
import { useStepper } from 'heroui-native-pro';

const { currentStep, onStepChange, orientation } = useStepper();
```

#### Returns

| property         | type                                                        | description                                           |
| ---------------- | ----------------------------------------------------------- | ----------------------------------------------------- |
| `currentStep`    | `number`                                                    | Currently active step index                           |
| `onStepChange`   | `(step: number) => void`                                    | Callback to update the active step                    |
| `orientation`    | `'horizontal' \| 'vertical'`                                | Current layout orientation                            |
| `measurements`   | `Record<number, StepMeasurements>`                          | Per-step layout measurements                          |
| `setStepMeasurement` | `(index: number, partial: Partial<StepMeasurements>) => void` | Update layout measurements for a step            |

### useStepperStep

Hook to access the per-step context. Must be used within a `Stepper.Step` component.

```tsx
import { useStepperStep } from 'heroui-native-pro';

const { index, isLast, status } = useStepperStep();
```

#### Returns

| property | type                                    | description                           |
| -------- | --------------------------------------- | ------------------------------------- |
| `index`  | `number`                                | Zero-based index of the step          |
| `isLast` | `boolean`                               | Whether this is the last step         |
| `status` | `'inactive' \| 'active' \| 'complete'` | Current status relative to active step |

### useStepperAnimation

Hook to access the stepper animation context. Must be used within a `Stepper` component.

```tsx
import { useStepperAnimation } from 'heroui-native-pro';

const { progress } = useStepperAnimation();
```

#### Returns

| property   | type                   | description                                                   |
| ---------- | ---------------------- | ------------------------------------------------------------- |
| `progress` | `SharedValue<number>`  | Animated progress aligned with the active step index          |
