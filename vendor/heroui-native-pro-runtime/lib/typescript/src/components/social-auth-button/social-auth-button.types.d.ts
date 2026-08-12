import type { ButtonRootProps } from 'heroui-native/button';
/**
 * Supported OAuth / social-login providers.
 * Each value maps to a built-in monochrome icon and default label
 * via the PROVIDER_CONFIG constant.
 */
export type SocialAuthButtonProvider = 'google' | 'apple' | 'github' | 'facebook' | 'x' | 'microsoft' | 'discord' | 'linkedin' | 'slack' | 'notion' | 'linear';
/**
 * Props for customising the provider icon rendered inside the SocialAuthButton.
 * Mirrors the IconProps contract used throughout the example app.
 */
export interface SocialAuthButtonIconProps {
    /**
     * Size of the icon in pixels
     * @default 20
     */
    size?: number;
    /**
     * Color of the icon (fill)
     * @default "currentColor"
     */
    color?: string;
    /**
     * ClassName prop for color (mapped to color via withUniwind).
     * Example: "accent-foreground" maps to the resolved foreground colour.
     */
    colorClassName?: string;
}
/**
 * Props for the SocialAuthButton component.
 *
 * Extends ButtonRootProps, allowing full override of all button props.
 * Defaults to variant="outline" and size="lg".
 */
export type SocialAuthButtonProps = ButtonRootProps & {
    /**
     * OAuth / social-login provider.
     * Determines which icon and default label are rendered.
     */
    provider: SocialAuthButtonProvider;
    /**
     * Props forwarded to the provider icon component.
     */
    iconProps?: SocialAuthButtonIconProps;
    /**
     * Custom label text. When omitted the default
     * "Continue with {Provider}" label is used.
     */
    label?: string;
};
//# sourceMappingURL=social-auth-button.types.d.ts.map