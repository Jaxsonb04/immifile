import { View } from 'react-native';
import type { CalendarCellRenderProps } from '../../primitives/calendar';
import { useCalendarStateContext } from '../../primitives/calendar';
import type { RangeCalendarCellBodyProps, RangeCalendarCellLabelProps, RangeCalendarHeaderCellLabelProps } from './range-calendar.types';
declare const useRangeCalendar: typeof useCalendarStateContext;
/**
 * Styled range calendar: same layout tokens as {@link Calendar}, with range selection and
 * `data-range-*` / `data-invalid` on cells and labels.
 */
declare const RangeCalendar: import("react").ForwardRefExoticComponent<Omit<import("../../primitives/calendar").RangeCalendarRootProps, "autoFocus" | "errorMessage" | "focusedValue" | "defaultFocusedValue" | "onFocusChange" | "pageBehavior" | "selectionAlignment" | "visibleDuration"> & {
    className?: string;
    animation?: import("../../helpers/internal/types").AnimationRootDisableAll;
    isYearPickerOpen?: boolean;
    defaultYearPickerOpen?: boolean;
    onYearPickerOpenChange?: (isOpen: boolean) => void;
} & import("react").RefAttributes<View>> & {
    Header: import("react").ForwardRefExoticComponent<import("react-native").ViewProps & {
        asChild?: boolean;
    } & {
        className?: string;
    } & import("react").RefAttributes<View>>;
    Heading: import("react").ForwardRefExoticComponent<import("react-native").TextProps & {
        asChild?: boolean;
    } & {
        className?: string;
    } & import("react").RefAttributes<import("react-native").Text>>;
    NavButton: import("react").ForwardRefExoticComponent<Omit<import("../../helpers/internal/types").SlottablePressableProps, "disabled"> & {
        slot?: "previous" | "next";
        isDisabled?: boolean;
    } & {
        className?: string;
        iconProps?: import("./range-calendar.types").RangeCalendarNavButtonIconProps;
    } & import("react").RefAttributes<View>>;
    Grid: import("react").ForwardRefExoticComponent<import("react-native").ViewProps & {
        asChild?: boolean;
    } & {
        offset?: import("@internationalized/date").DateDuration;
        weekdayStyle?: "narrow" | "short" | "long";
    } & {
        className?: string;
    } & import("react").RefAttributes<View>>;
    GridHeader: import("react").ForwardRefExoticComponent<Omit<import("../../helpers/internal/types").SlottableViewProps, "children"> & {
        children: (day: string) => import("react").ReactElement;
    } & {
        className?: string;
    } & import("react").RefAttributes<View>>;
    GridBody: import("react").ForwardRefExoticComponent<Omit<import("../../helpers/internal/types").SlottableViewProps, "children"> & {
        children: (date: import("@internationalized/date").CalendarDate) => import("react").ReactElement;
    } & {
        className?: string;
    } & import("react").RefAttributes<View>>;
    HeaderCell: import("react").ForwardRefExoticComponent<import("react-native").ViewProps & {
        asChild?: boolean;
    } & {
        day?: string;
        className?: string;
    } & import("react").RefAttributes<View>>;
    HeaderCellLabel: import("react").ForwardRefExoticComponent<RangeCalendarHeaderCellLabelProps & import("react").RefAttributes<import("react-native").Text>>;
    Cell: import("react").NamedExoticComponent<Omit<import("../../helpers/internal/types").SlottablePressableProps, "disabled" | "children"> & {
        date: import("@internationalized/date").CalendarDate;
        isDisabled?: boolean;
        children?: import("react").ReactNode | ((renderProps: CalendarCellRenderProps) => import("react").ReactNode);
    } & {
        className?: string;
    } & import("react").RefAttributes<View>>;
    CellBody: import("react").ForwardRefExoticComponent<RangeCalendarCellBodyProps & import("react").RefAttributes<View>>;
    CellLabel: import("react").ForwardRefExoticComponent<RangeCalendarCellLabelProps & import("react").RefAttributes<import("react-native").Text>>;
    CellIndicator: import("react").ForwardRefExoticComponent<Omit<import("../../primitives/calendar").CalendarCellIndicatorProps, "isSelected"> & {
        cellRenderProps?: CalendarCellRenderProps;
        className?: string;
    } & import("react").RefAttributes<View>>;
    YearPickerTrigger: import("react").ForwardRefExoticComponent<import("../calendar-year-picker").YearPickerTriggerProps & import("react").RefAttributes<View>>;
    YearPickerTriggerHeading: import("react").ForwardRefExoticComponent<import("../calendar-year-picker").YearPickerTriggerHeadingProps & import("react").RefAttributes<import("react-native").Text>>;
    YearPickerTriggerIndicator: import("react").ForwardRefExoticComponent<import("../calendar-year-picker").YearPickerTriggerIndicatorProps & import("react").RefAttributes<View>>;
    YearPickerGrid: import("react").ForwardRefExoticComponent<import("../calendar-year-picker").YearPickerGridProps & import("react").RefAttributes<View>>;
    YearPickerGridBody: import("react").ForwardRefExoticComponent<import("../calendar-year-picker").YearPickerGridBodyProps & import("react").RefAttributes<import("../../helpers/internal/types").FlatListRef>>;
    YearPickerCell: import("react").NamedExoticComponent<import("../calendar-year-picker").YearPickerCellProps & import("react").RefAttributes<View>>;
};
export { useRangeCalendar };
export default RangeCalendar;
//# sourceMappingURL=range-calendar.d.ts.map