import type { RatingItemAnimation } from './rating.types';
/**
 * Animation hook for {@link RatingItem}.
 * Produces a subtle scale animation on press.
 *
 * Respects both the local `animation` prop (`false` / `'disabled'` to
 * disable) and the cascaded `isAllAnimationsDisabled` state from any
 * ancestor `AnimationSettingsProvider`.
 *
 * @param options.animation - Item animation configuration
 * @param options.isPressed - Whether the item is currently pressed
 * @returns `rContainerStyle` animated style to apply on the pressable
 */
export declare function useRatingItemAnimation(options: {
    animation: RatingItemAnimation | undefined;
    isPressed: boolean;
}): {
    rContainerStyle: import("react-native-reanimated/lib/typescript/hook/commonTypes").AnimatedStyleHandle<{
        transform: {
            scale: number;
        }[];
    }>;
};
//# sourceMappingURL=rating.animation.d.ts.map