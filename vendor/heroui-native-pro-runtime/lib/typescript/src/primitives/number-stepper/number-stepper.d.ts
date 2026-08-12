import { Text as RNText, View } from 'react-native';
import type { RootContext, RootRenderProps } from './number-stepper.types';
/**
 * Hook to access number stepper root context.
 * Throws when used outside NumberStepper.Root.
 */
declare function useRootContext(): RootContext;
declare const Root: import("react").ForwardRefExoticComponent<Omit<import("../../helpers/internal/types").SlottableViewProps, "children"> & {
    id?: string | number;
    value?: number;
    defaultValue?: number;
    onValueChange?: (value: number) => void;
    minValue?: number;
    maxValue?: number;
    step?: number;
    isDisabled?: boolean;
    children?: React.ReactNode | ((props: RootRenderProps) => React.ReactNode);
} & import("react").RefAttributes<View>>;
declare const DecrementButton: import("react").ForwardRefExoticComponent<Omit<import("react-native").PressableProps & import("react").RefAttributes<View>, "ref"> & {
    asChild?: boolean;
} & {
    isDisabled?: boolean;
    keepActiveAtBoundary?: boolean;
} & import("react").RefAttributes<View>>;
declare const IncrementButton: import("react").ForwardRefExoticComponent<Omit<import("react-native").PressableProps & import("react").RefAttributes<View>, "ref"> & {
    asChild?: boolean;
} & {
    isDisabled?: boolean;
    keepActiveAtBoundary?: boolean;
} & import("react").RefAttributes<View>>;
declare const Value: import("react").ForwardRefExoticComponent<import("react-native").TextProps & {
    asChild?: boolean;
} & import("react").RefAttributes<RNText>>;
export { DecrementButton, IncrementButton, Root, useRootContext, Value };
//# sourceMappingURL=number-stepper.d.ts.map