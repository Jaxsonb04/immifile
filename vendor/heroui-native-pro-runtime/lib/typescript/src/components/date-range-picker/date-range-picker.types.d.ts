import type { CalendarDate, DateValue } from '@internationalized/date';
import type { SelectContentProps, SelectOverlayProps, SelectPortalProps, SelectRootProps, SelectTriggerIndicatorProps, SelectTriggerProps, SelectValueProps } from 'heroui-native/select';
import type { ViewProps } from 'react-native';
import type { AnimationRootDisableAll } from '../../helpers/internal/types';
import type { RangeValue } from '../../primitives/calendar/state/types';
import type { SelectOption } from '../../primitives/select';
import type { RangeCalendarProps as CalendarRangeProps } from '../range-calendar/range-calendar.types';
import type { DateRangePickerDateDisplayFormat } from './date-range-picker.utils';
/**
 * Select option for `DateRangePicker`. **`value`** must be JSON: `{"start":"<ISO>","end":"<ISO>"}`
 * (calendar dates). Use `serializeDateRangeToSelectValue` when building values manually.
 */
export type DateRangePickerOption = SelectOption;
/**
 * Props for the `DateRangePicker` root.
 *
 * Use `value` / `onValueChange` / `isOpen` / `onOpenChange` here for managed state, and compose
 * with **`DateRangePicker.Select`** (not raw `Select`) so wiring applies. Omit those props if you
 * keep a fully manual `Select` (advanced).
 */
export interface DateRangePickerRootProps extends ViewProps {
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
     * Animation configuration for the date range picker root
     * - `"disable-all"`: Disable all animations including children (cascades down to all child components)
     * - `undefined`: Use default animations
     */
    animation?: AnimationRootDisableAll;
    /**
     * Controlled selected option (single `Select` option encoding the range).
     */
    value?: DateRangePickerOption;
    /**
     * Uncontrolled initial selected option.
     */
    defaultValue?: DateRangePickerOption;
    /**
     * Called when the selected option changes.
     */
    onValueChange?: (value: DateRangePickerOption | undefined) => void;
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
     * Preset used for each bound when building the `label` on commit.
     * Ignored when `formatDateRange` is set.
     * @default "medium"
     */
    dateDisplayFormat?: DateRangePickerDateDisplayFormat;
    /**
     * BCP 47 locale for preset label formatting (`dateDisplayFormat`).
     * Also defaults `DateRangePicker.Calendar` grid locale (month and weekday strings) unless you pass
     * `locale` on `DateRangePicker.Calendar`. Preset label formatting still defaults to `"en-US"` in the
     * formatter utility when this is omitted.
     */
    locale?: string;
    /**
     * When set, overrides preset formatting for the committed trigger label.
     */
    formatDateRange?: (start: CalendarDate, end: CalendarDate) => string;
    /**
     * Separator between formatted start and end when using presets (not when `formatDateRange` is set).
     * Same-day ranges collapse to a single formatted date.
     *
     * @default Unicode en dash (U+2013)
     */
    rangeSeparator?: string;
}
/**
 * Props for `DateRangePicker.Select` — `Select` root without state props (those come from `DateRangePicker`).
 * `selectionMode` is always `'single'` internally.
 */
export type DateRangePickerSelectProps = Omit<SelectRootProps<'single'>, 'value' | 'defaultValue' | 'onValueChange' | 'isOpen' | 'isDefaultOpen' | 'onOpenChange' | 'selectionMode'>;
export type DateRangePickerPortalProps = SelectPortalProps;
export type DateRangePickerOverlayProps = SelectOverlayProps;
export type DateRangePickerContentProps = SelectContentProps;
/**
 * Props for `DateRangePicker.Calendar` — same as `RangeCalendar` with a default accessibility label.
 *
 * **`onChange`**: Invoked for range updates (including `null` when clearing to start a new anchor).
 * The picker commits and closes only when a full range is completed; `null` does not update the trigger.
 */
export type DateRangePickerCalendarProps = Omit<CalendarRangeProps, 'accessibilityLabel' | 'onChange'> & {
    /**
     * Screen reader label for the calendar container.
     *
     * @default "Pick a date range"
     */
    accessibilityLabel?: string;
    /**
     * Called when the range value changes (including `null` while restarting selection).
     */
    onChange?: (value: RangeValue<DateValue> | null) => void;
};
/**
 * Props for `DateRangePicker.Trigger` — extends `Select.Trigger` with invalid border styling.
 */
export interface DateRangePickerTriggerProps extends Omit<SelectTriggerProps, 'variant'> {
    /**
     * When `true`, applies a 1.5px danger border. When omitted, uses `FormField` context from `DateRangePicker`.
     */
    isInvalid?: boolean;
}
/**
 * Props for `DateRangePicker.Value` — extends `Select.Value` with a default placeholder.
 */
export type DateRangePickerValueProps = Omit<SelectValueProps, 'placeholder'> & {
    /**
     * Shown when no range is selected
     * @default "Choose a date range"
     */
    placeholder?: string;
};
/**
 * Props for `DateRangePicker.TriggerIndicator` — same as `Select.TriggerIndicator`;
 * the default indicator is a calendar icon instead of a chevron.
 */
export type DateRangePickerTriggerIndicatorProps = SelectTriggerIndicatorProps;
//# sourceMappingURL=date-range-picker.types.d.ts.map