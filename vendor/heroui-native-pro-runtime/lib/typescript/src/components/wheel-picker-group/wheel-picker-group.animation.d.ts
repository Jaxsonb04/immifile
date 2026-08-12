import type { WheelPickerGroupRootAnimation } from './wheel-picker-group.types';
/**
 * Root animation hook for {@link WheelPickerGroup}. The group owns no
 * animated styles of its own — each `WheelPicker` runs its own per-item
 * animation. This hook only resolves `isAllAnimationsDisabled` so the
 * root can cascade `disable-all` to every child wheel via
 * `AnimationSettingsProvider`.
 */
export declare function useWheelPickerGroupRootAnimation(options: {
    /** Root `animation` prop on `WheelPickerGroup`. */
    animation: WheelPickerGroupRootAnimation | undefined;
}): {
    isAllAnimationsDisabled: boolean;
};
//# sourceMappingURL=wheel-picker-group.animation.d.ts.map