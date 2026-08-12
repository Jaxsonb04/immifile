"use strict";

import { AnimationSettingsProvider, FormFieldProvider, useFormField } from 'heroui-native/contexts';
import { useThemeColor } from 'heroui-native/hooks';
import { Select } from 'heroui-native/select';
import { cn } from 'heroui-native/utils';
import { forwardRef, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useControllableState } from "../../helpers/internal/hooks/index.js";
import { ClockIcon } from "../../helpers/internal/icons/index.js";
import { WheelTimePicker } from "../wheel-time-picker/index.js";
import { useTimePickerRootAnimation } from "./time-picker.animation.js";
import { DEFAULT_HOUR_FORMAT, DEFAULT_MINUTE_INTERVAL, DEFAULT_TIME_DISPLAY_FORMAT, DISPLAY_NAME } from "./time-picker.constants.js";
import { TimePickerProvider, useTimePicker } from "./time-picker.context.js";
import { timePickerClassNames } from "./time-picker.styles.js";
import { formatTimeForDisplay, tryParseTimePickerValueString } from "./time-picker.utils.js";

// --------------------------------------------------
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
const TimePickerRoot = /*#__PURE__*/forwardRef((props, ref) => {
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
    hourFormat = DEFAULT_HOUR_FORMAT,
    minuteInterval = DEFAULT_MINUTE_INTERVAL,
    timeDisplayFormat = DEFAULT_TIME_DISPLAY_FORMAT,
    locale,
    formatTime,
    ...restProps
  } = props;
  const rootClassName = timePickerClassNames.root({
    className
  });
  const {
    isAllAnimationsDisabled
  } = useTimePickerRootAnimation({
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
  const formatLabel = useCallback(time => formatTimeForDisplay(time, {
    timeDisplayFormat,
    hourFormat,
    locale,
    formatTime
  }), [timeDisplayFormat, hourFormat, locale, formatTime]);
  const commitTime = useCallback((time, options) => {
    const label = formatLabel(time);
    setSelected({
      value: time.toString(),
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
  const timePickerContextValue = useMemo(() => ({
    value: selected,
    onValueChange: setSelected,
    isOpen,
    onOpenChange: setOpenState,
    commitTime,
    formatLabel,
    hourFormat,
    minuteInterval,
    locale,
    isDisabledRoot: isDisabled
  }), [selected, setSelected, isOpen, setOpenState, commitTime, formatLabel, hourFormat, minuteInterval, locale, isDisabled]);
  return /*#__PURE__*/_jsx(AnimationSettingsProvider, {
    value: animationSettingsContextValue,
    children: /*#__PURE__*/_jsx(FormFieldProvider, {
      value: formFieldContextValue,
      children: /*#__PURE__*/_jsx(TimePickerProvider, {
        value: timePickerContextValue,
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

const TimePickerSelect = /*#__PURE__*/forwardRef(({
  isDisabled: isDisabledProp,
  ...props
}, ref) => {
  const ctx = useTimePicker();
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
 * ancestors. Re-wrap `children` with `TimePickerProvider` so `TimePicker.Content` / `TimePicker.Wheel`
 * can still call `useTimePicker()` when portaled.
 */
function TimePickerPortal(props) {
  const {
    children,
    ...rest
  } = props;
  const ctx = useTimePicker();
  return /*#__PURE__*/_jsx(Select.Portal, {
    ...rest,
    children: /*#__PURE__*/_jsx(TimePickerProvider, {
      value: ctx,
      children: children
    })
  });
}

// --------------------------------------------------

const TimePickerOverlay = /*#__PURE__*/forwardRef(({
  className,
  ...props
}, ref) => {
  const overlayClassName = timePickerClassNames.overlay({
    className
  });
  return /*#__PURE__*/_jsx(Select.Overlay, {
    ref: ref,
    className: overlayClassName,
    ...props
  });
});

// --------------------------------------------------

const TimePickerContent = /*#__PURE__*/forwardRef((props, ref) => {
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

const TimePickerTrigger = /*#__PURE__*/forwardRef(({
  className,
  isInvalid: localIsInvalid,
  isDisabled: isDisabledProp,
  ...props
}, ref) => {
  const formField = useFormField();
  const isInvalid = localIsInvalid !== undefined ? localIsInvalid : formField?.isInvalid ?? false;
  const triggerClassName = cn(timePickerClassNames.trigger({
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

const TimePickerValue = /*#__PURE__*/forwardRef(({
  placeholder = 'Choose a time',
  ...props
}, ref) => {
  return /*#__PURE__*/_jsx(Select.Value, {
    ref: ref,
    placeholder: placeholder,
    ...props
  });
});

// --------------------------------------------------

const TimePickerTriggerIndicator = /*#__PURE__*/forwardRef(({
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
    children: children ?? /*#__PURE__*/_jsx(ClockIcon, {
      color: iconProps?.color ?? themeColorMuted,
      size: iconProps?.size ?? 16
    })
  });
});

// --------------------------------------------------

const TimePickerWheel = /*#__PURE__*/forwardRef(({
  children,
  className,
  hourFormat: hourFormatProp,
  minuteInterval: minuteIntervalProp,
  locale: localeProp,
  ...rest
}, ref) => {
  const ctx = useTimePicker();
  const derivedValue = ctx.value?.value !== undefined ? tryParseTimePickerValueString(ctx.value.value) : undefined;
  const handleValueChange = time => {
    ctx.commitTime(time, {
      close: false
    });
  };
  const resolvedHourFormat = hourFormatProp ?? ctx.hourFormat;
  return /*#__PURE__*/_jsx(WheelTimePicker, {
    ref: ref,
    value: derivedValue,
    onValueChange: handleValueChange,
    hourFormat: resolvedHourFormat,
    minuteInterval: minuteIntervalProp ?? ctx.minuteInterval,
    locale: localeProp ?? ctx.locale,
    className: timePickerClassNames.wheel({
      className
    }),
    ...rest,
    children: children ?? /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx(TimePickerWheelHour, {}), /*#__PURE__*/_jsx(TimePickerWheelMinute, {}), resolvedHourFormat === 12 ? /*#__PURE__*/_jsx(TimePickerWheelPeriod, {}) : null, /*#__PURE__*/_jsx(TimePickerWheelIndicator, {}), /*#__PURE__*/_jsx(TimePickerWheelMask, {})]
    })
  });
});

// --------------------------------------------------

const TimePickerWheelHour = /*#__PURE__*/forwardRef((props, ref) => {
  return /*#__PURE__*/_jsx(WheelTimePicker.Hour, {
    ref: ref,
    ...props
  });
});

// --------------------------------------------------

const TimePickerWheelMinute = /*#__PURE__*/forwardRef((props, ref) => {
  return /*#__PURE__*/_jsx(WheelTimePicker.Minute, {
    ref: ref,
    ...props
  });
});

// --------------------------------------------------

const TimePickerWheelPeriod = /*#__PURE__*/forwardRef((props, ref) => {
  return /*#__PURE__*/_jsx(WheelTimePicker.Period, {
    ref: ref,
    ...props
  });
});

// --------------------------------------------------

const TimePickerWheelIndicator = /*#__PURE__*/forwardRef((props, ref) => {
  return /*#__PURE__*/_jsx(WheelTimePicker.Indicator, {
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
const TimePickerWheelMask = /*#__PURE__*/forwardRef(({
  color,
  ...props
}, ref) => {
  const overlayColor = useThemeColor('overlay');
  return /*#__PURE__*/_jsx(WheelTimePicker.Mask, {
    ref: ref,
    color: color ?? overlayColor,
    ...props
  });
});

// --------------------------------------------------

TimePickerRoot.displayName = DISPLAY_NAME.ROOT;
TimePickerSelect.displayName = DISPLAY_NAME.SELECT;
TimePickerPortal.displayName = DISPLAY_NAME.PORTAL;
TimePickerOverlay.displayName = DISPLAY_NAME.OVERLAY;
TimePickerContent.displayName = DISPLAY_NAME.CONTENT;
TimePickerTrigger.displayName = DISPLAY_NAME.TRIGGER;
TimePickerValue.displayName = DISPLAY_NAME.VALUE;
TimePickerTriggerIndicator.displayName = DISPLAY_NAME.TRIGGER_INDICATOR;
TimePickerWheel.displayName = DISPLAY_NAME.WHEEL;
TimePickerWheelHour.displayName = DISPLAY_NAME.WHEEL_HOUR;
TimePickerWheelMinute.displayName = DISPLAY_NAME.WHEEL_MINUTE;
TimePickerWheelPeriod.displayName = DISPLAY_NAME.WHEEL_PERIOD;
TimePickerWheelIndicator.displayName = DISPLAY_NAME.WHEEL_INDICATOR;
TimePickerWheelMask.displayName = DISPLAY_NAME.WHEEL_MASK;

/**
 * TimePicker — field shell with optional managed state for `TimePicker.Select` + `TimePicker.Wheel`.
 *
 * For managed behavior, pass `value` / `onValueChange` / `isOpen` / `onOpenChange` on the root (or use
 * uncontrolled defaults) and use **`TimePicker.Select`** with **`TimePicker.Portal`**, **`TimePicker.Content`**,
 * and **`TimePicker.Wheel`**. Use a raw **`Select`** only if you omit root state props and wire
 * everything manually.
 *
 * @component TimePicker - Field shell owning selection, open state, and commit behavior.
 * @component TimePicker.Select - Wires `Select` (single mode) to the root state.
 * @component TimePicker.Portal - Portals content and re-provides `TimePicker` context.
 * @component TimePicker.Overlay - Backdrop behind portaled content.
 * @component TimePicker.Content - Presentation surface (popover / dialog / bottom-sheet).
 * @component TimePicker.Trigger - Trigger surface with invalid border styling.
 * @component TimePicker.Value - Selected label / placeholder.
 * @component TimePicker.TriggerIndicator - Trailing clock icon.
 * @component TimePicker.Wheel - Wheel time selector wired to commit on scroll; renders the default
 * wheel parts when no children are passed.
 * @component TimePicker.WheelHour - Hour column (`WheelTimePicker.Hour`).
 * @component TimePicker.WheelMinute - Minute column (`WheelTimePicker.Minute`).
 * @component TimePicker.WheelPeriod - AM/PM column (`WheelTimePicker.Period`).
 * @component TimePicker.WheelIndicator - Shared selection band (`WheelTimePicker.Indicator`).
 * @component TimePicker.WheelMask - Fade overlays with an overlay-surface-aware default color.
 */
const TimePicker = Object.assign(TimePickerRoot, {
  Select: TimePickerSelect,
  Portal: TimePickerPortal,
  Overlay: TimePickerOverlay,
  Content: TimePickerContent,
  Trigger: TimePickerTrigger,
  Value: TimePickerValue,
  TriggerIndicator: TimePickerTriggerIndicator,
  Wheel: TimePickerWheel,
  WheelHour: TimePickerWheelHour,
  WheelMinute: TimePickerWheelMinute,
  WheelPeriod: TimePickerWheelPeriod,
  WheelIndicator: TimePickerWheelIndicator,
  WheelMask: TimePickerWheelMask
});
export default TimePicker;