"use strict";

import { createContext } from "../../helpers/internal/utils/index.js";

/**
 * Context for `WheelTimePicker`. The root builds the column item data from
 * `hourFormat` / `minuteInterval` / `locale` and exposes it here so the
 * `Hour` / `Minute` / `Period` subcomponents stay value-correct without each
 * rebuilding (or being passed) the item arrays.
 */

const [WheelTimePickerProvider, useWheelTimePicker] = createContext({
  name: 'WheelTimePickerContext',
  strict: true,
  errorMessage: 'WheelTimePicker compound components must be used within `WheelTimePicker`.'
});
export { useWheelTimePicker, WheelTimePickerProvider };