"use strict";

import { colorKit } from 'heroui-native';
import { AnimationSettingsProvider } from 'heroui-native/contexts';
import { useThemeColor } from 'heroui-native/hooks';
import { forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useDerivedValue } from 'react-native-reanimated';
import { HeroText } from "../../helpers/internal/components/index.js";
import { useAugmentedRef, useControllableState } from "../../helpers/internal/hooks/index.js";
import { createContext } from "../../helpers/internal/utils/index.js";
import { useOptionalWheelPickerGroup } from "../wheel-picker-group/wheel-picker-group.context.js";
import { useWheelPickerItemAnimation, useWheelPickerItemLabelAnimation, useWheelPickerRootAnimation } from "./wheel-picker.animation.js";
import { DEFAULT_ITEM_HEIGHT, DEFAULT_VISIBLE_COUNT, DISPLAY_NAME } from "./wheel-picker.constants.js";
import { styleSheet, wheelPickerClassNames } from "./wheel-picker.styles.js";
import { clampIndex, getIndexForValue, getScrollOffsetForIndex, resolveMaskHeight } from "./wheel-picker.utils.js";

// --------------------------------------------------

/**
 * Animated `Pressable` used as the row container for {@link WheelPicker.Item}.
 * Created once at module load so React doesn't allocate a new animated
 * component class on every render.
 */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Animated `HeroText` used as the row label for {@link WheelPicker.ItemLabel}.
 * Required so the root `animation.labelColor` interpolation can drive
 * the label's text color via an animated `color` style.
 */
const AnimatedHeroText = Animated.createAnimatedComponent(HeroText);
const [WheelPickerProvider, useWheelPicker] = createContext({
  name: 'WheelPickerContext',
  errorMessage: 'WheelPicker compound parts must be rendered inside <WheelPicker>.'
});
export { useWheelPicker };
const [WheelPickerItemProvider, useWheelPickerItem] = createContext({
  name: 'WheelPickerItemContext',
  errorMessage: 'WheelPicker.Item, WheelPicker.ItemLabel, and useWheelPickerItem must be rendered inside a row of <WheelPicker>.'
});
export { useWheelPickerItem };

// --------------------------------------------------

/**
 * Internal generic implementation of the wheel-picker root. Exposed via
 * the type-cast {@link WheelPickerRoot} below so the generic parameter
 * survives `forwardRef`.
 */
