import type { WheelTimePickerHourFormat } from './wheel-time-picker.types';
/**
 * Display name constants for the WheelTimePicker compound component parts.
 */
export declare const DISPLAY_NAME: {
    readonly ROOT: "HeroUINative.WheelTimePicker.Root";
    readonly HOUR: "HeroUINative.WheelTimePicker.Hour";
    readonly MINUTE: "HeroUINative.WheelTimePicker.Minute";
    readonly PERIOD: "HeroUINative.WheelTimePicker.Period";
    readonly INDICATOR: "HeroUINative.WheelTimePicker.Indicator";
    readonly MASK: "HeroUINative.WheelTimePicker.Mask";
};
/**
 * Stable `name` keys for the wheel columns inside the underlying group.
 */
export declare const COLUMN_NAME: {
    readonly HOUR: "hour";
    readonly MINUTE: "minute";
    readonly PERIOD: "period";
};
/**
 * Default hour display mode.
 */
export declare const DEFAULT_HOUR_FORMAT: WheelTimePickerHourFormat;
/**
 * Default step between consecutive minute options.
 */
export declare const DEFAULT_MINUTE_INTERVAL = 1;
/**
 * Number of minutes in an hour. Used to bound the minute column.
 */
export declare const MINUTES_PER_HOUR = 60;
/**
 * Number of hours displayed in 12-hour mode.
 */
export declare const HOURS_IN_12H = 12;
/**
 * Number of hours displayed in 24-hour mode.
 */
export declare const HOURS_IN_24H = 24;
//# sourceMappingURL=wheel-time-picker.constants.d.ts.map