"use strict";

import { StyleSheet } from 'react-native';
import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";
const root = tv({
  base: ['flex-row items-center', 'data-[size=sm]:gap-2', 'data-[size=md]:gap-2.5', 'data-[size=lg]:gap-3', 'data-[disabled=true]:opacity-disabled']
});
const item = tv({
  base: 'items-center justify-center'
});
const iconWrapper = tv({
  base: 'items-center justify-center'
});
const iconOverlay = tv({
  base: 'absolute inset-y-0 left-0 items-start justify-center overflow-hidden'
});
export const ratingClassNames = combineStyles({
  root,
  item,
  iconWrapper,
  iconOverlay
});
export const ratingStyleSheet = StyleSheet.create({
  itemPressed: {
    transform: [{
      scale: 0.9
    }]
  }
});