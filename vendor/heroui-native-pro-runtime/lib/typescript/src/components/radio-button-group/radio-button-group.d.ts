import { View } from 'react-native';
import type { UseRadioButtonGroupItemReturn, UseRadioButtonGroupReturn } from './radio-button-group.types';
export declare const useRadioButtonGroup: () => UseRadioButtonGroupReturn;
export declare const useRadioButtonGroupItem: () => UseRadioButtonGroupItemReturn;
/**
 * Compound RadioButtonGroup component with sub-components
 *
 * @component RadioButtonGroup - Wraps HeroUI Native `RadioGroup`. Manages the selected value and
 * optional group `variant`. Use `useRadioButtonGroup` as an alias for `useRadioGroup` when reading
 * group state from items.
 *
 * @component RadioButtonGroup.Item - Wraps `RadioGroup.Item` with `data-selected` and `data-variant`
 * for Tailwind and aligns item `variant` with the group for styling the radio row.
 *
 * @component RadioButtonGroup.ItemContent - Optional row container for label, description, and
 * `Radio` / `Radio.Indicator` (place the control inside the item as needed).
 *
 * Selection state flows from the root via RadioGroup context (`useRadioButtonGroup` /
 * `useRadioButtonGroupItem`).
 *
 */
declare const RadioButtonGroup: import("react").ForwardRefExoticComponent<import("heroui-native").RadioGroupProps & import("react").RefAttributes<View>> & {
    /** @optional Radio row; wraps `RadioGroup.Item` with selection and variant data attributes */
    Item: import("react").ForwardRefExoticComponent<import("heroui-native").RadioGroupItemProps & import("react").RefAttributes<View>>;
    /** @optional Layout container for label and control within an item */
    ItemContent: import("react").ForwardRefExoticComponent<import("react-native").ViewProps & {
        className?: string;
    } & import("react").RefAttributes<View>>;
};
export default RadioButtonGroup;
//# sourceMappingURL=radio-button-group.d.ts.map