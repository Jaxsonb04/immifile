import type { ButtonVariant } from 'heroui-native/button';
import type React from 'react';
import type { SocialAuthButtonIconProps, SocialAuthButtonProvider } from './social-auth-button.types';
/**
 * Display names for SocialAuthButton components
 */
export declare const DISPLAY_NAME: {
    AUTH_BUTTON_ROOT: string;
};
/**
 * Default Button variant used by SocialAuthButton when no variant prop is passed.
 */
export declare const DEFAULT_VARIANT: ButtonVariant;
/**
 * Default icon size (in pixels) used when `iconProps.size` is not provided.
 */
export declare const DEFAULT_ICON_SIZE = 18;
/**
 * Maps every Button {@link ButtonVariant} to the icon `colorClassName` that
 * visually matches the Button label colour for that variant.
 *
 * The `accent-` prefix is the Uniwind alias for `accentColor`, followed by a
 * theme-colour token (e.g. `accent-foreground`, `default-foreground`).
 *
 * This mirrors the label colour map in `button.styles.ts`:
 * - `primary`     -> `text-accent-foreground`
 * - `secondary`   -> `text-accent-soft-foreground`
 * - `tertiary`    -> `text-default-foreground`
 * - `outline`     -> `text-default-foreground`
 * - `ghost`       -> `text-default-foreground`
 * - `danger`      -> `text-danger-foreground`
 * - `danger-soft` -> `text-danger`
 */
export declare const VARIANT_ICON_COLOR_CLASS_NAME: Record<ButtonVariant, string>;
/**
 * Configuration for a single auth provider:
 * the icon component to render and the human-readable label.
 */
export interface ProviderConfigEntry {
    /** Monochrome SVG icon wrapped with withUniwind */
    Icon: React.FC<SocialAuthButtonIconProps>;
    /** Optional coloured icon shown when no custom colour override is provided */
    ColoredIcon?: React.FC<Pick<SocialAuthButtonIconProps, 'size'>>;
    /** Default button label, e.g. "Continue with Google" */
    label: string;
}
/**
 * Maps every supported {@link SocialAuthButtonProvider} to its icon and default label.
 */
export declare const PROVIDER_CONFIG: Record<SocialAuthButtonProvider, ProviderConfigEntry>;
//# sourceMappingURL=social-auth-button.constants.d.ts.map