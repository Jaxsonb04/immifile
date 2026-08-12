# Calendar

A single-date calendar for selecting dates with month navigation, locale support, and customizable day cells.

> `Calendar` uses [`@internationalized/date`](https://react-aria.adobe.com/internationalized/date/) for all date manipulations (`CalendarDate`, calendar systems, time zones, locale-aware formatting). For full context on the date types and helpers exposed through this component's props and callbacks, read the [`@internationalized/date` docs](https://react-aria.adobe.com/internationalized/date/) alongside this page.

## Import

```tsx
import { Calendar } from 'heroui-native-pro';
```

## Anatomy

### With Heading

```tsx
<Calendar>
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
</Calendar>
```

### With Year Picker

```tsx
<Calendar>
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
      {(renderProps) => (
        <Calendar.YearPickerCell
          year={renderProps.year}
          isSelected={renderProps.isSelected}
        />
      )}
    </Calendar.YearPickerGridBody>
  </Calendar.YearPickerGrid>
</Calendar>
```

- **Calendar**: Root container that manages single-date selection state, locale, and animation settings. Supports controlled and uncontrolled modes with min/max constraints and date unavailability filtering.
- **Calendar.Header**: Toolbar row for navigation controls and the month/year title.
- **Calendar.Heading**: Month/year label text. The primitive computes the heading string automatically when children are omitted.
- **Calendar.NavButton**: Previous or next month navigation button. Renders a default chevron icon using the theme accent color; override via `iconProps` or pass custom `children`.
- **Calendar.Grid**: Month grid container that provides internal grid context to the header and body.
- **Calendar.GridHeader**: Weekday labels row. Requires a render function `(day: string) => ReactElement` as children.
- **Calendar.GridBody**: Day cells matrix. Requires a render function `(date: CalendarDate) => ReactElement` as children.
- **Calendar.HeaderCell**: Single weekday header cell. Stringifiable children are wrapped in `HeaderCellLabel`; pass `day` when omitting children.
- **Calendar.HeaderCellLabel**: Text slot for a weekday header cell label.
- **Calendar.Cell**: Selectable day cell. By default renders `CellBody` with `CellLabel` inside. Pass a render function as children to customize the cell content.
- **Calendar.CellBody**: Inner rounded region of a day cell with press scale animation. Pass `cellRenderProps` for data attribute selectors.
- **Calendar.CellLabel**: Day number label. Pass `cellRenderProps` for data attribute selectors.
- **Calendar.CellIndicator**: Dot marker under a day cell (e.g. for events). Pass `cellRenderProps` for `data-selected` styling.
- **Calendar.YearPickerTrigger**: Pressable trigger that replaces `Heading` to toggle the year picker overlay.
- **Calendar.YearPickerTriggerHeading**: Month/year label text inside the year picker trigger.
- **Calendar.YearPickerTriggerIndicator**: Animated chevron icon indicating the year picker open state.
- **Calendar.YearPickerGrid**: Overlay container positioned over the month grid when the year picker is open.
- **Calendar.YearPickerGridBody**: Scrollable list of year cells inside the year picker grid.
- **Calendar.YearPickerCell**: Pressable year cell that selects a year and closes the picker.

## Usage

### Basic Usage

The Calendar component uses compound parts to build a date picker. `GridHeader` and `GridBody` require render function children.

```tsx
<Calendar accessibilityLabel="Event date">
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
</Calendar>
```

### Default Value

Set an initial selected date with `defaultValue` using `@internationalized/date`.

```tsx
<Calendar defaultValue={parseDate('2026-06-19')}>
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
</Calendar>
```

### Controlled Value

Use `value` and `onChange` to control the selected date externally.

```tsx
const [date, setDate] = useState(today(getLocalTimeZone()));

<Calendar value={date} onChange={setDate}>
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
</Calendar>;
```

### Min and Max Dates

Restrict navigation and selection to a date range using `minValue` and `maxValue`.

```tsx
const now = today(getLocalTimeZone());

<Calendar minValue={now} maxValue={now.add({ months: 2 })}>
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
</Calendar>;
```

### Unavailable Dates

Mark specific dates as unavailable using the `isDateUnavailable` callback.

```tsx
const isDateUnavailable = (date: DateValue) => isWeekend(date, 'en-US');

<Calendar isDateUnavailable={isDateUnavailable}>
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
</Calendar>;
```

### With Cell Indicators

Use a render function on `Calendar.Cell` to add dot indicators under specific dates.

```tsx
<Calendar.GridBody>
  {(date) => (
    <Calendar.Cell date={date}>
      {(renderProps) => (
        <Calendar.CellBody cellRenderProps={renderProps}>
          <Calendar.CellLabel cellRenderProps={renderProps}>
            {renderProps.formattedDate}
          </Calendar.CellLabel>
          {datesWithEvents.includes(date.day) && (
            <Calendar.CellIndicator cellRenderProps={renderProps} />
          )}
        </Calendar.CellBody>
      )}
    </Calendar.Cell>
  )}
</Calendar.GridBody>
```

### International Calendar

Pass a BCP 47 locale string to render the calendar in a different language and calendar system.

```tsx
<Calendar locale="hi-IN-u-ca-indian">
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
</Calendar>
```

### Disabled State

Disable the entire calendar and all navigation controls.

```tsx
<Calendar isDisabled>
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
</Calendar>
```

### Year Picker

Add a year picker overlay by replacing `Heading` with `YearPickerTrigger` and adding a `YearPickerGrid` inside the root.

```tsx
<Calendar>
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
      {(renderProps) => (
        <Calendar.YearPickerCell
          year={renderProps.year}
          isSelected={renderProps.isSelected}
        />
      )}
    </Calendar.YearPickerGridBody>
  </Calendar.YearPickerGrid>
</Calendar>
```

## Example

```tsx
import {
  getLocalTimeZone,
  isToday,
  parseDate,
  today,
  type DateValue,
} from '@internationalized/date';
import { Calendar } from 'heroui-native-pro';
import { useState } from 'react';
import { View } from 'react-native';

const datesWithEvents = [3, 7, 12, 15, 21, 28];

export default function CalendarExample() {
  const [date, setDate] = useState<DateValue>(parseDate('2026-06-19'));

  return (
    <View className="flex-1 justify-center px-5">
      <Calendar value={date} onChange={setDate} accessibilityLabel="Event date">
        <Calendar.Header>
          <Calendar.Heading />
          <Calendar.NavButton slot="previous" />
          <Calendar.NavButton slot="next" />
        </Calendar.Header>
        <Calendar.Grid>
          <Calendar.GridHeader>
            {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
          </Calendar.GridHeader>
          <Calendar.GridBody>
            {(date) => (
              <Calendar.Cell date={date}>
                {(renderProps) => (
                  <Calendar.CellBody cellRenderProps={renderProps}>
                    <Calendar.CellLabel cellRenderProps={renderProps}>
                      {renderProps.formattedDate}
                    </Calendar.CellLabel>
                    {(isToday(date, getLocalTimeZone()) ||
                      datesWithEvents.includes(date.day)) && (
                      <Calendar.CellIndicator cellRenderProps={renderProps} />
                    )}
                  </Calendar.CellBody>
                )}
              </Calendar.Cell>
            )}
          </Calendar.GridBody>
        </Calendar.Grid>
      </Calendar>
    </View>
  );
}
```

## API Reference

### Calendar

| prop                     | type                                                                        | default | description                                                    |
| ------------------------ | --------------------------------------------------------------------------- | ------- | -------------------------------------------------------------- |
| `children`               | `React.ReactNode \| ((props: { state: CalendarState }) => React.ReactNode)` | -       | Calendar content or render function receiving calendar state   |
| `value`                  | `DateValue \| null`                                                         | -       | Controlled selected date                                       |
| `defaultValue`           | `DateValue \| null`                                                         | -       | Default selected date for uncontrolled usage                   |
| `minValue`               | `DateValue \| null`                                                         | -       | Minimum selectable date; disables earlier dates and navigation |
| `maxValue`               | `DateValue \| null`                                                         | -       | Maximum selectable date; disables later dates and navigation   |
| `isDateUnavailable`      | `(date: DateValue) => boolean`                                              | -       | Callback to mark specific dates as unavailable                 |
| `isDisabled`             | `boolean`                                                                   | `false` | Whether the entire calendar is disabled                        |
| `isReadOnly`             | `boolean`                                                                   | `false` | Whether the calendar value is immutable                        |
| `isInvalid`              | `boolean`                                                                   | -       | Whether the current selection is invalid                       |
| `firstDayOfWeek`         | `'sun' \| 'mon' \| 'tue' \| 'wed' \| 'thu' \| 'fri' \| 'sat'`               | -       | Override the first day of the week                             |
| `locale`                 | `string`                                                                    | -       | BCP 47 locale; defaults to the environment locale              |
| `isYearPickerOpen`       | `boolean`                                                                   | -       | Controlled open state for the year picker overlay              |
| `defaultYearPickerOpen`  | `boolean`                                                                   | `false` | Initial open state for the year picker in uncontrolled mode    |
| `className`              | `string`                                                                    | -       | Additional CSS classes for the root container                  |
| `animation`              | `AnimationRootDisableAll`                                                   | -       | Animation configuration for the calendar subtree               |
| `onChange`               | `(value: MappedDateValue<DateValue>) => void`                               | -       | Handler called when the selected date changes                  |
| `onYearPickerOpenChange` | `(isOpen: boolean) => void`                                                 | -       | Handler called when the year picker open state changes         |
| `...ViewProps`           | `ViewProps`                                                                 | -       | All standard React Native View props are supported             |

#### AnimationRootDisableAll

Animation configuration for the Calendar root. Can be:

- `"disable-all"`: Disable all animations including children (cascades down)
- `undefined`: Use default animations

### Calendar.Header

| prop           | type              | default | description                                         |
| -------------- | ----------------- | ------- | --------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Header content (Heading, NavButtons, etc.)          |
| `className`    | `string`          | -       | Additional CSS classes for the header row container |
| `...ViewProps` | `ViewProps`       | -       | All standard React Native View props are supported  |

### Calendar.Heading

| prop           | type              | default | description                                                |
| -------------- | ----------------- | ------- | ---------------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Custom heading text; auto-computed month/year when omitted |
| `className`    | `string`          | -       | Additional CSS classes for the heading text                |
| `...TextProps` | `TextProps`       | -       | All standard React Native Text props are supported         |

### Calendar.NavButton

| prop                | type                         | default | description                                                      |
| ------------------- | ---------------------------- | ------- | ---------------------------------------------------------------- |
| `children`          | `React.ReactNode`            | -       | Custom icon content; replaces the default chevron when provided  |
| `slot`              | `'previous' \| 'next'`       | -       | Navigation direction; determines which chevron icon is rendered  |
| `isDisabled`        | `boolean`                    | -       | Merged with calendar `isDisabled` and range boundary state       |
| `className`         | `string`                     | -       | Additional CSS classes for the pressable                         |
| `iconProps`         | `CalendarNavButtonIconProps` | -       | Overrides for the built-in chevron; ignored with custom children |
| `...PressableProps` | `PressableProps`             | -       | All standard React Native Pressable props are supported          |

#### CalendarNavButtonIconProps

| prop    | type     | default        | description                 |
| ------- | -------- | -------------- | --------------------------- |
| `size`  | `number` | `18`           | Icon size in logical pixels |
| `color` | `string` | Theme `accent` | Icon stroke/fill color      |

### Calendar.Grid

| prop           | type                            | default | description                                               |
| -------------- | ------------------------------- | ------- | --------------------------------------------------------- |
| `children`     | `React.ReactNode`               | -       | Grid content (GridHeader, GridBody)                       |
| `offset`       | `DateDuration`                  | -       | Offset from the visible range start for multi-month grids |
| `weekdayStyle` | `'narrow' \| 'short' \| 'long'` | -       | Weekday label format                                      |
| `className`    | `string`                        | -       | Additional CSS classes for the grid container             |
| `...ViewProps` | `ViewProps`                     | -       | All standard React Native View props are supported        |

### Calendar.GridHeader

| prop           | type                                  | default | description                                              |
| -------------- | ------------------------------------- | ------- | -------------------------------------------------------- |
| `children`     | `(day: string) => React.ReactElement` | -       | Render function called for each weekday label (required) |
| `className`    | `string`                              | -       | Additional CSS classes for the weekday row wrapper       |
| `...ViewProps` | `ViewProps`                           | -       | All standard React Native View props are supported       |

### Calendar.GridBody

| prop           | type                                         | default | description                                                 |
| -------------- | -------------------------------------------- | ------- | ----------------------------------------------------------- |
| `children`     | `(date: CalendarDate) => React.ReactElement` | -       | Render function called for each day in the month (required) |
| `className`    | `string`                                     | -       | Additional CSS classes for the grid body                    |
| `...ViewProps` | `ViewProps`                                  | -       | All standard React Native View props are supported          |

### Calendar.HeaderCell

| prop           | type              | default | description                                                                               |
| -------------- | ----------------- | ------- | ----------------------------------------------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Custom cell content; stringifiable children are wrapped in `HeaderCellLabel`              |
| `day`          | `string`          | -       | Weekday label string from `GridHeader`'s render callback; used when `children` is omitted |
| `className`    | `string`          | -       | Additional CSS classes for the header cell container                                      |
| `...ViewProps` | `ViewProps`       | -       | All standard React Native View props are supported                                        |

### Calendar.HeaderCellLabel

| prop           | type              | default | description                                        |
| -------------- | ----------------- | ------- | -------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Weekday label text                                 |
| `className`    | `string`          | -       | Additional CSS classes for the label text          |
| `...TextProps` | `TextProps`       | -       | All standard React Native Text props are supported |

### Calendar.Cell

| prop                | type                                                                             | default | description                                                         |
| ------------------- | -------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------- |
| `date`              | `CalendarDate`                                                                   | -       | The calendar date this cell represents (required)                   |
| `children`          | `React.ReactNode \| ((renderProps: CalendarCellRenderProps) => React.ReactNode)` | -       | Custom cell content; defaults to `CellBody` with `CellLabel` inside |
| `isDisabled`        | `boolean`                                                                        | -       | Merged with calendar `isDisabled` and cell-specific disabled state  |
| `className`         | `string`                                                                         | -       | Additional CSS classes for the day cell pressable                   |
| `...PressableProps` | `PressableProps`                                                                 | -       | All standard React Native Pressable props are supported             |

#### CalendarCellRenderProps

Render props received by the `Calendar.Cell` children render function.

| property                | type           | description                                                        |
| ----------------------- | -------------- | ------------------------------------------------------------------ |
| `date`                  | `CalendarDate` | The calendar date for this cell                                    |
| `formattedDate`         | `string`       | Locale-formatted day number string                                 |
| `isSelected`            | `boolean`      | Whether this date is currently selected                            |
| `isToday`               | `boolean`      | Whether this date is today                                         |
| `isDisabled`            | `boolean`      | Whether this date is disabled                                      |
| `isUnavailable`         | `boolean`      | Whether this date is unavailable via `isDateUnavailable`           |
| `isOutsideMonth`        | `boolean`      | Whether this date is outside the currently visible month           |
| `isFocused`             | `boolean`      | Whether this date is currently focused                             |
| `isInvalid`             | `boolean`      | Whether this date is invalid per `minValue`/`maxValue` constraints |
| `isPressed`             | `boolean`      | Whether the day cell pressable is in a pressed state               |
| `isRangeStart`          | `boolean`      | First day of the highlighted range (range calendar only)           |
| `isRangeEnd`            | `boolean`      | Last day of the highlighted range (range calendar only)            |
| `isRangeFilled`         | `boolean`      | Whether the range spans more than one day (range calendar only)    |
| `isRangeMiddle`         | `boolean`      | Strictly inside the range, not start or end (range calendar only)  |
| `isRangeMiddleRowStart` | `boolean`      | Range middle cell at the start of a row (range calendar only)      |
| `isRangeMiddleRowEnd`   | `boolean`      | Range middle cell at the end of a row (range calendar only)        |

### Calendar.CellBody

| prop                    | type                        | default | description                                                                      |
| ----------------------- | --------------------------- | ------- | -------------------------------------------------------------------------------- |
| `children`              | `React.ReactNode`           | -       | Body content (typically `CellLabel` and optional `CellIndicator`)                |
| `cellRenderProps`       | `CalendarCellRenderProps`   | -       | Render props from `Calendar.Cell`'s children callback; drives `data-*` selectors |
| `isAnimatedStyleActive` | `boolean`                   | `true`  | Whether animated scale styles are applied; set `false` for custom logic          |
| `className`             | `string`                    | -       | Additional CSS classes for the cell body container                               |
| `animation`             | `CalendarCellBodyAnimation` | -       | Press scale animation configuration                                              |
| `...ViewProps`          | `ViewProps`                 | -       | All standard React Native View props are supported                               |

#### Data Attributes

| attribute                         | values    | description                                     |
| --------------------------------- | --------- | ----------------------------------------------- |
| `data-today`                      | `boolean` | Whether the date is today                       |
| `data-outside-month`              | `boolean` | Whether the date is outside the visible month   |
| `data-unavailable`                | `boolean` | Whether the date is unavailable                 |
| `data-disabled`                   | `boolean` | Whether the date is disabled                    |
| `data-focused`                    | `boolean` | Whether the date is focused                     |
| `data-invalid`                    | `boolean` | Whether the date is invalid                     |
| `data-selected`                   | `boolean` | Whether the date is selected                    |
| `data-pressed`                    | `boolean` | Whether the cell is pressed                     |
| `data-range-start`                | `boolean` | First day of a range (range calendar only)      |
| `data-range-end`                  | `boolean` | Last day of a range (range calendar only)       |
| `data-range-filled`               | `boolean` | Range spans multiple days (range calendar only) |
| `data-range-middle`               | `boolean` | Inside the range, not start/end (range only)    |
| `data-range-middle-row-start`     | `boolean` | Range middle at row start (range calendar only) |
| `data-range-middle-row-end`       | `boolean` | Range middle at row end (range calendar only)   |
| `data-disabled-not-outside-month` | `boolean` | Disabled but within the visible month           |

#### CalendarCellBodyAnimation

Animation configuration for `Calendar.CellBody` press feedback. Can be:

- `false` or `"disabled"`: Disable press animation
- `undefined`: Use default animation
- `object`: Custom animation configuration

| prop                 | type               | default             | description                       |
| -------------------- | ------------------ | ------------------- | --------------------------------- |
| `scale.value`        | `[number, number]` | `[1, 0.9]`          | Scale values [unpressed, pressed] |
| `scale.timingConfig` | `WithTimingConfig` | `{ duration: 120 }` | Animation timing configuration    |

### Calendar.CellLabel

| prop              | type                      | default | description                                                                      |
| ----------------- | ------------------------- | ------- | -------------------------------------------------------------------------------- |
| `children`        | `React.ReactNode`         | -       | Label text (usually the day number)                                              |
| `cellRenderProps` | `CalendarCellRenderProps` | -       | Render props from `Calendar.Cell`'s children callback; drives `data-*` selectors |
| `className`       | `string`                  | -       | Additional CSS classes for the label text                                        |
| `...TextProps`    | `TextProps`               | -       | All standard React Native Text props are supported                               |

#### Data Attributes

Same data attributes as `Calendar.CellBody`. See above.

### Calendar.CellIndicator

| prop              | type                      | default | description                                                                      |
| ----------------- | ------------------------- | ------- | -------------------------------------------------------------------------------- |
| `cellRenderProps` | `CalendarCellRenderProps` | -       | Render props from `Calendar.Cell`'s children callback; drives `data-*` selectors |
| `className`       | `string`                  | -       | Additional CSS classes for the indicator dot container                           |
| `...ViewProps`    | `ViewProps`               | -       | All standard React Native View props are supported                               |

#### Data Attributes

Same data attributes as `Calendar.CellBody`. See above.

### Calendar.YearPickerTrigger

| prop                | type                                                                             | default | description                                             |
| ------------------- | -------------------------------------------------------------------------------- | ------- | ------------------------------------------------------- |
| `children`          | `React.ReactNode \| ((values: YearPickerTriggerRenderProps) => React.ReactNode)` | -       | Trigger content or render function                      |
| `...PressableProps` | `PressableProps`                                                                 | -       | All standard React Native Pressable props are supported |

#### YearPickerTriggerRenderProps

| property    | type         | description                         |
| ----------- | ------------ | ----------------------------------- |
| `isOpen`    | `boolean`    | Whether the year picker is open     |
| `monthYear` | `string`     | Formatted month/year heading string |
| `toggle`    | `() => void` | Toggle the year picker open state   |

### Calendar.YearPickerTriggerHeading

| prop           | type                                                                             | default | description                                                 |
| -------------- | -------------------------------------------------------------------------------- | ------- | ----------------------------------------------------------- |
| `children`     | `React.ReactNode \| ((values: YearPickerTriggerRenderProps) => React.ReactNode)` | -       | Heading text or render function; auto-computed when omitted |
| `...TextProps` | `TextProps`                                                                      | -       | All standard React Native Text props are supported          |

### Calendar.YearPickerTriggerIndicator

| prop                    | type                                                                             | default | description                                        |
| ----------------------- | -------------------------------------------------------------------------------- | ------- | -------------------------------------------------- |
| `children`              | `React.ReactNode \| ((values: YearPickerTriggerRenderProps) => React.ReactNode)` | -       | Custom indicator content or render function        |
| `iconProps`             | `{ size?: number; color?: string }`                                              | -       | Overrides for the default chevron icon             |
| `isAnimatedStyleActive` | `boolean`                                                                        | `true`  | Whether animated rotation styles are applied       |
| `animation`             | `YearPickerIndicatorAnimation`                                                   | -       | Rotation animation configuration                   |
| `...ViewProps`          | `ViewProps`                                                                      | -       | All standard React Native View props are supported |

#### YearPickerIndicatorAnimation

Animation configuration for the year picker trigger chevron rotation. Can be:

- `false` or `"disabled"`: Disable rotation animation
- `undefined`: Use default animation
- `object`: Custom animation configuration

| prop                    | type               | default        | description                           |
| ----------------------- | ------------------ | -------------- | ------------------------------------- |
| `rotation.value`        | `[number, number]` | `[0, 90]`      | Rotation degrees [closed, open]       |
| `rotation.springConfig` | `WithSpringConfig` | Default spring | Spring configuration for the rotation |

### Calendar.YearPickerGrid

| prop                    | type                      | default | description                                        |
| ----------------------- | ------------------------- | ------- | -------------------------------------------------- |
| `children`              | `React.ReactNode`         | -       | Grid content (YearPickerGridBody)                  |
| `isAnimatedStyleActive` | `boolean`                 | `true`  | Whether animated opacity styles are applied        |
| `animation`             | `YearPickerGridAnimation` | -       | Opacity animation configuration                    |
| `...ViewProps`          | `ViewProps`               | -       | All standard React Native View props are supported |

#### YearPickerGridAnimation

Animation configuration for the year picker grid overlay. Can be:

- `false` or `"disabled"`: Disable opacity animation
- `undefined`: Use default animation
- `object`: Custom animation configuration

| prop                   | type               | default             | description                          |
| ---------------------- | ------------------ | ------------------- | ------------------------------------ |
| `opacity.value`        | `[number, number]` | `[0, 1]`            | Opacity values [closed, open]        |
| `opacity.timingConfig` | `WithTimingConfig` | `{ duration: 200 }` | Timing configuration for the opacity |

### Calendar.YearPickerGridBody

| prop               | type                                                     | default | description                                                                                        |
| ------------------ | -------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------- |
| `children`         | `(values: YearPickerCellRenderProps) => React.ReactNode` | -       | Render function called for each year                                                               |
| `...FlatListProps` | `FlatListProps<number>`                                  | -       | FlatList props except `data`, `renderItem`, `keyExtractor`, `numColumns`, and `columnWrapperStyle` |

#### YearPickerCellRenderProps

| property        | type         | description                             |
| --------------- | ------------ | --------------------------------------- |
| `year`          | `number`     | The year number                         |
| `formattedYear` | `string`     | Locale-formatted year string            |
| `isSelected`    | `boolean`    | Whether this year matches the selection |
| `isCurrentYear` | `boolean`    | Whether this year is the current year   |
| `isOpen`        | `boolean`    | Whether the year picker is open         |
| `selectYear`    | `() => void` | Select this year and close the picker   |

### Calendar.YearPickerCell

| prop                | type                                                                          | default | description                                             |
| ------------------- | ----------------------------------------------------------------------------- | ------- | ------------------------------------------------------- |
| `year`              | `number`                                                                      | -       | The year this cell represents (required)                |
| `isSelected`        | `boolean`                                                                     | -       | Whether this year is selected (required)                |
| `children`          | `React.ReactNode \| ((values: YearPickerCellRenderProps) => React.ReactNode)` | -       | Custom cell content or render function                  |
| `...PressableProps` | `PressableProps`                                                              | -       | All standard React Native Pressable props are supported |

## Hooks

### useCalendar

Hook to access the calendar state context. Must be used within a `Calendar` component.

```tsx
import { useCalendar } from 'heroui-native-pro';

const state = useCalendar();
```

#### Returns: CalendarState

| property            | type                                                                           | description                                      |
| ------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------ |
| `value`             | `CalendarDate \| null`                                                         | Currently selected date                          |
| `setValue`          | `(value: CalendarDate \| null) => void`                                        | Set the selected date                            |
| `visibleRange`      | `RangeValue<CalendarDate>`                                                     | The date range currently visible in the calendar |
| `focusedDate`       | `CalendarDate`                                                                 | Currently focused date                           |
| `setFocusedDate`    | `(value: CalendarDate) => void`                                                | Set the focused date                             |
| `isDisabled`        | `boolean`                                                                      | Whether the calendar is disabled                 |
| `isReadOnly`        | `boolean`                                                                      | Whether the calendar is read-only                |
| `isValueInvalid`    | `boolean`                                                                      | Whether the current value is invalid             |
| `timeZone`          | `string`                                                                       | Time zone of displayed dates                     |
| `minValue`          | `DateValue \| null \| undefined`                                               | Minimum allowed date                             |
| `maxValue`          | `DateValue \| null \| undefined`                                               | Maximum allowed date                             |
| `focusNextPage`     | `() => void`                                                                   | Navigate to the next month                       |
| `focusPreviousPage` | `() => void`                                                                   | Navigate to the previous month                   |
| `selectFocusedDate` | `() => void`                                                                   | Select the currently focused date                |
| `selectDate`        | `(date: CalendarDate) => void`                                                 | Select a specific date                           |
| `isSelected`        | `(date: CalendarDate) => boolean`                                              | Check if a date is selected                      |
| `isInvalid`         | `(date: CalendarDate) => boolean`                                              | Check if a date is invalid                       |
| `isCellDisabled`    | `(date: CalendarDate) => boolean`                                              | Check if a date cell is disabled                 |
| `isCellUnavailable` | `(date: CalendarDate) => boolean`                                              | Check if a date cell is unavailable              |
| `isCellFocused`     | `(date: CalendarDate) => boolean`                                              | Check if a date cell is focused                  |
| `getDatesInWeek`    | `(weekIndex: number, startDate?: CalendarDate) => Array<CalendarDate \| null>` | Get dates for a week row                         |
