import type { WithSpringConfig } from 'react-native-reanimated';
import type { Animation, AnimationRoot, AnimationValue, ViewRef } from '../../helpers/internal/types';
import type { SplitViewPrimitiveBottomSectionProps, SplitViewPrimitiveDragAreaProps, SplitViewPrimitiveDragHandleProps, SplitViewPrimitiveRootProps, SplitViewPrimitiveTopSectionProps } from '../../primitives/split-view';
export type { SplitViewContextValue, SplitViewPrimitiveBottomSectionProps, SplitViewPrimitiveBottomSectionRef, SplitViewPrimitiveDragAreaProps, SplitViewPrimitiveDragAreaRef, SplitViewPrimitiveDragHandleProps, SplitViewPrimitiveDragHandleRef, SplitViewPrimitiveRootProps, SplitViewPrimitiveRootRef, SplitViewPrimitiveTopSectionProps, SplitViewPrimitiveTopSectionRef, SplitViewSnapPoint, } from '../../primitives/split-view';
export type { SplitViewPrimitiveRenderProps as SplitViewRenderProps } from '../../primitives/split-view';
/**
 * Root-level animation configuration for SplitView (snap height only).
 */
export type SplitViewRootAnimation = AnimationRoot<{
    /**
     * Spring used when snapping the top section after drag release or programmatic `snapTo`.
     *
     * @default `{ damping: 25, stiffness: 300, mass: 0.8, overshootClamping: false, restDisplacementThreshold: 0.01, restSpeedThreshold: 0.01 }`
     */
    snapSpringConfig?: WithSpringConfig;
}>;
/**
 * Scale animation for `SplitView.DragHandle` (idle vs dragging).
 */
export type SplitViewDragHandleScaleAnimation = AnimationValue<{
    /**
     * Scale values `[idle, dragging]`.
     *
     * @default [1, 1.15]
     */
    value?: [number, number];
    /**
     * Spring used when transitioning between idle and dragging scale.
     *
     * @default `{ damping: 18, stiffness: 300, mass: 0.8 }`
     */
    springConfig?: WithSpringConfig;
}>;
/**
 * Animation configuration for `SplitView.DragHandle`.
 */
export type SplitViewDragHandleAnimation = Animation<{
    scale: SplitViewDragHandleScaleAnimation;
}>;
/**
 * Props for the styled SplitView root (`animation` is resolved into primitive spring props).
 */
export type SplitViewRootProps = Omit<SplitViewPrimitiveRootProps, 'snapSpringConfig' | 'isAllAnimationsDisabled'> & {
    /**
     * Root animation configuration. Set to `"disable-all"` to disable child animations.
     */
    animation?: SplitViewRootAnimation;
    /**
     * Additional CSS classes for the root container.
     */
    className?: string;
};
/**
 * Ref type for the SplitView root.
 */
export type SplitViewRootRef = ViewRef;
/**
 * Props for the top pane.
 */
export interface SplitViewTopSectionProps extends SplitViewPrimitiveTopSectionProps {
    /**
     * Additional CSS classes for the top section.
     *
     * @note The following style properties are occupied by animations and cannot be set via className:
     * - `height` - Driven by `topSectionHeight` shared value
     */
    className?: string;
}
/**
 * Ref type for the top section.
 */
export type SplitViewTopSectionRef = ViewRef;
/**
 * Props for the bottom pane.
 */
export interface SplitViewBottomSectionProps extends SplitViewPrimitiveBottomSectionProps {
    /**
     * Additional CSS classes for the bottom section.
     */
    className?: string;
}
/**
 * Ref type for the bottom section.
 */
export type SplitViewBottomSectionRef = ViewRef;
/**
 * Props for the draggable hit area (pan gesture).
 */
export interface SplitViewDragAreaProps extends SplitViewPrimitiveDragAreaProps {
    /**
     * Additional CSS classes for the drag area.
     */
    className?: string;
}
/**
 * Ref type for the drag area.
 */
export type SplitViewDragAreaRef = ViewRef;
/**
 * Props for the visual drag handle.
 */
export interface SplitViewDragHandleProps extends SplitViewPrimitiveDragHandleProps {
    /**
     * Additional CSS classes for the drag handle.
     *
     * @note The following style properties are occupied by animations and cannot be set via className:
     * - `transform` (`scale`) - Animated while dragging
     *
     * To customize scale behavior, use the `animation` prop on `SplitView.DragHandle`.
     * To disable animated styles, set `isAnimatedStyleActive={false}`.
     */
    className?: string;
    /**
     * Animation configuration for the handle scale.
     */
    animation?: SplitViewDragHandleAnimation;
    /**
     * When `false`, animated scale styles are not applied.
     *
     * @default true
     */
    isAnimatedStyleActive?: boolean;
}
/**
 * Ref type for the drag handle.
 */
export type SplitViewDragHandleRef = ViewRef;
//# sourceMappingURL=split-view.types.d.ts.map