"use strict";

import { AnimationSettingsProvider, FormFieldProvider, useFormField } from 'heroui-native/contexts';
import { useThemeColor } from 'heroui-native/hooks';
import { Select } from 'heroui-native/select';
import { cn } from 'heroui-native/utils';
import { forwardRef, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useControllableState } from "../../helpers/internal/hooks/index.js";
import { CalendarIcon } from "../../helpers/internal/icons/index.js";
import { WheelDateTimePicker } from "../wheel-date-time-picker/index.js";
import { useDateTimePickerRootAnimation } from "./date-time-picker.animation.js";
import { DEFAULT_DATE_TIME_DISPLAY_FORMAT, DEFAULT_HOUR_FORMAT, DEFAULT_MINUTE_INTERVAL, DISPLAY_NAME } from "./date-time-picker.constants.js";
import { DateTimePickerProvider, useDateTimePicker } from "./date-time-picker.context.js";
import { dateTimePickerClassNames } from "./date-time-picker.styles.js";
import { formatDateTimeForDisplay, tryParseDateTimePickerValueString } from "./date-time-picker.utils.js";

// --------------------------------------------------
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
const DateTimePickerRoot = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    isDisabled = false,
    isInvalid = false,
    isRequired = false,
    animation,
    value: valueProp,
    defaultValue,
    onValueChange: onValueChangeProp,
    isOpen: isOpenProp,
    isDefaultOpen,
    onOpenChange: onOpenChangeProp,
    minValue,
    maxValue,
    hourFormat = DEFAULT_HOUR_FORMAT,
    minuteInterval = DEFAULT_MINUTE_INTERVAL,
    dateTimeDisplayFormat = DEFAULT_DATE_TIME_DISPLAY_FORMAT,
    locale,
    formatDate,
    formatDateTime,
    ...restProps
  } = props;
  const rootClassName = dateTimePickerClassNames.root({
    className
  });
  const {
    isAllAnimationsDisabled
  } = useDateTimePickerRootAnimation({
    animation
  });
  const [selected, setSelected] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChangeProp
  });
  const [openState, setOpenState] = useControllableState({
    prop: isOpenProp,
    defaultProp: isDefaultOpen,
    onChange: onOpenChangeProp
  });
  const isOpen = openState ?? false;
  const formatLabel = useCallback(value => formatDateTimeForDisplay(value, {
    dateTimeDisplayFormat,
    hourFormat,
    locale,
    formatDateTime
  }), [dateTimeDisplayFormat, hourFormat, locale, formatDateTime]);
  const commitDateTime = useCallback((value, options) => {
    const label = formatLabel(value);
    setSelected({
      value: value.toString(),
      label
    });
    if (options?.close !== false) {
      setOpenState(false);
    }
  }, [formatLabel, setSelected, setOpenState]);
  const formFieldContextValue = useMemo(() => ({
    isDisabled,
    isInvalid,
    isRequired,
    hasFieldPadding: true
  }), [isDisabled, isInvalid, isRequired]);
  const animationSettingsContextValue = useMemo(() => ({
    isAllAnimationsDisabled
  }), [isAllAnimationsDisabled]);
  const dateTimePickerContextValue = useMemo(() => ({
    value: selected,
    onValueChange: setSelected,
    isOpen,
    onOpenChange: setOpenState,
    commitDateTime,
    formatLabel,
    minValue,
    maxValue,
    hourFormat,
    minuteInterval,
    locale,
    formatDate,
    isDisabledRoot: isDisabled
  }), [selected, setSelected, isOpen, setOpenState, commitDateTime, formatLabel, minValue, maxValue, hourFormat, minuteInterval, locale, formatDate, isDisabled]);
  return /*#__PURE__*/_jsx(AnimationSettingsProvider, {
    value: animationSettingsContextValue,
    children: /*#__PURE__*/_jsx(FormFieldProvider, {
      value: formFieldContextValue,
      children: /*#__PURE__*/_jsx(DateTimePickerProvider, {
        value: dateTimePickerContextValue,
        children: /*#__PURE__*/_jsx(View, {
          ref: ref,
          className: rootClassName,
          ...restProps,
          children: children
        })
      })
    })
  });
});

