import { type SharedValue } from 'react-native-reanimated';
export declare function useSplitViewDragAreaGesture(options: {
    topSectionHeight: SharedValue<number>;
    isDragging: SharedValue<boolean>;
    minPx: number;
    maxPx: number;
    isAllAnimationsDisabled: boolean;
    resolvedSnapPoints: readonly number[];
    setSnapIndex: (index: number) => void;
    onSnap: ((snapIndex: number, topHeightPx: number) => void) | undefined;
    applySnapHeight: (height: number, index: number, useSpring: boolean) => void;
    setDraggingJs: (isDragging: boolean) => void;
}): {
    panGesture: import("react-native-gesture-handler/lib/typescript/handlers/gestures/panGesture").PanGesture;
};
//# sourceMappingURL=split-view.gesture.d.ts.map