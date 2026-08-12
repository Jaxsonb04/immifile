# DateTimePicker

A field shell that pairs a `Select` trigger with a `WheelDateTimePicker` presentation surface, exchanging an `@internationalized/date` `CalendarDateTime`.

## Import

```tsx
import { DateTimePicker } from 'heroui-native-pro';
```

## Anatomy

```tsx
<DateTimePicker>
  <DateTimePicker.Select>
    <DateTimePicker.Trigger>
      <DateTimePicker.Value />
      <DateTimePicker.TriggerIndicator />
    </DateTimePicker.Trigger>
    <DateTimePicker.Portal>
      <DateTimePicker.Overlay />
      <DateTimePicker.Content presentation="popover">
        <DateTimePicker.Wheel />
      </DateTimePicker.Content>
    </DateTimePicker.Portal>
  </DateTimePicker.Select>
</DateTimePicker>
```

- **DateTimePicker**: Field shell owning selection, open state, and commit behavior. Forwards `minValue` / `maxValue` / `hourFormat` / `minuteInterval` / `locale` / `formatDate` to `DateTimePicker.Wheel`.
- **DateTimePicker.Select**: Wires `Select` (single mode) to the root state.
- **DateTimePicker.Portal**: Portals content and re-provides `DateTimePicker` context.
- **DateTimePicker.Overlay**: Backdrop behind portaled content.
- **DateTimePicker.Content**: Presentation surface (`popover` / `dialog` / `bottom-sheet`).
- **DateTimePicker.Trigger**: Trigger surface with invalid border styling.
- **DateTimePicker.Value**: Selected label / placeholder.
- **DateTimePicker.TriggerIndicator**: Trailing calendar icon (default).
- **DateTimePicker.Wheel**: Wheel date-time selector wired to commit on scroll; renders the default wheel parts (`WheelDate`, `WheelHour`, `WheelMinute`, `WheelPeriod` in 12-hour mode, `WheelIndicator`, `WheelMask`) when no children are passed.

## Usage

### Basic usage (managed state)

```tsx
<DateTimePicker>
  <DateTimePicker.Select>
    <DateTimePicker.Trigger>
      <DateTimePicker.Value />
      <DateTimePicker.TriggerIndicator />
    </DateTimePicker.Trigger>
    <DateTimePicker.Portal>
      <DateTimePicker.Overlay />
      <DateTimePicker.Content presentation="popover" width="trigger">
        <DateTimePicker.Wheel />
      </DateTimePicker.Content>
    </DateTimePicker.Portal>
  </DateTimePicker.Select>
</DateTimePicker>
```

### Controlled

Control the selected date-time externally with `value` and `onValueChange`. The option stores an ISO date-time string in `value` and a display label shown in the trigger. You can also control the wheel overlay with `isOpen` and `onOpenChange`.

```tsx
import type { DateTimePickerOption } from 'heroui-native-pro';
import { useState } from 'react';

const [selected, setSelected] = useState<DateTimePickerOption | undefined>({
  value: '2026-06-01T14:30:00',
  label: 'Jun 1, 2026, 2:30 PM',
});
const [isOpen, setIsOpen] = useState(false);

<DateTimePicker
  value={selected}
  onValueChange={setSelected}
  isOpen={isOpen}
  onOpenChange={setIsOpen}
>
  <DateTimePicker.Select>
    <DateTimePicker.Trigger>
      <DateTimePicker.Value />
      <DateTimePicker.TriggerIndicator />
    </DateTimePicker.Trigger>
    <DateTimePicker.Portal>
      <DateTimePicker.Overlay />
      <DateTimePicker.Content presentation="popover" width="trigger">
        <DateTimePicker.Wheel />
      </DateTimePicker.Content>
    </DateTimePicker.Portal>
  </DateTimePicker.Select>
</DateTimePicker>;
```

### Bounded date range

Limit the selectable days with `minValue` / `maxValue`, forwarded to the wheel.

```tsx
import { today, getLocalTimeZone } from '@internationalized/date';

const start = today(getLocalTimeZone());

<DateTimePicker minValue={start} maxValue={start.add({ months: 6 })}>
  <DateTimePicker.Select>
    <DateTimePicker.Trigger>
      <DateTimePicker.Value />
      <DateTimePicker.TriggerIndicator />
    </DateTimePicker.Trigger>
    <DateTimePicker.Portal>
      <DateTimePicker.Overlay />
      <DateTimePicker.Content presentation="popover" width="trigger">
        <DateTimePicker.Wheel />
      </DateTimePicker.Content>
    </DateTimePicker.Portal>
  </DateTimePicker.Select>
</DateTimePicker>;
```

### 24-hour mode with interval

