import { type SharedValue } from 'react-native-reanimated';
import type { LineChartAnimatedLineAnimation, LineChartAnimatedLineProps, LineChartRootAnimation } from './line-chart.types';
export declare function useLineChartRootAnimation(options: {
    animation: LineChartRootAnimation | undefined;
}): {
    isAllAnimationsDisabled: boolean;
};
export declare function useLineChartAnimatedLineAnimation(options: {
    animation: LineChartAnimatedLineAnimation | undefined;
    resetKey: LineChartAnimatedLineProps['resetKey'];
}): {
    progress: SharedValue<number>;
};
//# sourceMappingURL=line-chart.animation.d.ts.map