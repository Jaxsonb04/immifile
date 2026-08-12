import type { CalendarDate } from '@internationalized/date';
import type { SelectContentProps, SelectOverlayProps, SelectPortalProps, SelectRootProps, SelectTriggerIndicatorProps, SelectTriggerProps, SelectValueProps } from 'heroui-native/select';
import type { ViewProps } from 'react-native';
import type { AnimationRootDisableAll } from '../../helpers/internal/types';
import type { SelectOption } from '../../primitives/select';
import type { CalendarProps } from '../calendar/calendar.types';
import type { DatePickerDateDisplayFormat } from './date-picker.utils';
/**
 * Single-date option for `DatePicker` (same shape as single-mode `Select` value).
 */
export type DatePickerOption = SelectOption;
/**
 * Props for the `DatePicker` root.
 *
 * Use `value` / `onValueChange` / `isOpen` / `onOpenChange` here for managed state, and compose
 * with **`DatePicker.Select`** (not raw `Select`) so wiring applies. Omit those props if you
 * keep a fully manual `Select` (advanced).
 */
export interface DatePickerRootProps extends ViewProps {
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
     * Animation configuration for the date picker root
     * - `"disable-all"`: Disable all animations including children (cascades down to all child components)
     * - `undefined`: Use default animations
     */
    animation?: AnimationRootDisableAll;
    /**
     * Controlled selected option (single mode).
     */
    value?: DatePickerOption;
    /**
     * Uncontrolled initial selected option.
     */
    defaultValue?: DatePickerOption;
    /**
     * Called when the selected option changes.
     */
    onValueChange?: (value: DatePickerOption | undefined) => void;
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
     * Preset used to build the `label` when committing a date from `DatePicker.Calendar`.
     * Ignored when `formatDate` is set.
     * @default "medium"
     */
    dateDisplayFormat?: DatePickerDateDisplayFormat;
    /**
     * BCP 47 locale for preset label formatting (`dateDisplayFormat`).
     * Also defaults `DatePicker.Calendar` grid locale (month and weekday strings) unless you pass
     * `locale` on `DatePicker.Calendar`. Preset label formatting still defaults to `"en-US"` in the
     * formatter utility when this is omitted.
     */
    locale?: string;
    /**
     * When set, overrides `dateDisplayFormat` and `locale` for the generated label on commit.
     */
    formatDate?: (date: CalendarDate) => string;
}
/**
 * Props for `DatePicker.Select` — `Select` root without state props (those come from `DatePicker`).
 * `selectionMode` is always `'single'` internally.
 */
export type DatePickerSelectProps = Omit<SelectRootProps<'single'>, 'value' | 'defaultValue' | 'onValueChange' | 'isOpen' | 'isDefaultOpen' | 'onOpenChange' | 'selectionMode'>;
export type DatePickerPortalProps = SelectPortalProps;
export type DatePickerOverlayProps = SelectOverlayProps;
export type DatePickerContentProps = SelectContentProps;
/**
 * Props for `DatePicker.Calendar` — same as `Calendar` with a default root accessibility label.
 *
 * **`onChange`**: When set, it runs when the user selects a date **before** the default
 * commit (formatted label, select value update, overlay close). Use it for side effects or
 * analytics; selection still commits without implementing `onChange`.
 */
export type DatePickerCalendarProps = Omit<CalendarProps, 'accessibilityLabel'> & {
    /**
     * Screen reader label for the calendar container.
     *
     * @default "Pick a date"
     */
    accessibilityLabel?: string;
};
/**
 * Props for `DatePicker.Trigger` — extends `Select.Trigger` with invalid border styling.
 */
export interface DatePickerTriggerProps extends Omit<SelectTriggerProps, 'variant'> {
    /**
     * When `true`, applies a 1.5px danger border. When omitted, uses `FormField` context from `DatePicker`.
     */
    isInvalid?: boolean;
}
/**
 * Props for `DatePicker.Value` — extends `Select.Value` with a default placeholder.
 */
export type DatePickerValueProps = Omit<SelectValueProps, 'placeholder'> & {
    /**
     * Shown when no date is selected
     * @default "Choose a date"
     */
    placeholder?: string;
};
/**
 * Props for `DatePicker.TriggerIndicator` — same as `Select.TriggerIndicator`;
 * the default indicator is a calendar icon instead of a chevron.
 */
export type DatePickerTriggerIndicatorProps = SelectTriggerIndicatorProps;
//# sourceMappingURL=date-picker.types.d.ts.map