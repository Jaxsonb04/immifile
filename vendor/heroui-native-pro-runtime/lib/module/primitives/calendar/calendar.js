"use strict";

import { createContext, forwardRef, Fragment, memo, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getCalendarCellDataAttributes } from "../../helpers/external/utils/index.js";
import { createContext as createNullableContext } from "../../helpers/internal/utils/create-context.js";
import InternationalizedDatePackage from "../../optional/internationalized-date.js";
import * as Slot from "../slot/index.js";
import { getCachedDateFormatter, getWeekdayLabels, getWeeksInMonth } from "./calendar.utils.js";
import { useCalendarState } from "./state/use-calendar-state.js";
import { useRangeCalendarState } from "./state/use-range-calendar-state.js";
import { jsx as _jsx } from "react/jsx-runtime";
const {
  createCalendar,
  endOfMonth,
  getDayOfWeek,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth
} = InternationalizedDatePackage ?? {};
const [CalendarStateProvider,, CalendarStateContext] = createNullableContext({
  strict: false,
  name: 'HeroUINative.Primitive.CalendarState'
});
const [RangeCalendarStateProvider,, RangeCalendarStateContext] = createNullableContext({
  strict: false,
  name: 'HeroUINative.Primitive.RangeCalendarState'
});
function isRangeCalendarState(state) {
  return 'highlightedRange' in state;
}

/**
 * Returns calendar state from {@link CalendarRoot} or {@link RangeCalendarRoot}.
 */
function useCalendarStateContext() {
  const single = useContext(CalendarStateContext);
  const range = useContext(RangeCalendarStateContext);
  if (single) {
    return single;
  }
  if (range) {
    return range;
  }
  throw new Error('Calendar compound components must be used within CalendarRoot or RangeCalendarRoot');
}

// --------------------------------------------------

const CalendarLocaleContext = /*#__PURE__*/createContext({
  locale: 'en-US'
});

/**
 * Returns locale and `firstDayOfWeek` from the nearest calendar / range-calendar root.
 */
function useCalendarLocale() {
  return useContext(CalendarLocaleContext);
}

// --------------------------------------------------

const CalendarInternalGridContext = /*#__PURE__*/createContext(null);
function useInternalGridContext() {
  const ctx = useContext(CalendarInternalGridContext);
  if (!ctx) {
    throw new Error('Calendar grid subcomponents must be used within CalendarGrid');
  }
  return ctx;
}

// --------------------------------------------------

/**
 * Per-cell derived state context. Values are *primitives* (booleans and a lightweight
 * `highlightedRange` object) so two cells with the same logical state share a stable context
 * reference. This is the key that lets `memo(CalendarCell)` actually skip re-renders: cells only
 * subscribe to their own `CalendarCellComputedStateContext` rather than the global
 * `CalendarStateContext`, so changing `isSelected` on one date only re-renders the two cells whose
 * flags actually flipped, not the whole grid.
 *
 * The provider that publishes this context *does* subscribe to the global state context and
 * re-renders for every state update — but it is a tiny component that only runs the derivation
 * closures, so the cost scales with the (~42) cells rather than with the size of each cell's
 * JSX tree.
 */

const CalendarCellComputedStateContext = /*#__PURE__*/createContext(null);
/**
 * Wraps a single calendar cell, reading the global calendar state and republishing a per-cell
 * slice whose identity only changes when the flags this particular cell cares about change.
 */
