"use strict";

import { AnimationSettingsProvider, FormFieldProvider } from 'heroui-native/contexts';
import { useThemeColor } from 'heroui-native/hooks';
import { forwardRef, memo, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { getCalendarCellDataAttributes } from "../../helpers/external/utils/index.js";
import { HeroText } from "../../helpers/internal/components/index.js";
import { useControllableState } from "../../helpers/internal/hooks/use-controllable-state.js";
import { ChevronLeftIcon, ChevronRightIcon } from "../../helpers/internal/icons/index.js";
import { childrenToString, getGregorianYearOffset } from "../../helpers/internal/utils/index.js";
import InternationalizedDatePackage from "../../optional/internationalized-date.js";
import { CalendarCell as CalendarPrimitiveCell, CalendarCellIndicator as CalendarPrimitiveCellIndicator, CalendarGrid as CalendarPrimitiveGrid, CalendarGridBody as CalendarPrimitiveGridBody, CalendarGridHeader as CalendarPrimitiveGridHeader, CalendarHeader as CalendarPrimitiveHeader, CalendarHeaderCell as CalendarPrimitiveHeaderCell, CalendarHeading as CalendarPrimitiveHeading, CalendarNavButton as CalendarPrimitiveNavButton, CalendarRoot as CalendarPrimitiveRoot, useCalendarStateContext } from "../../primitives/calendar/index.js";
import { YearPickerCell, YearPickerContextProvider, YearPickerGrid, YearPickerGridBody, YearPickerTrigger, YearPickerTriggerHeading, YearPickerTriggerIndicator } from "../calendar-year-picker/calendar-year-picker.js";
import { useYearPicker } from "../calendar-year-picker/calendar-year-picker.context.js";
import { useCalendarCellBodyAnimation, useCalendarRootAnimation } from "./calendar.animation.js";
import { DISPLAY_NAME, NAV_ICON_SIZE } from "./calendar.constants.js";
import calendarClassNames, { calendarStyleSheet } from "./calendar.styles.js";
import { jsx as _jsx } from "react/jsx-runtime";
const {
  CalendarDate,
  createCalendar: createCalendarDefault,
  DateFormatter,
  isSameDay
} = InternationalizedDatePackage ?? {};
const useCalendar = useCalendarStateContext;

// --------------------------------------------------

/**
 * Default lower/upper Gregorian year bounds for the year picker and
 * `minValue` / `maxValue` fallbacks. Shifted per calendar system via
 * {@link getGregorianYearOffset} so non-Gregorian calendars (Buddhist,
 * Hebrew, Persian, …) still get a sensible default range.
 */
const DEFAULT_MIN_GREGORIAN_YEAR = 1900;
const DEFAULT_MAX_GREGORIAN_YEAR = 2099;

/**
 * Computes default `minValue` / `maxValue` for the calendar when the consumer
 * does not supply them. The defaults are anchored to Gregorian `1900`–`2099`
 * and shifted into the locale-resolved calendar system so bounds make sense
 * for non-Gregorian calendars (e.g. Buddhist `2443`–`2642`).
 */
function useDefaultCalendarBounds(locale, createCalendar, minValue, maxValue) {
  return useMemo(() => {
    const resolvedLocale = locale ?? Intl.DateTimeFormat().resolvedOptions().locale;
    const identifier = new DateFormatter(resolvedLocale).resolvedOptions().calendar;
    const calendarSystem = (createCalendar ?? createCalendarDefault)(identifier);
    const offset = getGregorianYearOffset(identifier);
    const resolvedMin = minValue ?? new CalendarDate(calendarSystem, DEFAULT_MIN_GREGORIAN_YEAR + offset, 1, 1);
    const resolvedMax = maxValue ?? new CalendarDate(calendarSystem, DEFAULT_MAX_GREGORIAN_YEAR + offset, 12, 31);
    return {
      minValue: resolvedMin,
      maxValue: resolvedMax
    };
  }, [locale, createCalendar, minValue, maxValue]);
}

// --------------------------------------------------

const CalendarRoot = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    className,
    animation,
    children,
    isYearPickerOpen: isYearPickerOpenProp,
    defaultYearPickerOpen,
    onYearPickerOpenChange,
    locale,
    createCalendar,
    minValue,
    maxValue,
    ...rest
  } = props;
  const {
    minValue: resolvedMinValue,
    maxValue: resolvedMaxValue
  } = useDefaultCalendarBounds(locale, createCalendar, minValue, maxValue);
  const isDisabled = rest.isDisabled ?? false;
  const isInvalid = rest.isInvalid ?? false;
  const {
    isAllAnimationsDisabled
  } = useCalendarRootAnimation({
    animation
  });
  const animationSettingsValue = useMemo(() => ({
    isAllAnimationsDisabled
  }), [isAllAnimationsDisabled]);
  const formFieldContextValue = useMemo(() => ({
    isDisabled,
    isInvalid,
    isRequired: false,
    hasFieldPadding: false
  }), [isDisabled, isInvalid]);
  const [gridBounds, setGridBounds] = useState(null);
  const [isYearPickerOpen, setIsYearPickerOpen] = useControllableState({
    prop: isYearPickerOpenProp,
    defaultProp: defaultYearPickerOpen ?? false,
    onChange: onYearPickerOpenChange
  });
  const yearPickerContextValue = useMemo(() => ({
    gridBounds,
    isYearPickerOpen: isYearPickerOpen ?? false,
    setGridBounds,
    setIsYearPickerOpen: open => {
      setIsYearPickerOpen(open);
    }
  }), [gridBounds, isYearPickerOpen, setIsYearPickerOpen]);
  const rootClassName = calendarClassNames.root({
    className
  });
  return /*#__PURE__*/_jsx(AnimationSettingsProvider, {
    value: animationSettingsValue,
    children: /*#__PURE__*/_jsx(FormFieldProvider, {
      value: formFieldContextValue,
      children: /*#__PURE__*/_jsx(YearPickerContextProvider, {
        value: yearPickerContextValue,
        children: /*#__PURE__*/_jsx(CalendarPrimitiveRoot, {
          ref: ref,
          locale: locale,
          createCalendar: createCalendar,
          minValue: resolvedMinValue,
          maxValue: resolvedMaxValue,
          className: rootClassName,
          ...rest,
          children: children
        })
      })
    })
  });
});