function WheelPickerRootInner(props, ref) {
  const {
    children,
    items,
    itemHeight = DEFAULT_ITEM_HEIGHT,
    visibleCount = DEFAULT_VISIBLE_COUNT,
    value: valueProp,
    defaultValue,
    name,
    isDisabled = false,
    className,
    classNames,
    styles: stylesProp,
    style,
    renderItem: renderItemProp,
    keyExtractor: keyExtractorProp,
    onValueChange,
    animation,
    ...restProps
  } = props;
  const groupContext = useOptionalWheelPickerGroup();
  const isInsideGroup = groupContext !== null && groupContext !== undefined && typeof name === 'string' && name.length > 0;
  const [internalValue, setInternalValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange
  });

  /**
   * When nested in a `WheelPickerGroup`, the wheel reads its value from
   * the group and writes through it; otherwise it uses the local
   * controllable state.
   */
  const groupValue = isInsideGroup && groupContext && typeof name === 'string' ? groupContext.getValue(name) : undefined;
  const effectiveValue = isInsideGroup ? groupValue : internalValue;
  const maxIndex = items.length - 1;
  /**
   * Inside a group, layout must come from the group so the shared
   * indicator and mask line up with every wheel's centered row. The
   * wheel's own `itemHeight` / `visibleCount` props are ignored in that
   * case — they belong on the group.
   */
  const resolvedItemHeight = isInsideGroup && groupContext ? groupContext.itemHeight : itemHeight > 0 ? itemHeight : DEFAULT_ITEM_HEIGHT;
  const resolvedVisibleCount = isInsideGroup && groupContext ? groupContext.visibleCount : visibleCount > 0 && visibleCount % 2 === 1 ? visibleCount : DEFAULT_VISIBLE_COUNT;
  const viewportHeight = resolvedVisibleCount * resolvedItemHeight;
  const verticalPadding = (viewportHeight - resolvedItemHeight) / 2;
  const selectedIndex = useMemo(() => {
    const found = getIndexForValue(items, effectiveValue);
    return found >= 0 ? found : 0;
  }, [items, effectiveValue]);

  /**
   * Freeze the initial scroll index at first mount so the FlatList's
   * `initialScrollIndex` and `scrollY` seed line up. Subsequent value
   * changes drive programmatic scrolls through the sync effect below.
   */
  const initialIndexRef = useRef(selectedIndex);
  const {
    container: containerSlot,
    contentContainer: contentContainerSlot
  } = wheelPickerClassNames.root({
    isDisabled
  });

  /**
   * When nested in a group, wheels default to `flex-1` so they distribute
   * the row evenly. Consumer `className` still wins because `tv()` runs
   * through `tailwind-merge`, so explicit widths (`w-[…]`) override.
   */
  const containerClassName = containerSlot({
    className: [isInsideGroup ? 'flex-1' : undefined, className, classNames?.container]
  });
  const contentContainerClassName = contentContainerSlot({
    className: classNames?.contentContainer
  });
  const listRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  /**
   * Separate from `isScrolling` because it must be `true` **only** during
   * a programmatic animated scroll (tap-to-focus, `ref.scrollToIndex`,
   * `ref.scrollToValue`). The wheel container flips `pointerEvents` to
   * `'none'` while this is true so the FlatList's native view stops
   * receiving touches — without that, the native `UIScrollView` /
   * `RecyclerView` would interpret any touch as "user wants to grab the
   * scroll" and cancel the in-flight animation mid-way (the reported
   * "scroll stops at random place" bug). Using `isScrolling` directly
   * here would also block user-initiated drag scrolling, which is not
   * what we want.
   */
  const [isProgrammaticScrolling, setIsProgrammaticScrolling] = useState(false);

  /**
   * Self-initiated scroll guard. Set when `scrollToIndex` /
   * `scrollToValue` kick off a programmatic scroll for ourselves —
   * remembered so the sync `useEffect` (which would otherwise re-fire
   * `scrollToOffset` on the same target as soon as `selectedIndex`
   * updates) skips that redundant scroll exactly once.
   *
   * Consumed on the next sync run, so subsequent external value
   * changes still scroll as normal.
   */
  const selfInitiatedScrollIndexRef = useRef(null);

  /**
   * Mirror of the render-scoped values that the stable callbacks below
   * read. Refreshed on every render but never recreated, so
   * `handleIndexChange` / `handleScrollingChange` — and therefore
   * `scrollToIndex` and the whole `contextValue` — keep a *stable*
   * identity across selection changes.
   *
   * Without this, `setInternalValue` (whose identity changes with the
   * controlled `value` prop) plus the group `groupContext` (recreated on
   * every group value change) would cascade a brand-new `scrollToIndex`
   * into the context on every value change. Because every visible
   * `WheelPicker.Item` / `WheelPicker.ItemLabel` consumes that context,
   * the whole viewport would re-render — instead of just the two rows
   * whose `isSelected` actually flipped.
   */
  const liveRef = useRef({
    items,
    isInsideGroup,
    groupContext,
    name,
    setInternalValue
  });
  liveRef.current = {
    items,
    isInsideGroup,
    groupContext,
    name,
    setInternalValue
  };
  const handleIndexChange = useCallback(index => {
    const {
      items: currentItems,
      isInsideGroup: insideGroup,
      groupContext: group,
      name: currentName,
      setInternalValue: commitValue
    } = liveRef.current;
    const item = currentItems[index];
    if (item === undefined) {
      return;
    }
    if (insideGroup && group && typeof currentName === 'string') {
      group.setValue(currentName, item.value);
      return;
    }
    commitValue(item.value);
  }, []);

  /**
   * Dedup repeated `true` / `true` (or `false` / `false`) calls so the
   * group's `activeScrollCount` doesn't drift when a programmatic
   * scroll started by `scrollToIndex` is followed by a user drag onto
   * the same wheel — both code paths funnel through here and we only
   * want one notify per actual transition.
   */
  const lastScrollingRef = useRef(false);
  /**
   * UI-thread-free mirror of the scroll-active state, read by
   * {@link WheelPickerItem} to gate tap-to-focus presses. Kept as a ref
   * (not context state) so toggling it never re-renders any row — only
   * the rows whose selection changed should ever re-render.
   */
  const isScrollingRef = useRef(false);
  const handleScrollingChange = useCallback(scrolling => {
    if (lastScrollingRef.current === scrolling) {
      return;
    }
    lastScrollingRef.current = scrolling;
    isScrollingRef.current = scrolling;
    setIsScrolling(scrolling);
    /**
     * Always reset the programmatic flag on a scroll-stop, regardless
     * of whether the stop came from natural momentum end or a user
     * interruption — restores `pointerEvents` so the wheel is
     * tappable / draggable again.
     */
    if (!scrolling) {
      setIsProgrammaticScrolling(false);
    }
    const {
      isInsideGroup: insideGroup,
      groupContext: group
    } = liveRef.current;
    if (insideGroup && group) {
      group.notifyScrollState(scrolling);
    }
  }, []);
  const {
    isAllAnimationsDisabled,
    isItemAnimationDisabled,
    resolvedAnimation,
    scrollY,
    scrollHandler
  } = useWheelPickerRootAnimation({
    animation,
    itemHeight: resolvedItemHeight,
    maxIndex,
    initialIndex: initialIndexRef.current,
    onIndexChange: handleIndexChange,
    onScrollingChange: handleScrollingChange
  });

  /**
   * Sync the FlatList scroll position to the (controlled or
   * scroll-derived) `selectedIndex`. Runs in three cases:
   * 1. External `value` change → `selectedIndex` updates.
   * 2. Local scroll session ends → `isScrolling` transitions to `false`
   *    so we can snap back to the controlled value when a parent rejects
   *    a scroll-derived selection.
   * 3. Data / layout changes (`items.length`, `itemHeight`).
   *
   * Skipped while the user is mid-scroll so a fling never gets cut short
   * by a re-rendered value prop. The group also broadcasts an
   * `activeScrollCount` so sibling-wheel scrolls don't trigger sync.
   */
  useEffect(() => {
    if (isScrolling) {
      return;
    }
    if (groupContext?.isAnyWheelScrolling?.()) {
      return;
    }
    if (selectedIndex < 0 || maxIndex < 0) {
      return;
    }
    /**
     * If the current `selectedIndex` change is the result of our own
     * `scrollToIndex` / `scrollToValue` call, the scroll has already
     * been kicked off — don't double-scroll to the same target.
     * Consume the ref so any subsequent external value change still
     * syncs normally.
     */
    if (selfInitiatedScrollIndexRef.current === selectedIndex) {
      selfInitiatedScrollIndexRef.current = null;
      return;
    }
    const list = listRef.current;
    if (!list) {
      return;
    }
    /**
     * Already at the target offset — skip the redundant
     * `scrollToOffset`. This avoids a chain of self-firing animations
     * after natural scrolls (FlatList already snapped to the row) and
     * after iOS overscroll bounces (the wheel returned to its
     * pre-bounce position with `selectedIndex` unchanged). Without
     * this guard, a no-op `scrollToOffset` still triggers a fresh
     * `onScroll` / `onMomentumEnd` cycle, doubling React renders and
     * dropping JS frames when overscrolling repeatedly at the edges.
     */
    const targetOffset = getScrollOffsetForIndex(selectedIndex, resolvedItemHeight);
    if (Math.abs(scrollY.get() - targetOffset) < 1) {
      return;
    }
    list.scrollToOffset({
      animated: true,
      offset: targetOffset
    });
  }, [selectedIndex, resolvedItemHeight, maxIndex, isScrolling, groupContext, scrollY]);
  const snapToOffsets = useMemo(() => items.map((_, index) => index * resolvedItemHeight), [items, resolvedItemHeight]);
  const getItemLayout = useCallback((_data, index) => ({
    length: resolvedItemHeight,
    offset: resolvedItemHeight * index,
    index
  }), [resolvedItemHeight]);
  const defaultKeyExtractor = useCallback((item, index) => {
    const v = item.value;
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
      return `${String(v)}:${index}`;
    }
    return String(index);
  }, []);
  const keyExtractor = keyExtractorProp ?? defaultKeyExtractor;
  const renderItem = useCallback(({
    item,
    index
  }) => /*#__PURE__*/_jsx(WheelPickerRow, {
    item: item,
    index: index,
    isSelected: index === selectedIndex,
    scrollY: scrollY,
    itemHeight: resolvedItemHeight,
    renderItemProp: renderItemProp
  }), [renderItemProp, resolvedItemHeight, scrollY, selectedIndex]);

  /**
   * Commit the value at `idx` and scroll the FlatList to it. Used by
   * `WheelPicker.Item.onPress` (tap-to-focus), the imperative
   * `ref.scrollToIndex`, and `ref.scrollToValue`.
   *
   * The value commit happens first (a single `onValueChange` fires for
   * the target) and the scroll handler stays silent during the
   * animation because `isUserScrolling` only flips `true` on user
   * touches. The self-initiated ref tells the sync effect that the
   * upcoming `selectedIndex` update is ours, so it doesn't re-trigger a
   * second `scrollToOffset` to the same row.
   */
  const scrollToIndex = useCallback(params => {
    const idx = clampIndex(params.index, maxIndex);
    const animated = params.animated ?? true;
    const targetOffset = getScrollOffsetForIndex(idx, resolvedItemHeight);
    /**
     * Already at the target offset — `scrollToOffset` would be a
     * no-op, which means no `onScroll` / `onMomentumEnd` ever fires
     * and the scroll-stop reset path is never reached. If we still
     * flipped `isProgrammaticScrolling` / `isScrolling` to `true`
     * here, they would stay `true` permanently and the container's
     * `pointerEvents="none"` would freeze the wheel forever (e.g.
     * tapping the already-selected center row). Commit the value
     * (idempotent when unchanged) and bail before touching the
     * scrolling flags.
     */
    if (Math.abs(scrollY.get() - targetOffset) < 1) {
      handleIndexChange(idx);
      return;
    }
    selfInitiatedScrollIndexRef.current = idx;
    handleIndexChange(idx);
    /**
     * For the animated path:
     * - `setIsProgrammaticScrolling(true)` flips `pointerEvents` on
     *   the wheel container to `'none'`, so the next render disables
     *   touches reaching the FlatList's native view. Without this,
     *   any incoming touch (a second tap, a drag) would cause the
     *   native scroll view to cancel the in-flight animation mid-way.
     * - `handleScrollingChange(true)` flips `isScrolling` so the
     *   per-row Pressable disables itself (defense in depth) and
     *   notifies the parent group, if any.
     */
    if (animated) {
      setIsProgrammaticScrolling(true);
      handleScrollingChange(true);
    }
    listRef.current?.scrollToOffset({
      animated,
      offset: targetOffset
    });
  }, [handleIndexChange, handleScrollingChange, maxIndex, resolvedItemHeight, scrollY]);
  const augmentedRef = useAugmentedRef({
    ref,
    methods: {
      scrollToIndex,
      scrollToValue: (val, options) => {
        const idx = getIndexForValue(items, val);
        if (idx < 0) {
          return;
        }
        scrollToIndex({
          index: idx,
          animated: options?.animated
        });
      }
    },
    deps: [items, scrollToIndex]
  });
  const animationSettingsContextValue = useMemo(() => ({
    isAllAnimationsDisabled
  }), [isAllAnimationsDisabled]);
  const contextValue = useMemo(() => ({
    itemHeight: resolvedItemHeight,
    visibleCount: resolvedVisibleCount,
    isDisabled,
    scrollY,
    isInsideGroup,
    resolvedAnimation,
    isItemAnimationDisabled,
    rootItemClassName: classNames?.item,
    rootItemStyle: stylesProp?.item,
    rootItemLabelClassName: classNames?.itemLabel,
    rootItemLabelStyle: stylesProp?.itemLabel,
    isScrollingRef,
    scrollToIndex
  }), [resolvedItemHeight, resolvedVisibleCount, isDisabled, scrollY, isInsideGroup, resolvedAnimation, isItemAnimationDisabled, classNames?.item, stylesProp?.item, classNames?.itemLabel, stylesProp?.itemLabel, isScrollingRef, scrollToIndex]);

  /**
   * When no children are provided, render a default indicator so the
   * picker is usable out of the box. Inside a group, skip the default
   * because the group owns the shared indicator overlay.
   */
  const overlayChildren = children !== undefined ? children : isInsideGroup ? null : /*#__PURE__*/_jsx(WheelPickerIndicator, {});
  return /*#__PURE__*/_jsx(AnimationSettingsProvider, {
    value: animationSettingsContextValue,
    children: /*#__PURE__*/_jsx(WheelPickerProvider, {
      value: contextValue,
      children: /*#__PURE__*/_jsxs(View, {
        ref: augmentedRef,
        className: containerClassName,
        style: [{
          height: viewportHeight
        }, stylesProp?.container, style],
        accessibilityRole: "adjustable",
        accessibilityState: {
          disabled: isDisabled
        },
        pointerEvents: isDisabled || isProgrammaticScrolling ? 'none' : 'auto',
        ...restProps,
        children: [/*#__PURE__*/_jsx(Animated.FlatList, {
          ref: listRef,
          data: items,
          renderItem: renderItem,
          keyExtractor: keyExtractor,
          getItemLayout: getItemLayout,
          snapToOffsets: snapToOffsets,
          decelerationRate: "fast",
          disableIntervalMomentum: Platform.OS === 'ios' ? true : false,
          showsVerticalScrollIndicator: false,
          scrollEnabled: !isDisabled,
          initialNumToRender: resolvedVisibleCount + 2,
          maxToRenderPerBatch: resolvedVisibleCount,
          windowSize: 3,
          removeClippedSubviews: false,
          contentContainerStyle: [{
            paddingVertical: verticalPadding
          }, stylesProp?.contentContainer],
          contentContainerClassName: contentContainerClassName,
          onScroll: scrollHandler,
          scrollEventThrottle: 16,
          initialScrollIndex: initialIndexRef.current >= 0 ? initialIndexRef.current : 0
        }), overlayChildren]
      })
    })
  });
}
const WheelPickerRoot = /*#__PURE__*/forwardRef(WheelPickerRootInner);

