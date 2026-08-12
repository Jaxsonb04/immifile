import type { WheelDateTimePickerHourFormat } from './wheel-date-time-picker.types';
/**
 * Display name constants for the WheelDateTimePicker compound component parts.
 */
export declare const DISPLAY_NAME: {
    readonly ROOT: "HeroUINative.WheelDateTimePicker.Root";
    readonly DATE: "HeroUINative.WheelDateTimePicker.Date";
    readonly HOUR: "HeroUINative.WheelDateTimePicker.Hour";
    readonly MINUTE: "HeroUINative.WheelDateTimePicker.Minute";
    readonly PERIOD: "HeroUINative.WheelDateTimePicker.Period";
    readonly INDICATOR: "HeroUINative.WheelDateTimePicker.Indicator";
    readonly MASK: "HeroUINative.WheelDateTimePicker.Mask";
};
/**
 * Stable `name` keys for the wheel columns inside the underlying group.
 */
export declare const COLUMN_NAME: {
    readonly DATE: "date";
    readonly HOUR: "hour";
    readonly MINUTE: "minute";
    readonly PERIOD: "period";
};
/**
 * Default hour display mode.
 */
export declare const DEFAULT_HOUR_FORMAT: WheelDateTimePickerHourFormat;
/**
 * Default step between consecutive minute options.
 */
export declare const DEFAULT_MINUTE_INTERVAL = 1;
/**
 * Number of years the default date range spans forward from today when no
 * explicit `maxValue` is provided.
 */
export declare const DEFAULT_DATE_RANGE_YEARS = 1;
//# sourceMappingURL=wheel-date-time-picker.constants.d.ts.map