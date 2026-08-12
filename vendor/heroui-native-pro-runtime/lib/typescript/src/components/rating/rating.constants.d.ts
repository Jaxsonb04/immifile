import type { RatingSize } from './rating.types';
/**
 * Display name constants for the Rating compound component parts.
 */
export declare const DISPLAY_NAME: {
    readonly ROOT: "HeroUINative.Rating.Root";
    readonly ITEM: "HeroUINative.Rating.Item";
};
/** Default size when the `size` prop is not provided. */
export declare const DEFAULT_SIZE: RatingSize;
/** Default maximum rating value when `maxValue` is not provided. */
export declare const DEFAULT_MAX_VALUE = 5;
/**
 * Maps a {@link RatingSize} to the intrinsic icon size (in pixels). The
 * size is forwarded to the icon element so the default star — and any
 * custom icon that honours `size` — scales with the rating variant.
 */
export declare const ICON_SIZE_MAP: Record<RatingSize, number>;
/**
 * Hit slop around each item pressable, by size. Keeps small ratings
 * comfortably tappable without visibly enlarging the touch target.
 */
export declare const HIT_SLOP_MAP: Record<RatingSize, number>;
//# sourceMappingURL=rating.constants.d.ts.map