"use strict";

import { Button } from 'heroui-native/button';
import { forwardRef, useCallback, useContext, useMemo } from 'react';
import { useControllableState } from "../../helpers/internal/hooks/index.js";
import { ToggleButtonGroupContext } from "../toggle-button-group/toggle-button-group.context.js";
import { DISPLAY_NAME } from "./toggle-button.constants.js";
import { ToggleButtonContext, useToggleButton } from "./toggle-button.context.js";
import { toggleButtonClassNames } from "./toggle-button.styles.js";
import { jsx as _jsx } from "react/jsx-runtime";
// --------------------------------------------------

const ToggleButton = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    id,
    variant = 'default',
    size: sizeProp = 'md',
    isSelected: isSelectedProp,
    defaultSelected = false,
    isDisabled: isDisabledProp = false,
    onChange,
    selectedColor,
    unselectedColor,
    className,
    style,
    animation,
    onPress,
    ...restProps
  } = props;
  const groupCtx = useContext(ToggleButtonGroupContext);
  const inGroup = groupCtx !== null;
  const inAttachedGroup = inGroup && !groupCtx.isDetached;
  const resolvedSize = groupCtx?.size ?? sizeProp;
  const isDisabled = groupCtx?.isDisabled ?? isDisabledProp;
  const isGroupSelected = inGroup && id ? groupCtx.selectedKeys.has(id) : undefined;
  const [isSelected = false, setIsSelected] = useControllableState({
    prop: inGroup ? isGroupSelected : isSelectedProp,
    defaultProp: defaultSelected,
    onChange
  });
  const handlePress = useCallback(event => {
    if (inGroup && id) {
      groupCtx.onToggle(id);
    } else {
      setIsSelected(!isSelected);
    }
    if (typeof onPress === 'function') {
      onPress(event);
    }
  }, [inGroup, id, groupCtx, isSelected, setIsSelected, onPress]);
  const rootClassName = toggleButtonClassNames.root({
    isSelected,
    variant,
    inAttachedGroup,
    inGroup,
    groupFullWidth: groupCtx?.fullWidth ?? false,
    className
  });
  const overrideBackgroundColor = isSelected ? selectedColor : unselectedColor;
  const bgStyle = useMemo(() => overrideBackgroundColor === undefined ? undefined : {
    backgroundColor: overrideBackgroundColor
  }, [overrideBackgroundColor]);
  const buttonAnimation = inAttachedGroup ? {
    scale: false
  } : animation;
  const contextValue = useMemo(() => ({
    isSelected,
    isDisabled,
    size: resolvedSize,
    variant
  }), [isSelected, isDisabled, resolvedSize, variant]);
  return /*#__PURE__*/_jsx(ToggleButtonContext.Provider, {
    value: contextValue,
    children: /*#__PURE__*/_jsx(Button, {
      ref: ref,
      variant: "ghost",
      size: resolvedSize,
      feedbackVariant: inAttachedGroup ? 'scale' : 'scale-highlight',
      animation: buttonAnimation,
      isDisabled: isDisabled,
      className: rootClassName,
      style: [bgStyle, style],
      onPress: handlePress,
      ...restProps,
      children: children
    })
  });
});

// --------------------------------------------------

const ToggleButtonLabel = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    className,
    ...restProps
  } = props;
  const {
    isSelected
  } = useToggleButton();
  const labelClassName = toggleButtonClassNames.label({
    isSelected,
    className
  });
  return /*#__PURE__*/_jsx(Button.Label, {
    ref: ref,
    className: labelClassName,
    ...restProps
  });
});
ToggleButton.displayName = DISPLAY_NAME.ROOT;
ToggleButtonLabel.displayName = DISPLAY_NAME.LABEL;

/**
 * Compound `ToggleButton` with sub-components.
 *
 * @component ToggleButton - Root toggleable button. Wraps HeroUI Native's
 * `Button` and adds controllable selection state plus `ToggleButtonGroup`
 * integration. Reads `isSelected` and other state via {@link useToggleButton}
 * from descendants.
 *
 * @component ToggleButton.Label - Text label inside the toggle. Wraps
 * `Button.Label` and automatically applies selected/unselected text colors
 * via the `label` style recipe.
 */
const CompoundToggleButton = Object.assign(ToggleButton, {
  /** Toggle label — wraps {@link Button.Label} with selection-aware styles. */
  Label: ToggleButtonLabel
});
export default CompoundToggleButton;