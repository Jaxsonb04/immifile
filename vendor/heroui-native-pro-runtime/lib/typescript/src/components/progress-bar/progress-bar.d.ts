import { View } from 'react-native';
import type { ProgressBarContextValue, ProgressBarFillProps, ProgressBarLabelProps, ProgressBarRootProps, ProgressBarTrackProps, ProgressBarValueLabelProps } from './progress-bar.types';
declare const useProgressBar: () => ProgressBarContextValue;
/**
 * Compound ProgressBar component with sub-components
 *
 * @component ProgressBar - Root container managing progress state and variant
 * configuration. Computes percentage and formatted value text from `value`,
 * `minValue`, `maxValue`, and `formatOptions`. When plain string children are
 * provided, they auto-expand into Label + ValueLabel + Track(Fill).
 *
 * @component ProgressBar.Track - Background container for the fill element.
 * Applies rounded corners, overflow hidden, and size-based height.
 *
 * @component ProgressBar.Fill - Animated element representing filled progress.
 * Automatically switches between determinate (width animation) and
 * indeterminate (translateX sweep) based on the root's `isIndeterminate` prop.
 *
 * @component ProgressBar.Label - Text describing the progress operation.
 *
 * @component ProgressBar.ValueLabel - Displays the formatted progress value.
 * Renders with tabular figures for consistent digit alignment. Hidden when
 * indeterminate.
 *
 * Props flow from ProgressBar to sub-components via context
 * (percentage, valueText, isIndeterminate, isDisabled, size, color).
 *
 */
declare const ProgressBar: import("react").ForwardRefExoticComponent<ProgressBarRootProps & import("react").RefAttributes<View>> & {
    /** Background container for the fill element */
    Track: import("react").ForwardRefExoticComponent<ProgressBarTrackProps & import("react").RefAttributes<View>>;
    /** Animated fill representing progress */
    Fill: import("react").ForwardRefExoticComponent<ProgressBarFillProps & import("react").RefAttributes<View>>;
    /** Text label describing the operation */
    Label: import("react").ForwardRefExoticComponent<ProgressBarLabelProps & import("react").RefAttributes<import("react-native").Text>>;
    /** Formatted progress value text */
    ValueLabel: import("react").ForwardRefExoticComponent<ProgressBarValueLabelProps & import("react").RefAttributes<import("react-native").Text>>;
};
export default ProgressBar;
export { useProgressBar };
//# sourceMappingURL=progress-bar.d.ts.map