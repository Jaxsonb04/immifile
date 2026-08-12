import { type SharedValue } from 'react-native-reanimated';
import type { WheelPickerResolvedAnimationConfig, WheelPickerRootAnimation } from './wheel-picker.types';
/**
 * Root animation hook for {@link WheelPicker}.
 *
 * Owns the shared `scrollY` value driven by the FlatList scroll handler,
 * resolves the per-item opacity / scale interpolation config, and emits
 * JS-side callbacks via `scheduleOnRN` from `react-native-worklets`:
 *
 * - `onIndexChange` fires every time the snapped row index changes during
 *   a scroll session (live SwiftUI-style commit).
 * - `onScrollingChange(true)` fires on drag begin, `(false)` fires on
 *   momentum end (or drag end when no momentum follows).
 *
 * Returns the cascade flag (`isAllAnimationsDisabled`) so the component
 * can pipe it through `AnimationSettingsProvider`, plus the per-item
 * disabled flag (`isItemAnimationDisabled`) and resolved animation config
 * consumed by {@link useWheelPickerItemAnimation}.
 */
export declare function useWheelPickerRootAnimation(options: {
    /** Root `animation` prop. */
    animation: WheelPickerRootAnimation | undefined;
    /** Pixel height of one row. */
    itemHeight: number;
    /** Largest valid index (`items.length - 1`). */
    maxIndex: number;
    /** Initial selected index used to seed `scrollY` on first mount. */
    initialIndex: number;
    /** JS-side callback fired when the snapped row index changes. */
    onIndexChange: (index: number) => void;
    /** JS-side callback fired when the wheel starts / stops scrolling. */
    onScrollingChange: (isScrolling: boolean) => void;
}): {
    isAllAnimationsDisabled: boolean;
    isItemAnimationDisabled: boolean;
    resolvedAnimation: WheelPickerResolvedAnimationConfig;
    scrollY: SharedValue<number>;
    scrollHandler: import("react-native-reanimated").ScrollHandlerProcessed<Record<string, unknown>>;
};
/**
 * Per-item animation hook for {@link WheelPicker}.
 *
 * Reads the per-row `absDistance` derived value (exposed via
 * `useWheelPickerItem`) and interpolates opacity + scale against it.
 * When `isItemAnimationDisabled` is `true`, returns an identity style.
 */
export declare function useWheelPickerItemAnimation(options: {
    /** Per-row distance derived value (from `useWheelPickerItem`). */
    absDistance: SharedValue<number>;
    /** Resolved opacity / scale ranges from the root hook. */
    resolvedAnimation: WheelPickerResolvedAnimationConfig;
    /** Combined disabled flag (own + cascade) from the root hook. */
    isItemAnimationDisabled: boolean;
}): {
    rItemStyle: import("react-native-reanimated/lib/typescript/hook/commonTypes").AnimatedStyleHandle<{
        opacity: number;
        transform: {
            scale: number;
        }[];
    }>;
};
/**
 * Per-item label animation hook for {@link WheelPicker}.
 *
 * Interpolates the label's text color between
 * `resolvedAnimation.labelColor[0]` (edge) and
 * `resolvedAnimation.labelColor[1]` (center) using `interpolateColor`
 * driven by the per-row `absDistance` derived value.
 *
 * When `isItemAnimationDisabled` is `true`, returns an empty style so
 * the label keeps its own `className` / `style` color.
 */
export declare function useWheelPickerItemLabelAnimation(options: {
    /** Per-row distance derived value (from `useWheelPickerItem`). */
    absDistance: SharedValue<number>;
    /** Resolved animation config from the root hook. */
    resolvedAnimation: WheelPickerResolvedAnimationConfig;
    /** Combined disabled flag (own + cascade) from the root hook. */
    isItemAnimationDisabled: boolean;
}): {
    rLabelStyle: import("react-native-reanimated/lib/typescript/hook/commonTypes").AnimatedStyleHandle<{
        color?: undefined;
    } | {
        color: string;
    }>;
};
//# sourceMappingURL=wheel-picker.animation.d.ts.map