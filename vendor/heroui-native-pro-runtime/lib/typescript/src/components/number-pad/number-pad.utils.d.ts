/**
 * Result of attempting to append a key to the current value.
 */
export interface AppendToValueResult {
    /** The resulting value after appending, or the original if blocked */
    value: string;
    /** Whether the append was blocked because maxLength was reached */
    isBlocked: boolean;
    /** Whether the resulting value equals maxLength */
    isComplete: boolean;
}
/**
 * Appends a key character to the current value, respecting maxLength.
 *
 * @param currentValue - Current pad value string
 * @param key - Character to append
 * @param maxLength - Optional maximum length cap
 * @returns Result with the new value and boundary flags
 */
export declare function appendToValue(currentValue: string, key: string, maxLength?: number): AppendToValueResult;
/**
 * Removes the last character from the current value.
 *
 * @param currentValue - Current pad value string
 * @returns Value with the last character removed
 */
export declare function deleteFromValue(currentValue: string): string;
//# sourceMappingURL=number-pad.utils.d.ts.map