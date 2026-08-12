"use strict";

let InternationalizedDatePackage;
try {
  InternationalizedDatePackage = require('@internationalized/date');
} catch (_error) {
  /* @internationalized/date is an optional peer dependency */
}
export default InternationalizedDatePackage;