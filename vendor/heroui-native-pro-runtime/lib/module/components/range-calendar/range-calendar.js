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
import { CalendarCell as CalendarPrimitiveCell, CalendarCellIndicator as CalendarPrimitiveCellIndicator, CalendarGrid as CalendarPrimitiveGrid, CalendarGridBody as CalendarPrimitiveGridBody, CalendarGridHeader as CalendarPrimitiveGridHeader, CalendarHeader as CalendarPrimitiveHeader, CalendarHeaderCell as CalendarPrimitiveHeaderCell, CalendarHeading as CalendarPrimitiveHeading, CalendarNavButton as CalendarPrimitiveNavButton, RangeCalendarRoot as RangeCalendarPrimitiveRoot, useCalendarStateContext } from "../../primitives/calendar/index.js";
import { YearPickerCell, YearPickerContextProvider, YearPickerGrid, YearPickerGridBody, YearPickerTrigger, YearPickerTriggerHeading, YearPickerTriggerIndicator } from "../calendar-year-picker/calendar-year-picker.js";
import { useYearPicker } from "../calendar-year-picker/calendar-year-picker.context.js";
import { useCalendarCellBodyAnimation, useCalendarRootAnimation } from "./range-calendar.animation.js";
import { DISPLAY_NAME, NAV_ICON_SIZE } from "./range-calendar.constants.js";
import rangeCalendarClassNames, { rangeCalendarStyleSheet } from "./range-calendar.styles.js";
import { jsx as _jsx } from "react/jsx-runtime";
const {
  CalendarDate,
  createCalendar: createCalendarDefault,
  DateFormatter,
  isSameDay
} = InternationalizedDatePackage ?? {};
const useRangeCalendar = useCalendarStateContext;

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
 * Computes default `minValue` / `maxValue` for the range calendar when the
 * consumer does not supply them. The defaults are anchored to Gregorian
 * `1900`–`2099` and shifted into the locale-resolved calendar system so
 * bounds stay meaningful under non-Gregorian calendars.
 */
