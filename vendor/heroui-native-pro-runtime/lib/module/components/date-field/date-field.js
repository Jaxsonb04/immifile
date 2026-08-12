"use strict";

import { AnimationSettingsProvider, FormFieldProvider } from 'heroui-native/contexts';
import { useThemeColor } from 'heroui-native/hooks';
import { InputGroup } from 'heroui-native/input-group';
import { Select } from 'heroui-native/select';
import { forwardRef, useCallback, useMemo } from 'react';
import { Keyboard, View } from 'react-native';
import { useControllableState } from "../../helpers/internal/hooks/index.js";
import { CalendarIcon } from "../../helpers/internal/icons/index.js";
import InternationalizedDatePackage from "../../optional/internationalized-date.js";
import { Calendar } from "../calendar/index.js";
import { DatePickerProvider, useDatePicker } from "../date-picker/date-picker.context.js";
import { tryParseDatePickerValueString } from "../date-picker/date-picker.utils.js";
import { useDateFieldRootAnimation } from "./date-field.animation.js";
import { DISPLAY_NAME } from "./date-field.constants.js";
import { DateFieldInputProvider, useDateField } from "./date-field.context.js";
import { dateFieldClassNames } from "./date-field.styles.js";
import { formatCalendarDateDdMmYyyy } from "./date-field.utils.js";
import { jsx as _jsx } from "react/jsx-runtime";
const {
  toCalendarDate
} = InternationalizedDatePackage ?? {};

// --------------------------------------------------

const DateFieldRoot = /*#__PURE__*/forwardRef((props, ref) => {
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
    locale,
    inputMode = 'masked',
    ...restProps
  } = props;
  const rootClassName = dateFieldClassNames.root({
    className
  });
  const {
    isAllAnimationsDisabled
  } = useDateFieldRootAnimation({
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
  const formatLabel = useCallback(date => formatCalendarDateDdMmYyyy(date), []);
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
        children: /*#__PURE__*/_jsx(DateFieldInputProvider, {
          inputMode: inputMode,
          children: /*#__PURE__*/_jsx(View, {
            ref: ref,
            className: rootClassName,
            ...restProps,
            children: children
          })
        })
      })
    })
  });
});

// --------------------------------------------------

