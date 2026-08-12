"use strict";

import { useCSSVariable } from 'uniwind';

/**
 * Unique brand symbol used to prevent accidental array destructuring of a
 * single theme color value returned from `useThemeColorPro`.
 */

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

/**
 * Theme colors as const array for efficient mapping
 * Ordered to match the order in src/styles/theme.css
 */
const THEME_COLORS = ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'];

/**
 * Theme colors type derived from THEME_COLORS array
 */

/**
 * Helper type to create a tuple of strings with the same length as the input array
 */

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

export function useThemeColorPro(themeColor) {
  const isArray = Array.isArray(themeColor);
  const cssVariables = isArray ? themeColor.map(color => `--color-${color}`) : [`--color-${themeColor}`];
  const resolvedColors = useCSSVariable(cssVariables);
  const processedColors = resolvedColors.map(color => {
    if (typeof color === 'string') {
      return color;
    }
    if (typeof color === 'number') {
      return String(color);
    }
    return 'invalid';
  });
  if (isArray) {
    return processedColors;
  }

  /** `cssVariables` always contains one entry when `isArray` is false, so index 0 is always defined. */
  return processedColors[0] ?? 'invalid';
}