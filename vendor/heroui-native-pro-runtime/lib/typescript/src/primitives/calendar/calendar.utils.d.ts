import type { CalendarDate } from '@internationalized/date';
import type { CalendarGridProps, CalendarRootProps } from './calendar.types';
declare const DateFormatter: typeof import("@internationalized/date").DateFormatter;
type DateFormatter = InstanceType<typeof DateFormatter>;
type CachedDateFormatterOptions = Pick<Intl.DateTimeFormatOptions, 'day' | 'month' | 'year' | 'weekday' | 'calendar' | 'timeZone'>;
/**
 * Returns a cached {@link DateFormatter} for the given locale and subset of options used by the
 * calendar primitives. Never invalidates — locales and time zones are effectively stable for the
 * lifetime of the app, and the total set of distinct keys is tiny.
 */
export declare function getCachedDateFormatter(locale: string, options: CachedDateFormatterOptions): DateFormatter;
/**
 * Number of week rows needed to display the month containing `monthAnchor`.
 */
export declare function getWeeksInMonth(monthAnchor: CalendarDate, locale: string, firstDayOfWeek: CalendarRootProps['firstDayOfWeek']): number;
/**
 * Localized weekday names for the calendar header row.
 */
export declare function getWeekdayLabels(locale: string, timeZone: string, style: NonNullable<CalendarGridProps['weekdayStyle']>, firstDayOfWeek?: CalendarRootProps['firstDayOfWeek']): string[];
export {};
//# sourceMappingURL=calendar.utils.d.ts.map