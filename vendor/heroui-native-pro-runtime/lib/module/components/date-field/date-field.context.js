"use strict";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createContext } from "../../helpers/internal/utils/index.js";
import { useDatePicker } from "../date-picker/date-picker.context.js";
import { tryParseDatePickerValueString } from "../date-picker/date-picker.utils.js";
import { formatCalendarDateDdMmYyyy, formatDigitsToDdMmYyyyMask, tryParseDdMmYyyy } from "./date-field.utils.js";
import { jsx as _jsx } from "react/jsx-runtime";
const [DateFieldInputContextProvider, useDateField] = createContext({
  name: 'DateFieldInputContext',
  strict: true,
  errorMessage: 'DateField input components must be used within `DateField` (for example `DateField.Input`).'
});

/**
 * Provides draft text state and blur commit for `DateField.Input`.
 * `masked` commits parsed `dd/mm/yyyy` on blur; `loose` does not parse or commit on blur (plain text).
 * Must render inside `DatePickerProvider` (inside `DateField` root).
 */
function DateFieldInputProvider({
  inputMode,
  children
}) {
  const {
    value,
    onValueChange
  } = useDatePicker();
  const [inputText, setInputText] = useState('');
  useEffect(() => {
    const iso = value?.value;
    if (!iso) {
      setInputText('');
      return;
    }
    const parsed = tryParseDatePickerValueString(iso);
    setInputText(parsed ? formatCalendarDateDdMmYyyy(parsed) : '');
  }, [value?.value]);
  const onInputChangeText = useCallback(text => {
    if (inputMode === 'masked') {
      const formatted = formatDigitsToDdMmYyyyMask(text, inputText);
      setInputText(formatted);

      /** Sync a complete valid date to the picker context so the calendar updates live. */
      const parsed = tryParseDdMmYyyy(formatted);
      if (parsed) {
        onValueChange({
          value: parsed.toString(),
          label: formatCalendarDateDdMmYyyy(parsed)
        });
      }
      return;
    }
    setInputText(text);
  }, [inputMode, inputText, onValueChange]);
  const onInputBlur = useCallback(() => {
    if (inputMode === 'loose') {
      return;
    }
    const trimmed = inputText.trim();
    if (trimmed === '') {
      onValueChange(undefined);
      return;
    }
    const parsed = tryParseDdMmYyyy(trimmed);
    if (parsed) {
      onValueChange({
        value: parsed.toString(),
        label: formatCalendarDateDdMmYyyy(parsed)
      });
    }
  }, [inputMode, inputText, onValueChange]);
  const contextValue = useMemo(() => ({
    inputMode,
    inputText,
    onInputChangeText,
    onInputBlur
  }), [inputMode, inputText, onInputChangeText, onInputBlur]);
  return /*#__PURE__*/_jsx(DateFieldInputContextProvider, {
    value: contextValue,
    children: children
  });
}
export { DateFieldInputProvider, useDateField };