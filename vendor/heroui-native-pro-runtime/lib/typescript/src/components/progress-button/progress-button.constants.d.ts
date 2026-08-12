/**
 * Display name constants for the ProgressButton compound component parts.
 */
export declare const DISPLAY_NAME: {
    readonly ROOT: "HeroUINative.ProgressButton.Root";
    readonly OVERLAY: "HeroUINative.ProgressButton.Overlay";
    readonly LABEL: "HeroUINative.ProgressButton.Label";
    readonly MASK_LABEL: "HeroUINative.ProgressButton.MaskLabel";
};
/** Default duration in milliseconds the user must hold to complete. */
export declare const DEFAULT_HOLD_DURATION_MS = 2000;
/** Default delay before auto-reset in milliseconds. */
export declare const DEFAULT_AUTO_RESET_DELAY = 1000;
/** Default scale applied on press for tactile feedback. */
export declare const DEFAULT_PRESS_SCALE = 0.985;
/** Default duration for scale press-feedback animations. */
export declare const DEFAULT_SCALE_DURATION = 150;
/** Default spring configuration for progress reset and controlled-sync animations. */
export declare const DEFAULT_PROGRESS_SPRING_CONFIG: {
    readonly damping: 120;
    readonly stiffness: 900;
    readonly mass: 4;
};
//# sourceMappingURL=progress-button.constants.d.ts.map