// --------------------------------------------------

/**
 * Props for {@link WheelPickerRow}.
 *
 * @template T - The value type stored on each option.
 */

/**
 * Internal per-row wrapper. Hosting one component per visible row lets
 * us call `useDerivedValue` to compute that row's `absDistance` shared
 * value, then expose it (and pass it to `renderItem`) so consumers can
 * drive their own `useAnimatedStyle` / `useAnimatedProps` from it.
 */
function WheelPickerRowInner(props) {
  const {
    item,
    index,
    isSelected,
    scrollY,
    itemHeight,
    renderItemProp
  } = props;
  const absDistance = useDerivedValue(() => {
    return Math.abs(index * itemHeight - scrollY.get()) / itemHeight;
  });

  /**
   * Upcast to the non-generic item-context shape. Safe because
   * `WheelPickerOption<T>` is structurally a `WheelPickerOption<unknown>`
   * for read access; the runtime object is identical.
   */
  const itemContextValue = useMemo(() => ({
    index,
    isSelected,
    item: item,
    absDistance
  }), [index, isSelected, item, absDistance]);
  const renderProps = {
    index,
    isSelected,
    item,
    itemHeight,
    scrollY,
    absDistance
  };
  const rowContent = renderItemProp ? renderItemProp(renderProps) : /*#__PURE__*/_jsx(WheelPickerItem, {});
  return /*#__PURE__*/_jsx(WheelPickerItemProvider, {
    value: itemContextValue,
    children: rowContent
  });
}

