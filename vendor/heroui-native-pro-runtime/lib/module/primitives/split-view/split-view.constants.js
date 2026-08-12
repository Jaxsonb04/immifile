"use strict";

/**
 * Display names for SplitView primitive parts (`HeroUINative.Primitive.SplitView.*`).
 */
export const PRIMITIVE_DISPLAY_NAME = {
  ROOT: 'HeroUINative.Primitive.SplitView.Root',
  TOP_SECTION: 'HeroUINative.Primitive.SplitView.TopSection',
  DRAG_AREA: 'HeroUINative.Primitive.SplitView.DragArea',
  DRAG_HANDLE: 'HeroUINative.Primitive.SplitView.DragHandle',
  BOTTOM_SECTION: 'HeroUINative.Primitive.SplitView.BottomSection'
};

/** Default snap points as ratios of the container height (0..1). */
export const DEFAULT_SNAP_POINTS = [0.2, 0.5, 0.8];

/** Default minimum height for the top section (logical pixels). */
export const DEFAULT_MIN_HEIGHT = 100;

/**
 * Minimum height reserved for the bottom section when `maxHeight` is omitted.
 * Ensures the bottom pane remains usable after subtracting the drag area.
 */
export const DEFAULT_MIN_BOTTOM_SECTION_HEIGHT = 100;

/**
 * Fallback drag strip height (px) until `SplitView.DragArea` reports its measured height from layout.
 */
export const ESTIMATED_DRAG_AREA_HEIGHT = 24;

/** Extra touch target around the drag area (logical pixels). */
export const DRAG_AREA_HIT_SLOP = {
  top: 12,
  bottom: 12,
  left: 24,
  right: 24
};

/** Velocity threshold (px/s) for flick-based snap selection. */
export const VELOCITY_THRESHOLD = 800;

/**
 * When flicking, move at most this fraction of the snap range toward min/max.
 * Used to pick adjacent snap index on high-velocity release.
 */
export const FLICK_RATIO_THRESHOLD = 0.2;

/** Default spring configuration for snapping the top section height. */
export const DEFAULT_SNAP_SPRING_CONFIG = {
  damping: 25,
  stiffness: 300,
  mass: 0.8,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01
};

/** Default spring configuration for drag handle scale feedback. */
export const DEFAULT_HANDLE_SCALE_SPRING_CONFIG = {
  damping: 18,
  stiffness: 300,
  mass: 0.8
};

/** Default scale values for the drag handle [idle, dragging]. */
export const DEFAULT_HANDLE_SCALE_VALUE = [1, 1.15];