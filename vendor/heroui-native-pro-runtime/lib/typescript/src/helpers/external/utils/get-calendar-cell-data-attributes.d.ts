import type { CalendarCellRenderProps } from '../../../primitives/calendar';
/**
 * Every `data-*` prop applied to both the primitive calendar day pressable and range calendar
 * labels, derived from {@link CalendarCellRenderProps} plus interaction state.
 */
export type CalendarCellDataAttributes = {
    'data-today': boolean;
    'data-today-not-in-range': boolean;
    'data-outside-month': boolean;
    'data-unavailable': boolean;
    'data-disabled': boolean;
    'data-focused': boolean;
    'data-invalid': boolean;
    'data-readonly': boolean;
    'data-selected': boolean;
    'data-range-start': boolean;
    'data-range-end': boolean;
    'data-range-filled': boolean;
    'data-range-middle': boolean;
    'data-range-middle-row-start': boolean;
    'data-range-middle-row-end': boolean;
    'data-pressed': boolean;
    'data-disabled-not-outside-month': boolean;
};
/**
 * Input for {@link getCalendarCellDataAttributes}: render props from the calendar cell callback,
 * plus optional press/read-only state applied on the outer pressable.
 */
export type CalendarCellDataAttributesInput = {
    cellRenderProps?: CalendarCellRenderProps;
    isReadOnly?: boolean;
    isPressed?: boolean;
};
/**
 * Maps render props (and optional `isReadOnly` / `isPressed`) to a single `data-*` object for
 * the day cell pressable and for calendar/range `CellLabel` / `CellBody` slots.
 */
export declare function getCalendarCellDataAttributes(input: CalendarCellDataAttributesInput): CalendarCellDataAttributes;
//# sourceMappingURL=get-calendar-cell-data-attributes.d.ts.map