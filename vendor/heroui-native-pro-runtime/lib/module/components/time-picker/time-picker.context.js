"use strict";

import { createContext } from "../../helpers/internal/utils/index.js";

/**
 * Options controlling how `commitTime` mutates the surface.
 */

/**
 * Context for `TimePicker` managed selection, open state, and wheel commit behavior.
 */

const [TimePickerProvider, useTimePicker] = createContext({
  name: 'TimePickerContext',
  strict: true,
  errorMessage: 'TimePicker compound components must be used within `TimePicker`.'
});
export { TimePickerProvider, useTimePicker };