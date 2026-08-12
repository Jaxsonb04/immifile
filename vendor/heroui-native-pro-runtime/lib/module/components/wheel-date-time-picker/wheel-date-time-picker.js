"use strict";

import { AnimationSettingsProvider } from 'heroui-native/contexts';
import { forwardRef, useCallback, useMemo } from 'react';
import { useControllableState } from "../../helpers/internal/hooks/index.js";
import InternationalizedDatePackage from "../../optional/internationalized-date.js";
import { WheelPicker } from "../wheel-picker/index.js";
import { WheelPickerGroup } from "../wheel-picker-group/index.js";
import { useWheelDateTimePickerRootAnimation } from "./wheel-date-time-picker.animation.js";
import { COLUMN_NAME, DEFAULT_HOUR_FORMAT, DEFAULT_MINUTE_INTERVAL, DISPLAY_NAME } from "./wheel-date-time-picker.constants.js";
import { useWheelDateTimePicker, WheelDateTimePickerProvider } from "./wheel-date-time-picker.context.js";
import { wheelDateTimePickerClassNames } from "./wheel-date-time-picker.styles.js";
import { buildDateItems, buildHourItems, buildMinuteItems, buildPeriodItems, dateTimeToWheelValues, resolveDateRange, wheelValuesToDateTime } from "./wheel-date-time-picker.utils.js";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
const {
  CalendarDateTime: CalendarDateTimeCtor,
  today,
  getLocalTimeZone
} = InternationalizedDatePackage ?? {};

// --------------------------------------------------

const WheelDateTimePickerRoot = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    value: valueProp,
    defaultValue,
    minValue,
    maxValue,
    hourFormat = DEFAULT_HOUR_FORMAT,
    minuteInterval = DEFAULT_MINUTE_INTERVAL,
    locale,
    formatDate,
    className,
    onValueChange: onValueChangeProp,
    onValueCommit,
    animation,
    ...restProps
  } = props;

  // `setDateTime` only ever receives a concrete `CalendarDateTime`, so narrow
  // the controllable `onChange` (typed `CalendarDateTime | undefined`) before
  // forwarding to the public `onValueChange`.
  const handleControllableChange = useCallback(next => {
    if (next !== undefined) {
      onValueChangeProp?.(next);
    }
  }, [onValueChangeProp]);
  const [dateTime, setDateTime] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: handleControllableChange
  });

  // The current local day at midnight is the visible fallback when no value
  // has been selected yet, so the wheels render a sensible position without
  // committing a value until the user interacts.
  const fallbackDate = useMemo(() => today(getLocalTimeZone()), []);
  const fallbackDateTime = useMemo(() => new CalendarDateTimeCtor(fallbackDate.year, fallbackDate.month, fallbackDate.day, 0, 0), [fallbackDate]);
  const resolvedDateTime = dateTime ?? fallbackDateTime;
  const {
    isAllAnimationsDisabled
  } = useWheelDateTimePickerRootAnimation({
    animation
  });
  const {
    min,
    max
  } = useMemo(() => resolveDateRange({
    value: dateTime,
    minValue,
    maxValue
  }), [dateTime, minValue, maxValue]);
  const dateItems = useMemo(() => buildDateItems({
    min,
    max,
    locale,
    formatDate
  }), [min, max, locale, formatDate]);
  const hourItems = useMemo(() => buildHourItems(hourFormat), [hourFormat]);
  const minuteItems = useMemo(() => buildMinuteItems(minuteInterval), [minuteInterval]);
  const periodItems = useMemo(() => buildPeriodItems(locale), [locale]);
  const groupValues = useMemo(() => {
    const decomposed = dateTimeToWheelValues(resolvedDateTime, hourFormat, minuteInterval);
    const record = {
      [COLUMN_NAME.DATE]: decomposed.date,
      [COLUMN_NAME.HOUR]: decomposed.hour,
      [COLUMN_NAME.MINUTE]: decomposed.minute
    };
    if (decomposed.period !== undefined) {
      record[COLUMN_NAME.PERIOD] = decomposed.period;
    }
    return record;
  }, [resolvedDateTime, hourFormat, minuteInterval]);
  const handleValuesChange = useCallback(values => {
    setDateTime(wheelValuesToDateTime(values, hourFormat, fallbackDate));
  }, [hourFormat, fallbackDate, setDateTime]);
  const handleValuesCommit = useCallback(values => {
    onValueCommit?.(wheelValuesToDateTime(values, hourFormat, fallbackDate));
  }, [hourFormat, fallbackDate, onValueCommit]);
  const rootClassName = wheelDateTimePickerClassNames.root({
    className
  });
  const animationSettingsContextValue = useMemo(() => ({
    isAllAnimationsDisabled
  }), [isAllAnimationsDisabled]);
  const contextValue = useMemo(() => ({
    dateItems,
    hourItems,
    minuteItems,
    periodItems,
    hourFormat
  }), [dateItems, hourItems, minuteItems, periodItems, hourFormat]);
  return /*#__PURE__*/_jsx(AnimationSettingsProvider, {
    value: animationSettingsContextValue,
    children: /*#__PURE__*/_jsx(WheelDateTimePickerProvider, {
      value: contextValue,
      children: /*#__PURE__*/_jsx(WheelPickerGroup, {
        ref: ref,
        values: groupValues,
        onValuesChange: handleValuesChange,
        onValuesCommit: onValueCommit ? handleValuesCommit : undefined,
        className: rootClassName,
        ...restProps,
        children: children ?? /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsx(WheelDateTimePickerDate, {}), /*#__PURE__*/_jsx(WheelDateTimePickerHour, {}), /*#__PURE__*/_jsx(WheelDateTimePickerMinute, {}), hourFormat === 12 ? /*#__PURE__*/_jsx(WheelDateTimePickerPeriod, {}) : null, /*#__PURE__*/_jsx(WheelDateTimePickerIndicator, {}), /*#__PURE__*/_jsx(WheelDateTimePickerMask, {})]
        })
      })
    })
  });
});

