import { View } from 'react-native';
import type { RatingContextValue, RatingItemProps, RatingRootProps } from './rating.types';
declare const useRating: () => RatingContextValue;
/**
 * Compound `Rating` component with sub-components.
 *
 * @component Rating - Star-rating input built on top of `heroui-native`'s
 * `RadioGroup`. The `value` is numeric — the integer part drives the
 * underlying radio selection while a fractional value is only honoured in
 * read-only mode and rendered as a partial fill via an absolutely-
 * positioned overlay that is clipped to the active percentage. Items are
 * auto-rendered from `1` to `maxValue` when no children are provided.
 *
 * @component Rating.Item - Individual rating item. Wraps
 * `RadioGroup.Item` with rating-aware state and renders the default icon
 * + partial overlay. Pass a render-function `children` to render a fully
 * custom indicator that still reflects `isActive` / `isPartial` /
 * `partialPercent` from the rating context.
 *
 * Props flow from `Rating` to its sub-components via context
 * (`value`, `maxValue`, `size`, `isReadOnly`, `isDisabled`, `icon`).
 *
 */
declare const Rating: import("react").ForwardRefExoticComponent<RatingRootProps & import("react").RefAttributes<View>> & {
    /** @optional Individual rating item with active / partial fill support */
    Item: import("react").ForwardRefExoticComponent<RatingItemProps & import("react").RefAttributes<View>>;
};
export default Rating;
export { useRating };
//# sourceMappingURL=rating.d.ts.map