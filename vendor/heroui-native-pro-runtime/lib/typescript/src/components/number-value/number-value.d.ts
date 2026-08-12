import { View } from 'react-native';
import type { NumberValueContextValue, NumberValuePrefixProps, NumberValueRootProps, NumberValueSuffixProps, NumberValueValueProps } from './number-value.types';
declare const useNumberValue: () => NumberValueContextValue;
/**
 * Compound `NumberValue` component with sub-components.
 *
 * @component NumberValue - Locale-aware formatted number built on top of
 * `@internationalized/number`. Renders as a row-laid `View` with two
 * slots: `container` (the outer `View`) and `value` (the inner `Text`
 * rendering the formatted string). Accepts convenience props
 * (`numberStyle`, `currency`, `notation`, `signDisplay`,
 * `minimumFractionDigits`, `maximumFractionDigits`, `unit`) or a raw
 * `formatOptions` object. Without children, the root auto-renders the
 * formatted value using the `value` slot styling. With children, the
 * consumer composes the layout using `Value`, `Prefix`, and `Suffix`.
 * Digits are rendered with tabular figures so columns of numbers align
 * vertically.
 *
 * @component NumberValue.Value - Renders the formatted numeric string
 * read from the nearest `NumberValue` context. Use this part to control
 * the placement of the value when composing a custom layout — for example
 * between a `Prefix` and a `Suffix`.
 *
 * @component NumberValue.Prefix - Inline text placed before the value
 * (e.g. a leading label or a unit symbol).
 *
 * @component NumberValue.Suffix - Inline text placed after the value
 * (e.g. a trailing label or a unit symbol).
 *
 * `NumberValue` also supports a render-function `children` that receives
 * the formatted string and is fully responsible for the resulting output
 * (no wrapping container is rendered in that case).
 *
 */
declare const NumberValue: import("react").ForwardRefExoticComponent<NumberValueRootProps & import("react").RefAttributes<View>> & {
    /** @optional Formatted numeric string read from the root context. */
    Value: import("react").ForwardRefExoticComponent<NumberValueValueProps & import("react").RefAttributes<import("react-native").Text>>;
    /** @optional Inline text rendered before the value. */
    Prefix: import("react").ForwardRefExoticComponent<NumberValuePrefixProps & import("react").RefAttributes<import("react-native").Text>>;
    /** @optional Inline text rendered after the value. */
    Suffix: import("react").ForwardRefExoticComponent<NumberValueSuffixProps & import("react").RefAttributes<import("react-native").Text>>;
};
export default NumberValue;
export { useNumberValue };
//# sourceMappingURL=number-value.d.ts.map