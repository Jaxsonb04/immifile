import type { ReactNode } from 'react';
import type { TextProps, ViewProps } from 'react-native';
import type { AnimationRootDisableAll } from '../../helpers/internal/types';
import type { CalendarCellRenderProps, CalendarCellIndicatorProps as CalendarPrimitiveCellIndicatorProps, CalendarCellProps as CalendarPrimitiveCellProps, CalendarGridBodyProps as CalendarPrimitiveGridBodyProps, CalendarGridHeaderProps as CalendarPrimitiveGridHeaderProps, CalendarGridProps as CalendarPrimitiveGridProps, CalendarHeaderCellProps as CalendarPrimitiveHeaderCellProps, CalendarHeaderProps as CalendarPrimitiveHeaderProps, CalendarHeadingProps as CalendarPrimitiveHeadingProps, CalendarNavButtonProps as CalendarPrimitiveNavButtonProps, RangeCalendarRootProps } from '../../primitives/calendar';
import type { CalendarCellBodyAnimation } from '../calendar/calendar.types';
/**
 * Props omitted from the primitive root on the public mobile API.
 */
type OmittedRootProps = 'visibleDuration' | 'selectionAlignment' | 'autoFocus' | 'focusedValue' | 'defaultFocusedValue' | 'onFocusChange' | 'errorMessage' | 'pageBehavior';
/**
 * Props for the compound `RangeCalendar` root (`RangeCalendar` / `RangeCalendarRoot`).
 *
 * Extends primitive range calendar state and behavior; adds Tailwind `className` and optional
 * subtree animation settings.
 */
export type RangeCalendarProps = Omit<RangeCalendarRootProps, OmittedRootProps> & {
    /**
     * Additional Tailwind classes for the root container.
     */
    className?: string;
    /**
     * When set to `"disable-all"`, disables animations under this subtree via
     * `AnimationSettingsProvider`.
     *
     * @default undefined (animations follow global / ancestor settings)
     */
    animation?: AnimationRootDisableAll;
    /**
     * Controlled open state for the year picker overlay.
     */
    isYearPickerOpen?: boolean;
    /**
     * Uncontrolled initial open state for the year picker.
     *
     * @default false
     */
    defaultYearPickerOpen?: boolean;
    /**
     * Called when the year picker open state changes.
     */
    onYearPickerOpenChange?: (isOpen: boolean) => void;
};
/**
 * Props for `RangeCalendar.Header`.
 */
export type RangeCalendarHeaderComponentProps = CalendarPrimitiveHeaderProps & {
    /**
     * Additional Tailwind classes for the header row container.
     */
    className?: string;
};
/**
 * Props for `RangeCalendar.Heading`.
 */
export type RangeCalendarHeadingComponentProps = CalendarPrimitiveHeadingProps & {
    /**
     * Additional Tailwind classes for the month/year title.
     */
    className?: string;
};
/**
 * Overrides for the default chevron icons on `RangeCalendar.NavButton`.
 *
 * Ignored when `children` is passed to `NavButton` (custom icon/content).
 */
export interface RangeCalendarNavButtonIconProps {
    /**
     * Icon size in logical pixels.
     *
     * @default `NAV_ICON_SIZE` from calendar constants (currently `16`)
     */
    size?: number;
    /**
     * Icon stroke/fill color.
     *
     * @default Theme `accent` color from `useThemeColor('accent')`
     */
    color?: string;
}
/**
 * Props for `RangeCalendar.NavButton`.
 */
export type RangeCalendarNavButtonComponentProps = CalendarPrimitiveNavButtonProps & {
    /**
     * Additional Tailwind classes for the pressable.
     */
    className?: string;
    /**
     * Overrides for the built-in chevron (`size`, `color`).
     */
    iconProps?: RangeCalendarNavButtonIconProps;
};
/**
 * Props for `RangeCalendar.Grid`.
 */
export type RangeCalendarGridComponentProps = CalendarPrimitiveGridProps & {
    /**
     * Additional Tailwind classes for the grid container.
     */
    className?: string;
};
/**
 * Props for `RangeCalendar.GridHeader`.
 *
 * `children` is required: a render function `(day: string) => ReactElement` for each weekday
 * label from the primitive.
 */
