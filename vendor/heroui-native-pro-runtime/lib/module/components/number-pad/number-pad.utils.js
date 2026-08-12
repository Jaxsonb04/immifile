"use strict";

/**
 * Result of attempting to append a key to the current value.
 */

/**
 * Appends a key character to the current value, respecting maxLength.
 *
 * @param currentValue - Current pad value string
 * @param key - Character to append
 * @param maxLength - Optional maximum length cap
 * @returns Result with the new value and boundary flags
 */
export function appendToValue(currentValue, key, maxLength) {
  const nextValue = `${currentValue}${key}`;
  if (maxLength !== undefined && nextValue.length > maxLength) {
    return {
      value: currentValue,
      isBlocked: true,
      isComplete: currentValue.length >= maxLength
    };
  }
  return {
    value: nextValue,
    isBlocked: false,
    isComplete: maxLength !== undefined && nextValue.length >= maxLength
  };
}

/**
 * Removes the last character from the current value.
 *
 * @param currentValue - Current pad value string
 * @returns Value with the last character removed
 */
export function deleteFromValue(currentValue) {
  if (currentValue.length === 0) {
    return currentValue;
  }
  return currentValue.slice(0, -1);
}