"use strict";

/**
 * Range calendar animation — same hooks and behavior as `calendar.animation`.
 * Root uses {@link useCalendarRootAnimation}; `CellBody` uses
 * {@link useCalendarCellBodyAnimation} with `isPressed` when the cell allows interaction.
 */
export { useCalendarCellBodyAnimation, useCalendarRootAnimation } from "../calendar/calendar.animation.js";