"use strict";

let ReactNativeSkiaPackage;
try {
  ReactNativeSkiaPackage = require('@shopify/react-native-skia');
} catch (_error) {
  /* @shopify/react-native-skia is an optional peer dependency */
}
export default ReactNativeSkiaPackage;