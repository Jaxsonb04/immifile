import type { SharedValue, WithSpringConfig } from 'react-native-reanimated';
import type { SlottableViewProps, ViewRef } from '../../helpers/internal/types';
/**
 * A single snap point: values in `[0, 1]` are ratios of the container height; values above `1` are px.
 */
export type SplitViewSnapPoint = number;
/**
 * Public context for `useSplitView`: layout state and controls consumers need.
 */
export interface SplitViewContextValue {
    /** Animated height of the top section (px). */
    topSectionHeight: SharedValue<number>;
    /** True while the user is dragging the divider. */
    isDragging: SharedValue<boolean>;
    /** Measured container height (px). */
    containerHeight: SharedValue<number>;
    /** Current snap index into `resolvedSnapPoints`. */
    snapIndex: number;
    /** Snap heights in px, clamped and sorted. */
    resolvedSnapPoints: readonly number[];
    /** Minimum allowed top section height (px). */
    minPx: number;
    /** Maximum allowed top section height (px). */
    maxPx: number;
    /** Updates the active snap index and animates to the corresponding height. */
    setSnapIndex: (index: number) => void;
    /** Snaps to a snap index with optional animation skip. */
    snapTo: (index: number, options?: {
        disableAnimation?: boolean;
    }) => void;
    /** Original `snapPoints` prop (ratios or px). */
    snapPoints: readonly number[];
}
/**
 * Internal context for primitive implementation (gestures, layout drivers). Not exposed via `useSplitView`.
 */
export interface SplitViewInternalContextValue {
    /** Spring config for snapping the top section height. */
    snapSpringConfig: WithSpringConfig;
    /** Whether all animations are disabled (cascading). */
    isAllAnimationsDisabled: boolean;
    /**
     * Applies a height to the top section, optionally with spring physics.
     *
     * @internal Used by drag gestures and accessibility actions.
     */
    applySnapHeight: (height: number, index: number, useSpringAnimation: boolean) => void;
    /** @internal Tracks drag on the JS thread for layout reconciliation. */
    setDragging: (isDragging: boolean) => void;
    /** @internal Optional snap callback from root props. */
    onSnap: ((snapIndex: number, topHeightPx: number) => void) | undefined;
    /**
     * @internal `DragArea` reports its measured height; `null` clears and falls back to the estimate.
     */
    reportDragAreaHeight: (height: number | null) => void;
}
/**
 * Render props for `SplitView` root when `children` is a function.
 */
export type SplitViewPrimitiveRenderProps = Pick<SplitViewContextValue, 'topSectionHeight' | 'isDragging' | 'containerHeight' | 'snapIndex' | 'resolvedSnapPoints' | 'minPx' | 'maxPx'>;
/**
 * Props for the SplitView primitive root (layout, snaps, resolved animation drivers).
 */
export interface SplitViewPrimitiveRootProps extends Omit<SlottableViewProps, 'children'> {
    /**
     * Snap points as ratios (`0`..`1`) of container height or absolute px (`value > 1`).
     *
     * @default [0.2, 0.45, 0.8]
     */
    snapPoints?: readonly number[];
    /**
     * Minimum height of the top section as px or ratio (`0`..`1`).
     *
     * @default 100
     */
    minHeight?: number;
    /**
     * Maximum height of the top section. Non-negative: px or ratio `0`..`1` of the container (then
     * capped by layout). Negative: `maxHeight` in `(-1, 0)` is `(1 + maxHeight) * containerHeight`
     * (e.g. `-0.1` → `0.9` of container height); `maxHeight <= -1` is a px offset from the layout
     * maximum (e.g. `-50` → that maximum minus 50px). When omitted, the default max also keeps a
     * minimum bottom pane (see implementation).
     */
    maxHeight?: number;
    /**
     * Default snap index for uncontrolled usage.
     *
     * @default 1
     */
    defaultSnapIndex?: number;
    /**
     * When `true`, the first snap applied after the initial layout is set instantly
     * (no spring), so the divider appears already positioned at its starting snap
     * point instead of animating into place on mount or screen focus. Subsequent
     * snaps and drags animate as usual. Set to `false` to animate the divider into
     * place on first render.
     *
     * @default true
     */
    skipInitialAnimation?: boolean;
    /**
     * Controlled snap index.
     */
    snapIndex?: number;
    /**
     * Called when the snap index changes (drag end or accessibility).
     */
    onSnapIndexChange?: (index: number) => void;
    /**
     * Called after a snap completes with the resolved index and top height in px.
     */
    onSnap?: (snapIndex: number, topHeightPx: number) => void;
    /**
     * Child elements or render function with split state.
     */
    children?: React.ReactNode | ((props: SplitViewPrimitiveRenderProps) => React.ReactNode);
    /**
     * Resolved spring configuration for snapping (provided by styled root or tests).
     */
    snapSpringConfig: WithSpringConfig;
    /**
     * Whether all animations are disabled for this subtree.
     */
    isAllAnimationsDisabled: boolean;
}
export type SplitViewPrimitiveRootRef = ViewRef;
/** Top pane: animated height from context. */
export type SplitViewPrimitiveTopSectionProps = SlottableViewProps;
export type SplitViewPrimitiveTopSectionRef = ViewRef;
/** Bottom pane. */
export type SplitViewPrimitiveBottomSectionProps = SlottableViewProps;
export type SplitViewPrimitiveBottomSectionRef = ViewRef;
/** Draggable hit region (pan gesture). */
export type SplitViewPrimitiveDragAreaProps = SlottableViewProps;
export type SplitViewPrimitiveDragAreaRef = ViewRef;
/** Visual handle (typically inside `DragArea`). */
export type SplitViewPrimitiveDragHandleProps = SlottableViewProps;
export type SplitViewPrimitiveDragHandleRef = ViewRef;
//# sourceMappingURL=split-view.types.d.ts.map