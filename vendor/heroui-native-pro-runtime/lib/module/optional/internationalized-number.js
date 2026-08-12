"use strict";

let InternationalizedNumberPackage;
try {
  InternationalizedNumberPackage = require('@internationalized/number');
} catch (_error) {
  /* @internationalized/number is an optional peer dependency */
}
export default InternationalizedNumberPackage;