"use strict";

import VictoryNativePackage from "../../optional/victory-native.js";
export { default as LineChart } from "./line-chart.js";
export { lineChartClassNames } from "./line-chart.styles.js";
const useLinePath = (VictoryNativePackage ?? {}).useLinePath;
export { useLinePath };