function CalendarCellComputedStateProvider({
  date,
  children
}) {
  const state = useCalendarStateContext();
  const {
    gridStart
  } = useInternalGridContext();

  /**
   * Latest-state ref so `selectDate` has a stable identity. `state.selectDate` itself changes on
   * every render because the state object is rebuilt each time; without this indirection, the
   * memoized context value below would invalidate every render and defeat the optimization.
   */
  const stateRef = useRef(state);
  stateRef.current = state;
  const selectDate = useCallback(d => {
    stateRef.current.selectDate(d);
  }, []);
  const isOutsideMonth = !isSameMonth(gridStart, date);
  const isCellDisabled = state.isCellDisabled(date);
  const isCellUnavailable = state.isCellUnavailable(date);
  const isSelected = state.isSelected(date);
  const isCellFocused = state.isCellFocused(date);
  const isTodayCell = isToday(date, state.timeZone);
  const isInvalidCell = state.isInvalid(date);
  const isReadOnly = state.isReadOnly;
  const rawHighlightedRange = isRangeCalendarState(state) && state.highlightedRange ? state.highlightedRange : null;

  /**
   * Stabilize `highlightedRange` by content: `useRangeCalendarState` produces a fresh range
   * object on every render, so strict equality would always fail. Comparing by day keeps the
   * reference stable when the range hasn't actually moved, which is what memoization needs.
   */
  const highlightedRangeStart = rawHighlightedRange?.start ?? null;
  const highlightedRangeEnd = rawHighlightedRange?.end ?? null;
  const highlightedRangeKey = rawHighlightedRange && highlightedRangeStart && highlightedRangeEnd ? `${highlightedRangeStart.toString()}|${highlightedRangeEnd.toString()}` : null;
  const highlightedRange = useMemo(() => rawHighlightedRange,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [highlightedRangeKey]);

  /**
   * Adjacent-day flags are only meaningful inside a range and only consulted by range-middle
   * logic; keep them cheap (no allocations) when there's no highlight.
   */
  const isPrevDayUnavailableInRange = highlightedRange ? state.isCellUnavailable(date.add({
    days: -1
  })) : false;
  const isNextDayUnavailableInRange = highlightedRange ? state.isCellUnavailable(date.add({
    days: 1
  })) : false;
  const value = useMemo(() => ({
    isOutsideMonth,
    isCellDisabled,
    isCellUnavailable,
    isSelected,
    isCellFocused,
    isTodayCell,
    isInvalidCell,
    isReadOnly,
    highlightedRange,
    isPrevDayUnavailableInRange,
    isNextDayUnavailableInRange,
    selectDate
  }), [isOutsideMonth, isCellDisabled, isCellUnavailable, isSelected, isCellFocused, isTodayCell, isInvalidCell, isReadOnly, highlightedRange, isPrevDayUnavailableInRange, isNextDayUnavailableInRange, selectDate]);
  return /*#__PURE__*/_jsx(CalendarCellComputedStateContext.Provider, {
    value: value,
    children: children
  });
}

// --------------------------------------------------

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row'
  }
});

// --------------------------------------------------

const CalendarRoot = /*#__PURE__*/forwardRef(function CalendarRoot(props, ref) {
  const {
    asChild,
    children,
    locale: localeProp,
    createCalendar: createCalendarProp,
    value,
    defaultValue,
    onChange,
    minValue,
    maxValue,
    isDateUnavailable,
    isDisabled,
    isReadOnly,
    autoFocus,
    focusedValue,
    defaultFocusedValue,
    onFocusChange,
    isInvalid,
    pageBehavior,
    firstDayOfWeek,
    selectionAlignment,
    visibleDuration,
    preserveFocusedDayOnPage,
    ...viewProps
  } = props;
  const locale = localeProp ?? Intl.DateTimeFormat().resolvedOptions().locale;
  const createCalendarFn = createCalendarProp ?? createCalendar;
  const state = useCalendarState({
    value,
    defaultValue,
    onChange,
    minValue,
    maxValue,
    isDateUnavailable,
    isDisabled,
    isReadOnly,
    autoFocus,
    focusedValue,
    defaultFocusedValue,
    onFocusChange,
    isInvalid,
    pageBehavior,
    firstDayOfWeek,
    selectionAlignment,
    visibleDuration,
    preserveFocusedDayOnPage,
    locale,
    createCalendar: createCalendarFn
  });
  const Component = asChild ? Slot.View : View;
  const localeContextValue = useMemo(() => ({
    locale,
    firstDayOfWeek
  }), [locale, firstDayOfWeek]);
  return /*#__PURE__*/_jsx(CalendarStateProvider, {
    value: state,
    children: /*#__PURE__*/_jsx(CalendarLocaleContext.Provider, {
      value: localeContextValue,
      children: /*#__PURE__*/_jsx(Component, {
        ref: ref,
        accessibilityRole: "none",
        ...viewProps,
        children: typeof children === 'function' ? children({
          state
        }) : children
      })
    })
  });
});
CalendarRoot.displayName = 'HeroUINative.Primitive.Calendar.Root';

