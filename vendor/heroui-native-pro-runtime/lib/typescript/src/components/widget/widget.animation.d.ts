import type { AnimationRootDisableAll } from '../../helpers/internal/types';
/**
 * Animation hook for the {@link Widget} root component.
 *
 * `Widget` itself renders no animated styles — it is a layout shell — but
 * it still owns the cascade for `disable-all`. The hook combines the
 * global, parent, and own animation-disabled states so the root can pass
 * `isAllAnimationsDisabled` down through `AnimationSettingsProvider` to
 * any animated descendants (e.g. a child `ProgressCircle`, `BarChart`, or
 * other `heroui-native` components placed inside `Widget.Content`).
 *
 * Priority: Global > Parent > Own.
 */
export declare function useWidgetRootAnimation(options: {
    /** Root animation prop (controls cascading disable-all behavior). */
    animation: AnimationRootDisableAll | undefined;
}): {
    isAllAnimationsDisabled: boolean;
};
//# sourceMappingURL=widget.animation.d.ts.map