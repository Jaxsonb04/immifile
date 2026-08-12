import type { ButtonSize } from 'heroui-native/button';
import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';
import type { ViewRef } from '../../helpers/internal/types';
/**
 * Selection mode for the group.
 */
export type ToggleButtonGroupSelectionMode = 'single' | 'multiple';
/**
 * Layout orientation for the group.
 */
export type ToggleButtonGroupOrientation = 'horizontal' | 'vertical';
/**
 * Props for the ToggleButtonGroup root component.
 */
export interface ToggleButtonGroupRootProps extends ViewProps {
    /**
     * Child ToggleButtons.
     */
    children: ReactNode;
    /**
     * Whether one or multiple buttons can be selected.
     *
     * @default "single"
     */
    selectionMode?: ToggleButtonGroupSelectionMode;
    /**
     * Controlled selection state.
     */
    selectedKeys?: Iterable<string>;
    /**
     * Default selected keys (uncontrolled).
     */
    defaultSelectedKeys?: Iterable<string>;
    /**
     * Called when selection changes.
     */
    onSelectionChange?: (keys: Set<string>) => void;
    /**
     * Prevents clearing all selections.
     *
     * @default false
     */
    disallowEmptySelection?: boolean;
    /**
     * Layout direction.
     *
     * @default "horizontal"
     */
    orientation?: ToggleButtonGroupOrientation;
    /**
     * Size propagated to child ToggleButtons.
     *
     * @default "md"
     */
    size?: ButtonSize;
    /**
     * Whether buttons are visually separated with gaps.
     *
     * @default false
     */
    isDetached?: boolean;
    /**
     * Whether the group fills available width.
     *
     * @default false
     */
    fullWidth?: boolean;
    /**
     * Disables all buttons in the group.
     *
     * @default false
     */
    isDisabled?: boolean;
    /**
     * Additional CSS classes.
     */
    className?: string;
}
/**
 * Ref type for the ToggleButtonGroup root component.
 */
export type ToggleButtonGroupRootRef = ViewRef;
//# sourceMappingURL=toggle-button-group.types.d.ts.map