// --------------------------------------------------

const CalendarHeader = /*#__PURE__*/forwardRef(({
  className,
  ...rest
}, ref) => {
  const headerClassName = calendarClassNames.header({
    className
  });
  return /*#__PURE__*/_jsx(CalendarPrimitiveHeader, {
    ref: ref,
    className: headerClassName,
    ...rest
  });
});

// --------------------------------------------------

const CalendarHeading = /*#__PURE__*/forwardRef(({
  className,
  ...rest
}, ref) => {
  const headingClassName = calendarClassNames.heading({
    className
  });
  return /*#__PURE__*/_jsx(CalendarPrimitiveHeading, {
    ref: ref,
    className: headingClassName,
    ...rest
  });
});

// --------------------------------------------------

const CalendarNavButton = /*#__PURE__*/forwardRef(({
  className,
  style,
  children,
  slot,
  iconProps,
  ...rest
}, ref) => {
  const themeAccent = useThemeColor('accent-soft-foreground');
  const isPrevious = slot === 'previous';
  const navButtonClassName = calendarClassNames.navButton({
    className
  });
  const iconSize = iconProps?.size ?? NAV_ICON_SIZE;
  const iconColor = iconProps?.color ?? themeAccent;
  const defaultIcon = isPrevious ? /*#__PURE__*/_jsx(ChevronLeftIcon, {
    color: iconColor,
    size: iconSize
  }) : /*#__PURE__*/_jsx(ChevronRightIcon, {
    color: iconColor,
    size: iconSize
  });
  return /*#__PURE__*/_jsx(CalendarPrimitiveNavButton, {
    ref: ref,
    slot: slot,
    className: navButtonClassName,
    style: typeof style === 'object' ? [calendarStyleSheet.borderCurve, style] : style,
    ...rest,
    children: children ?? defaultIcon
  });
});

// --------------------------------------------------

const CalendarGrid = /*#__PURE__*/forwardRef(({
  className,
  onLayout,
  ...rest
}, ref) => {
  const {
    setGridBounds
  } = useYearPicker();
  const gridClassName = calendarClassNames.grid({
    className
  });
  const handleLayout = useCallback(event => {
    onLayout?.(event);
    const {
      height,
      y
    } = event.nativeEvent.layout;
    setGridBounds({
      height,
      top: y
    });
  }, [onLayout, setGridBounds]);
  return /*#__PURE__*/_jsx(View, {
    className: "w-full",
    onLayout: handleLayout,
    children: /*#__PURE__*/_jsx(CalendarPrimitiveGrid, {
      ref: ref,
      className: gridClassName,
      ...rest
    })
  });
});

// --------------------------------------------------

const CalendarGridHeader = /*#__PURE__*/forwardRef(({
  children,
  ...rest
}, ref) => {
  return /*#__PURE__*/_jsx(CalendarPrimitiveGridHeader, {
    ref: ref,
    ...rest,
    children: children
  });
});

