"use strict";

import { createContext, useContext } from 'react';

/**
 * Context value shared by a {@link ToggleButton} with its descendants.
 * Allows consumers (e.g. icons or labels) to read the current toggle
 * state without prop drilling, replacing the legacy render-prop API.
 */

/**
 * React context propagating toggle state to descendants.
 * Set to `null` outside a {@link ToggleButton} so {@link useToggleButton}
 * can throw a meaningful error instead of yielding undefined values.
 */
export const ToggleButtonContext = /*#__PURE__*/createContext(null);

/**
 * Read the parent {@link ToggleButton} state.
 *
 * @throws Error when used outside a `ToggleButton`.
 */
export function useToggleButton() {
  const ctx = useContext(ToggleButtonContext);
  if (ctx === null) {
    throw new Error('useToggleButton must be used within a <ToggleButton> component.');
  }
  return ctx;
}