"use strict";

import { AnimationSettingsProvider, FormFieldProvider, useFormField } from 'heroui-native/contexts';
import { useThemeColor } from 'heroui-native/hooks';
import { Select } from 'heroui-native/select';
import { cn } from 'heroui-native/utils';
import { forwardRef, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useControllableState } from "../../helpers/internal/hooks/index.js";
import { CalendarIcon } from "../../helpers/internal/icons/index.js";
import InternationalizedDatePackage from "../../optional/internationalized-date.js";
import { Calendar } from "../calendar/index.js";
import { useDatePickerRootAnimation } from "./date-picker.animation.js";
import { DISPLAY_NAME } from "./date-picker.constants.js";
import { DatePickerProvider, useDatePicker } from "./date-picker.context.js";
import { datePickerClassNames } from "./date-picker.styles.js";
import { formatCalendarDateForDisplay, tryParseDatePickerValueString } from "./date-picker.utils.js";
import { jsx as _jsx } from "react/jsx-runtime";
const {
  toCalendarDate
} = InternationalizedDatePackage ?? {};

// --------------------------------------------------

const DatePickerRoot = /*#__PURE__*/forwardRef((props, ref) => {
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
    dateDisplayFormat = 'medium',
    locale,
    formatDate,
    ...restProps
  } = props;
  const rootClassName = datePickerClassNames.root({
    className
  });
  const {
    isAllAnimationsDisabled
  } = useDatePickerRootAnimation({
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
  const formatLabel = useCallback(date => formatCalendarDateForDisplay(date, {
    dateDisplayFormat,
    locale,
    formatDate
  }), [dateDisplayFormat, locale, formatDate]);
  const commitDate = useCallback(date => {
    const label = formatLabel(date);
    setSelected({
      value: date.toString(),
      label
    });
    setOpenState(false);
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
  const datePickerContextValue = useMemo(() => ({
    value: selected,
    onValueChange: setSelected,
    isOpen,
    onOpenChange: setOpenState,
    commitDate,
    formatLabel,
    isDisabledRoot: isDisabled,
    locale
  }), [selected, setSelected, isOpen, setOpenState, commitDate, formatLabel, isDisabled, locale]);
  return /*#__PURE__*/_jsx(AnimationSettingsProvider, {
    value: animationSettingsContextValue,
    children: /*#__PURE__*/_jsx(FormFieldProvider, {
      value: formFieldContextValue,
      children: /*#__PURE__*/_jsx(DatePickerProvider, {
        value: datePickerContextValue,
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

const DatePickerSelect = /*#__PURE__*/forwardRef(({
  isDisabled: isDisabledProp,
  ...props
}, ref) => {
  const ctx = useDatePicker();
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
 * ancestors. Re-wrap `children` with `DatePickerProvider` so `DatePicker.Content` / `DatePicker.Calendar`
 * can still call `useDatePicker()` when portaled.
 */
function DatePickerPortal(props) {
  const {
    children,
    ...rest
  } = props;
  const ctx = useDatePicker();
  return /*#__PURE__*/_jsx(Select.Portal, {
    ...rest,
    children: /*#__PURE__*/_jsx(DatePickerProvider, {
      value: ctx,
      children: children
    })
  });
}

// --------------------------------------------------

const DatePickerOverlay = /*#__PURE__*/forwardRef(({
  className,
  ...props
}, ref) => {
  const overlayClassName = datePickerClassNames.overlay({
    className
  });
  return /*#__PURE__*/_jsx(Select.Overlay, {
    ref: ref,
    className: overlayClassName,
    ...props
  });
});

// --------------------------------------------------

const DatePickerContent = /*#__PURE__*/forwardRef((props, ref) => {
  return /*#__PURE__*/_jsx(Select.Content, {
    ref: ref,
    ...props
  });
});

// --------------------------------------------------

const DatePickerCalendar = /*#__PURE__*/forwardRef(({
  value: valueProp,
  onChange: onChangeProp,
  accessibilityLabel = 'Pick a date',
  locale: localeFromCalendarProps,
  ...rest
}, ref) => {
  const ctx = useDatePicker();
  const derivedValue = ctx.value?.value !== undefined ? tryParseDatePickerValueString(ctx.value.value) : undefined;
  const value = valueProp !== undefined ? valueProp : derivedValue;
  const handleChange = date => {
    onChangeProp?.(date);
    ctx.commitDate(toCalendarDate(date));
  };
  const locale = localeFromCalendarProps ?? ctx.locale;
  return /*#__PURE__*/_jsx(Calendar, {
    ref: ref,
    accessibilityLabel: accessibilityLabel,
    locale: locale,
    value: value,
    onChange: handleChange,
    ...rest
  });
});

// --------------------------------------------------

const DatePickerTrigger = /*#__PURE__*/forwardRef(({
  className,
  isInvalid: localIsInvalid,
  isDisabled: isDisabledProp,
  ...props
}, ref) => {
  const formField = useFormField();
  const isInvalid = localIsInvalid !== undefined ? localIsInvalid : formField?.isInvalid ?? false;
  const triggerClassName = cn(datePickerClassNames.trigger({
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

const DatePickerValue = /*#__PURE__*/forwardRef(({
  placeholder = 'Choose a date',
  ...props
}, ref) => {
  return /*#__PURE__*/_jsx(Select.Value, {
    ref: ref,
    placeholder: placeholder,
    ...props
  });
});

// --------------------------------------------------

const DatePickerTriggerIndicator = /*#__PURE__*/forwardRef(({
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

DatePickerRoot.displayName = DISPLAY_NAME.ROOT;
DatePickerSelect.displayName = DISPLAY_NAME.SELECT;
DatePickerPortal.displayName = DISPLAY_NAME.PORTAL;
DatePickerOverlay.displayName = DISPLAY_NAME.OVERLAY;
DatePickerContent.displayName = DISPLAY_NAME.CONTENT;
DatePickerCalendar.displayName = DISPLAY_NAME.CALENDAR;
DatePickerTrigger.displayName = DISPLAY_NAME.TRIGGER;
DatePickerValue.displayName = DISPLAY_NAME.VALUE;
DatePickerTriggerIndicator.displayName = DISPLAY_NAME.TRIGGER_INDICATOR;

/**
 * DatePicker — field shell with optional managed state for `DatePicker.Select` + `DatePicker.Calendar`.
 *
 * For managed behavior, pass `value` / `onValueChange` / `isOpen` / `onOpenChange` on the root (or use
 * uncontrolled defaults) and use **`DatePicker.Select`** with **`DatePicker.Portal`**, **`DatePicker.Content`**,
 * and **`DatePicker.Calendar`**. Use a raw **`Select`** only if you omit root state props and wire
 * everything manually.
 */
const DatePicker = Object.assign(DatePickerRoot, {
  Select: DatePickerSelect,
  Portal: DatePickerPortal,
  Overlay: DatePickerOverlay,
  Content: DatePickerContent,
  Calendar: DatePickerCalendar,
  Trigger: DatePickerTrigger,
  Value: DatePickerValue,
  TriggerIndicator: DatePickerTriggerIndicator
});
export default DatePicker;