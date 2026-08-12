import type { CalendarDate, CalendarDateTime } from '@internationalized/date';
import type { SelectContentProps, SelectOverlayProps, SelectPortalProps, SelectRootProps, SelectTriggerIndicatorProps, SelectTriggerProps, SelectValueProps } from 'heroui-native/select';
import type { ViewProps } from 'react-native';
import type { AnimationRootDisableAll } from '../../helpers/internal/types';
import type { SelectOption } from '../../primitives/select';
import type { WheelDateTimePickerDateProps, WheelDateTimePickerDateRef, WheelDateTimePickerFormatDate, WheelDateTimePickerHourFormat, WheelDateTimePickerHourProps, WheelDateTimePickerHourRef, WheelDateTimePickerIndicatorProps, WheelDateTimePickerIndicatorRef, WheelDateTimePickerMaskProps, WheelDateTimePickerMaskRef, WheelDateTimePickerMinuteProps, WheelDateTimePickerMinuteRef, WheelDateTimePickerPeriodProps, WheelDateTimePickerPeriodRef, WheelDateTimePickerRootProps } from '../wheel-date-time-picker';
import type { DateTimePickerDisplayFormat } from './date-time-picker.utils';
/**
 * Single date-time option for `DateTimePicker` (same shape as single-mode
 * `Select` value). `value` is an ISO date-time string
 * (e.g. `"2026-06-01T14:30:00"`); `label` is the display text.
 */
export type DateTimePickerOption = SelectOption;
/**
 * Props for the `DateTimePicker` root.
 *
 * Use `value` / `onValueChange` / `isOpen` / `onOpenChange` here for managed
 * state, and compose with **`DateTimePicker.Select`** (not raw `Select`) so
 * wiring applies. Omit those props if you keep a fully manual `Select`
 * (advanced).
 */
export interface DateTimePickerRootProps extends ViewProps {
    /**
     * Children elements to be rendered inside the root container
     */
    children?: React.ReactNode;
    /**
     * Whether the entire field is disabled
     * @default false
     */
    isDisabled?: boolean;
    /**
     * Whether the field is in an invalid state
     * @default false
     */
    isInvalid?: boolean;
    /**
     * Whether the field is required (e.g. asterisk in label)
     * @default false
     */
    isRequired?: boolean;
    /**
     * Additional CSS classes
     */
    className?: string;
    /**
     * Animation configuration for the date-time picker root
     * - `"disable-all"`: Disable all animations including children (cascades down to all child components)
     * - `undefined`: Use default animations
     */
    animation?: AnimationRootDisableAll;
    /**
     * Controlled selected option (single mode).
     */
    value?: DateTimePickerOption;
    /**
     * Uncontrolled initial selected option.
     */
    defaultValue?: DateTimePickerOption;
    /**
     * Called when the selected option changes.
     */
    onValueChange?: (value: DateTimePickerOption | undefined) => void;
    /**
     * Controlled open state of the select surface.
     */
    isOpen?: boolean;
    /**
     * Uncontrolled initial open state.
     */
    isDefaultOpen?: boolean;
    /**
     * Called when the open state changes.
     */
    onOpenChange?: (open: boolean) => void;
    /**
     * Inclusive lower bound of the selectable date column, forwarded to
     * `DateTimePicker.Wheel`.
     * @default today(getLocalTimeZone())
     */
    minValue?: CalendarDate;
    /**
     * Inclusive upper bound of the selectable date column, forwarded to
     * `DateTimePicker.Wheel`.
     * @default today(getLocalTimeZone()).add({ years: 1 })
     */
    maxValue?: CalendarDate;
    /**
     * Hour display mode forwarded to `DateTimePicker.Wheel` and used for label
     * formatting (12-hour adds an AM/PM marker).
     * @default 12
     */
    hourFormat?: WheelDateTimePickerHourFormat;
    /**
     * Step between consecutive minute options, forwarded to
     * `DateTimePicker.Wheel`.
     * @default 1
     */
    minuteInterval?: number;
    /**
     * Preset used to build the `label` when committing a date-time from
     * `DateTimePicker.Wheel`. Ignored when `formatDateTime` is set.
     * @default "short"
     */
    dateTimeDisplayFormat?: DateTimePickerDisplayFormat;
    /**
     * BCP 47 locale for preset label formatting and the wheel's localized date
     * and AM/PM labels. Preset label formatting defaults to `"en-US"` when
     * omitted.
     */
    locale?: string;
    /**
     * Overrides the wheel's date column label formatting, forwarded to
     * `DateTimePicker.Wheel`.
     */
    formatDate?: WheelDateTimePickerFormatDate;
    /**
     * When set, overrides `dateTimeDisplayFormat`, `hourFormat`, and `locale`
     * for the generated label on commit.
     */
    formatDateTime?: (value: CalendarDateTime) => string;
}
/**
 * Props for `DateTimePicker.Select` — `Select` root without state props (those
 * come from `DateTimePicker`). `selectionMode` is always `'single'`
 * internally.
 */
