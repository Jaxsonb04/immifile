import { View } from 'react-native';
import * as StepperPrimitives from '../../primitives/stepper';
import { useStepperAnimation } from './stepper.animation';
import type { StepperContentProps, StepperDescriptionProps, StepperIndicatorCheckProps, StepperIndicatorNumberProps, StepperIndicatorProps, StepperProps, StepperRailProps, StepperSeparatorFillProps, StepperSeparatorProps, StepperSeparatorTrackProps, StepperStepProps, StepperTitleProps } from './stepper.types';
declare const useStepper: typeof StepperPrimitives.useRootContext;
declare const useStepperStep: typeof StepperPrimitives.useStepContext;
declare const Stepper: import("react").ForwardRefExoticComponent<StepperProps & import("react").RefAttributes<View>> & {
    Step: import("react").ForwardRefExoticComponent<StepperStepProps & import("react").RefAttributes<View>>;
    Rail: import("react").ForwardRefExoticComponent<StepperRailProps & import("react").RefAttributes<View>>;
    Indicator: import("react").ForwardRefExoticComponent<StepperIndicatorProps & import("react").RefAttributes<View>>;
    IndicatorCheck: import("react").ForwardRefExoticComponent<StepperIndicatorCheckProps & import("react").RefAttributes<View>>;
    IndicatorNumber: import("react").ForwardRefExoticComponent<StepperIndicatorNumberProps & import("react").RefAttributes<import("react-native").Text>>;
    Separator: import("react").ForwardRefExoticComponent<StepperSeparatorProps & import("react").RefAttributes<View>>;
    SeparatorTrack: import("react").ForwardRefExoticComponent<StepperSeparatorTrackProps & import("react").RefAttributes<View>>;
    SeparatorFill: import("react").ForwardRefExoticComponent<StepperSeparatorFillProps & import("react").RefAttributes<View>>;
    Content: import("react").ForwardRefExoticComponent<StepperContentProps & import("react").RefAttributes<View>>;
    Title: import("react").ForwardRefExoticComponent<StepperTitleProps & import("react").RefAttributes<import("react-native").Text>>;
    Description: import("react").ForwardRefExoticComponent<StepperDescriptionProps & import("react").RefAttributes<import("react-native").Text>>;
};
export default Stepper;
export { useStepper, useStepperAnimation, useStepperStep };
//# sourceMappingURL=stepper.d.ts.map