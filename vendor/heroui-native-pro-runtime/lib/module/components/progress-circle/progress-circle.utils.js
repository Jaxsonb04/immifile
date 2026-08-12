"use strict";

export { clampPercentage, formatProgressValue } from "../progress-bar/progress-bar.utils.js";

/**
 * Computes the SVG `strokeDashoffset` for a given percentage.
 * At 0% the offset equals the full circumference (nothing drawn);
 * at 100% the offset is 0 (full circle drawn).
 */
export const computeStrokeDashoffset = (percentage, circumference) => {
  return circumference - percentage / 100 * circumference;
};