"use strict";

import { colorKit } from 'heroui-native';
import { AnimationSettingsProvider } from 'heroui-native/contexts';
import { useThemeColor } from 'heroui-native/hooks';
import { forwardRef, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useControllableState } from "../../helpers/internal/hooks/index.js";
import { resolveMaskHeight } from "../wheel-picker/wheel-picker.utils.js";
import { useWheelPickerGroupRootAnimation } from "./wheel-picker-group.animation.js";
import { DISPLAY_NAME, GROUP_DEFAULT_ITEM_HEIGHT, GROUP_DEFAULT_VISIBLE_COUNT } from "./wheel-picker-group.constants.js";
import { useWheelPickerGroup, WheelPickerGroupContext } from "./wheel-picker-group.context.js";
import { styleSheet, wheelPickerGroupClassNames } from "./wheel-picker-group.styles.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// --------------------------------------------------

const WheelPickerGroupRoot = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    values: valuesProp,
    defaultValues,
    itemHeight = GROUP_DEFAULT_ITEM_HEIGHT,
    visibleCount = GROUP_DEFAULT_VISIBLE_COUNT,
    isDisabled = false,
    className,
    style,
    onValuesChange,
    onValuesCommit,
    animation,
    ...restProps
  } = props;
  const [values, setValues] = useControllableState({
    prop: valuesProp,
    defaultProp: defaultValues,
    onChange: onValuesChange
  });
  const resolvedItemHeight = itemHeight > 0 ? itemHeight : GROUP_DEFAULT_ITEM_HEIGHT;
  const resolvedVisibleCount = visibleCount > 0 && visibleCount % 2 === 1 ? visibleCount : GROUP_DEFAULT_VISIBLE_COUNT;
  const viewportHeight = resolvedVisibleCount * resolvedItemHeight;
  const containerClassName = wheelPickerGroupClassNames.root({
    isDisabled,
    className
  });
  const {
    isAllAnimationsDisabled
  } = useWheelPickerGroupRootAnimation({
    animation
  });
  const animationSettingsContextValue = useMemo(() => ({
    isAllAnimationsDisabled
  }), [isAllAnimationsDisabled]);

  // Mirror props through refs so the stable callbacks below see the
  // freshest values without forcing the context to depend on them
  // (which would re-render every wheel on each prop change).
  const valuesRef = useRef(values);
  valuesRef.current = values;
  const onValuesCommitRef = useRef(onValuesCommit);
  onValuesCommitRef.current = onValuesCommit;

  // Count of wheels currently scrolling. Plain ref because coordination
  // is JS-thread only. The transition back to `0` fires `onValuesCommit`
  // exactly once per multi-wheel session.
  const activeScrollCountRef = useRef(0);
  const setValueByName = useCallback((name, value) => {
    /**
     * Mirror the write synchronously into `valuesRef.current` so the
     * commit path (`notifyScrollState` → `onValuesCommit`) sees the
     * freshest values in the **same** JS tick — before React has had
     * a chance to flush the queued `setValues` re-render.
     *
     * This is critical for fast flings: `onMomentumEnd` schedules
     * `onIndexChange` (writes through here) and `onScrollingChange`
     * (reads `valuesRef.current` in the commit) back-to-back on the
     * JS thread. Without this mirror, the commit fires with the
     * pre-fling values because `valuesRef.current` is only refreshed
     * during the next render (line above), and React batches the
     * `setValues` update past the commit.
     */
    valuesRef.current = {
      ...(valuesRef.current ?? {}),
      [name]: value
    };
    setValues(prev => ({
      ...(prev ?? {}),
      [name]: value
    }));
  }, [setValues]);
  const notifyScrollState = useCallback(isScrolling => {
    const delta = isScrolling ? 1 : -1;
    activeScrollCountRef.current = Math.max(0, activeScrollCountRef.current + delta);
    if (activeScrollCountRef.current === 0) {
      onValuesCommitRef.current?.(valuesRef.current ?? {});
    }
  }, []);
  const isAnyWheelScrolling = useCallback(() => activeScrollCountRef.current > 0, []);
  const contextValue = useMemo(() => ({
    itemHeight: resolvedItemHeight,
    visibleCount: resolvedVisibleCount,
    isDisabled,
    getValue: name => values?.[name],
    setValue: setValueByName,
    notifyScrollState,
    isAnyWheelScrolling
  }), [resolvedItemHeight, resolvedVisibleCount, isDisabled, values, setValueByName, notifyScrollState, isAnyWheelScrolling]);
  return /*#__PURE__*/_jsx(AnimationSettingsProvider, {
    value: animationSettingsContextValue,
    children: /*#__PURE__*/_jsx(WheelPickerGroupContext.Provider, {
      value: contextValue,
      children: /*#__PURE__*/_jsx(View, {
        ref: ref,
        className: containerClassName,
        style: [{
          height: viewportHeight
        }, style],
        accessibilityRole: "adjustable",
        accessibilityState: {
          disabled: isDisabled
        },
        ...restProps,
        children: children
      })
    })
  });
});

