import type { DateDuration } from '@internationalized/date';
import type { DateValue } from './types';
declare const CalendarDate: typeof import("@internationalized/date").CalendarDate;
type CalendarDate = InstanceType<typeof CalendarDate>;
export declare function isInvalid(date: DateValue, minValue?: DateValue | null, maxValue?: DateValue | null): boolean;
export declare function alignCenter(date: CalendarDate, duration: DateDuration, locale: string, minValue?: DateValue | null, maxValue?: DateValue | null): CalendarDate;
export declare function alignStart(date: CalendarDate, duration: DateDuration, locale: string, minValue?: DateValue | null, maxValue?: DateValue | null): CalendarDate;
export declare function alignEnd(date: CalendarDate, duration: DateDuration, locale: string, minValue?: DateValue | null, maxValue?: DateValue | null): CalendarDate;
export declare function constrainStart(date: CalendarDate, aligned: CalendarDate, duration: DateDuration, locale: string, minValue?: DateValue | null, maxValue?: DateValue | null): CalendarDate;
export declare function constrainValue(date: CalendarDate, minValue?: DateValue | null, maxValue?: DateValue | null): CalendarDate;
/**
 * Walks backward from `date` until `isDateUnavailable` is false.
 * If `minBound` is set, stops when the previous day would be before `minBound`.
 */
export declare function previousAvailableDate(date: CalendarDate, minBound: CalendarDate | undefined, isDateUnavailable?: (date: CalendarDate) => boolean): CalendarDate | null;
export {};
//# sourceMappingURL=utils.d.ts.map