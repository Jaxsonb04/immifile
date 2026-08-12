"use strict";

import VictoryNativePackage from "../../optional/victory-native.js";
export { default as AreaChart } from "./area-chart.js";
export { areaChartClassNames } from "./area-chart.styles.js";
const useAreaPath = (VictoryNativePackage ?? {}).useAreaPath;
const useStackedAreaPaths = (VictoryNativePackage ?? {}).useStackedAreaPaths;
export { useAreaPath, useStackedAreaPaths };