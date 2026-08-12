"use strict";

import { AppleIcon, DiscordIcon, FacebookColoredIcon, FacebookIcon, GitHubIcon, GoogleColoredIcon, GoogleIcon, LinearIcon, LinkedInIcon, MicrosoftIcon, NotionIcon, SlackIcon, XIcon } from "./icons/index.js";
/**
 * Display names for SocialAuthButton components
 */
export const DISPLAY_NAME = {
  AUTH_BUTTON_ROOT: 'HeroUINative.SocialAuthButton.Root'
};

/**
 * Default Button variant used by SocialAuthButton when no variant prop is passed.
 */
export const DEFAULT_VARIANT = 'outline';

/**
 * Default icon size (in pixels) used when `iconProps.size` is not provided.
 */
export const DEFAULT_ICON_SIZE = 18;

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
export const VARIANT_ICON_COLOR_CLASS_NAME = {
  'primary': 'accent-accent-foreground',
  'secondary': 'accent-accent-soft-foreground',
  'tertiary': 'accent-default-foreground',
  'outline': 'accent-default-foreground',
  'ghost': 'accent-default-foreground',
  'danger': 'accent-danger-foreground',
  'danger-soft': 'accent-danger'
};

/**
 * Configuration for a single auth provider:
 * the icon component to render and the human-readable label.
 */

/**
 * Maps every supported {@link SocialAuthButtonProvider} to its icon and default label.
 */
export const PROVIDER_CONFIG = {
  google: {
    Icon: GoogleIcon,
    ColoredIcon: GoogleColoredIcon,
    label: 'Google'
  },
  apple: {
    Icon: AppleIcon,
    label: 'Apple'
  },
  github: {
    Icon: GitHubIcon,
    label: 'GitHub'
  },
  facebook: {
    Icon: FacebookIcon,
    ColoredIcon: FacebookColoredIcon,
    label: 'Facebook'
  },
  x: {
    Icon: XIcon,
    label: 'X'
  },
  microsoft: {
    Icon: MicrosoftIcon,
    label: 'Microsoft'
  },
  discord: {
    Icon: DiscordIcon,
    label: 'Discord'
  },
  linkedin: {
    Icon: LinkedInIcon,
    label: 'LinkedIn'
  },
  slack: {
    Icon: SlackIcon,
    label: 'Slack'
  },
  notion: {
    Icon: NotionIcon,
    label: 'Notion'
  },
  linear: {
    Icon: LinearIcon,
    label: 'Linear'
  }
};