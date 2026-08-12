# WheelDateTimePicker

A standalone wheel date-time selector built on `WheelPickerGroup` that exchanges an `@internationalized/date` `CalendarDateTime` value.

## Import

```tsx
import { WheelDateTimePicker } from 'heroui-native-pro';
```

## Anatomy

```tsx
<WheelDateTimePicker>
  <WheelDateTimePicker.Date />
  <WheelDateTimePicker.Hour />
  <WheelDateTimePicker.Minute />
  <WheelDateTimePicker.Period />
  <WheelDateTimePicker.Indicator />
  <WheelDateTimePicker.Mask />
</WheelDateTimePicker>
```

- **WheelDateTimePicker**: Root container. Owns the `CalendarDateTime` value, builds the column item data from `minValue` / `maxValue` / `hourFormat` / `minuteInterval` / `locale`, and drives the underlying `WheelPickerGroup`. When `children` are omitted it renders the full default set (`Date`, `Hour`, `Minute`, `Period` in 12-hour mode, `Indicator`, `Mask`).
- **WheelDateTimePicker.Date**: Combined day column spanning `[minValue, maxValue]`. The root owns its `name` and `items`; each option's value is an ISO calendar-date string (`"YYYY-MM-DD"`).
- **WheelDateTimePicker.Hour**: Hour column. Root-owned `name` / `items`.
- **WheelDateTimePicker.Minute**: Minute column stepped by the active `minuteInterval`. Root-owned `name` / `items`.
- **WheelDateTimePicker.Period**: AM/PM period column rendered by default in 12-hour mode. Root-owned `name` / `items`.
- **WheelDateTimePicker.Indicator**: Shared selection band spanning every column (`WheelPickerGroup.Indicator`).
- **WheelDateTimePicker.Mask**: Top / bottom fade overlays spanning the full group viewport (`WheelPickerGroup.Mask`).

## Usage

### Basic usage

Bind `value` / `onValueChange` to a `CalendarDateTime`. With no children the picker renders date, hour, minute, an AM/PM period column (12-hour default), indicator, and mask.

```tsx
import { CalendarDateTime } from '@internationalized/date';

const [value, setValue] = useState(new CalendarDateTime(2026, 6, 1, 9, 30));

<WheelDateTimePicker value={value} onValueChange={setValue} />;
```

### Uncontrolled

Pass `defaultValue` to seed the initial selection without managing external state.

```tsx
import { CalendarDateTime } from '@internationalized/date';

<WheelDateTimePicker
  defaultValue={new CalendarDateTime(2026, 6, 1, 9, 30)}
  onValueChange={(next) => console.log(next)}
/>;
```

### Bounded date range

Limit the selectable days with `minValue` / `maxValue` (`CalendarDate`). When omitted, the range defaults to today through today + 1 year, and is always widened to include the active `value`.

```tsx
import { today, getLocalTimeZone } from '@internationalized/date';

const start = today(getLocalTimeZone());

<WheelDateTimePicker
  minValue={start}
  maxValue={start.add({ months: 3 })}
  value={value}
  onValueChange={setValue}
/>;
```

### 24-hour mode

Set `hourFormat={24}` for a `0`–`23` hour column with no period column.

```tsx
<WheelDateTimePicker hourFormat={24} value={value} onValueChange={setValue} />
```

### Minute interval

Step the minute column with `minuteInterval` for appointment-style selection.

```tsx
<WheelDateTimePicker
  minuteInterval={15}
  value={value}
  onValueChange={setValue}
/>
```

### Localized labels

Localize the date and AM/PM labels via `locale`. The stored period value stays the canonical `"AM"` / `"PM"`.

```tsx
<WheelDateTimePicker locale="zh-CN" value={value} onValueChange={setValue} />
```

### Custom date label

Override the date column label formatting with `formatDate`.

```tsx
<WheelDateTimePicker
  value={value}
  onValueChange={setValue}
  formatDate={(date, { isToday }) =>
    isToday ? 'Today' : `${date.month}/${date.day}`
  }
/>
```

### Commit on rest

`onValueCommit` fires exactly once after every column has come to rest.

```tsx
<WheelDateTimePicker
  value={value}
  onValueChange={setValue}
  onValueCommit={(next) => saveDateTime(next)}
/>
```

### Custom composition

Pass children to take full ownership of column order, content, and styling. Style each column through its `classNames` and the shared band through `WheelDateTimePicker.Indicator`.

```tsx
<WheelDateTimePicker
  hourFormat={24}
  itemHeight={56}
  value={value}
  onValueChange={setValue}
>
  <WheelDateTimePicker.Date
    classNames={{ itemLabel: 'text-lg font-semibold' }}
  />
  <WheelDateTimePicker.Hour
    classNames={{ itemLabel: 'text-3xl font-semibold' }}
  />
  <WheelDateTimePicker.Minute
    classNames={{ itemLabel: 'text-3xl font-semibold' }}
  />
  <WheelDateTimePicker.Indicator
    classNames={{ highlight: 'rounded-full bg-accent-soft' }}
  />
  <WheelDateTimePicker.Mask />
</WheelDateTimePicker>
```

### Disabled

Block interaction and dim the picker with `isDisabled`.

```tsx
<WheelDateTimePicker
  isDisabled
  defaultValue={new CalendarDateTime(2026, 6, 1, 10, 45)}
/>
```

