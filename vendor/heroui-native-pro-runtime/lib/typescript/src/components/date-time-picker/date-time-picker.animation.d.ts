import type { AnimationRootDisableAll } from '../../helpers/internal/types';
/**
 * Resolves the root `animation` prop into `isAllAnimationsDisabled` so the root
 * can cascade `"disable-all"` to animated descendants via `AnimationSettingsProvider`.
 * Owns no animated styles of its own.
 */
export declare function useDateTimePickerRootAnimation(options: {
    animation: AnimationRootDisableAll | undefined;
}): {
    isAllAnimationsDisabled: boolean;
};
//# sourceMappingURL=date-time-picker.animation.d.ts.map