import type { SocialAuthButtonProps } from './social-auth-button.types';
/**
 * SocialAuthButton component — a specialised Button that renders a provider-specific
 * monochrome icon alongside a label (e.g. "Continue with Google").
 *
 * Defaults to `variant="outline"` and `size="lg"`.
 * The icon and label are derived from the `provider` prop; both can be
 * overridden via `iconProps` / `label`, or replaced entirely with `children`.
 *
 * @example
 * ```tsx
 * <SocialAuthButton provider="github" />
 * <SocialAuthButton provider="google" label="Sign in with Google" />
 * <SocialAuthButton provider="apple" variant="primary" />
 * ```
 */
declare const SocialAuthButton: import("react").ForwardRefExoticComponent<SocialAuthButtonProps & import("react").RefAttributes<import("react-native").View>>;
export default SocialAuthButton;
//# sourceMappingURL=social-auth-button.d.ts.map