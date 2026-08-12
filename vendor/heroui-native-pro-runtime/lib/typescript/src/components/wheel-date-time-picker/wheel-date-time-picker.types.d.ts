import type { CalendarDate, CalendarDateTime } from '@internationalized/date';
import type { ViewRef } from '../../helpers/internal/types';
import type { WheelPickerRootProps, WheelPickerRootRef } from '../wheel-picker';
import type { WheelPickerGroupIndicatorProps, WheelPickerGroupIndicatorRef, WheelPickerGroupMaskProps, WheelPickerGroupMaskRef, WheelPickerGroupRootAnimation, WheelPickerGroupRootProps } from '../wheel-picker-group';
import type { WheelTimePickerHourFormat, WheelTimePickerPeriod } from '../wheel-time-picker';
/**
 * Hour display mode for {@link WheelDateTimePicker}. Reuses the
 * {@link WheelTimePickerHourFormat} contract.
 * - `12`: twelve-hour clock with an AM/PM period column.
 * - `24`: twenty-four-hour clock without a period column.
 */
export type WheelDateTimePickerHourFormat = WheelTimePickerHourFormat;
/**
 * Canonical day-period value stored on the period column. Reuses the
 * {@link WheelTimePickerPeriod} contract. Always `"AM"` or `"PM"` regardless
 * of the localized label shown to the user.
 */
export type WheelDateTimePickerPeriod = WheelTimePickerPeriod;
/**
 * Formats a {@link CalendarDate} into the label rendered on a row of the date
 * column. Receives the option's date and, for context, whether it represents
 * the current day.
 */
export type WheelDateTimePickerFormatDate = (date: CalendarDate, context: {
    /** Whether `date` matches the current local day. */
    isToday: boolean;
}) => string;
/**
 * Animation configuration for the {@link WheelDateTimePicker} root, aliased
 * from `WheelPickerGroupRootAnimation`. The root owns no animated styles of
 * its own — this prop only cascades `disable-all` to the underlying
 * `WheelPickerGroup` and its wheels.
 */
export type WheelDateTimePickerRootAnimation = WheelPickerGroupRootAnimation;
/**
 * Decomposed wheel selection used internally to bridge between a
 * {@link CalendarDateTime} value and the `WheelPickerGroup` values record.
 */
export interface WheelDateTimePickerValues {
    /**
     * ISO calendar-date string (`"YYYY-MM-DD"`) identifying the selected day.
     */
    date: string;
    /**
     * Hour value. In 12-hour mode this is `1`–`12`; in 24-hour mode `0`–`23`.
     */
    hour: number;
    /**
     * Minute value, snapped to the active `minuteInterval`.
     */
    minute: number;
    /**
     * Day period. Present only in 12-hour mode.
     */
    period?: WheelDateTimePickerPeriod;
}
/**
 * Props for the {@link WheelDateTimePicker} root component.
 *
 * Extends `WheelPickerGroupRootProps` (inheriting `children`, `itemHeight`,
 * `visibleCount`, `isDisabled`, `className`, `style`, and `animation`) minus
 * the value-record props the root manages internally from the
 * `CalendarDateTime` value.
 */