/**
 * Memoized per-row wrapper. The wheel's visual state (fade / scale /
 * label color) is driven entirely by the shared `scrollY` value on the
 * UI thread, so a React commit that only changes the selected value
 * must not force every visible row to re-render. With `memo`, the
 * shallow prop comparison bails out for every row except the two whose
 * `isSelected` boolean actually flipped (previously- and newly-selected
 * rows), keeping per-commit re-renders at O(1) instead of O(visible
 * rows). The cast preserves the generic call signature that `memo`
 * would otherwise erase.
 */
const WheelPickerRow = /*#__PURE__*/memo(WheelPickerRowInner);

// --------------------------------------------------

const WheelPickerItem = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    style,
    onPress,
    disabled,
    ...restProps
  } = props;
  const {
    item,
    index,
    absDistance
  } = useWheelPickerItem();
  const {
    itemHeight,
    resolvedAnimation,
    isItemAnimationDisabled,
    rootItemClassName,
    rootItemStyle,
    isDisabled: rootIsDisabled,
    isScrollingRef,
    scrollToIndex
  } = useWheelPicker();
  const itemClassName = wheelPickerClassNames.root().item({
    className: [rootItemClassName, className]
  });
  const {
    rItemStyle
  } = useWheelPickerItemAnimation({
    absDistance,
    isItemAnimationDisabled,
    resolvedAnimation
  });
  const resolvedChildren = children !== undefined ? children : /*#__PURE__*/_jsx(WheelPickerItemLabel, {
    children: item.label
  });

  /**
   * Tapping a row scrolls the wheel to focus it. The consumer's
   * `onPress` (if any) runs first so they can react to the press
   * before the wheel moves.
   *
   * A scroll-in-progress guard is read from the shared `isScrollingRef`
   * instead of a render-time flag: a tap that lands while a scroll is
   * still animating (a user drag's momentum, or the in-flight
   * programmatic scroll from a previous tap) is ignored, so it can't
   * re-target / cancel the active scroll. Reading the ref here — rather
   * than disabling the `Pressable` via context state — keeps the scroll
   * lifecycle from re-rendering every visible row.
   */
  const handlePress = useCallback(event => {
    if (isScrollingRef.current) {
      return;
    }
    onPress?.(event);
    scrollToIndex({
      animated: true,
      index
    });
  }, [onPress, scrollToIndex, index, isScrollingRef]);

  /**
   * Disable the press surface when the row itself is `disabled` or the
   * whole wheel is `isDisabled` via the root prop. The transient
   * scroll-in-progress case is handled inside {@link handlePress} via
   * `isScrollingRef`, so it never participates in this render-time flag.
   *
   * Other props (`hitSlop`, accessibility, etc.) still pass through.
   */
  const isPressDisabled = disabled === true || rootIsDisabled;
  return /*#__PURE__*/_jsx(AnimatedPressable, {
    ref: ref,
    className: itemClassName,
    style: [{
      height: itemHeight
    }, rItemStyle, rootItemStyle, style],
    accessibilityRole: "button",
    accessibilityLabel: item.label,
    accessibilityState: {
      disabled: isPressDisabled
    },
    disabled: isPressDisabled,
    onPress: handlePress,
    ...restProps,
    children: resolvedChildren
  });
});

