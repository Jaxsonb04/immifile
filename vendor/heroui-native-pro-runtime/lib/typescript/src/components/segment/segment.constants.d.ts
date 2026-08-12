import type { SegmentSize } from './segment.types';
/**
 * Default size tier propagated when `size` is omitted on {@link Segment} root.
 */
export declare const DEFAULT_SIZE: SegmentSize;
/**
 * Matches `DISPLAY_NAME.SCROLL_VIEW` from `heroui-native` Tabs so `Tabs.List`
 * layout detection recognises `Segment.ScrollView` as scroll-wrapped triggers.
 *
 * Source: HeroUI Native `tabs.constants.ts`.
 */
export declare const TABS_SCROLL_VIEW_DISPLAY_NAME_FOR_LIST_LAYOUT = "HeroUINative.Tabs.ScrollView";
/**
 * Display names for compound `Segment` parts.
 */
export declare const DISPLAY_NAME: {
    readonly ROOT: "HeroUINative.Segment.Root";
    readonly GROUP: "HeroUINative.Segment.Group";
    readonly SCROLL_VIEW: "HeroUINative.Segment.ScrollView";
    readonly INDICATOR: "HeroUINative.Segment.Indicator";
    readonly ITEM: "HeroUINative.Segment.Item";
    readonly LABEL: "HeroUINative.Segment.Label";
    readonly SEPARATOR: "HeroUINative.Segment.Separator";
};
//# sourceMappingURL=segment.constants.d.ts.map