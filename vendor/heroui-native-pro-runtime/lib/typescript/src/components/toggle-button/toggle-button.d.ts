import type { ButtonLabelProps } from 'heroui-native/button';
import type { ToggleButtonProps } from './toggle-button.types';
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
declare const CompoundToggleButton: import("react").ForwardRefExoticComponent<ToggleButtonProps & import("react").RefAttributes<import("react-native").View>> & {
    /** Toggle label — wraps {@link Button.Label} with selection-aware styles. */
    Label: import("react").ForwardRefExoticComponent<ButtonLabelProps & import("react").RefAttributes<import("react-native").Text>>;
};
export default CompoundToggleButton;
//# sourceMappingURL=toggle-button.d.ts.map