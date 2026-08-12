import type { AnimationRootDisableAll } from '../../helpers/internal/types';
/**
 * Animation hook for the {@link Badge} root component.
 *
 * Combines the global, parent, and own `disable-all` animation states so the
 * root can cascade `isAllAnimationsDisabled` to children via
 * `AnimationSettingsProvider`.
 *
 * Priority: Global > Parent > Own.
 */
export declare function useBadgeRootAnimation(options: {
    /** Root animation prop (controls cascading disable-all behavior). */
    animation: AnimationRootDisableAll | undefined;
}): {
    isAllAnimationsDisabled: boolean;
};
//# sourceMappingURL=badge.animation.d.ts.map