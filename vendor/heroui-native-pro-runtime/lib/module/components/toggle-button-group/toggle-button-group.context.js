"use strict";

import { createContext, useContext } from 'react';

/**
 * Context value shared by a {@link ToggleButtonGroup} with its descendants.
 * Allows consumers (e.g. a child `ToggleButton` or a custom item) to read
 * the current group state without prop drilling.
 */

/**
 * React context propagating group state to descendants.
 * Set to `null` outside a {@link ToggleButtonGroup} so {@link useToggleGroup}
 * can throw a meaningful error instead of yielding undefined values.
 */
export const ToggleButtonGroupContext = /*#__PURE__*/createContext(null);

/**
 * Read the parent {@link ToggleButtonGroup} state.
 *
 * @throws Error when used outside a `ToggleButtonGroup`.
 */
export function useToggleGroup() {
  const ctx = useContext(ToggleButtonGroupContext);
  if (ctx === null) {
    throw new Error('useToggleGroup must be used within a <ToggleButtonGroup> component.');
  }
  return ctx;
}