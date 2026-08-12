/**
 * Number of year columns in the picker grid (matches web 3-column layout).
 */
export declare const YEAR_GRID_COLUMNS = 3;
/**
 * Default height (in pixels) of a single year cell. Used by `getItemLayout`
 * and applied inline to each cell so the FlatList virtualization math stays
 * in sync with the rendered cell height.
 */
export declare const DEFAULT_YEAR_CELL_HEIGHT = 40;
/**
 * Default chevron size for the year picker trigger indicator.
 */
export declare const INDICATOR_ICON_SIZE = 16;
/**
 * Default spring config for the trigger chevron rotation (accordion-style).
 */
export declare const INDICATOR_SPRING_CONFIG: {
    readonly damping: 20;
    readonly stiffness: 300;
    readonly mass: 0.2;
};
export declare const DISPLAY_NAME: {
    readonly ROOT: "HeroUINative.CalendarYearPicker";
    readonly TRIGGER: "HeroUINative.CalendarYearPicker.Trigger";
    readonly TRIGGER_HEADING: "HeroUINative.CalendarYearPicker.TriggerHeading";
    readonly TRIGGER_INDICATOR: "HeroUINative.CalendarYearPicker.TriggerIndicator";
    readonly GRID: "HeroUINative.CalendarYearPicker.Grid";
    readonly GRID_BODY: "HeroUINative.CalendarYearPicker.GridBody";
    readonly CELL: "HeroUINative.CalendarYearPicker.Cell";
};
//# sourceMappingURL=calendar-year-picker.constants.d.ts.map