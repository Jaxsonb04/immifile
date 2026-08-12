import type { CalendarDate } from '@internationalized/date';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import type { CalendarRootProps } from './calendar.types';
import type { CalendarState, DateValue, RangeCalendarState } from './state/types';
declare const CalendarStateContext: import("react").Context<CalendarState>;
declare const RangeCalendarStateContext: import("react").Context<RangeCalendarState<DateValue>>;
/**
 * Returns calendar state from {@link CalendarRoot} or {@link RangeCalendarRoot}.
 */
declare function useCalendarStateContext(): CalendarState | RangeCalendarState<DateValue>;
type CalendarLocaleContextValue = {
    locale: string;
    firstDayOfWeek?: CalendarRootProps['firstDayOfWeek'];
};
/**
 * Returns locale and `firstDayOfWeek` from the nearest calendar / range-calendar root.
 */
declare function useCalendarLocale(): CalendarLocaleContextValue;
declare const CalendarRoot: import("react").ForwardRefExoticComponent<Omit<import("./calendar.types").CalendarStateOptions<DateValue>, "locale" | "createCalendar"> & Omit<import("../../helpers/internal/types").SlottableViewProps, "children"> & {
    locale?: string;
    createCalendar?: (identifier: import("@internationalized/date").CalendarIdentifier) => import("@internationalized/date").Calendar;
    children?: ReactNode | ((renderProps: {
        state: CalendarState;
    }) => ReactNode);
} & import("react").RefAttributes<View>>;
declare const RangeCalendarRoot: import("react").ForwardRefExoticComponent<Omit<import("./calendar.types").RangeCalendarStateOptions<DateValue>, "locale" | "createCalendar"> & Omit<import("../../helpers/internal/types").SlottableViewProps, "children"> & {
    locale?: string;
    createCalendar?: (identifier: import("@internationalized/date").CalendarIdentifier) => import("@internationalized/date").Calendar;
    children?: ReactNode | ((renderProps: {
        state: RangeCalendarState<DateValue>;
    }) => ReactNode);
} & import("react").RefAttributes<View>>;
declare const CalendarHeader: import("react").ForwardRefExoticComponent<import("react-native").ViewProps & {
    asChild?: boolean;
} & import("react").RefAttributes<View>>;
declare const CalendarHeading: import("react").ForwardRefExoticComponent<import("react-native").TextProps & {
    asChild?: boolean;
} & import("react").RefAttributes<Text>>;
declare const CalendarNavButton: import("react").ForwardRefExoticComponent<Omit<import("../../helpers/internal/types").SlottablePressableProps, "disabled"> & {
    slot?: "previous" | "next";
    isDisabled?: boolean;
} & import("react").RefAttributes<View>>;
declare const CalendarGrid: import("react").ForwardRefExoticComponent<import("react-native").ViewProps & {
    asChild?: boolean;
} & {
    offset?: import("@internationalized/date").DateDuration;
    weekdayStyle?: "narrow" | "short" | "long";
} & import("react").RefAttributes<View>>;
declare const CalendarGridHeader: import("react").ForwardRefExoticComponent<Omit<import("../../helpers/internal/types").SlottableViewProps, "children"> & {
    children: (day: string) => import("react").ReactElement;
} & import("react").RefAttributes<View>>;
declare const CalendarGridBody: import("react").ForwardRefExoticComponent<Omit<import("../../helpers/internal/types").SlottableViewProps, "children"> & {
    children: (date: CalendarDate) => import("react").ReactElement;
} & import("react").RefAttributes<View>>;
declare const CalendarHeaderCell: import("react").ForwardRefExoticComponent<import("react-native").ViewProps & {
    asChild?: boolean;
} & import("react").RefAttributes<View>>;
declare const CalendarCell: import("react").NamedExoticComponent<Omit<import("../../helpers/internal/types").SlottablePressableProps, "disabled" | "children"> & {
    date: CalendarDate;
    isDisabled?: boolean;
    children?: ReactNode | ((renderProps: import("./calendar.types").CalendarCellRenderProps) => ReactNode);
} & import("react").RefAttributes<View>>;
declare const CalendarCellIndicator: import("react").ForwardRefExoticComponent<import("react-native").ViewProps & {
    asChild?: boolean;
} & {
    isSelected?: boolean;
} & import("react").RefAttributes<View>>;
export { CalendarCell, CalendarCellIndicator, CalendarGrid, CalendarGridBody, CalendarGridHeader, CalendarHeader, CalendarHeaderCell, CalendarHeading, CalendarNavButton, CalendarRoot, CalendarStateContext, RangeCalendarRoot, RangeCalendarStateContext, useCalendarLocale, useCalendarStateContext, };
//# sourceMappingURL=calendar.d.ts.map