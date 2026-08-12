"use strict";

import { createContext } from "../../helpers/internal/utils/index.js";

/**
 * Options controlling how `commitDateTime` mutates the surface.
 */

/**
 * Context for `DateTimePicker` managed selection, open state, and wheel commit
 * behavior.
 */

const [DateTimePickerProvider, useDateTimePicker] = createContext({
  name: 'DateTimePickerContext',
  strict: true,
  errorMessage: 'DateTimePicker compound components must be used within `DateTimePicker`.'
});
export { DateTimePickerProvider, useDateTimePicker };