"use strict";

import { createContext } from "../../helpers/internal/utils/index.js";

/**
 * Context for `WheelDateTimePicker`. The root builds the column item data from
 * `minValue` / `maxValue` / `hourFormat` / `minuteInterval` / `locale` and
 * exposes it here so the `Date` / `Hour` / `Minute` / `Period` subcomponents
 * stay value-correct without each rebuilding (or being passed) the item
 * arrays.
 */

const [WheelDateTimePickerProvider, useWheelDateTimePicker] = createContext({
  name: 'WheelDateTimePickerContext',
  strict: true,
  errorMessage: 'WheelDateTimePicker compound components must be used within `WheelDateTimePicker`.'
});
export { useWheelDateTimePicker, WheelDateTimePickerProvider };