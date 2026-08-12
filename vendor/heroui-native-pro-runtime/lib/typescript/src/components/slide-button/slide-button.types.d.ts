import type { TextProps, ViewProps, ViewStyle } from 'react-native';
import type { SharedValue, WithSpringConfig } from 'react-native-reanimated';
import type { Animation, AnimationRoot, AnimationValue, ElementSlots, TextRef, ViewRef } from '../../helpers/internal/types';
import type { SlideButtonOverlayContentSlots, SlideButtonRootSlots, SlideButtonUnderlayContentSlots } from './slide-button.styles';
/**
 * Visual variant for the SlideButton.
 */
export type SlideButtonVariant = 'default' | 'accent' | 'success' | 'danger';
/**
 * Context value shared between SlideButton compound parts.
 * Provides gesture progress, layout info, and variant to all children.
 */
export interface SlideButtonContextValue {
    /** Animated progress value (0 = start, 1 = end) */
    progress: SharedValue<number>;
    /** Whether the slide action has been completed */
    isCompleted: boolean;
    /** Measured width of the root content container */
    trackWidth: SharedValue<number>;
    /** Measured height of the root content container */
    trackHeight: SharedValue<number>;
    /** Measured width of the thumb element */
    thumbWidth: SharedValue<number>;
    /** Measured height of the thumb element */
    thumbHeight: SharedValue<number>;
    /** Progress threshold at which completion triggers */
    completionThreshold: number;
    /** Whether the component is disabled */
    isDisabled: boolean;
    /** Visual variant applied to the component */
    variant: SlideButtonVariant;
    /** Programmatically reset the slider to the start position */
    reset: () => void;
    /** Internal: triggers the completion flow from the thumb gesture */
    complete: () => void;
}
/**
 * Render props exposed via children-as-function on compound parts.
 * Provides shared values for building custom animated content.
 */
export type SlideButtonRenderProps = Pick<SlideButtonContextValue, 'progress' | 'isCompleted' | 'trackWidth' | 'trackHeight' | 'thumbWidth' | 'thumbHeight' | 'isDisabled' | 'variant'>;
/**
 * Props for the SlideButton root component.
 * Manages gesture state, progress tracking, and completion detection.
 */
export interface SlideButtonRootProps extends Omit<ViewProps, 'children'> {
    /**
     * Children elements or render function with access to slide state.
     */
    children?: React.ReactNode | ((props: SlideButtonRenderProps) => React.ReactNode);
    /**
     * Visual variant controlling color scheme.
     *
     * @default "default"
     */
    variant?: SlideButtonVariant;
    /**
     * Whether the slide action has completed (controlled mode).
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
     * Progress threshold (0-1) at which the slide action triggers.
     *
     * @default 0.85
     */
    completionThreshold?: number;
    /**
     * Whether the slider automatically resets after completion.
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
     */
    className?: string;
    /**
     * Additional CSS classes for individual slots.
     */
    classNames?: ElementSlots<SlideButtonRootSlots>;
    /**
     * Styles for individual slots.
     */
    styles?: Partial<Record<SlideButtonRootSlots, ViewStyle>>;
    /**
     * Callback fired when the completed state changes.
     * Receives `true` on completion and `false` on reset.
     */
    onCompleteChange?: (isCompleted: boolean) => void;
    /**
     * Callback fired when the slide action completes.
     */
    onComplete?: () => void;
    /**
     * Callback fired when the slider resets to start.
     */
    onReset?: () => void;
    /**
     * Animation configuration for the root component.
     * Set to `"disable-all"` to cascade animation disabling to all children.
     * Pass an object with `resetSpringConfig` to customize the reset spring behavior.
     */
    animation?: SlideButtonRootAnimation;
}
/**
 * Ref type for the SlideButton root component.
 */
export type SlideButtonRootRef = ViewRef;
/**
 * Animation configuration for the SlideButton root.
 * Extends `AnimationRoot` with a `resetSpringConfig` property
 * that controls the spring behavior when the slider resets to start.
 */
export type SlideButtonRootAnimation = AnimationRoot<{
    /**
     * Spring configuration for the reset animation (auto-reset and manual reset).
     *
     * @default { damping: 120, stiffness: 900, mass: 4 }
     */
    resetSpringConfig?: WithSpringConfig;
}>;
/**
 * Animation configuration for the SlideButton thumb.
 * Controls the spring behavior when the thumb snaps back or to completion.
 */