const DateFieldSelect = /*#__PURE__*/forwardRef(({
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
 * `Select.Portal` breaks ancestor context; re-wrap with `DatePickerProvider` so portaled
 * `DateField.Content` / `DateField.Calendar` still resolve `useDatePicker()`.
 */
function DateFieldPortal(props) {
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

const DateFieldOverlay = /*#__PURE__*/forwardRef(({
  className,
  ...props
}, ref) => {
  const overlayClassName = dateFieldClassNames.overlay({
    className
  });
  return /*#__PURE__*/_jsx(Select.Overlay, {
    ref: ref,
    className: overlayClassName,
    ...props
  });
});

// --------------------------------------------------

const DateFieldContent = /*#__PURE__*/forwardRef((props, ref) => {
  return /*#__PURE__*/_jsx(Select.Content, {
    ref: ref,
    ...props
  });
});

// --------------------------------------------------

const DateFieldCalendar = /*#__PURE__*/forwardRef(({
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
    /**
     * The underlying calendar primitive can emit a nullish value when the
     * controlled `value` transitions back to `undefined` (e.g. the user
     * clears `DateField.Input` and blurs). Guard against that so we don't
     * call `toCalendarDate(undefined)` and crash with
     * "Cannot read property 'calendar' of undefined".
     */
    if (date === null || date === undefined) {
      return;
    }
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

const DateFieldTrigger = /*#__PURE__*/forwardRef(({
  onPress: onPressProp,
  ...props
}, ref) => {
  const handlePress = useCallback(event => {
    Keyboard.dismiss();
    onPressProp?.(event);
  }, [onPressProp]);
  return /*#__PURE__*/_jsx(Select.Trigger, {
    ref: ref,
    onPress: handlePress,
    ...props,
    variant: "unstyled"
  });
});

// --------------------------------------------------

const DateFieldTriggerIndicator = /*#__PURE__*/forwardRef(({
  children,
  iconProps,
  animation = false,
  isAnimatedStyleActive = false,
  className,
  ...restProps
}, ref) => {
  const themeColorMuted = useThemeColor('muted');
  const triggerIndicatorClassName = dateFieldClassNames.triggerIndicator({
    className
  });
  return /*#__PURE__*/_jsx(Select.TriggerIndicator, {
    ref: ref,
    className: triggerIndicatorClassName,
    iconProps: iconProps,
    animation: animation,
    isAnimatedStyleActive: isAnimatedStyleActive,
    ...restProps,
    children: children ?? /*#__PURE__*/_jsx(CalendarIcon, {
      color: iconProps?.color ?? themeColorMuted,
      size: iconProps?.size ?? 16
    })
  });
});

// --------------------------------------------------

const DateFieldInputGroupRoot = /*#__PURE__*/forwardRef((props, ref) => {
  return /*#__PURE__*/_jsx(InputGroup, {
    ref: ref,
    ...props
  });
});
const DateFieldSuffix = /*#__PURE__*/forwardRef((props, ref) => {
  return /*#__PURE__*/_jsx(InputGroup.Suffix, {
    ref: ref,
    ...props
  });
});
const DateFieldInput = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    onBlur: onBlurProp,
    onChangeText: onChangeTextProp,
    placeholder = 'dd/mm/yyyy',
    inputMode = 'numeric',
    isDisabled: isDisabledProp,
    maxLength: maxLengthProp,
    ...restProps
  } = props;
  const fieldInput = useDateField();
  const {
    isDisabledRoot
  } = useDatePicker();
  const isDisabled = isDisabledProp !== undefined ? isDisabledProp : isDisabledRoot;
  const maxLength = fieldInput.inputMode === 'masked' ? 10 : maxLengthProp;
  return /*#__PURE__*/_jsx(InputGroup.Input, {
    ref: ref,
    placeholder: placeholder,
    value: fieldInput.inputText,
    isDisabled: isDisabled,
    onChangeText: text => {
      fieldInput.onInputChangeText(text);
      onChangeTextProp?.(text);
    },
    onBlur: e => {
      fieldInput.onInputBlur();
      onBlurProp?.(e);
    },
    inputMode: inputMode,
    ...restProps,
    maxLength: maxLength
  });
});
const DateFieldPrefix = /*#__PURE__*/forwardRef((props, ref) => {
  return /*#__PURE__*/_jsx(InputGroup.Prefix, {
    ref: ref,
    ...props
  });
});

// --------------------------------------------------

DateFieldPortal.displayName = DISPLAY_NAME.PORTAL;
DateFieldRoot.displayName = DISPLAY_NAME.ROOT;
DateFieldSelect.displayName = DISPLAY_NAME.SELECT;
DateFieldOverlay.displayName = DISPLAY_NAME.OVERLAY;
DateFieldContent.displayName = DISPLAY_NAME.CONTENT;
DateFieldCalendar.displayName = DISPLAY_NAME.CALENDAR;
DateFieldTrigger.displayName = DISPLAY_NAME.TRIGGER;
DateFieldTriggerIndicator.displayName = DISPLAY_NAME.TRIGGER_INDICATOR;
DateFieldInputGroupRoot.displayName = DISPLAY_NAME.INPUT_GROUP;
DateFieldPrefix.displayName = DISPLAY_NAME.PREFIX;
DateFieldInput.displayName = DISPLAY_NAME.INPUT;
DateFieldSuffix.displayName = DISPLAY_NAME.SUFFIX;

/**
 * Static parts attached to the root. We assign properties explicitly instead of only using
 * `Object.assign`: some Metro / Hermes bundles do not reliably retain every key on `forwardRef`
 * results, which surfaced as `DateField.Input` being `undefined` at runtime.
 */

const DateField = DateFieldRoot;
DateField.Select = DateFieldSelect;
DateField.Portal = DateFieldPortal;
DateField.Overlay = DateFieldOverlay;
DateField.Content = DateFieldContent;
DateField.Calendar = DateFieldCalendar;
DateField.Trigger = DateFieldTrigger;
DateField.TriggerIndicator = DateFieldTriggerIndicator;
DateField.InputGroup = DateFieldInputGroupRoot;
DateField.Prefix = DateFieldPrefix;
DateField.Input = DateFieldInput;
DateField.Suffix = DateFieldSuffix;

/**
 * `DateField` — text field with `dd/mm/yyyy` input and `DateField.Select` + calendar surface.
 *
 * Compose **`DateField.InputGroup`** with **`DateField.Input`**, **`DateField.Prefix`** / **`DateField.Suffix`**,
 * and nest **`DateField.Select`** (with **`DateField.Trigger`**, **`DateField.Portal`**, **`DateField.Content`**,
 * **`DateField.Calendar`**) inside the suffix when the trigger opens the calendar from the trailing slot.
 */
export default DateField;