/**
 * Display names for SplitView primitive parts (`HeroUINative.Primitive.SplitView.*`).
 */
export declare const PRIMITIVE_DISPLAY_NAME: {
    readonly ROOT: "HeroUINative.Primitive.SplitView.Root";
    readonly TOP_SECTION: "HeroUINative.Primitive.SplitView.TopSection";
    readonly DRAG_AREA: "HeroUINative.Primitive.SplitView.DragArea";
    readonly DRAG_HANDLE: "HeroUINative.Primitive.SplitView.DragHandle";
    readonly BOTTOM_SECTION: "HeroUINative.Primitive.SplitView.BottomSection";
};
/** Default snap points as ratios of the container height (0..1). */
export declare const DEFAULT_SNAP_POINTS: readonly [0.2, 0.5, 0.8];
/** Default minimum height for the top section (logical pixels). */
export declare const DEFAULT_MIN_HEIGHT = 100;
/**
 * Minimum height reserved for the bottom section when `maxHeight` is omitted.
 * Ensures the bottom pane remains usable after subtracting the drag area.
 */
export declare const DEFAULT_MIN_BOTTOM_SECTION_HEIGHT = 100;
/**
 * Fallback drag strip height (px) until `SplitView.DragArea` reports its measured height from layout.
 */
export declare const ESTIMATED_DRAG_AREA_HEIGHT = 24;
/** Extra touch target around the drag area (logical pixels). */
export declare const DRAG_AREA_HIT_SLOP: {
    top: number;
    bottom: number;
    left: number;
    right: number;
};
/** Velocity threshold (px/s) for flick-based snap selection. */
export declare const VELOCITY_THRESHOLD = 800;
/**
 * When flicking, move at most this fraction of the snap range toward min/max.
 * Used to pick adjacent snap index on high-velocity release.
 */
export declare const FLICK_RATIO_THRESHOLD = 0.2;
/** Default spring configuration for snapping the top section height. */
export declare const DEFAULT_SNAP_SPRING_CONFIG: {
    readonly damping: 25;
    readonly stiffness: 300;
    readonly mass: 0.8;
    readonly overshootClamping: false;
    readonly restDisplacementThreshold: 0.01;
    readonly restSpeedThreshold: 0.01;
};
/** Default spring configuration for drag handle scale feedback. */
export declare const DEFAULT_HANDLE_SCALE_SPRING_CONFIG: {
    readonly damping: 18;
    readonly stiffness: 300;
    readonly mass: 0.8;
};
/** Default scale values for the drag handle [idle, dragging]. */
export declare const DEFAULT_HANDLE_SCALE_VALUE: [number, number];
//# sourceMappingURL=split-view.constants.d.ts.map