// --------------------------------------------------

const DateTimePickerSelect = /*#__PURE__*/forwardRef(({
  isDisabled: isDisabledProp,
  ...props
}, ref) => {
  const ctx = useDateTimePicker();
  return /*#__PURE__*/_jsx(Select, {
    ref: ref,
    isDisabled: isDisabledProp ?? ctx.isDisabledRoot,
    isOpen: ctx.isOpen,
    onOpenChange: ctx.onOpenChange,
    onValueChange: ctx.onValueChange,
    value: ctx.value,
    ...props,
    selectionMode: "single"
  });
});

// --------------------------------------------------

/**
 * `Select.Portal` renders into a host via the portal system, which breaks React context from
 * ancestors. Re-wrap `children` with `DateTimePickerProvider` so `DateTimePicker.Content` / `DateTimePicker.Wheel`
 * can still call `useDateTimePicker()` when portaled.
 */
function DateTimePickerPortal(props) {
  const {
    children,
    ...rest
  } = props;
  const ctx = useDateTimePicker();
  return /*#__PURE__*/_jsx(Select.Portal, {
    ...rest,
    children: /*#__PURE__*/_jsx(DateTimePickerProvider, {
      value: ctx,
      children: children
    })
  });
}

// --------------------------------------------------

const DateTimePickerOverlay = /*#__PURE__*/forwardRef(({
  className,
  ...props
}, ref) => {
  const overlayClassName = dateTimePickerClassNames.overlay({
    className
  });
  return /*#__PURE__*/_jsx(Select.Overlay, {
    ref: ref,
    className: overlayClassName,
    ...props
  });
});

// --------------------------------------------------

const DateTimePickerContent = /*#__PURE__*/forwardRef((props, ref) => {
  if (props.presentation === 'dialog') {
    // Force dialog swipe-to-dismiss off (the prop is omitted from the public API).
    return /*#__PURE__*/_jsx(Select.Content, {
      ref: ref,
      ...props,
      isSwipeable: false
    });
  }
  if (props.presentation === 'bottom-sheet') {
    return /*#__PURE__*/_jsx(Select.Content, {
      ref: ref,
      enableContentPanningGesture: false,
      enableHandlePanningGesture: false,
      handleComponent: () => null,
      ...props
    });
  }
  return /*#__PURE__*/_jsx(Select.Content, {
    ref: ref,
    ...props
  });
});

// --------------------------------------------------

const DateTimePickerTrigger = /*#__PURE__*/forwardRef(({
  className,
  isInvalid: localIsInvalid,
  isDisabled: isDisabledProp,
  ...props
}, ref) => {
  const formField = useFormField();
  const isInvalid = localIsInvalid !== undefined ? localIsInvalid : formField?.isInvalid ?? false;
  const triggerClassName = cn(dateTimePickerClassNames.trigger({
    isInvalid
  }), className);
  return /*#__PURE__*/_jsx(Select.Trigger, {
    ref: ref,
    className: triggerClassName,
    isDisabled: isDisabledProp,
    ...props,
    variant: "default"
  });
});

// --------------------------------------------------

const DateTimePickerValue = /*#__PURE__*/forwardRef(({
  placeholder = 'Choose a date & time',
  ...props
}, ref) => {
  return /*#__PURE__*/_jsx(Select.Value, {
    ref: ref,
    placeholder: placeholder,
    ...props
  });
});

// --------------------------------------------------

const DateTimePickerTriggerIndicator = /*#__PURE__*/forwardRef(({
  children,
  iconProps,
  animation = false,
  isAnimatedStyleActive = false,
  style,
  ...restProps
}, ref) => {
  const themeColorMuted = useThemeColor('muted');
  return /*#__PURE__*/_jsx(Select.TriggerIndicator, {
    ref: ref,
    iconProps: iconProps,
    animation: animation,
    isAnimatedStyleActive: isAnimatedStyleActive,
    style: style,
    ...restProps,
    children: children ?? /*#__PURE__*/_jsx(CalendarIcon, {
      color: iconProps?.color ?? themeColorMuted,
      size: iconProps?.size ?? 16
    })
  });
});

