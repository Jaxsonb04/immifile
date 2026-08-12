# TimePicker

A time picker that combines a trigger field with a scrollable wheel popup for selecting an hour, minute, and optional AM/PM period.

> `TimePicker` uses [`@internationalized/date`](https://react-aria.adobe.com/internationalized/date/) for time manipulation (`Time`, locale-aware formatting). The wheel exchanges a `Time` value internally, while the selected option stores an ISO time string. For full context on the time type exposed through `formatTime`, read the [`@internationalized/date` docs](https://react-aria.adobe.com/internationalized/date/) alongside this page.

## Import

```tsx
import { TimePicker } from 'heroui-native-pro';
```

## Anatomy

```tsx
<TimePicker>
  <Label>...</Label>
  <TimePicker.Select>
    <TimePicker.Trigger>
      <TimePicker.Value />
      <TimePicker.TriggerIndicator />
    </TimePicker.Trigger>
    <TimePicker.Portal>
      <TimePicker.Overlay />
      <TimePicker.Content>
        <TimePicker.Wheel>
          <TimePicker.WheelHour />
          <TimePicker.WheelMinute />
          <TimePicker.WheelPeriod />
          <TimePicker.WheelIndicator />
          <TimePicker.WheelMask />
        </TimePicker.Wheel>
      </TimePicker.Content>
    </TimePicker.Portal>
  </TimePicker.Select>
  <Description>...</Description>
</TimePicker>
```

- **TimePicker**: Root container that manages time selection state, open state, label formatting, and form field context (for Label, Description, FieldError). Supports controlled and uncontrolled modes.
- **TimePicker.Select**: Pre-wired Select root connected to the TimePicker context. State props (`value`, `isOpen`, `onValueChange`, `onOpenChange`) are managed by the root. Always single selection mode.
- **TimePicker.Trigger**: Pressable trigger button that opens the wheel overlay. Inherits invalid border styling from the root.
- **TimePicker.Value**: Text display for the selected time label. Shows a placeholder when no time is selected.
- **TimePicker.TriggerIndicator**: Indicator icon inside the trigger. Defaults to a clock icon instead of a chevron.
- **TimePicker.Portal**: Portal wrapper that re-provides TimePicker context across the portal boundary.
- **TimePicker.Overlay**: Backdrop overlay behind the wheel content.
- **TimePicker.Content**: Content container for the wheel popup. Supports `"popover"`, `"dialog"`, and `"bottom-sheet"` presentations. Dialog swipe-to-dismiss is always disabled, and the bottom sheet defaults to no pan-down-to-close.
- **TimePicker.Wheel**: Pre-wired wheel time selector that commits the selected time live on scroll and updates the trigger label while the surface stays open. Renders the default wheel parts when no children are passed.
- **TimePicker.WheelHour**: Hour column.
- **TimePicker.WheelMinute**: Minute column.
- **TimePicker.WheelPeriod**: AM/PM column. Rendered by default only in 12-hour mode.
- **TimePicker.WheelIndicator**: Shared selection band spanning every column.
- **TimePicker.WheelMask**: Top / bottom fade overlays. Defaults its gradient color to the overlay surface so it blends with the popup background.

## Usage

### Basic Usage

The TimePicker uses a popover presentation by default. Pass `TimePicker.Wheel` with no children to render the default hour, minute, period, indicator, and mask parts.

```tsx
<TimePicker>
  <Label>Reminder</Label>
  <TimePicker.Select>
    <TimePicker.Trigger>
      <TimePicker.Value />
      <TimePicker.TriggerIndicator />
    </TimePicker.Trigger>
    <TimePicker.Portal>
      <TimePicker.Overlay />
      <TimePicker.Content presentation="popover" width="trigger">
        <TimePicker.Wheel />
      </TimePicker.Content>
    </TimePicker.Portal>
  </TimePicker.Select>
</TimePicker>
```

### Dialog Presentation

Display the wheel in a centered modal dialog.

```tsx
<TimePicker>
  <Label>Reminder</Label>
  <TimePicker.Select presentation="dialog">
    <TimePicker.Trigger>
      <TimePicker.Value />
      <TimePicker.TriggerIndicator />
    </TimePicker.Trigger>
    <TimePicker.Portal>
      <TimePicker.Overlay />
      <TimePicker.Content presentation="dialog">
        <TimePicker.Wheel />
      </TimePicker.Content>
    </TimePicker.Portal>
  </TimePicker.Select>
</TimePicker>
```

### Bottom Sheet Presentation

Display the wheel in a bottom sheet.

```tsx
<TimePicker>
  <Label>Reminder</Label>
  <TimePicker.Select presentation="bottom-sheet">
    <TimePicker.Trigger>
      <TimePicker.Value />
      <TimePicker.TriggerIndicator />
    </TimePicker.Trigger>
    <TimePicker.Portal>
      <TimePicker.Overlay />
      <TimePicker.Content presentation="bottom-sheet">
        <TimePicker.Wheel />
      </TimePicker.Content>
    </TimePicker.Portal>
  </TimePicker.Select>
</TimePicker>
```

### Hour Format and Minute Interval

Use `hourFormat` to switch between 12-hour and 24-hour mode, and `minuteInterval` to control the step between minute options. In 24-hour mode the AM/PM column is omitted.

```tsx
<TimePicker hourFormat={24} minuteInterval={5} locale="en-GB">
  <Label>Departure</Label>
  <TimePicker.Select>
    <TimePicker.Trigger>
      <TimePicker.Value placeholder="Select a time" />
      <TimePicker.TriggerIndicator />
    </TimePicker.Trigger>
    <TimePicker.Portal>
      <TimePicker.Overlay />
      <TimePicker.Content presentation="popover" width="trigger">
        <TimePicker.Wheel />
      </TimePicker.Content>
    </TimePicker.Portal>
  </TimePicker.Select>
</TimePicker>
```

### Custom Format Function

Override the trigger label entirely with `formatTime`.

```tsx
function formatCompactTime(time: Time): string {
  const hour12 = time.hour % 12 === 0 ? 12 : time.hour % 12;
  const minute = String(time.minute).padStart(2, '0');
  const marker = time.hour < 12 ? 'a.m.' : 'p.m.';
  return `${hour12}:${minute} ${marker}`;
}

<TimePicker formatTime={formatCompactTime}>
  <Label>Custom format</Label>
  <TimePicker.Select>
    <TimePicker.Trigger>
      <TimePicker.Value />
      <TimePicker.TriggerIndicator />
    </TimePicker.Trigger>
    <TimePicker.Portal>
      <TimePicker.Overlay />
      <TimePicker.Content presentation="popover" width="trigger">
        <TimePicker.Wheel />
      </TimePicker.Content>
    </TimePicker.Portal>
  </TimePicker.Select>
</TimePicker>;
```

### Field States

Use root props for required, invalid, and disabled states. Combine `isInvalid` with FieldError to display validation messages; the trigger shows a danger border.

```tsx
<TimePicker isInvalid>
  <Label>Cutoff</Label>
  <TimePicker.Select>
    <TimePicker.Trigger>
      <TimePicker.Value />
      <TimePicker.TriggerIndicator />
    </TimePicker.Trigger>
    <TimePicker.Portal>
      <TimePicker.Overlay />
      <TimePicker.Content presentation="popover" width="trigger">
        <TimePicker.Wheel />
      </TimePicker.Content>
    </TimePicker.Portal>
  </TimePicker.Select>
  <Description hideOnInvalid>Must be during business hours.</Description>
  <FieldError>Please select a valid cutoff time.</FieldError>
</TimePicker>
```

## Example

```tsx
import type { Time } from '@internationalized/date';
import { Description, FieldError, Label } from 'heroui-native';
import { TimePicker } from 'heroui-native-pro';
import { View } from 'react-native';

function formatCompactTime(time: Time): string {
  const hour12 = time.hour % 12 === 0 ? 12 : time.hour % 12;
  const minute = String(time.minute).padStart(2, '0');
  const marker = time.hour < 12 ? 'a.m.' : 'p.m.';
  return `${hour12}:${minute} ${marker}`;
}

export default function TimePickerExample() {
  return (
    <View className="flex-1 justify-center px-5 gap-12">
      <TimePicker formatTime={formatCompactTime}>
        <Label>Reminder</Label>
        <TimePicker.Select>
          <TimePicker.Trigger>
            <TimePicker.Value placeholder="Pick a reminder time" />
            <TimePicker.TriggerIndicator />
          </TimePicker.Trigger>
          <TimePicker.Portal>
            <TimePicker.Overlay />
            <TimePicker.Content
              presentation="popover"
              width="trigger"
              className="items-center justify-center"
            >
              <TimePicker.Wheel />
            </TimePicker.Content>
          </TimePicker.Portal>
        </TimePicker.Select>
        <Description>Required to schedule the notification.</Description>
      </TimePicker>

      <TimePicker isInvalid hourFormat={24} minuteInterval={5}>
        <Label>Cutoff</Label>
        <TimePicker.Select>
          <TimePicker.Trigger>
            <TimePicker.Value />
            <TimePicker.TriggerIndicator />
          </TimePicker.Trigger>
          <TimePicker.Portal>
            <TimePicker.Overlay />
            <TimePicker.Content
              presentation="popover"
              width="trigger"
              className="items-center justify-center"
            >
              <TimePicker.Wheel />
            </TimePicker.Content>
          </TimePicker.Portal>
        </TimePicker.Select>
        <Description hideOnInvalid>Must be during business hours.</Description>
        <FieldError>Please select a valid cutoff time.</FieldError>
      </TimePicker>
    </View>
  );
}
```

## API Reference

### TimePicker

| prop                | type                                             | default   | description                                                                |
| ------------------- | ------------------------------------------------ | --------- | -------------------------------------------------------------------------- |
| `children`          | `React.ReactNode`                                | -         | Children elements (Label, TimePicker.Select, Description, FieldError)      |
| `value`             | `TimePickerOption`                               | -         | Controlled selected option                                                 |
| `defaultValue`      | `TimePickerOption`                               | -         | Default selected option for uncontrolled usage                             |
| `isDisabled`        | `boolean`                                        | `false`   | Whether the entire field is disabled                                       |
| `isInvalid`         | `boolean`                                        | `false`   | Whether the field is in an invalid state                                   |
| `isRequired`        | `boolean`                                        | `false`   | Whether the field is required                                              |
| `isOpen`            | `boolean`                                        | -         | Controlled open state of the wheel overlay                                 |
| `isDefaultOpen`     | `boolean`                                        | -         | Initial open state for uncontrolled usage                                  |
| `hourFormat`        | `WheelTimePickerHourFormat`                      | `12`      | Hour display mode; `12` adds an AM/PM marker, `24` omits it                |
| `minuteInterval`    | `number`                                         | `1`       | Step between consecutive minute options                                    |
| `timeDisplayFormat` | `TimePickerTimeDisplayFormat`                    | `'short'` | Preset time label format; ignored when `formatTime` is set                 |
| `locale`            | `string`                                         | -         | BCP 47 locale for label formatting and the wheel's AM/PM labels            |
| `formatTime`        | `(time: Time) => string`                         | -         | Custom formatter that overrides `timeDisplayFormat`, `hourFormat`, `locale`|
| `className`         | `string`                                         | -         | Additional CSS classes for the root container                              |
| `animation`         | `AnimationRootDisableAll`                        | -         | Animation configuration for the time picker subtree                        |
| `onValueChange`     | `(value: TimePickerOption \| undefined) => void` | -         | Handler called when the selected option changes                            |
| `onOpenChange`      | `(open: boolean) => void`                        | -         | Handler called when the open state changes                                 |
| `...ViewProps`      | `ViewProps`                                      | -         | All standard React Native View props are supported                         |

#### TimePickerOption

| property | type     | description                                              |
| -------- | -------- | -------------------------------------------------------- |
| `value`  | `string` | ISO time string (e.g. `"14:30:00"`)                      |
| `label`  | `string` | Display string shown in the trigger (e.g. `"2:30 PM"`)   |

#### TimePickerTimeDisplayFormat

Built-in time label presets:

- `'short'` — hour and minute only (e.g. `"2:30 PM"` / `"14:30"`) (default)
- `'medium'` — includes seconds (e.g. `"2:30:00 PM"`)

#### WheelTimePickerHourFormat

Hour display mode for the wheel and label formatting:

- `12` — twelve-hour clock with an AM/PM period column (default)
- `24` — twenty-four-hour clock without a period column

#### AnimationRootDisableAll

Animation configuration for the TimePicker root. Can be:

- `"disable-all"`: Disable all animations including children (cascades down)
- `undefined`: Use default animations

### TimePicker.Select

| prop           | type                                      | default     | description                                        |
| -------------- | ----------------------------------------- | ----------- | -------------------------------------------------- |
| `children`     | `React.ReactNode`                         | -           | Select content (Trigger, Portal)                   |
| `isDisabled`   | `boolean`                                 | -           | Overrides the root `isDisabled` when set           |
| `presentation` | `'popover' \| 'dialog' \| 'bottom-sheet'` | `'popover'` | Presentation mode for the select content           |
| `className`    | `string`                                  | -           | Additional CSS classes                             |
| `...ViewProps` | `ViewProps`                               | -           | All standard React Native View props are supported |

### TimePicker.Trigger

| prop                | type              | default | description                                                            |
| ------------------- | ----------------- | ------- | ---------------------------------------------------------------------- |
| `children`          | `React.ReactNode` | -       | Trigger content (Value, TriggerIndicator)                              |
| `isDisabled`        | `boolean`         | -       | Whether the trigger is disabled                                        |
| `isInvalid`         | `boolean`         | -       | When `true`, applies a danger border; inherits from root when omitted  |
| `className`         | `string`          | -       | Additional CSS classes for the trigger                                 |
| `...PressableProps` | `PressableProps`  | -       | All standard React Native Pressable props are supported                |

### TimePicker.Value

| prop           | type        | default           | description                                        |
| -------------- | ----------- | ----------------- | -------------------------------------------------- |
| `placeholder`  | `string`    | `'Choose a time'` | Text shown when no time is selected                |
| `className`    | `string`    | -                 | Additional CSS classes for the value text          |
| `...TextProps` | `TextProps` | -                 | All standard React Native Text props are supported |

### TimePicker.TriggerIndicator

| prop                    | type                              | default | description                                                          |
| ----------------------- | --------------------------------- | ------- | -------------------------------------------------------------------- |
| `children`              | `React.ReactNode`                 | -       | Custom indicator content; defaults to a clock icon when omitted      |
| `iconProps`             | `SelectTriggerIndicatorIconProps` | -       | Overrides for the default icon                                       |
| `isAnimatedStyleActive` | `boolean`                         | `false` | Whether animated rotation styles are applied                         |
| `style`                 | `ViewStyle`                       | -       | Inline style for the indicator container                             |
| `animation`             | `SelectTriggerIndicatorAnimation` | `false` | Rotation animation configuration; disabled by default for clock icon |
| `...ViewProps`          | `ViewProps`                       | -       | All standard React Native View props are supported                   |

#### SelectTriggerIndicatorIconProps

| prop    | type     | default | description                 |
| ------- | -------- | ------- | --------------------------- |
| `size`  | `number` | `16`    | Icon size in logical pixels |
| `color` | `string` | `muted` | Icon fill color             |

### TimePicker.Portal

| prop                                         | type              | default | description                                                              |
| -------------------------------------------- | ----------------- | ------- | ------------------------------------------------------------------------ |
| `children`                                   | `React.ReactNode` | -       | Portal content (Overlay, Content)                                        |
| `hostName`                                   | `string`          | -       | Optional name of the host element for the portal                         |
| `disableFullWindowOverlay`                   | `boolean`         | `false` | Use a regular View instead of FullWindowOverlay on iOS                   |
| `unstable_accessibilityContainerViewIsModal` | `boolean`         | `false` | Controls whether VoiceOver treats the overlay as a modal container (iOS) |
| `className`                                  | `string`          | -       | Additional CSS classes for the portal container                          |

### TimePicker.Overlay

| prop                    | type                     | default | description                                             |
| ----------------------- | ------------------------ | ------- | ------------------------------------------------------- |
| `closeOnPress`          | `boolean`                | `true`  | Whether to close the picker when the overlay is pressed |
| `isAnimatedStyleActive` | `boolean`                | `true`  | Whether animated opacity styles are applied             |
| `className`             | `string`                 | -       | Additional CSS classes for the overlay backdrop         |
| `animation`             | `SelectOverlayAnimation` | -       | Opacity animation configuration                         |
| `...PressableProps`     | `PressableProps`         | -       | All standard React Native Pressable props are supported |

### TimePicker.Content

The content component is a union type based on the `presentation` prop. The dialog `isSwipeable` prop is removed — TimePicker always disables dialog swipe-to-dismiss, and the bottom sheet defaults to no pan-down-to-close.

#### Popover presentation

| prop           | type                                             | default         | description                                           |
| -------------- | ------------------------------------------------ | --------------- | ----------------------------------------------------- |
| `children`     | `React.ReactNode`                                | -               | Content (TimePicker.Wheel)                            |
| `presentation` | `'popover'`                                      | -               | Popover presentation mode                             |
| `width`        | `'content-fit' \| 'trigger' \| 'full' \| number` | `'content-fit'` | Content width sizing strategy                         |
| `className`    | `string`                                         | -               | Additional CSS classes for the content container      |
| `animation`    | `SelectContentPopoverAnimation`                  | -               | Keyframe animation configuration for entering/exiting |
| `...ViewProps` | `ViewProps`                                      | -               | All standard React Native View props are supported    |

#### Dialog presentation

| prop           | type                     | default | description                                        |
| -------------- | ------------------------ | ------- | -------------------------------------------------- |
| `children`     | `React.ReactNode`        | -       | Content (TimePicker.Wheel)                         |
| `presentation` | `'dialog'`               | -       | Dialog presentation mode                           |
| `className`    | `string`                 | -       | Additional CSS classes for the content container   |
| `animation`    | `SelectContentAnimation` | -       | Keyframe animation configuration for scale/opacity |
| `...ViewProps` | `ViewProps`              | -       | All standard React Native View props are supported |

#### Bottom sheet presentation

| prop                  | type               | default | description                                  |
| --------------------- | ------------------ | ------- | -------------------------------------------- |
| `children`            | `React.ReactNode`  | -       | Content (TimePicker.Wheel)                   |
| `presentation`        | `'bottom-sheet'`   | -       | Bottom sheet presentation mode               |
| `...BottomSheetProps` | `BottomSheetProps` | -       | All @gorhom/bottom-sheet props are supported |

### TimePicker.Wheel

Wired from TimePicker context; `value`, `defaultValue`, and `onValueChange` are managed by the root. Each scroll commits the selected option (formatted label + select value) live while the surface stays open. When `children` are omitted, the default wheel parts are rendered (period column only in 12-hour mode).

| prop             | type                        | default        | description                                                              |
| ---------------- | --------------------------- | -------------- | ------------------------------------------------------------------------ |
| `children`       | `React.ReactNode`           | -              | Wheel parts; defaults to Hour, Minute, Period (12h), Indicator, and Mask |
| `hourFormat`     | `WheelTimePickerHourFormat` | root value     | Overrides the root hour display mode for the wheel                       |
| `minuteInterval` | `number`                    | root value     | Overrides the root step between minute options                           |
| `itemHeight`     | `number`                    | `44`           | Pixel height of a single row, shared by all columns                      |
| `visibleCount`   | `number`                    | `5`            | Number of visible rows, shared by all columns. Must be odd               |
| `isDisabled`     | `boolean`                   | `false`        | Disables interaction for the whole wheel                                 |
| `locale`         | `string`                    | root value     | Overrides the root locale for the wheel's AM/PM labels                   |
| `className`      | `string`                    | -              | Additional CSS classes for the wheel container                           |
| `animation`      | `WheelTimePickerRootAnimation` | -           | Animation configuration; cascades `disable-all` to the columns           |
| `...ViewProps`   | `Omit<ViewProps, 'children'>` | -            | All standard React Native View props are supported                       |

### TimePicker.WheelHour

Hour column. The underlying `name` and `items` are owned by the wheel so the stored value stays correct.

| prop           | type                                 | default | description                                                       |
| -------------- | ------------------------------------ | ------- | ----------------------------------------------------------------- |
| `isDisabled`   | `boolean`                            | `false` | Disables interaction for this column                              |
| `className`    | `string`                             | -       | Additional CSS classes for the column container                   |
| `classNames`   | `ElementSlots<WheelPickerRootSlots>` | -       | Additional CSS classes for individual column slots                |
| `styles`       | `WheelPickerRootStyles`              | -       | Inline styles for individual column slots                         |
| `renderItem`   | `WheelPickerRenderItem<number>`      | -       | Custom row renderer; defaults to a `WheelPicker.ItemLabel`        |
| `animation`    | `WheelPickerRootAnimation`           | -       | Per-item opacity / scale interpolation configuration              |
| `...ViewProps` | `Omit<ViewProps, 'children'>`        | -       | All standard React Native View props are supported                |

### TimePicker.WheelMinute

Minute column. Same props as `TimePicker.WheelHour`; the underlying `name` and `items` are owned by the wheel.

### TimePicker.WheelPeriod

AM/PM column. Same props as `TimePicker.WheelHour`; the underlying `name` and `items` are owned by the wheel. Rendered by default only in 12-hour mode.

### TimePicker.WheelIndicator

Shared selection band spanning every column.

| prop           | type                                                    | default | description                                                         |
| -------------- | ------------------------------------------------------- | ------- | ------------------------------------------------------------------- |
| `children`     | `React.ReactNode`                                       | -       | Optional content rendered inside the `highlight` slot               |
| `className`    | `string`                                                | -       | Additional CSS classes for the indicator container                  |
| `classNames`   | `ElementSlots<WheelPickerGroupIndicatorSlots>`          | -       | Additional CSS classes for individual indicator slots               |
| `styles`       | `Partial<Record<WheelPickerGroupIndicatorSlots, ViewStyle>>` | -  | Inline styles for individual indicator slots                        |
| `...ViewProps` | `ViewProps`                                             | -       | All standard React Native View props are supported                  |

#### ElementSlots\<WheelPickerGroupIndicatorSlots\>

| slot        | description                                               |
| ----------- | --------------------------------------------------------- |
| `wrapper`   | Absolutely-positioned band centered on the wheel viewport |
| `highlight` | Filled rectangle rendered inside the wrapper              |

### TimePicker.WheelMask

Top / bottom fade overlays. When `color` is omitted it defaults to the Select `overlay` surface color so the gradient blends with the popup background.

| prop           | type                                                    | default            | description                                                                                                                          |
| -------------- | ------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `color`        | `string`                                                | `overlay` surface  | Solid color the gradient fades from. Accepts any RN color string                                                                     |
| `height`       | `number \| string`                                      | `"100%"`           | Height of each mask half. `number` = raw pixels; percentage scales the default fade height (`((visibleCount - 1) / 4) * itemHeight`) |
| `className`    | `string`                                                | -                  | Additional CSS classes applied to both mask halves                                                                                   |
| `classNames`   | `ElementSlots<WheelPickerGroupMaskSlots>`               | -                  | Additional CSS classes for individual mask slots                                                                                     |
| `styles`       | `Partial<Record<WheelPickerGroupMaskSlots, ViewStyle>>` | -                  | Inline styles for individual mask slots                                                                                              |
| `...ViewProps` | `Omit<ViewProps, 'children'>`                           | -                  | All standard React Native View props are supported                                                                                   |

#### ElementSlots\<WheelPickerGroupMaskSlots\>

| slot     | description         |
| -------- | ------------------- |
| `top`    | Top fade overlay    |
| `bottom` | Bottom fade overlay |

## Hooks

### useTimePicker

Hook to access the TimePicker context. Must be used within a `TimePicker` component.

```tsx
import { useTimePicker } from 'heroui-native-pro';

const { value, commitTime, isOpen, formatLabel } = useTimePicker();
```

#### Returns: TimePickerContextValue

| property         | type                                                  | description                                                                  |
| ---------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------- |
| `value`          | `TimePickerOption \| undefined`                       | Current select option (ISO time string + display label)                     |
| `onValueChange`  | `(next: TimePickerOption \| undefined) => void`       | Update the selected option                                                   |
| `isOpen`         | `boolean`                                             | Whether the wheel overlay is open                                            |
| `onOpenChange`   | `(open: boolean) => void`                             | Update the open state                                                        |
| `commitTime`     | `(time: Time, options?: TimePickerCommitOptions) => void` | Commit a time: updates the option, formats the label, and closes unless `options.close` is `false` |
| `formatLabel`    | `(time: Time) => string`                              | Format a time using root `timeDisplayFormat` / `hourFormat` / `locale` / `formatTime` |
| `hourFormat`     | `WheelTimePickerHourFormat`                           | Root hour format forwarded to `TimePicker.Wheel`                             |
| `minuteInterval` | `number`                                              | Root minute interval forwarded to `TimePicker.Wheel`                         |
| `locale`         | `string \| undefined`                                 | Root locale forwarded to `TimePicker.Wheel`                                  |
| `isDisabledRoot` | `boolean`                                             | Whether the root is disabled                                                 |

#### TimePickerCommitOptions

| property | type      | default | description                                          |
| -------- | --------- | ------- | ---------------------------------------------------- |
| `close`  | `boolean` | `true`  | Whether to close the select surface after committing |
