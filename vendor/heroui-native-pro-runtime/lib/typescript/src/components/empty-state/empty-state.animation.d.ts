import type { AnimationRootDisableAll } from '../../helpers/internal/types';
/**
 * Animation hook for the {@link EmptyState} root component.
 *
 * EmptyState does not animate its own styles, but it still owns the
 * `disable-all` cascade for animated descendants rendered inside it.
 */
export declare function useEmptyStateRootAnimation(options: {
    animation: AnimationRootDisableAll | undefined;
}): {
    isAllAnimationsDisabled: boolean;
};
//# sourceMappingURL=empty-state.animation.d.ts.map