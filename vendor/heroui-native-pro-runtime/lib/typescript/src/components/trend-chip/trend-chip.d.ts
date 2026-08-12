import { View } from 'react-native';
import type { TrendChipContextValue, TrendChipIndicatorProps, TrendChipPrefixProps, TrendChipRootProps, TrendChipSuffixProps, TrendChipValueProps } from './trend-chip.types';
declare const useTrendChip: () => TrendChipContextValue;
/**
 * Compound `TrendChip` component with sub-components.
 *
 * @component TrendChip - Semantic trend indicator pill built on top of
 * `heroui-native`'s `Chip`. The `trend` prop drives both the default arrow
 * direction and the underlying chip color (`up` -> success, `neutral` ->
 * warning, `down` -> danger). When plain text/number children are provided,
 * they are automatically wrapped in the default indicator + value layout.
 *
 * @component TrendChip.Indicator - Renders the default trend arrow. Pass a
 * custom SVG child to replace the arrow while inheriting sizing and color
 * from the chip context.
 *
 * @component TrendChip.Value - Numeric content of the chip, rendered with
 * tabular figures so values align vertically across chips.
 *
 * @component TrendChip.Prefix - Optional inline text placed before the
 * numeric value (e.g. `$`, `+`).
 *
 * @component TrendChip.Suffix - Optional inline text placed after the numeric
 * value (e.g. `%`, `vs last month`). Rendered with a muted color by default.
 *
 * Props flow from `TrendChip` to its sub-components via context
 * (`size`, `trend`, `variant`).
 *
 */
declare const TrendChip: import("react").ForwardRefExoticComponent<TrendChipRootProps & import("react").RefAttributes<View>> & {
    /** Default trend arrow — accepts a custom SVG child to override. */
    Indicator: import("react").ForwardRefExoticComponent<TrendChipIndicatorProps & import("react").RefAttributes<View>>;
    /** Numeric value rendered with tabular figures. */
    Value: import("react").ForwardRefExoticComponent<TrendChipValueProps & import("react").RefAttributes<import("react-native").Text>>;
    /** Inline text rendered before the numeric value. */
    Prefix: import("react").ForwardRefExoticComponent<TrendChipPrefixProps & import("react").RefAttributes<import("react-native").Text>>;
    /** Inline text rendered after the numeric value. */
    Suffix: import("react").ForwardRefExoticComponent<TrendChipSuffixProps & import("react").RefAttributes<import("react-native").Text>>;
};
export default TrendChip;
export { useTrendChip };
//# sourceMappingURL=trend-chip.d.ts.map