export type DateTimePickerSelectProps = Omit<SelectRootProps<'single'>, 'value' | 'defaultValue' | 'onValueChange' | 'isOpen' | 'isDefaultOpen' | 'onOpenChange' | 'selectionMode'>;
/**
 * Props for `DateTimePicker.Portal` — same as `Select.Portal`.
 */
export type DateTimePickerPortalProps = SelectPortalProps;
/**
 * Props for `DateTimePicker.Overlay` — same as `Select.Overlay`.
 */
export type DateTimePickerOverlayProps = SelectOverlayProps;
/**
 * Distributes `Omit` across each member of a union so the discriminated
 * `presentation` literal is preserved.
 */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
/**
 * Props for `DateTimePicker.Content`. Same as `Select.Content`, but the dialog
 * `isSwipeable` prop is removed — `DateTimePicker` always disables dialog
 * swipe-to-dismiss (and the bottom sheet defaults to no pan-down-to-close).
 */
export type DateTimePickerContentProps = DistributiveOmit<SelectContentProps, 'isSwipeable'>;
/**
 * Props for `DateTimePicker.Wheel` — same as `WheelDateTimePicker` minus the
 * value props, which are wired from `DateTimePicker` context.
 *
 * **Behavior**: each scroll updates the selected option (formatted label +
 * select value) live while the surface stays open. Closing is handled by the
 * `Select` surface (overlay tap, trigger toggle, or sheet dismiss).
 */
export type DateTimePickerWheelProps = Omit<WheelDateTimePickerRootProps, 'value' | 'defaultValue' | 'onValueChange'>;
/**
 * Props for `DateTimePicker.Trigger` — extends `Select.Trigger` with invalid
 * border styling.
 */
export interface DateTimePickerTriggerProps extends Omit<SelectTriggerProps, 'variant'> {
    /**
     * When `true`, applies a 1.5px danger border. When omitted, uses `FormField`
     * context from `DateTimePicker`.
     */
    isInvalid?: boolean;
}
/**
 * Props for `DateTimePicker.Value` — extends `Select.Value` with a default
 * placeholder.
 */
export type DateTimePickerValueProps = Omit<SelectValueProps, 'placeholder'> & {
    /**
     * Shown when no date-time is selected
     * @default "Choose a date & time"
     */
    placeholder?: string;
};
/**
 * Props for `DateTimePicker.TriggerIndicator` — same as
 * `Select.TriggerIndicator`; the default indicator is a calendar icon instead
 * of a chevron.
 */
export type DateTimePickerTriggerIndicatorProps = SelectTriggerIndicatorProps;
/**
 * Props for `DateTimePicker.WheelDate` — same as `WheelDateTimePicker.Date`.
 */
export type DateTimePickerWheelDateProps = WheelDateTimePickerDateProps;
/**
 * Ref for `DateTimePicker.WheelDate`.
 */
export type DateTimePickerWheelDateRef = WheelDateTimePickerDateRef;
/**
 * Props for `DateTimePicker.WheelHour` — same as `WheelDateTimePicker.Hour`.
 */
export type DateTimePickerWheelHourProps = WheelDateTimePickerHourProps;
/**
 * Ref for `DateTimePicker.WheelHour`.
 */
export type DateTimePickerWheelHourRef = WheelDateTimePickerHourRef;
/**
 * Props for `DateTimePicker.WheelMinute` — same as
 * `WheelDateTimePicker.Minute`.
 */
export type DateTimePickerWheelMinuteProps = WheelDateTimePickerMinuteProps;
/**
 * Ref for `DateTimePicker.WheelMinute`.
 */
export type DateTimePickerWheelMinuteRef = WheelDateTimePickerMinuteRef;
/**
 * Props for `DateTimePicker.WheelPeriod` — same as
 * `WheelDateTimePicker.Period`.
 */
export type DateTimePickerWheelPeriodProps = WheelDateTimePickerPeriodProps;
/**
 * Ref for `DateTimePicker.WheelPeriod`.
 */
export type DateTimePickerWheelPeriodRef = WheelDateTimePickerPeriodRef;
/**
 * Props for `DateTimePicker.WheelIndicator` — same as
 * `WheelDateTimePicker.Indicator`.
 */
export type DateTimePickerWheelIndicatorProps = WheelDateTimePickerIndicatorProps;
/**
 * Ref for `DateTimePicker.WheelIndicator`.
 */
export type DateTimePickerWheelIndicatorRef = WheelDateTimePickerIndicatorRef;
/**
 * Props for `DateTimePicker.WheelMask` — same as `WheelDateTimePicker.Mask`.
 * When `color` is omitted it defaults to the Select `overlay` surface color so
 * the gradient blends with the popover / dialog / bottom-sheet background.
 */
export type DateTimePickerWheelMaskProps = WheelDateTimePickerMaskProps;
/**
 * Ref for `DateTimePicker.WheelMask`.
 */
export type DateTimePickerWheelMaskRef = WheelDateTimePickerMaskRef;
export {};
//# sourceMappingURL=date-time-picker.types.d.ts.map