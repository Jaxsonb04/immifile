"use strict";

import { AnimationSettingsProvider } from 'heroui-native/contexts';
import { forwardRef, useCallback, useMemo } from 'react';
import { useControllableState } from "../../helpers/internal/hooks/index.js";
import InternationalizedDatePackage from "../../optional/internationalized-date.js";
import { WheelPicker } from "../wheel-picker/index.js";
import { WheelPickerGroup } from "../wheel-picker-group/index.js";
import { useWheelTimePickerRootAnimation } from "./wheel-time-picker.animation.js";
import { COLUMN_NAME, DEFAULT_HOUR_FORMAT, DEFAULT_MINUTE_INTERVAL, DISPLAY_NAME } from "./wheel-time-picker.constants.js";
import { useWheelTimePicker, WheelTimePickerProvider } from "./wheel-time-picker.context.js";
import { wheelTimePickerClassNames } from "./wheel-time-picker.styles.js";
import { buildHourItems, buildMinuteItems, buildPeriodItems, timeToWheelValues, wheelValuesToTime } from "./wheel-time-picker.utils.js";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
const {
  Time: TimeCtor
} = InternationalizedDatePackage ?? {};

// --------------------------------------------------

const WheelTimePickerRoot = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    value: valueProp,
    defaultValue,
    hourFormat = DEFAULT_HOUR_FORMAT,
    minuteInterval = DEFAULT_MINUTE_INTERVAL,
    locale,
    className,
    onValueChange: onValueChangeProp,
    onValueCommit,
    animation,
    ...restProps
  } = props;

  // `setTime` only ever receives a concrete `Time`, so narrow the
  // controllable `onChange` (which is typed `Time | undefined`) before
  // forwarding to the public `onValueChange`.
  const handleControllableChange = useCallback(next => {
    if (next !== undefined) {
      onValueChangeProp?.(next);
    }
  }, [onValueChangeProp]);
  const [time, setTime] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: handleControllableChange
  });

  // Midnight is used as the visible fallback when no value has been
  // selected yet so the wheels render a sensible position without
  // committing a value until the user interacts.
  const fallbackTime = useMemo(() => new TimeCtor(0, 0), []);
  const resolvedTime = time ?? fallbackTime;
  const {
    isAllAnimationsDisabled
  } = useWheelTimePickerRootAnimation({
    animation
  });
  const hourItems = useMemo(() => buildHourItems(hourFormat), [hourFormat]);
  const minuteItems = useMemo(() => buildMinuteItems(minuteInterval), [minuteInterval]);
  const periodItems = useMemo(() => buildPeriodItems(locale), [locale]);
  const groupValues = useMemo(() => {
    const decomposed = timeToWheelValues(resolvedTime, hourFormat, minuteInterval);
    const record = {
      [COLUMN_NAME.HOUR]: decomposed.hour,
      [COLUMN_NAME.MINUTE]: decomposed.minute
    };
    if (decomposed.period !== undefined) {
      record[COLUMN_NAME.PERIOD] = decomposed.period;
    }
    return record;
  }, [resolvedTime, hourFormat, minuteInterval]);
  const handleValuesChange = useCallback(values => {
    setTime(wheelValuesToTime(values, hourFormat));
  }, [hourFormat, setTime]);
  const handleValuesCommit = useCallback(values => {
    onValueCommit?.(wheelValuesToTime(values, hourFormat));
  }, [hourFormat, onValueCommit]);
  const rootClassName = wheelTimePickerClassNames.root({
    className
  });
  const animationSettingsContextValue = useMemo(() => ({
    isAllAnimationsDisabled
  }), [isAllAnimationsDisabled]);
  const contextValue = useMemo(() => ({
    hourItems,
    minuteItems,
    periodItems,
    hourFormat
  }), [hourItems, minuteItems, periodItems, hourFormat]);
  return /*#__PURE__*/_jsx(AnimationSettingsProvider, {
    value: animationSettingsContextValue,
    children: /*#__PURE__*/_jsx(WheelTimePickerProvider, {
      value: contextValue,
      children: /*#__PURE__*/_jsx(WheelPickerGroup, {
        ref: ref,
        values: groupValues,
        onValuesChange: handleValuesChange,
        onValuesCommit: onValueCommit ? handleValuesCommit : undefined,
        className: rootClassName,
        ...restProps,
        children: children ?? /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsx(WheelTimePickerHour, {}), /*#__PURE__*/_jsx(WheelTimePickerMinute, {}), hourFormat === 12 ? /*#__PURE__*/_jsx(WheelTimePickerPeriod, {}) : null, /*#__PURE__*/_jsx(WheelTimePickerIndicator, {}), /*#__PURE__*/_jsx(WheelTimePickerMask, {})]
        })
      })
    })
  });
});