export interface WheelDateTimePickerRootProps extends Omit<WheelPickerGroupRootProps, 'values' | 'defaultValues' | 'onValuesChange' | 'onValuesCommit'> {
    /**
     * Controlled selected date-time.
     */
    value?: CalendarDateTime;
    /**
     * Uncontrolled initial selected date-time.
     */
    defaultValue?: CalendarDateTime;
    /**
     * Fires whenever the selection changes — during scroll, on tap-to-focus,
     * and on imperative scrolls of a column. Receives the reconstructed
     * date-time.
     */
    onValueChange?: (value: CalendarDateTime) => void;
    /**
     * Fires exactly once after every column has come to rest. Receives the
     * reconstructed date-time.
     */
    onValueCommit?: (value: CalendarDateTime) => void;
    /**
     * Inclusive lower bound of the selectable date column.
     *
     * @default today(getLocalTimeZone())
     */
    minValue?: CalendarDate;
    /**
     * Inclusive upper bound of the selectable date column.
     *
     * @default today(getLocalTimeZone()).add({ years: 1 })
     */
    maxValue?: CalendarDate;
    /**
     * Hour display mode. Determines the hour column range and whether an
     * AM/PM period column is rendered by default.
     *
     * @default 12
     */
    hourFormat?: WheelDateTimePickerHourFormat;
    /**
     * Step between consecutive minute options. Must be a positive integer that
     * divides evenly into 60 for predictable results (e.g. `1`, `5`, `15`).
     *
     * @default 1
     */
    minuteInterval?: number;
    /**
     * BCP 47 locale used to localize the date column labels and the AM/PM
     * period labels. Falls back to `"en-US"`. The stored period value remains
     * the canonical `"AM"` / `"PM"`.
     */
    locale?: string;
    /**
     * Overrides the default date column label formatting. When omitted, the
     * current day renders as a localized "Today" and other days render as a
     * localized weekday + month + day (e.g. `"Wed, Jun 3"`).
     */
    formatDate?: WheelDateTimePickerFormatDate;
}
/**
 * Ref type for the {@link WheelDateTimePicker} root component.
 */
export type WheelDateTimePickerRootRef = ViewRef;
/**
 * Props for the {@link WheelDateTimePicker.Date} column.
 *
 * Extends `WheelPicker` props minus `name` / `items`, which the root owns so
 * the stored value stays correct. Each option's value is an ISO calendar-date
 * string (`"YYYY-MM-DD"`).
 */
export interface WheelDateTimePickerDateProps extends Omit<WheelPickerRootProps<string>, 'name' | 'items'> {
}
/**
 * Props for the {@link WheelDateTimePicker.Hour} column.
 *
 * Extends `WheelPicker` props minus `name` / `items` (root-owned).
 */
export interface WheelDateTimePickerHourProps extends Omit<WheelPickerRootProps<number>, 'name' | 'items'> {
}
/**
 * Props for the {@link WheelDateTimePicker.Minute} column.
 *
 * Extends `WheelPicker` props minus `name` / `items` (root-owned).
 */
export interface WheelDateTimePickerMinuteProps extends Omit<WheelPickerRootProps<number>, 'name' | 'items'> {
}
/**
 * Props for the {@link WheelDateTimePicker.Period} column.
 *
 * Extends `WheelPicker` props minus `name` / `items` (root-owned).
 */
export interface WheelDateTimePickerPeriodProps extends Omit<WheelPickerRootProps<WheelDateTimePickerPeriod>, 'name' | 'items'> {
}
/**
 * Props for the {@link WheelDateTimePicker.Indicator} — same as
 * `WheelPickerGroup.Indicator`.
 */
export interface WheelDateTimePickerIndicatorProps extends WheelPickerGroupIndicatorProps {
}
/**
 * Props for the {@link WheelDateTimePicker.Mask} — same as
 * `WheelPickerGroup.Mask`.
 */
export interface WheelDateTimePickerMaskProps extends WheelPickerGroupMaskProps {
}
/**
 * Ref type for the {@link WheelDateTimePicker.Date} column.
 */
export type WheelDateTimePickerDateRef = WheelPickerRootRef;
/**
 * Ref type for the {@link WheelDateTimePicker.Hour} column.
 */
export type WheelDateTimePickerHourRef = WheelPickerRootRef;
/**
 * Ref type for the {@link WheelDateTimePicker.Minute} column.
 */
export type WheelDateTimePickerMinuteRef = WheelPickerRootRef;
/**
 * Ref type for the {@link WheelDateTimePicker.Period} column.
 */
export type WheelDateTimePickerPeriodRef = WheelPickerRootRef;
/**
 * Ref type for the {@link WheelDateTimePicker.Indicator} sub-component.
 */
export type WheelDateTimePickerIndicatorRef = WheelPickerGroupIndicatorRef;
/**
 * Ref type for the {@link WheelDateTimePicker.Mask} sub-component.
 */
export type WheelDateTimePickerMaskRef = WheelPickerGroupMaskRef;
//# sourceMappingURL=wheel-date-time-picker.types.d.ts.map