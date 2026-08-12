"use strict";

/**
 * Number of year columns in the picker grid (matches web 3-column layout).
 */
export const YEAR_GRID_COLUMNS = 3;

/**
 * Default height (in pixels) of a single year cell. Used by `getItemLayout`
 * and applied inline to each cell so the FlatList virtualization math stays
 * in sync with the rendered cell height.
 */
export const DEFAULT_YEAR_CELL_HEIGHT = 40;

/**
 * Default chevron size for the year picker trigger indicator.
 */
export const INDICATOR_ICON_SIZE = 16;

/**
 * Default spring config for the trigger chevron rotation (accordion-style).
 */
export const INDICATOR_SPRING_CONFIG = {
  damping: 20,
  stiffness: 300,
  mass: 0.2
};
export const DISPLAY_NAME = {
  ROOT: 'HeroUINative.CalendarYearPicker',
  TRIGGER: 'HeroUINative.CalendarYearPicker.Trigger',
  TRIGGER_HEADING: 'HeroUINative.CalendarYearPicker.TriggerHeading',
  TRIGGER_INDICATOR: 'HeroUINative.CalendarYearPicker.TriggerIndicator',
  GRID: 'HeroUINative.CalendarYearPicker.Grid',
  GRID_BODY: 'HeroUINative.CalendarYearPicker.GridBody',
  CELL: 'HeroUINative.CalendarYearPicker.Cell'
};