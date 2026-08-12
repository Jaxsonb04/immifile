import type { ReactNode } from 'react';
import type { TextProps, ViewProps } from 'react-native';
import type { WithTimingConfig } from 'react-native-reanimated';
import type { Animation, AnimationRootDisableAll, AnimationValue } from '../../helpers/internal/types';
import type { CalendarCellRenderProps, CalendarCellIndicatorProps as CalendarPrimitiveCellIndicatorProps, CalendarCellProps as CalendarPrimitiveCellProps, CalendarGridBodyProps as CalendarPrimitiveGridBodyProps, CalendarGridHeaderProps as CalendarPrimitiveGridHeaderProps, CalendarGridProps as CalendarPrimitiveGridProps, CalendarHeaderCellProps as CalendarPrimitiveHeaderCellProps, CalendarHeaderProps as CalendarPrimitiveHeaderProps, CalendarHeadingProps as CalendarPrimitiveHeadingProps, CalendarNavButtonProps as CalendarPrimitiveNavButtonProps, CalendarRootProps } from '../../primitives/calendar';
/**
 * Props omitted from the primitive root on the public mobile API.
 */
type OmittedRootProps = 'visibleDuration' | 'selectionAlignment' | 'autoFocus' | 'focusedValue' | 'defaultFocusedValue' | 'onFocusChange' | 'errorMessage' | 'pageBehavior';
/**
 * Animation configuration for `Calendar.CellBody` / `RangeCalendar.CellBody` press feedback.
 */
export type CalendarCellBodyAnimation = Animation<{
    /**
     * Subtle scale when the day cell is pressed (`[rest, pressed]`).
     *
     * @default [1, 0.9]
     */
    scale?: AnimationValue<{
        value?: [number, number];
        /**
         * @default { duration: 120 }
         */
        timingConfig?: WithTimingConfig;
    }>;
}>;
/**
 * Props for the compound `Calendar` root (`Calendar` / `CalendarRoot`).
 *
 * Extends primitive calendar state and behavior; adds Tailwind `className` and optional subtree
 * animation settings.
 */
export type CalendarProps = Omit<CalendarRootProps, OmittedRootProps> & {
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
 * Props for `Calendar.Header`.
 */
export type CalendarHeaderComponentProps = CalendarPrimitiveHeaderProps & {
    /**
     * Additional Tailwind classes for the header row container.
     */
    className?: string;
};
/**
 * Props for `Calendar.Heading`.
 */
export type CalendarHeadingComponentProps = CalendarPrimitiveHeadingProps & {
    /**
     * Additional Tailwind classes for the month/year title.
     */
    className?: string;
};
/**
 * Overrides for the default chevron icons on `Calendar.NavButton`.
 *
 * Ignored when `children` is passed to `NavButton` (custom icon/content).
 */
export interface CalendarNavButtonIconProps {
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
 * Props for `Calendar.NavButton`.
 */
export type CalendarNavButtonComponentProps = CalendarPrimitiveNavButtonProps & {
    /**
     * Additional Tailwind classes for the pressable.
     */
    className?: string;
    /**
     * Overrides for the built-in chevron (`size`, `color`).
     */
    iconProps?: CalendarNavButtonIconProps;
};
/**
 * Props for `Calendar.Grid`.
 */
export type CalendarGridComponentProps = CalendarPrimitiveGridProps & {
    /**
     * Additional Tailwind classes for the grid container.
     */
    className?: string;
};
/**
 * Props for `Calendar.GridHeader`.
 *
 * `children` is required: a render function `(day: string) => ReactElement` for each weekday
 * label from the primitive.
 */
export type CalendarGridHeaderComponentProps = CalendarPrimitiveGridHeaderProps & {
    /**
     * Additional Tailwind classes for the weekday row wrapper.
     */
    className?: string;
};
/**
 * Props for `Calendar.GridBody`.
 */
export type CalendarGridBodyComponentProps = CalendarPrimitiveGridBodyProps & {
    /**
     * Additional Tailwind classes for the grid body.
     */
    className?: string;
};
/**
 * Props for `Calendar.HeaderCell`.
 *
 * Stringifiable `children` (string, number, or mixed arrays without elements) are wrapped in
 * `HeaderCellLabel`, like `Chip` does with `Chip.Label`. Custom elements pass through. When
 * `children` is omitted, use `day` from `GridHeader`’s callback for the default label.
 */
export type CalendarHeaderCellComponentProps = CalendarPrimitiveHeaderCellProps & {
    /**
     * Weekday label when `children` is omitted — pass the `day` string from
     * `Calendar.GridHeader`’s render callback.
     */
    day?: string;
    /**
     * Additional Tailwind classes for the header cell container.
     */
    className?: string;
};
/**
 * Props for `Calendar.Cell`.
 */
export type CalendarCellComponentProps = CalendarPrimitiveCellProps & {
    /**
     * Additional Tailwind classes for the day cell pressable.
     */
    className?: string;
};
/**
 * Props for `Calendar.CellIndicator`.
 *
 * Pass {@link CalendarCellRenderProps} from the cell render callback so `data-*` attributes match
 * the shared calendar cell data-attribute helper (including `data-selected`). Selection is taken
 * from `cellRenderProps`, not from the primitive’s `isSelected` prop.
 */
export type CalendarCellIndicatorComponentProps = Omit<CalendarPrimitiveCellIndicatorProps, 'isSelected'> & {
    /**
     * Render props from `Calendar.Cell`’s children callback — drives `data-*` for styling.
     */
    cellRenderProps?: CalendarCellRenderProps;
    /**
     * Additional Tailwind classes for the indicator dot container.
     */
    className?: string;
};
/**
 * Props for `Calendar.CellBody`.
 *
 * Inner content region of a day cell (shape and selection background). Pass the same
 * {@link CalendarCellRenderProps} as `CellLabel` for aligned `data-*` attributes.
 */
export interface CalendarCellBodyProps extends ViewProps {
    /**
     * Render props from `Calendar.Cell`’s children callback — drives `data-*` for styling.
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
     * To customize timing behavior, use the `animation` prop on `Calendar.CellBody`.
     * To completely disable animated styles, set `isAnimatedStyleActive={false}`.
     */
    className?: string;
}
/**
 * Props for `Calendar.CellLabel`.
 *
 * Pass {@link CalendarCellRenderProps} from the cell render callback so `data-*` attributes stay
 * aligned with the shared calendar cell data-attribute helper.
 */
export interface CalendarCellLabelProps extends TextProps {
    /**
     * Render props from `Calendar.Cell`’s children callback — drives `data-*` for styling.
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
 * Props for `Calendar.HeaderCellLabel`.
 */
export interface CalendarHeaderCellLabelProps extends TextProps {
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
//# sourceMappingURL=calendar.types.d.ts.map