// --------------------------------------------------

const WheelPickerGroupIndicator = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    classNames,
    styles: stylesProp,
    style,
    ...restProps
  } = props;
  const {
    itemHeight,
    visibleCount
  } = useWheelPickerGroup();
  const {
    wrapper: wrapperSlot,
    highlight: highlightSlot
  } = wheelPickerGroupClassNames.indicator();
  const wrapperClassName = wrapperSlot({
    className: [className, classNames?.wrapper]
  });
  const highlightClassName = highlightSlot({
    className: classNames?.highlight
  });

  // Center the indicator on the group viewport: span one row, offset by
  // half of the rows above the center.
  const wrapperHeight = itemHeight;
  const wrapperTop = (visibleCount - 1) / 2 * itemHeight;
  return /*#__PURE__*/_jsx(View, {
    ref: ref,
    className: wrapperClassName,
    style: [{
      top: wrapperTop,
      height: wrapperHeight
    }, stylesProp?.wrapper, style],
    pointerEvents: "none",
    ...restProps,
    children: /*#__PURE__*/_jsx(View, {
      className: highlightClassName,
      style: [styleSheet.indicatorHighlight, stylesProp?.highlight],
      children: children
    })
  });
});

// --------------------------------------------------

const WheelPickerGroupMask = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    color,
    height,
    className,
    classNames,
    styles: stylesProp,
    style,
    ...restProps
  } = props;
  const {
    itemHeight,
    visibleCount
  } = useWheelPickerGroup();
  const {
    top: topSlot,
    bottom: bottomSlot
  } = wheelPickerGroupClassNames.mask();
  const topClassName = topSlot({
    className: [className, classNames?.top]
  });
  const bottomClassName = bottomSlot({
    className: [className, classNames?.bottom]
  });
  const halfMaskHeight = (visibleCount - 1) / 2 * itemHeight;
  const baseMaskHeight = halfMaskHeight * 0.5;
  const resolvedHeight = resolveMaskHeight(height, baseMaskHeight);
  const themeBackground = useThemeColor('background');
  const baseColor = color ?? themeBackground;
  const {
    topGradient,
    bottomGradient
  } = useMemo(() => {
    const transparent = colorKit.setAlpha(baseColor, 0).hex();
    return {
      topGradient: `linear-gradient(to bottom, ${baseColor}, ${transparent})`,
      bottomGradient: `linear-gradient(to top, ${baseColor}, ${transparent})`
    };
  }, [baseColor]);
  return /*#__PURE__*/_jsxs(View, {
    ref: ref,
    style: [StyleSheet.absoluteFill, style],
    pointerEvents: "none",
    ...restProps,
    children: [/*#__PURE__*/_jsx(View, {
      className: topClassName,
      style: [{
        experimental_backgroundImage: topGradient,
        height: resolvedHeight
      }, stylesProp?.top],
      pointerEvents: "none"
    }), /*#__PURE__*/_jsx(View, {
      className: bottomClassName,
      style: [{
        experimental_backgroundImage: bottomGradient,
        height: resolvedHeight
      }, stylesProp?.bottom],
      pointerEvents: "none"
    })]
  });
});

// --------------------------------------------------

WheelPickerGroupRoot.displayName = DISPLAY_NAME.ROOT;
WheelPickerGroupIndicator.displayName = DISPLAY_NAME.INDICATOR;
WheelPickerGroupMask.displayName = DISPLAY_NAME.MASK;

/**
 * Compound `WheelPickerGroup` component for coordinating multiple
 * `WheelPicker` instances (e.g. a date picker with year / month / day).
 *
 * @component WheelPickerGroup - Root container managing a shared
 * controllable `values` record. Provides `itemHeight`, `visibleCount`,
 * value getters/setters, and scroll coordination to child wheels via
 * context. Cascades `animation="disable-all"` to all children.
 *
 * @component WheelPickerGroup.Indicator - Optional shared selection band
 * spanning every wheel at the center of the group viewport. Replaces the
 * per-wheel indicator when a child `WheelPicker` is nested in the group.
 *
 * @component WheelPickerGroup.Mask - Optional top / bottom fade overlays
 * that span the full group viewport.
 *
 * Children opt into the group by setting a `name` prop on each
 * `WheelPicker`. Wheels without a name still render but operate
 * independently. Wheels nested in a group automatically receive
 * `flex-1` so they distribute the row evenly; pass an explicit width
 * via `className` to override.
 *
 */
const WheelPickerGroup = Object.assign(WheelPickerGroupRoot, {
  /** @optional Shared selection band spanning every wheel */
  Indicator: WheelPickerGroupIndicator,
  /** @optional Shared top / bottom fade overlays */
  Mask: WheelPickerGroupMask
});
export default WheelPickerGroup;
export { useWheelPickerGroup };