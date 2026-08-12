import type { ReactNode } from 'react';
import type { StyleProp, TextProps, TextStyle, ViewProps, ViewStyle } from 'react-native';
import type { ClassValue } from 'tailwind-variants';
import type { AnimationRootDisableAll, ElementSlots, TextRef, ViewRef } from '../../helpers/internal/types';
import type { RootSlots } from './number-value.styles';
/**
 * Render-function signature for {@link NumberValueRootProps.children}.
 *
 * The function receives the locale-formatted numeric string and is fully
 * responsible for the resulting layout. No wrapping container is rendered
 * when this signature is used.
 */
export type NumberValueRenderFn = (formatted: string) => ReactNode;
/**
 * Per-slot inline styles for the {@link NumberValue} root.
 *
 * The `container` slot renders as a `View` and accepts a `ViewStyle`.
 * The `value` slot renders as a `Text` and accepts a `TextStyle`.
 */
export interface NumberValueRootStyles {
    /** Style applied to the outer `View` container. */
    container?: ViewStyle;
    /** Style applied to the inner value `Text`. */
    value?: TextStyle;
}
/**
 * Props for the {@link NumberValue} root component.
 *
 * Renders a locale-aware formatted number built on top of
 * `@internationalized/number`. The root is a `View` laid out in a row so
 * the consumer can compose inline content around the value using
 * {@link NumberValuePrefix}, {@link NumberValueValue}, and
 * {@link NumberValueSuffix}. When no children are provided, the root
 * auto-renders a {@link NumberValueValue} displaying the formatted value.
 * A render-function `children` is also supported for fully custom
 * rendering — it receives the formatted string and no wrapping container
 * is rendered.
 */
export interface NumberValueRootProps extends Omit<ViewProps, 'children'> {
    /**
     * The numeric value to format.
     */
    value: number;
    /**
     * Content of the number value. Supports three usage patterns:
     * - `undefined`: the root auto-renders the formatted value.
     * - `ReactNode`: compose your layout with {@link NumberValue.Value},
     *   {@link NumberValue.Prefix}, and {@link NumberValue.Suffix}.
     * - `(formatted: string) => ReactNode`: render-function form; you receive
     *   the formatted string and fully control the rendered output.
     */
    children?: ReactNode | NumberValueRenderFn;
    /**
     * Format options passed directly to
     * `@internationalized/number#NumberFormatter`. When provided, overrides
     * all individual convenience props (`numberStyle`, `currency`,
     * `notation`, `signDisplay`, `unit`, `minimumFractionDigits`,
     * `maximumFractionDigits`).
     */
    formatOptions?: Intl.NumberFormatOptions;
    /**
     * BCP-47 locale identifier. When omitted, the device locale is used.
     */
    locale?: string;
    /**
     * Formatting style.
     *
     * @default 'decimal'
     */
    numberStyle?: 'currency' | 'decimal' | 'percent' | 'unit';
    /**
     * Currency code (e.g. `"USD"`, `"EUR"`). Required when `numberStyle` is
     * `"currency"`.
     */
    currency?: string;
    /**
     * Unit identifier (e.g. `"degree"`, `"celsius"`). Required when
     * `numberStyle` is `"unit"`.
     */
    unit?: string;
    /**
     * Notation style.
     *
     * @default 'standard'
     */
    notation?: 'compact' | 'engineering' | 'scientific' | 'standard';
    /**
     * Controls when the sign is displayed.
     */
    signDisplay?: 'always' | 'auto' | 'exceptZero' | 'never';
    /**
     * Minimum number of fraction digits.
     */
    minimumFractionDigits?: number;
    /**
     * Maximum number of fraction digits.
     */
    maximumFractionDigits?: number;
    /**
     * Additional CSS classes applied to the root `View` container.
     */
    className?: string;
    /**
     * Additional CSS classes for the root slots.
     *
     * - `container`: the outer `View`.
     * - `value`: the inner value `Text`.
     */
    classNames?: ElementSlots<RootSlots>;
    /**
     * Inline styles for the root slots.
     */
    styles?: NumberValueRootStyles;
    /**
     * Animation configuration for the `NumberValue` root.
     *
     * `NumberValue` is a read-only display and has no intrinsic animation of
     * its own. The `animation` prop exists only to cascade the
     * `"disable-all"` setting to animated descendants composed inside the
     * value (if any):
     *
     * - `"disable-all"`: Disable all animations for any animated descendants
     *   rendered inside `NumberValue` (cascades via
     *   `AnimationSettingsProvider`).
     * - `undefined`: Inherit the animation settings from the parent / global
     *   context.
     */
    animation?: AnimationRootDisableAll;
}
/**
 * Imperative ref type for the {@link NumberValue} root.
 */
export type NumberValueRootRef = ViewRef;
/**
 * Props for the {@link NumberValueValue} compound part.
 *
 * Renders the locale-formatted numeric string read from the nearest
 * {@link NumberValue} root context. The `value` slot class from the root
 * is applied automatically so consumer-placed values match the
 * auto-rendered default.
 */
export interface NumberValueValueProps extends TextProps {
    /**
     * Additional CSS classes applied to the value `Text`.
     */
    className?: string;
}
/**
 * Imperative ref type for the {@link NumberValueValue} compound part.
 */
export type NumberValueValueRef = TextRef;
/**
 * Props for the {@link NumberValuePrefix} compound part.
 *
 * Inline text placed before the formatted value (e.g. a unit symbol or a
 * leading label). Rendered as a sibling `Text` inside the root `View`.
 */
export interface NumberValuePrefixProps extends TextProps {
    /**
     * Additional CSS classes applied to the prefix `Text`.
     */
    className?: string;
}
/**
 * Imperative ref type for the {@link NumberValuePrefix} compound part.
 */
export type NumberValuePrefixRef = TextRef;
/**
 * Props for the {@link NumberValueSuffix} compound part.
 *
 * Inline text placed after the formatted value (e.g. a unit symbol or a
 * trailing label). Rendered as a sibling `Text` inside the root `View`.
 */
export interface NumberValueSuffixProps extends TextProps {
    /**
     * Additional CSS classes applied to the suffix `Text`.
     */
    className?: string;
}
/**
 * Imperative ref type for the {@link NumberValueSuffix} compound part.
 */
export type NumberValueSuffixRef = TextRef;
/**
 * Value shared between the {@link NumberValue} root and its compound parts
 * through context.
 */
export interface NumberValueContextValue {
    /** Locale-formatted representation of `value`. */
    formatted: string;
    /**
     * Class names applied to the root's `value` slot. Forwarded so that a
     * consumer-placed {@link NumberValueValue} matches the styling of the
     * auto-rendered default.
     */
    valueClassName?: Exclude<ClassValue, 0n>;
    /**
     * Inline style applied to the root's `value` slot. Forwarded so that a
     * consumer-placed {@link NumberValueValue} matches the styling of the
     * auto-rendered default.
     */
    valueStyle?: StyleProp<TextStyle>;
}
//# sourceMappingURL=number-value.types.d.ts.map