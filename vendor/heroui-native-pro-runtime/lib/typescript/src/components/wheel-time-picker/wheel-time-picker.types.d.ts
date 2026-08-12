import type { Time } from '@internationalized/date';
import type { ViewRef } from '../../helpers/internal/types';
import type { WheelPickerRootProps, WheelPickerRootRef } from '../wheel-picker';
import type { WheelPickerGroupIndicatorProps, WheelPickerGroupIndicatorRef, WheelPickerGroupMaskProps, WheelPickerGroupMaskRef, WheelPickerGroupRootAnimation, WheelPickerGroupRootProps } from '../wheel-picker-group';
/**
 * Hour display mode for {@link WheelTimePicker}.
 * - `12`: twelve-hour clock with an AM/PM period column.
 * - `24`: twenty-four-hour clock without a period column.
 */
export type WheelTimePickerHourFormat = 12 | 24;
/**
 * Canonical day-period value stored on the period column. Always `"AM"` or
 * `"PM"` regardless of the localized label shown to the user.
 */
export type WheelTimePickerPeriod = 'AM' | 'PM';
/**
 * Animation configuration for the {@link WheelTimePicker} root, aliased from
 * `WheelPickerGroupRootAnimation`. The root owns no animated styles of its own
 * — this prop only cascades `disable-all` to the underlying `WheelPickerGroup`
 * and its wheels.
 */
export type WheelTimePickerRootAnimation = WheelPickerGroupRootAnimation;
/**
 * Decomposed wheel selection used internally to bridge between a
 * {@link Time} value and the `WheelPickerGroup` values record.
 */
export interface WheelTimePickerValues {
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
    period?: WheelTimePickerPeriod;
}
/**
 * Props for the {@link WheelTimePicker} root component.
 *
 * Extends `WheelPickerGroupRootProps` (inheriting `children`, `itemHeight`,
 * `visibleCount`, `isDisabled`, `className`, `style`, and `animation`) minus
 * the value-record props the root manages internally from the `Time` value.
 */
export interface WheelTimePickerRootProps extends Omit<WheelPickerGroupRootProps, 'values' | 'defaultValues' | 'onValuesChange' | 'onValuesCommit'> {
    /**
     * Controlled selected time.
     */
    value?: Time;
    /**
     * Uncontrolled initial selected time.
     */
    defaultValue?: Time;
    /**
     * Fires whenever the selection changes — during scroll, on tap-to-focus,
     * and on imperative scrolls of a column. Receives the reconstructed time.
     */
    onValueChange?: (value: Time) => void;
    /**
     * Fires exactly once after every column has come to rest. Receives the
     * reconstructed time.
     */
    onValueCommit?: (value: Time) => void;
    /**
     * Hour display mode. Determines the hour column range and whether an
     * AM/PM period column is rendered by default.
     *
     * @default 12
     */
    hourFormat?: WheelTimePickerHourFormat;
    /**
     * Step between consecutive minute options. Must be a positive integer that
     * divides evenly into 60 for predictable results (e.g. `1`, `5`, `15`).
     *
     * @default 1
     */
    minuteInterval?: number;
    /**
     * BCP 47 locale used to localize the AM/PM period labels. Falls back to
     * `"en-US"`. The stored period value remains the canonical `"AM"` / `"PM"`.
     */
    locale?: string;
}
/**
 * Ref type for the {@link WheelTimePicker} root component.
 */
export type WheelTimePickerRootRef = ViewRef;
/**
 * Props for the {@link WheelTimePicker.Hour} column.
 *
 * Extends `WheelPicker` props minus `name` / `items`, which the root owns so
 * the stored value stays correct. Use `renderItem` / `classNames` / `styles`
 * to customize row content and appearance.
 */
export interface WheelTimePickerHourProps extends Omit<WheelPickerRootProps<number>, 'name' | 'items'> {
}
/**
 * Props for the {@link WheelTimePicker.Minute} column.
 *
 * Extends `WheelPicker` props minus `name` / `items` (root-owned).
 */
export interface WheelTimePickerMinuteProps extends Omit<WheelPickerRootProps<number>, 'name' | 'items'> {
}
/**
 * Props for the {@link WheelTimePicker.Period} column.
 *
 * Extends `WheelPicker` props minus `name` / `items` (root-owned).
 */
export interface WheelTimePickerPeriodProps extends Omit<WheelPickerRootProps<WheelTimePickerPeriod>, 'name' | 'items'> {
}
/**
 * Props for the {@link WheelTimePicker.Indicator} — same as
 * `WheelPickerGroup.Indicator`.
 */
export interface WheelTimePickerIndicatorProps extends WheelPickerGroupIndicatorProps {
}
/**
 * Props for the {@link WheelTimePicker.Mask} — same as `WheelPickerGroup.Mask`.
 */
export interface WheelTimePickerMaskProps extends WheelPickerGroupMaskProps {
}
/**
 * Ref type for the {@link WheelTimePicker.Hour} column.
 */
export type WheelTimePickerHourRef = WheelPickerRootRef;
/**
 * Ref type for the {@link WheelTimePicker.Minute} column.
 */
export type WheelTimePickerMinuteRef = WheelPickerRootRef;
/**
 * Ref type for the {@link WheelTimePicker.Period} column.
 */
export type WheelTimePickerPeriodRef = WheelPickerRootRef;
/**
 * Ref type for the {@link WheelTimePicker.Indicator} sub-component.
 */
export type WheelTimePickerIndicatorRef = WheelPickerGroupIndicatorRef;
/**
 * Ref type for the {@link WheelTimePicker.Mask} sub-component.
 */
export type WheelTimePickerMaskRef = WheelPickerGroupMaskRef;
//# sourceMappingURL=wheel-time-picker.types.d.ts.map