import type { WheelTimePickerHourFormat } from '../wheel-time-picker';
import type { TimePickerTimeDisplayFormat } from './time-picker.utils';
/**
 * Display names for each compound part, consumed by `displayName` assignments.
 */
export declare const DISPLAY_NAME: {
    ROOT: string;
    SELECT: string;
    PORTAL: string;
    OVERLAY: string;
    CONTENT: string;
    WHEEL: string;
    WHEEL_HOUR: string;
    WHEEL_MINUTE: string;
    WHEEL_PERIOD: string;
    WHEEL_INDICATOR: string;
    WHEEL_MASK: string;
    TRIGGER: string;
    VALUE: string;
    TRIGGER_INDICATOR: string;
};
/**
 * Default hour display mode for the wrapper and forwarded wheel.
 */
export declare const DEFAULT_HOUR_FORMAT: WheelTimePickerHourFormat;
/**
 * Default step between consecutive minute options.
 */
export declare const DEFAULT_MINUTE_INTERVAL = 1;
/**
 * Default preset used to build the trigger label.
 */
export declare const DEFAULT_TIME_DISPLAY_FORMAT: TimePickerTimeDisplayFormat;
//# sourceMappingURL=time-picker.constants.d.ts.map