"use strict";

let VictoryNativePackage;
try {
  VictoryNativePackage = require('victory-native');
} catch (_error) {
  /* victory-native is an optional peer dependency */
}
export default VictoryNativePackage;