```tsx
<DateTimePicker hourFormat={24} minuteInterval={5} locale="en-GB">
  <DateTimePicker.Select>
    <DateTimePicker.Trigger>
      <DateTimePicker.Value />
      <DateTimePicker.TriggerIndicator />
    </DateTimePicker.Trigger>
    <DateTimePicker.Portal>
      <DateTimePicker.Overlay />
      <DateTimePicker.Content presentation="popover" width="trigger">
        <DateTimePicker.Wheel />
      </DateTimePicker.Content>
    </DateTimePicker.Portal>
  </DateTimePicker.Select>
</DateTimePicker>
```

### Custom label

Override the committed trigger label with `formatDateTime`.

```tsx
<DateTimePicker
  formatDateTime={(value) =>
    `${value.month}/${value.day} ${value.hour}:${String(value.minute).padStart(2, '0')}`
  }
>
  <DateTimePicker.Select>
    <DateTimePicker.Trigger>
      <DateTimePicker.Value />
      <DateTimePicker.TriggerIndicator />
    </DateTimePicker.Trigger>
    <DateTimePicker.Portal>
      <DateTimePicker.Overlay />
      <DateTimePicker.Content presentation="popover" width="trigger">
        <DateTimePicker.Wheel />
      </DateTimePicker.Content>
    </DateTimePicker.Portal>
  </DateTimePicker.Select>
</DateTimePicker>
```

### Field states

`isRequired`, `isInvalid`, and `isDisabled` integrate with `Label`, `Description`, and `FieldError`.

```tsx
<DateTimePicker isInvalid>
  <Label>Cutoff</Label>
  <DateTimePicker.Select>
    <DateTimePicker.Trigger>
      <DateTimePicker.Value />
      <DateTimePicker.TriggerIndicator />
    </DateTimePicker.Trigger>
    <DateTimePicker.Portal>
      <DateTimePicker.Overlay />
      <DateTimePicker.Content presentation="popover" width="trigger">
        <DateTimePicker.Wheel />
      </DateTimePicker.Content>
    </DateTimePicker.Portal>
  </DateTimePicker.Select>
  <FieldError>Please select a valid date and time.</FieldError>
</DateTimePicker>
```

## Example

```tsx
import type { CalendarDateTime } from '@internationalized/date';
import { Description, FieldError, Label } from 'heroui-native';
import { DateTimePicker } from 'heroui-native-pro';
import { View } from 'react-native';

function formatCompactDateTime(value: CalendarDateTime): string {
  const hour12 = value.hour % 12 === 0 ? 12 : value.hour % 12;
  const minute = String(value.minute).padStart(2, '0');
  const marker = value.hour < 12 ? 'a.m.' : 'p.m.';
  return `${value.month}/${value.day} · ${hour12}:${minute} ${marker}`;
}

export default function DateTimePickerExample() {
  return (
    <View className="flex-1 justify-center px-5 gap-12">
      <DateTimePicker formatDateTime={formatCompactDateTime}>
        <Label>Reminder</Label>
        <DateTimePicker.Select>
          <DateTimePicker.Trigger>
            <DateTimePicker.Value placeholder="Pick a reminder date & time" />
            <DateTimePicker.TriggerIndicator />
          </DateTimePicker.Trigger>
          <DateTimePicker.Portal>
            <DateTimePicker.Overlay />
            <DateTimePicker.Content
              presentation="popover"
              width="trigger"
              className="items-center justify-center"
            >
              <DateTimePicker.Wheel />
            </DateTimePicker.Content>
          </DateTimePicker.Portal>
        </DateTimePicker.Select>
        <Description>Required to schedule the notification.</Description>
      </DateTimePicker>

      <DateTimePicker isInvalid hourFormat={24} minuteInterval={5}>
        <Label>Cutoff</Label>
        <DateTimePicker.Select>
          <DateTimePicker.Trigger>
            <DateTimePicker.Value />
            <DateTimePicker.TriggerIndicator />
          </DateTimePicker.Trigger>
          <DateTimePicker.Portal>
            <DateTimePicker.Overlay />
            <DateTimePicker.Content
              presentation="popover"
              width="trigger"
              className="items-center justify-center"
            >
              <DateTimePicker.Wheel />
            </DateTimePicker.Content>
          </DateTimePicker.Portal>
        </DateTimePicker.Select>
        <Description hideOnInvalid>Must be during business hours.</Description>
        <FieldError>Please select a valid cutoff date and time.</FieldError>
      </DateTimePicker>
    </View>
  );
}
```

## API Reference

### DateTimePicker

