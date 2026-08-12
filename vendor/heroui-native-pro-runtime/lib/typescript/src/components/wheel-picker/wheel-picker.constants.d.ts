/**
 * Display name constants for the WheelPicker compound component parts.
 */
export declare const DISPLAY_NAME: {
    readonly ROOT: "HeroUINative.WheelPicker.Root";
    readonly ITEM: "HeroUINative.WheelPicker.Item";
    readonly ITEM_LABEL: "HeroUINative.WheelPicker.ItemLabel";
    readonly INDICATOR: "HeroUINative.WheelPicker.Indicator";
    readonly MASK: "HeroUINative.WheelPicker.Mask";
};
/**
 * Default pixel height of a single wheel row. Tuned so a 5-row viewport
 * lands at 220px, matching the iOS/SwiftUI feel.
 */
export declare const DEFAULT_ITEM_HEIGHT = 44;
/**
 * Default number of visible rows. Must be odd so a single row sits
 * centered on the selection indicator.
 */
export declare const DEFAULT_VISIBLE_COUNT = 5;
/**
 * Default `[edge, center]` opacity tuple. Edge rows fade to 50% of center.
 */
export declare const DEFAULT_OPACITY_RANGE: readonly [number, number];
/**
 * Default `[edge, center]` scale tuple. Edge rows shrink to 85% of center.
 */
export declare const DEFAULT_SCALE_RANGE: readonly [number, number];
/**
 * Scroll velocity (in pixels per millisecond) above which the JS
 * `onValueChange` commits are throttled. `1.5 px/ms ≈ 1500 px/s` — a
 * firm flick. Slow scrolls (below the threshold) keep their per-row
 * instant feedback.
 */
export declare const FAST_SCROLL_VELOCITY_THRESHOLD_PX_PER_MS = 1.5;
/**
 * Maximum JS commit rate (~20 Hz) when the scroll is faster than
 * {@link FAST_SCROLL_VELOCITY_THRESHOLD_PX_PER_MS}. Final value is
 * always emitted at scroll end so the throttle never drops the last
 * selection.
 */
export declare const FAST_SCROLL_EMIT_THROTTLE_MS = 50;
//# sourceMappingURL=wheel-picker.constants.d.ts.map