// --------------------------------------------------

const WheelDateTimePickerDate = /*#__PURE__*/forwardRef(({
  classNames,
  ...props
}, ref) => {
  const {
    dateItems
  } = useWheelDateTimePicker();
  const {
    container,
    itemLabel
  } = wheelDateTimePickerClassNames.date();
  const containerClassName = container({
    className: classNames?.container
  });
  const itemLabelClassName = itemLabel({
    className: classNames?.itemLabel
  });
  return /*#__PURE__*/_jsx(WheelPicker, {
    ref: ref,
    name: COLUMN_NAME.DATE,
    items: dateItems,
    classNames: {
      ...classNames,
      container: containerClassName,
      itemLabel: itemLabelClassName
    },
    ...props
  });
});

// --------------------------------------------------

const WheelDateTimePickerHour = /*#__PURE__*/forwardRef(({
  classNames,
  ...props
}, ref) => {
  const {
    hourItems
  } = useWheelDateTimePicker();
  const {
    container,
    itemLabel
  } = wheelDateTimePickerClassNames.hour();
  const containerClassName = container({
    className: classNames?.container
  });
  const itemLabelClassName = itemLabel({
    className: classNames?.itemLabel
  });
  return /*#__PURE__*/_jsx(WheelPicker, {
    ref: ref,
    name: COLUMN_NAME.HOUR,
    items: hourItems,
    classNames: {
      ...classNames,
      container: containerClassName,
      itemLabel: itemLabelClassName
    },
    ...props
  });
});

// --------------------------------------------------

const WheelDateTimePickerMinute = /*#__PURE__*/forwardRef(({
  classNames,
  ...props
}, ref) => {
  const {
    minuteItems
  } = useWheelDateTimePicker();
  const {
    container,
    itemLabel
  } = wheelDateTimePickerClassNames.minute();
  const containerClassName = container({
    className: classNames?.container
  });
  const itemLabelClassName = itemLabel({
    className: classNames?.itemLabel
  });
  return /*#__PURE__*/_jsx(WheelPicker, {
    ref: ref,
    name: COLUMN_NAME.MINUTE,
    items: minuteItems,
    classNames: {
      ...classNames,
      container: containerClassName,
      itemLabel: itemLabelClassName
    },
    ...props
  });
});

