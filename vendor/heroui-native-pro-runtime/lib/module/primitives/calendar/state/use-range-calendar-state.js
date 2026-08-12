"use strict";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useControllableState } from "../../../helpers/internal/hooks/use-controllable-state.js";
import InternationalizedDatePackage from "../../../optional/internationalized-date.js";
import { useCalendarState } from "./use-calendar-state.js";
import { alignCenter, constrainValue, isInvalid, previousAvailableDate } from "./utils.js";
const {
  GregorianCalendar,
  maxDate,
  minDate,
  toCalendar,
  toCalendarDate
} = InternationalizedDatePackage ?? {};

/**
 * Range selection: `value` / `defaultValue` / `onChange` use {@link RangeValue}.
 * When combined with `isDateUnavailable`, `allowsNonContiguousRanges` permits ranges that include unavailable dates.
 */

/** Alias for consumers mirroring React Spectrum naming. */

/**
 * From an anchor, steps day-by-day in `dir` (-1 or 1) until leaving the visible range or hitting
 * an unavailable date, then returns the last still-available date along that path (Adobe parity).
 */
function nextUnavailableDate(anchorDate, state, dir) {
  let nextDate = anchorDate.add({
    days: dir
  });
  while ((dir < 0 ? nextDate.compare(state.visibleRange.start) >= 0 : nextDate.compare(state.visibleRange.end) <= 0) && !state.isCellUnavailable(nextDate)) {
    nextDate = nextDate.add({
      days: dir
    });
  }
  if (state.isCellUnavailable(nextDate)) {
    return nextDate.add({
      days: -dir
    });
  }
  return undefined;
}
function makeRange(start, end) {
  let a = start;
  let b = end;
  if (b.compare(a) < 0) {
    const t = a;
    a = b;
    b = t;
  }
  return {
    start: toCalendarDate(a),
    end: toCalendarDate(b)
  };
}
function convertValue(newValue, oldValue) {
  let out = toCalendar(newValue, oldValue?.calendar ?? new GregorianCalendar());
  if (oldValue && 'hour' in oldValue) {
    return oldValue.set(out);
  }
  return out;
}

/**
 * Avoids setState loops: `availableRange` must not update when start/end are unchanged, and new
 * object identity alone must not trigger another render cycle.
 */
function partialAvailableRangeEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (a === null || b === null) {
    return a === b;
  }
  const compareEnds = (x, y) => {
    if (x === undefined && y === undefined) {
      return true;
    }
    if (x === undefined || y === undefined) {
      return false;
    }
    return toCalendarDate(x).compare(toCalendarDate(y)) === 0;
  };
  return compareEnds(a.start, b.start) && compareEnds(a.end, b.end);
}

/**
 * State for a range calendar: contiguous (or optionally non-contiguous) date range selection.
 * Composes {@link useCalendarState} for focus, visible range, and grid behavior.
 */