| prop                    | type                                                 | default      | description                                                                           |
| ----------------------- | ---------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------- |
| `children`              | `React.ReactNode`                                    | -            | Compound children                                                                     |
| `isDisabled`            | `boolean`                                            | `false`      | Whether the entire field is disabled                                                  |
| `isInvalid`             | `boolean`                                            | `false`      | Whether the field is in an invalid state                                              |
| `isRequired`            | `boolean`                                            | `false`      | Whether the field is required                                                         |
| `className`             | `string`                                             | -            | Additional CSS classes                                                                |
| `animation`             | `AnimationRootDisableAll`                            | -            | Animation configuration. Cascades `disable-all` to all children                       |
| `value`                 | `DateTimePickerOption`                               | -            | Controlled selected option (single mode)                                              |
| `defaultValue`          | `DateTimePickerOption`                               | -            | Uncontrolled initial selected option                                                  |
| `onValueChange`         | `(value: DateTimePickerOption \| undefined) => void` | -            | Called when the selected option changes                                               |
| `isOpen`                | `boolean`                                            | -            | Controlled open state of the select surface                                           |
| `isDefaultOpen`         | `boolean`                                            | -            | Uncontrolled initial open state                                                       |
| `onOpenChange`          | `(open: boolean) => void`                            | -            | Called when the open state changes                                                    |
| `minValue`              | `CalendarDate`                                       | `today`      | Inclusive lower bound of the date column, forwarded to the wheel                      |
| `maxValue`              | `CalendarDate`                                       | `today + 1y` | Inclusive upper bound of the date column, forwarded to the wheel                      |
| `hourFormat`            | `WheelDateTimePickerHourFormat`                      | `12`         | Hour display mode, used for the wheel and label formatting                            |
| `minuteInterval`        | `number`                                             | `1`          | Step between consecutive minute options, forwarded to the wheel                       |
| `dateTimeDisplayFormat` | `DateTimePickerDisplayFormat`                        | `short`      | Preset used to build the trigger label. Ignored when `formatDateTime` is set          |
| `locale`                | `string`                                             | `en-US`      | BCP 47 locale for label formatting and the wheel's localized date / AM/PM labels      |
| `formatDate`            | `WheelDateTimePickerFormatDate`                      | -            | Overrides the wheel's date column label formatting                                    |
| `formatDateTime`        | `(value: CalendarDateTime) => string`                | -            | Overrides `dateTimeDisplayFormat`, `hourFormat`, and `locale` for the committed label |
| `...ViewProps`          | `ViewProps`                                          | -            | All standard React Native View props are supported                                    |

#### DateTimePickerDisplayFormat

Built-in date-time label styles.

- `"short"`: month / day / year + hour and minute (e.g. `"Jun 1, 2026, 2:30 PM"`).
- `"medium"`: includes the weekday and seconds (e.g. `"Mon, Jun 1, 2026, 2:30:00 PM"`).

#### DateTimePickerOption

Single date-time option (same shape as single-mode `Select` value).

| prop    | type     | description                                         |
| ------- | -------- | --------------------------------------------------- |
| `value` | `string` | ISO date-time string (e.g. `"2026-06-01T14:30:00"`) |
| `label` | `string` | Display text                                        |

### DateTimePicker.Select

Wires `Select` (single mode) to the root state. Same props as `Select` minus the state props (`value` / `defaultValue` / `onValueChange` / `isOpen` / `isDefaultOpen` / `onOpenChange` / `selectionMode`).

### DateTimePicker.Portal

Portals content and re-provides `DateTimePicker` context. Same props as `Select.Portal`.

### DateTimePicker.Overlay

Backdrop behind portaled content. Same props as `Select.Overlay`.

### DateTimePicker.Content

Presentation surface. Same props as `Select.Content`, minus the dialog `isSwipeable` prop (`DateTimePicker` always disables dialog swipe-to-dismiss).

### DateTimePicker.Trigger

Trigger surface with invalid border styling. Extends `Select.Trigger` (minus `variant`).

| prop        | type      | default | description                                                                        |
| ----------- | --------- | ------- | ---------------------------------------------------------------------------------- |
| `isInvalid` | `boolean` | -       | When `true`, applies a 1.5px danger border. When omitted, uses `FormField` context |

### DateTimePicker.Value

Selected label / placeholder. Extends `Select.Value`.

| prop          | type     | default                  | description                         |
| ------------- | -------- | ------------------------ | ----------------------------------- |
| `placeholder` | `string` | `"Choose a date & time"` | Shown when no date-time is selected |

### DateTimePicker.TriggerIndicator

Trailing calendar icon (default). Same props as `Select.TriggerIndicator`.

### DateTimePicker.Wheel

Wheel date-time selector wired to commit on scroll. Same props as `WheelDateTimePicker` minus the value props (`value` / `defaultValue` / `onValueChange`), which are wired from `DateTimePicker` context. Each scroll updates the selected option live while the surface stays open.

### DateTimePicker.WheelDate / WheelHour / WheelMinute / WheelPeriod / WheelIndicator / WheelMask

Column and overlay parts aliasing the matching `WheelDateTimePicker` parts. Use them to customize column order, content, and styling inside `DateTimePicker.Wheel`.
