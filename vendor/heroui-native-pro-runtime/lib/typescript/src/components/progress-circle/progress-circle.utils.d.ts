export { clampPercentage, formatProgressValue, } from '../progress-bar/progress-bar.utils';
/**
 * Computes the SVG `strokeDashoffset` for a given percentage.
 * At 0% the offset equals the full circumference (nothing drawn);
 * at 100% the offset is 0 (full circle drawn).
 */
export declare const computeStrokeDashoffset: (percentage: number, circumference: number) => number;
//# sourceMappingURL=progress-circle.utils.d.ts.map