import { View } from 'react-native';
import type { SlideButtonContextValue, SlideButtonLabelProps, SlideButtonOverlayContentProps, SlideButtonRootProps, SlideButtonThumbProps, SlideButtonUnderlayContentProps } from './slide-button.types';
declare const useSlideButton: () => SlideButtonContextValue;
/**
 * Compound SlideButton component with sub-components
 *
 * @component SlideButton - Root container managing slide gesture state.
 * Provides progress, completion, and variant context to sub-components.
 * Supports controlled and uncontrolled completion state with optional auto-reset.
 *
 * @component SlideButton.UnderlayContent - Static content layer beneath the overlay.
 * Renders at full track width for label text, gradients, or patterns.
 * Supports render-prop children for progress-driven animations.
 *
 * @component SlideButton.OverlayContent - Progress fill layer that clips from left.
 * Uses overflow-hidden with animated width tied to thumb position.
 * Inner container maintains full track width for natural content layout.
 *
 * @component SlideButton.Thumb - Draggable handle driven by Pan gesture.
 * Uses react-native-gesture-handler for 60fps native gesture tracking.
 * Renders a chevron-right icon by default; accepts custom children.
 *
 * @component SlideButton.Label - Styled text that inherits the variant color.
 * Use inside UnderlayContent or OverlayContent for consistent label text.
 *
 * Props flow from SlideButton to sub-components via context
 * (progress, isCompleted, trackWidth, trackHeight, variant, isDisabled).
 *
 */
declare const SlideButton: import("react").ForwardRefExoticComponent<SlideButtonRootProps & import("react").RefAttributes<View>> & {
    /** @optional Static content beneath the overlay (label, gradient, pattern) */
    UnderlayContent: import("react").ForwardRefExoticComponent<SlideButtonUnderlayContentProps & import("react").RefAttributes<View>>;
    /** @optional Progress fill layer clipped to thumb position */
    OverlayContent: import("react").ForwardRefExoticComponent<SlideButtonOverlayContentProps & import("react").RefAttributes<View>>;
    /** @optional Draggable thumb handle with gesture support */
    Thumb: import("react").ForwardRefExoticComponent<SlideButtonThumbProps & import("react").RefAttributes<View>>;
    /** @optional Styled text label that inherits the variant color */
    Label: import("react").ForwardRefExoticComponent<SlideButtonLabelProps & import("react").RefAttributes<import("react-native").Text>>;
};
export default SlideButton;
export { useSlideButton };
//# sourceMappingURL=slide-button.d.ts.map