export type RangeCalendarGridHeaderComponentProps = CalendarPrimitiveGridHeaderProps & {
    /**
     * Additional Tailwind classes for the weekday row wrapper.
     */
    className?: string;
};
/**
 * Props for `RangeCalendar.GridBody`.
 */
export type RangeCalendarGridBodyComponentProps = CalendarPrimitiveGridBodyProps & {
    /**
     * Additional Tailwind classes for the grid body.
     */
    className?: string;
};
/**
 * Props for `RangeCalendar.HeaderCell`.
 *
 * Stringifiable `children` (string, number, or mixed arrays without elements) are wrapped in
 * `HeaderCellLabel`, like `Chip` does with `Chip.Label`. Custom elements pass through. When
 * `children` is omitted, use `day` from `GridHeader`’s callback for the default label.
 */
export type RangeCalendarHeaderCellComponentProps = CalendarPrimitiveHeaderCellProps & {
    /**
     * Weekday label when `children` is omitted — pass the `day` string from
     * `RangeCalendar.GridHeader`’s render callback.
     */
    day?: string;
    /**
     * Additional Tailwind classes for the header cell container.
     */
    className?: string;
};
/**
 * Props for `RangeCalendar.Cell`.
 */
export type RangeCalendarCellComponentProps = CalendarPrimitiveCellProps & {
    /**
     * Additional Tailwind classes for the day cell pressable.
     */
    className?: string;
};
/**
 * Props for `RangeCalendar.CellIndicator`.
 *
 * Pass {@link CalendarCellRenderProps} from the cell render callback so `data-*` attributes match
 * the shared calendar cell data-attribute helper (including `data-selected`).
 */
export type RangeCalendarCellIndicatorComponentProps = Omit<CalendarPrimitiveCellIndicatorProps, 'isSelected'> & {
    /**
     * Render props from `RangeCalendar.Cell`’s children callback — drives `data-*` for styling.
     */
    cellRenderProps?: CalendarCellRenderProps;
    /**
     * Additional Tailwind classes for the indicator dot container.
     */
    className?: string;
};
/**
 * Props for `RangeCalendar.CellBody`.
 */
export interface RangeCalendarCellBodyProps extends ViewProps {
    /**
     * Render props from `RangeCalendar.Cell`’s children callback — drives `data-*` for styling.
     */
    cellRenderProps?: CalendarCellRenderProps;
    /**
     * Optional press scale animation for the cell body.
     */
    animation?: CalendarCellBodyAnimation;
    /**
     * Whether animated styles (react-native-reanimated) are active.
     * When `false`, the animated scale style is removed and you can implement custom logic.
     *
     * @default true
     */
    isAnimatedStyleActive?: boolean;
    /**
     * Body content (typically `CellLabel` and optional `CellIndicator`).
     */
    children?: ReactNode;
    /**
     * Additional Tailwind classes for the cell body container.
     *
     * @note The following style properties are occupied by animations and cannot be set via className:
     * - `transform` (scale) — Animated for press feedback
     *
     * To customize timing behavior, use the `animation` prop on `RangeCalendar.CellBody`.
     * To completely disable animated styles, set `isAnimatedStyleActive={false}`.
     */
    className?: string;
}
/**
 * Props for `RangeCalendar.CellLabel`.
 *
 * Pass {@link CalendarCellRenderProps} from the cell render callback so `data-*` attributes stay
 * aligned with the shared calendar cell data-attribute helper.
 */
export interface RangeCalendarCellLabelProps extends TextProps {
    /**
     * Render props from `RangeCalendar.Cell`’s children callback — drives `data-*` for styling.
     */
    cellRenderProps?: CalendarCellRenderProps;
    /**
     * Label text (usually the day number).
     */
    children?: ReactNode;
    /**
     * Additional Tailwind classes for the label.
     */
    className?: string;
}
/**
 * Props for `RangeCalendar.HeaderCellLabel`.
 */
export interface RangeCalendarHeaderCellLabelProps extends TextProps {
    /**
     * Weekday label text.
     */
    children?: ReactNode;
    /**
     * Additional Tailwind classes for the label.
     */
    className?: string;
}
export {};
//# sourceMappingURL=range-calendar.types.d.ts.map