"use strict";

import VictoryNativePackage from "../../optional/victory-native.js";
export { default as BarChart } from "./bar-chart.js";
export { barChartClassNames } from "./bar-chart.styles.js";
const useBarPath = (VictoryNativePackage ?? {}).useBarPath;
const useBarGroupPaths = (VictoryNativePackage ?? {}).useBarGroupPaths;
const useStackedBarPaths = (VictoryNativePackage ?? {}).useStackedBarPaths;
export { useBarGroupPaths, useBarPath, useStackedBarPaths };