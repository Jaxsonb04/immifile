import type { InputGroupInputProps } from 'heroui-native/input-group';
import type { SelectContentProps, SelectOverlayProps, SelectPortalProps, SelectRootProps, SelectTriggerIndicatorProps, SelectTriggerProps } from 'heroui-native/select';
import type { ViewProps } from 'react-native';
import type { AnimationRootDisableAll } from '../../helpers/internal/types';
import type { SelectOption } from '../../primitives/select';
import type { CalendarProps } from '../calendar/calendar.types';
import type { DatePickerOption } from '../date-picker/date-picker.types';
/**
 * Keyboard behavior for `DateField.Input`.
 *
 * - `"masked"`: digits only, auto-inserts `/` toward `dd/mm/yyyy`; blur commits a parsed date into the picker value.
 * - `"loose"`: uncontrolled text only — no masking, no parse or value commit on blur; the calendar still updates the field when a date is chosen.
 */
export type DateFieldInputMode = 'masked' | 'loose';
/**
 * Props for the `DateField` root.
 *
 * Managed selection uses `value` / `onValueChange` / `isOpen` / `onOpenChange` with **`DateField.Select`**
 * (not raw `Select`). Committed labels and masked input use `dd/mm/yyyy`; `inputMode="loose"` leaves the text input free-form.
 */
export interface DateFieldRootProps extends ViewProps {
    /**
     * Child elements (typically `Label`, `DateField.InputGroup`, `Description`, `FieldError`).
     */
    children?: React.ReactNode;
    /**
     * Whether the entire field is disabled.
     * @default false
     */
    isDisabled?: boolean;
    /**
     * Whether the field is in an invalid state.
     * @default false
     */
    isInvalid?: boolean;
    /**
     * Whether the field is required (e.g. asterisk on the label).
     * @default false
     */
    isRequired?: boolean;
    /**
     * Additional CSS classes on the root container.
     */
    className?: string;
    /**
     * Animation configuration for the root.
     * - `"disable-all"`: disable animations for the field subtree.
     */
    animation?: AnimationRootDisableAll;
    /**
     * Controlled selected option (ISO date in `value`, display in `label`).
     */
    value?: DatePickerOption;
    /**
     * Uncontrolled initial selected option.
     */
    defaultValue?: DatePickerOption;
    /**
     * Called when the selected date changes.
     */
    onValueChange?: (value: DatePickerOption | undefined) => void;
    /**
     * Controlled open state for the select surface.
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
     * BCP 47 locale; forwarded to `DateField.Calendar` when its own `locale` is omitted.
     */
    locale?: string;
    /**
     * Input keyboard behavior (see `DateFieldInputMode`).
     * @default "masked"
     */
    inputMode?: DateFieldInputMode;
}
/**
 * Context value for `DateField` text input (draft string + handlers).
 */
export interface DateFieldInputContextValue {
    /**
     * Mirrors `DateField` root `inputMode` — when `"masked"`, `DateField.Input` applies `maxLength={10}` for `dd/mm/yyyy`.
     */
    inputMode: DateFieldInputMode;
    inputText: string;
    onInputChangeText: (text: string) => void;
    onInputBlur: () => void;
}
/**
 * Props for `DateField.Select` — `Select` root without state props (wired from `DateField`).
 */
export type DateFieldSelectProps = Omit<SelectRootProps<'single'>, 'value' | 'defaultValue' | 'onValueChange' | 'isOpen' | 'isDefaultOpen' | 'onOpenChange' | 'selectionMode'>;
export type DateFieldPortalProps = SelectPortalProps;
export type DateFieldOverlayProps = SelectOverlayProps;
export type DateFieldContentProps = SelectContentProps;
/**
 * Props for `DateField.Calendar` — same contract as `DatePicker.Calendar`.
 */
export type DateFieldCalendarProps = Omit<CalendarProps, 'accessibilityLabel'> & {
    /**
     * Screen reader label for the calendar container.
     * @default "Pick a date"
     */
    accessibilityLabel?: string;
};
/**
 * Props for `DateField.Trigger` — pass-through to `Select.Trigger` (always `unstyled`).
 */
export type DateFieldTriggerProps = Omit<SelectTriggerProps, 'variant'>;
export type DateFieldTriggerIndicatorProps = SelectTriggerIndicatorProps;
/**
 * `DateField.Input` — `value` / `onChangeText` are driven by `DateField` input context.
 * Optional `onChangeText` runs after the internal handler; `onBlur` runs after internal commit.
 *
 * `isDisabled` defaults to `DateField` root `isDisabled` when omitted (unlike raw `InputGroup.Input`,
 * which cannot infer form state when the group defaults `isDisabled` to `false`).
 *
 * When the root `inputMode` is `"masked"`, `maxLength` is set to `10` (`dd/mm/yyyy`); otherwise `maxLength` follows this prop.
 */
export type DateFieldInputProps = Omit<InputGroupInputProps, 'value' | 'onChangeText'> & {
    onChangeText?: InputGroupInputProps['onChangeText'];
};
/**
 * Re-export for consumers tying custom state to the same option shape as `Select` single mode.
 */
export type DateFieldOption = SelectOption;
//# sourceMappingURL=date-field.types.d.ts.map