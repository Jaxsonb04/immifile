"use strict";

import { createContext } from "../../helpers/internal/utils/index.js";

/**
 * Context for `DateRangePicker` managed selection, open state, and calendar commit behavior.
 */

const [DateRangePickerProvider, useDateRangePicker] = createContext({
  name: 'DateRangePickerContext',
  strict: true,
  errorMessage: 'DateRangePicker compound components must be used within `DateRangePicker`.'
});
export { DateRangePickerProvider, useDateRangePicker };