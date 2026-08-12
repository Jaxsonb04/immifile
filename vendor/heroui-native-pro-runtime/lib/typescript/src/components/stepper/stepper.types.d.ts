import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';
import type { SharedValue, WithTimingConfig } from 'react-native-reanimated';
import type { AnimationDisabled, AnimationRoot, AnimationValue, ViewRef } from '../../helpers/internal/types';
import type * as StepperPrimitivesTypes from '../../primitives/stepper/stepper.types';
/**
 * Root-level animation configuration for Stepper (progress timing and cascade control).
 */
export type StepperRootAnimation = AnimationRoot<{
    /**
     * Progress animation driven by the active step index (`currentStep`).
     */
    progress?: AnimationValue<{
        /**
         * Timing configuration when animating `progress` between step indices.
         * @default { duration: 200, easing: Easing.out(Easing.ease) }
         */
        timingConfig?: WithTimingConfig;
    }>;
}>;
/**
 * Context value for Stepper animation state shared across compound parts.
 */
export interface StepperAnimationContextValue {
    /**
     * Animated progress aligned with the active step index (same numeric scale as `currentStep`).
     */
    progress: SharedValue<number>;
}
/**
 * Root Stepper props.
 */
export interface StepperProps extends Omit<StepperPrimitivesTypes.RootProps, 'skipInjectStepIndices'> {
    /**
     * Additional CSS classes for the root container
     */
    className?: string;
    /**
     * Root animation configuration (step progress timing and disable-all cascade).
     */
    animation?: StepperRootAnimation;
}
/**
 * Step container props.
 */
export interface StepperStepProps extends StepperPrimitivesTypes.StepProps {
    className?: string;
}
/**
 * Rail props (relative wrapper for indicator + separator).
 * If `children` is omitted or empty, the rail renders `Indicator` and `Separator` by default;
 * `Separator` is omitted on step index `0`.
 */
export interface StepperRailProps extends StepperPrimitivesTypes.RailProps {
    /**
     * Additional CSS classes for the rail container
     */
    className?: string;
}
/**
 * Indicator props.
 */
export interface StepperIndicatorProps extends StepperPrimitivesTypes.IndicatorProps {
    /**
     * Additional CSS classes for the indicator container
     */
    className?: string;
}
/**
 * Animated check icon for completed steps (uses stroke animation like Checkbox).
 */
export interface StepperIndicatorCheckProps extends Omit<ViewProps, 'children'> {
    /**
     * Additional CSS classes for the wrapper around the icon
     */
    className?: string;
    /** Icon size in logical pixels */
    size?: number;
    /** Stroke width for the check path */
    strokeWidth?: number;
    /** Stroke color (defaults to accent-foreground) */
    color?: string;
    /** Duration (ms) when the check draws in */
    enterDuration?: number;
    /** Duration (ms) when the check draws out */
    exitDuration?: number;
}
/**
 * 1-based step index label inside the indicator circle.
 */
export interface StepperIndicatorNumberProps extends Omit<StepperPrimitivesTypes.TitleProps, 'children'> {
    /**
     * Additional CSS classes for the label text
     */
    className?: string;
    /**
     * Custom label; static node or function receiving zero-based step index
     */
    children?: ReactNode | ((index: number) => ReactNode);
}
/**
 * Separator props (connector between steps).
 */
export interface StepperSeparatorProps extends StepperPrimitivesTypes.SeparatorProps {
    /**
     * Additional CSS classes for the separator container
     */
    className?: string;
}
/**
 * Static track behind the separator fill (`absolute inset-0 bg-border`).
 */
export interface StepperSeparatorTrackProps extends Omit<ViewProps, 'children'> {
    /**
     * Additional CSS classes for the track view
     */
    className?: string;
}
/**
 * Animated accent fill (`absolute inset-0 bg-accent`), scale driven by root `progress`.
 */
export interface StepperSeparatorFillProps extends Omit<ViewProps, 'children'> {
    /**
     * Additional CSS classes for the fill view
     */
    className?: string;
    /**
     * Disable fill scale animation (`false` or `"disabled"`). Omitted means enabled.
     * Global disable-all still applies via `AnimationSettingsProvider`.
     */
    animation?: AnimationDisabled;
    /**
     * When `false`, animated scale styles are not applied.
     * @default true
     */
    isAnimatedStyleActive?: boolean;
}
/**
 * Content region props.
 */
export interface StepperContentProps extends StepperPrimitivesTypes.ContentProps {
    /**
     * Additional CSS classes for the content container
     */
    className?: string;
}
/**
 * Step title text props (compound: `Stepper.Title`).
 */
export interface StepperTitleProps extends StepperPrimitivesTypes.TitleProps {
    /**
     * Additional CSS classes for the title container
     */
    className?: string;
}
/**
 * Step description text props (compound: `Stepper.Description`).
 */
export interface StepperDescriptionProps extends StepperPrimitivesTypes.DescriptionProps {
    /**
     * Additional CSS classes for the description container
     */
    className?: string;
}
/**
 * Ref types aligned with primitives.
 */
export type StepperRootRef = StepperPrimitivesTypes.RootRef;
export type StepperStepRef = StepperPrimitivesTypes.StepRef;
export type StepperRailRef = StepperPrimitivesTypes.RailRef;
export type StepperIndicatorRef = StepperPrimitivesTypes.IndicatorRef;
export type StepperIndicatorCheckRef = StepperPrimitivesTypes.IndicatorRef;
export type StepperIndicatorNumberRef = StepperPrimitivesTypes.TitleRef;
export type StepperSeparatorRef = StepperPrimitivesTypes.SeparatorRef;
export type StepperSeparatorTrackRef = ViewRef;
export type StepperSeparatorFillRef = ViewRef;
export type StepperContentRef = StepperPrimitivesTypes.ContentRef;
export type StepperTitleRef = StepperPrimitivesTypes.TitleRef;
export type StepperDescriptionRef = StepperPrimitivesTypes.DescriptionRef;
export type { StepStatus } from '../../primitives/stepper/stepper.types';
//# sourceMappingURL=stepper.types.d.ts.map