// --------------------------------------------------

const DateTimePickerWheel = /*#__PURE__*/forwardRef(({
  children,
  className,
  minValue: minValueProp,
  maxValue: maxValueProp,
  hourFormat: hourFormatProp,
  minuteInterval: minuteIntervalProp,
  locale: localeProp,
  formatDate: formatDateProp,
  ...rest
}, ref) => {
  const ctx = useDateTimePicker();
  const derivedValue = ctx.value?.value !== undefined ? tryParseDateTimePickerValueString(ctx.value.value) : undefined;
  const handleValueChange = value => {
    ctx.commitDateTime(value, {
      close: false
    });
  };
  const resolvedHourFormat = hourFormatProp ?? ctx.hourFormat;
  return /*#__PURE__*/_jsx(WheelDateTimePicker, {
    ref: ref,
    value: derivedValue,
    onValueChange: handleValueChange,
    minValue: minValueProp ?? ctx.minValue,
    maxValue: maxValueProp ?? ctx.maxValue,
    hourFormat: resolvedHourFormat,
    minuteInterval: minuteIntervalProp ?? ctx.minuteInterval,
    locale: localeProp ?? ctx.locale,
    formatDate: formatDateProp ?? ctx.formatDate,
    className: dateTimePickerClassNames.wheel({
      className
    }),
    ...rest,
    children: children ?? /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx(DateTimePickerWheelDate, {}), /*#__PURE__*/_jsx(DateTimePickerWheelHour, {}), /*#__PURE__*/_jsx(DateTimePickerWheelMinute, {}), resolvedHourFormat === 12 ? /*#__PURE__*/_jsx(DateTimePickerWheelPeriod, {}) : null, /*#__PURE__*/_jsx(DateTimePickerWheelIndicator, {}), /*#__PURE__*/_jsx(DateTimePickerWheelMask, {})]
    })
  });
});

// --------------------------------------------------

const DateTimePickerWheelDate = /*#__PURE__*/forwardRef((props, ref) => {
  return /*#__PURE__*/_jsx(WheelDateTimePicker.Date, {
    ref: ref,
    ...props
  });
});

// --------------------------------------------------

const DateTimePickerWheelHour = /*#__PURE__*/forwardRef((props, ref) => {
  return /*#__PURE__*/_jsx(WheelDateTimePicker.Hour, {
    ref: ref,
    ...props
  });
});

// --------------------------------------------------

const DateTimePickerWheelMinute = /*#__PURE__*/forwardRef((props, ref) => {
  return /*#__PURE__*/_jsx(WheelDateTimePicker.Minute, {
    ref: ref,
    ...props
  });
});

// --------------------------------------------------

const DateTimePickerWheelPeriod = /*#__PURE__*/forwardRef((props, ref) => {
  return /*#__PURE__*/_jsx(WheelDateTimePicker.Period, {
    ref: ref,
    ...props
  });
});

// --------------------------------------------------

const DateTimePickerWheelIndicator = /*#__PURE__*/forwardRef((props, ref) => {
  return /*#__PURE__*/_jsx(WheelDateTimePicker.Indicator, {
    ref: ref,
    ...props
  });
});

// --------------------------------------------------

/**
 * Mask wrapper that defaults the gradient `color` to the Select `overlay`
 * surface so the fade blends with the popover / dialog / bottom-sheet
 * background instead of the screen background.
 */
const DateTimePickerWheelMask = /*#__PURE__*/forwardRef(({
  color,
  ...props
}, ref) => {
  const overlayColor = useThemeColor('overlay');
  return /*#__PURE__*/_jsx(WheelDateTimePicker.Mask, {
    ref: ref,
    color: color ?? overlayColor,
    ...props
  });
});

// --------------------------------------------------