// --------------------------------------------------

const WheelTimePickerHour = /*#__PURE__*/forwardRef(({
  classNames,
  ...props
}, ref) => {
  const {
    hourItems
  } = useWheelTimePicker();
  const {
    itemLabel
  } = wheelTimePickerClassNames.hour();
  const itemLabelClassName = itemLabel({
    className: classNames?.itemLabel
  });
  return /*#__PURE__*/_jsx(WheelPicker, {
    ref: ref,
    name: COLUMN_NAME.HOUR,
    items: hourItems,
    classNames: {
      ...classNames,
      itemLabel: itemLabelClassName
    },
    ...props
  });
});

// --------------------------------------------------

const WheelTimePickerMinute = /*#__PURE__*/forwardRef(({
  classNames,
  ...props
}, ref) => {
  const {
    minuteItems
  } = useWheelTimePicker();
  const {
    itemLabel
  } = wheelTimePickerClassNames.minute();
  const itemLabelClassName = itemLabel({
    className: classNames?.itemLabel
  });
  return /*#__PURE__*/_jsx(WheelPicker, {
    ref: ref,
    name: COLUMN_NAME.MINUTE,
    items: minuteItems,
    classNames: {
      ...classNames,
      itemLabel: itemLabelClassName
    },
    ...props
  });
});

// --------------------------------------------------

const WheelTimePickerPeriod = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    periodItems
  } = useWheelTimePicker();
  return /*#__PURE__*/_jsx(WheelPicker, {
    ref: ref,
    name: COLUMN_NAME.PERIOD,
    items: periodItems,
    ...props
  });
});

// --------------------------------------------------

const WheelTimePickerIndicator = /*#__PURE__*/forwardRef((props, ref) => {
  return /*#__PURE__*/_jsx(WheelPickerGroup.Indicator, {
    ref: ref,
    ...props
  });
});

// --------------------------------------------------

const WheelTimePickerMask = /*#__PURE__*/forwardRef((props, ref) => {
  return /*#__PURE__*/_jsx(WheelPickerGroup.Mask, {
    ref: ref,
    ...props
  });
});

// --------------------------------------------------

WheelTimePickerRoot.displayName = DISPLAY_NAME.ROOT;
WheelTimePickerHour.displayName = DISPLAY_NAME.HOUR;
WheelTimePickerMinute.displayName = DISPLAY_NAME.MINUTE;
WheelTimePickerPeriod.displayName = DISPLAY_NAME.PERIOD;
WheelTimePickerIndicator.displayName = DISPLAY_NAME.INDICATOR;
WheelTimePickerMask.displayName = DISPLAY_NAME.MASK;

/**
 * Standalone wheel time selector built on `WheelPickerGroup`.
 *
 * Renders hour and minute columns (plus an AM/PM period column in 12-hour
 * mode) and exchanges an `@internationalized/date` `Time` value. Usable
 * anywhere, or rendered inside `TimePicker.Wheel` for a trigger + presentation
 * experience.
 *
 * When `children` are omitted the root renders the full default set
 * (`Hour`, `Minute`, `Period` in 12-hour mode, `Indicator`, `Mask`). Pass
 * children to take full ownership of column order, content, and styling.
 *
 * @component WheelTimePicker - Root owning the `Time` value, item data, and the
 * underlying `WheelPickerGroup`. Cascades `animation="disable-all"`.
 * @component WheelTimePicker.Hour - Hour column. Root-owned `name` / `items`.
 * @component WheelTimePicker.Minute - Minute column. Root-owned `name` / `items`.
 * @component WheelTimePicker.Period - AM/PM column (12-hour). Root-owned `name` / `items`.
 * @component WheelTimePicker.Indicator - Shared selection band (`WheelPickerGroup.Indicator`).
 * @component WheelTimePicker.Mask - Top / bottom fade overlays (`WheelPickerGroup.Mask`).
 */
const WheelTimePicker = Object.assign(WheelTimePickerRoot, {
  /** Hour column. */
  Hour: WheelTimePickerHour,
  /** Minute column. */
  Minute: WheelTimePickerMinute,
  /** @optional AM/PM period column (rendered by default in 12-hour mode). */
  Period: WheelTimePickerPeriod,
  /** @optional Shared selection band spanning every column. */
  Indicator: WheelTimePickerIndicator,
  /** @optional Shared top / bottom fade overlays. */
  Mask: WheelTimePickerMask
});
export default WheelTimePicker;