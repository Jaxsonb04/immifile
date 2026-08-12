import type { SvgProps } from 'react-native-svg';
/**
 * Props for the built-in {@link RatingStarIcon} and any custom SVG icon a
 * consumer wants to plug into {@link Rating}. Shaped after the icon props
 * used across other compound components so they compose cleanly.
 */
export interface RatingStarIconProps extends SvgProps {
    /**
     * Icon size in pixels. The default star uses a square aspect ratio.
     *
     * @default 24
     */
    size?: number;
    /**
     * Icon fill color.
     *
     * @default "currentColor"
     */
    color?: string;
    /**
     * ClassName prop for color (mapped to `accentColor` via `withUniwind`).
     */
    colorClassName?: string;
}
/**
 * Default star icon for {@link Rating}. Wrapped with `withUniwind` so the
 * fill color can be driven from a Tailwind class (e.g.
 * `colorClassName="accent-warning"`).
 */
export declare const RatingStarIcon: (props: {
    readonly colorClassName?: string | undefined;
} & RatingStarIconProps) => React.ReactNode;
//# sourceMappingURL=rating.icons.d.ts.map