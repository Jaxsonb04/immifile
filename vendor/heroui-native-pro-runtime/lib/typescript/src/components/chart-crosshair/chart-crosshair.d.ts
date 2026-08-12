import { View } from 'react-native';
import type { ChartCrosshairAnchorContextValue, ChartCrosshairAnchorProps, ChartCrosshairProps, ChartCrosshairValueContextValue, ChartCrosshairValueLabelProps, ChartCrosshairValueProps } from './chart-crosshair.types';
/**
 * Crosshair layout context: supplied only by {@link ChartCrosshair.Anchor}. {@link ChartCrosshair.Value}
 * consumes it via {@link useChartCrosshairAnchor} (strict).
 */
declare const useChartCrosshairAnchor: () => ChartCrosshairAnchorContextValue;
declare const useChartCrosshairValue: () => ChartCrosshairValueContextValue;
/**
 * Themed Skia vertical rule at a chart-press x-coordinate (dashed by default).
 *
 * Render inside any cartesian chart's Skia children together with {@link ChartIndicator} when
 * using `useChartPressState`.
 */
declare function ChartCrosshairSkia(props: ChartCrosshairProps): import("react/jsx-runtime").JSX.Element;
declare namespace ChartCrosshairSkia {
    var displayName: "HeroUINative.ChartCrosshair";
}
/**
 * Compound chart crosshair API:
 *
 * @component ChartCrosshair — Skia vertical rule (`Path`); render **inside** the chart canvas with
 *   `useChartPressState`-driven shared values.
 * @component ChartCrosshair.Anchor — React Native wrapper around chart + RN value overlay;
 *   supplies horizontal position, bounds, and press activity via context.
 * @component ChartCrosshair.Value — Absolutely positioned Animated overlay hosting the tooltip value;
 *   **requires** {@link ChartCrosshair.Anchor}.
 * @component ChartCrosshair.ValueLabel — Read-only animated label driven by {@link ChartCrosshair.Value}
 *   `value` prop / {@link ChartCrosshairValueContextValue}.
 */
declare const ChartCrosshair: typeof ChartCrosshairSkia & {
    Anchor: import("react").ForwardRefExoticComponent<ChartCrosshairAnchorProps & import("react").RefAttributes<View>>;
    Value: import("react").ForwardRefExoticComponent<ChartCrosshairValueProps & import("react").RefAttributes<never>>;
    ValueLabel: import("react").ForwardRefExoticComponent<ChartCrosshairValueLabelProps & import("react").RefAttributes<import("react-native").TextInput>>;
};
export default ChartCrosshair;
export { useChartCrosshairAnchor, useChartCrosshairValue };
//# sourceMappingURL=chart-crosshair.d.ts.map