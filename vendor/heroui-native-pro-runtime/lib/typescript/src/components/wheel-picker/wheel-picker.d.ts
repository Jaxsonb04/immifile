import { type ReactElement } from 'react';
import { View } from 'react-native';
import type { WheelPickerContextValue, WheelPickerIndicatorProps, WheelPickerItemLabelProps, WheelPickerItemProps, WheelPickerItemRenderProps, WheelPickerMaskProps, WheelPickerRootProps, WheelPickerRootRef } from './wheel-picker.types';
declare const useWheelPicker: () => WheelPickerContextValue;
export { useWheelPicker };
declare const useWheelPickerItem: () => WheelPickerItemRenderProps<unknown>;
export { useWheelPickerItem };
/**
 * Compound `WheelPicker` component with sub-components.
 *
 * @component WheelPicker - Root container. Owns the controllable `value`,
 * the shared `scrollY` (UI thread), and the data-driven `Animated.FlatList`
 * that powers the wheel. Provides per-item animation context to children.
 *
 * @component WheelPicker.Item - Animated row container. Rendered
 * automatically by the default `renderItem`; reuse it inside a custom
 * `renderItem` to keep sizing and tap-to-focus. When no `children` are
 * passed, it auto-renders `WheelPicker.ItemLabel`.
 *
 * @component WheelPicker.ItemLabel - Default label primitive. Used by
 * `WheelPicker.Item`'s auto fallback and exposed for reuse inside custom
 * row content.
 *
 * @component WheelPicker.Indicator - Optional selection band rendered
 * absolutely at the center of the viewport. When the root has no compound
 * children, an indicator is rendered by default.
 *
 * @component WheelPicker.Mask - Optional top/bottom fade overlays that
 * soften the wheel into the surrounding background.
 *
 * Props flow from `WheelPicker` to its sub-components via
 * `WheelPickerContext` (`itemHeight`, `visibleCount`, `scrollY`,
 * animation config, disabled state, and `classNames` / `styles`
 * cascade).
 *
 */
declare const WheelPicker: (<T>(props: WheelPickerRootProps<T> & {
    ref?: React.Ref<WheelPickerRootRef>;
}) => ReactElement | null) & {
    /** @optional Animated row container; renders default label when no children */
    Item: import("react").ForwardRefExoticComponent<WheelPickerItemProps & import("react").RefAttributes<View>>;
    /** @optional Label primitive reused by a custom `renderItem` */
    ItemLabel: import("react").ForwardRefExoticComponent<WheelPickerItemLabelProps & import("react").RefAttributes<import("react-native").Text>>;
    /** @optional Selection band at the center of the wheel viewport */
    Indicator: import("react").ForwardRefExoticComponent<WheelPickerIndicatorProps & import("react").RefAttributes<View>>;
    /** @optional Top / bottom fade overlays */
    Mask: import("react").ForwardRefExoticComponent<WheelPickerMaskProps & import("react").RefAttributes<View>>;
};
export default WheelPicker;
//# sourceMappingURL=wheel-picker.d.ts.map