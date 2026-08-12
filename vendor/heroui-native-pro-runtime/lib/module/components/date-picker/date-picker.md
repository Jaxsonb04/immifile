# DatePicker

A single-date picker that combines a trigger field with a calendar popup for selecting dates.

> `DatePicker` uses [`@internationalized/date`](https://react-aria.adobe.com/internationalized/date/) for all date manipulations (`CalendarDate`, calendar systems, time zones, locale-aware formatting). For full context on the date types and helpers exposed through this component's props and callbacks, read the [`@internationalized/date` docs](https://react-aria.adobe.com/internationalized/date/) alongside this page.

## Import

```tsx
import { DatePicker } from 'heroui-native-pro';
```

## Anatomy

```tsx
<DatePicker>
  <Label>...</Label>
  <DatePicker.Select>
    <DatePicker.Trigger>
      <DatePicker.Value />
      <DatePicker.TriggerIndicator />
    </DatePicker.Trigger>
    <DatePicker.Portal>
      <DatePicker.Overlay />
      <DatePicker.Content>
        <DatePicker.Calendar>
          <Calendar.Header>...</Calendar.Header>
          <Calendar.Grid>...</Calendar.Grid>
        </DatePicker.Calendar>
      </DatePicker.Content>
    </DatePicker.Portal>
  </DatePicker.Select>
  <Description>...</Description>
</DatePicker>
```

- **DatePicker**: Root container that manages date selection state, open state, display formatting, and form field context (for Label, Description, FieldError). Supports controlled and uncontrolled modes.
- **DatePicker.Select**: Pre-wired Select root connected to the DatePicker context. State props (`value`, `isOpen`, `onValueChange`, `onOpenChange`) are managed by the root.
- **DatePicker.Trigger**: Pressable trigger button that opens the calendar overlay. Inherits invalid border styling from the root.
- **DatePicker.Value**: Text display for the selected date label. Shows a placeholder when no date is selected.
- **DatePicker.TriggerIndicator**: Indicator icon inside the trigger. Defaults to a calendar icon instead of a chevron.
- **DatePicker.Portal**: Portal wrapper that re-provides DatePicker context across the portal boundary.
- **DatePicker.Overlay**: Backdrop overlay behind the calendar content.
- **DatePicker.Content**: Content container for the calendar popup. Supports `"popover"`, `"dialog"`, and `"bottom-sheet"` presentations.
- **DatePicker.Calendar**: Pre-wired Calendar root that commits the selected date, updates the trigger label, and closes the overlay on selection. Uses `Calendar` compound parts as children.

## Usage

### Basic Usage

The DatePicker uses a popover presentation by default. Pass `Calendar` compound parts as children of `DatePicker.Calendar`.

```tsx
<DatePicker>
  <Label>Event date</Label>
  <DatePicker.Select>
    <DatePicker.Trigger>
      <DatePicker.Value />
      <DatePicker.TriggerIndicator />
    </DatePicker.Trigger>
    <DatePicker.Portal>
      <DatePicker.Overlay />
      <DatePicker.Content presentation="popover" width="trigger">
        <DatePicker.Calendar>
          <Calendar.Header>
            <Calendar.Heading />
            <Calendar.NavButton slot="previous" />
            <Calendar.NavButton slot="next" />
          </Calendar.Header>
          <Calendar.Grid>
            <Calendar.GridHeader>
              {(day) => <Calendar.HeaderCell day={day} />}
            </Calendar.GridHeader>
            <Calendar.GridBody>
              {(date) => <Calendar.Cell date={date} />}
            </Calendar.GridBody>
          </Calendar.Grid>
        </DatePicker.Calendar>
      </DatePicker.Content>
    </DatePicker.Portal>
  </DatePicker.Select>
</DatePicker>
```

### Controlled

Control the selected date externally with `value` and `onValueChange`. The option stores an ISO date string in `value` and a display label shown in the trigger. You can also control the calendar overlay with `isOpen` and `onOpenChange`.

```tsx
import type { DatePickerOption } from 'heroui-native-pro';
import { useState } from 'react';

const [selected, setSelected] = useState<DatePickerOption | undefined>({
  value: '2026-06-15',
  label: 'Jun 15, 2026',
});
const [isOpen, setIsOpen] = useState(false);

<DatePicker
  value={selected}
  onValueChange={setSelected}
  isOpen={isOpen}
  onOpenChange={setIsOpen}
>
  <Label>Event date</Label>
  <DatePicker.Select>
    <DatePicker.Trigger>
      <DatePicker.Value />
      <DatePicker.TriggerIndicator />
    </DatePicker.Trigger>
    <DatePicker.Portal>
      <DatePicker.Overlay />
      <DatePicker.Content presentation="popover" width="trigger">
        <DatePicker.Calendar>
          <Calendar.Header>
            <Calendar.Heading />
            <Calendar.NavButton slot="previous" />
            <Calendar.NavButton slot="next" />
          </Calendar.Header>
          <Calendar.Grid>
            <Calendar.GridHeader>
              {(day) => <Calendar.HeaderCell day={day} />}
            </Calendar.GridHeader>
            <Calendar.GridBody>
              {(date) => <Calendar.Cell date={date} />}
            </Calendar.GridBody>
          </Calendar.Grid>
        </DatePicker.Calendar>
      </DatePicker.Content>
    </DatePicker.Portal>
  </DatePicker.Select>
</DatePicker>;
```

### Dialog Presentation

Display the calendar in a centered modal dialog.

```tsx
<DatePicker>
  <Label>Event date</Label>
  <DatePicker.Select presentation="dialog">
    <DatePicker.Trigger>
      <DatePicker.Value />
      <DatePicker.TriggerIndicator />
    </DatePicker.Trigger>
    <DatePicker.Portal>
      <DatePicker.Overlay />
      <DatePicker.Content presentation="dialog">
        <DatePicker.Calendar>...</DatePicker.Calendar>
      </DatePicker.Content>
    </DatePicker.Portal>
  </DatePicker.Select>
</DatePicker>
```

### Bottom Sheet Presentation

Display the calendar in a bottom sheet.

```tsx
<DatePicker>
  <Label>Event date</Label>
  <DatePicker.Select presentation="bottom-sheet">
    <DatePicker.Trigger>
      <DatePicker.Value />
      <DatePicker.TriggerIndicator />
    </DatePicker.Trigger>
    <DatePicker.Portal>
      <DatePicker.Overlay />
      <DatePicker.Content presentation="bottom-sheet">
        <DatePicker.Calendar>...</DatePicker.Calendar>
      </DatePicker.Content>
    </DatePicker.Portal>
  </DatePicker.Select>
</DatePicker>
```

### Display Format

Configure how the selected date is displayed in the trigger using `dateDisplayFormat`.

```tsx
<DatePicker dateDisplayFormat="short">
  <Label>Short format</Label>
  <DatePicker.Select>
    <DatePicker.Trigger>
      <DatePicker.Value />
      <DatePicker.TriggerIndicator />
    </DatePicker.Trigger>
    <DatePicker.Portal>
      <DatePicker.Overlay />
      <DatePicker.Content presentation="popover" width="trigger">
        <DatePicker.Calendar>...</DatePicker.Calendar>
      </DatePicker.Content>
    </DatePicker.Portal>
  </DatePicker.Select>
</DatePicker>
```

### Custom Format Function

Override the display label entirely with `formatDate`.

```tsx
function formatSpanishDate(date: CalendarDate): string {
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date.toDate(getLocalTimeZone()));
}

<DatePicker formatDate={formatSpanishDate} locale="es-ES">
  <Label>Custom format</Label>
  <DatePicker.Select>
    <DatePicker.Trigger>
      <DatePicker.Value />
      <DatePicker.TriggerIndicator />
    </DatePicker.Trigger>
    <DatePicker.Portal>
      <DatePicker.Overlay />
      <DatePicker.Content presentation="popover" width="trigger">
        <DatePicker.Calendar>...</DatePicker.Calendar>
      </DatePicker.Content>
    </DatePicker.Portal>
  </DatePicker.Select>
</DatePicker>;
```

### Field States

Use root props for required, invalid, and disabled states.

```tsx
<DatePicker isRequired>
  <Label>Deadline</Label>
  <DatePicker.Select>
    <DatePicker.Trigger>
      <DatePicker.Value placeholder="Select a deadline" />
      <DatePicker.TriggerIndicator />
    </DatePicker.Trigger>
    <DatePicker.Portal>
      <DatePicker.Overlay />
      <DatePicker.Content presentation="popover" width="trigger">
        <DatePicker.Calendar>...</DatePicker.Calendar>
      </DatePicker.Content>
    </DatePicker.Portal>
  </DatePicker.Select>
  <Description>Required for the project timeline.</Description>
</DatePicker>
```

### Invalid State with FieldError

Combine `isInvalid` with FieldError to display validation messages. The trigger shows a danger border.

```tsx
<DatePicker isInvalid>
  <Label>Ship date</Label>
  <DatePicker.Select>
    <DatePicker.Trigger>
      <DatePicker.Value />
      <DatePicker.TriggerIndicator />
    </DatePicker.Trigger>
    <DatePicker.Portal>
      <DatePicker.Overlay />
      <DatePicker.Content presentation="popover" width="trigger">
        <DatePicker.Calendar>...</DatePicker.Calendar>
      </DatePicker.Content>
    </DatePicker.Portal>
  </DatePicker.Select>
  <Description hideOnInvalid>Must be a business day.</Description>
  <FieldError>Please select a valid ship date.</FieldError>
</DatePicker>
```

### With Year Picker

Use `Calendar.YearPickerTrigger` inside `DatePicker.Calendar` to add a year picker overlay.

```tsx
<DatePicker.Calendar>
  <Calendar.Header>
    <Calendar.YearPickerTrigger>
      <Calendar.YearPickerTriggerHeading />
      <Calendar.YearPickerTriggerIndicator />
    </Calendar.YearPickerTrigger>
    <Calendar.NavButton slot="previous" />
    <Calendar.NavButton slot="next" />
  </Calendar.Header>
  <Calendar.Grid>
    <Calendar.GridHeader>
      {(day) => <Calendar.HeaderCell day={day} />}
    </Calendar.GridHeader>
    <Calendar.GridBody>
      {(date) => <Calendar.Cell date={date} />}
    </Calendar.GridBody>
  </Calendar.Grid>
  <Calendar.YearPickerGrid>
    <Calendar.YearPickerGridBody>
      {({ year, isSelected }) => (
        <Calendar.YearPickerCell year={year} isSelected={isSelected} />
      )}
    </Calendar.YearPickerGridBody>
  </Calendar.YearPickerGrid>
</DatePicker.Calendar>
```

## Example

```tsx
import type { CalendarDate } from '@internationalized/date';
import { getLocalTimeZone } from '@internationalized/date';
import { Description, FieldError, Label } from 'heroui-native';
import { Calendar, DatePicker } from 'heroui-native-pro';
import { View } from 'react-native';

function formatSpanishDate(date: CalendarDate): string {
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date.toDate(getLocalTimeZone()));
}

export default function DatePickerExample() {
  return (
    <View className="flex-1 justify-center px-5 gap-12">
      <DatePicker formatDate={formatSpanishDate} locale="es-ES">
        <Label>Fecha del evento</Label>
        <DatePicker.Select>
          <DatePicker.Trigger>
            <DatePicker.Value />
            <DatePicker.TriggerIndicator />
          </DatePicker.Trigger>
          <DatePicker.Portal>
            <DatePicker.Overlay />
            <DatePicker.Content presentation="popover" width="trigger">
              <DatePicker.Calendar>
                <Calendar.Header>
                  <Calendar.YearPickerTrigger>
                    <Calendar.YearPickerTriggerHeading />
                    <Calendar.YearPickerTriggerIndicator />
                  </Calendar.YearPickerTrigger>
                  <Calendar.NavButton slot="previous" />
                  <Calendar.NavButton slot="next" />
                </Calendar.Header>
                <Calendar.Grid>
                  <Calendar.GridHeader>
                    {(day) => <Calendar.HeaderCell day={day} />}
                  </Calendar.GridHeader>
                  <Calendar.GridBody>
                    {(date) => <Calendar.Cell date={date} />}
                  </Calendar.GridBody>
                </Calendar.Grid>
                <Calendar.YearPickerGrid>
                  <Calendar.YearPickerGridBody>
                    {({ year, isSelected }) => (
                      <Calendar.YearPickerCell
                        year={year}
                        isSelected={isSelected}
                      />
                    )}
                  </Calendar.YearPickerGridBody>
                </Calendar.YearPickerGrid>
              </DatePicker.Calendar>
            </DatePicker.Content>
          </DatePicker.Portal>
        </DatePicker.Select>
      </DatePicker>

      <DatePicker isInvalid>
        <Label>Ship date</Label>
        <DatePicker.Select>
          <DatePicker.Trigger>
            <DatePicker.Value />
            <DatePicker.TriggerIndicator />
          </DatePicker.Trigger>
          <DatePicker.Portal>
            <DatePicker.Overlay />
            <DatePicker.Content presentation="popover" width="trigger">
              <DatePicker.Calendar>
                <Calendar.Header>
                  <Calendar.Heading />
                  <Calendar.NavButton slot="previous" />
                  <Calendar.NavButton slot="next" />
                </Calendar.Header>
                <Calendar.Grid>
                  <Calendar.GridHeader>
                    {(day) => <Calendar.HeaderCell day={day} />}
                  </Calendar.GridHeader>
                  <Calendar.GridBody>
                    {(date) => <Calendar.Cell date={date} />}
                  </Calendar.GridBody>
                </Calendar.Grid>
              </DatePicker.Calendar>
            </DatePicker.Content>
          </DatePicker.Portal>
        </DatePicker.Select>
        <Description hideOnInvalid>Must be a business day.</Description>
        <FieldError>Please select a valid ship date.</FieldError>
      </DatePicker>
    </View>
  );
}
```

## API Reference

### DatePicker

| prop                | type                                             | default    | description                                                                 |
| ------------------- | ------------------------------------------------ | ---------- | --------------------------------------------------------------------------- |
| `children`          | `React.ReactNode`                                | -          | Children elements (Label, DatePicker.Select, Description, FieldError)       |
| `value`             | `DatePickerOption`                               | -          | Controlled selected option                                                  |
| `defaultValue`      | `DatePickerOption`                               | -          | Default selected option for uncontrolled usage                              |
| `isDisabled`        | `boolean`                                        | `false`    | Whether the entire field is disabled                                        |
| `isInvalid`         | `boolean`                                        | `false`    | Whether the field is in an invalid state                                    |
| `isRequired`        | `boolean`                                        | `false`    | Whether the field is required                                               |
| `isOpen`            | `boolean`                                        | -          | Controlled open state of the calendar overlay                               |
| `isDefaultOpen`     | `boolean`                                        | -          | Initial open state for uncontrolled usage                                   |
| `dateDisplayFormat` | `DatePickerDateDisplayFormat`                    | `'medium'` | Preset date label format; ignored when `formatDate` is set                  |
| `locale`            | `string`                                         | -          | BCP 47 locale for label formatting and calendar grid                        |
| `formatDate`        | `(date: CalendarDate) => string`                 | -          | Custom formatter that overrides `dateDisplayFormat` and `locale` for labels |
| `className`         | `string`                                         | -          | Additional CSS classes for the root container                               |
| `animation`         | `AnimationRootDisableAll`                        | -          | Animation configuration for the date picker subtree                         |
| `onValueChange`     | `(value: DatePickerOption \| undefined) => void` | -          | Handler called when the selected option changes                             |
| `onOpenChange`      | `(open: boolean) => void`                        | -          | Handler called when the open state changes                                  |
| `...ViewProps`      | `ViewProps`                                      | -          | All standard React Native View props are supported                          |

#### DatePickerOption

| property | type     | description                                                 |
| -------- | -------- | ----------------------------------------------------------- |
| `value`  | `string` | ISO date string (e.g. `"2026-06-15"`)                       |
| `label`  | `string` | Display string shown in the trigger (e.g. `"Jun 15, 2026"`) |

#### DatePickerDateDisplayFormat

Built-in date label presets (maps to `Intl.DateTimeFormat` `dateStyle`):

- `'short'` — e.g. `"6/15/26"`
- `'medium'` — e.g. `"Jun 15, 2026"` (default)
- `'long'` — e.g. `"June 15, 2026"`
- `'full'` — e.g. `"Monday, June 15, 2026"`

#### AnimationRootDisableAll

Animation configuration for the DatePicker root. Can be:

- `"disable-all"`: Disable all animations including children (cascades down)
- `undefined`: Use default animations

### DatePicker.Select

| prop           | type                                      | default     | description                                        |
| -------------- | ----------------------------------------- | ----------- | -------------------------------------------------- |
| `children`     | `React.ReactNode`                         | -           | Select content (Trigger, Portal)                   |
| `isDisabled`   | `boolean`                                 | -           | Overrides the root `isDisabled` when set           |
| `presentation` | `'popover' \| 'dialog' \| 'bottom-sheet'` | `'popover'` | Presentation mode for the select content           |
| `className`    | `string`                                  | -           | Additional CSS classes                             |
| `...ViewProps` | `ViewProps`                               | -           | All standard React Native View props are supported |

### DatePicker.Trigger

| prop                | type              | default | description                                                           |
| ------------------- | ----------------- | ------- | --------------------------------------------------------------------- |
| `children`          | `React.ReactNode` | -       | Trigger content (Value, TriggerIndicator)                             |
| `isDisabled`        | `boolean`         | -       | Whether the trigger is disabled                                       |
| `isInvalid`         | `boolean`         | -       | When `true`, applies a danger border; inherits from root when omitted |
| `className`         | `string`          | -       | Additional CSS classes for the trigger                                |
| `...PressableProps` | `PressableProps`  | -       | All standard React Native Pressable props are supported               |

### DatePicker.Value

| prop           | type        | default           | description                                        |
| -------------- | ----------- | ----------------- | -------------------------------------------------- |
| `placeholder`  | `string`    | `'Choose a date'` | Text shown when no date is selected                |
| `className`    | `string`    | -                 | Additional CSS classes for the value text          |
| `...TextProps` | `TextProps` | -                 | All standard React Native Text props are supported |

### DatePicker.TriggerIndicator

| prop                    | type                              | default | description                                                             |
| ----------------------- | --------------------------------- | ------- | ----------------------------------------------------------------------- |
| `children`              | `React.ReactNode`                 | -       | Custom indicator content; defaults to a calendar icon when omitted      |
| `iconProps`             | `SelectTriggerIndicatorIconProps` | -       | Overrides for the default icon                                          |
| `isAnimatedStyleActive` | `boolean`                         | `false` | Whether animated rotation styles are applied                            |
| `className`             | `string`                          | -       | Additional CSS classes for the indicator container                      |
| `animation`             | `SelectTriggerIndicatorAnimation` | `false` | Rotation animation configuration; disabled by default for calendar icon |
| `...ViewProps`          | `ViewProps`                       | -       | All standard React Native View props are supported                      |

#### SelectTriggerIndicatorIconProps

| prop    | type     | default | description                 |
| ------- | -------- | ------- | --------------------------- |
| `size`  | `number` | `16`    | Icon size in logical pixels |
| `color` | `string` | `muted` | Icon fill color             |

### DatePicker.Portal

| prop                                         | type              | default | description                                                              |
| -------------------------------------------- | ----------------- | ------- | ------------------------------------------------------------------------ |
| `children`                                   | `React.ReactNode` | -       | Portal content (Overlay, Content)                                        |
| `hostName`                                   | `string`          | -       | Optional name of the host element for the portal                         |
| `disableFullWindowOverlay`                   | `boolean`         | `false` | Use a regular View instead of FullWindowOverlay on iOS                   |
| `unstable_accessibilityContainerViewIsModal` | `boolean`         | `false` | Controls whether VoiceOver treats the overlay as a modal container (iOS) |
| `className`                                  | `string`          | -       | Additional CSS classes for the portal container                          |

### DatePicker.Overlay

| prop                    | type                     | default | description                                             |
| ----------------------- | ------------------------ | ------- | ------------------------------------------------------- |
| `closeOnPress`          | `boolean`                | `true`  | Whether to close the picker when the overlay is pressed |
| `isAnimatedStyleActive` | `boolean`                | `true`  | Whether animated opacity styles are applied             |
| `className`             | `string`                 | -       | Additional CSS classes for the overlay backdrop         |
| `animation`             | `SelectOverlayAnimation` | -       | Opacity animation configuration                         |
| `...PressableProps`     | `PressableProps`         | -       | All standard React Native Pressable props are supported |

### DatePicker.Content

The content component is a union type based on the `presentation` prop.

#### Popover presentation

| prop           | type                                             | default         | description                                           |
| -------------- | ------------------------------------------------ | --------------- | ----------------------------------------------------- |
| `children`     | `React.ReactNode`                                | -               | Content (DatePicker.Calendar)                         |
| `presentation` | `'popover'`                                      | -               | Popover presentation mode                             |
| `width`        | `'content-fit' \| 'trigger' \| 'full' \| number` | `'content-fit'` | Content width sizing strategy                         |
| `className`    | `string`                                         | -               | Additional CSS classes for the content container      |
| `animation`    | `SelectContentPopoverAnimation`                  | -               | Keyframe animation configuration for entering/exiting |
| `...ViewProps` | `ViewProps`                                      | -               | All standard React Native View props are supported    |

#### Dialog presentation

| prop           | type                     | default | description                                        |
| -------------- | ------------------------ | ------- | -------------------------------------------------- |
| `children`     | `React.ReactNode`        | -       | Content (DatePicker.Calendar)                      |
| `presentation` | `'dialog'`               | -       | Dialog presentation mode                           |
| `isSwipeable`  | `boolean`                | `true`  | Whether the dialog can be swiped to dismiss        |
| `className`    | `string`                 | -       | Additional CSS classes for the content container   |
| `animation`    | `SelectContentAnimation` | -       | Keyframe animation configuration for scale/opacity |
| `...ViewProps` | `ViewProps`              | -       | All standard React Native View props are supported |

#### Bottom sheet presentation

| prop                  | type               | default | description                                  |
| --------------------- | ------------------ | ------- | -------------------------------------------- |
| `children`            | `React.ReactNode`  | -       | Content (DatePicker.Calendar)                |
| `presentation`        | `'bottom-sheet'`   | -       | Bottom sheet presentation mode               |
| `...BottomSheetProps` | `BottomSheetProps` | -       | All @gorhom/bottom-sheet props are supported |

### DatePicker.Calendar

| prop                 | type                        | default         | description                                                      |
| -------------------- | --------------------------- | --------------- | ---------------------------------------------------------------- |
| `children`           | `React.ReactNode`           | -               | Calendar compound parts (Calendar.Header, Calendar.Grid, etc.)   |
| `value`              | `DateValue \| null`         | -               | Overrides the calendar value derived from the root selection     |
| `locale`             | `string`                    | -               | Overrides the root locale for the calendar grid                  |
| `accessibilityLabel` | `string`                    | `'Pick a date'` | Screen reader label for the calendar container                   |
| `onChange`           | `(date: DateValue) => void` | -               | Side-effect handler called before the default commit behavior    |
| `...CalendarProps`   | `CalendarProps`             | -               | All Calendar root props are supported (minValue, maxValue, etc.) |

## Hooks

### useDatePicker

Hook to access the DatePicker context. Must be used within a `DatePicker` component.

```tsx
import { useDatePicker } from 'heroui-native-pro';

const { value, commitDate, isOpen, formatLabel } = useDatePicker();
```

#### Returns: DatePickerContextValue

| property         | type                                            | description                                                              |
| ---------------- | ----------------------------------------------- | ------------------------------------------------------------------------ |
| `value`          | `DatePickerOption \| undefined`                 | Current select option (ISO string + display label)                       |
| `onValueChange`  | `(next: DatePickerOption \| undefined) => void` | Update the selected option                                               |
| `isOpen`         | `boolean`                                       | Whether the calendar overlay is open                                     |
| `onOpenChange`   | `(open: boolean) => void`                       | Update the open state                                                    |
| `commitDate`     | `(date: CalendarDate) => void`                  | Commit a date: updates the option, formats the label, closes the overlay |
| `formatLabel`    | `(date: CalendarDate) => string`                | Format a date using root `dateDisplayFormat` / `locale` / `formatDate`   |
| `isDisabledRoot` | `boolean`                                       | Whether the root is disabled                                             |
| `locale`         | `string \| undefined`                           | Root locale forwarded to `DatePicker.Calendar`                           |
