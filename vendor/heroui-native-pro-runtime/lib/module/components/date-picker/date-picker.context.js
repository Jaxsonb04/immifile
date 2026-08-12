"use strict";

import { createContext } from "../../helpers/internal/utils/index.js";

/**
 * Context for `DatePicker` managed selection, open state, and calendar commit behavior.
 */

const [DatePickerProvider, useDatePicker] = createContext({
  name: 'DatePickerContext',
  strict: true,
  errorMessage: 'DatePicker compound components must be used within `DatePicker`.'
});
export { DatePickerProvider, useDatePicker };