DateTimePickerRoot.displayName = DISPLAY_NAME.ROOT;
DateTimePickerSelect.displayName = DISPLAY_NAME.SELECT;
DateTimePickerPortal.displayName = DISPLAY_NAME.PORTAL;
DateTimePickerOverlay.displayName = DISPLAY_NAME.OVERLAY;
DateTimePickerContent.displayName = DISPLAY_NAME.CONTENT;
DateTimePickerTrigger.displayName = DISPLAY_NAME.TRIGGER;
DateTimePickerValue.displayName = DISPLAY_NAME.VALUE;
DateTimePickerTriggerIndicator.displayName = DISPLAY_NAME.TRIGGER_INDICATOR;
DateTimePickerWheel.displayName = DISPLAY_NAME.WHEEL;
DateTimePickerWheelDate.displayName = DISPLAY_NAME.WHEEL_DATE;
DateTimePickerWheelHour.displayName = DISPLAY_NAME.WHEEL_HOUR;
DateTimePickerWheelMinute.displayName = DISPLAY_NAME.WHEEL_MINUTE;
DateTimePickerWheelPeriod.displayName = DISPLAY_NAME.WHEEL_PERIOD;
DateTimePickerWheelIndicator.displayName = DISPLAY_NAME.WHEEL_INDICATOR;
DateTimePickerWheelMask.displayName = DISPLAY_NAME.WHEEL_MASK;

/**
 * DateTimePicker — field shell with optional managed state for `DateTimePicker.Select` + `DateTimePicker.Wheel`.
 *
 * For managed behavior, pass `value` / `onValueChange` / `isOpen` / `onOpenChange` on the root (or use
 * uncontrolled defaults) and use **`DateTimePicker.Select`** with **`DateTimePicker.Portal`**, **`DateTimePicker.Content`**,
 * and **`DateTimePicker.Wheel`**. Use a raw **`Select`** only if you omit root state props and wire
 * everything manually.
 *
 * @component DateTimePicker - Field shell owning selection, open state, and commit behavior.
 * @component DateTimePicker.Select - Wires `Select` (single mode) to the root state.
 * @component DateTimePicker.Portal - Portals content and re-provides `DateTimePicker` context.
 * @component DateTimePicker.Overlay - Backdrop behind portaled content.
 * @component DateTimePicker.Content - Presentation surface (popover / dialog / bottom-sheet).
 * @component DateTimePicker.Trigger - Trigger surface with invalid border styling.
 * @component DateTimePicker.Value - Selected label / placeholder.
 * @component DateTimePicker.TriggerIndicator - Trailing calendar icon.
 * @component DateTimePicker.Wheel - Wheel date-time selector wired to commit on scroll; renders the default
 * wheel parts when no children are passed.
 * @component DateTimePicker.WheelDate - Combined day column (`WheelDateTimePicker.Date`).
 * @component DateTimePicker.WheelHour - Hour column (`WheelDateTimePicker.Hour`).
 * @component DateTimePicker.WheelMinute - Minute column (`WheelDateTimePicker.Minute`).
 * @component DateTimePicker.WheelPeriod - AM/PM column (`WheelDateTimePicker.Period`).
 * @component DateTimePicker.WheelIndicator - Shared selection band (`WheelDateTimePicker.Indicator`).
 * @component DateTimePicker.WheelMask - Fade overlays with an overlay-surface-aware default color.
 */
const DateTimePicker = Object.assign(DateTimePickerRoot, {
  Select: DateTimePickerSelect,
  Portal: DateTimePickerPortal,
  Overlay: DateTimePickerOverlay,
  Content: DateTimePickerContent,
  Trigger: DateTimePickerTrigger,
  Value: DateTimePickerValue,
  TriggerIndicator: DateTimePickerTriggerIndicator,
  Wheel: DateTimePickerWheel,
  WheelDate: DateTimePickerWheelDate,
  WheelHour: DateTimePickerWheelHour,
  WheelMinute: DateTimePickerWheelMinute,
  WheelPeriod: DateTimePickerWheelPeriod,
  WheelIndicator: DateTimePickerWheelIndicator,
  WheelMask: DateTimePickerWheelMask
});
export default DateTimePicker;