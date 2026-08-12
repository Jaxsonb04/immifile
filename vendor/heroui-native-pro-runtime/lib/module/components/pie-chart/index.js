"use strict";

import VictoryNativePackage from "../../optional/victory-native.js";
export { default as PieChart } from "./pie-chart.js";
export { pieChartClassNames } from "./pie-chart.styles.js";
const useSlicePath = (VictoryNativePackage ?? {}).useSlicePath;
const useSliceAngularInsetPath = (VictoryNativePackage ?? {}).useSliceAngularInsetPath;
export { useSliceAngularInsetPath, useSlicePath };