export function useRangeCalendarState(props) {
  const {
    value: valueProp,
    defaultValue,
    onChange,
    createCalendar,
    locale,
    visibleDuration = {
      months: 1
    },
    minValue,
    maxValue,
    allowsNonContiguousRanges,
    isDateUnavailable,
    ...calendarRest
  } = props;
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue ?? null,
    onChange: onChange
  });
  const resolvedValue = value ?? null;
  const [anchorDate, setAnchorDateState] = useState(null);
  let alignment = 'center';
  if (resolvedValue && resolvedValue.start && resolvedValue.end) {
    const startAligned = alignCenter(toCalendarDate(resolvedValue.start), visibleDuration, locale, minValue, maxValue);
    const endOfVisible = startAligned.add(visibleDuration).subtract({
      days: 1
    });
    if (toCalendarDate(resolvedValue.end).compare(endOfVisible) > 0) {
      alignment = 'start';
    }
  }
  const availableRangeRef = useRef(null);
  const [availableRange, setAvailableRange] = useState(null);
  const min = useMemo(() => maxDate(minValue, availableRange?.start), [minValue, availableRange]);
  const max = useMemo(() => minDate(maxValue, availableRange?.end), [maxValue, availableRange]);
  const calendar = useCalendarState({
    ...calendarRest,
    isDateUnavailable,
    value: resolvedValue ? resolvedValue.start : null,
    defaultValue: defaultValue ? defaultValue.start : undefined,
    createCalendar,
    locale,
    visibleDuration,
    minValue: min,
    maxValue: max,
    selectionAlignment: props.selectionAlignment ?? alignment,
    preserveFocusedDayOnPage: props.preserveFocusedDayOnPage
  });
  const calendarRef = useRef(calendar);
  calendarRef.current = calendar;
  const updateAvailableRange = useCallback(date => {
    const cal = calendarRef.current;
    if (date && isDateUnavailable && !allowsNonContiguousRanges) {
      const nextAvailableStartDate = nextUnavailableDate(date, cal, -1);
      const nextAvailableEndDate = nextUnavailableDate(date, cal, 1);
      const next = {
        start: nextAvailableStartDate,
        end: nextAvailableEndDate
      };
      availableRangeRef.current = next;
      setAvailableRange(prev => partialAvailableRangeEqual(prev, next) ? prev : next);
    } else {
      availableRangeRef.current = null;
      setAvailableRange(prev => prev === null ? prev : null);
    }
  }, [allowsNonContiguousRanges, isDateUnavailable]);

  // Intentionally omit visibleRange from deps: it changes when `availableRange` updates min/max,
  // which would re-enter this effect and overflow the update depth.
  useLayoutEffect(() => {
    updateAvailableRange(anchorDate);
  }, [anchorDate, updateAvailableRange]);
  const setAnchorDate = useCallback(date => {
    setAnchorDateState(date);
    if (date) {
      updateAvailableRange(date);
    } else {
      updateAvailableRange(null);
    }
  }, [updateAvailableRange]);
  const highlightedRange = anchorDate ? makeRange(anchorDate, calendar.focusedDate) : resolvedValue ? makeRange(resolvedValue.start, resolvedValue.end) : null;
  const unavailableFn = useMemo(() => isDateUnavailable ? d => isDateUnavailable(d) : undefined, [isDateUnavailable]);
  const selectDate = useCallback(date => {
    if (props.isReadOnly) {
      return;
    }
    const constrainedDate = constrainValue(date, min, max);
    const previousAvailableConstrainedDate = previousAvailableDate(constrainedDate, calendar.visibleRange.start, unavailableFn);
    if (!previousAvailableConstrainedDate) {
      return;
    }
    if (!anchorDate) {
      if (resolvedValue) {
        setValue(null);
      }
      setAnchorDate(previousAvailableConstrainedDate);
      calendarRef.current.setFocusedDate(previousAvailableConstrainedDate);
    } else {
      const range = makeRange(anchorDate, previousAvailableConstrainedDate);
      if (range) {
        setValue({
          start: convertValue(range.start, resolvedValue?.start),
          end: convertValue(range.end, resolvedValue?.end)
        });
      }
      setAnchorDate(null);
    }
  }, [anchorDate, calendar.visibleRange.start, min, max, props.isReadOnly, resolvedValue, setAnchorDate, setValue, unavailableFn]);
  const [isDragging, setDragging] = useState(false);
  const isInvalidSelection = useMemo(() => {
    if (!resolvedValue || anchorDate) {
      return false;
    }
    if (isDateUnavailable && (isDateUnavailable(resolvedValue.start) || isDateUnavailable(resolvedValue.end))) {
      return true;
    }
    return isInvalid(resolvedValue.start, minValue, maxValue) || isInvalid(resolvedValue.end, minValue, maxValue);
  }, [anchorDate, isDateUnavailable, maxValue, minValue, resolvedValue]);
  const isValueInvalid = (props.isInvalid ?? false) || isInvalidSelection;
  const rangeState = {
    ...calendar,
    value: resolvedValue,
    setValue,
    anchorDate,
    setAnchorDate,
    highlightedRange,
    isValueInvalid,
    selectFocusedDate() {
      selectDate(calendar.focusedDate);
    },
    selectDate,
    highlightDate(date) {
      if (anchorDate) {
        calendar.setFocusedDate(date);
      }
    },
    isSelected(date) {
      return Boolean(highlightedRange && date.compare(highlightedRange.start) >= 0 && date.compare(highlightedRange.end) <= 0 && !calendar.isCellDisabled(date) && !calendar.isCellUnavailable(date));
    },
    isInvalid(date) {
      return calendar.isInvalid(date) || isInvalid(date, availableRangeRef.current?.start, availableRangeRef.current?.end);
    },
    isDragging,
    setDragging,
    clearSelection() {
      setAnchorDate(null);
      setValue(null);
    }
  };
  return rangeState;
}