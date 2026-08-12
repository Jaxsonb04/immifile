import type { PressableRef, SlottablePressableProps, SlottableTextProps, SlottableViewProps, TextRef, ViewRef } from '../../helpers/internal/types';
/**
 * Layout rectangle from `onLayout` (`nativeEvent.layout`).
 */
type LayoutRect = {
    x: number;
    y: number;
    width: number;
    height: number;
};
/**
 * Per-step measurements stored on the root context.
 */
type StepMeasurements = {
    step?: LayoutRect;
    rail?: LayoutRect;
    separator?: LayoutRect;
};
type StepStatus = 'inactive' | 'active' | 'complete';
type Orientation = 'horizontal' | 'vertical';
/**
 * Root context value for Stepper primitive.
 */
type StepperRootContextValue = {
    currentStep: number;
    /** Updates the active step (controlled or uncontrolled). Used by `Step` default `onPress`. */
    onStepChange: (step: number) => void;
    orientation: Orientation;
    measurements: Record<number, StepMeasurements>;
    setStepMeasurement: (index: number, partial: Partial<StepMeasurements>) => void;
};
/**
 * Per-step context (each `Step` provides this).
 */
type StepperStepContextValue = {
    index: number;
    isLast: boolean;
    status: StepStatus;
};
type RootProps = Omit<SlottableViewProps, 'children'> & {
    children: React.ReactNode;
    /** Controlled active step index */
    currentStep?: number;
    /** Initial step index when uncontrolled @default 0 */
    defaultStep?: number;
    /** Fired when the active step index changes */
    onStepChange?: (step: number) => void;
    /** Main axis of the step sequence @default horizontal */
    orientation?: Orientation;
    /**
     * When true, Root does not clone children to inject `_index` / `_isLast`.
     * Use when a parent layer (e.g. styled Stepper) already injected indices on each step.
     * @default false
     */
    skipInjectStepIndices?: boolean;
};
type RootRef = ViewRef;
type StepProps = SlottablePressableProps & {
    children?: React.ReactNode;
};
/** Injected by root when mapping `Step` children */
type StepInjectedProps = {
    _index?: number;
    _isLast?: boolean;
};
type StepRef = PressableRef;
type RailProps = SlottableViewProps;
type RailRef = ViewRef;
type IndicatorProps = SlottableViewProps;
type IndicatorRef = ViewRef;
type SeparatorProps = SlottableViewProps & {
    /** Render on the last step @default false */
    force?: boolean;
    /** Explicit fill amount 0–1; when omitted, derived from `currentStep` */
    progress?: number;
};
type SeparatorRef = ViewRef;
type ContentProps = SlottableViewProps & {
    children?: React.ReactNode;
};
type ContentRef = ViewRef;
type TitleProps = SlottableTextProps & {
    children?: React.ReactNode;
};
type TitleRef = TextRef;
type DescriptionProps = SlottableTextProps & {
    children?: React.ReactNode;
};
type DescriptionRef = TextRef;
export type { ContentProps, ContentRef, DescriptionProps, DescriptionRef, IndicatorProps, IndicatorRef, LayoutRect, Orientation, RailProps, RailRef, RootProps, RootRef, SeparatorProps, SeparatorRef, StepInjectedProps, StepMeasurements, StepperRootContextValue, StepperStepContextValue, StepProps, StepRef, StepStatus, TitleProps, TitleRef, };
//# sourceMappingURL=stepper.types.d.ts.map