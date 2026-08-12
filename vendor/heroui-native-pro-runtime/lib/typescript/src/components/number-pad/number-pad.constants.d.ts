import type { NumberPadDefaultLayoutItem } from './number-pad.types';
/**
 * Display name constants for the NumberPad compound component parts.
 */
export declare const DISPLAY_NAME: {
    readonly ROOT: "HeroUINative.NumberPad.Root";
    readonly ROW: "HeroUINative.NumberPad.Row";
    readonly KEY: "HeroUINative.NumberPad.Key";
    readonly KEY_LABEL: "HeroUINative.NumberPad.KeyLabel";
    readonly BACKSPACE: "HeroUINative.NumberPad.Backspace";
    readonly SPACER: "HeroUINative.NumberPad.Spacer";
};
/**
 * Default 3×4 phone-style number pad layout, grouped by row.
 * Row 4: spacer | 0 | backspace.
 */
export declare const DEFAULT_ROWS: NumberPadDefaultLayoutItem[][];
/** Default scale applied when a key is pressed. */
export declare const DEFAULT_KEY_SCALE = 0.97;
/** Default timing duration for key press animation in milliseconds. */
export declare const DEFAULT_KEY_ANIMATION_DURATION = 150;
/** Hit slop applied to interactive keys for accessible touch targets. */
export declare const KEY_HIT_SLOP = 6;
//# sourceMappingURL=number-pad.constants.d.ts.map