function useDefaultRangeCalendarBounds(locale, createCalendar, minValue, maxValue) {
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

const RangeCalendarRoot = /*#__PURE__*/forwardRef((props, ref) => {
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
  } = useDefaultRangeCalendarBounds(locale, createCalendar, minValue, maxValue);
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
    hasFieldPadding: true
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
  const rootClassName = rangeCalendarClassNames.root({
    className
  });
  return /*#__PURE__*/_jsx(AnimationSettingsProvider, {
    value: animationSettingsValue,
    children: /*#__PURE__*/_jsx(FormFieldProvider, {
      value: formFieldContextValue,
      children: /*#__PURE__*/_jsx(YearPickerContextProvider, {
        value: yearPickerContextValue,
        children: /*#__PURE__*/_jsx(RangeCalendarPrimitiveRoot, {
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

const RangeCalendarHeader = /*#__PURE__*/forwardRef(({
  className,
  ...rest
}, ref) => {
  const headerClassName = rangeCalendarClassNames.header({
    className
  });
  return /*#__PURE__*/_jsx(CalendarPrimitiveHeader, {
    ref: ref,
    className: headerClassName,
    ...rest
  });
});

// --------------------------------------------------

const RangeCalendarHeading = /*#__PURE__*/forwardRef(({
  className,
  ...rest
}, ref) => {
  const headingClassName = rangeCalendarClassNames.heading({
    className
  });
  return /*#__PURE__*/_jsx(CalendarPrimitiveHeading, {
    ref: ref,
    className: headingClassName,
    ...rest
  });
});

// --------------------------------------------------

const RangeCalendarNavButton = /*#__PURE__*/forwardRef(({
  className,
  style,
  children,
  slot,
  iconProps,
  ...rest
}, ref) => {
  const themeAccent = useThemeColor('accent-soft-foreground');
  const isPrevious = slot === 'previous';
  const navButtonClassName = rangeCalendarClassNames.navButton({
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
    style: typeof style === 'object' ? [rangeCalendarStyleSheet.borderCurve, style] : style,
    ...rest,
    children: children ?? defaultIcon
  });
});

// --------------------------------------------------

const RangeCalendarGrid = /*#__PURE__*/forwardRef(({
  className,
  onLayout,
  ...rest
}, ref) => {
  const {
    setGridBounds
  } = useYearPicker();
  const gridClassName = rangeCalendarClassNames.grid({
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

const RangeCalendarGridHeader = /*#__PURE__*/forwardRef(({
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

const RangeCalendarGridBody = /*#__PURE__*/forwardRef(({
  ...rest
}, ref) => {
  return /*#__PURE__*/_jsx(CalendarPrimitiveGridBody, {
    ref: ref,
    ...rest
  });
});

// --------------------------------------------------

const RangeCalendarHeaderCellLabel = /*#__PURE__*/forwardRef(({
  className,
  children,
  ...textProps
}, ref) => {
  const labelClassName = rangeCalendarClassNames.headerCellLabel({
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

const RangeCalendarHeaderCell = /*#__PURE__*/forwardRef(({
  className,
  children,
  day,
  ...rest
}, ref) => {
  const headerCellClassName = rangeCalendarClassNames.headerCell({
    className
  });
  const stringifiedChildren = childrenToString(children);
  const renderChildren = stringifiedChildren != null ? /*#__PURE__*/_jsx(RangeCalendarHeaderCellLabel, {
    children: stringifiedChildren
  }) : children != null ? children : /*#__PURE__*/_jsx(RangeCalendarHeaderCellLabel, {
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
 * Module-level default render function for `RangeCalendarCell`. Hoisted out of the component body
 * so each render doesn't allocate a fresh closure, which would otherwise defeat `React.memo` on
 * the wrapper cell (every cell would look like it had a new `children` prop).
 */
const renderDefaultRangeCellChildren = renderProps => /*#__PURE__*/_jsx(RangeCalendarCellBody, {
  cellRenderProps: renderProps,
  children: /*#__PURE__*/_jsx(RangeCalendarCellLabel, {
    cellRenderProps: renderProps,
    children: renderProps.formattedDate
  })
});
const RangeCalendarCellInner = /*#__PURE__*/forwardRef(({
  className,
  style,
  children,
  ...rest
}, ref) => {
  const renderChildren = children ?? renderDefaultRangeCellChildren;
  const cellClassName = rangeCalendarClassNames.cell({
    className
  });
  return /*#__PURE__*/_jsx(CalendarPrimitiveCell, {
    ref: ref,
    className: cellClassName,
    style: typeof style === 'object' ? [rangeCalendarStyleSheet.borderCurve, style] : style,
    ...rest,
    children: renderChildren
  });
});
RangeCalendarCellInner.displayName = `${DISPLAY_NAME.CELL}.Inner`;

/**
 * Memo comparator for the wrapper `RangeCalendarCell`. `date` is a fresh `CalendarDate` per grid
 * render, so strict equality never matches — we compare by `isSameDay`.
 *
 * `children` gets special treatment: when both prev and next are functions, we skip the
 * comparison. Render-prop children are almost always defined inline by callers (the surrounding
 * `GridBody` child arrow is itself inline, so `useCallback` on the inner fn wouldn't even help),
 * which means strict equality would never match and defeat the memo entirely. The contract is
 * that render functions are *pure with respect to `cellRenderProps`* — if the cell's computed
 * state (`isSelected`, `isRangeStart`, `isRangeMiddle`, etc.) hasn't changed, the render
 * function's output can't change either, so skipping re-execution is safe.
 *
 * All other props fall back to reference equality, matching React's default behavior.
 */
function areRangeCellPropsEqual(prev, next) {
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
const RangeCalendarCell = /*#__PURE__*/memo(RangeCalendarCellInner, areRangeCellPropsEqual);

// --------------------------------------------------

const RangeCalendarCellBody = /*#__PURE__*/forwardRef(({
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
  const bodyClassName = rangeCalendarClassNames.cellBody({
    className
  });
  const bodyStyle = isAnimatedStyleActive ? [rangeCalendarStyleSheet.borderCurve, rCellBodyStyle, style] : [rangeCalendarStyleSheet.borderCurve, style];
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

const RangeCalendarCellLabel = /*#__PURE__*/forwardRef(({
  className,
  children,
  cellRenderProps,
  ...textProps
}, ref) => {
  const labelClassName = rangeCalendarClassNames.cellLabel({
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

const RangeCalendarCellIndicator = /*#__PURE__*/forwardRef(({
  className,
  cellRenderProps,
  style,
  ...viewProps
}, ref) => {
  const cellIndicatorClassName = rangeCalendarClassNames.cellIndicator({
    className
  });
  const isSelected = cellRenderProps?.isSelected ?? false;
  return /*#__PURE__*/_jsx(CalendarPrimitiveCellIndicator, {
    ref: ref,
    isSelected: isSelected,
    className: cellIndicatorClassName,
    style: [rangeCalendarStyleSheet.borderCurve, style],
    ...getCalendarCellDataAttributes({
      cellRenderProps
    }),
    ...viewProps
  });
});

// --------------------------------------------------

RangeCalendarRoot.displayName = DISPLAY_NAME.ROOT;
RangeCalendarHeader.displayName = DISPLAY_NAME.HEADER;
RangeCalendarHeading.displayName = DISPLAY_NAME.HEADING;
RangeCalendarNavButton.displayName = DISPLAY_NAME.NAV_BUTTON;
RangeCalendarGrid.displayName = DISPLAY_NAME.GRID;
RangeCalendarGridHeader.displayName = DISPLAY_NAME.GRID_HEADER;
RangeCalendarGridBody.displayName = DISPLAY_NAME.GRID_BODY;
RangeCalendarHeaderCell.displayName = DISPLAY_NAME.HEADER_CELL;
RangeCalendarHeaderCellLabel.displayName = DISPLAY_NAME.HEADER_CELL_LABEL;
RangeCalendarCellLabel.displayName = DISPLAY_NAME.CELL_LABEL;
RangeCalendarCellBody.displayName = DISPLAY_NAME.CELL_BODY;
RangeCalendarCell.displayName = DISPLAY_NAME.CELL;
RangeCalendarCellIndicator.displayName = DISPLAY_NAME.CELL_INDICATOR;

/**
 * Styled range calendar: same layout tokens as {@link Calendar}, with range selection and
 * `data-range-*` / `data-invalid` on cells and labels.
 */
const RangeCalendar = Object.assign(RangeCalendarRoot, {
  Header: RangeCalendarHeader,
  Heading: RangeCalendarHeading,
  NavButton: RangeCalendarNavButton,
  Grid: RangeCalendarGrid,
  GridHeader: RangeCalendarGridHeader,
  GridBody: RangeCalendarGridBody,
  HeaderCell: RangeCalendarHeaderCell,
  HeaderCellLabel: RangeCalendarHeaderCellLabel,
  Cell: RangeCalendarCell,
  CellBody: RangeCalendarCellBody,
  CellLabel: RangeCalendarCellLabel,
  CellIndicator: RangeCalendarCellIndicator,
  YearPickerTrigger: YearPickerTrigger,
  YearPickerTriggerHeading: YearPickerTriggerHeading,
  YearPickerTriggerIndicator: YearPickerTriggerIndicator,
  YearPickerGrid: YearPickerGrid,
  YearPickerGridBody: YearPickerGridBody,
  YearPickerCell: YearPickerCell
});
export { useRangeCalendar };
export default RangeCalendar;