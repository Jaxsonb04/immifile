import type { PressableProps, TextProps, ViewProps } from 'react-native';
import type { SharedValue, WithSpringConfig, WithTimingConfig } from 'react-native-reanimated';
import type { AnimationRoot, AnimationValue, PressableRef, TextRef, ViewRef } from '../../helpers/internal/types';
/**
 * Visual variant for the ProgressButton.
 */
export type ProgressButtonVariant = 'default' | 'accent' | 'success' | 'danger';
/**
 * Context value shared between ProgressButton compound parts.
 * Provides fill progress, layout measurements, and variant to all children.
 */
export interface ProgressButtonContextValue {
    /** Animated progress value (0 = start, 1 = complete) */
    progress: SharedValue<number>;
    /** Whether the hold action has been completed */
    isCompleted: boolean;
    /** Measured width of the root container */
    trackWidth: SharedValue<number>;
    /** Measured x-offset of the Label relative to the root container */
    textX: SharedValue<number>;
    /** Measured width of the Label text */
    textWidth: SharedValue<number>;
    /** Whether the component is disabled */
    isDisabled: boolean;
    /** Visual variant applied to the component */
    variant: ProgressButtonVariant;
    /** Programmatically reset the progress to 0 */
    reset: () => void;
    /** Programmatically trigger the completion flow */
    complete: () => void;
}
/**
 * Render props exposed via children-as-function on the root.
 * Provides shared values for building custom animated content.
 */
export type ProgressButtonRenderProps = Pick<ProgressButtonContextValue, 'progress' | 'isCompleted' | 'trackWidth' | 'textX' | 'textWidth' | 'isDisabled' | 'variant'>;
/**
 * Props for the ProgressButton root component.
 * Manages press-and-hold state, fill progress, and completion detection.
 */
export interface ProgressButtonRootProps extends Omit<PressableProps, 'children'> {
    /**
     * Children elements or render function with access to progress state.
     */
    children?: React.ReactNode | ((props: ProgressButtonRenderProps) => React.ReactNode);
    /**
     * Visual variant controlling color scheme.
     *
     * @default "default"
     */
    variant?: ProgressButtonVariant;
    /**
     * Duration in milliseconds the user must hold to complete.
     *
     * @default 2000
     */
    holdDuration?: number;
    /**
     * Whether the hold action has completed (controlled mode).
     */
    isCompleted?: boolean;
    /**
     * Default completed state for uncontrolled mode.
     *
     * @default false
     */
    isDefaultCompleted?: boolean;
    /**
     * Whether the component is disabled.
     *
     * @default false
     */
    isDisabled?: boolean;
    /**
     * Whether the button automatically resets after completion.
     *
     * @default false
     */
    autoReset?: boolean;
    /**
     * Delay in milliseconds before auto-reset occurs.
     * Only used when `autoReset` is `true`.
     *
     * @default 1000
     */
    autoResetDelay?: number;
    /**
     * Additional CSS classes for the root container.
     *
     * @note The following style properties are occupied by animations and cannot be set via className:
     * - `transform` (scale) - Animated for press feedback
     *
     * To customize the scale behavior, use the `animation` prop on `ProgressButton`:
     * ```tsx
     * <ProgressButton
     *   animation={{
     *     scale: { value: 0.97, timingConfig: { duration: 200 } },
     *   }}
     * />
     * ```
     */
    className?: string;
    /**
     * Callback fired when the completed state changes.
     * Receives `true` on completion and `false` on reset.
     */
    onCompleteChange?: (isCompleted: boolean) => void;
    /**
     * Callback fired when the hold action completes.
     */
    onComplete?: () => void;
    /**
     * Callback fired when the button resets to start.
     */
    onReset?: () => void;
    /**
     * Animation configuration for the root component.
     * Set to `"disable-all"` to cascade animation disabling to all children.
     * Pass an object with configs to customize fill, scale, or reset animations.
     */
    animation?: ProgressButtonRootAnimation;
}
/**
 * Ref type for the ProgressButton root component.
 */
export type ProgressButtonRootRef = PressableRef;
/**
 * Animation configuration for the ProgressButton root.
 * Extends `AnimationRoot` with a spring config for progress reset and controlled-sync,
 * and a scale config for press-feedback animation.
 */
export type ProgressButtonRootAnimation = AnimationRoot<{
    /**
     * Spring configuration for the progress reset and controlled-sync animations.
     *
     * @default { damping: 120, stiffness: 900, mass: 4 }
     */
    progressSpringConfig?: AnimationValue<WithSpringConfig>;
    /**
     * Scale press-feedback configuration.
     * `value` is the target scale while pressed (released always snaps back to `1`).
     * `timingConfig` controls the animation timing for both directions.
     *
     * @default { value: 0.985, timingConfig: { duration: 150 } }
     */
    scale?: {
        value?: number;
        timingConfig?: WithTimingConfig;
    };
}>;
/**
 * Props for the ProgressButton.Overlay component.
 * Absolutely positioned layer that sweeps left-to-right via translateX
 * with a variant-colored background. Renders children (MaskLabel).
 */
export interface ProgressButtonOverlayProps extends ViewProps {
    /**
     * Content to display in the overlay (typically ProgressButton.MaskLabel).
     */
    children?: React.ReactNode;
    /**
     * Additional CSS classes for the overlay container.
     *
     * @note The following style properties are occupied by animations and cannot be set via className:
     * - `transform` (translateX) - Animated for the left-to-right fill sweep
     */
    className?: string;
}
/**
 * Ref type for the ProgressButton.Overlay component.
 */
export type ProgressButtonOverlayRef = ViewRef;
/**
 * Props for the ProgressButton.Label component.
 * Base text layer always visible beneath the overlay.
 * Captures its own layout (x, width) for the MaskLabel counter-animation.
 */
export interface ProgressButtonLabelProps extends TextProps {
    /**
     * Text content for the label.
     */
    children?: React.ReactNode;
    /**
     * Additional CSS classes for the label text.
     */
    className?: string;
}
/**
 * Ref type for the ProgressButton.Label component.
 */
export type ProgressButtonLabelRef = TextRef;
/**
 * Props for the ProgressButton.MaskLabel component.
 * Inverted-color text inside the Overlay that counter-translates
 * to stay visually aligned with the base Label, creating a color-wipe effect.
 */
export interface ProgressButtonMaskLabelProps extends TextProps {
    /**
     * Text content for the mask label (should match Label text).
     */
    children?: React.ReactNode;
    /**
     * Additional CSS classes for the mask label text.
     *
     * @note The following style properties are occupied by animations and cannot be set via className:
     * - `transform` (translateX) - Animated for counter-translation alignment with base Label
     */
    className?: string;
}
/**
 * Ref type for the ProgressButton.MaskLabel component.
 */
export type ProgressButtonMaskLabelRef = TextRef;
//# sourceMappingURL=progress-button.types.d.ts.map