// --------------------------------------------------

const RangeCalendarRoot = /*#__PURE__*/forwardRef(function RangeCalendarRoot(props, ref) {
  const {
    asChild,
    children,
    locale: localeProp,
    createCalendar: createCalendarProp,
    value,
    defaultValue,
    onChange,
    minValue,
    maxValue,
    isDateUnavailable,
    allowsNonContiguousRanges,
    isDisabled,
    isReadOnly,
    autoFocus,
    focusedValue,
    defaultFocusedValue,
    onFocusChange,
    isInvalid,
    pageBehavior,
    firstDayOfWeek,
    selectionAlignment,
    visibleDuration,
    preserveFocusedDayOnPage,
    ...viewProps
  } = props;
  const locale = localeProp ?? Intl.DateTimeFormat().resolvedOptions().locale;
  const createCalendarFn = createCalendarProp ?? createCalendar;
  const state = useRangeCalendarState({
    value,
    defaultValue,
    onChange,
    minValue,
    maxValue,
    isDateUnavailable,
    allowsNonContiguousRanges,
    isDisabled,
    isReadOnly,
    autoFocus,
    focusedValue,
    defaultFocusedValue,
    onFocusChange,
    isInvalid,
    pageBehavior,
    firstDayOfWeek,
    selectionAlignment,
    visibleDuration,
    preserveFocusedDayOnPage,
    locale,
    createCalendar: createCalendarFn
  });
  const Component = asChild ? Slot.View : View;
  const localeContextValue = useMemo(() => ({
    locale,
    firstDayOfWeek
  }), [locale, firstDayOfWeek]);
  return /*#__PURE__*/_jsx(RangeCalendarStateProvider, {
    value: state,
    children: /*#__PURE__*/_jsx(CalendarLocaleContext.Provider, {
      value: localeContextValue,
      children: /*#__PURE__*/_jsx(Component, {
        ref: ref,
        accessibilityRole: "none",
        ...viewProps,
        children: typeof children === 'function' ? children({
          state
        }) : children
      })
    })
  });
});
RangeCalendarRoot.displayName = 'HeroUINative.Primitive.Calendar.RangeRoot';

// --------------------------------------------------

const CalendarHeader = /*#__PURE__*/forwardRef(function CalendarHeader({
  asChild,
  ...viewProps
}, ref) {
  const Component = asChild ? Slot.View : View;
  return /*#__PURE__*/_jsx(Component, {
    ref: ref,
    accessibilityRole: "header",
    ...viewProps
  });
});
CalendarHeader.displayName = 'HeroUINative.Primitive.Calendar.Header';

// --------------------------------------------------

const CalendarHeading = /*#__PURE__*/forwardRef(function CalendarHeading({
  asChild,
  children,
  ...textProps
}, ref) {
  const state = useCalendarStateContext();
  const {
    locale
  } = useContext(CalendarLocaleContext);
  const title = useMemo(() => {
    const anchor = state.visibleRange.start;
    const formatter = getCachedDateFormatter(locale, {
      month: 'long',
      year: 'numeric',
      calendar: anchor.calendar.identifier,
      timeZone: state.timeZone
    });
    return formatter.format(anchor.toDate(state.timeZone));
  }, [locale, state.visibleRange.start, state.timeZone]);
  const Component = asChild ? Slot.Text : Text;
  return /*#__PURE__*/_jsx(Component, {
    ref: ref,
    accessibilityRole: "header",
    ...textProps,
    children: children ?? title
  });
});
CalendarHeading.displayName = 'HeroUINative.Primitive.Calendar.Heading';

// --------------------------------------------------

