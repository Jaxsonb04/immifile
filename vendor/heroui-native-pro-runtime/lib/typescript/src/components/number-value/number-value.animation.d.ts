import type { AnimationRootDisableAll } from '../../helpers/internal/types';
/**
 * Animation hook for the `NumberValue` root.
 *
 * `NumberValue` is a read-only display and has no intrinsic animation of its
 * own. This hook exists solely to support the `"disable-all"` capability:
 * it combines the global, parent, and own disable-all states (priority:
 * Global > Parent > Own) and returns a single `isAllAnimationsDisabled`
 * flag that `NumberValue` forwards via `AnimationSettingsProvider` so that
 * any animated descendants (e.g. composed children) can respect the
 * cascaded setting.
 *
 * @param options.animation - Root animation configuration (supports only
 * `"disable-all"` or `undefined` since the root itself has no animation).
 * @returns Object with `isAllAnimationsDisabled` — the combined cascaded
 * disabled state to be provided via `AnimationSettingsProvider`.
 */
export declare function useNumberValueRootAnimation(options: {
    animation: AnimationRootDisableAll | undefined;
}): {
    isAllAnimationsDisabled: boolean;
};
//# sourceMappingURL=number-value.animation.d.ts.map