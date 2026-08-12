import type { ReactNode } from 'react';
import type { PressableProps, TextProps, ViewProps } from 'react-native';
import type { WithTimingConfig } from 'react-native-reanimated';
import type { Animation, AnimationRootDisableAll, AnimationValue, PressableRef, TextRef, ViewRef } from '../../helpers/internal/types';
/**
 * A single cell descriptor in the default 3×4 number pad layout.
 */
export type NumberPadDefaultLayoutItem = {
    type: 'key';
    value: string;
} | {
    type: 'spacer';
} | {
    type: 'backspace';
};
/**
 * Animation configuration for the NumberPad root component.
 * Set to `"disable-all"` to cascade animation disabling to all children.
 */
export type NumberPadRootAnimation = AnimationRootDisableAll;
/**
 * Animation configuration for NumberPad.Key and NumberPad.Backspace press feedback.
 * Controls the subtle scale applied while a key is pressed.
 *
 * @example
 * // Use defaults (scale 0.97, 150ms):
 * animation={true}
 *
 * // Custom scale and timing:
 * animation={{ scale: { value: 0.9, timingConfig: { duration: 200 } } }}
 *
 * // Disable:
 * animation={false}
 */
export type NumberPadKeyAnimation = Animation<{
    scale?: AnimationValue<{
        /**
         * Scale value applied when the key is pressed.
         *
         * @default 0.97
         */
        value?: number;
        /**
         * Timing configuration for the scale transition.
         *
         * @default { duration: 150 }
         */
        timingConfig?: WithTimingConfig;
    }>;
}>;
/**
 * Context value shared between NumberPad compound parts.
 * Provides the current value, disabled state, and key handlers.
 */
export interface NumberPadContextValue {
    /** Current pad value string */
    value: string;
    /** Whether the entire pad is disabled */
    isDisabled: boolean;
    /** Append a character to the current value when within maxLength */
    appendKey: (key: string) => void;
    /** Remove the last character from the current value */
    deleteKey: () => void;
    /** Clear the entire value */
    clear: () => void;
    /** Default press handler for the spacer cell when it renders as a key */
    onSpacerPress?: () => void;
}
/**
 * Props for the NumberPad root component.
 * Manages value state and renders the default 3×4 grid when no children are provided.
 */
export interface NumberPadRootProps extends ViewProps {
    /**
     * Pad content. When omitted, the default digit grid (1–9, spacer, 0, backspace)
     * is rendered automatically.
     */
    children?: ReactNode;
    /**
     * Controlled value string.
     */
    value?: string;
    /**
     * Default value for uncontrolled mode.
     *
     * @default ""
     */
    defaultValue?: string;
    /**
     * Callback fired when the value changes.
     */
    onValueChange?: (value: string) => void;
    /**
     * Maximum number of characters allowed in the value.
     * Additional key presses are ignored once the limit is reached.
     */
    maxLength?: number;
    /**
     * Callback fired when a digit key is pressed.
     * Receives the key character and the value that would result from the press.
     */
    onKeyPress?: (key: string, nextValue: string) => void;
    /**
     * Callback fired when backspace is pressed.
     * Receives the value after deleting the last character.
     */
    onBackspacePress?: (value: string) => void;
    /**
     * Callback fired when the spacer cell is pressed.
     * Applies to a `NumberPad.Spacer` rendered as a key (with children) that
     * does not define its own `onPress`.
     */
    onSpacerPress?: () => void;
    /**
     * Callback fired when the value is cleared via backspace long-press.
     */
    onClear?: () => void;
    /**
     * Callback fired when the value reaches maxLength.
     */
    onComplete?: (value: string) => void;
    /**
     * Whether the entire pad is disabled.
     *
     * @default false
     */
    isDisabled?: boolean;
    /**
     * Additional CSS classes for the root grid container.
     */
    className?: string;
    /**
     * Animation configuration for the root component.
     * - `"disable-all"`: disable all animations including children (cascades to all child components).
     * - `undefined`: use default animations.
     */
    animation?: NumberPadRootAnimation;
}
/**
 * Ref type for the NumberPad root component.
 */
export type NumberPadRootRef = ViewRef;
/**
 * Props for the NumberPad.Row component.
 * Horizontal container that lays out a row of keys with equal widths.
 */
