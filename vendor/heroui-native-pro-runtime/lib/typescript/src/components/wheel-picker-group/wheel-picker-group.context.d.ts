import type { WheelPickerGroupContextValue } from './wheel-picker-group.types';
/**
 * Internal context shared between {@link WheelPickerGroup} and its child
 * `WheelPicker` instances. Intentionally non-strict (defaults to `null`)
 * because a standalone `<WheelPicker />` outside a group is the primary
 * use case — the optional consumer hook returns `null` instead of
 * throwing.
 */
export declare const WheelPickerGroupContext: import("react").Context<WheelPickerGroupContextValue | null>;
/**
 * Strict consumer hook for {@link WheelPickerGroup} compound parts. Throws
 * when called outside a group provider.
 */
export declare function useWheelPickerGroup(): WheelPickerGroupContextValue;
/**
 * Optional consumer hook used by `WheelPicker` to detect whether it is
 * being rendered inside a {@link WheelPickerGroup}. Returns `null` when
 * no group is present.
 */
export declare function useOptionalWheelPickerGroup(): WheelPickerGroupContextValue | null;
//# sourceMappingURL=wheel-picker-group.context.d.ts.map