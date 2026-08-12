import type { AnimatedProps, EntryOrExitLayoutType, WithTimingConfig } from 'react-native-reanimated';
import type { HeroTextProps } from '../../helpers/internal/components';
import type { Animation, AnimationRootDisableAll, AnimationValue } from '../../helpers/internal/types';
import type * as NumberStepperPrimitivesTypes from '../../primitives/number-stepper/number-stepper.types';
/**
 * Read-only state values exposed to the NumberStepper render function children.
 * Provides the current value, boundary flags, and disabled state.
 */
export type NumberStepperRootRenderProps = NumberStepperPrimitivesTypes.RootRenderProps;
/**
 * Props for the NumberStepper root component.
 * Manages value state and provides context to sub-components.
 */
export interface NumberStepperRootProps extends NumberStepperPrimitivesTypes.RootProps {
    /**
     * Additional CSS classes for the root container.
     */
    className?: string;
    /**
     * Animation configuration for the root component.
     * Set to "disable-all" to cascade animation disabling to all children.
     */
    animation?: AnimationRootDisableAll;
}
/**
 * Ref type for the NumberStepper root component.
 */
export type NumberStepperRootRef = NumberStepperPrimitivesTypes.RootRef;
/**
 * A single animation or a per-direction pair.
 * Pass a plain value to use the same animation for both directions,
 * or an object with `increase`/`decrease` keys for direction-aware control.
 *
 * @example
 * // Same for both directions:
 * entering: FadeIn
 *
 * // Per-direction:
 * entering: { increase: SlideInUp, decrease: SlideInDown }
 */
export type NumberStepperDirectionalAnimation = EntryOrExitLayoutType | {
    increase?: EntryOrExitLayoutType;
    decrease?: EntryOrExitLayoutType;
};
/**
 * Animation configuration for NumberStepper.Value component.
 * Controls the entering/exiting Keyframe animations on value change.
 * Supports direction-aware overrides via NumberStepperDirectionalAnimation.
 */
export type NumberStepperValueAnimation = Animation<AnimationValue<{
    /**
     * Entering animation played when the new value mounts.
     * Accepts a single animation or per-direction `{ increase, decrease }`.
     * @default Direction-aware Keyframe slide + scale with spring-like bezier, 400ms
     */
    entering?: NumberStepperDirectionalAnimation;
    /**
     * Exiting animation played when the old value unmounts.
     * Accepts a single animation or per-direction `{ increase, decrease }`.
     * @default Direction-aware Keyframe slide + scale with spring-like bezier, 400ms
     */
    exiting?: NumberStepperDirectionalAnimation;
    /**
     * Vertical slide distance in pixels for the default Keyframe animations.
     * Ignored when custom `entering`/`exiting` animations are provided.
     * @default 16
     */
    translateYDistance?: number;
    /**
     * Scale applied at the start/end of the default Keyframe transitions.
     * Ignored when custom `entering`/`exiting` animations are provided.
     * @default 0.7
     */
    scaleValue?: number;
}>>;
/**
 * Animation configuration for NumberStepper increment/decrement buttons.
 * Controls the scale-on-press feedback animation.
 *
 * @example
 * // Use defaults (scale 0.92, 150ms):
 * animation={true}
 *
 * // Custom scale and timing:
 * animation={{ value: 0.9, timingConfig: { duration: 200 } }}
 *
 * // Disable:
 * animation={false}
 */
export type NumberStepperButtonAnimation = Animation<AnimationValue<{
    /**
     * Scale value applied when the button is pressed.
     * @default 0.95
     */
    value?: number;
    /**
     * Timing configuration for the scale transition.
     * @default { duration: 150 }
     */
    timingConfig?: WithTimingConfig;
}>>;
/**
 * Props for the NumberStepper.Value component.
 * Displays the current numeric value with Keyframe animations on change.
 *
 * Extends `AnimatedProps<HeroTextProps>` to mirror the underlying `AnimatedText`
 * (`Animated.createAnimatedComponent(HeroText)`) the styled component renders.
 * The primitive's `SlottableTextProps` (`asChild`) is intentionally not exposed
 * here because `HeroText` does not support slot composition.
 */
export interface NumberStepperValueProps extends AnimatedProps<HeroTextProps> {
    /**
     * Custom content to display instead of the default value text.
     */
    children?: React.ReactNode;
    /**
     * Additional CSS classes for the value text.
     */
    className?: string;
    /**
     * Animation configuration for the value display.
     * Controls entering/exiting Keyframe animations on value change.
     */
    animation?: NumberStepperValueAnimation;
}
/**
 * Ref type for the NumberStepper.Value component.
 */
export type NumberStepperValueRef = NumberStepperPrimitivesTypes.ValueRef;
/**
 * Icon props for number stepper button default icons.
 */
export interface NumberStepperButtonIconProps {
    /** Icon size in pixels. @default 18 */
    size?: number;
    /** Icon fill color. Defaults to the foreground theme color. */
    color?: string;
}
/**
 * Props for the NumberStepper.DecrementButton component.
 * Pressable button that decreases the value by one step.
 *
 * @extends NumberStepperPrimitivesTypes.DecrementButtonProps Inherits pressable props from the primitive
 */
export interface NumberStepperDecrementButtonProps extends NumberStepperPrimitivesTypes.DecrementButtonProps {
    /**
     * Custom content for the button. Defaults to a minus icon.
     *
     * To completely disable animated styles and use your own via className or style prop, set `isAnimatedStyleActive={false}`.
     */
    children?: React.ReactNode;
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Props forwarded to the default minus icon. Ignored when `children` is provided.
     */
    iconProps?: NumberStepperButtonIconProps;
    /**
     * Animation configuration for the button press scale effect.
     */
    animation?: NumberStepperButtonAnimation;
    /**
     * Whether animated styles (react-native-reanimated) are active.
     * When `false`, the animated scale style is removed and you can implement custom logic.
     * @default true
     */
    isAnimatedStyleActive?: boolean;
}
/**
 * Ref type for the NumberStepper.DecrementButton component.
 */
export type NumberStepperDecrementButtonRef = NumberStepperPrimitivesTypes.DecrementButtonRef;
/**
 * Props for the NumberStepper.IncrementButton component.
 * Pressable button that increases the value by one step.
 *
 * @extends NumberStepperPrimitivesTypes.IncrementButtonProps Inherits pressable props from the primitive
 */
export interface NumberStepperIncrementButtonProps extends NumberStepperPrimitivesTypes.IncrementButtonProps {
    /**
     * Custom content for the button. Defaults to a plus icon.
     *
     * To completely disable animated styles and use your own via className or style prop, set `isAnimatedStyleActive={false}`.
     */
    children?: React.ReactNode;
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Props forwarded to the default plus icon. Ignored when `children` is provided.
     */
    iconProps?: NumberStepperButtonIconProps;
    /**
     * Animation configuration for the button press scale effect.
     */
    animation?: NumberStepperButtonAnimation;
    /**
     * Whether animated styles (react-native-reanimated) are active.
     * When `false`, the animated scale style is removed and you can implement custom logic.
     * @default true
     */
    isAnimatedStyleActive?: boolean;
}
/**
 * Ref type for the NumberStepper.IncrementButton component.
 */
export type NumberStepperIncrementButtonRef = NumberStepperPrimitivesTypes.IncrementButtonRef;
//# sourceMappingURL=number-stepper.types.d.ts.map