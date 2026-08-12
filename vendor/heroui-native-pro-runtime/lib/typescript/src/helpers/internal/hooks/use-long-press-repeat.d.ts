/**
 * Configuration options for the useLongPressRepeat hook
 */
type UseLongPressRepeatOptions = {
    /** The action to invoke on each repeat tick */
    action: () => void;
    /** Whether the press interaction is disabled */
    isDisabled: boolean;
    /** Delay in ms before repeating starts (defaults to 400) */
    delay?: number;
    /** Interval in ms between repeated ticks (defaults to 80) */
    interval?: number;
};
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
export declare function useLongPressRepeat({ action, isDisabled, delay, interval, }: UseLongPressRepeatOptions): {
    onPressIn: () => void;
    onPressOut: () => void;
};
export {};
//# sourceMappingURL=use-long-press-repeat.d.ts.map