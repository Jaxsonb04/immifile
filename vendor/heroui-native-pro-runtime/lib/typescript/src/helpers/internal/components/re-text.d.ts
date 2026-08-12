import type { TextInputProps } from 'react-native';
import { TextInput } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import { type AnimatedProps } from 'react-native-reanimated';
/**
 * Props for {@link ReText}.
 *
 * `text` holds the string driven on the UI thread via `useAnimatedProps`.
 */
export interface ReTextProps extends Omit<TextInputProps, 'value' | 'style'> {
    /**
     * Shared string updated on the UI thread.
     */
    text: SharedValue<string>;
    /**
     * Animated styles for the underlying `TextInput`.
     */
    style?: AnimatedProps<TextInputProps>['style'];
}
/**
 * Read-only `TextInput` surface whose visible characters are updated from a
 * {@link SharedValue<string>} on the UI thread using `useAnimatedProps`.
 *
 * @param props - {@link ReTextProps}
 */
declare const ReText: import("react").ForwardRefExoticComponent<ReTextProps & import("react").RefAttributes<TextInput>>;
export default ReText;
//# sourceMappingURL=re-text.d.ts.map