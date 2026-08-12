import { View } from 'react-native';
import type { SplitViewContextValue, SplitViewInternalContextValue, SplitViewPrimitiveRootProps } from './split-view.types';
declare const useSplitView: () => SplitViewContextValue;
declare const useSplitViewInternal: () => SplitViewInternalContextValue;
export { useSplitView, useSplitViewInternal };
/**
 * Root primitive: shared values, snap geometry, and context for split layout.
 */
declare const Root: import("react").ForwardRefExoticComponent<SplitViewPrimitiveRootProps & import("react").RefAttributes<View>>;
declare const TopSection: import("react").ForwardRefExoticComponent<import("react-native").ViewProps & {
    asChild?: boolean;
} & import("react").RefAttributes<View>>;
declare const BottomSection: import("react").ForwardRefExoticComponent<import("react-native").ViewProps & {
    asChild?: boolean;
} & import("react").RefAttributes<View>>;
declare const DragArea: import("react").ForwardRefExoticComponent<import("react-native").ViewProps & {
    asChild?: boolean;
} & import("react").RefAttributes<View>>;
declare const DragHandle: import("react").ForwardRefExoticComponent<import("react-native").ViewProps & {
    asChild?: boolean;
} & import("react").RefAttributes<View>>;
export { BottomSection, DragArea, DragHandle, Root, TopSection };
//# sourceMappingURL=split-view.d.ts.map