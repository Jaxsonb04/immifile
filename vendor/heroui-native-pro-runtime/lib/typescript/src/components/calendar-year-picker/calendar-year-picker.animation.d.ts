import type { YearPickerGridAnimation, YearPickerIndicatorAnimation } from './calendar-year-picker.types';
/**
 * Opacity animation for the year picker overlay container.
 */
export declare function useYearPickerGridAnimation(options: {
    animation: YearPickerGridAnimation | undefined;
    isOpen: boolean;
}): {
    rOverlayStyle: import("react-native-reanimated/lib/typescript/hook/commonTypes").AnimatedStyleHandle<{
        opacity: number;
    }>;
};
/**
 * Chevron rotation on the year picker trigger (accordion-style spring).
 */
export declare function useYearPickerIndicatorAnimation(options: {
    animation: YearPickerIndicatorAnimation | undefined;
    isOpen: boolean;
}): {
    rContainerStyle: import("react-native-reanimated/lib/typescript/hook/commonTypes").AnimatedStyleHandle<{
        transform: {
            rotate: string;
        }[];
    }>;
};
//# sourceMappingURL=calendar-year-picker.animation.d.ts.map