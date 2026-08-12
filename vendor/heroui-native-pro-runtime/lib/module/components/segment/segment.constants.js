"use strict";

/**
 * Default size tier propagated when `size` is omitted on {@link Segment} root.
 */
export const DEFAULT_SIZE = 'md';

/**
 * Matches `DISPLAY_NAME.SCROLL_VIEW` from `heroui-native` Tabs so `Tabs.List`
 * layout detection recognises `Segment.ScrollView` as scroll-wrapped triggers.
 *
 * Source: HeroUI Native `tabs.constants.ts`.
 */
export const TABS_SCROLL_VIEW_DISPLAY_NAME_FOR_LIST_LAYOUT = 'HeroUINative.Tabs.ScrollView';

/**
 * Display names for compound `Segment` parts.
 */
export const DISPLAY_NAME = {
  ROOT: 'HeroUINative.Segment.Root',
  GROUP: 'HeroUINative.Segment.Group',
  SCROLL_VIEW: 'HeroUINative.Segment.ScrollView',
  INDICATOR: 'HeroUINative.Segment.Indicator',
  ITEM: 'HeroUINative.Segment.Item',
  LABEL: 'HeroUINative.Segment.Label',
  SEPARATOR: 'HeroUINative.Segment.Separator'
};