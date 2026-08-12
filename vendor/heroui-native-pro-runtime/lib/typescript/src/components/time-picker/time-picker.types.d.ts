import type { Time } from '@internationalized/date';
import type { SelectContentProps, SelectOverlayProps, SelectPortalProps, SelectRootProps, SelectTriggerIndicatorProps, SelectTriggerProps, SelectValueProps } from 'heroui-native/select';
import type { ViewProps } from 'react-native';
import type { AnimationRootDisableAll } from '../../helpers/internal/types';
import type { SelectOption } from '../../primitives/select';
import type { WheelTimePickerHourFormat, WheelTimePickerHourProps, WheelTimePickerHourRef, WheelTimePickerIndicatorProps, WheelTimePickerIndicatorRef, WheelTimePickerMaskProps, WheelTimePickerMaskRef, WheelTimePickerMinuteProps, WheelTimePickerMinuteRef, WheelTimePickerPeriodProps, WheelTimePickerPeriodRef, WheelTimePickerRootProps } from '../wheel-time-picker';
import type { TimePickerTimeDisplayFormat } from './time-picker.utils';
/**
 * Single-time option for `TimePicker` (same shape as single-mode `Select` value).
 * `value` is an ISO time string (e.g. `"14:30:00"`); `label` is the display text.
 */
export type TimePickerOption = SelectOption;
/**
 * Props for the `TimePicker` root.
 *
 * Use `value` / `onValueChange` / `isOpen` / `onOpenChange` here for managed
 * state, and compose with **`TimePicker.Select`** (not raw `Select`) so wiring
 * applies. Omit those props if you keep a fully manual `Select` (advanced).
 */
export interface TimePickerRootProps extends ViewProps {
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
     * Animation configuration for the time picker root
     * - `"disable-all"`: Disable all animations including children (cascades down to all child components)
     * - `undefined`: Use default animations
     */
    animation?: AnimationRootDisableAll;
    /**
     * Controlled selected option (single mode).
     */
    value?: TimePickerOption;
    /**
     * Uncontrolled initial selected option.
     */
    defaultValue?: TimePickerOption;
    /**
     * Called when the selected option changes.
     */
    onValueChange?: (value: TimePickerOption | undefined) => void;
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
     * Hour display mode forwarded to `TimePicker.Wheel` and used for label
     * formatting (12-hour adds an AM/PM marker).
     * @default 12
     */
    hourFormat?: WheelTimePickerHourFormat;
    /**
     * Step between consecutive minute options, forwarded to `TimePicker.Wheel`.
     * @default 1
     */
    minuteInterval?: number;
    /**
     * Preset used to build the `label` when committing a time from
     * `TimePicker.Wheel`. Ignored when `formatTime` is set.
     * @default "short"
     */
    timeDisplayFormat?: TimePickerTimeDisplayFormat;
    /**
     * BCP 47 locale for preset label formatting and the wheel's localized
     * AM/PM labels. Preset label formatting defaults to `"en-US"` when omitted.
     */
    locale?: string;
    /**
     * When set, overrides `timeDisplayFormat`, `hourFormat`, and `locale` for
     * the generated label on commit.
     */
    formatTime?: (time: Time) => string;
}
/**
 * Props for `TimePicker.Select` — `Select` root without state props (those come from `TimePicker`).
 * `selectionMode` is always `'single'` internally.
 */
export type TimePickerSelectProps = Omit<SelectRootProps<'single'>, 'value' | 'defaultValue' | 'onValueChange' | 'isOpen' | 'isDefaultOpen' | 'onOpenChange' | 'selectionMode'>;
/**
 * Props for `TimePicker.Portal` — same as `Select.Portal`.
 */
export type TimePickerPortalProps = SelectPortalProps;
/**
 * Props for `TimePicker.Overlay` — same as `Select.Overlay`.
 */
export type TimePickerOverlayProps = SelectOverlayProps;
/**
 * Distributes `Omit` across each member of a union so the discriminated
 * `presentation` literal is preserved.
 */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
/**
 * Props for `TimePicker.Content`. Same as `Select.Content`, but the dialog
 * `isSwipeable` prop is removed — `TimePicker` always disables dialog
 * swipe-to-dismiss (and the bottom sheet defaults to no pan-down-to-close).
 */
export type TimePickerContentProps = DistributiveOmit<SelectContentProps, 'isSwipeable'>;
/**
 * Props for `TimePicker.Wheel` — same as `WheelTimePicker` minus the value
 * props, which are wired from `TimePicker` context.
 *
 * **Behavior**: each scroll updates the selected option (formatted label +
 * select value) live while the surface stays open. Closing is handled by the
 * `Select` surface (overlay tap, trigger toggle, or sheet dismiss).
 */
export type TimePickerWheelProps = Omit<WheelTimePickerRootProps, 'value' | 'defaultValue' | 'onValueChange'>;
/**
 * Props for `TimePicker.Trigger` — extends `Select.Trigger` with invalid border styling.
 */
export interface TimePickerTriggerProps extends Omit<SelectTriggerProps, 'variant'> {
    /**
     * When `true`, applies a 1.5px danger border. When omitted, uses `FormField` context from `TimePicker`.
     */
    isInvalid?: boolean;
}
/**
 * Props for `TimePicker.Value` — extends `Select.Value` with a default placeholder.
 */
export type TimePickerValueProps = Omit<SelectValueProps, 'placeholder'> & {
    /**
     * Shown when no time is selected
     * @default "Choose a time"
     */
    placeholder?: string;
};
/**
 * Props for `TimePicker.TriggerIndicator` — same as `Select.TriggerIndicator`;
 * the default indicator is a clock icon instead of a chevron.
 */
export type TimePickerTriggerIndicatorProps = SelectTriggerIndicatorProps;
/**
 * Props for `TimePicker.WheelHour` — same as `WheelTimePicker.Hour`.
 */
export type TimePickerWheelHourProps = WheelTimePickerHourProps;
/**
 * Ref for `TimePicker.WheelHour`.
 */
export type TimePickerWheelHourRef = WheelTimePickerHourRef;
/**
 * Props for `TimePicker.WheelMinute` — same as `WheelTimePicker.Minute`.
 */
export type TimePickerWheelMinuteProps = WheelTimePickerMinuteProps;
/**
 * Ref for `TimePicker.WheelMinute`.
 */
export type TimePickerWheelMinuteRef = WheelTimePickerMinuteRef;
/**
 * Props for `TimePicker.WheelPeriod` — same as `WheelTimePicker.Period`.
 */
export type TimePickerWheelPeriodProps = WheelTimePickerPeriodProps;
/**
 * Ref for `TimePicker.WheelPeriod`.
 */
export type TimePickerWheelPeriodRef = WheelTimePickerPeriodRef;
/**
 * Props for `TimePicker.WheelIndicator` — same as `WheelTimePicker.Indicator`.
 */
export type TimePickerWheelIndicatorProps = WheelTimePickerIndicatorProps;
/**
 * Ref for `TimePicker.WheelIndicator`.
 */
export type TimePickerWheelIndicatorRef = WheelTimePickerIndicatorRef;
/**
 * Props for `TimePicker.WheelMask` — same as `WheelTimePicker.Mask`. When
 * `color` is omitted it defaults to the Select `overlay` surface color so the
 * gradient blends with the popover / dialog / bottom-sheet background.
 */
export type TimePickerWheelMaskProps = WheelTimePickerMaskProps;
/**
 * Ref for `TimePicker.WheelMask`.
 */
export type TimePickerWheelMaskRef = WheelTimePickerMaskRef;
export {};
//# sourceMappingURL=time-picker.types.d.ts.map