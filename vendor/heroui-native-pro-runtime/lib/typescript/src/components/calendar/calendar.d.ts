import { View } from 'react-native';
import type { CalendarCellRenderProps } from '../../primitives/calendar';
import { useCalendarStateContext } from '../../primitives/calendar';
import type { CalendarCellBodyProps, CalendarCellLabelProps, CalendarHeaderCellLabelProps } from './calendar.types';
declare const useCalendar: typeof useCalendarStateContext;
/**
 * Compound Calendar component with sub-components
 *
 * @component Calendar - Root wraps the primitive single-date calendar, applies Uniwind styles and optional
 * root-level animation settings via `AnimationSettingsProvider`.
 *
 * @component Calendar.Header - Toolbar row for navigation and title.
 * @component Calendar.Heading - Month/year label (primitive computes copy when children omitted).
 * @component Calendar.NavButton - Previous/next paging; default chevrons use theme accent and
 * `NAV_ICON_SIZE`, overridable via `iconProps` (`size`, `color`). Use `className` on the
 * pressable; pass `children` to replace the default icon.
 * @component Calendar.Grid - Month grid container; primitive sets `data-readonly` from calendar state.
 * @component Calendar.GridHeader - Weekday row; pass `children={(day) => ...}` (required). Typically
 * `{(day) => <HeaderCell day={day} />}` or `{(day) => <HeaderCell>{day}</HeaderCell>}` (string children
 * are wrapped in `HeaderCellLabel`, like `Chip`).
 * @component Calendar.GridBody - Renders weeks; read-only cells receive `pointer-events-none` via `data-[readonly=true]`.
 * @component Calendar.HeaderCell - Weekday column header. Stringifiable `children` become
 * `HeaderCellLabel`; pass `day` when omitting `children`.
 * @component Calendar.HeaderCellLabel - Text slot for a weekday header cell.
 * @component Calendar.Cell - Day cell; default renders `CellBody` → `CellLabel` with formatted day.
 * @component Calendar.CellBody - Inner rounded region; pass `cellRenderProps` for `data-*` selectors.
 * @component Calendar.CellLabel - Day label; pass `cellRenderProps` for `data-*` for Tailwind selectors.
 * @component Calendar.CellIndicator - Dot under a day; pass `cellRenderProps` for `data-selected` styling.
 *
 * State and locale come from primitive context (`useCalendar` / `useCalendarStateContext`) and internal locale context on the root.
 *
 */
