"use strict";

import { useThemeColor } from 'heroui-native/hooks';
import { forwardRef, Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { HeroText } from "../../helpers/internal/components/index.js";
import { ChevronRightIcon } from "../../helpers/internal/icons/index.js";
import { createContext as createStrictContext } from "../../helpers/internal/utils/create-context.js";
import { useCalendarLocale, useCalendarStateContext } from "../../primitives/calendar/index.js";
import { getCachedDateFormatter } from "../../primitives/calendar/calendar.utils.js";
import { useYearPickerGridAnimation, useYearPickerIndicatorAnimation } from "./calendar-year-picker.animation.js";
import { DEFAULT_YEAR_CELL_HEIGHT, DISPLAY_NAME, INDICATOR_ICON_SIZE, YEAR_GRID_COLUMNS } from "./calendar-year-picker.constants.js";
import { useYearPicker, YearPickerContextProvider } from "./calendar-year-picker.context.js";
import calendarYearPickerClassNames, { calendarYearPickerStyleSheet } from "./calendar-year-picker.styles.js";
import { getYearRange, getYearScrollOffset } from "./calendar-year-picker.utils.js";

// --------------------------------------------------
import { jsx as _jsx } from "react/jsx-runtime";
const [YearPickerTriggerContextProvider, useYearPickerTriggerContext] = createStrictContext({
  name: 'HeroUINative.YearPickerTrigger',
  errorMessage: 'Year picker trigger subcomponents must be used within YearPicker.Trigger.'
});

/**
 * Stable per-grid context (no `focusedYear` — selection is passed as {@link YearPickerCellProps.isSelected}).
 *
 * `cellHeight` is supplied by `GridBody` so the default `YearPickerCell`
 * renders at the exact pixel height that `FlatList.getItemLayout` assumes,
 * keeping virtualization and initial scroll offsets in sync.
 */

const [YearPickerGridItemContextProvider, useYearPickerGridItemContext] = createStrictContext({
  name: 'HeroUINative.YearPickerGridItem',
  errorMessage: 'YearPicker.Cell must be used within YearPicker.GridBody or pass `year` from GridBody render.'
});

// --------------------------------------------------

const YearPickerTrigger = /*#__PURE__*/forwardRef(({
  children,
  className,
  onPress,
  disabled,
  ...rest
}, ref) => {
  const {
    isYearPickerOpen,
    setIsYearPickerOpen
  } = useYearPicker();
  const state = useCalendarStateContext();
  const {
    locale
  } = useCalendarLocale();
  const triggerClassName = calendarYearPickerClassNames.trigger({
    className
  });

  /**
   * Anchor on `visibleRange.start` — not `focusedDate` — so the trigger
   * heading stays in sync with the calendar grid after nav-button paging.
   * On native the calendar runs with `preserveFocusedDayOnPage=false`, so
   * `focusNextPage` / `focusPreviousPage` advance `visibleRange` without
   * moving `focusedDate`; reading `focusedDate` here would freeze the
   * heading on the page the calendar opened on. The primitive
   * `CalendarHeading` uses the same anchor for the same reason.
   */
  const visibleStart = state.visibleRange.start;
  const monthYear = useMemo(() => {
    const formatter = getCachedDateFormatter(locale, {
      month: 'long',
      year: 'numeric',
      calendar: visibleStart.calendar.identifier,
      timeZone: state.timeZone
    });
    return formatter.format(visibleStart.toDate(state.timeZone));
  }, [locale, visibleStart, state.timeZone]);
  const toggle = useCallback(() => {
    setIsYearPickerOpen(!isYearPickerOpen);
  }, [isYearPickerOpen, setIsYearPickerOpen]);
  const renderProps = useMemo(() => ({
    isOpen: isYearPickerOpen,
    monthYear,
    toggle
  }), [isYearPickerOpen, monthYear, toggle]);
  const handlePress = useCallback(event => {
    onPress?.(event);
    toggle();
  }, [onPress, toggle]);
  return /*#__PURE__*/_jsx(YearPickerTriggerContextProvider, {
    value: renderProps,
    children: /*#__PURE__*/_jsx(Pressable, {
      ref: ref,
      accessibilityRole: "button",
      accessibilityLabel: `${monthYear}, year selector`,
      accessibilityState: {
        expanded: isYearPickerOpen
      },
      className: triggerClassName,
      "data-open": isYearPickerOpen,
      disabled: disabled,
      onPress: handlePress,
      ...rest,
      children: typeof children === 'function' ? children(renderProps) : children
    })
  });
});
YearPickerTrigger.displayName = DISPLAY_NAME.TRIGGER;

// --------------------------------------------------

const YearPickerTriggerHeading = /*#__PURE__*/forwardRef(({
  children,
  className,
  ...textProps
}, ref) => {
  const {
    monthYear,
    ...values
  } = useYearPickerTriggerContext();
  const headingClassName = calendarYearPickerClassNames.triggerHeading({
    className
  });
  return /*#__PURE__*/_jsx(HeroText, {
    ref: ref,
    className: headingClassName,
    ...textProps,
    children: typeof children === 'function' ? children({
      monthYear,
      ...values
    }) : children ?? monthYear
  });
});
YearPickerTriggerHeading.displayName = DISPLAY_NAME.TRIGGER_HEADING;

// --------------------------------------------------

const YearPickerTriggerIndicator = /*#__PURE__*/forwardRef(({
  children,
  className,
  iconProps,
  animation,
  isAnimatedStyleActive = true,
  style,
  ...rest
}, ref) => {
  const themeAccent = useThemeColor('accent-soft-foreground');
  const triggerValues = useYearPickerTriggerContext();
  const {
    rContainerStyle
  } = useYearPickerIndicatorAnimation({
    animation,
    isOpen: triggerValues.isOpen
  });
  const indicatorClassName = calendarYearPickerClassNames.triggerIndicator({
    className
  });
  const iconSize = iconProps?.size ?? INDICATOR_ICON_SIZE;
  const iconColor = iconProps?.color ?? themeAccent;
  const indicatorStyle = isAnimatedStyleActive ? [rContainerStyle, style] : style;
  if (children) {
    return /*#__PURE__*/_jsx(Animated.View, {
      ref: ref,
      className: indicatorClassName,
      style: style,
      ...rest,
      children: typeof children === 'function' ? children(triggerValues) : children
    });
  }
  return /*#__PURE__*/_jsx(Animated.View, {
    ref: ref,
    className: indicatorClassName,
    style: indicatorStyle,
    ...rest,
    children: /*#__PURE__*/_jsx(ChevronRightIcon, {
      color: iconColor,
      size: iconSize
    })
  });
});
YearPickerTriggerIndicator.displayName = DISPLAY_NAME.TRIGGER_INDICATOR;

// --------------------------------------------------

const YearPickerGrid = /*#__PURE__*/forwardRef(({
  children,
  className,
  animation,
  isAnimatedStyleActive = true,
  style,
  ...viewProps
}, ref) => {
  const {
    isYearPickerOpen,
    gridBounds
  } = useYearPicker();

  /**
   * Defer mounting the `Animated.View` + its animated-style worklet until the picker is opened
   * for the first time. Opening a `DatePicker` otherwise pays for the overlay's shared value,
   * animated style, and wrapper view on every open even though the year picker is closed by
   * default. Once opened, we keep the view mounted so closing still animates out.
   */
  const [hasOpenedOnce, setHasOpenedOnce] = useState(isYearPickerOpen);
  useEffect(() => {
    if (isYearPickerOpen && !hasOpenedOnce) {
      setHasOpenedOnce(true);
    }
  }, [isYearPickerOpen, hasOpenedOnce]);
  const {
    rOverlayStyle
  } = useYearPickerGridAnimation({
    animation,
    isOpen: isYearPickerOpen
  });
  const gridClassName = calendarYearPickerClassNames.yearGrid({
    className
  });
  const overlayStyle = useMemo(() => {
    return [{
      position: 'absolute',
      left: 0,
      right: 0,
      ...(gridBounds !== null ? {
        top: gridBounds.top,
        height: gridBounds.height
      } : {
        top: 0,
        height: 0
      })
    }];
  }, [gridBounds]);
  const animatedStyle = isAnimatedStyleActive ? [overlayStyle, rOverlayStyle, style] : [overlayStyle, style];
  if (!hasOpenedOnce) {
    return null;
  }
  return /*#__PURE__*/_jsx(Animated.View, {
    ref: ref,
    accessibilityElementsHidden: !isYearPickerOpen,
    importantForAccessibility: isYearPickerOpen ? 'auto' : 'no-hide-descendants',
    pointerEvents: isYearPickerOpen ? 'auto' : 'none',
    className: gridClassName,
    "data-open": isYearPickerOpen,
    style: animatedStyle,
    ...viewProps,
    children: children
  });
});
YearPickerGrid.displayName = DISPLAY_NAME.GRID;

// --------------------------------------------------

const YearPickerGridBody = /*#__PURE__*/forwardRef(({
  children,
  cellHeight = DEFAULT_YEAR_CELL_HEIGHT,
  onLayout,
  ...rest
}, ref) => {
  const {
    isYearPickerOpen,
    setIsYearPickerOpen
  } = useYearPicker();
  const state = useCalendarStateContext();
  const {
    locale
  } = useCalendarLocale();

  /**
   * Internal `FlatList` ref for imperative scrolling. Merged with the
   * forwarded `ref` via `setListRef` so external consumers can still attach
   * their own ref without losing our scroll-on-open behavior.
   */
  const listRef = useRef(null);
  const setListRef = useCallback(node => {
    listRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [ref]);
  const calendarStateRef = useRef(state);
  calendarStateRef.current = state;

  /**
   * Anchor every visible-page-derived value on `visibleRange.start` rather
   * than `focusedDate`. On native, paging via nav buttons moves
   * `visibleRange` but not `focusedDate` (preserveFocusedDayOnPage=false),
   * so anchoring on `focusedDate` would highlight the wrong year and
   * scroll-to the wrong row after the user has paged.
   */
  const visibleStart = state.visibleRange.start;
  const calendarIdentifier = visibleStart.calendar.identifier;
  const years = useMemo(() => getYearRange(state.minValue, state.maxValue, calendarIdentifier), [state.minValue, state.maxValue, calendarIdentifier]);
  const yearFormatter = useMemo(() => {
    return getCachedDateFormatter(locale, {
      year: 'numeric',
      calendar: calendarIdentifier,
      timeZone: state.timeZone
    });
  }, [locale, calendarIdentifier, state.timeZone]);
  const formatYear = useCallback(year => {
    const dateValue = calendarStateRef.current.visibleRange.start.set({
      year
    });
    return yearFormatter.format(dateValue.toDate(state.timeZone));
  }, [state.timeZone, yearFormatter]);
  const visibleYear = visibleStart.year;
  const selectYear = useCallback(year => {
    const s = calendarStateRef.current;
    const focused = s.focusedDate;
    const rangeStart = s.visibleRange.start;
    const rangeEnd = s.visibleRange.end;
    /**
     * If `focusedDate` still falls inside the visible page, anchor on it
     * so an explicit cell focus (preserving day-of-month) survives the
     * year swap. Otherwise — the common case on native after paging,
     * where `focusedDate` is stale — anchor on the visible page so the
     * year switch lands the user on the same month they were viewing.
     */
    const isFocusedInVisibleRange = focused.compare(rangeStart) >= 0 && focused.compare(rangeEnd) <= 0;
    const baseDate = isFocusedInVisibleRange ? focused : rangeStart;
    const next = baseDate.set({
      year
    });
    s.setFocusedDate(next);
    setIsYearPickerOpen(false);
  }, [setIsYearPickerOpen]);

  /**
   * Scroll-to-target: target the year of the currently visible page,
   * which is exactly the year highlighted as `isSelected` in the grid:
   *
   * - No selection yet → `visibleRange.start` aligns to today's page
   *   inside `useCalendarState`, so we scroll to the current year.
   * - A date is selected → `visibleRange.start` follows `value`, so we
   *   scroll to the selected year.
   * - User pages via nav buttons → `visibleRange.start` advances even
   *   when `focusedDate` doesn't (native default), so re-opening the
   *   picker scrolls to the now-visible year.
   * - User picks a year inside the picker → `selectYear` calls
   *   `setFocusedDate` which re-aligns `visibleRange.start` to the new
   *   year, so the next open scrolls to that year (even though
   *   `state.value` isn't changed by year-only selection).
   */
  const targetYearIndex = useMemo(() => years.indexOf(visibleYear), [years, visibleYear]);
  const hasScrolledToTargetRef = useRef(false);
  useEffect(() => {
    if (!isYearPickerOpen) {
      hasScrolledToTargetRef.current = false;
    }
  }, [isYearPickerOpen]);

  /**
   * Scroll on the `FlatList`'s `onLayout`. Because `GridBody` returns `null`
   * while the picker is closed, the `FlatList` unmounts/remounts on every
   * open — so `onLayout` is a reliable single trigger site and we can pass
   * the fresh viewport height straight through without caching it in a ref.
   * A `hasScrolledToTargetRef` latch guarantees one scroll per open session
   * in case `onLayout` fires again mid-animation.
   */
  const handleLayout = useCallback(event => {
    onLayout?.(event);
    const viewportHeight = event.nativeEvent.layout.height - 16;
    if (hasScrolledToTargetRef.current || !isYearPickerOpen || targetYearIndex < 0 || years.length === 0 || viewportHeight <= 0) {
      return;
    }
    const offset = getYearScrollOffset({
      cellHeight,
      numColumns: YEAR_GRID_COLUMNS,
      targetIndex: targetYearIndex,
      totalCount: years.length,
      viewportHeight
    });
    hasScrolledToTargetRef.current = true;
    listRef.current?.scrollToOffset({
      offset,
      animated: false
    });
  }, [cellHeight, isYearPickerOpen, onLayout, targetYearIndex, years.length]);

  /**
   * With `numColumns > 1`, `FlatList` wraps data into row groups and its
   * underlying `VirtualizedList` treats each row as a single item — so
   * `index` here is the ROW index (0 … `ceil(years.length / numColumns) - 1`),
   * not the year index. Using `cellHeight * index` therefore maps each row
   * to its correct pixel offset; dividing by `numColumns` would collapse
   * multiple rows onto the same offset and corrupt the scroll bounds.
   */
  const getItemLayout = useCallback((_data, index) => ({
    length: cellHeight,
    offset: cellHeight * index,
    index
  }), [cellHeight]);
  const gridContextValue = useMemo(() => ({
    cellHeight,
    formatYear,
    isYearPickerOpen,
    selectYear
  }), [cellHeight, formatYear, isYearPickerOpen, selectYear]);
  const renderItem = useCallback(({
    item
  }) => {
    const isSelected = item === visibleYear;
    const values = {
      year: item,
      formattedYear: formatYear(item),
      isCurrentYear: item === new Date().getFullYear(),
      isOpen: isYearPickerOpen,
      isSelected,
      selectYear: () => {
        selectYear(item);
      }
    };
    return typeof children === 'function' ? /*#__PURE__*/_jsx(Fragment, {
      children: children(values)
    }) : /*#__PURE__*/_jsx(YearPickerCell, {
      isSelected: isSelected,
      year: item
    });
  }, [children, visibleYear, formatYear, isYearPickerOpen, selectYear]);
  const keyExtractor = useCallback(item => String(item), []);
  if (!isYearPickerOpen) {
    return null;
  }
  return /*#__PURE__*/_jsx(YearPickerGridItemContextProvider, {
    value: gridContextValue,
    children: /*#__PURE__*/_jsx(FlatList, {
      ref: setListRef,
      contentContainerClassName: calendarYearPickerClassNames.yearGridBodyContent(),
      ...rest,
      columnWrapperStyle: years.length > 0 ? calendarYearPickerStyleSheet.flatListColumnWrapper : undefined,
      data: years,
      extraData: visibleYear,
      getItemLayout: getItemLayout,
      keyExtractor: keyExtractor,
      numColumns: YEAR_GRID_COLUMNS,
      onLayout: handleLayout,
      renderItem: renderItem,
      scrollEnabled: isYearPickerOpen
    })
  });
});
YearPickerGridBody.displayName = DISPLAY_NAME.GRID_BODY;

// --------------------------------------------------

const YearPickerCellInner = /*#__PURE__*/forwardRef(({
  year,
  isSelected,
  children,
  className,
  style,
  onPress,
  onPressIn,
  onPressOut,
  ...rest
}, ref) => {
  const [isPressed, setIsPressed] = useState(false);
  const ctx = useYearPickerGridItemContext();
  const {
    cellHeight,
    formatYear,
    isYearPickerOpen,
    selectYear
  } = ctx;
  const formattedYear = useMemo(() => formatYear(year), [formatYear, year]);
  const isCurrentYear = year === new Date().getFullYear();
  const values = {
    formattedYear,
    isCurrentYear,
    isOpen: isYearPickerOpen,
    isSelected,
    selectYear: () => {
      selectYear(year);
    },
    year
  };
  const cellClassName = calendarYearPickerClassNames.yearCell({
    className
  });

  /**
   * Pressable's `style` prop can be either a `StyleProp<ViewStyle>` or a
   * callback receiving press state. We compose the default border curve
   * and the context-driven `cellHeight` in front of whatever the consumer
   * passed while preserving the callback shape when applicable.
   */
  const resolvedStyle = useMemo(() => {
    const heightStyle = {
      height: cellHeight
    };
    const base = [calendarYearPickerStyleSheet.borderCurve, heightStyle];
    if (typeof style === 'function') {
      return state => [...base, style(state)];
    }
    if (style === null || style === undefined) {
      return base;
    }
    return [...base, style];
  }, [cellHeight, style]);
  const handlePress = useCallback(event => {
    onPress?.(event);
    selectYear(year);
  }, [onPress, selectYear, year]);
  const handlePressIn = useCallback(event => {
    setIsPressed(true);
    onPressIn?.(event);
  }, [onPressIn]);
  const handlePressOut = useCallback(event => {
    setIsPressed(false);
    onPressOut?.(event);
  }, [onPressOut]);
  return /*#__PURE__*/_jsx(Pressable, {
    ref: ref,
    accessibilityLabel: formattedYear,
    accessibilityRole: "button",
    accessibilityState: {
      selected: isSelected
    },
    className: cellClassName,
    "data-current-year": isCurrentYear,
    "data-pressed": isPressed,
    "data-selected": isSelected,
    style: resolvedStyle,
    onPress: handlePress,
    onPressIn: handlePressIn,
    onPressOut: handlePressOut,
    ...rest,
    children: typeof children === 'function' ? children(values) : /*#__PURE__*/_jsx(HeroText, {
      className: calendarYearPickerClassNames.yearCellLabel(),
      "data-selected": isSelected,
      children: children ?? formattedYear
    })
  });
});
YearPickerCellInner.displayName = DISPLAY_NAME.CELL;
const YearPickerCell = /*#__PURE__*/memo(YearPickerCellInner);
YearPickerCell.displayName = DISPLAY_NAME.CELL;

// --------------------------------------------------

const CalendarYearPicker = {
  Trigger: YearPickerTrigger,
  TriggerHeading: YearPickerTriggerHeading,
  TriggerIndicator: YearPickerTriggerIndicator,
  Grid: YearPickerGrid,
  GridBody: YearPickerGridBody,
  Cell: YearPickerCell
};
export { CalendarYearPicker, YearPickerCell, YearPickerContextProvider, YearPickerGrid, YearPickerGridBody, YearPickerTrigger, YearPickerTriggerHeading, YearPickerTriggerIndicator };
export default CalendarYearPicker;