import type { ReactNode } from 'react';
import type { TextProps, ViewProps } from 'react-native';
import type { AnimationRootDisableAll, TextRef, ViewRef } from '../../helpers/internal/types';
/**
 * Size variants supported by {@link Badge}.
 */
export type BadgeSize = 'sm' | 'md' | 'lg';
/**
 * Color variants supported by {@link Badge}.
 */
export type BadgeColor = 'default' | 'accent' | 'success' | 'warning' | 'danger';
/**
 * Visual style variants supported by {@link Badge}.
 */
export type BadgeVariant = 'primary' | 'secondary' | 'soft';
/**
 * Placement of the badge relative to its anchor.
 */
export type BadgePlacement = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
/**
 * Context value shared between Badge compound parts.
 */
export interface BadgeContextValue {
    /** Current size variant */
    size: BadgeSize;
    /** Current color variant */
    color: BadgeColor;
    /** Current visual variant */
    variant: BadgeVariant;
    /** Whether the badge renders as a dot (no content) */
    isDot: boolean;
}
/**
 * Props for the Badge.Anchor component.
 * Relative wrapper that positions the Badge over another element.
 */
export interface BadgeAnchorProps extends ViewProps {
    /**
     * The element to anchor the badge to, plus the Badge itself.
     */
    children: ReactNode;
    /**
     * Additional CSS classes for the anchor wrapper.
     */
    className?: string;
}
/**
 * Ref type for the Badge.Anchor component.
 */
export type BadgeAnchorRef = ViewRef;
/**
 * Props for the Badge root component.
 * Renders as a dot indicator or a pill with content.
 */
export interface BadgeRootProps extends ViewProps {
    /**
     * Content to display inside the badge (text, number, or icon).
     * When omitted, renders as a dot indicator.
     */
    children?: ReactNode;
    /**
     * Color variant of the badge.
     *
     * @default "default"
     */
    color?: BadgeColor;
    /**
     * Visual style variant.
     *
     * @default "primary"
     */
    variant?: BadgeVariant;
    /**
     * Size of the badge.
     *
     * @default "md"
     */
    size?: BadgeSize;
    /**
     * Position of the badge relative to its anchor.
     * Only takes effect when used inside a `Badge.Anchor`.
     *
     * @default "top-right"
     */
    placement?: BadgePlacement;
    /**
     * Additional CSS classes for the badge container.
     */
    className?: string;
    /**
     * Animation configuration for the badge root.
     * - `"disable-all"`: Disable all animations including children
     *   (cascades down to all child components)
     * - `undefined`: Use default animations
     */
    animation?: AnimationRootDisableAll;
}
/**
 * Ref type for the Badge root component.
 */
export type BadgeRootRef = ViewRef;
/**
 * Props for the Badge.Label component.
 * Text content inside the badge.
 */
export interface BadgeLabelProps extends TextProps {
    /**
     * Label text content.
     */
    children?: ReactNode;
    /**
     * Additional CSS classes for the label text.
     */
    className?: string;
}
/**
 * Ref type for the Badge.Label component.
 */
export type BadgeLabelRef = TextRef;
//# sourceMappingURL=badge.types.d.ts.map