## API Reference

### WheelDateTimePicker

| prop             | type                                | default      | description                                                                                                                                      |
| ---------------- | ----------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `children`       | `React.ReactNode`                   | -            | Compound children. When omitted, the root renders the full default set (`Date`, `Hour`, `Minute`, `Period` in 12-hour mode, `Indicator`, `Mask`) |
| `itemHeight`     | `number`                            | `44`         | Pixel height of a single row, shared by all columns                                                                                              |
| `visibleCount`   | `number`                            | `5`          | Number of visible rows, shared by all columns. Must be odd                                                                                       |
| `minValue`       | `CalendarDate`                      | `today`      | Inclusive lower bound of the selectable date column                                                                                              |
| `maxValue`       | `CalendarDate`                      | `today + 1y` | Inclusive upper bound of the selectable date column                                                                                              |
| `hourFormat`     | `WheelDateTimePickerHourFormat`     | `12`         | Hour display mode. Determines the hour column range and whether an AM/PM period column is rendered by default                                    |
| `minuteInterval` | `number`                            | `1`          | Step between consecutive minute options. Should be a positive integer that divides evenly into 60                                                |
| `locale`         | `string`                            | `en-US`      | BCP 47 locale used to localize the date and AM/PM labels. The stored period value remains the canonical `"AM"` / `"PM"`                          |
| `formatDate`     | `WheelDateTimePickerFormatDate`     | -            | Overrides the default date column label formatting                                                                                               |
| `value`          | `CalendarDateTime`                  | -            | Controlled selected date-time                                                                                                                    |
| `defaultValue`   | `CalendarDateTime`                  | -            | Uncontrolled initial selected date-time                                                                                                          |
| `isDisabled`     | `boolean`                           | `false`      | Disables interaction for every column                                                                                                            |
| `className`      | `string`                            | -            | Additional CSS classes for the group container                                                                                                   |
| `onValueChange`  | `(value: CalendarDateTime) => void` | -            | Fires whenever the selection changes — during scroll, on tap-to-focus, and on imperative column scrolls                                          |
| `onValueCommit`  | `(value: CalendarDateTime) => void` | -            | Fires exactly once after every column has come to rest                                                                                           |
| `animation`      | `WheelDateTimePickerRootAnimation`  | -            | Animation configuration. Cascades `disable-all` to the underlying group and its wheels                                                           |
| `ref`            | `WheelDateTimePickerRootRef`        | -            | Forwarded to the underlying group root `View`                                                                                                    |
| `...ViewProps`   | `Omit<ViewProps, 'children'>`       | -            | All standard React Native View props are supported (minus the value-record props the root manages internally)                                    |

#### WheelDateTimePickerHourFormat

Hour display mode (aliased from `WheelTimePickerHourFormat`).

- `12`: twelve-hour clock with an AM/PM period column.
- `24`: twenty-four-hour clock without a period column.

#### WheelDateTimePickerPeriod

Canonical day-period value stored on the period column. Always `"AM"` or `"PM"` regardless of the localized label shown to the user.

#### WheelDateTimePickerFormatDate

`(date: CalendarDate, context: { isToday: boolean }) => string`

Formats a `CalendarDate` into the label rendered on a row of the date column.

#### WheelDateTimePickerRootAnimation

Animation configuration for the root, aliased from `WheelPickerGroupRootAnimation`. The root owns no animated styles of its own — this prop only cascades the `disable-all` state to the underlying group and its wheels.

- `"disable-all"`: Disable all animations including the columns (rows snap without fading or scaling).
- `undefined`: Use default animations.

#### WheelDateTimePickerValues

Decomposed wheel selection used to bridge between a `CalendarDateTime` value and the group values record.

| prop     | type                        | description                                                    |
| -------- | --------------------------- | -------------------------------------------------------------- |
| `date`   | `string`                    | ISO calendar-date string (`"YYYY-MM-DD"`) for the selected day |
| `hour`   | `number`                    | Hour value. `1`–`12` in 12-hour mode, `0`–`23` in 24-hour mode |
| `minute` | `number`                    | Minute value, snapped to the active `minuteInterval`           |
| `period` | `WheelDateTimePickerPeriod` | Day period. Present only in 12-hour mode                       |

### WheelDateTimePicker.Date

Combined day column. The root owns `name` and `items`; the value and `onValueChange` are managed by the root via the group. Each option's value is an ISO calendar-date string. Extends `WheelPicker` props (minus `name` / `items`).

### WheelDateTimePicker.Hour

Hour column. The root owns `name` and `items`. Extends `WheelPicker` props (minus `name` / `items`). The `itemLabel` slot keeps numerals tabular by default.

### WheelDateTimePicker.Minute

Minute column. Same props as `WheelDateTimePicker.Hour`. The `itemLabel` slot keeps numerals tabular by default.

### WheelDateTimePicker.Period

AM/PM period column rendered by default in 12-hour mode. Same props as `WheelDateTimePicker.Hour`, with a `WheelDateTimePickerPeriod` value type. Root-owned `name` / `items`.

### WheelDateTimePicker.Indicator

Shared selection band spanning every column. Same props as `WheelPickerGroup.Indicator`.

### WheelDateTimePicker.Mask

Top / bottom fade overlays spanning the full group viewport. Same props as `WheelPickerGroup.Mask`.
