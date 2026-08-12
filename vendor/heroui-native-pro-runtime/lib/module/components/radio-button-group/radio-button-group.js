"use strict";

import { RadioGroup, useRadioGroup, useRadioGroupItem } from 'heroui-native';
import { forwardRef } from 'react';
import { View } from 'react-native';
import { DISPLAY_NAME } from "./radio-button-group.constants.js";
import { radioButtonGroupClassNames, radioButtonGroupStyleSheet } from "./radio-button-group.styles.js";
import { jsx as _jsx } from "react/jsx-runtime";
// --------------------------------------------------

export const useRadioButtonGroup = useRadioGroup;
export const useRadioButtonGroupItem = useRadioGroupItem;

// --------------------------------------------------

const RadioButtonGroupRoot = /*#__PURE__*/forwardRef((props, ref) => {
  return /*#__PURE__*/_jsx(RadioGroup, {
    ref: ref,
    ...props
  });
});

// --------------------------------------------------

const RadioButtonGroupItem = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    className,
    style,
    variant: variantProp,
    isDisabled: isDisabledProp,
    ...restProps
  } = props;
  const {
    value,
    variant: variantGroup,
    isDisabled: isDisabledGroup
  } = useRadioButtonGroup();
  const isSelected = value === restProps.value;
  const variant = variantProp ?? variantGroup ?? 'primary';
  const isDisabled = isDisabledProp ?? isDisabledGroup ?? false;
  const itemClassName = radioButtonGroupClassNames.item({
    className
  });
  return /*#__PURE__*/_jsx(RadioGroup.Item, {
    ref: ref,
    className: itemClassName,
    variant: variant === 'primary' ? 'secondary' : 'primary',
    style: typeof style === 'function' ? style : [radioButtonGroupStyleSheet.item, style],
    "data-selected": isSelected,
    "data-variant": variant,
    "data-disabled": isDisabled,
    ...restProps,
    children: children
  });
});

// --------------------------------------------------

const RadioButtonGroupItemContent = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    className,
    ...restProps
  } = props;
  const itemContentClassName = radioButtonGroupClassNames.itemContent({
    className
  });
  return /*#__PURE__*/_jsx(View, {
    ref: ref,
    className: itemContentClassName,
    ...restProps
  });
});

// --------------------------------------------------

RadioButtonGroupRoot.displayName = DISPLAY_NAME.ROOT;
RadioButtonGroupItem.displayName = DISPLAY_NAME.ITEM;
RadioButtonGroupItemContent.displayName = DISPLAY_NAME.ITEM_CONTENT;

/**
 * Compound RadioButtonGroup component with sub-components
 *
 * @component RadioButtonGroup - Wraps HeroUI Native `RadioGroup`. Manages the selected value and
 * optional group `variant`. Use `useRadioButtonGroup` as an alias for `useRadioGroup` when reading
 * group state from items.
 *
 * @component RadioButtonGroup.Item - Wraps `RadioGroup.Item` with `data-selected` and `data-variant`
 * for Tailwind and aligns item `variant` with the group for styling the radio row.
 *
 * @component RadioButtonGroup.ItemContent - Optional row container for label, description, and
 * `Radio` / `Radio.Indicator` (place the control inside the item as needed).
 *
 * Selection state flows from the root via RadioGroup context (`useRadioButtonGroup` /
 * `useRadioButtonGroupItem`).
 *
 */
const RadioButtonGroup = Object.assign(RadioButtonGroupRoot, {
  /** @optional Radio row; wraps `RadioGroup.Item` with selection and variant data attributes */
  Item: RadioButtonGroupItem,
  /** @optional Layout container for label and control within an item */
  ItemContent: RadioButtonGroupItemContent
});
export default RadioButtonGroup;