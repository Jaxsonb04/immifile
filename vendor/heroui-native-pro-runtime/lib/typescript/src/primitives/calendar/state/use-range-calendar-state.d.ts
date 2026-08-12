import type { DateValue, MappedDateValue, RangeCalendarState, RangeValue, ValueBase } from './types';
import type { CalendarStateOptions } from './use-calendar-state';
/**
 * Range selection: `value` / `defaultValue` / `onChange` use {@link RangeValue}.
 * When combined with `isDateUnavailable`, `allowsNonContiguousRanges` permits ranges that include unavailable dates.
 */
export interface RangeCalendarStateOptions<T extends DateValue = DateValue> extends Omit<CalendarStateOptions<T>, 'value' | 'defaultValue' | 'onChange'>, ValueBase<RangeValue<T> | null, RangeValue<MappedDateValue<T>>> {
    allowsNonContiguousRanges?: boolean;
}
/** Alias for consumers mirroring React Spectrum naming. */
export type RangeCalendarProps<T extends DateValue = DateValue> = RangeCalendarStateOptions<T>;
/**
 * State for a range calendar: contiguous (or optionally non-contiguous) date range selection.
 * Composes {@link useCalendarState} for focus, visible range, and grid behavior.
 */
export declare function useRangeCalendarState<T extends DateValue = DateValue>(props: RangeCalendarStateOptions<T>): RangeCalendarState<T>;
//# sourceMappingURL=use-range-calendar-state.d.ts.map