const CalendarNavButtonInner = /*#__PURE__*/forwardRef(function CalendarNavButtonInner({
  asChild,
  slot,
  isDisabled: isDisabledProp,
  onPress,
  onTouchStart,
  onTouchEnd,
  ...pressableProps
}, ref) {
  const [isPressed, setIsPressed] = useState(false);
  const state = useCalendarStateContext();
  const isPrevious = slot === 'previous';
  const navDisabled = slot === undefined ? true : isPrevious ? state.isPreviousVisibleRangeInvalid() : state.isNextVisibleRangeInvalid();
  const isDisabled = (isDisabledProp ?? false) || state.isDisabled || navDisabled;
  const handlePress = useCallback(e => {
    if (!isDisabled && slot !== undefined) {
      if (isPrevious) {
        state.focusPreviousPage();
      } else {
        state.focusNextPage();
      }
    }
    onPress?.(e);
  }, [isDisabled, isPrevious, onPress, slot, state]);
  const handleTouchStart = useCallback(e => {
    setIsPressed(true);
    onTouchStart?.(e);
  }, [onTouchStart]);
  const handleTouchEnd = useCallback(e => {
    setIsPressed(false);
    onTouchEnd?.(e);
  }, [onTouchEnd]);
  const Component = asChild ? Slot.Pressable : Pressable;
  return /*#__PURE__*/_jsx(Component, {
    ref: ref,
    accessibilityRole: "button",
    accessibilityLabel: slot === undefined ? 'Navigation' : isPrevious ? 'Previous' : 'Next',
    accessibilityState: {
      disabled: isDisabled
    },
    disabled: isDisabled,
    onPress: handlePress,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    "data-pressed": isPressed,
    "data-pressed-not-disabled": isPressed && !isDisabled,
    "data-disabled": isDisabled,
    ...pressableProps
  });
});
const CalendarNavButton = /*#__PURE__*/forwardRef(function CalendarNavButton(props, ref) {
  const state = useCalendarStateContext();
  /**
   * Remount the inner pressable when the visible month or focused date changes so `isPressed`
   * resets. Including `visibleRange.start` covers `preserveFocusedDayOnPage === false`, where
   * paging does not move `focusedDate`.
   */
  const remountKey = `${props.slot ?? 'nav'}-${state.visibleRange.start.toString()}-${state.focusedDate.toString()}`;
  return /*#__PURE__*/_jsx(CalendarNavButtonInner, {
    ref: ref,
    ...props
  }, remountKey);
});
CalendarNavButtonInner.displayName = 'HeroUINative.Primitive.Calendar.NavButtonInner';
CalendarNavButton.displayName = 'HeroUINative.Primitive.Calendar.NavButton';

// --------------------------------------------------

const CalendarGrid = /*#__PURE__*/forwardRef(function CalendarGrid({
  asChild,
  children,
  offset,
  weekdayStyle = 'short',
  ...viewProps
}, ref) {
  const state = useCalendarStateContext();
  const {
    locale,
    firstDayOfWeek
  } = useContext(CalendarLocaleContext);

  /**
   * `state.visibleRange.start` is re-created with a new object identity on every render of
   * `useCalendarState` (it's a fresh `CalendarDate` returned by `alignCenter`/`alignStart` even
   * when the logical start day is unchanged). Since `gridStart` flows into `InternalGridContext`,
   * that churn would otherwise invalidate the provider value every render and force every
   * calendar cell to re-render — defeating the per-cell memoization. Stabilize by day via a
   * `toString`-keyed `useMemo` so downstream consumers only see a new reference when the grid
   * actually moves.
   */
  const rawGridStart = offset ? state.visibleRange.start.add(offset) : state.visibleRange.start;
  const gridStartKey = rawGridStart.toString();
  const gridStart = useMemo(() => rawGridStart,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [gridStartKey]);
  const weeksInMonth = useMemo(() => getWeeksInMonth(gridStart, locale, firstDayOfWeek), [gridStart, locale, firstDayOfWeek]);
  const weekDays = useMemo(() => getWeekdayLabels(locale, state.timeZone, weekdayStyle, firstDayOfWeek), [locale, state.timeZone, weekdayStyle, firstDayOfWeek]);
  const dayFormatter = useMemo(() => getCachedDateFormatter(locale, {
    day: 'numeric',
    calendar: gridStart.calendar.identifier,
    timeZone: state.timeZone
  }), [locale, gridStart.calendar.identifier, state.timeZone]);
  const gridValue = useMemo(() => ({
    gridStart,
    weeksInMonth,
    weekDays,
    weekdayStyle,
    dayFormatter,
    timeZone: state.timeZone
  }), [gridStart, weeksInMonth, weekDays, weekdayStyle, dayFormatter, state.timeZone]);
  const Component = asChild ? Slot.View : View;
  return /*#__PURE__*/_jsx(CalendarInternalGridContext.Provider, {
    value: gridValue,
    children: /*#__PURE__*/_jsx(Component, {
      ref: ref,
      accessibilityRole: "none",
      accessibilityLabel: "Calendar",
      ...viewProps,
      "data-readonly": state.isReadOnly,
      children: children
    })
  });
});
CalendarGrid.displayName = 'HeroUINative.Primitive.Calendar.Grid';