// --------------------------------------------------

const CalendarGridBody = /*#__PURE__*/forwardRef(({
  ...rest
}, ref) => {
  return /*#__PURE__*/_jsx(CalendarPrimitiveGridBody, {
    ref: ref,
    ...rest
  });
});

// --------------------------------------------------

const CalendarHeaderCellLabel = /*#__PURE__*/forwardRef(({
  className,
  children,
  ...textProps
}, ref) => {
  const labelClassName = calendarClassNames.headerCellLabel({
    className
  });
  return /*#__PURE__*/_jsx(HeroText, {
    ref: ref,
    className: labelClassName,
    ...textProps,
    children: children
  });
});

// --------------------------------------------------

const CalendarHeaderCell = /*#__PURE__*/forwardRef(({
  className,
  children,
  day,
  ...rest
}, ref) => {
  const headerCellClassName = calendarClassNames.headerCell({
    className
  });
  const stringifiedChildren = childrenToString(children);
  const renderChildren = stringifiedChildren != null ? /*#__PURE__*/_jsx(CalendarHeaderCellLabel, {
    children: stringifiedChildren
  }) : children != null ? children : /*#__PURE__*/_jsx(CalendarHeaderCellLabel, {
    children: day
  });
  return /*#__PURE__*/_jsx(CalendarPrimitiveHeaderCell, {
    ref: ref,
    className: headerCellClassName,
    ...rest,
    children: renderChildren
  });
});

// --------------------------------------------------

/**
 * Module-level default render function for `CalendarCell`. Hoisted out of the component body so
 * that each render doesn't allocate a fresh closure — which would otherwise defeat `React.memo` on
 * the wrapper cell (every cell would look like it had a new `children` prop).
 */
const renderDefaultCellChildren = renderProps => /*#__PURE__*/_jsx(CalendarCellBody, {
  cellRenderProps: renderProps,
  children: /*#__PURE__*/_jsx(CalendarCellLabel, {
    cellRenderProps: renderProps,
    children: renderProps.formattedDate
  })
});
const CalendarCellInner = /*#__PURE__*/forwardRef(({
  className,
  style,
  children,
  ...rest
}, ref) => {
  const renderChildren = children ?? renderDefaultCellChildren;
  const cellClassName = calendarClassNames.cell({
    className
  });
  return /*#__PURE__*/_jsx(CalendarPrimitiveCell, {
    ref: ref,
    className: cellClassName,
    style: typeof style === 'object' ? [calendarStyleSheet.borderCurve, style] : style,
    ...rest,
    children: renderChildren
  });
});
CalendarCellInner.displayName = `${DISPLAY_NAME.CELL}.Inner`;

/**
 * Memo comparator for the wrapper `CalendarCell`. `date` is a fresh `CalendarDate` per grid render,
 * so strict equality never matches — we compare by `isSameDay`.
 *
 * `children` gets special treatment: when both prev and next are functions, we skip the
 * comparison. Render-prop children are almost always defined inline by callers, which means
 * strict equality would never match and defeat the memo entirely. The contract is that render
 * functions are *pure with respect to `cellRenderProps`* — if the cell's computed state hasn't
 * changed, the render function's output can't change either, so skipping re-execution is safe.
 *
 * All other props fall back to reference equality, matching React's default behavior.
 */
function areWrapperCellPropsEqual(prev, next) {
  if (prev === next) {
    return true;
  }
  if (!isSameDay(prev.date, next.date)) {
    return false;
  }
  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);
  if (prevKeys.length !== nextKeys.length) {
    return false;
  }
  for (const key of prevKeys) {
    if (key === 'date') {
      continue;
    }
    if (key === 'children' && typeof prev.children === 'function' && typeof next.children === 'function') {
      continue;
    }
    if (prev[key] !== next[key]) {
      return false;
    }
  }
  return true;
}
const CalendarCell = /*#__PURE__*/memo(CalendarCellInner, areWrapperCellPropsEqual);

// --------------------------------------------------

const CalendarCellBody = /*#__PURE__*/forwardRef(({
  className,
  children,
  cellRenderProps,
  animation,
  isAnimatedStyleActive = true,
  style,
  ...viewProps
}, ref) => {
  const {
    rCellBodyStyle
  } = useCalendarCellBodyAnimation({
    animation,
    isPressed: cellRenderProps?.isPressed ?? false
  });
  const bodyClassName = calendarClassNames.cellBody({
    className
  });
  const bodyStyle = isAnimatedStyleActive ? [calendarStyleSheet.borderCurve, rCellBodyStyle, style] : [calendarStyleSheet.borderCurve, style];
  return /*#__PURE__*/_jsx(Animated.View, {
    ref: ref,
    accessible: false,
    accessibilityRole: "none",
    importantForAccessibility: "no",
    className: bodyClassName,
    style: bodyStyle,
    ...getCalendarCellDataAttributes({
      cellRenderProps
    }),
    ...viewProps,
    children: children
  });
});

