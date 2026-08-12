"use strict";

import { AnimationSettingsProvider } from 'heroui-native/contexts';
import { forwardRef, useCallback, useEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { HeroText } from "../../helpers/internal/components/index.js";
import { useControllableState } from "../../helpers/internal/hooks/index.js";
import { createContext } from "../../helpers/internal/utils/index.js";
import { useSlideButtonOverlayAnimation, useSlideButtonRootAnimation, useSlideButtonThumbAnimation, useSlideButtonUnderlayAnimation } from "./slide-button.animation.js";
import { DEFAULT_AUTO_RESET_DELAY, DEFAULT_COMPLETION_THRESHOLD, DISPLAY_NAME } from "./slide-button.constants.js";
import { ChevronRightIcon } from "./slide-button.icons.js";
import { slideButtonClassNames, slideButtonStyleSheet } from "./slide-button.styles.js";
import { jsx as _jsx } from "react/jsx-runtime";
const [SlideButtonProvider, useSlideButton] = createContext({
  name: 'SlideButtonContext'
});

// --------------------------------------------------

const SlideButtonRoot = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    variant = 'default',
    isCompleted: isCompletedProp,
    isDefaultCompleted = false,
    isDisabled = false,
    completionThreshold = DEFAULT_COMPLETION_THRESHOLD,
    autoReset = false,
    autoResetDelay = DEFAULT_AUTO_RESET_DELAY,
    className,
    classNames,
    styles: stylesProp,
    style,
    onCompleteChange,
    onComplete,
    onReset,
    animation,
    ...restProps
  } = props;
  const [isCompleted = false, setIsCompleted] = useControllableState({
    prop: isCompletedProp,
    defaultProp: isDefaultCompleted,
    onChange: onCompleteChange
  });
  const {
    container: containerSlot,
    contentContainer: contentContainerSlot
  } = slideButtonClassNames.root({
    isDisabled
  });
  const containerClassName = containerSlot({
    className: [className, classNames?.container]
  });
  const contentContainerClassName = contentContainerSlot({
    className: classNames?.contentContainer
  });
  const progress = useSharedValue(isCompleted ? 1 : 0);
  const trackWidth = useSharedValue(0);
  const trackHeight = useSharedValue(0);
  const thumbWidth = useSharedValue(0);
  const thumbHeight = useSharedValue(0);
  const autoResetTimerRef = useRef(null);
  const isInternalChangeRef = useRef(false);
  const prevIsCompletedRef = useRef(isCompleted);
  const {
    isAllAnimationsDisabled,
    resetSpringConfig
  } = useSlideButtonRootAnimation({
    animation
  });
  const animationSettingsContextValue = useMemo(() => ({
    isAllAnimationsDisabled
  }), [isAllAnimationsDisabled]);
  const resetProgress = useCallback(() => {
    if (isAllAnimationsDisabled) {
      progress.set(0);
    } else {
      progress.set(withSpring(0, resetSpringConfig));
    }
  }, [isAllAnimationsDisabled, progress, resetSpringConfig]);
  const handleLayout = useCallback(event => {
    const {
      width,
      height
    } = event.nativeEvent.layout;
    trackWidth.set(width);
    trackHeight.set(height);
  }, [trackWidth, trackHeight]);
  const handleComplete = useCallback(() => {
    isInternalChangeRef.current = true;
    setIsCompleted(true);
    onComplete?.();
    if (autoReset) {
      if (autoResetTimerRef.current) {
        clearTimeout(autoResetTimerRef.current);
      }
      autoResetTimerRef.current = setTimeout(() => {
        isInternalChangeRef.current = true;
        resetProgress();
        setIsCompleted(false);
        onReset?.();
      }, autoResetDelay);
    }
  }, [setIsCompleted, onComplete, autoReset, autoResetDelay, resetProgress, onReset]);
  const reset = useCallback(() => {
    if (autoResetTimerRef.current) {
      clearTimeout(autoResetTimerRef.current);
    }
    isInternalChangeRef.current = true;
    resetProgress();
    setIsCompleted(false);
    onReset?.();
  }, [resetProgress, setIsCompleted, onReset]);

  /**
   * Sync progress with external controlled state changes.
   * Skips when the change was triggered internally (gesture, auto-reset, reset).
   */
  useEffect(() => {
    const prev = prevIsCompletedRef.current;
    prevIsCompletedRef.current = isCompleted;
    if (prev === isCompleted) return;
    if (isInternalChangeRef.current) {
      isInternalChangeRef.current = false;
      return;
    }
    if (isCompleted) {
      if (isAllAnimationsDisabled) {
        progress.set(1);
      } else {
        progress.set(withSpring(1, resetSpringConfig));
      }
    } else {
      resetProgress();
    }
  }, [isCompleted, isAllAnimationsDisabled, progress, resetSpringConfig, resetProgress]);
  const contextValue = useMemo(() => ({
    progress,
    isCompleted,
    trackWidth,
    trackHeight,
    thumbWidth,
    thumbHeight,
    completionThreshold,
    isDisabled,
    variant,
    reset,
    complete: handleComplete
  }), [progress, isCompleted, trackWidth, trackHeight, thumbWidth, thumbHeight, completionThreshold, isDisabled, variant, reset, handleComplete]);
  const renderProps = {
    progress,
    isCompleted,
    trackWidth,
    trackHeight,
    thumbWidth,
    thumbHeight,
    isDisabled,
    variant
  };
  const resolvedChildren = typeof children === 'function' ? children(renderProps) : children;
  return /*#__PURE__*/_jsx(AnimationSettingsProvider, {
    value: animationSettingsContextValue,
    children: /*#__PURE__*/_jsx(SlideButtonProvider, {
      value: contextValue,
      children: /*#__PURE__*/_jsx(View, {
        ref: ref,
        className: containerClassName,
        style: [slideButtonStyleSheet.root, stylesProp?.container, style],
        accessibilityRole: "button",
        accessibilityState: {
          disabled: isDisabled
        },
        ...restProps,
        children: /*#__PURE__*/_jsx(View, {
          className: contentContainerClassName,
          style: stylesProp?.contentContainer,
          onLayout: handleLayout,
          children: resolvedChildren
        })
      })
    })
  });
});

