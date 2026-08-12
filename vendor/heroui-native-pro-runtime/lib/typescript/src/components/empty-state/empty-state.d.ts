import { View } from 'react-native';
import type { EmptyStateContentProps, EmptyStateDescriptionProps, EmptyStateHeaderProps, EmptyStateMediaProps, EmptyStateRootProps, EmptyStateTitleProps } from './empty-state.types';
/**
 * Compound `EmptyState` component with optional media and actions.
 *
 * @component EmptyState - Root container for empty-state messaging and actions.
 * @component EmptyState.Header - Groups media, title, and description.
 * @component EmptyState.Media - Optional icon/avatar container.
 * @component EmptyState.Title - Primary heading text.
 * @component EmptyState.Description - Secondary supporting copy.
 * @component EmptyState.Content - Optional action area.
 *
 */
declare const EmptyState: import("react").ForwardRefExoticComponent<EmptyStateRootProps & import("react").RefAttributes<View>> & {
    /** @optional Header grouping block. */
    Header: import("react").ForwardRefExoticComponent<EmptyStateHeaderProps & import("react").RefAttributes<View>>;
    /** @optional Media container for icon or avatar content. */
    Media: import("react").ForwardRefExoticComponent<EmptyStateMediaProps & import("react").RefAttributes<View>>;
    /** @optional Primary heading text. */
    Title: import("react").ForwardRefExoticComponent<EmptyStateTitleProps & import("react").RefAttributes<import("react-native").Text>>;
    /** @optional Secondary description text. */
    Description: import("react").ForwardRefExoticComponent<EmptyStateDescriptionProps & import("react").RefAttributes<import("react-native").Text>>;
    /** @optional Action area below the header. */
    Content: import("react").ForwardRefExoticComponent<EmptyStateContentProps & import("react").RefAttributes<View>>;
};
export default EmptyState;
//# sourceMappingURL=empty-state.d.ts.map