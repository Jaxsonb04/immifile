import { View } from 'react-native';
import type { ChartTooltipAnchorContextValue, ChartTooltipAnchorProps, ChartTooltipHeaderProps, ChartTooltipIndicatorProps, ChartTooltipItemProps, ChartTooltipLabelProps, ChartTooltipRootProps, ChartTooltipValueProps } from './chart-tooltip.types';
declare const useChartTooltipAnchor: () => ChartTooltipAnchorContextValue;
/**
 * Compound chart tooltip API:
 *
 * @component ChartTooltip — Floating card for multi-series press labels; **requires**
 *   {@link ChartTooltip.Anchor}.
 * @component ChartTooltip.Anchor — Relative wrapper supplying press coordinates, active index,
 *   and plot bounds.
 * @component ChartTooltip.Header — Optional title row (typically the X-axis category).
 * @component ChartTooltip.Item — One series row (indicator + label + value).
 * @component ChartTooltip.Indicator — Color swatch beside a series name.
 * @component ChartTooltip.Label — Series name within an item row.
 * @component ChartTooltip.Value — Formatted value within an item row.
 */
declare const ChartTooltip: import("react").ForwardRefExoticComponent<ChartTooltipRootProps & import("react").RefAttributes<never>> & {
    Anchor: import("react").ForwardRefExoticComponent<ChartTooltipAnchorProps & import("react").RefAttributes<View>>;
    Header: import("react").ForwardRefExoticComponent<ChartTooltipHeaderProps & import("react").RefAttributes<import("react-native").Text>>;
    Indicator: import("react").ForwardRefExoticComponent<ChartTooltipIndicatorProps & import("react").RefAttributes<View>>;
    Item: import("react").ForwardRefExoticComponent<ChartTooltipItemProps & import("react").RefAttributes<View>>;
    Label: import("react").ForwardRefExoticComponent<ChartTooltipLabelProps & import("react").RefAttributes<import("react-native").Text>>;
    Value: import("react").ForwardRefExoticComponent<ChartTooltipValueProps & import("react").RefAttributes<import("react-native").Text>>;
};
export default ChartTooltip;
export { useChartTooltipAnchor };
//# sourceMappingURL=chart-tooltip.d.ts.map