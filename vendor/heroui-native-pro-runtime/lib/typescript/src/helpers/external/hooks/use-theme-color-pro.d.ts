/**
 * Unique brand symbol used to prevent accidental array destructuring of a
 * single theme color value returned from `useThemeColorPro`.
 */
declare const _colorValueBrand: unique symbol;
/**
 * A resolved theme color string.
 *
 * This type intentionally removes `[Symbol.iterator]` so that TypeScript
 * surfaces a `never`-typed element when the value is array-destructured,
 * making the misuse visible in the IDE immediately.
 *
 * @example
 * // ✅ Correct – single value
 * const chart1Color = useThemeColorPro('chart-1');
 *
 * @example
 * // ✅ Correct – multiple values
 * const [chart1Color, chart2Color] = useThemeColorPro(['chart-1', 'chart-2']);
 *
 * @example
 * // ❌ Wrong – destructuring a single-color result yields `never`
 * const [chart1Color] = useThemeColorPro('chart-1');
 */
export type ThemeColorValue = string & {
    readonly [_colorValueBrand]: void;
    /** Removed to prevent accidental array destructuring. */
    readonly [Symbol.iterator]: never;
};
/**
 * Theme colors as const array for efficient mapping
 * Ordered to match the order in src/styles/theme.css
 */
declare const THEME_COLORS: readonly ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"];
/**
 * Theme colors type derived from THEME_COLORS array
 */
export type ThemeColor = (typeof THEME_COLORS)[number];
/**
 * Helper type to create a tuple of strings with the same length as the input array
 */
type CreateStringTuple<N extends number, TAcc extends string[] = []> = TAcc['length'] extends N ? TAcc : CreateStringTuple<N, [...TAcc, string]>;
/**
 * Hook to retrieve theme color values from CSS variables.
 * Supports both single color and multiple colors for efficient batch retrieval.
 *
 * @param themeColor - Single theme color name or array of theme color names
 * @returns `ThemeColorValue` for a single name, or a string tuple/array for multiple names.
 *
 * @example
 * // Single color – returns `ThemeColorValue` (not destructurable)
 * const chart1Color = useThemeColorPro('chart-1');
 *
 * @example
 * // Multiple colors – returns a typed string tuple (destructurable)
 * const [chart1Color, chart2Color] = useThemeColorPro(['chart-1', 'chart-2']);
 */
export declare function useThemeColorPro(themeColor: ThemeColor): ThemeColorValue;
export declare function useThemeColorPro<T extends readonly [ThemeColor, ...ThemeColor[]]>(themeColor: T): CreateStringTuple<T['length']>;
export declare function useThemeColorPro(themeColor: ThemeColor[]): string[];
export {};
//# sourceMappingURL=use-theme-color-pro.d.ts.map