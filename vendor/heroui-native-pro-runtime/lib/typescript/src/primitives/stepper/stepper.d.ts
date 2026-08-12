import { Text, View } from 'react-native';
import type { StepInjectedProps, StepperRootContextValue, StepperStepContextValue } from './stepper.types';
declare function useRootContext(): StepperRootContextValue;
declare function useStepContext(): StepperStepContextValue;
declare const Root: import("react").ForwardRefExoticComponent<Omit<import("../../helpers/internal/types").SlottableViewProps, "children"> & {
    children: React.ReactNode;
    currentStep?: number;
    defaultStep?: number;
    onStepChange?: (step: number) => void;
    orientation?: import("./stepper.types").Orientation;
    skipInjectStepIndices?: boolean;
} & import("react").RefAttributes<View>>;
declare const Step: import("react").ForwardRefExoticComponent<Omit<import("react-native").PressableProps & import("react").RefAttributes<View>, "ref"> & {
    asChild?: boolean;
} & {
    children?: React.ReactNode;
} & Partial<StepInjectedProps> & import("react").RefAttributes<View>>;
declare const Rail: import("react").ForwardRefExoticComponent<import("react-native").ViewProps & {
    asChild?: boolean;
} & import("react").RefAttributes<View>>;
declare const Indicator: import("react").ForwardRefExoticComponent<import("react-native").ViewProps & {
    asChild?: boolean;
} & import("react").RefAttributes<View>>;
declare const Separator: import("react").ForwardRefExoticComponent<import("react-native").ViewProps & {
    asChild?: boolean;
} & {
    force?: boolean;
    progress?: number;
} & import("react").RefAttributes<View>>;
declare const Content: import("react").ForwardRefExoticComponent<import("react-native").ViewProps & {
    asChild?: boolean;
} & {
    children?: React.ReactNode;
} & import("react").RefAttributes<View>>;
declare const Title: import("react").ForwardRefExoticComponent<import("react-native").TextProps & {
    asChild?: boolean;
} & {
    children?: React.ReactNode;
} & import("react").RefAttributes<Text>>;
declare const Description: import("react").ForwardRefExoticComponent<import("react-native").TextProps & {
    asChild?: boolean;
} & {
    children?: React.ReactNode;
} & import("react").RefAttributes<Text>>;
export { Content, Description, Indicator, Rail, Root, Separator, Step, Title, useRootContext, useStepContext, };
//# sourceMappingURL=stepper.d.ts.map