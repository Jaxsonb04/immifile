import type { Calendar, CalendarDate, CalendarIdentifier, DateDuration } from '@internationalized/date';
import type { ReactElement, ReactNode } from 'react';
import type { PressableRef, SlottablePressableProps, SlottableTextProps, SlottableViewProps, TextRef, ViewRef } from '../../helpers/internal/types';
import type { CalendarState, DateValue, RangeCalendarState } from './state/types';
import type { CalendarStateOptions } from './state/use-calendar-state';
import type { RangeCalendarStateOptions } from './state/use-range-calendar-state';
/** Root ref — host is `View`. */
export type CalendarRootRef = ViewRef;
/** Props for `CalendarRoot` (stately options + RN view props). */
export type CalendarRootProps<T extends DateValue = DateValue> = Omit<CalendarStateOptions<T>, 'locale' | 'createCalendar'> & Omit<SlottableViewProps, 'children'> & {
    /** BCP 47 locale; defaults to the environment locale. */
    locale?: string;
    /** Override calendar factory (default: `createCalendar` from `@internationalized/date`). */
    createCalendar?: (identifier: CalendarIdentifier) => Calendar;
    children?: ReactNode | ((renderProps: {
        state: CalendarState;
    }) => ReactNode);
};
/** Root ref for range calendar — host is `View`. */
export type RangeCalendarRootRef = ViewRef;
/** Props for `RangeCalendarRoot` (range stately options + RN view props). */
export type RangeCalendarRootProps<T extends DateValue = DateValue> = Omit<RangeCalendarStateOptions<T>, 'locale' | 'createCalendar'> & Omit<SlottableViewProps, 'children'> & {
    locale?: string;
    createCalendar?: (identifier: CalendarIdentifier) => Calendar;
    children?: ReactNode | ((renderProps: {
        state: RangeCalendarState<T>;
    }) => ReactNode);
};
export type CalendarHeaderProps = SlottableViewProps;
export type CalendarHeaderRef = ViewRef;
export type CalendarHeadingProps = SlottableTextProps;
export type CalendarHeadingRef = TextRef;
export type CalendarNavButtonProps = Omit<SlottablePressableProps, 'disabled'> & {
    slot?: 'previous' | 'next';
    /** Merged with calendar `isDisabled` and range boundary navigation state. */
    isDisabled?: boolean;
};
export type CalendarNavButtonRef = PressableRef;
export type CalendarGridProps = SlottableViewProps & {
    /**
     * Offset from the start of the visible range for this grid (multi-month).
     */
    offset?: DateDuration;
    weekdayStyle?: 'narrow' | 'short' | 'long';
};
export type CalendarGridRef = ViewRef;
export type CalendarGridHeaderProps = Omit<SlottableViewProps, 'children'> & {
    children: (day: string) => ReactElement;
};
export type CalendarGridHeaderRef = ViewRef;
export type CalendarGridBodyProps = Omit<SlottableViewProps, 'children'> & {
    children: (date: CalendarDate) => ReactElement;
};
export type CalendarGridBodyRef = ViewRef;
export type CalendarHeaderCellProps = SlottableViewProps;
export type CalendarHeaderCellRef = ViewRef;
export type CalendarCellProps = Omit<SlottablePressableProps, 'children' | 'disabled'> & {
    date: CalendarDate;
    /** Merged with calendar range and `isCellDisabled` state for this date. */
    isDisabled?: boolean;
    children?: ReactNode | ((renderProps: CalendarCellRenderProps) => ReactNode);
};
export type CalendarCellRef = PressableRef;
export type CalendarCellRenderProps = {
    date: CalendarDate;
    formattedDate: string;
    isSelected: boolean;
    /**
     * Under {@link RangeCalendarRoot}, first day of the highlighted range; otherwise `false`.
     */
    isRangeStart: boolean;
    /**
     * Under {@link RangeCalendarRoot}, last day of the highlighted range; otherwise `false`.
     */
    isRangeEnd: boolean;
    /**
     * Under {@link RangeCalendarRoot}, the highlighted range (committed or preview) spans more
     * than one calendar day — use for strip / connector styling. `false` for single-date calendar,
     * a single-day range, or empty highlight.
     */
    isRangeFilled: boolean;
    isUnavailable: boolean;
    isDisabled: boolean;
    isOutsideMonth: boolean;
    isFocused: boolean;
    isToday: boolean;
    /** From `minValue` / `maxValue`, and under range calendars contiguous-segment rules. */
    isInvalid: boolean;
    /**
     * Strictly inside the highlighted range (not range start or end). `false` for single-date
     * calendars or when the range is a single day.
     */
    isRangeMiddle: boolean;
    /**
     * Strictly inside the range (neither range start nor end), and either the first weekday column
     * of the row or the first day of a month — for soft-fill left rounding without clashing with
     * `data-range-start` / `data-range-end` on the same cell.
     */
    isRangeMiddleRowStart: boolean;
    /**
     * Strictly inside the range (neither range start nor end), and either the last weekday column of
     * the row or the last day of a month — for soft-fill right rounding without clashing with range edges.
     */
    isRangeMiddleRowEnd: boolean;
    /**
     * Whether the day cell pressable is in a pressed (pointer down) state. Drives `data-pressed` on
     * slots that receive {@link CalendarCellRenderProps} (e.g. styled `CellBody`).
     */
    isPressed: boolean;
};
export type CalendarCellIndicatorProps = SlottableViewProps & {
    /**
     * When `true`, sets `data-selected` for `data-[selected=true]:` selectors (e.g. Uniwind).
     *
     * @default false
     */
    isSelected?: boolean;
};
export type CalendarCellIndicatorRef = ViewRef;
export type { CalendarDate } from '@internationalized/date';
export type { CalendarState, CalendarStateBase, DateValue, MappedDateValue, PageBehavior, RangeCalendarState, RangeValue, ValueBase, } from './state/types';
export type { CalendarProps, CalendarStateOptions, } from './state/use-calendar-state';
export type { RangeCalendarProps, RangeCalendarStateOptions, } from './state/use-range-calendar-state';
//# sourceMappingURL=calendar.types.d.ts.map