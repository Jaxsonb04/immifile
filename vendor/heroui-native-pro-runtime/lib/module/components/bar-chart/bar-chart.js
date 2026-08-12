"use strict";

import { AnimationSettingsProvider, useAnimationSettings } from 'heroui-native/contexts';
import { Children, isValidElement, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';
import { BaseCartesianChart } from "../../helpers/internal/components/index.js";
import VictoryNativePackage from "../../optional/victory-native.js";
import { useBarChartRootAnimation } from "./bar-chart.animation.js";
import { DEFAULT_BAR_CHART_DOMAIN_PADDING, DEFAULT_BAR_COLOR_CLASSNAME, DEFAULT_BAR_ROUNDED_CORNERS, DISPLAY_NAME } from "./bar-chart.constants.js";
import barChartClassNames from "./bar-chart.styles.js";
import { jsx as _jsx } from "react/jsx-runtime";
// --------------------------------------------------

const {
  Bar,
  BarGroup,
  StackedBar,
  useBarGroupPaths
} = VictoryNativePackage ?? {};
const StyledBar = withUniwind(Bar);
const StyledBarGroupItem = withUniwind(BarGroup?.Bar);

// --------------------------------------------------

function BarChartRoot(props) {
  const {
    ref,
    wrapperClassName,
    animation,
    children,
    ...cartesianProps
  } = props;
  const {
    isAllAnimationsDisabled
  } = useBarChartRootAnimation({
    animation
  });
  const rootClassName = barChartClassNames.root({
    className: wrapperClassName
  });
  const animationSettingsContextValue = useMemo(() => ({
    isAllAnimationsDisabled
  }), [isAllAnimationsDisabled]);
  return /*#__PURE__*/_jsx(View, {
    className: rootClassName,
    children: /*#__PURE__*/_jsx(BaseCartesianChart, {
      ref: ref,
      domainPadding: DEFAULT_BAR_CHART_DOMAIN_PADDING,
      ...cartesianProps,
      children: args => /*#__PURE__*/_jsx(AnimationSettingsProvider, {
        value: animationSettingsContextValue,
        children: children(args)
      })
    })
  });
}

// --------------------------------------------------

function BarChartBar(props) {
  const {
    colorClassName = DEFAULT_BAR_COLOR_CLASSNAME,
    roundedCorners = DEFAULT_BAR_ROUNDED_CORNERS,
    animate,
    ...restProps
  } = props;
  const {
    isAllAnimationsDisabled
  } = useAnimationSettings();
  return /*#__PURE__*/_jsx(StyledBar, {
    colorClassName: colorClassName,
    roundedCorners: roundedCorners,
    animate: isAllAnimationsDisabled ? undefined : animate,
    ...restProps
  });
}

// --------------------------------------------------

/**
 * victory-native `BarGroup` only collects children where `child.type === BarGroup.Bar`. Wrapping
 * `BarGroup.Bar` with Uniwind replaces that reference, so the upstream group renders nothing. This
 * implementation mirrors `BarGroup` layout via {@link useBarGroupPaths} and renders themed items.
 *
 * Because the {@link BarChartBarGroupItem} component is never invoked as an element here, this
 * function reproduces its default `colorClassName` and `animate` cascade so that grouped items
 * honour the same theming and root `animation="disable-all"` contract as {@link BarChartBar}.
 */
function BarChartBarGroup({
  children,
  chartBounds,
  betweenGroupPadding = 0.25,
  withinGroupPadding = 0.25,
  roundedCorners,
  onBarSizeChange,
  barWidth: customBarWidth,
  barCount
}) {
  const {
    isAllAnimationsDisabled
  } = useAnimationSettings();
  const bars = useMemo(() => {
    const list = [];
    Children.forEach(children, child => {
      if (/*#__PURE__*/isValidElement(child)) {
        const itemProps = child.props;
        if (Array.isArray(itemProps.points)) {
          list.push(itemProps);
        }
      }
    });
    return list;
  }, [children]);
  const {
    paths,
    barWidth,
    groupWidth,
    gapWidth
  } = useBarGroupPaths(bars.map(bar => bar.points), chartBounds, betweenGroupPadding, withinGroupPadding, roundedCorners, customBarWidth, barCount);
  useEffect(() => {
    onBarSizeChange?.({
      barWidth,
      groupWidth,
      gapWidth
    });
  }, [barWidth, gapWidth, groupWidth, onBarSizeChange]);
  const firstBar = bars[0];
  if (!firstBar) {
    return null;
  }
  return bars.map((seriesProps, index) => {
    const path = paths[index];
    if (!path) {
      return null;
    }
    const {
      colorClassName = DEFAULT_BAR_COLOR_CLASSNAME,
      animate,
      ...restSeriesProps
    } = seriesProps;
    const itemWithPath = {
      ...restSeriesProps,
      colorClassName,
      animate: isAllAnimationsDisabled ? undefined : animate,
      __path: path
    };
    return /*#__PURE__*/_jsx(StyledBarGroupItem, {
      ...itemWithPath
    }, `bar-group-series-${String(index)}`);
  });
}

// --------------------------------------------------

function BarChartBarGroupItem(props) {
  const {
    colorClassName = DEFAULT_BAR_COLOR_CLASSNAME,
    animate,
    ...restProps
  } = props;
  const {
    isAllAnimationsDisabled
  } = useAnimationSettings();
  return /*#__PURE__*/_jsx(StyledBarGroupItem, {
    colorClassName: colorClassName,
    animate: isAllAnimationsDisabled ? undefined : animate,
    ...restProps
  });
}

// --------------------------------------------------

function BarChartStackedBar(props) {
  const {
    animate,
    ...restProps
  } = props;
  const {
    isAllAnimationsDisabled
  } = useAnimationSettings();
  return /*#__PURE__*/_jsx(StackedBar, {
    animate: isAllAnimationsDisabled ? undefined : animate,
    ...restProps
  });
}

// --------------------------------------------------

BarChartRoot.displayName = DISPLAY_NAME.ROOT;
BarChartBar.displayName = DISPLAY_NAME.BAR;
BarChartBarGroup.displayName = DISPLAY_NAME.BAR_GROUP;
BarChartBarGroupItem.displayName = DISPLAY_NAME.BAR_GROUP_ITEM;
BarChartStackedBar.displayName = DISPLAY_NAME.STACKED_BAR;

// --------------------------------------------------

/**
 * Compound `BarChart` wrapping victory-native `CartesianChart` with a themed outer `View`.
 *
 * Provides Uniwind-styled fills for single and grouped bars, themed default `domainPadding`, and
 * cascaded `"disable-all"` via {@link AnimationSettingsProvider} for any child that uses
 * victory-native's `animate` prop.
 *
 * @component BarChart — Renders `CartesianChart` inside a full-width `View`. Pass chart height on
 * `wrapperClassName` (for example `h-52`). Forward `ref` to access the chart handle. Accepts an
 * `animation` prop typed as {@link BarChartRootAnimation} for cascading `"disable-all"` to animated
 * compound parts.
 *
 * @component BarChart.Bar — Themed Skia bar series. Defaults `colorClassName` to `accent-chart-3`
 * and `roundedCorners` to small top radii (`topLeft`/`topRight` of `4`). Respects cascaded
 * `isAllAnimationsDisabled`: when disabled at the root, the `animate` prop is dropped.
 *
 * @component BarChart.BarGroup — Clustered bars for multiple series per category. Defaults
 * `betweenGroupPadding` and `withinGroupPadding` to `0.25`.
 *
 * @component BarChart.BarGroupItem — One series inside `BarChart.BarGroup`; Uniwind-styled like
 * `BarChart.Bar` with the same `colorClassName` default and `animate` cascade.
 *
 * @component BarChart.StackedBar — Stacked columns from an ordered `points` array. Gates `animate`
 * through the same cascade as the other parts. For correct stacking, callers typically set
 * `domain={{ y: [0, maxStackSum] }}` on the root when auto-domain is insufficient.
 */
const BarChart = Object.assign(BarChartRoot, {
  /** Theme-styled single-series bars; uses Uniwind `colorClassName` for fill color. */
  Bar: BarChartBar,
  /** Grouped (clustered) bars — compose with {@link BarChart.BarGroupItem}. */
  BarGroup: BarChartBarGroup,
  /** One bar series inside {@link BarChart.BarGroup}. */
  BarGroupItem: BarChartBarGroupItem,
  /** Stacked bars across multiple `PointsArray` entries (order matches stack bottom to top). */
  StackedBar: BarChartStackedBar
});
export default BarChart;