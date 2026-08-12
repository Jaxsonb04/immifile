import type { SegmentContextValue, SegmentRootProps } from './segment.types';
declare const useSegment: () => SegmentContextValue;
export { useSegment };
/**
 * Compound `Segment` segmented control built on top of HeroUI Native `Tabs`
 * (`variant="primary"` only).
 *
 * @component Segment - Bridges controlled / uncontrolled value via optional
 * `value`, `defaultValue`, and `onValueChange`; cascades optional root
 * `isDisabled`; applies `sm` | `md` | `lg` sizing everywhere.
 *
 * @component Segment.Group — Row container for triggers (alias of `Tabs.List`).
 *
 * @component Segment.ScrollView — Optional horizontally scrollable row alias
 * of `Tabs.ScrollView`. Display name preserves Tabs list scroll detection.
 *
 * @component Segment.Indicator — Animated pill indicator (`Tabs.Indicator`).
 *
 * @component Segment.Item — Selectable chip (`Tabs.Trigger`); merges root
 * `isDisabled`.
 *
 * @component Segment.Label — Text label styling (`Tabs.Label`).
 *
 * @component Segment.Separator — Divider with `betweenValues` visibility logic
 * (`Tabs.Separator`).
 *
 * Selection state mirrors `Tabs` (`value`, `defaultValue`, `onValueChange`).
 * Use `animation`/`isAnimatedStyleActive` on Indicator & Separator identical to Tabs.
 *
 * Props flow via `Tabs` internals for selection measurements and via
 * `SegmentContext` for shared sizing/disable flags.
 *
 */
declare const Segment: import("react").ForwardRefExoticComponent<SegmentRootProps & import("react").RefAttributes<import("react-native").View>> & {
    Group: import("react").ForwardRefExoticComponent<import("heroui-native").TabsListProps & import("react").RefAttributes<import("react-native").View>>;
    Indicator: import("react").ForwardRefExoticComponent<import("heroui-native").TabsIndicatorProps & import("react").RefAttributes<import("react-native").View>>;
    Item: import("react").ForwardRefExoticComponent<import("heroui-native").TabsTriggerProps & import("react").RefAttributes<import("react-native").View>>;
    Label: import("react").ForwardRefExoticComponent<import("heroui-native").TabsLabelProps & import("react").RefAttributes<import("react-native").Text>>;
    ScrollView: import("react").ForwardRefExoticComponent<import("heroui-native").TabsScrollViewProps & import("react").RefAttributes<import("react-native").ScrollView>>;
    Separator: import("react").ForwardRefExoticComponent<import("heroui-native").TabsSeparatorProps & import("react").RefAttributes<import("react-native-reanimated/lib/typescript/Animated").View>>;
};
export default Segment;
//# sourceMappingURL=segment.d.ts.map