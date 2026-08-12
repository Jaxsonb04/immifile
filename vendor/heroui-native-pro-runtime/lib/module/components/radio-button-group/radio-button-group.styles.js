"use strict";

import { cn } from 'heroui-native/utils';
import { StyleSheet } from 'react-native';
import { tv } from 'tailwind-variants';
import { combineStyles } from "../../helpers/internal/utils/index.js";
const item = tv({
  base: cn('p-4 rounded-3xl outline-[1.5px] outline-transparent', 'data-[variant=primary]:bg-field data-[variant=primary]:border-field data-[variant=primary]:ios:shadow-field data-[variant=primary]:android:shadow-sm', 'data-[variant=secondary]:bg-default data-[variant=secondary]:border-default', 'data-[selected=true]:shadow-md data-[selected=true]:outline-accent data-[selected=true]:bg-accent-soft')
});
const itemContent = tv({
  base: 'flex-1'
});
export const radioButtonGroupClassNames = combineStyles({
  item,
  itemContent
});
export const radioButtonGroupStyleSheet = StyleSheet.create({
  item: {
    borderCurve: 'continuous'
  }
});