// --------------------------------------------------

const CalendarGridHeader = /*#__PURE__*/forwardRef(function CalendarGridHeader({
  asChild,
  children,
  ...viewProps
}, ref) {
  const {
    weekDays
  } = useInternalGridContext();
  const Component = asChild ? Slot.View : View;
  return /*#__PURE__*/_jsx(Component, {
    ref: ref,
    accessibilityRole: "none",
    accessibilityLabel: "Weekdays",
    ...viewProps,
    children: /*#__PURE__*/_jsx(View, {
      accessibilityRole: "none",
      style: styles.row,
      children: weekDays.map((day, index) => /*#__PURE__*/_jsx(Fragment, {
        children: children(day)
      }, String(index)))
    })
  });
});
CalendarGridHeader.displayName = 'HeroUINative.Primitive.Calendar.GridHeader';

// --------------------------------------------------

const CalendarGridBody = /*#__PURE__*/forwardRef(function CalendarGridBody({
  asChild,
  children,
  ...viewProps
}, ref) {
  const state = useCalendarStateContext();
  const {
    gridStart,
    weeksInMonth
  } = useInternalGridContext();
  const Component = asChild ? Slot.View : View;
  return /*#__PURE__*/_jsx(Component, {
    ref: ref,
    accessibilityRole: "none",
    ...viewProps,
    children: Array.from({
      length: weeksInMonth
    }, (_, weekIndex) => /*#__PURE__*/_jsx(View, {
      accessibilityRole: "none",
      style: styles.row,
      children: state.getDatesInWeek(weekIndex, gridStart).map((cellDate, i) => cellDate ? /*#__PURE__*/_jsx(CalendarCellComputedStateProvider, {
        date: cellDate,
        children: children(cellDate)
      }, String(i)) : /*#__PURE__*/_jsx(View, {
        accessibilityElementsHidden: true
      }, String(i)))
    }, weekIndex))
  });
});
CalendarGridBody.displayName = 'HeroUINative.Primitive.Calendar.GridBody';

// --------------------------------------------------

const CalendarHeaderCell = /*#__PURE__*/forwardRef(function CalendarHeaderCell({
  asChild,
  ...viewProps
}, ref) {
  const Component = asChild ? Slot.View : View;
  return /*#__PURE__*/_jsx(Component, {
    ref: ref,
    accessibilityRole: "header",
    ...viewProps
  });
});
CalendarHeaderCell.displayName = 'HeroUINative.Primitive.Calendar.HeaderCell';

// --------------------------------------------------

/**
 * Whether `day` lies on the timeline between `range.start` and `range.end` (inclusive), so an
 * adjacent gap (e.g. unavailable weekend) still “belongs” to the same highlighted range.
 */