// --------------------------------------------------

const CalendarCellLabel = /*#__PURE__*/forwardRef(({
  className,
  children,
  cellRenderProps,
  ...textProps
}, ref) => {
  const labelClassName = calendarClassNames.cellLabel({
    className
  });
  return /*#__PURE__*/_jsx(HeroText, {
    ref: ref,
    accessible: false,
    accessibilityRole: "text",
    importantForAccessibility: "no",
    className: labelClassName,
    ...getCalendarCellDataAttributes({
      cellRenderProps
    }),
    ...textProps,
    children: children
  });
});

// --------------------------------------------------

const CalendarCellIndicator = /*#__PURE__*/forwardRef(({
  className,
  cellRenderProps,
  style,
  ...viewProps
}, ref) => {
  const cellIndicatorClassName = calendarClassNames.cellIndicator({
    className
  });
  const isSelected = cellRenderProps?.isSelected ?? false;
  return /*#__PURE__*/_jsx(CalendarPrimitiveCellIndicator, {
    ref: ref,
    isSelected: isSelected,
    className: cellIndicatorClassName,
    style: [calendarStyleSheet.borderCurve, style],
    ...getCalendarCellDataAttributes({
      cellRenderProps
    }),
    ...viewProps
  });
});

// --------------------------------------------------

CalendarRoot.displayName = DISPLAY_NAME.ROOT;
CalendarHeader.displayName = DISPLAY_NAME.HEADER;
CalendarHeading.displayName = DISPLAY_NAME.HEADING;
CalendarNavButton.displayName = DISPLAY_NAME.NAV_BUTTON;
CalendarGrid.displayName = DISPLAY_NAME.GRID;
CalendarGridHeader.displayName = DISPLAY_NAME.GRID_HEADER;
CalendarGridBody.displayName = DISPLAY_NAME.GRID_BODY;
CalendarHeaderCell.displayName = DISPLAY_NAME.HEADER_CELL;
CalendarHeaderCellLabel.displayName = DISPLAY_NAME.HEADER_CELL_LABEL;
CalendarCellLabel.displayName = DISPLAY_NAME.CELL_LABEL;
CalendarCellBody.displayName = DISPLAY_NAME.CELL_BODY;
CalendarCell.displayName = DISPLAY_NAME.CELL;
CalendarCellIndicator.displayName = DISPLAY_NAME.CELL_INDICATOR;

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
const Calendar = Object.assign(CalendarRoot, {
  /** @optional Header row (nav + heading). */
  Header: CalendarHeader,
  /** @optional Month/year title; primitive fills default string when empty. */
  Heading: CalendarHeading,
  /** @optional Previous / next month navigation controls. */
  NavButton: CalendarNavButton,
  /** @optional Month grid; provides internal grid context to body/header. */
  Grid: CalendarGrid,
  /** @optional Weekday labels row. */
  GridHeader: CalendarGridHeader,
  /** @optional Day cells matrix. */
  GridBody: CalendarGridBody,
  /** @optional Single weekday header cell wrapper. */
  HeaderCell: CalendarHeaderCell,
  /** @optional Weekday label text inside `HeaderCell`. */
  HeaderCellLabel: CalendarHeaderCellLabel,
  /** @optional Selectable day cell. */
  Cell: CalendarCell,
  /** @optional Inner body (shape/selection) inside `Cell`. */
  CellBody: CalendarCellBody,
  /** @optional Default day label inside `CellBody`. */
  CellLabel: CalendarCellLabel,
  /** @optional Marker under a day (e.g. events). */
  CellIndicator: CalendarCellIndicator,
  /** @optional Year picker trigger (replaces `Heading` when used). */
  YearPickerTrigger: YearPickerTrigger,
  YearPickerTriggerHeading: YearPickerTriggerHeading,
  YearPickerTriggerIndicator: YearPickerTriggerIndicator,
  /** @optional Year picker overlay grid over `Grid`. */
  YearPickerGrid: YearPickerGrid,
  YearPickerGridBody: YearPickerGridBody,
  YearPickerCell: YearPickerCell
});
export { useCalendar };
export default Calendar;