// --------------------------------------------------

const SlideButtonUnderlayContent = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    classNames,
    styles: stylesProp,
    style,
    ...restProps
  } = props;
  const ctx = useSlideButton();
  const {
    rClipStyle,
    rInnerStyle
  } = useSlideButtonUnderlayAnimation({
    progress: ctx.progress,
    trackWidth: ctx.trackWidth,
    thumbWidth: ctx.thumbWidth
  });
  const {
    container: containerSlot,
    contentContainer: contentContainerSlot
  } = slideButtonClassNames.underlayContent();
  const containerClassName = containerSlot({
    className: [className, classNames?.container]
  });
  const contentContainerClassName = contentContainerSlot({
    className: classNames?.contentContainer
  });
  return /*#__PURE__*/_jsx(Animated.View, {
    ref: ref,
    className: containerClassName,
    style: [rClipStyle, stylesProp?.container, style],
    ...restProps,
    children: /*#__PURE__*/_jsx(Animated.View, {
      className: contentContainerClassName,
      style: [rInnerStyle, stylesProp?.contentContainer],
      children: children
    })
  });
});

// --------------------------------------------------

const SlideButtonOverlayContent = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    classNames,
    styles: stylesProp,
    style,
    ...restProps
  } = props;
  const ctx = useSlideButton();
  const {
    rClipStyle,
    rInnerStyle
  } = useSlideButtonOverlayAnimation({
    progress: ctx.progress,
    trackWidth: ctx.trackWidth,
    thumbWidth: ctx.thumbWidth
  });
  const {
    container: overlayContainerSlot,
    contentContainer: overlayContentSlot
  } = slideButtonClassNames.overlayContent({
    variant: ctx.variant
  });
  const containerClassName = overlayContainerSlot({
    className: [className, classNames?.container]
  });
  const contentContainerClassName = overlayContentSlot({
    className: classNames?.contentContainer
  });
  return /*#__PURE__*/_jsx(Animated.View, {
    ref: ref,
    className: containerClassName,
    style: [rClipStyle, stylesProp?.container, style],
    ...restProps,
    children: /*#__PURE__*/_jsx(Animated.View, {
      className: contentContainerClassName,
      style: [rInnerStyle, stylesProp?.contentContainer],
      children: children
    })
  });
});