function isCalendarDateWithinInclusiveRange(day, range) {
  return day.compare(range.start) >= 0 && day.compare(range.end) <= 0;
}
const CalendarCellInner = /*#__PURE__*/forwardRef(function CalendarCell({
  asChild,
  date,
  children: cellChildren,
  isDisabled: isDisabledProp,
  onPress,
  onPressIn,
  onPressOut,
  ...pressableProps
}, ref) {
  const [isPressed, setIsPressed] = useState(false);
  const cellComputedState = useContext(CalendarCellComputedStateContext);
  const {
    locale,
    firstDayOfWeek
  } = useContext(CalendarLocaleContext);
  const {
    dayFormatter,
    timeZone
  } = useInternalGridContext();

  /**
   * Cells must be rendered inside {@link CalendarGridBody}, which publishes the per-cell
   * computed state context used below. The check runs after all unconditional hooks so the
   * hook order is stable across renders even in dev.
   */
  if (!cellComputedState) {
    throw new Error('CalendarCell must be rendered inside a CalendarGridBody — the per-cell computed state context is missing.');
  }
  const {
    isOutsideMonth,
    isCellDisabled,
    isCellUnavailable: isUnavailable,
    isSelected,
    isCellFocused: isFocused,
    isTodayCell,
    isInvalidCell,
    isReadOnly,
    highlightedRange,
    isPrevDayUnavailableInRange,
    isNextDayUnavailableInRange,
    selectDate
  } = cellComputedState;
  const isDisabled = (isDisabledProp ?? false) || isCellDisabled;

  /**
   * All range-derived flags are only meaningful when a highlighted range exists (i.e. under a
   * `RangeCalendarRoot`). Skipping this block for single-date calendars removes ~8 date-math
   * calls and ~5 boolean derivations per cell, which is ~42 cells × those ops per render.
   */
  let isRangeStart = false;
  let isRangeEnd = false;
  let isRangeFilled = false;
  let isRangeMiddle = false;
  let isRangeMiddleRowStart = false;
  let isRangeMiddleRowEnd = false;
  if (highlightedRange) {
    isRangeStart = isSameDay(date, highlightedRange.start);
    isRangeEnd = isSameDay(date, highlightedRange.end);
    isRangeFilled = !isSameDay(highlightedRange.start, highlightedRange.end);

    /**
     * Range styling for “middle” segments must still apply when the calendar or cell is disabled:
     * {@link RangeCalendarState.isSelected} returns false for disabled cells, but start/end flags
     * use date equality only, so without this, strips disappear between endpoints while disabled.
     */
    const showRangeMiddleStrip = isSelected || isDisabled;
    isRangeMiddle = showRangeMiddleStrip && date.compare(highlightedRange.start) > 0 && date.compare(highlightedRange.end) < 0;
    if (showRangeMiddleStrip && !isRangeStart && !isRangeEnd) {
      const weekColumn = getDayOfWeek(date, locale, firstDayOfWeek);
      const isFirstDayOfMonth = isSameDay(date, startOfMonth(date));
      const isLastDayOfMonth = isSameDay(date, endOfMonth(date));
      const prevCalendarDay = date.add({
        days: -1
      });
      const nextCalendarDay = date.add({
        days: 1
      });

      /**
       * True when the adjacent calendar day is unavailable (e.g. weekend) but still lies inside
       * the highlighted span — i.e. a real “gap” in the strip. Do not use `!isSelected(adjacent)`
       * alone: when the whole calendar is disabled, `isSelected` is false for every day, which
       * would incorrectly set this for all in-range neighbors and apply `rounded-*-xl` on every
       * middle cell.
       */
      const isRowStartAfterUnavailableGap = isCalendarDateWithinInclusiveRange(prevCalendarDay, highlightedRange) && isPrevDayUnavailableInRange;
      const isRowEndBeforeUnavailableGap = isCalendarDateWithinInclusiveRange(nextCalendarDay, highlightedRange) && isNextDayUnavailableInRange;
      isRangeMiddleRowStart = weekColumn === 0 || isFirstDayOfMonth || isRowStartAfterUnavailableGap;
      isRangeMiddleRowEnd = weekColumn === 6 || isLastDayOfMonth || isRowEndBeforeUnavailableGap;
    }
  }
  const formattedDate = useMemo(() => dayFormatter.format(date.toDate(timeZone)), [date, dayFormatter, timeZone]);
  const renderProps = {
    date,
    formattedDate,
    isSelected,
    isRangeStart,
    isRangeEnd,
    isRangeFilled,
    isUnavailable,
    isDisabled,
    isOutsideMonth,
    isFocused,
    isToday: isTodayCell,
    isInvalid: isInvalidCell,
    isRangeMiddle,
    isRangeMiddleRowStart,
    isRangeMiddleRowEnd,
    isPressed
  };
  const cannotSelect = isDisabled || isUnavailable || isReadOnly;
  const handlePress = useCallback(e => {
    if (!cannotSelect) {
      selectDate(date);
    }
    onPress?.(e);
  }, [cannotSelect, date, onPress, selectDate]);
  const handlePressIn = useCallback(e => {
    setIsPressed(true);
    onPressIn?.(e);
  }, [onPressIn]);
  const handlePressOut = useCallback(e => {
    setIsPressed(false);
    onPressOut?.(e);
  }, [onPressOut]);
  const Component = asChild ? Slot.Pressable : Pressable;
  const content = typeof cellChildren === 'function' ? cellChildren(renderProps) : cellChildren ?? /*#__PURE__*/_jsx(Text, {
    children: formattedDate
  });
  return /*#__PURE__*/_jsx(Component, {
    ref: ref,
    accessibilityRole: "button",
    accessibilityLabel: formattedDate,
    accessibilityState: {
      selected: isSelected,
      disabled: isDisabled || isUnavailable
    },
    disabled: isDisabled || isUnavailable,
    onPress: handlePress,
    onPressIn: handlePressIn,
    onPressOut: handlePressOut,
    ...getCalendarCellDataAttributes({
      cellRenderProps: renderProps,
      isReadOnly
    }),
    ...pressableProps,
    children: content
  });
});
CalendarCellInner.displayName = 'HeroUINative.Primitive.Calendar.Cell.Inner';

