"use strict";

import { createContext } from "../../helpers/internal/utils/create-context.js";
const [YearPickerContextProvider, useYearPicker, YearPickerContext] = createContext({
  name: 'HeroUINative.YearPicker',
  errorMessage: 'useYearPicker must be used within Calendar or RangeCalendar (year picker enabled).'
});
export { useYearPicker, YearPickerContext, YearPickerContextProvider };