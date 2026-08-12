import * as SplitViewPrimitives from '../../primitives/split-view';
import type { SplitViewBottomSectionProps, SplitViewDragAreaProps, SplitViewDragHandleProps, SplitViewTopSectionProps } from './split-view.types';
/**
 * Compound SplitView component with sub-components
 *
 * @component SplitView - Vertical split layout with a draggable divider between a top and bottom section.
 * Snap points may be ratios (`0`..`1`) or px. Uses `react-native-reanimated` and gesture handler.
 *
 * @component SplitView.TopSection - Top pane; height is animated from drag and snap state.
 *
 * @component SplitView.DragArea - Pan gesture region; use `SplitView.DragHandle` inside for the default pill.
 *
 * @component SplitView.DragHandle - Visual handle; scales slightly while dragging when animations are enabled.
 *
 * @component SplitView.BottomSection - Bottom pane; fills remaining space below the drag area.
 *
 * Props flow via context (`useSplitView`) for `topSectionHeight`, `snapIndex`, `resolvedSnapPoints`, and more.
 */
declare const SplitView: import("react").ForwardRefExoticComponent<Omit<SplitViewPrimitives.SplitViewPrimitiveRootProps, "isAllAnimationsDisabled" | "snapSpringConfig"> & {
    animation?: import("./split-view.types").SplitViewRootAnimation;
    className?: string;
} & import("react").RefAttributes<import("react-native").View>> & {
    TopSection: import("react").ForwardRefExoticComponent<SplitViewTopSectionProps & import("react").RefAttributes<import("react-native").View>>;
    DragArea: import("react").ForwardRefExoticComponent<SplitViewDragAreaProps & import("react").RefAttributes<import("react-native").View>>;
    DragHandle: import("react").ForwardRefExoticComponent<SplitViewDragHandleProps & import("react").RefAttributes<import("react-native").View>>;
    BottomSection: import("react").ForwardRefExoticComponent<SplitViewBottomSectionProps & import("react").RefAttributes<import("react-native").View>>;
};
export default SplitView;
export { useSplitView } from '../../primitives/split-view';
//# sourceMappingURL=split-view.d.ts.map