import { View } from 'react-native';
import { useWheelPickerGroup } from './wheel-picker-group.context';
import type { WheelPickerGroupIndicatorProps, WheelPickerGroupMaskProps, WheelPickerGroupRootProps } from './wheel-picker-group.types';
/**
 * Compound `WheelPickerGroup` component for coordinating multiple
 * `WheelPicker` instances (e.g. a date picker with year / month / day).
 *
 * @component WheelPickerGroup - Root container managing a shared
 * controllable `values` record. Provides `itemHeight`, `visibleCount`,
 * value getters/setters, and scroll coordination to child wheels via
 * context. Cascades `animation="disable-all"` to all children.
 *
 * @component WheelPickerGroup.Indicator - Optional shared selection band
 * spanning every wheel at the center of the group viewport. Replaces the
 * per-wheel indicator when a child `WheelPicker` is nested in the group.
 *
 * @component WheelPickerGroup.Mask - Optional top / bottom fade overlays
 * that span the full group viewport.
 *
 * Children opt into the group by setting a `name` prop on each
 * `WheelPicker`. Wheels without a name still render but operate
 * independently. Wheels nested in a group automatically receive
 * `flex-1` so they distribute the row evenly; pass an explicit width
 * via `className` to override.
 *
 */
declare const WheelPickerGroup: import("react").ForwardRefExoticComponent<WheelPickerGroupRootProps & import("react").RefAttributes<View>> & {
    /** @optional Shared selection band spanning every wheel */
    Indicator: import("react").ForwardRefExoticComponent<WheelPickerGroupIndicatorProps & import("react").RefAttributes<View>>;
    /** @optional Shared top / bottom fade overlays */
    Mask: import("react").ForwardRefExoticComponent<WheelPickerGroupMaskProps & import("react").RefAttributes<View>>;
};
export default WheelPickerGroup;
export { useWheelPickerGroup };
//# sourceMappingURL=wheel-picker-group.d.ts.map