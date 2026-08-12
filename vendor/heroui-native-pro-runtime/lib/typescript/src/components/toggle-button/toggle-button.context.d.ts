import type { ButtonSize } from 'heroui-native/button';
import type { ToggleButtonVariant } from './toggle-button.types';
/**
 * Context value shared by a {@link ToggleButton} with its descendants.
 * Allows consumers (e.g. icons or labels) to read the current toggle
 * state without prop drilling, replacing the legacy render-prop API.
 */
export interface ToggleButtonContextValue {
    /** Whether the button is currently selected. */
    isSelected: boolean;
    /** Whether the button is currently disabled. */
    isDisabled: boolean;
    /** Resolved size token. */
    size: ButtonSize;
    /** Resolved visual variant. */
    variant: ToggleButtonVariant;
}
/**
 * React context propagating toggle state to descendants.
 * Set to `null` outside a {@link ToggleButton} so {@link useToggleButton}
 * can throw a meaningful error instead of yielding undefined values.
 */
export declare const ToggleButtonContext: import("react").Context<ToggleButtonContextValue | null>;
/**
 * Read the parent {@link ToggleButton} state.
 *
 * @throws Error when used outside a `ToggleButton`.
 */
export declare function useToggleButton(): ToggleButtonContextValue;
//# sourceMappingURL=toggle-button.context.d.ts.map