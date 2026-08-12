import type { ProgressButtonContextValue, ProgressButtonLabelProps, ProgressButtonMaskLabelProps, ProgressButtonOverlayProps, ProgressButtonRootProps } from './progress-button.types';
declare const useProgressButton: () => ProgressButtonContextValue;
/**
 * Compound ProgressButton component with sub-components
 *
 * @component ProgressButton - Root container managing press-and-hold state.
 * Uses an AnimatedPressable that scales down on press and fills a progress
 * animation from 0 to 1 over the configured hold duration. Supports controlled
 * and uncontrolled completion state with optional auto-reset.
 *
 * @component ProgressButton.Label - Base text layer always visible beneath the overlay.
 * Captures its own layout position (x, width) to enable the MaskLabel
 * counter-animation for the color-wipe effect.
 *
 * @component ProgressButton.Overlay - Absolutely positioned layer
 * that sweeps left-to-right via animated translateX with a variant-colored
 * background. Renders children (typically MaskLabel).
 *
 * @component ProgressButton.MaskLabel - Inverted-color text inside the Overlay.
 * Counter-translates to stay visually aligned with the base Label, creating
 * the illusion that a single label changes color as the fill sweeps across.
 *
 * Props flow from ProgressButton to sub-components via context
 * (progress, isCompleted, trackWidth, textX, textWidth, variant, isDisabled).
 *
 */
declare const ProgressButton: import("react").ForwardRefExoticComponent<ProgressButtonRootProps & import("react").RefAttributes<import("react-native").View>> & {
    /** @optional Base text label (captures layout for MaskLabel alignment) */
    Label: import("react").ForwardRefExoticComponent<ProgressButtonLabelProps & import("react").RefAttributes<import("react-native").Text>>;
    /** @optional Overlay that sweeps left-to-right on hold */
    Overlay: import("react").ForwardRefExoticComponent<ProgressButtonOverlayProps & import("react").RefAttributes<import("react-native").View>>;
    /** @optional Inverted-color text for color-wipe effect inside Overlay */
    MaskLabel: import("react").ForwardRefExoticComponent<ProgressButtonMaskLabelProps & import("react").RefAttributes<import("react-native").Text>>;
};
export default ProgressButton;
export { useProgressButton };
//# sourceMappingURL=progress-button.d.ts.map