// --------------------------------------------------

const SlideButtonThumb = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    style,
    animation,
    isAnimatedStyleActive = true,
    iconProps,
    onLayout,
    ...restProps
  } = props;
  const ctx = useSlideButton();
  const {
    rThumbStyle,
    panGesture
  } = useSlideButtonThumbAnimation({
    animation,
    progress: ctx.progress,
    isCompleted: ctx.isCompleted,
    trackWidth: ctx.trackWidth,
    thumbWidth: ctx.thumbWidth,
    completionThreshold: ctx.completionThreshold,
    isDisabled: ctx.isDisabled,
    complete: ctx.complete
  });
  const thumbClassName = slideButtonClassNames.thumb({
    className
  });
  const thumbStyle = isAnimatedStyleActive ? [rThumbStyle, style] : [style];
  const handleThumbLayout = useCallback(event => {
    const {
      width,
      height
    } = event.nativeEvent.layout;
    ctx.thumbWidth.set(width);
    ctx.thumbHeight.set(height);
    onLayout?.(event);
  }, [ctx.thumbWidth, ctx.thumbHeight, onLayout]);
  return /*#__PURE__*/_jsx(GestureDetector, {
    gesture: panGesture,
    children: /*#__PURE__*/_jsx(Animated.View, {
      ref: ref,
      className: thumbClassName,
      style: thumbStyle,
      onLayout: handleThumbLayout,
      ...restProps,
      children: children ?? /*#__PURE__*/_jsx(ChevronRightIcon, {
        ...iconProps
      })
    })
  });
});

// --------------------------------------------------

// --------------------------------------------------

const SlideButtonLabel = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    ...restProps
  } = props;
  const {
    variant
  } = useSlideButton();
  const labelClassName = slideButtonClassNames.label({
    variant,
    className
  });
  return /*#__PURE__*/_jsx(HeroText, {
    ref: ref,
    className: labelClassName,
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

SlideButtonRoot.displayName = DISPLAY_NAME.ROOT;
SlideButtonUnderlayContent.displayName = DISPLAY_NAME.UNDERLAY_CONTENT;
SlideButtonOverlayContent.displayName = DISPLAY_NAME.OVERLAY_CONTENT;
SlideButtonThumb.displayName = DISPLAY_NAME.THUMB;
SlideButtonLabel.displayName = DISPLAY_NAME.LABEL;

/**
 * Compound SlideButton component with sub-components
 *
 * @component SlideButton - Root container managing slide gesture state.
 * Provides progress, completion, and variant context to sub-components.
 * Supports controlled and uncontrolled completion state with optional auto-reset.
 *
 * @component SlideButton.UnderlayContent - Static content layer beneath the overlay.
 * Renders at full track width for label text, gradients, or patterns.
 * Supports render-prop children for progress-driven animations.
 *
 * @component SlideButton.OverlayContent - Progress fill layer that clips from left.
 * Uses overflow-hidden with animated width tied to thumb position.
 * Inner container maintains full track width for natural content layout.
 *
 * @component SlideButton.Thumb - Draggable handle driven by Pan gesture.
 * Uses react-native-gesture-handler for 60fps native gesture tracking.
 * Renders a chevron-right icon by default; accepts custom children.
 *
 * @component SlideButton.Label - Styled text that inherits the variant color.
 * Use inside UnderlayContent or OverlayContent for consistent label text.
 *
 * Props flow from SlideButton to sub-components via context
 * (progress, isCompleted, trackWidth, trackHeight, variant, isDisabled).
 *
 */
const SlideButton = Object.assign(SlideButtonRoot, {
  /** @optional Static content beneath the overlay (label, gradient, pattern) */
  UnderlayContent: SlideButtonUnderlayContent,
  /** @optional Progress fill layer clipped to thumb position */
  OverlayContent: SlideButtonOverlayContent,
  /** @optional Draggable thumb handle with gesture support */
  Thumb: SlideButtonThumb,
  /** @optional Styled text label that inherits the variant color */
  Label: SlideButtonLabel
});
export default SlideButton;
export { useSlideButton };