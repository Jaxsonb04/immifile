import React from 'react';
import type { SocialAuthButtonIconProps } from '../social-auth-button.types';
/**
 * Monochrome Facebook icon wrapped with withUniwind for className-based styling.
 *
 * @example
 * ```tsx
 * <FacebookIcon colorClassName="accent-foreground" />
 * <FacebookIcon size={24} color="#000" />
 * ```
 */
export declare const FacebookIcon: (props: {
    readonly colorClassName?: string | undefined;
} & SocialAuthButtonIconProps) => React.ReactNode;
/**
 * Colored Facebook icon (original brand colour).
 * Used by SocialAuthButton when no custom colour override is provided.
 *
 * @example
 * ```tsx
 * <FacebookColoredIcon size={24} />
 * ```
 */
export declare const FacebookColoredIcon: React.FC<Pick<SocialAuthButtonIconProps, "size">>;
//# sourceMappingURL=facebook.d.ts.map