/**
 * Memo comparator for {@link CalendarCell}. `date` is a fresh `CalendarDate` instance on every
 * grid render (produced by `state.getDatesInWeek`), so strict equality never matches — we compare
 * by `isSameDay`. All other props (className, style, handlers, etc.) fall back to reference
 * equality, matching React's default `memo` behavior.
 *
 * `children` gets special treatment: when both prev and next are functions, we skip the
 * comparison. Render-prop children are almost always defined inline by callers (the surrounding
 * `CalendarGridBody` child arrow is itself inline, so `useCallback` on the inner fn wouldn't even
 * help), which means strict equality would never match and defeat the memo entirely. The contract
 * is that render functions are *pure with respect to `cellRenderProps`* — if the cell's computed
 * state (`isSelected`, `isFocused`, etc.) hasn't changed, the render function's output also can't
 * change, so skipping re-execution is safe. Consumers that close over dynamic values outside
 * `cellRenderProps` (e.g. an external list of "event days") should make sure those values are
 * reflected in something the cell tracks, or bypass `memo` via `asChild` + a custom wrapper.
 *
 * Cells subscribe only to {@link CalendarCellComputedStateContext} (published by
 * {@link CalendarCellComputedStateProvider} inside {@link CalendarGridBody}) — whose value stays
 * referentially stable when the cell's own flags haven't changed — so this memo actually skips
 * re-renders on date selection: only the cells whose `isSelected` / `isCellFocused` flipped
 * receive a new context value and rerun.
 */
function areCalendarCellPropsEqual(prev, next) {
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
const CalendarCell = /*#__PURE__*/memo(CalendarCellInner, areCalendarCellPropsEqual);
CalendarCell.displayName = 'HeroUINative.Primitive.Calendar.Cell';

// --------------------------------------------------

const CalendarCellIndicator = /*#__PURE__*/forwardRef(function CalendarCellIndicator({
  asChild,
  isSelected = false,
  ...viewProps
}, ref) {
  const Component = asChild ? Slot.View : View;
  return /*#__PURE__*/_jsx(Component, {
    ref: ref,
    accessibilityElementsHidden: true,
    importantForAccessibility: "no-hide-descendants",
    ...viewProps,
    "data-selected": isSelected
  });
});
CalendarCellIndicator.displayName = 'HeroUINative.Primitive.Calendar.CellIndicator';

// --------------------------------------------------

export { CalendarCell, CalendarCellIndicator, CalendarGrid, CalendarGridBody, CalendarGridHeader, CalendarHeader, CalendarHeaderCell, CalendarHeading, CalendarNavButton, CalendarRoot, CalendarStateContext, RangeCalendarRoot, RangeCalendarStateContext, useCalendarLocale, useCalendarStateContext };