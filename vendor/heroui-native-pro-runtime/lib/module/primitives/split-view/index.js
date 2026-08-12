"use strict";

export { BottomSection, DragArea, DragHandle, Root, TopSection, useSplitView, useSplitViewInternal } from "./split-view.js";
export { DEFAULT_HANDLE_SCALE_SPRING_CONFIG, DEFAULT_HANDLE_SCALE_VALUE, DEFAULT_MIN_BOTTOM_SECTION_HEIGHT, DEFAULT_MIN_HEIGHT, DEFAULT_SNAP_POINTS, DEFAULT_SNAP_SPRING_CONFIG, DRAG_AREA_HIT_SLOP, ESTIMATED_DRAG_AREA_HEIGHT, FLICK_RATIO_THRESHOLD, PRIMITIVE_DISPLAY_NAME, VELOCITY_THRESHOLD } from "./split-view.constants.js";
export { findNearestSnapIndex, pickFlickSnapIndex, resolveMaxHeight, resolveSnapPoint, resolveSnapPoints } from "./split-view.utils.js";