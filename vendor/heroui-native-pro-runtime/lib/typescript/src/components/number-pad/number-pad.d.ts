import { View } from 'react-native';
import type { NumberPadBackspaceProps, NumberPadContextValue, NumberPadKeyLabelProps, NumberPadKeyProps, NumberPadRootProps, NumberPadRowProps, NumberPadSpacerProps } from './number-pad.types';
declare const useNumberPad: () => NumberPadContextValue;
/**
 * Compound NumberPad component with sub-components.
 *
 * @component NumberPad - Root column container managing value state.
 * Auto-renders the default 3×4 digit layout when no children are provided.
 *
 * @component NumberPad.Row - Horizontal container that lays out a row of keys
 * with equal widths. Required when composing keys manually.
 *
 * @component NumberPad.Key - Pressable digit key with subtle press animation.
 * Appends its value to the pad value by default. Renders a default
 * NumberPad.KeyLabel showing its value when no children are provided.
 *
 * @component NumberPad.KeyLabel - Text label inside a key. Defaults to the
 * parent key's value when no children are provided.
 *
 * @component NumberPad.Backspace - Delete key. Press removes one character;
 * long-press clears the entire value.
 *
 * @component NumberPad.Spacer - Grid cell preserving alignment. Renders an
 * inert empty cell by default; when given children it behaves like a
 * NumberPad.Key for custom actions such as biometric authentication.
 *
 * Props flow from NumberPad to sub-components via context.
 */
declare const NumberPad: import("react").ForwardRefExoticComponent<NumberPadRootProps & import("react").RefAttributes<View>> & {
    /** @optional Horizontal row container distributing keys with equal widths */
    Row: import("react").ForwardRefExoticComponent<NumberPadRowProps & import("react").RefAttributes<View>>;
    /** @optional Pressable digit key with press animation */
    Key: import("react").ForwardRefExoticComponent<NumberPadKeyProps & import("react").RefAttributes<View>>;
    /** @optional Text label inside a key, defaults to the key's value */
    KeyLabel: import("react").ForwardRefExoticComponent<NumberPadKeyLabelProps & import("react").RefAttributes<import("react-native").Text>>;
    /** @optional Backspace key — press to delete, long-press to clear */
    Backspace: import("react").ForwardRefExoticComponent<NumberPadBackspaceProps & import("react").RefAttributes<View>>;
    /** @optional Grid cell — inert when empty, acts as a key when given children */
    Spacer: import("react").ForwardRefExoticComponent<NumberPadSpacerProps & import("react").RefAttributes<View>>;
};
export default NumberPad;
export { useNumberPad };
//# sourceMappingURL=number-pad.d.ts.map