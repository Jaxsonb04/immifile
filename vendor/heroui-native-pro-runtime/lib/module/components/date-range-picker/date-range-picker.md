# DateRangePicker

A date range picker that combines a trigger field with a range calendar popup for selecting start and end dates.

> `DateRangePicker` uses [`@internationalized/date`](https://react-aria.adobe.com/internationalized/date/) for all date manipulations (`CalendarDate`, calendar systems, time zones, locale-aware formatting). For full context on the date types and helpers exposed through this component's props and callbacks, read the [`@internationalized/date` docs](https://react-aria.adobe.com/internationalized/date/) alongside this page.

## Import

```tsx
import { DateRangePicker } from 'heroui-native-pro';
```

## Anatomy

```tsx
<DateRangePicker>
  <Label>...</Label>
  <DateRangePicker.Select>
    <DateRangePicker.Trigger>
      <DateRangePicker.Value />
      <DateRangePicker.TriggerIndicator />
    </DateRangePicker.Trigger>
    <DateRangePicker.Portal>
      <DateRangePicker.Overlay />
      <DateRangePicker.Content>
        <DateRangePicker.Calendar>
          <RangeCalendar.Header>...</RangeCalendar.Header>
          <RangeCalendar.Grid>...</RangeCalendar.Grid>
        </DateRangePicker.Calendar>
      </DateRangePicker.Content>
    </DateRangePicker.Portal>
  </DateRangePicker.Select>
  <Description>...</Description>
</DateRangePicker>
```

- **DateRangePicker**: Root container that manages date range selection state, open state, display formatting, and form field context (for Label, Description, FieldError). Supports controlled and uncontrolled modes.
- **DateRangePicker.Select**: Pre-wired Select root connected to the DateRangePicker context. State props (`value`, `isOpen`, `onValueChange`, `onOpenChange`) are managed by the root.
- **DateRangePicker.Trigger**: Pressable trigger button that opens the calendar overlay. Inherits invalid border styling from the root.
- **DateRangePicker.Value**: Text display for the selected range label. Shows a placeholder when no range is selected.
- **DateRangePicker.TriggerIndicator**: Indicator icon inside the trigger. Defaults to a calendar icon instead of a chevron.
- **DateRangePicker.Portal**: Portal wrapper that re-provides DateRangePicker context across the portal boundary.
- **DateRangePicker.Overlay**: Backdrop overlay behind the calendar content.
- **DateRangePicker.Content**: Content container for the calendar popup. Supports `"popover"`, `"dialog"`, and `"bottom-sheet"` presentations.
- **DateRangePicker.Calendar**: Pre-wired RangeCalendar root that commits a completed range, updates the trigger label, and closes the overlay after selection. Two taps are required to complete a range (start, then end). Uses `RangeCalendar` compound parts as children.

## Usage

### Basic Usage

The DateRangePicker uses a popover presentation by default. Pass `RangeCalendar` compound parts as children of `DateRangePicker.Calendar`.

```tsx
<DateRangePicker>
  <Label>Trip dates</Label>
  <DateRangePicker.Select>
    <DateRangePicker.Trigger>
      <DateRangePicker.Value />
      <DateRangePicker.TriggerIndicator />
    </DateRangePicker.Trigger>
    <DateRangePicker.Portal>
      <DateRangePicker.Overlay />
      <DateRangePicker.Content presentation="popover" width="trigger">
        <DateRangePicker.Calendar>
          <RangeCalendar.Header>
            <RangeCalendar.Heading />
            <RangeCalendar.NavButton slot="previous" />
            <RangeCalendar.NavButton slot="next" />
          </RangeCalendar.Header>
          <RangeCalendar.Grid>
            <RangeCalendar.GridHeader>
              {(day) => <RangeCalendar.HeaderCell day={day} />}
            </RangeCalendar.GridHeader>
            <RangeCalendar.GridBody>
              {(date) => <RangeCalendar.Cell date={date} />}
            </RangeCalendar.GridBody>
          </RangeCalendar.Grid>
        </DateRangePicker.Calendar>
      </DateRangePicker.Content>
    </DateRangePicker.Portal>
  </DateRangePicker.Select>
</DateRangePicker>
```

### Controlled

Control the selected range externally with `value` and `onValueChange`. The option stores a JSON string with ISO start/end dates in `value` and a display label shown in the trigger. You can also control the calendar overlay with `isOpen` and `onOpenChange`.

```tsx
import type { DateRangePickerOption } from 'heroui-native-pro';
import { useState } from 'react';

const [selected, setSelected] = useState<DateRangePickerOption | undefined>({
  value: '{"start":"2026-04-01","end":"2026-04-07"}',
  label: 'Apr 1, 2026 – Apr 7, 2026',
});
const [isOpen, setIsOpen] = useState(false);

<DateRangePicker
  value={selected}
  onValueChange={setSelected}
  isOpen={isOpen}
  onOpenChange={setIsOpen}
>
  <Label>Trip dates</Label>
  <DateRangePicker.Select>
    <DateRangePicker.Trigger>
      <DateRangePicker.Value />
      <DateRangePicker.TriggerIndicator />
    </DateRangePicker.Trigger>
    <DateRangePicker.Portal>
      <DateRangePicker.Overlay />
      <DateRangePicker.Content presentation="popover" width="trigger">
        <DateRangePicker.Calendar>
          <RangeCalendar.Header>
            <RangeCalendar.Heading />
            <RangeCalendar.NavButton slot="previous" />
            <RangeCalendar.NavButton slot="next" />
          </RangeCalendar.Header>
          <RangeCalendar.Grid>
            <RangeCalendar.GridHeader>
              {(day) => <RangeCalendar.HeaderCell day={day} />}
            </RangeCalendar.GridHeader>
            <RangeCalendar.GridBody>
              {(date) => <RangeCalendar.Cell date={date} />}
            </RangeCalendar.GridBody>
          </RangeCalendar.Grid>
        </DateRangePicker.Calendar>
      </DateRangePicker.Content>
    </DateRangePicker.Portal>
  </DateRangePicker.Select>
</DateRangePicker>;
```

### Dialog Presentation

Display the range calendar in a centered modal dialog.

```tsx
<DateRangePicker>
  <Label>Trip dates</Label>
  <DateRangePicker.Select presentation="dialog">
    <DateRangePicker.Trigger>
      <DateRangePicker.Value />
      <DateRangePicker.TriggerIndicator />
    </DateRangePicker.Trigger>
    <DateRangePicker.Portal>
      <DateRangePicker.Overlay />
      <DateRangePicker.Content presentation="dialog">
        <DateRangePicker.Calendar>...</DateRangePicker.Calendar>
      </DateRangePicker.Content>
    </DateRangePicker.Portal>
  </DateRangePicker.Select>
</DateRangePicker>
```

### Bottom Sheet Presentation

Display the range calendar in a bottom sheet.

```tsx
<DateRangePicker>
  <Label>Trip dates</Label>
  <DateRangePicker.Select presentation="bottom-sheet">
    <DateRangePicker.Trigger>
      <DateRangePicker.Value />
      <DateRangePicker.TriggerIndicator />
    </DateRangePicker.Trigger>
    <DateRangePicker.Portal>
      <DateRangePicker.Overlay />
      <DateRangePicker.Content presentation="bottom-sheet">
        <DateRangePicker.Calendar>...</DateRangePicker.Calendar>
      </DateRangePicker.Content>
    </DateRangePicker.Portal>
  </DateRangePicker.Select>
</DateRangePicker>
```

### Display Format

Configure how the selected range is displayed in the trigger using `dateDisplayFormat`.

```tsx
<DateRangePicker dateDisplayFormat="long">
  <Label>Trip dates</Label>
  <DateRangePicker.Select>
    <DateRangePicker.Trigger>
      <DateRangePicker.Value />
      <DateRangePicker.TriggerIndicator />
    </DateRangePicker.Trigger>
    <DateRangePicker.Portal>
      <DateRangePicker.Overlay />
      <DateRangePicker.Content presentation="popover" width="trigger">
        <DateRangePicker.Calendar>...</DateRangePicker.Calendar>
      </DateRangePicker.Content>
    </DateRangePicker.Portal>
  </DateRangePicker.Select>
</DateRangePicker>
```

### Custom Format Function

Override the display label entirely with `formatDateRange`.

```tsx
function formatSpanishRange(start: CalendarDate, end: CalendarDate): string {
  const fmt = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const a = fmt.format(start.toDate(getLocalTimeZone()));
  const b = fmt.format(end.toDate(getLocalTimeZone()));
  if (start.compare(end) === 0) return a;
  return `${a} – ${b}`;
}

<DateRangePicker formatDateRange={formatSpanishRange} locale="es-ES">
  <Label>Custom range label</Label>
  <DateRangePicker.Select>
    <DateRangePicker.Trigger>
      <DateRangePicker.Value />
      <DateRangePicker.TriggerIndicator />
    </DateRangePicker.Trigger>
    <DateRangePicker.Portal>
      <DateRangePicker.Overlay />
      <DateRangePicker.Content presentation="popover" width="trigger">
        <DateRangePicker.Calendar>...</DateRangePicker.Calendar>
      </DateRangePicker.Content>
    </DateRangePicker.Portal>
  </DateRangePicker.Select>
  <Description>Pick a start date, then an end date.</Description>
</DateRangePicker>;
```

### Custom Range Separator

Change the separator between formatted start and end dates in the trigger label.

```tsx
<DateRangePicker rangeSeparator="to">
  <Label>Stay</Label>
  <DateRangePicker.Select>
    <DateRangePicker.Trigger>
      <DateRangePicker.Value />
      <DateRangePicker.TriggerIndicator />
    </DateRangePicker.Trigger>
    <DateRangePicker.Portal>
      <DateRangePicker.Overlay />
      <DateRangePicker.Content presentation="popover" width="trigger">
        <DateRangePicker.Calendar>...</DateRangePicker.Calendar>
      </DateRangePicker.Content>
    </DateRangePicker.Portal>
  </DateRangePicker.Select>
</DateRangePicker>
```

### Field States

Use root props for required, invalid, and disabled states.

```tsx
<DateRangePicker isRequired>
  <Label>Travel dates</Label>
  <DateRangePicker.Select>
    <DateRangePicker.Trigger>
      <DateRangePicker.Value placeholder="Select travel dates" />
      <DateRangePicker.TriggerIndicator />
    </DateRangePicker.Trigger>
    <DateRangePicker.Portal>
      <DateRangePicker.Overlay />
      <DateRangePicker.Content presentation="popover" width="trigger">
        <DateRangePicker.Calendar>...</DateRangePicker.Calendar>
      </DateRangePicker.Content>
    </DateRangePicker.Portal>
  </DateRangePicker.Select>
  <Description>Required for booking confirmation.</Description>
</DateRangePicker>
```

## Example

```tsx
import type { CalendarDate } from '@internationalized/date';
import { getLocalTimeZone } from '@internationalized/date';
import { Description, Label } from 'heroui-native';
import { DateRangePicker, RangeCalendar } from 'heroui-native-pro';
import { View } from 'react-native';

function formatSpanishDateRange(
  start: CalendarDate,
  end: CalendarDate
): string {
  const fmt = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const a = fmt.format(start.toDate(getLocalTimeZone()));
  const b = fmt.format(end.toDate(getLocalTimeZone()));
  if (start.compare(end) === 0) return a;
  return `${a} – ${b}`;
}

export default function DateRangePickerExample() {
  return (
    <View className="flex-1 justify-center px-5 gap-12">
      <DateRangePicker formatDateRange={formatSpanishDateRange} locale="es-ES">
        <Label>Custom range label (es-ES)</Label>
        <DateRangePicker.Select>
          <DateRangePicker.Trigger>
            <DateRangePicker.Value className="text-sm" numberOfLines={1} />
            <DateRangePicker.TriggerIndicator />
          </DateRangePicker.Trigger>
          <DateRangePicker.Portal>
            <DateRangePicker.Overlay />
            <DateRangePicker.Content presentation="popover" width="trigger">
              <DateRangePicker.Calendar>
                <RangeCalendar.Header>
                  <RangeCalendar.Heading />
                  <RangeCalendar.NavButton slot="previous" />
                  <RangeCalendar.NavButton slot="next" />
                </RangeCalendar.Header>
                <RangeCalendar.Grid>
                  <RangeCalendar.GridHeader>
                    {(day) => <RangeCalendar.HeaderCell day={day} />}
                  </RangeCalendar.GridHeader>
                  <RangeCalendar.GridBody>
                    {(date) => <RangeCalendar.Cell date={date} />}
                  </RangeCalendar.GridBody>
                </RangeCalendar.Grid>
              </DateRangePicker.Calendar>
            </DateRangePicker.Content>
          </DateRangePicker.Portal>
        </DateRangePicker.Select>
        <Description>Pick a start date, then an end date.</Description>
      </DateRangePicker>
    </View>
  );
}
```

## API Reference

### DateRangePicker

| prop                | type                                                  | default    | description                                                                                         |
| ------------------- | ----------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------- |
| `children`          | `React.ReactNode`                                     | -          | Children elements (Label, DateRangePicker.Select, Description, FieldError)                          |
| `value`             | `DateRangePickerOption`                               | -          | Controlled selected option                                                                          |
| `defaultValue`      | `DateRangePickerOption`                               | -          | Default selected option for uncontrolled usage                                                      |
| `isDisabled`        | `boolean`                                             | `false`    | Whether the entire field is disabled                                                                |
| `isInvalid`         | `boolean`                                             | `false`    | Whether the field is in an invalid state                                                            |
| `isRequired`        | `boolean`                                             | `false`    | Whether the field is required                                                                       |
| `isOpen`            | `boolean`                                             | -          | Controlled open state of the calendar overlay                                                       |
| `isDefaultOpen`     | `boolean`                                             | -          | Initial open state for uncontrolled usage                                                           |
| `dateDisplayFormat` | `DateRangePickerDateDisplayFormat`                    | `'medium'` | Preset date label format; ignored when `formatDateRange` is set                                     |
| `locale`            | `string`                                              | -          | BCP 47 locale for label formatting and calendar grid                                                |
| `formatDateRange`   | `(start: CalendarDate, end: CalendarDate) => string`  | -          | Custom formatter that overrides `dateDisplayFormat` and `locale` for labels                         |
| `rangeSeparator`    | `string`                                              | `'–'`      | Separator between start and end dates when using presets; same-day ranges collapse to a single date |
| `className`         | `string`                                              | -          | Additional CSS classes for the root container                                                       |
| `animation`         | `AnimationRootDisableAll`                             | -          | Animation configuration for the date range picker subtree                                           |
| `onValueChange`     | `(value: DateRangePickerOption \| undefined) => void` | -          | Handler called when the selected option changes                                                     |
| `onOpenChange`      | `(open: boolean) => void`                             | -          | Handler called when the open state changes                                                          |
| `...ViewProps`      | `ViewProps`                                           | -          | All standard React Native View props are supported                                                  |

#### DateRangePickerOption

| property | type     | description                                                                                 |
| -------- | -------- | ------------------------------------------------------------------------------------------- |
| `value`  | `string` | JSON string encoding start/end ISO dates (e.g. `{"start":"2026-04-01","end":"2026-04-07"}`) |
| `label`  | `string` | Display string shown in the trigger (e.g. `"Apr 1, 2026 – Apr 7, 2026"`)                    |

#### DateRangePickerDateDisplayFormat

Built-in date label presets (maps to `Intl.DateTimeFormat` `dateStyle`):

- `'short'` — e.g. `"4/1/26 – 4/7/26"`
- `'medium'` — e.g. `"Apr 1, 2026 – Apr 7, 2026"` (default)
- `'long'` — e.g. `"April 1, 2026 – April 7, 2026"`
- `'full'` — e.g. `"Wednesday, April 1, 2026 – Tuesday, April 7, 2026"`

#### AnimationRootDisableAll

Animation configuration for the DateRangePicker root. Can be:

- `"disable-all"`: Disable all animations including children (cascades down)
- `undefined`: Use default animations

### DateRangePicker.Select

| prop           | type                                      | default     | description                                        |
| -------------- | ----------------------------------------- | ----------- | -------------------------------------------------- |
| `children`     | `React.ReactNode`                         | -           | Select content (Trigger, Portal)                   |
| `isDisabled`   | `boolean`                                 | -           | Overrides the root `isDisabled` when set           |
| `presentation` | `'popover' \| 'dialog' \| 'bottom-sheet'` | `'popover'` | Presentation mode for the select content           |
| `className`    | `string`                                  | -           | Additional CSS classes                             |
| `...ViewProps` | `ViewProps`                               | -           | All standard React Native View props are supported |

### DateRangePicker.Trigger

| prop                | type              | default | description                                                           |
| ------------------- | ----------------- | ------- | --------------------------------------------------------------------- |
| `children`          | `React.ReactNode` | -       | Trigger content (Value, TriggerIndicator)                             |
| `isDisabled`        | `boolean`         | -       | Whether the trigger is disabled                                       |
| `isInvalid`         | `boolean`         | -       | When `true`, applies a danger border; inherits from root when omitted |
| `className`         | `string`          | -       | Additional CSS classes for the trigger                                |
| `...PressableProps` | `PressableProps`  | -       | All standard React Native Pressable props are supported               |

### DateRangePicker.Value

| prop           | type        | default                 | description                                        |
| -------------- | ----------- | ----------------------- | -------------------------------------------------- |
| `placeholder`  | `string`    | `'Choose a date range'` | Text shown when no range is selected               |
| `className`    | `string`    | -                       | Additional CSS classes for the value text          |
| `...TextProps` | `TextProps` | -                       | All standard React Native Text props are supported |

### DateRangePicker.TriggerIndicator

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

### DateRangePicker.Portal

| prop                                         | type              | default | description                                                              |
| -------------------------------------------- | ----------------- | ------- | ------------------------------------------------------------------------ |
| `children`                                   | `React.ReactNode` | -       | Portal content (Overlay, Content)                                        |
| `hostName`                                   | `string`          | -       | Optional name of the host element for the portal                         |
| `disableFullWindowOverlay`                   | `boolean`         | `false` | Use a regular View instead of FullWindowOverlay on iOS                   |
| `unstable_accessibilityContainerViewIsModal` | `boolean`         | `false` | Controls whether VoiceOver treats the overlay as a modal container (iOS) |
| `className`                                  | `string`          | -       | Additional CSS classes for the portal container                          |

### DateRangePicker.Overlay

| prop                    | type                     | default | description                                             |
| ----------------------- | ------------------------ | ------- | ------------------------------------------------------- |
| `closeOnPress`          | `boolean`                | `true`  | Whether to close the picker when the overlay is pressed |
| `isAnimatedStyleActive` | `boolean`                | `true`  | Whether animated opacity styles are applied             |
| `className`             | `string`                 | -       | Additional CSS classes for the overlay backdrop         |
| `animation`             | `SelectOverlayAnimation` | -       | Opacity animation configuration                         |
| `...PressableProps`     | `PressableProps`         | -       | All standard React Native Pressable props are supported |

### DateRangePicker.Content

The content component is a union type based on the `presentation` prop.

#### Popover presentation

| prop           | type                                             | default         | description                                           |
| -------------- | ------------------------------------------------ | --------------- | ----------------------------------------------------- |
| `children`     | `React.ReactNode`                                | -               | Content (DateRangePicker.Calendar)                    |
| `presentation` | `'popover'`                                      | -               | Popover presentation mode                             |
| `width`        | `'content-fit' \| 'trigger' \| 'full' \| number` | `'content-fit'` | Content width sizing strategy                         |
| `className`    | `string`                                         | -               | Additional CSS classes for the content container      |
| `animation`    | `SelectContentPopoverAnimation`                  | -               | Keyframe animation configuration for entering/exiting |
| `...ViewProps` | `ViewProps`                                      | -               | All standard React Native View props are supported    |

#### Dialog presentation

| prop           | type                     | default | description                                        |
| -------------- | ------------------------ | ------- | -------------------------------------------------- |
| `children`     | `React.ReactNode`        | -       | Content (DateRangePicker.Calendar)                 |
| `presentation` | `'dialog'`               | -       | Dialog presentation mode                           |
| `isSwipeable`  | `boolean`                | `true`  | Whether the dialog can be swiped to dismiss        |
| `className`    | `string`                 | -       | Additional CSS classes for the content container   |
| `animation`    | `SelectContentAnimation` | -       | Keyframe animation configuration for scale/opacity |
| `...ViewProps` | `ViewProps`              | -       | All standard React Native View props are supported |

#### Bottom sheet presentation

| prop                  | type               | default | description                                  |
| --------------------- | ------------------ | ------- | -------------------------------------------- |
| `children`            | `React.ReactNode`  | -       | Content (DateRangePicker.Calendar)           |
| `presentation`        | `'bottom-sheet'`   | -       | Bottom sheet presentation mode               |
| `...BottomSheetProps` | `BottomSheetProps` | -       | All @gorhom/bottom-sheet props are supported |

### DateRangePicker.Calendar

| prop                    | type                                             | default               | description                                                                                      |
| ----------------------- | ------------------------------------------------ | --------------------- | ------------------------------------------------------------------------------------------------ |
| `children`              | `React.ReactNode`                                | -                     | RangeCalendar compound parts (RangeCalendar.Header, RangeCalendar.Grid, etc.)                    |
| `value`                 | `RangeValue<DateValue> \| null`                  | -                     | Overrides the calendar value derived from the root selection                                     |
| `locale`                | `string`                                         | -                     | Overrides the root locale for the calendar grid                                                  |
| `accessibilityLabel`    | `string`                                         | `'Pick a date range'` | Screen reader label for the calendar container                                                   |
| `onChange`              | `(value: RangeValue<DateValue> \| null) => void` | -                     | Side-effect handler called for range updates including `null` while restarting selection         |
| `...RangeCalendarProps` | `RangeCalendarProps`                             | -                     | All RangeCalendar root props are supported (minValue, maxValue, allowsNonContiguousRanges, etc.) |

## Hooks

### useDateRangePicker

Hook to access the DateRangePicker context. Must be used within a `DateRangePicker` component.

```tsx
import { useDateRangePicker } from 'heroui-native-pro';

const { value, commitRange, isOpen, formatRangeLabel } = useDateRangePicker();
```

#### Returns: DateRangePickerContextValue

| property           | type                                                 | description                                                                  |
| ------------------ | ---------------------------------------------------- | ---------------------------------------------------------------------------- |
| `value`            | `DateRangePickerOption \| undefined`                 | Current select option (JSON range string + display label)                    |
| `onValueChange`    | `(next: DateRangePickerOption \| undefined) => void` | Update the selected option                                                   |
| `isOpen`           | `boolean`                                            | Whether the calendar overlay is open                                         |
| `onOpenChange`     | `(open: boolean) => void`                            | Update the open state                                                        |
| `commitRange`      | `(range: RangeValue<CalendarDate>) => void`          | Commit a range: updates the option, formats the label, closes the overlay    |
| `formatRangeLabel` | `(start: CalendarDate, end: CalendarDate) => string` | Format a range using root `dateDisplayFormat` / `locale` / `formatDateRange` |
| `isDisabledRoot`   | `boolean`                                            | Whether the root is disabled                                                 |
| `locale`           | `string \| undefined`                                | Root locale forwarded to `DateRangePicker.Calendar`                          |
