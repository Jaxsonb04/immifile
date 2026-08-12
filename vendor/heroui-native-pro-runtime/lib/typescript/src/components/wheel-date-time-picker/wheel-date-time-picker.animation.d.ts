import type { WheelDateTimePickerRootAnimation } from './wheel-date-time-picker.types';
/**
 * Root animation hook for {@link WheelDateTimePicker}. The picker owns no
 * animated styles of its own — the underlying `WheelPickerGroup` runs the
 * per-item animations. This hook only resolves `isAllAnimationsDisabled` so
 * the root can cascade `disable-all` to the group (and its wheels) via
 * `AnimationSettingsProvider`.
 */
export declare function useWheelDateTimePickerRootAnimation(options: {
    /** Root `animation` prop on `WheelDateTimePicker`. */
    animation: WheelDateTimePickerRootAnimation | undefined;
}): {
    isAllAnimationsDisabled: boolean;
};
//# sourceMappingURL=wheel-date-time-picker.animation.d.ts.map