import { View } from 'react-native';
import type { ProgressCircleContextValue, ProgressCircleIndicatorProps, ProgressCircleRootProps, ProgressCircleValueLabelProps } from './progress-circle.types';
declare const useProgressCircle: () => ProgressCircleContextValue;
/**
 * Compound ProgressCircle component with sub-components
 *
 * @component ProgressCircle - Root container managing progress state and
 * variant configuration. Computes percentage and formatted value text from
 * `value`, `minValue`, `maxValue`, and `formatOptions`.
 *
 * @component ProgressCircle.Indicator - SVG rendering of the track and fill
 * circles. Automatically switches between determinate (animated
 * `strokeDashoffset`) and indeterminate (continuous rotation) modes based on
 * the root's `isIndeterminate` prop.
 *
 * @component ProgressCircle.ValueLabel - Text centered on the circle
 * displaying the formatted progress value. Renders with tabular figures for
 * consistent digit alignment. Hidden when indeterminate.
 *
 * Props flow from ProgressCircle to sub-components via context
 * (percentage, valueText, isIndeterminate, isDisabled, size, color).
 *
 */
declare const ProgressCircle: import("react").ForwardRefExoticComponent<ProgressCircleRootProps & import("react").RefAttributes<View>> & {
    /** SVG indicator with track and fill circles */
    Indicator: import("react").ForwardRefExoticComponent<ProgressCircleIndicatorProps & import("react").RefAttributes<View>>;
    /** Formatted progress value centered on the circle */
    ValueLabel: import("react").ForwardRefExoticComponent<ProgressCircleValueLabelProps & import("react").RefAttributes<import("react-native").Text>>;
};
export default ProgressCircle;
export { useProgressCircle };
//# sourceMappingURL=progress-circle.d.ts.map