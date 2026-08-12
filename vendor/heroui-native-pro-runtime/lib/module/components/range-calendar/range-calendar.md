# RangeCalendar

A date range calendar for selecting start and end dates with month navigation, locale support, and customizable day cells.

> `RangeCalendar` uses [`@internationalized/date`](https://react-aria.adobe.com/internationalized/date/) for all date manipulations (`CalendarDate`, calendar systems, time zones, locale-aware formatting). For full context on the date types and helpers exposed through this component's props and callbacks, read the [`@internationalized/date` docs](https://react-aria.adobe.com/internationalized/date/) alongside this page.

## Import

```tsx
import { RangeCalendar } from 'heroui-native-pro';
```

## Anatomy

### With Heading

```tsx
<RangeCalendar>
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
</RangeCalendar>
```

### With Year Picker

```tsx
<RangeCalendar>
  <RangeCalendar.Header>
    <RangeCalendar.YearPickerTrigger>
      <RangeCalendar.YearPickerTriggerHeading />
      <RangeCalendar.YearPickerTriggerIndicator />
    </RangeCalendar.YearPickerTrigger>
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
  <RangeCalendar.YearPickerGrid>
    <RangeCalendar.YearPickerGridBody>
      {(renderProps) => (
        <RangeCalendar.YearPickerCell
          year={renderProps.year}
          isSelected={renderProps.isSelected}
        />
      )}
    </RangeCalendar.YearPickerGridBody>
  </RangeCalendar.YearPickerGrid>
</RangeCalendar>
```

- **RangeCalendar**: Root container that manages date range selection state, locale, and animation settings. Supports controlled and uncontrolled modes with min/max constraints and date unavailability filtering.
- **RangeCalendar.Header**: Toolbar row for navigation controls and the month/year title.
- **RangeCalendar.Heading**: Month/year label text. The primitive computes the heading string automatically when children are omitted.
- **RangeCalendar.NavButton**: Previous or next month navigation button. Renders a default chevron icon using the theme accent color; override via `iconProps` or pass custom `children`.
- **RangeCalendar.Grid**: Month grid container that provides internal grid context to the header and body.
- **RangeCalendar.GridHeader**: Weekday labels row. Requires a render function `(day: string) => ReactElement` as children.
- **RangeCalendar.GridBody**: Day cells matrix. Requires a render function `(date: CalendarDate) => ReactElement` as children.
- **RangeCalendar.HeaderCell**: Single weekday header cell. Stringifiable children are wrapped in `HeaderCellLabel`; pass `day` when omitting children.
- **RangeCalendar.HeaderCellLabel**: Text slot for a weekday header cell label.
- **RangeCalendar.Cell**: Selectable day cell with range highlight strip styling. By default renders `CellBody` with `CellLabel` inside. Pass a render function as children to customize the cell content.
- **RangeCalendar.CellBody**: Inner rounded region of a day cell with press scale animation. Accent background is applied on range start/end cells. Pass `cellRenderProps` for data attribute selectors.
- **RangeCalendar.CellLabel**: Day number label. Uses `data-range-start` and `data-range-end` for accent foreground color. Pass `cellRenderProps` for data attribute selectors.
- **RangeCalendar.CellIndicator**: Dot marker under a day cell (e.g. for events). Pass `cellRenderProps` for `data-selected` styling.
- **RangeCalendar.YearPickerTrigger**: Pressable trigger that replaces `Heading` to toggle the year picker overlay.
- **RangeCalendar.YearPickerTriggerHeading**: Month/year label text inside the year picker trigger.
- **RangeCalendar.YearPickerTriggerIndicator**: Animated chevron icon indicating the year picker open state.
- **RangeCalendar.YearPickerGrid**: Overlay container positioned over the month grid when the year picker is open.
- **RangeCalendar.YearPickerGridBody**: Scrollable list of year cells inside the year picker grid.
- **RangeCalendar.YearPickerCell**: Pressable year cell that selects a year and closes the picker.

## Usage

### Basic Usage

The RangeCalendar uses the same compound structure as Calendar. Users select a start and end date by tapping two different days.

```tsx
<RangeCalendar
  accessibilityLabel="Trip dates"
  defaultValue={{
    start: parseDate('2026-04-01'),
    end: parseDate('2026-04-07'),
  }}
>
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
</RangeCalendar>
```

### Controlled Value

Use `value` and `onChange` to control the selected range externally.

```tsx
const [range, setRange] = useState({
  start: parseDate('2026-04-01'),
  end: parseDate('2026-04-07'),
});

<RangeCalendar value={range} onChange={setRange}>
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
</RangeCalendar>;
```

### Min and Max Dates

Restrict navigation and selection to a date range using `minValue` and `maxValue`.

```tsx
const now = today(getLocalTimeZone());

<RangeCalendar minValue={now} maxValue={now.add({ months: 2 })}>
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
</RangeCalendar>;
```

### Non-contiguous Ranges

Enable `allowsNonContiguousRanges` to allow ranges that span across unavailable dates.

```tsx
const isDateUnavailable = (date: DateValue) => {
  return blockedRanges.some(
    ([start, end]) => date.compare(start) >= 0 && date.compare(end) <= 0
  );
};

<RangeCalendar allowsNonContiguousRanges isDateUnavailable={isDateUnavailable}>
  <RangeCalendar.Header>
    <RangeCalendar.Heading />
    <RangeCalendar.NavButton slot="previous" />
    <RangeCalendar.NavButton slot="next" />
  </RangeCalendar.Header>
  <RangeCalendar.Grid>
    <RangeCalendar.GridHeader>
      {(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}
    </RangeCalendar.GridHeader>
    <RangeCalendar.GridBody>
      {(date) => <RangeCalendar.Cell date={date} />}
    </RangeCalendar.GridBody>
  </RangeCalendar.Grid>
</RangeCalendar>;
```

### Year Picker

Add a year picker overlay by replacing `Heading` with `YearPickerTrigger` and adding a `YearPickerGrid` inside the root.

```tsx
<RangeCalendar>
  <RangeCalendar.Header>
    <RangeCalendar.YearPickerTrigger>
      <RangeCalendar.YearPickerTriggerHeading />
      <RangeCalendar.YearPickerTriggerIndicator />
    </RangeCalendar.YearPickerTrigger>
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
  <RangeCalendar.YearPickerGrid>
    <RangeCalendar.YearPickerGridBody>
      {({ year, isSelected }) => (
        <RangeCalendar.YearPickerCell year={year} isSelected={isSelected} />
      )}
    </RangeCalendar.YearPickerGridBody>
  </RangeCalendar.YearPickerGrid>
</RangeCalendar>
```

### Disabled State

Disable the entire calendar and all navigation controls.

```tsx
<RangeCalendar isDisabled>
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
</RangeCalendar>
```

## Example

```tsx
import {
  parseDate,
  today,
  getLocalTimeZone,
  type DateValue,
} from '@internationalized/date';
import { RangeCalendar } from 'heroui-native-pro';
import { useState } from 'react';
import { View } from 'react-native';

export default function RangeCalendarExample() {
  const now = today(getLocalTimeZone());
  const blockedRanges = [
    [now.add({ days: 2 }), now.add({ days: 5 })],
    [now.add({ days: 12 }), now.add({ days: 13 })],
  ] as const;

  const isDateUnavailable = (date: DateValue) => {
    return blockedRanges.some(
      ([start, end]) => date.compare(start) >= 0 && date.compare(end) <= 0
    );
  };

  return (
    <View className="flex-1 justify-center px-5">
      <RangeCalendar
        allowsNonContiguousRanges
        accessibilityLabel="Trip dates"
        isDateUnavailable={isDateUnavailable}
        defaultValue={{
          start: parseDate('2026-04-01'),
          end: parseDate('2026-04-07'),
        }}
      >
        <RangeCalendar.Header>
          <RangeCalendar.Heading />
          <RangeCalendar.NavButton slot="previous" />
          <RangeCalendar.NavButton slot="next" />
        </RangeCalendar.Header>
        <RangeCalendar.Grid>
          <RangeCalendar.GridHeader>
            {(day) => (
              <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>
            )}
          </RangeCalendar.GridHeader>
          <RangeCalendar.GridBody>
            {(date) => <RangeCalendar.Cell date={date} />}
          </RangeCalendar.GridBody>
        </RangeCalendar.Grid>
      </RangeCalendar>
    </View>
  );
}
```

## API Reference

### RangeCalendar

| prop                        | type                                                                             | default | description                                                        |
| --------------------------- | -------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------ |
| `children`                  | `React.ReactNode \| ((props: { state: RangeCalendarState }) => React.ReactNode)` | -       | Calendar content or render function receiving range calendar state |
| `value`                     | `RangeValue<DateValue> \| null`                                                  | -       | Controlled selected date range                                     |
| `defaultValue`              | `RangeValue<DateValue> \| null`                                                  | -       | Default selected date range for uncontrolled usage                 |
| `minValue`                  | `DateValue \| null`                                                              | -       | Minimum selectable date; disables earlier dates and navigation     |
| `maxValue`                  | `DateValue \| null`                                                              | -       | Maximum selectable date; disables later dates and navigation       |
| `isDateUnavailable`         | `(date: DateValue) => boolean`                                                   | -       | Callback to mark specific dates as unavailable                     |
| `allowsNonContiguousRanges` | `boolean`                                                                        | -       | Allow ranges that span across unavailable dates                    |
| `isDisabled`                | `boolean`                                                                        | `false` | Whether the entire calendar is disabled                            |
| `isReadOnly`                | `boolean`                                                                        | `false` | Whether the calendar value is immutable                            |
| `isInvalid`                 | `boolean`                                                                        | -       | Whether the current selection is invalid                           |
| `firstDayOfWeek`            | `'sun' \| 'mon' \| 'tue' \| 'wed' \| 'thu' \| 'fri' \| 'sat'`                    | -       | Override the first day of the week                                 |
| `locale`                    | `string`                                                                         | -       | BCP 47 locale; defaults to the environment locale                  |
| `isYearPickerOpen`          | `boolean`                                                                        | -       | Controlled open state for the year picker overlay                  |
| `defaultYearPickerOpen`     | `boolean`                                                                        | `false` | Initial open state for the year picker in uncontrolled mode        |
| `className`                 | `string`                                                                         | -       | Additional CSS classes for the root container                      |
| `animation`                 | `AnimationRootDisableAll`                                                        | -       | Animation configuration for the calendar subtree                   |
| `onChange`                  | `(value: RangeValue<MappedDateValue<DateValue>>) => void`                        | -       | Handler called when the selected range changes                     |
| `onYearPickerOpenChange`    | `(isOpen: boolean) => void`                                                      | -       | Handler called when the year picker open state changes             |
| `...ViewProps`              | `ViewProps`                                                                      | -       | All standard React Native View props are supported                 |

#### RangeValue

| property | type        | description                 |
| -------- | ----------- | --------------------------- |
| `start`  | `DateValue` | The start date of the range |
| `end`    | `DateValue` | The end date of the range   |

#### AnimationRootDisableAll

Animation configuration for the RangeCalendar root. Can be:

- `"disable-all"`: Disable all animations including children (cascades down)
- `undefined`: Use default animations

### RangeCalendar.Header

| prop           | type              | default | description                                         |
| -------------- | ----------------- | ------- | --------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Header content (Heading, NavButtons, etc.)          |
| `className`    | `string`          | -       | Additional CSS classes for the header row container |
| `...ViewProps` | `ViewProps`       | -       | All standard React Native View props are supported  |

### RangeCalendar.Heading

| prop           | type              | default | description                                                |
| -------------- | ----------------- | ------- | ---------------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Custom heading text; auto-computed month/year when omitted |
| `className`    | `string`          | -       | Additional CSS classes for the heading text                |
| `...TextProps` | `TextProps`       | -       | All standard React Native Text props are supported         |

### RangeCalendar.NavButton

| prop                | type                              | default | description                                                      |
| ------------------- | --------------------------------- | ------- | ---------------------------------------------------------------- |
| `children`          | `React.ReactNode`                 | -       | Custom icon content; replaces the default chevron when provided  |
| `slot`              | `'previous' \| 'next'`            | -       | Navigation direction; determines which chevron icon is rendered  |
| `isDisabled`        | `boolean`                         | -       | Merged with calendar `isDisabled` and range boundary state       |
| `className`         | `string`                          | -       | Additional CSS classes for the pressable                         |
| `iconProps`         | `RangeCalendarNavButtonIconProps` | -       | Overrides for the built-in chevron; ignored with custom children |
| `...PressableProps` | `PressableProps`                  | -       | All standard React Native Pressable props are supported          |

#### RangeCalendarNavButtonIconProps

| prop    | type     | default        | description                 |
| ------- | -------- | -------------- | --------------------------- |
| `size`  | `number` | `18`           | Icon size in logical pixels |
| `color` | `string` | Theme `accent` | Icon stroke/fill color      |

### RangeCalendar.Grid

| prop           | type                            | default | description                                               |
| -------------- | ------------------------------- | ------- | --------------------------------------------------------- |
| `children`     | `React.ReactNode`               | -       | Grid content (GridHeader, GridBody)                       |
| `offset`       | `DateDuration`                  | -       | Offset from the visible range start for multi-month grids |
| `weekdayStyle` | `'narrow' \| 'short' \| 'long'` | -       | Weekday label format                                      |
| `className`    | `string`                        | -       | Additional CSS classes for the grid container             |
| `...ViewProps` | `ViewProps`                     | -       | All standard React Native View props are supported        |

### RangeCalendar.GridHeader

| prop           | type                                  | default | description                                              |
| -------------- | ------------------------------------- | ------- | -------------------------------------------------------- |
| `children`     | `(day: string) => React.ReactElement` | -       | Render function called for each weekday label (required) |
| `className`    | `string`                              | -       | Additional CSS classes for the weekday row wrapper       |
| `...ViewProps` | `ViewProps`                           | -       | All standard React Native View props are supported       |

### RangeCalendar.GridBody

| prop           | type                                         | default | description                                                 |
| -------------- | -------------------------------------------- | ------- | ----------------------------------------------------------- |
| `children`     | `(date: CalendarDate) => React.ReactElement` | -       | Render function called for each day in the month (required) |
| `className`    | `string`                                     | -       | Additional CSS classes for the grid body                    |
| `...ViewProps` | `ViewProps`                                  | -       | All standard React Native View props are supported          |

### RangeCalendar.HeaderCell

| prop           | type              | default | description                                                                               |
| -------------- | ----------------- | ------- | ----------------------------------------------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Custom cell content; stringifiable children are wrapped in `HeaderCellLabel`              |
| `day`          | `string`          | -       | Weekday label string from `GridHeader`'s render callback; used when `children` is omitted |
| `className`    | `string`          | -       | Additional CSS classes for the header cell container                                      |
| `...ViewProps` | `ViewProps`       | -       | All standard React Native View props are supported                                        |

### RangeCalendar.HeaderCellLabel

| prop           | type              | default | description                                        |
| -------------- | ----------------- | ------- | -------------------------------------------------- |
| `children`     | `React.ReactNode` | -       | Weekday label text                                 |
| `className`    | `string`          | -       | Additional CSS classes for the label text          |
| `...TextProps` | `TextProps`       | -       | All standard React Native Text props are supported |

### RangeCalendar.Cell

| prop                | type                                                                             | default | description                                                         |
| ------------------- | -------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------- |
| `date`              | `CalendarDate`                                                                   | -       | The calendar date this cell represents (required)                   |
| `children`          | `React.ReactNode \| ((renderProps: CalendarCellRenderProps) => React.ReactNode)` | -       | Custom cell content; defaults to `CellBody` with `CellLabel` inside |
| `isDisabled`        | `boolean`                                                                        | -       | Merged with calendar `isDisabled` and cell-specific disabled state  |
| `className`         | `string`                                                                         | -       | Additional CSS classes for the day cell pressable                   |
| `...PressableProps` | `PressableProps`                                                                 | -       | All standard React Native Pressable props are supported             |

#### CalendarCellRenderProps

Render props received by the `RangeCalendar.Cell` children render function.

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
| `isRangeStart`          | `boolean`      | First day of the highlighted range                                 |
| `isRangeEnd`            | `boolean`      | Last day of the highlighted range                                  |
| `isRangeFilled`         | `boolean`      | Whether the range spans more than one day                          |
| `isRangeMiddle`         | `boolean`      | Strictly inside the range, not start or end                        |
| `isRangeMiddleRowStart` | `boolean`      | Range middle cell at the start of a row                            |
| `isRangeMiddleRowEnd`   | `boolean`      | Range middle cell at the end of a row                              |

### RangeCalendar.CellBody

| prop                    | type                        | default | description                                                                           |
| ----------------------- | --------------------------- | ------- | ------------------------------------------------------------------------------------- |
| `children`              | `React.ReactNode`           | -       | Body content (typically `CellLabel` and optional `CellIndicator`)                     |
| `cellRenderProps`       | `CalendarCellRenderProps`   | -       | Render props from `RangeCalendar.Cell`'s children callback; drives `data-*` selectors |
| `isAnimatedStyleActive` | `boolean`                   | `true`  | Whether animated scale styles are applied; set `false` for custom logic               |
| `className`             | `string`                    | -       | Additional CSS classes for the cell body container                                    |
| `animation`             | `CalendarCellBodyAnimation` | -       | Press scale animation configuration                                                   |
| `...ViewProps`          | `ViewProps`                 | -       | All standard React Native View props are supported                                    |

#### Data Attributes

| attribute                         | values    | description                                   |
| --------------------------------- | --------- | --------------------------------------------- |
| `data-today`                      | `boolean` | Whether the date is today                     |
| `data-today-not-in-range`         | `boolean` | Today and not a visible range endpoint/middle |
| `data-outside-month`              | `boolean` | Whether the date is outside the visible month |
| `data-unavailable`                | `boolean` | Whether the date is unavailable               |
| `data-disabled`                   | `boolean` | Whether the date is disabled                  |
| `data-focused`                    | `boolean` | Whether the date is focused                   |
| `data-invalid`                    | `boolean` | Whether the date is invalid                   |
| `data-selected`                   | `boolean` | Whether the date is selected                  |
| `data-pressed`                    | `boolean` | Whether the cell is pressed                   |
| `data-range-start`                | `boolean` | First day of the selected range               |
| `data-range-end`                  | `boolean` | Last day of the selected range                |
| `data-range-filled`               | `boolean` | Range spans multiple days                     |
| `data-range-middle`               | `boolean` | Inside the range, not start or end            |
| `data-range-middle-row-start`     | `boolean` | Range middle at the start of a row            |
| `data-range-middle-row-end`       | `boolean` | Range middle at the end of a row              |
| `data-disabled-not-outside-month` | `boolean` | Disabled but within the visible month         |

#### CalendarCellBodyAnimation

Animation configuration for `RangeCalendar.CellBody` press feedback. Can be:

- `false` or `"disabled"`: Disable press animation
- `undefined`: Use default animation
- `object`: Custom animation configuration

| prop                 | type               | default             | description                       |
| -------------------- | ------------------ | ------------------- | --------------------------------- |
| `scale.value`        | `[number, number]` | `[1, 0.9]`          | Scale values [unpressed, pressed] |
| `scale.timingConfig` | `WithTimingConfig` | `{ duration: 120 }` | Animation timing configuration    |

### RangeCalendar.CellLabel

| prop              | type                      | default | description                                                                           |
| ----------------- | ------------------------- | ------- | ------------------------------------------------------------------------------------- |
| `children`        | `React.ReactNode`         | -       | Label text (usually the day number)                                                   |
| `cellRenderProps` | `CalendarCellRenderProps` | -       | Render props from `RangeCalendar.Cell`'s children callback; drives `data-*` selectors |
| `className`       | `string`                  | -       | Additional CSS classes for the label text                                             |
| `...TextProps`    | `TextProps`               | -       | All standard React Native Text props are supported                                    |

#### Data Attributes

Same data attributes as `RangeCalendar.CellBody`. See above.

### RangeCalendar.CellIndicator

| prop              | type                      | default | description                                                                           |
| ----------------- | ------------------------- | ------- | ------------------------------------------------------------------------------------- |
| `cellRenderProps` | `CalendarCellRenderProps` | -       | Render props from `RangeCalendar.Cell`'s children callback; drives `data-*` selectors |
| `className`       | `string`                  | -       | Additional CSS classes for the indicator dot container                                |
| `...ViewProps`    | `ViewProps`               | -       | All standard React Native View props are supported                                    |

#### Data Attributes

Same data attributes as `RangeCalendar.CellBody`. See above.

### RangeCalendar.YearPickerTrigger

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

### RangeCalendar.YearPickerTriggerHeading

| prop           | type                                                                             | default | description                                                 |
| -------------- | -------------------------------------------------------------------------------- | ------- | ----------------------------------------------------------- |
| `children`     | `React.ReactNode \| ((values: YearPickerTriggerRenderProps) => React.ReactNode)` | -       | Heading text or render function; auto-computed when omitted |
| `...TextProps` | `TextProps`                                                                      | -       | All standard React Native Text props are supported          |

### RangeCalendar.YearPickerTriggerIndicator

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

### RangeCalendar.YearPickerGrid

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

### RangeCalendar.YearPickerGridBody

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

### RangeCalendar.YearPickerCell

| prop                | type                                                                          | default | description                                             |
| ------------------- | ----------------------------------------------------------------------------- | ------- | ------------------------------------------------------- |
| `year`              | `number`                                                                      | -       | The year this cell represents (required)                |
| `isSelected`        | `boolean`                                                                     | -       | Whether this year is selected (required)                |
| `children`          | `React.ReactNode \| ((values: YearPickerCellRenderProps) => React.ReactNode)` | -       | Custom cell content or render function                  |
| `...PressableProps` | `PressableProps`                                                              | -       | All standard React Native Pressable props are supported |

## Hooks

### useRangeCalendar

Hook to access the range calendar state context. Must be used within a `RangeCalendar` component.

```tsx
import { useRangeCalendar } from 'heroui-native-pro';

const state = useRangeCalendar();
```

#### Returns: RangeCalendarState

| property            | type                                                                           | description                                              |
| ------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------- |
| `value`             | `RangeValue<DateValue> \| null`                                                | Currently selected date range                            |
| `setValue`          | `(value: RangeValue<DateValue> \| null) => void`                               | Set the selected date range                              |
| `highlightedRange`  | `RangeValue<CalendarDate> \| null`                                             | The currently highlighted range (committed or preview)   |
| `anchorDate`        | `CalendarDate \| null`                                                         | Anchor date the user clicked to begin range selection    |
| `setAnchorDate`     | `(date: CalendarDate \| null) => void`                                         | Set the anchor date                                      |
| `isDragging`        | `boolean`                                                                      | Whether the user is currently dragging over the calendar |
| `setDragging`       | `(isDragging: boolean) => void`                                                | Set the dragging state                                   |
| `highlightDate`     | `(date: CalendarDate) => void`                                                 | Highlight a date during range selection                  |
| `clearSelection`    | `() => void`                                                                   | Clear the current selection                              |
| `visibleRange`      | `RangeValue<CalendarDate>`                                                     | The date range currently visible in the calendar         |
| `focusedDate`       | `CalendarDate`                                                                 | Currently focused date                                   |
| `setFocusedDate`    | `(value: CalendarDate) => void`                                                | Set the focused date                                     |
| `isDisabled`        | `boolean`                                                                      | Whether the calendar is disabled                         |
| `isReadOnly`        | `boolean`                                                                      | Whether the calendar is read-only                        |
| `isValueInvalid`    | `boolean`                                                                      | Whether the current value is invalid                     |
| `timeZone`          | `string`                                                                       | Time zone of displayed dates                             |
| `minValue`          | `DateValue \| null \| undefined`                                               | Minimum allowed date                                     |
| `maxValue`          | `DateValue \| null \| undefined`                                               | Maximum allowed date                                     |
| `focusNextPage`     | `() => void`                                                                   | Navigate to the next month                               |
| `focusPreviousPage` | `() => void`                                                                   | Navigate to the previous month                           |
| `selectFocusedDate` | `() => void`                                                                   | Select the currently focused date                        |
| `selectDate`        | `(date: CalendarDate) => void`                                                 | Select a specific date                                   |
| `isSelected`        | `(date: CalendarDate) => boolean`                                              | Check if a date is selected                              |
| `isInvalid`         | `(date: CalendarDate) => boolean`                                              | Check if a date is invalid                               |
| `isCellDisabled`    | `(date: CalendarDate) => boolean`                                              | Check if a date cell is disabled                         |
| `isCellUnavailable` | `(date: CalendarDate) => boolean`                                              | Check if a date cell is unavailable                      |
| `isCellFocused`     | `(date: CalendarDate) => boolean`                                              | Check if a date cell is focused                          |
| `getDatesInWeek`    | `(weekIndex: number, startDate?: CalendarDate) => Array<CalendarDate \| null>` | Get dates for a week row                                 |
