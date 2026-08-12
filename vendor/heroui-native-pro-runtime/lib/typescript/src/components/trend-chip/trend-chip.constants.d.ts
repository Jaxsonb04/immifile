import type { ChipColor } from 'heroui-native/chip';
import type { TrendChipSize, TrendChipVariant, TrendDirection } from './trend-chip.types';
/**
 * Display name constants for the TrendChip compound component parts.
 */
export declare const DISPLAY_NAME: {
    readonly ROOT: "HeroUINative.TrendChip.Root";
    readonly INDICATOR: "HeroUINative.TrendChip.Indicator";
    readonly VALUE: "HeroUINative.TrendChip.Value";
    readonly PREFIX: "HeroUINative.TrendChip.Prefix";
    readonly SUFFIX: "HeroUINative.TrendChip.Suffix";
};
/** Default trend direction when the `trend` prop is not provided. */
export declare const DEFAULT_TREND: TrendDirection;
/** Default visual variant when the `variant` prop is not provided. */
export declare const DEFAULT_VARIANT: TrendChipVariant;
/** Default size when the `size` prop is not provided. */
export declare const DEFAULT_SIZE: TrendChipSize;
/**
 * Maps a {@link TrendDirection} to the semantic `Chip` color that visually
 * communicates the trend (up -> success, neutral -> warning, down -> danger).
 */
export declare const TREND_TO_CHIP_COLOR_MAP: Record<TrendDirection, ChipColor>;
/**
 * Maps a {@link TrendChipSize} to the indicator icon size (in pixels).
 * Matches the `data-[size=*]` width/height classes defined on the indicator
 * wrapper in `trend-chip.styles.ts` so the SVG renders inside its wrapper
 * without overflow or inner whitespace.
 */
export declare const INDICATOR_SIZE_MAP: Record<TrendChipSize, number>;
//# sourceMappingURL=trend-chip.constants.d.ts.map