export interface NumberPadRowProps extends ViewProps {
    /**
     * Row content, typically `NumberPad.Key`, `NumberPad.Backspace`,
     * or `NumberPad.Spacer` elements.
     */
    children?: ReactNode;
    /**
     * Additional CSS classes for the row container.
     */
    className?: string;
}
/**
 * Ref type for the NumberPad.Row component.
 */
export type NumberPadRowRef = ViewRef;
/**
 * Icon props for the default backspace icon.
 */
export interface NumberPadBackspaceIconProps {
    /**
     * Icon size in pixels.
     *
     * @default 24
     */
    size?: number;
    /**
     * Icon fill color. Defaults to the foreground theme color.
     */
    color?: string;
}
/**
 * Render props passed to a `NumberPad.Key` render-function `children`.
 * Reflects the key's current value and interaction state.
 */
export interface NumberPadKeyRenderProps {
    /** The key's value */
    value: string;
    /** Whether the key is currently pressed */
    isPressed: boolean;
    /** Whether the key is disabled */
    isDisabled: boolean;
}
/**
 * Context value shared from a NumberPad.Key to its NumberPad.KeyLabel.
 */
export interface NumberPadKeyContextValue {
    /** The key's value, used as the default label content */
    value: string;
    /** Whether the key is currently pressed */
    isPressed: boolean;
    /** Whether the key is disabled */
    isDisabled: boolean;
}
/**
 * Props for the NumberPad.Key component.
 * A pressable digit key with subtle press animation.
 */
export interface NumberPadKeyProps extends Omit<PressableProps, 'children' | 'disabled'> {
    /**
     * Digit or character value for this key.
     */
    value: string;
    /**
     * Whether this key is disabled independently of the root pad.
     *
     * @default false
     */
    isDisabled?: boolean;
    /**
     * Custom content. Defaults to a `NumberPad.KeyLabel` showing the `value`.
     * Pass a render function to receive the key's state
     * (`value`, `isPressed`, `isDisabled`).
     */
    children?: ReactNode | ((props: NumberPadKeyRenderProps) => ReactNode);
    /**
     * Additional CSS classes for the key container.
     *
     * @note `transform` (scale) is animated for press feedback and cannot be set
     * via className. Customize it with the `animation` prop, or set
     * `isAnimatedStyleActive={false}` to apply your own.
     */
    className?: string;
    /**
     * Animation configuration for the key press feedback.
     */
    animation?: NumberPadKeyAnimation;
    /**
     * When `false`, animated styles are not applied.
     *
     * @default true
     */
    isAnimatedStyleActive?: boolean;
}
/**
 * Ref type for the NumberPad.Key component.
 */
export type NumberPadKeyRef = PressableRef;
/**
 * Props for the NumberPad.KeyLabel component.
 * Text label rendered inside a NumberPad.Key.
 */
export interface NumberPadKeyLabelProps extends TextProps {
    /**
     * Custom label content. Defaults to the parent key's `value`.
     */
    children?: ReactNode;
    /**
     * Additional CSS classes for the label text.
     */
    className?: string;
}
/**
 * Ref type for the NumberPad.KeyLabel component.
 */
export type NumberPadKeyLabelRef = TextRef;
/**
 * Props for the NumberPad.Backspace component.
 * Deletes one character on press; clears all on long-press.
 *
 * Built on top of `NumberPad.Key`, so it shares the same styling and
 * animation props. The `value` prop is omitted as it carries no digit.
 */
export interface NumberPadBackspaceProps extends Omit<NumberPadKeyProps, 'value' | 'children'> {
    /**
     * Custom content for the backspace key. Defaults to a backspace icon.
     */
    children?: ReactNode;
    /**
     * Props forwarded to the default backspace icon. Ignored when `children` is provided.
     */
    iconProps?: NumberPadBackspaceIconProps;
}
/**
 * Ref type for the NumberPad.Backspace component.
 */
export type NumberPadBackspaceRef = PressableRef;
/**
 * Props for the NumberPad.Spacer component.
 * Preserves grid alignment. When `children` are provided it behaves like a
 * `NumberPad.Key` (pressable, styled, animated) so it can host custom actions
 * such as a biometric button. With no children it renders an inert empty cell.
 */
export interface NumberPadSpacerProps extends Omit<NumberPadKeyProps, 'value'> {
    /**
     * Optional content. When provided, the spacer behaves like a `NumberPad.Key`.
     */
    children?: ReactNode;
}
/**
 * Ref type for the NumberPad.Spacer component.
 */
export type NumberPadSpacerRef = ViewRef;
//# sourceMappingURL=number-pad.types.d.ts.map