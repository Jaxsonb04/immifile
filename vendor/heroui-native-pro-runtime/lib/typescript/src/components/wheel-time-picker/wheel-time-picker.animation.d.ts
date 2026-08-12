import type { WheelTimePickerRootAnimation } from './wheel-time-picker.types';
/**
 * Root animation hook for {@link WheelTimePicker}. The picker owns no
 * animated styles of its own — the underlying `WheelPickerGroup` runs the
 * per-item animations. This hook only resolves `isAllAnimationsDisabled` so
 * the root can cascade `disable-all` to the group (and its wheels) via
 * `AnimationSettingsProvider`.
 */
export declare function useWheelTimePickerRootAnimation(options: {
    /** Root `animation` prop on `WheelTimePicker`. */
    animation: WheelTimePickerRootAnimation | undefined;
}): {
    isAllAnimationsDisabled: boolean;
};
//# sourceMappingURL=wheel-time-picker.animation.d.ts.map