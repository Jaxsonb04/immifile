import type { Tabs, TabsIndicatorProps, TabsLabelProps, TabsListProps, TabsProps, TabsScrollViewProps, TabsSeparatorProps, TabsTriggerProps } from 'heroui-native/tabs';
import type { ComponentRef } from 'react';
import type { ScrollView } from 'react-native';
import type { PressableRef, TextRef, ViewRef } from '../../helpers/internal/types';
/**
 * Size tokens for segment layout and typography.
 *
 * Controls padding, indicator radius, and label sizing across compound parts.
 */
export type SegmentSize = 'sm' | 'md' | 'lg';
/**
 * Segment context propagated from {@link SegmentRootProps} to all compound parts.
 */
export interface SegmentContextValue {
    /**
     * Currently selected segment value.
     *
     * Resolves to `""` when no segment is selected.
     */
    value: string;
    /**
     * Updates the selected segment.
     *
     * Mirrors `onValueChange` from {@link SegmentRootProps} and bridges
     * controlled / uncontrolled state internally.
     */
    onValueChange: (value: string) => void;
    /**
     * Current segment size tier.
     */
    size: SegmentSize;
    /**
     * When true, selection is prevented for every item unless overridden locally.
     */
    isDisabled: boolean;
}
/**
 * Props for the {@link Segment} root component.
 *
 * Wraps `heroui-native` `Tabs` with `variant` fixed to `"primary"`, adds
 * controlled / uncontrolled selection via `useControllableState`, broadcasts
 * `size` / `isDisabled` to descendants, and passes through `Tabs` animations.
 */
export interface SegmentRootProps extends Omit<TabsProps, 'value' | 'onValueChange' | 'variant'> {
    /**
     * Controlled selected segment value (tab value string).
     */
    value?: string;
    /**
     * Initial selected segment when uncontrolled.
     *
     * @example "dashboard"
     */
    defaultValue?: string;
    /**
     * Fires when the selected segment changes after user interaction or
     * programmatic updates in uncontrolled mode.
     *
     * @param value - Selected tab key.
     */
    onValueChange?: (value: string) => void;
    /**
     * Disables interaction for every item (merged with each item`s `isDisabled`).
     *
     * @default false
     */
    isDisabled?: boolean;
    /**
     * Visual size affecting padding, typography, and radii across parts.
     *
     * @default "md"
     */
    size?: SegmentSize;
}
/**
 * Imperative ref forwarded to the root `Tabs`/`View`.
 */
export type SegmentRootRef = ViewRef;
/**
 * Props for {@link SegmentGroup} wrapping `Tabs.List`.
 */
export type SegmentGroupProps = TabsListProps;
/**
 * Ref type for {@link SegmentGroup}.
 */
export type SegmentGroupRef = ViewRef;
/**
 * Props for {@link SegmentScrollView} wrapping `Tabs.ScrollView`.
 */
export type SegmentScrollViewProps = TabsScrollViewProps;
/**
 * Ref type for {@link SegmentScrollView}.
 */
export type SegmentScrollViewRef = ComponentRef<typeof ScrollView>;
/**
 * Props for {@link SegmentIndicator} wrapping `Tabs.Indicator`.
 */
export type SegmentIndicatorProps = TabsIndicatorProps;
/**
 * Ref type for {@link SegmentIndicator}.
 */
export type SegmentIndicatorRef = ViewRef;
/**
 * Props for {@link SegmentItem} wrapping `Tabs.Trigger`.
 *
 * Combines selection value, optional per-item disable, and render-prop children.
 */
export type SegmentItemProps = TabsTriggerProps;
/**
 * Ref type for {@link SegmentItem} (trigger press surface).
 */
export type SegmentItemRef = PressableRef;
/**
 * Props for {@link SegmentLabel} wrapping `Tabs.Label`.
 */
export type SegmentLabelProps = TabsLabelProps;
/**
 * Ref type for {@link SegmentLabel}.
 */
export type SegmentLabelRef = TextRef;
/**
 * Props for {@link SegmentSeparator} wrapping `Tabs.Separator`.
 *
 * Separator visibility follows `betweenValues` relative to current selection,
 * inherited from `Tabs.Separator` behavior.
 */
export type SegmentSeparatorProps = TabsSeparatorProps;
/**
 * Ref type for {@link SegmentSeparator} (animated opacity layer).
 */
export type SegmentSeparatorRef = ComponentRef<(typeof Tabs)['Separator']>;
//# sourceMappingURL=segment.types.d.ts.map