export type SlideButtonThumbAnimation = Animation<AnimationValue<{
    /**
     * Spring configuration for the thumb's snap-back and snap-to-end animation.
     *
     * @default { damping: 20, stiffness: 300 }
     */
    springConfig?: WithSpringConfig;
}>>;
/**
 * Props for the SlideButton.Thumb component.
 * The draggable handle that drives the slide gesture.
 */
export interface SlideButtonThumbProps extends ViewProps {
    /**
     * Custom content for the thumb. Defaults to a chevron-right icon.
     */
    children?: React.ReactNode;
    /**
     * Additional CSS classes for the thumb.
     *
     * @note The following style properties are occupied by animations and cannot be set via className:
     * - `transform` (translateX) - Animated for gesture tracking
     *
     * To customize spring behavior, use the `animation` prop on `SlideButton.Thumb`.
     * To completely disable animated styles, set `isAnimatedStyleActive={false}`.
     */
    className?: string;
    /**
     * Animation configuration for the thumb.
     */
    animation?: SlideButtonThumbAnimation;
    /**
     * Whether animated styles (react-native-reanimated) are active.
     * When `false`, the animated transform style is removed.
     *
     * @default true
     */
    isAnimatedStyleActive?: boolean;
    /**
     * Props forwarded to the default chevron icon.
     * Ignored when custom `children` are provided.
     */
    iconProps?: SlideButtonThumbIconProps;
}
/**
 * Ref type for the SlideButton.Thumb component.
 */
export type SlideButtonThumbRef = ViewRef;
/**
 * Icon props for the thumb's default icon.
 */
export interface SlideButtonThumbIconProps {
    /**
     * Icon size in logical pixels.
     *
     * @default 20
     */
    size?: number;
    /**
     * Icon fill color. When omitted, uses the variant foreground color.
     */
    color?: string;
}
/**
 * Props for the SlideButton.UnderlayContent component.
 * Right-anchored clip layer that reveals content to the right of the thumb.
 * Uses an overflow-hidden wrapper that shrinks as the thumb slides right.
 */
export interface SlideButtonUnderlayContentProps extends ViewProps {
    /**
     * Content to display in the underlay.
     */
    children?: React.ReactNode;
    /**
     * Additional CSS classes for the underlay container slot.
     *
     * @note The `container` slot has the following animated style properties that cannot be set via className:
     * - `width` - Animated to clip content at the thumb's leading edge
     */
    className?: string;
    /**
     * Additional CSS classes for individual underlay slots.
     */
    classNames?: ElementSlots<SlideButtonUnderlayContentSlots>;
    /**
     * Styles for individual underlay slots.
     */
    styles?: Partial<Record<SlideButtonUnderlayContentSlots, ViewStyle>>;
}
/**
 * Ref type for the SlideButton.UnderlayContent component.
 */
export type SlideButtonUnderlayContentRef = ViewRef;
/**
 * Props for the SlideButton.OverlayContent component.
 * Progress fill layer that reveals from left to right as the thumb slides.
 * Uses an overflow-hidden clip wrapper with an inner full-width container.
 */
export interface SlideButtonOverlayContentProps extends ViewProps {
    /**
     * Content to display in the overlay.
     * Lays out at full track width; clipped to the thumb's trailing edge.
     */
    children?: React.ReactNode;
    /**
     * Additional CSS classes for the overlay container slot.
     *
     * @note The `container` slot has the following animated style properties that cannot be set via className:
     * - `width` - Animated to clip content at the thumb's trailing edge
     */
    className?: string;
    /**
     * Additional CSS classes for individual overlay slots.
     */
    classNames?: ElementSlots<SlideButtonOverlayContentSlots>;
    /**
     * Styles for individual overlay slots.
     */
    styles?: Partial<Record<SlideButtonOverlayContentSlots, ViewStyle>>;
}
/**
 * Ref type for the SlideButton.OverlayContent component.
 */
export type SlideButtonOverlayContentRef = ViewRef;
/**
 * Props for the SlideButton.Label component.
 * A styled text element that automatically inherits the variant from context.
 */
export interface SlideButtonLabelProps extends TextProps {
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
 * Ref type for the SlideButton.Label component.
 */
export type SlideButtonLabelRef = TextRef;
//# sourceMappingURL=slide-button.types.d.ts.map