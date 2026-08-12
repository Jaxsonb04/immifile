"use strict";

import { forwardRef, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useControllableState } from "../../helpers/internal/hooks/index.js";
import { DISPLAY_NAME } from "./toggle-button-group.constants.js";
import { ToggleButtonGroupContext } from "./toggle-button-group.context.js";
import { toggleButtonGroupClassNames, toggleButtonGroupStyleSheet } from "./toggle-button-group.styles.js";
import { jsx as _jsx } from "react/jsx-runtime";
// --------------------------------------------------

function toSet(value) {
  if (!value) return new Set();
  return value instanceof Set ? value : new Set(value);
}

// --------------------------------------------------

const ToggleButtonGroupRoot = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    children,
    selectionMode = 'single',
    selectedKeys: selectedKeysProp,
    defaultSelectedKeys,
    onSelectionChange,
    disallowEmptySelection = false,
    orientation = 'horizontal',
    size = 'md',
    isDetached = false,
    fullWidth = false,
    isDisabled = false,
    className,
    style,
    ...restProps
  } = props;
  const [selectedKeys = new Set(), setSelectedKeys] = useControllableState({
    prop: selectedKeysProp ? toSet(selectedKeysProp) : undefined,
    defaultProp: toSet(defaultSelectedKeys),
    onChange: onSelectionChange
  });
  const handleToggle = useCallback(key => {
    setSelectedKeys(prev => {
      const current = prev ?? new Set();
      if (selectionMode === 'single') {
        if (current.has(key)) {
          return disallowEmptySelection ? current : new Set();
        }
        return new Set([key]);
      }
      const next = new Set(current);
      if (next.has(key)) {
        if (disallowEmptySelection && next.size === 1) {
          return next;
        }
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, [selectionMode, disallowEmptySelection, setSelectedKeys]);
  const rootClassName = toggleButtonGroupClassNames.root({
    orientation,
    isDetached,
    fullWidth,
    isDisabled,
    className
  });
  const contextValue = useMemo(() => ({
    selectedKeys,
    onToggle: handleToggle,
    size,
    orientation,
    isDetached,
    fullWidth,
    isDisabled
  }), [selectedKeys, handleToggle, size, orientation, isDetached, fullWidth, isDisabled]);
  return /*#__PURE__*/_jsx(ToggleButtonGroupContext.Provider, {
    value: contextValue,
    children: /*#__PURE__*/_jsx(View, {
      ref: ref,
      className: rootClassName,
      style: [isDetached ? undefined : toggleButtonGroupStyleSheet.root, style],
      accessibilityRole: "toolbar",
      ...restProps,
      children: children
    })
  });
});

// --------------------------------------------------

ToggleButtonGroupRoot.displayName = DISPLAY_NAME;

/**
 * `ToggleButtonGroup` — groups multiple `ToggleButton`s into a unified control
 * with single or multiple selection. Manages selection state via context so
 * child `ToggleButton`s automatically participate. Supports horizontal /
 * vertical orientation, detached mode, and full-width layout.
 *
 * Props flow from `ToggleButtonGroup` to `ToggleButton`s via context
 * (`selectedKeys`, `onToggle`, `size`, `orientation`, `isDetached`,
 * `fullWidth`, `isDisabled`).
 *
 */
export default ToggleButtonGroupRoot;