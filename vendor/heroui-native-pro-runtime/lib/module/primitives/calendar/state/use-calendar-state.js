"use strict";

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { useControllableState } from "../../../helpers/internal/hooks/use-controllable-state.js";
import InternationalizedDatePackage from "../../../optional/internationalized-date.js";
import { alignCenter, alignEnd, alignStart, constrainStart, constrainValue, isInvalid, previousAvailableDate } from "./utils.js";
const {
  CalendarDate,
  DateFormatter,
  endOfMonth,
  endOfWeek,
  getDayOfWeek,
  GregorianCalendar,
  isEqualCalendar,
  isSameDay,
  startOfMonth,
  startOfWeek,
  toCalendar,
  toCalendarDate,
  today
} = InternationalizedDatePackage ?? {};
function unitDuration(duration) {
  const unit = {
    ...duration
  };
  for (const key in duration) {
    if (Object.prototype.hasOwnProperty.call(duration, key)) {
      unit[key] = 1;
    }
  }
  return unit;
}

/**
 * Provides state management for a calendar component.
 * A calendar displays one or more date grids and allows users to select a single date.
 */
export function useCalendarState(props) {
  const defaultFormatter = useMemo(() => new DateFormatter(props.locale), [props.locale]);
  const resolvedOptions = useMemo(() => defaultFormatter.resolvedOptions(), [defaultFormatter]);
  const {
    locale,
    createCalendar,
    visibleDuration = {
      months: 1
    },
    minValue,
    maxValue,
    selectionAlignment,
    isDateUnavailable,
    pageBehavior = 'visible',
    firstDayOfWeek,
    preserveFocusedDayOnPage: preserveFocusedDayOnPageProp
  } = props;
  const preserveFocusedDayOnPage = preserveFocusedDayOnPageProp ?? Platform.OS === 'web';
  const calendar = useMemo(() => createCalendar(resolvedOptions.calendar), [createCalendar, resolvedOptions.calendar]);
  const [value, setControlledValue] = useControllableState({
    prop: props.value,
    defaultProp: props.defaultValue ?? null,
    onChange: props.onChange
  });
  const calendarDateValue = useMemo(() => value ? toCalendar(toCalendarDate(value), calendar) : null, [value, calendar]);
  const timeZone = useMemo(() => value && 'timeZone' in value ? value.timeZone : resolvedOptions.timeZone, [value, resolvedOptions.timeZone]);
  const focusedCalendarDate = useMemo(() => props.focusedValue ? constrainValue(toCalendar(toCalendarDate(props.focusedValue), calendar), minValue, maxValue) : undefined, [props.focusedValue, calendar, minValue, maxValue]);
  const defaultFocusedCalendarDate = useMemo(() => constrainValue(props.defaultFocusedValue ? toCalendar(toCalendarDate(props.defaultFocusedValue), calendar) : calendarDateValue || toCalendar(today(timeZone), calendar), minValue, maxValue), [props.defaultFocusedValue, calendarDateValue, timeZone, calendar, minValue, maxValue]);
  const [focusedDate, setFocusedDate] = useControllableState({
    prop: focusedCalendarDate,
    defaultProp: defaultFocusedCalendarDate,
    onChange: props.onFocusChange
  });
  const resolvedFocusedDate = focusedDate ?? defaultFocusedCalendarDate;
  const [startDate, setStartDate] = useState(() => {
    const fd = defaultFocusedCalendarDate;
    switch (selectionAlignment) {
      case 'start':
        return alignStart(fd, visibleDuration, locale, minValue, maxValue);
      case 'end':
        return alignEnd(fd, visibleDuration, locale, minValue, maxValue);
      case 'center':
      default:
        return alignCenter(fd, visibleDuration, locale, minValue, maxValue);
    }
  });
  const [isFocused, setFocused] = useState(props.autoFocus ?? false);

  /**
   * When the controlled `value` changes (e.g. from a DateField keyboard input),
   * navigate the focused date and visible range to the new value's month/year
   * so the calendar does not stay stuck on its previous page.
   */
  const prevCalendarDateValueRef = useRef(calendarDateValue);
  useLayoutEffect(() => {
    const prev = prevCalendarDateValueRef.current;
    prevCalendarDateValueRef.current = calendarDateValue;
    if (!calendarDateValue || prev && isSameDay(prev, calendarDateValue)) {
      return;
    }
    setFocusedDate(calendarDateValue);
    setStartDate(alignCenter(calendarDateValue, visibleDuration, locale, minValue, maxValue));
  }, [calendarDateValue, visibleDuration, locale, minValue, maxValue, setFocusedDate]);
  const endDate = useMemo(() => {
    const duration = {
      ...visibleDuration
    };
    if (duration.days) {
      duration.days--;
    } else {
      duration.days = -1;
    }
    return startDate.add(duration);
  }, [startDate, visibleDuration]);
  const [lastCalendar, setLastCalendar] = useState(calendar);

  /**
   * Keep visible range and focused date aligned with calendar system, min/max, and paging.
   * This must not run during render: a controlled `onFocusChange` would update the parent
   * while the calendar is still rendering, which React rejects.
   */
  useLayoutEffect(() => {
    if (!isEqualCalendar(calendar, lastCalendar)) {
      const newFocusedDate = toCalendar(resolvedFocusedDate, calendar);
      setStartDate(alignCenter(newFocusedDate, visibleDuration, locale, minValue, maxValue));
      setFocusedDate(newFocusedDate);
      setLastCalendar(calendar);
      return;
    }
    if (isInvalid(resolvedFocusedDate, minValue, maxValue)) {
      setFocusedDate(constrainValue(resolvedFocusedDate, minValue, maxValue));
      return;
    }
    if (resolvedFocusedDate.compare(startDate) < 0) {
      if (preserveFocusedDayOnPage) {
        setStartDate(alignEnd(resolvedFocusedDate, visibleDuration, locale, minValue, maxValue));
      }
      return;
    }
    if (resolvedFocusedDate.compare(endDate) > 0) {
      if (preserveFocusedDayOnPage) {
        setStartDate(alignStart(resolvedFocusedDate, visibleDuration, locale, minValue, maxValue));
      }
    }
  }, [calendar, lastCalendar, resolvedFocusedDate, startDate, endDate, visibleDuration, locale, minValue, maxValue, preserveFocusedDayOnPage, setFocusedDate, setStartDate, setLastCalendar]);
  function focusCell(date) {
    setFocusedDate(constrainValue(date, minValue, maxValue));
  }
  function setValue(newValue) {
    if (!props.isDisabled && !props.isReadOnly) {
      let localValue = newValue;
      if (localValue === null) {
        setControlledValue(null);
        return;
      }
      localValue = constrainValue(localValue, minValue, maxValue);
      const minBound = minValue != null ? toCalendarDate(minValue) : undefined;
      const adjusted = previousAvailableDate(localValue, minBound, isDateUnavailable ? d => isDateUnavailable(d) : undefined);
      if (!adjusted) {
        return;
      }
      localValue = adjusted;
      localValue = toCalendar(localValue, value?.calendar ?? new GregorianCalendar());
      if (value && 'hour' in value) {
        setControlledValue(value.set(localValue));
      } else {
        setControlledValue(localValue);
      }
    }
  }
  const isUnavailable = useMemo(() => {
    if (!calendarDateValue) {
      return false;
    }
    if (isDateUnavailable && isDateUnavailable(calendarDateValue)) {
      return true;
    }
    return isInvalid(calendarDateValue, minValue, maxValue);
  }, [calendarDateValue, isDateUnavailable, minValue, maxValue]);
  const isValueInvalid = props.isInvalid || isUnavailable;
  const pageDuration = useMemo(() => {
    if (pageBehavior === 'visible') {
      return visibleDuration;
    }
    return unitDuration(visibleDuration);
  }, [pageBehavior, visibleDuration]);
  function isInvalidForProps(date) {
    return isInvalid(date, minValue, maxValue);
  }
  function isCellDisabledForProps(date) {
    return (props.isDisabled ?? false) || date.compare(startDate) < 0 || date.compare(endDate) > 0 || isInvalidForProps(date);
  }
  function isCellUnavailableForProps(date) {
    return props.isDateUnavailable ? props.isDateUnavailable(date) : false;
  }
  function focusNextPageImpl() {
    const nextStart = startDate.add(pageDuration);
    if (preserveFocusedDayOnPage) {
      setFocusedDate(constrainValue(resolvedFocusedDate.add(pageDuration), minValue, maxValue));
    }
    setStartDate(alignStart(constrainStart(resolvedFocusedDate, nextStart, pageDuration, locale, minValue, maxValue), pageDuration, locale));
  }
  function focusPreviousPageImpl() {
    const nextStart = startDate.subtract(pageDuration);
    if (preserveFocusedDayOnPage) {
      setFocusedDate(constrainValue(resolvedFocusedDate.subtract(pageDuration), minValue, maxValue));
    }
    setStartDate(alignStart(constrainStart(resolvedFocusedDate, nextStart, pageDuration, locale, minValue, maxValue), pageDuration, locale));
  }
  const state = {
    isDisabled: props.isDisabled ?? false,
    isReadOnly: props.isReadOnly ?? false,
    value: calendarDateValue,
    setValue,
    visibleRange: {
      start: startDate,
      end: endDate
    },
    minValue,
    maxValue,
    focusedDate: resolvedFocusedDate,
    timeZone,
    isValueInvalid,
    /**
     * Public focus setter. In addition to moving `focusedDate`, aligns the visible range
     * (`startDate`) to contain the new date when it falls outside the currently visible
     * window. This is the behavior external callers expect — e.g. the year picker setting
     * a new year, or a date-field keyboard edit jumping months — otherwise only
     * `focusedDate` would move and the grid/heading would remain stuck on the prior page.
     *
     * We cannot rely on the alignment layout effect below to do this: that effect gates
     * its re-alignment on `preserveFocusedDayOnPage` (false by default on native) because
     * `focusNextPage` / `focusPreviousPage` intentionally move `startDate` without
     * touching `focusedDate` and re-aligning would undo paging. Paging calls the internal
     * `setFocusedDate` setter directly, so handling alignment here only affects explicit
     * public `state.setFocusedDate` callers.
     */
    setFocusedDate(date) {
      const constrained = constrainValue(date, minValue, maxValue);
      setFocusedDate(constrained);
      if (constrained.compare(startDate) < 0 || constrained.compare(endDate) > 0) {
        setStartDate(alignCenter(constrained, visibleDuration, locale, minValue, maxValue));
      }
    },
    focusNextDay() {
      focusCell(resolvedFocusedDate.add({
        days: 1
      }));
    },
    focusPreviousDay() {
      focusCell(resolvedFocusedDate.subtract({
        days: 1
      }));
    },
    focusNextRow() {
      if (visibleDuration.days) {
        focusNextPageImpl();
      } else if (visibleDuration.weeks || visibleDuration.months || visibleDuration.years) {
        focusCell(resolvedFocusedDate.add({
          weeks: 1
        }));
      }
    },
    focusPreviousRow() {
      if (visibleDuration.days) {
        focusPreviousPageImpl();
      } else if (visibleDuration.weeks || visibleDuration.months || visibleDuration.years) {
        focusCell(resolvedFocusedDate.subtract({
          weeks: 1
        }));
      }
    },
    focusNextPage: focusNextPageImpl,
    focusPreviousPage: focusPreviousPageImpl,
    focusSectionStart() {
      if (visibleDuration.days) {
        focusCell(startDate);
      } else if (visibleDuration.weeks) {
        focusCell(startOfWeek(resolvedFocusedDate, locale));
      } else if (visibleDuration.months || visibleDuration.years) {
        focusCell(startOfMonth(resolvedFocusedDate));
      }
    },
    focusSectionEnd() {
      if (visibleDuration.days) {
        focusCell(endDate);
      } else if (visibleDuration.weeks) {
        focusCell(endOfWeek(resolvedFocusedDate, locale));
      } else if (visibleDuration.months || visibleDuration.years) {
        focusCell(endOfMonth(resolvedFocusedDate));
      }
    },
    focusNextSection(larger) {
      if (!larger && !visibleDuration.days) {
        focusCell(resolvedFocusedDate.add(unitDuration(visibleDuration)));
        return;
      }
      if (visibleDuration.days) {
        focusNextPageImpl();
      } else if (visibleDuration.weeks) {
        focusCell(resolvedFocusedDate.add({
          months: 1
        }));
      } else if (visibleDuration.months || visibleDuration.years) {
        focusCell(resolvedFocusedDate.add({
          years: 1
        }));
      }
    },
    focusPreviousSection(larger) {
      if (!larger && !visibleDuration.days) {
        focusCell(resolvedFocusedDate.subtract(unitDuration(visibleDuration)));
        return;
      }
      if (visibleDuration.days) {
        focusPreviousPageImpl();
      } else if (visibleDuration.weeks) {
        focusCell(resolvedFocusedDate.subtract({
          months: 1
        }));
      } else if (visibleDuration.months || visibleDuration.years) {
        focusCell(resolvedFocusedDate.subtract({
          years: 1
        }));
      }
    },
    selectFocusedDate() {
      if (!(isDateUnavailable && isDateUnavailable(resolvedFocusedDate))) {
        setValue(resolvedFocusedDate);
      }
    },
    selectDate(date) {
      setValue(date);
    },
    isFocused,
    setFocused,
    isInvalid: isInvalidForProps,
    isSelected(date) {
      return calendarDateValue != null && isSameDay(date, calendarDateValue) && !isCellDisabledForProps(date) && !isCellUnavailableForProps(date);
    },
    isCellFocused(date) {
      return isFocused && isSameDay(date, resolvedFocusedDate);
    },
    isCellDisabled: isCellDisabledForProps,
    isCellUnavailable: isCellUnavailableForProps,
    isPreviousVisibleRangeInvalid() {
      const prev = startDate.subtract({
        days: 1
      });
      return isSameDay(prev, startDate) || isInvalidForProps(prev);
    },
    isNextVisibleRangeInvalid() {
      const next = endDate.add({
        days: 1
      });
      return isSameDay(next, endDate) || isInvalidForProps(next);
    },
    getDatesInWeek(weekIndex, from = startDate) {
      let date = from.add({
        weeks: weekIndex
      });
      const dates = [];
      date = startOfWeek(date, locale, firstDayOfWeek);
      const dayOfWeek = getDayOfWeek(date, locale, firstDayOfWeek);
      for (let i = 0; i < dayOfWeek; i++) {
        dates.push(null);
      }
      while (dates.length < 7) {
        dates.push(date);
        const nextDate = date.add({
          days: 1
        });
        if (isSameDay(date, nextDate)) {
          break;
        }
        date = nextDate;
      }
      while (dates.length < 7) {
        dates.push(null);
      }
      return dates;
    }
  };
  return state;
}