// --------------------------------------------------

const WheelDateTimePickerPeriod = /*#__PURE__*/forwardRef(({
  classNames,
  ...props
}, ref) => {
  const {
    periodItems
  } = useWheelDateTimePicker();
  const {
    container
  } = wheelDateTimePickerClassNames.period();
  const containerClassName = container({
    className: classNames?.container
  });
  return /*#__PURE__*/_jsx(WheelPicker, {
    ref: ref,
    name: COLUMN_NAME.PERIOD,
    items: periodItems,
    classNames: {
      ...classNames,
      container: containerClassName
    },
    ...props
  });
});

// --------------------------------------------------

const WheelDateTimePickerIndicator = /*#__PURE__*/forwardRef((props, ref) => {
  return /*#__PURE__*/_jsx(WheelPickerGroup.Indicator, {
    ref: ref,
    ...props
  });
});

// --------------------------------------------------

const WheelDateTimePickerMask = /*#__PURE__*/forwardRef((props, ref) => {
  return /*#__PURE__*/_jsx(WheelPickerGroup.Mask, {
    ref: ref,
    ...props
  });
});

// --------------------------------------------------

WheelDateTimePickerRoot.displayName = DISPLAY_NAME.ROOT;
WheelDateTimePickerDate.displayName = DISPLAY_NAME.DATE;
WheelDateTimePickerHour.displayName = DISPLAY_NAME.HOUR;
WheelDateTimePickerMinute.displayName = DISPLAY_NAME.MINUTE;
WheelDateTimePickerPeriod.displayName = DISPLAY_NAME.PERIOD;
WheelDateTimePickerIndicator.displayName = DISPLAY_NAME.INDICATOR;
WheelDateTimePickerMask.displayName = DISPLAY_NAME.MASK;

/**
 * Standalone wheel date-time selector built on `WheelPickerGroup`.
 *
 * Renders a combined day column (iOS-style: "Today", "Wed, Jun 3", ...)
 * alongside hour and minute columns (plus an AM/PM period column in 12-hour
 * mode) and exchanges an `@internationalized/date` `CalendarDateTime` value.
 * Usable anywhere, or rendered inside `DateTimePicker.Wheel` for a trigger +
 * presentation experience.
 *
 * When `children` are omitted the root renders the full default set
 * (`Date`, `Hour`, `Minute`, `Period` in 12-hour mode, `Indicator`, `Mask`).
 * Pass children to take full ownership of column order, content, and styling.
 *
 * @component WheelDateTimePicker - Root owning the `CalendarDateTime` value,
 * item data, and the underlying `WheelPickerGroup`. Cascades
 * `animation="disable-all"`.
 * @component WheelDateTimePicker.Date - Combined day column. Root-owned `name` / `items`.
 * @component WheelDateTimePicker.Hour - Hour column. Root-owned `name` / `items`.
 * @component WheelDateTimePicker.Minute - Minute column. Root-owned `name` / `items`.
 * @component WheelDateTimePicker.Period - AM/PM column (12-hour). Root-owned `name` / `items`.
 * @component WheelDateTimePicker.Indicator - Shared selection band (`WheelPickerGroup.Indicator`).
 * @component WheelDateTimePicker.Mask - Top / bottom fade overlays (`WheelPickerGroup.Mask`).
 */
const WheelDateTimePicker = Object.assign(WheelDateTimePickerRoot, {
  /** Combined day column. */
  Date: WheelDateTimePickerDate,
  /** Hour column. */
  Hour: WheelDateTimePickerHour,
  /** Minute column. */
  Minute: WheelDateTimePickerMinute,
  /** @optional AM/PM period column (rendered by default in 12-hour mode). */
  Period: WheelDateTimePickerPeriod,
  /** @optional Shared selection band spanning every column. */
  Indicator: WheelDateTimePickerIndicator,
  /** @optional Shared top / bottom fade overlays. */
  Mask: WheelDateTimePickerMask
});
export default WheelDateTimePicker;