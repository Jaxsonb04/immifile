import type { ButtonRootProps } from 'heroui-native';
import type { PressableRef } from '../../helpers/internal/types';
/**
 * Visual style variants supported by {@link ToggleButton}.
 *
 * `default`  → opaque resting background (`bg-default`).
 * `ghost`    → transparent resting background.
 *
 * Both variants share the same selected appearance (`bg-accent-soft`).
 */
export type ToggleButtonVariant = 'default' | 'ghost';
/**
 * Props for the {@link ToggleButton} component.
 *
 * Inherits every prop of the underlying HeroUI Native `Button` except
 * `variant` (redefined as {@link ToggleButtonVariant}) and `feedbackVariant`
 * (owned by `ToggleButton`, which sets it based on group attachment).
 * The `animation` prop is forwarded as-is to the underlying `Button`.
 */
export interface ToggleButtonProps extends Omit<ButtonRootProps, 'variant' | 'feedbackVariant'> {
    /**
     * Unique identifier. Required when used inside `ToggleButtonGroup`.
     */
    id?: string;
    /**
     * Visual style variant.
     *
     * @default "default"
     */
    variant?: ToggleButtonVariant;
    /**
     * Controlled selected state.
     */
    isSelected?: boolean;
    /**
     * Default selected state (uncontrolled).
     *
     * @default false
     */
    defaultSelected?: boolean;
    /**
     * Handler called when selection changes.
     */
    onChange?: (isSelected: boolean) => void;
    /**
     * Override background color for the selected state. Must be a resolved
     * color string (e.g. from `useThemeColor`). Defaults to theme `accent-soft`.
     */
    selectedColor?: string;
    /**
     * Override background color for the unselected state. Must be a resolved
     * color string. Defaults to theme `default` (or `transparent` for `ghost`).
     */
    unselectedColor?: string;
}
/**
 * Ref type for the {@link ToggleButton} component.
 */
export type ToggleButtonRef = PressableRef;
//# sourceMappingURL=toggle-button.types.d.ts.map