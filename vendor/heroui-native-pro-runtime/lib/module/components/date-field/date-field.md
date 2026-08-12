# DateField

A date input field with `dd/mm/yyyy` masking and an optional calendar popup for selecting dates.

> `DateField` uses [`@internationalized/date`](https://react-aria.adobe.com/internationalized/date/) for all date manipulations (`CalendarDate`, calendar systems, time zones, locale-aware formatting). For full context on the date types and helpers exposed through this component's props and callbacks, read the [`@internationalized/date` docs](https://react-aria.adobe.com/internationalized/date/) alongside this page.

## Import

```tsx
import { DateField } from 'heroui-native-pro';
```

## Anatomy

```tsx
<DateField>
  <Label>...</Label>
  <DateField.InputGroup>
    <DateField.Input />
    <DateField.Suffix>
      <DateField.Select>
        <DateField.Trigger>
          <DateField.TriggerIndicator />
        </DateField.Trigger>
        <DateField.Portal>
          <DateField.Overlay />
          <DateField.Content>
            <DateField.Calendar>
              <Calendar.Header>...</Calendar.Header>
              <Calendar.Grid>...</Calendar.Grid>
            </DateField.Calendar>
          </DateField.Content>
        </DateField.Portal>
      </DateField.Select>
    </DateField.Suffix>
  </DateField.InputGroup>
  <Description>...</Description>
</DateField>
```

- **DateField**: Root container that manages date selection state, open state, input masking mode, and form field context (for Label, Description, FieldError). Supports controlled and uncontrolled modes.
- **DateField.InputGroup**: Input group wrapper that contains the text input, prefix, and suffix slots.
- **DateField.Input**: Text input with `dd/mm/yyyy` masked entry. In `"masked"` mode, digits auto-insert `/` separators and blur commits the parsed date. In `"loose"` mode, no masking or parse is applied. Selecting a date in the calendar updates the input text.
- **DateField.Prefix**: Optional leading slot inside the input group.
- **DateField.Suffix**: Trailing slot inside the input group. Typically contains the calendar trigger.
- **DateField.Select**: Pre-wired Select root connected to the DateField context. State props are managed by the root.
- **DateField.Trigger**: Pressable trigger that opens the calendar overlay. Automatically dismisses the keyboard on press.
- **DateField.TriggerIndicator**: Indicator icon inside the trigger. Defaults to a calendar icon with a muted background.
- **DateField.Portal**: Portal wrapper that re-provides DateField context across the portal boundary.
- **DateField.Overlay**: Backdrop overlay behind the calendar content.
- **DateField.Content**: Content container for the calendar popup. Supports `"popover"`, `"dialog"`, and `"bottom-sheet"` presentations.
- **DateField.Calendar**: Pre-wired Calendar root that commits the selected date, updates the input text, and closes the overlay on selection. Uses `Calendar` compound parts as children.

## Usage

### Basic Usage

The DateField uses masked input by default. Digits auto-insert `/` separators toward `dd/mm/yyyy`. Blur commits the parsed date.

```tsx
<DateField>
  <Label>Event date</Label>
  <DateField.InputGroup>
    <DateField.Input />
    <DateField.Suffix>
      <DateField.Select presentation="bottom-sheet">
        <DateField.Trigger>
          <DateField.TriggerIndicator />
        </DateField.Trigger>
        <DateField.Portal>
          <DateField.Overlay />
          <DateField.Content presentation="bottom-sheet">
            <DateField.Calendar>
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
            </DateField.Calendar>
          </DateField.Content>
        </DateField.Portal>
      </DateField.Select>
    </DateField.Suffix>
  </DateField.InputGroup>
  <Description>The field formats as dd/mm/yyyy.</Description>
</DateField>
```

### Controlled

Control the selected date externally with `value` and `onValueChange`. The option stores an ISO date string in `value` and a display label shown in the input. You can also control the calendar overlay with `isOpen` and `onOpenChange`.

```tsx
import type { DateFieldOption } from 'heroui-native-pro';
import { useState } from 'react';

const [selected, setSelected] = useState<DateFieldOption | undefined>({
  value: '2026-06-15',
  label: '15/06/2026',
});
const [isOpen, setIsOpen] = useState(false);

<DateField
  value={selected}
  onValueChange={setSelected}
  isOpen={isOpen}
  onOpenChange={setIsOpen}
>
  <Label>Event date</Label>
  <DateField.InputGroup>
    <DateField.Input />
    <DateField.Suffix>
      <DateField.Select presentation="bottom-sheet">
        <DateField.Trigger>
          <DateField.TriggerIndicator />
        </DateField.Trigger>
        <DateField.Portal>
          <DateField.Overlay />
          <DateField.Content presentation="bottom-sheet">
            <DateField.Calendar>
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
            </DateField.Calendar>
          </DateField.Content>
        </DateField.Portal>
      </DateField.Select>
    </DateField.Suffix>
  </DateField.InputGroup>
</DateField>;
```

### Loose Input Mode

Set `inputMode="loose"` for plain text without masking or blur parsing. The calendar still updates the input when a date is selected.

```tsx
<DateField inputMode="loose">
  <Label>Event date</Label>
  <DateField.InputGroup>
    <DateField.Input />
    <DateField.Suffix>
      <DateField.Select>
        <DateField.Trigger>
          <DateField.TriggerIndicator />
        </DateField.Trigger>
        <DateField.Portal>
          <DateField.Overlay />
          <DateField.Content presentation="popover" width="full">
            <DateField.Calendar>...</DateField.Calendar>
          </DateField.Content>
        </DateField.Portal>
      </DateField.Select>
    </DateField.Suffix>
  </DateField.InputGroup>
</DateField>
```

### Popover Presentation

Display the calendar in a popover anchored to the trigger.

```tsx
<DateField>
  <Label>Ship date</Label>
  <DateField.InputGroup>
    <DateField.Input />
    <DateField.Suffix>
      <DateField.Select>
        <DateField.Trigger>
          <DateField.TriggerIndicator />
        </DateField.Trigger>
        <DateField.Portal>
          <DateField.Overlay />
          <DateField.Content presentation="popover" width="full">
            <DateField.Calendar>...</DateField.Calendar>
          </DateField.Content>
        </DateField.Portal>
      </DateField.Select>
    </DateField.Suffix>
  </DateField.InputGroup>
</DateField>
```

### Dialog Presentation

Display the calendar in a centered modal dialog.

```tsx
<DateField>
  <Label>Return by</Label>
  <DateField.InputGroup>
    <DateField.Input />
    <DateField.Suffix>
      <DateField.Select presentation="dialog">
        <DateField.Trigger>
          <DateField.TriggerIndicator />
        </DateField.Trigger>
        <DateField.Portal>
          <DateField.Overlay />
          <DateField.Content presentation="dialog">
            <DateField.Calendar>...</DateField.Calendar>
          </DateField.Content>
        </DateField.Portal>
      </DateField.Select>
    </DateField.Suffix>
  </DateField.InputGroup>
</DateField>
```

### Field States

Use root props for required, invalid, and disabled states.

```tsx
<DateField isRequired>
  <Label>Ship date</Label>
  <DateField.InputGroup>
    <DateField.Input />
    <DateField.Suffix>
      <DateField.Select>
        <DateField.Trigger>
          <DateField.TriggerIndicator />
        </DateField.Trigger>
        <DateField.Portal>
          <DateField.Overlay />
          <DateField.Content presentation="popover" width="full">
            <DateField.Calendar>...</DateField.Calendar>
          </DateField.Content>
        </DateField.Portal>
      </DateField.Select>
    </DateField.Suffix>
  </DateField.InputGroup>
  <Description>Required for logistics.</Description>
</DateField>
```

### Invalid State with FieldError

Combine `isInvalid` with FieldError to display validation messages.

```tsx
<DateField isInvalid>
  <Label>Return by</Label>
  <DateField.InputGroup>
    <DateField.Input />
    <DateField.Suffix>
      <DateField.Select presentation="dialog">
        <DateField.Trigger>
          <DateField.TriggerIndicator />
        </DateField.Trigger>
        <DateField.Portal>
          <DateField.Overlay />
          <DateField.Content presentation="dialog">
            <DateField.Calendar>...</DateField.Calendar>
          </DateField.Content>
        </DateField.Portal>
      </DateField.Select>
    </DateField.Suffix>
  </DateField.InputGroup>
  <Description hideOnInvalid>Must be a business day.</Description>
  <FieldError>Please enter a valid return date.</FieldError>
</DateField>
```

## Example

```tsx
import { Description, FieldError, Label } from 'heroui-native';
import { Calendar, DateField } from 'heroui-native-pro';
import { View } from 'react-native';

export default function DateFieldExample() {
  return (
    <View className="flex-1 justify-center px-5 gap-12">
      <DateField inputMode="masked">
        <Label>Event date (masked)</Label>
        <DateField.InputGroup>
          <DateField.Input />
          <DateField.Suffix>
            <DateField.Select presentation="bottom-sheet">
              <DateField.Trigger>
                <DateField.TriggerIndicator />
              </DateField.Trigger>
              <DateField.Portal>
                <DateField.Overlay />
                <DateField.Content presentation="bottom-sheet">
                  <DateField.Calendar>
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
                  </DateField.Calendar>
                </DateField.Content>
              </DateField.Portal>
            </DateField.Select>
          </DateField.Suffix>
        </DateField.InputGroup>
        <Description>The field formats as dd/mm/yyyy.</Description>
      </DateField>

      <DateField isInvalid>
        <Label>Return by</Label>
        <DateField.InputGroup>
          <DateField.Input />
          <DateField.Suffix>
            <DateField.Select presentation="dialog">
              <DateField.Trigger>
                <DateField.TriggerIndicator />
              </DateField.Trigger>
              <DateField.Portal>
                <DateField.Overlay />
                <DateField.Content presentation="dialog">
                  <DateField.Calendar>
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
                  </DateField.Calendar>
                </DateField.Content>
              </DateField.Portal>
            </DateField.Select>
          </DateField.Suffix>
        </DateField.InputGroup>
        <Description hideOnInvalid>Must be a business day.</Description>
        <FieldError>Please enter a valid return date.</FieldError>
      </DateField>
    </View>
  );
}
```

## API Reference

### DateField

| prop            | type                                         | default    | description                                                          |
| --------------- | -------------------------------------------- | ---------- | -------------------------------------------------------------------- |
| `children`      | `React.ReactNode`                            | -          | Children elements (Label, DateField.InputGroup, Description, FieldError) |
| `value`         | `DateFieldOption`                            | -          | Controlled selected option                                           |
| `defaultValue`  | `DateFieldOption`                            | -          | Default selected option for uncontrolled usage                       |
| `inputMode`     | `DateFieldInputMode`                         | `'masked'` | Input keyboard behavior                                              |
| `isDisabled`    | `boolean`                                    | `false`    | Whether the entire field is disabled                                 |
| `isInvalid`     | `boolean`                                    | `false`    | Whether the field is in an invalid state                             |
| `isRequired`    | `boolean`                                    | `false`    | Whether the field is required                                        |
| `isOpen`        | `boolean`                                    | -          | Controlled open state of the calendar overlay                        |
| `isDefaultOpen` | `boolean`                                    | -          | Initial open state for uncontrolled usage                            |
| `locale`        | `string`                                     | -          | BCP 47 locale forwarded to `DateField.Calendar`                      |
| `className`     | `string`                                     | -          | Additional CSS classes for the root container                        |
| `animation`     | `AnimationRootDisableAll`                    | -          | Animation configuration for the date field subtree                   |
| `onValueChange` | `(value: DateFieldOption \| undefined) => void` | -       | Handler called when the selected option changes                      |
| `onOpenChange`  | `(open: boolean) => void`                    | -          | Handler called when the open state changes                           |
| `...ViewProps`  | `ViewProps`                                  | -          | All standard React Native View props are supported                   |

#### DateFieldOption

| property | type     | description                                    |
| -------- | -------- | ---------------------------------------------- |
| `value`  | `string` | ISO date string (e.g. `"2026-06-15"`)          |
| `label`  | `string` | Display string (e.g. `"15/06/2026"`)           |

#### DateFieldInputMode

Input keyboard behavior for `DateField.Input`:

- `'masked'` — Digits only, auto-inserts `/` toward `dd/mm/yyyy`. Blur commits the parsed date. `maxLength` is set to `10`. (default)
- `'loose'` — Plain text, no masking or blur parsing. The calendar still updates the field on selection.

#### AnimationRootDisableAll

Animation configuration for the DateField root. Can be:

- `"disable-all"`: Disable all animations including children (cascades down)
- `undefined`: Use default animations

### DateField.InputGroup

| prop           | type              | default | description                                        |
| -------------- | ----------------- | ------- | -------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Input group content (Input, Prefix, Suffix)        |
| `className`    | `string`          | -       | Additional CSS classes                             |
| `...ViewProps` | `ViewProps`       | -       | All standard React Native View props are supported |

### DateField.Input

| prop              | type                          | default       | description                                                                   |
| ----------------- | ----------------------------- | ------------- | ----------------------------------------------------------------------------- |
| `placeholder`     | `string`                      | `'dd/mm/yyyy'` | Placeholder text shown when the input is empty                               |
| `inputMode`       | `string`                      | `'numeric'`   | Keyboard type for the text input                                              |
| `isDisabled`      | `boolean`                     | -             | Whether the input is disabled; inherits from root when omitted                |
| `maxLength`       | `number`                      | `10`          | Maximum character length; auto-set to `10` in masked mode                     |
| `onChangeText`    | `(text: string) => void`      | -             | Side-effect handler called after the internal masked change handler            |
| `onBlur`          | `(e: BlurEvent) => void`      | -             | Side-effect handler called after the internal blur commit                      |
| `...InputProps`   | `InputGroupInputProps`        | -             | All InputGroup.Input props are supported except `value` and `onChangeText`    |

### DateField.Prefix

| prop           | type              | default | description                                        |
| -------------- | ----------------- | ------- | -------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Prefix content                                     |
| `className`    | `string`          | -       | Additional CSS classes                             |
| `...ViewProps` | `ViewProps`       | -       | All standard React Native View props are supported |

### DateField.Suffix

| prop           | type              | default | description                                        |
| -------------- | ----------------- | ------- | -------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Suffix content (typically the calendar trigger)    |
| `className`    | `string`          | -       | Additional CSS classes                             |
| `...ViewProps` | `ViewProps`       | -       | All standard React Native View props are supported |

### DateField.Select

| prop           | type                                      | default     | description                                        |
| -------------- | ----------------------------------------- | ----------- | -------------------------------------------------- |
| `children`     | `React.ReactNode`                         | -           | Select content (Trigger, Portal)                   |
| `isDisabled`   | `boolean`                                 | -           | Overrides the root `isDisabled` when set           |
| `presentation` | `'popover' \| 'dialog' \| 'bottom-sheet'` | `'popover'` | Presentation mode for the select content           |
| `className`    | `string`                                  | -           | Additional CSS classes                             |
| `...ViewProps` | `ViewProps`                               | -           | All standard React Native View props are supported |

### DateField.Trigger

| prop                | type              | default      | description                                             |
| ------------------- | ----------------- | ------------ | ------------------------------------------------------- |
| `children`          | `React.ReactNode` | -            | Trigger content (TriggerIndicator)                      |
| `isDisabled`        | `boolean`         | -            | Whether the trigger is disabled                         |
| `className`         | `string`          | -            | Additional CSS classes for the trigger                  |
| `onPress`           | `(e: GestureResponderEvent) => void` | - | Press handler; keyboard is dismissed before this fires |
| `...PressableProps` | `PressableProps`  | -            | All standard React Native Pressable props are supported |

### DateField.TriggerIndicator

| prop                    | type                              | default | description                                                        |
| ----------------------- | --------------------------------- | ------- | ------------------------------------------------------------------ |
| `children`              | `React.ReactNode`                 | -       | Custom indicator content; defaults to a calendar icon when omitted |
| `iconProps`             | `SelectTriggerIndicatorIconProps` | -       | Overrides for the default icon                                     |
| `isAnimatedStyleActive` | `boolean`                         | `false` | Whether animated rotation styles are applied                       |
| `className`             | `string`                          | -       | Additional CSS classes for the indicator container                 |
| `animation`             | `SelectTriggerIndicatorAnimation` | `false` | Rotation animation configuration; disabled by default              |
| `...ViewProps`          | `ViewProps`                       | -       | All standard React Native View props are supported                 |

#### SelectTriggerIndicatorIconProps

| prop    | type     | default | description                 |
| ------- | -------- | ------- | --------------------------- |
| `size`  | `number` | `16`    | Icon size in logical pixels |
| `color` | `string` | `muted` | Icon fill color             |

### DateField.Portal

| prop                                         | type              | default | description                                                              |
| -------------------------------------------- | ----------------- | ------- | ------------------------------------------------------------------------ |
| `children`                                   | `React.ReactNode` | -       | Portal content (Overlay, Content)                                        |
| `hostName`                                   | `string`          | -       | Optional name of the host element for the portal                         |
| `disableFullWindowOverlay`                   | `boolean`         | `false` | Use a regular View instead of FullWindowOverlay on iOS                   |
| `unstable_accessibilityContainerViewIsModal` | `boolean`         | `false` | Controls whether VoiceOver treats the overlay as a modal container (iOS) |
| `className`                                  | `string`          | -       | Additional CSS classes for the portal container                          |

### DateField.Overlay

| prop                    | type                     | default | description                                             |
| ----------------------- | ------------------------ | ------- | ------------------------------------------------------- |
| `closeOnPress`          | `boolean`                | `true`  | Whether to close the picker when the overlay is pressed |
| `isAnimatedStyleActive` | `boolean`                | `true`  | Whether animated opacity styles are applied             |
| `className`             | `string`                 | -       | Additional CSS classes for the overlay backdrop         |
| `animation`             | `SelectOverlayAnimation` | -       | Opacity animation configuration                         |
| `...PressableProps`     | `PressableProps`         | -       | All standard React Native Pressable props are supported |

### DateField.Content

The content component is a union type based on the `presentation` prop.

#### Popover presentation

| prop           | type                                             | default         | description                                           |
| -------------- | ------------------------------------------------ | --------------- | ----------------------------------------------------- |
| `children`     | `React.ReactNode`                                | -               | Content (DateField.Calendar)                          |
| `presentation` | `'popover'`                                      | -               | Popover presentation mode                             |
| `width`        | `'content-fit' \| 'trigger' \| 'full' \| number` | `'content-fit'` | Content width sizing strategy                         |
| `className`    | `string`                                         | -               | Additional CSS classes for the content container      |
| `animation`    | `SelectContentPopoverAnimation`                  | -               | Keyframe animation configuration for entering/exiting |
| `...ViewProps` | `ViewProps`                                      | -               | All standard React Native View props are supported    |

#### Dialog presentation

| prop           | type                     | default | description                                        |
| -------------- | ------------------------ | ------- | -------------------------------------------------- |
| `children`     | `React.ReactNode`        | -       | Content (DateField.Calendar)                       |
| `presentation` | `'dialog'`               | -       | Dialog presentation mode                           |
| `isSwipeable`  | `boolean`                | `true`  | Whether the dialog can be swiped to dismiss        |
| `className`    | `string`                 | -       | Additional CSS classes for the content container   |
| `animation`    | `SelectContentAnimation` | -       | Keyframe animation configuration for scale/opacity |
| `...ViewProps` | `ViewProps`              | -       | All standard React Native View props are supported |

#### Bottom sheet presentation

| prop                  | type               | default | description                                  |
| --------------------- | ------------------ | ------- | -------------------------------------------- |
| `children`            | `React.ReactNode`  | -       | Content (DateField.Calendar)                 |
| `presentation`        | `'bottom-sheet'`   | -       | Bottom sheet presentation mode               |
| `...BottomSheetProps` | `BottomSheetProps` | -       | All @gorhom/bottom-sheet props are supported |

### DateField.Calendar

| prop                 | type                        | default         | description                                                      |
| -------------------- | --------------------------- | --------------- | ---------------------------------------------------------------- |
| `children`           | `React.ReactNode`           | -               | Calendar compound parts (Calendar.Header, Calendar.Grid, etc.)   |
| `value`              | `DateValue \| null`         | -               | Overrides the calendar value derived from the root selection     |
| `locale`             | `string`                    | -               | Overrides the root locale for the calendar grid                  |
| `accessibilityLabel` | `string`                    | `'Pick a date'` | Screen reader label for the calendar container                   |
| `onChange`           | `(date: DateValue) => void` | -               | Side-effect handler called before the default commit behavior    |
| `...CalendarProps`   | `CalendarProps`             | -               | All Calendar root props are supported (minValue, maxValue, etc.) |

## Hooks

### useDateField

Hook to access the DateField input context. Must be used within a `DateField` component.

```tsx
import { useDateField } from 'heroui-native-pro';

const { inputMode, inputText, onInputChangeText, onInputBlur } = useDateField();
```

#### Returns: DateFieldInputContextValue

| property            | type                       | description                                                                        |
| ------------------- | -------------------------- | ---------------------------------------------------------------------------------- |
| `inputMode`         | `DateFieldInputMode`       | Current input mode (`"masked"` or `"loose"`)                                       |
| `inputText`         | `string`                   | Current draft text in the input                                                    |
| `onInputChangeText` | `(text: string) => void`   | Update the draft text; in masked mode, applies `dd/mm/yyyy` formatting             |
| `onInputBlur`       | `() => void`               | Commit the draft text on blur; in masked mode, parses and updates the picker value |
