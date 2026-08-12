import React from 'react';
import type { SocialAuthButtonIconProps } from '../social-auth-button.types';
/**
 * Monochrome Google icon wrapped with withUniwind for className-based styling.
 *
 * @example
 * ```tsx
 * <GoogleIcon colorClassName="accent-foreground" />
 * <GoogleIcon size={24} color="#000" />
 * ```
 */
export declare const GoogleIcon: (props: {
    readonly colorClassName?: string | undefined;
} & SocialAuthButtonIconProps) => React.ReactNode;
/**
 * Colored Google icon (original brand colours).
 * Used by SocialAuthButton when no custom colour override is provided.
 *
 * @example
 * ```tsx
 * <GoogleColoredIcon size={24} />
 * ```
 */
export declare const GoogleColoredIcon: React.FC<Pick<SocialAuthButtonIconProps, "size">>;
//# sourceMappingURL=google.d.ts.map