// --------------------------------------------------

const WheelPickerItemLabel = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    className,
    style,
    ...restProps
  } = props;
  const {
    resolvedAnimation,
    isItemAnimationDisabled,
    rootItemLabelClassName,
    rootItemLabelStyle
  } = useWheelPicker();
  const {
    absDistance
  } = useWheelPickerItem();
  const labelClassName = wheelPickerClassNames.root().itemLabel({
    className: [rootItemLabelClassName, className]
  });
  const {
    rLabelStyle
  } = useWheelPickerItemLabelAnimation({
    absDistance,
    resolvedAnimation,
    isItemAnimationDisabled
  });
  return /*#__PURE__*/_jsx(AnimatedHeroText, {
    ref: ref,
    className: labelClassName,
    style: [rootItemLabelStyle, rLabelStyle, style],
    numberOfLines: 1,
    ...restProps
  });
});

// --------------------------------------------------

const WheelPickerIndicator = /*#__PURE__*/forwardRef((props, ref) => {
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
  } = useWheelPicker();
  const {
    wrapper: wrapperSlot,
    highlight: highlightSlot
  } = wheelPickerClassNames.indicator();
  const wrapperClassName = wrapperSlot({
    className: [className, classNames?.wrapper]
  });
  const highlightClassName = highlightSlot({
    className: classNames?.highlight
  });

  /**
   * Position the indicator at the visual center of the wheel viewport.
   * Computed inline so the indicator stays in sync if `itemHeight` /
   * `visibleCount` ever change at runtime.
   */
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

const WheelPickerMask = /*#__PURE__*/forwardRef((props, ref) => {
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
  } = useWheelPicker();
  const {
    top: topSlot,
    bottom: bottomSlot
  } = wheelPickerClassNames.mask();
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

WheelPickerRoot.displayName = DISPLAY_NAME.ROOT;
WheelPickerItem.displayName = DISPLAY_NAME.ITEM;
WheelPickerItemLabel.displayName = DISPLAY_NAME.ITEM_LABEL;
WheelPickerIndicator.displayName = DISPLAY_NAME.INDICATOR;
WheelPickerMask.displayName = DISPLAY_NAME.MASK;

/**
 * Compound `WheelPicker` component with sub-components.
 *
 * @component WheelPicker - Root container. Owns the controllable `value`,
 * the shared `scrollY` (UI thread), and the data-driven `Animated.FlatList`
 * that powers the wheel. Provides per-item animation context to children.
 *
 * @component WheelPicker.Item - Animated row container. Rendered
 * automatically by the default `renderItem`; reuse it inside a custom
 * `renderItem` to keep sizing and tap-to-focus. When no `children` are
 * passed, it auto-renders `WheelPicker.ItemLabel`.
 *
 * @component WheelPicker.ItemLabel - Default label primitive. Used by
 * `WheelPicker.Item`'s auto fallback and exposed for reuse inside custom
 * row content.
 *
 * @component WheelPicker.Indicator - Optional selection band rendered
 * absolutely at the center of the viewport. When the root has no compound
 * children, an indicator is rendered by default.
 *
 * @component WheelPicker.Mask - Optional top/bottom fade overlays that
 * soften the wheel into the surrounding background.
 *
 * Props flow from `WheelPicker` to its sub-components via
 * `WheelPickerContext` (`itemHeight`, `visibleCount`, `scrollY`,
 * animation config, disabled state, and `classNames` / `styles`
 * cascade).
 *
 */
const WheelPicker = Object.assign(WheelPickerRoot, {
  /** @optional Animated row container; renders default label when no children */
  Item: WheelPickerItem,
  /** @optional Label primitive reused by a custom `renderItem` */
  ItemLabel: WheelPickerItemLabel,
  /** @optional Selection band at the center of the wheel viewport */
  Indicator: WheelPickerIndicator,
  /** @optional Top / bottom fade overlays */
  Mask: WheelPickerMask
});
export default WheelPicker;