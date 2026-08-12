import type { ReactNode } from 'react';
import type { TextProps, ViewProps } from 'react-native';
import type { AnimationRootDisableAll, TextRef, ViewRef } from '../../helpers/internal/types';
/**
 * Visual variant for the {@link EmptyStateMedia} part.
 *
 * - `"default"`: render media content as-is.
 * - `"icon"`: wrap media in a circular muted surface.
 */
export type EmptyStateMediaVariant = 'default' | 'icon';
/**
 * Animation configuration for the {@link EmptyState} root component.
 *
 * `EmptyState` owns no animated styles itself; this root prop exists so
 * consumers can cascade `"disable-all"` to animated descendants.
 *
 * - `"disable-all"`: disable all animations including children.
 * - `undefined`: use default animations.
 */
export type EmptyStateRootAnimation = AnimationRootDisableAll;
/**
 * Props for the {@link EmptyState} root component.
 *
 * Centered container that composes `Header` and optional `Content` actions.
 */
export interface EmptyStateRootProps extends ViewProps {
    /** Compound parts rendered inside the empty state container. */
    children?: ReactNode;
    /** Additional classes for the root container. */
    className?: string;
    /**
     * Animation configuration for cascading disable-all behavior.
     *
     * - `"disable-all"`: disable all animations including children.
     * - `undefined`: use default animations.
     */
    animation?: EmptyStateRootAnimation;
}
/** Imperative ref type for {@link EmptyStateRoot}. */
export type EmptyStateRootRef = ViewRef;
/**
 * Props for the {@link EmptyStateHeader} part.
 *
 * Groups `Media`, `Title`, and `Description`.
 */
export interface EmptyStateHeaderProps extends ViewProps {
    /** Header content. */
    children?: ReactNode;
    /** Additional classes for the header wrapper. */
    className?: string;
}
/** Imperative ref type for {@link EmptyStateHeader}. */
export type EmptyStateHeaderRef = ViewRef;
/**
 * Props for the {@link EmptyStateMedia} part.
 *
 * Hosts an icon, avatar, or custom media block.
 */
export interface EmptyStateMediaProps extends ViewProps {
    /** Media content to render. */
    children?: ReactNode;
    /**
     * Media visual treatment.
     *
     * @default "default"
     */
    variant?: EmptyStateMediaVariant;
    /** Additional classes for the media container. */
    className?: string;
}
/** Imperative ref type for {@link EmptyStateMedia}. */
export type EmptyStateMediaRef = ViewRef;
/**
 * Props for the {@link EmptyStateTitle} part.
 *
 * Primary heading text for the empty state.
 */
export interface EmptyStateTitleProps extends TextProps {
    /** Title text content. */
    children?: ReactNode;
    /** Additional classes for the title text. */
    className?: string;
}
/** Imperative ref type for {@link EmptyStateTitle}. */
export type EmptyStateTitleRef = TextRef;
/**
 * Props for the {@link EmptyStateDescription} part.
 *
 * Secondary explanatory text below the title.
 */
export interface EmptyStateDescriptionProps extends TextProps {
    /** Description text content. */
    children?: ReactNode;
    /** Additional classes for the description text. */
    className?: string;
}
/** Imperative ref type for {@link EmptyStateDescription}. */
export type EmptyStateDescriptionRef = TextRef;
/**
 * Props for the {@link EmptyStateContent} part.
 *
 * Optional action area for buttons and inputs.
 */
export interface EmptyStateContentProps extends ViewProps {
    /** Action content rendered below the header. */
    children?: ReactNode;
    /** Additional classes for the action container. */
    className?: string;
}
/** Imperative ref type for {@link EmptyStateContent}. */
export type EmptyStateContentRef = ViewRef;
//# sourceMappingURL=empty-state.types.d.ts.map