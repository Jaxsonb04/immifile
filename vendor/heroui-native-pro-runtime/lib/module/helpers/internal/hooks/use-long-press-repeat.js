"use strict";

import { useCallback, useEffect, useRef } from 'react';

/** Default delay in ms before long-press repeat begins */
const DEFAULT_LONG_PRESS_DELAY = 400;

/** Default interval in ms between repeated actions during long-press */
const DEFAULT_LONG_PRESS_INTERVAL = 80;

/**
 * Configuration options for the useLongPressRepeat hook
 */

/**
 * Hook for long-press repeat behaviour on pressable elements.
 * Fires the action immediately on press-in, then starts repeating after
 * `delay` ms at every `interval` ms. Uses refs so the interval always
 * reads the latest action/isDisabled values even when the closure was
 * captured earlier.
 *
 * @param options - Configuration for the long-press repeat behaviour
 * @returns Handlers to spread onto a Pressable (`onPressIn`, `onPressOut`)
 */
export function useLongPressRepeat({
  action,
  isDisabled,
  delay = DEFAULT_LONG_PRESS_DELAY,
  interval = DEFAULT_LONG_PRESS_INTERVAL
}) {
  const actionRef = useRef(action);
  const isDisabledRef = useRef(isDisabled);
  actionRef.current = action;
  isDisabledRef.current = isDisabled;
  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  /** Clears any active timeout and interval */
  const clear = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  const onPressIn = useCallback(() => {
    if (isDisabledRef.current) return;
    clear();
    actionRef.current();
    timerRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        actionRef.current();
      }, interval);
    }, delay);
  }, [clear, delay, interval]);
  const onPressOut = useCallback(() => {
    clear();
  }, [clear]);

  /** Clean up timers on unmount */
  useEffect(() => clear, [clear]);
  return {
    onPressIn,
    onPressOut
  };
}