declare const Calendar: import("react").ForwardRefExoticComponent<Omit<import("../../primitives/calendar").CalendarRootProps, "autoFocus" | "errorMessage" | "focusedValue" | "defaultFocusedValue" | "onFocusChange" | "pageBehavior" | "selectionAlignment" | "visibleDuration"> & {
    className?: string;
    animation?: import("../../helpers/internal/types").AnimationRootDisableAll;
    isYearPickerOpen?: boolean;
    defaultYearPickerOpen?: boolean;
    onYearPickerOpenChange?: (isOpen: boolean) => void;
} & import("react").RefAttributes<View>> & {
    /** @optional Header row (nav + heading). */
    Header: import("react").ForwardRefExoticComponent<import("react-native").ViewProps & {
        asChild?: boolean;
    } & {
        className?: string;
    } & import("react").RefAttributes<View>>;
    /** @optional Month/year title; primitive fills default string when empty. */
    Heading: import("react").ForwardRefExoticComponent<import("react-native").TextProps & {
        asChild?: boolean;
    } & {
        className?: string;
    } & import("react").RefAttributes<import("react-native").Text>>;
    /** @optional Previous / next month navigation controls. */
    NavButton: import("react").ForwardRefExoticComponent<Omit<import("../../helpers/internal/types").SlottablePressableProps, "disabled"> & {
        slot?: "previous" | "next";
        isDisabled?: boolean;
    } & {
        className?: string;
        iconProps?: import("./calendar.types").CalendarNavButtonIconProps;
    } & import("react").RefAttributes<View>>;
    /** @optional Month grid; provides internal grid context to body/header. */
    Grid: import("react").ForwardRefExoticComponent<import("react-native").ViewProps & {
        asChild?: boolean;
    } & {
        offset?: import("@internationalized/date").DateDuration;
        weekdayStyle?: "narrow" | "short" | "long";
    } & {
        className?: string;
    } & import("react").RefAttributes<View>>;
    /** @optional Weekday labels row. */
    GridHeader: import("react").ForwardRefExoticComponent<Omit<import("../../helpers/internal/types").SlottableViewProps, "children"> & {
        children: (day: string) => import("react").ReactElement;
    } & {
        className?: string;
    } & import("react").RefAttributes<View>>;
    /** @optional Day cells matrix. */
    GridBody: import("react").ForwardRefExoticComponent<Omit<import("../../helpers/internal/types").SlottableViewProps, "children"> & {
        children: (date: import("@internationalized/date").CalendarDate) => import("react").ReactElement;
    } & {
        className?: string;
    } & import("react").RefAttributes<View>>;
    /** @optional Single weekday header cell wrapper. */
    HeaderCell: import("react").ForwardRefExoticComponent<import("react-native").ViewProps & {
        asChild?: boolean;
    } & {
        day?: string;
        className?: string;
    } & import("react").RefAttributes<View>>;
    /** @optional Weekday label text inside `HeaderCell`. */
    HeaderCellLabel: import("react").ForwardRefExoticComponent<CalendarHeaderCellLabelProps & import("react").RefAttributes<import("react-native").Text>>;
    /** @optional Selectable day cell. */
    Cell: import("react").NamedExoticComponent<Omit<import("../../helpers/internal/types").SlottablePressableProps, "disabled" | "children"> & {
        date: import("@internationalized/date").CalendarDate;
        isDisabled?: boolean;
        children?: import("react").ReactNode | ((renderProps: CalendarCellRenderProps) => import("react").ReactNode);
    } & {
        className?: string;
    } & import("react").RefAttributes<View>>;
    /** @optional Inner body (shape/selection) inside `Cell`. */
    CellBody: import("react").ForwardRefExoticComponent<CalendarCellBodyProps & import("react").RefAttributes<View>>;
    /** @optional Default day label inside `CellBody`. */
    CellLabel: import("react").ForwardRefExoticComponent<CalendarCellLabelProps & import("react").RefAttributes<import("react-native").Text>>;
    /** @optional Marker under a day (e.g. events). */
    CellIndicator: import("react").ForwardRefExoticComponent<Omit<import("../../primitives/calendar").CalendarCellIndicatorProps, "isSelected"> & {
        cellRenderProps?: CalendarCellRenderProps;
        className?: string;
    } & import("react").RefAttributes<View>>;
    /** @optional Year picker trigger (replaces `Heading` when used). */
    YearPickerTrigger: import("react").ForwardRefExoticComponent<import("../calendar-year-picker").YearPickerTriggerProps & import("react").RefAttributes<View>>;
    YearPickerTriggerHeading: import("react").ForwardRefExoticComponent<import("../calendar-year-picker").YearPickerTriggerHeadingProps & import("react").RefAttributes<import("react-native").Text>>;
    YearPickerTriggerIndicator: import("react").ForwardRefExoticComponent<import("../calendar-year-picker").YearPickerTriggerIndicatorProps & import("react").RefAttributes<View>>;
    /** @optional Year picker overlay grid over `Grid`. */
    YearPickerGrid: import("react").ForwardRefExoticComponent<import("../calendar-year-picker").YearPickerGridProps & import("react").RefAttributes<View>>;
    YearPickerGridBody: import("react").ForwardRefExoticComponent<import("../calendar-year-picker").YearPickerGridBodyProps & import("react").RefAttributes<import("../../helpers/internal/types").FlatListRef>>;
    YearPickerCell: import("react").NamedExoticComponent<import("../calendar-year-picker").YearPickerCellProps & import("react").RefAttributes<View>>;
};
export { useCalendar };
export default Calendar;
//# sourceMappingURL=calendar.d.ts.map