import type { AnimationRootDisableAll } from '../../helpers/internal/types';
/**
 * Resolves the root `animation` prop into `isAllAnimationsDisabled` so the root
 * can cascade `"disable-all"` to animated descendants via `AnimationSettingsProvider`.
 * Owns no animated styles of its own.
 */
export declare function useTimePickerRootAnimation(options: {
    animation: AnimationRootDisableAll | undefined;
}): {
    isAllAnimationsDisabled: boolean;
};
//# sourceMappingURL=time-picker.animation.d.ts.map